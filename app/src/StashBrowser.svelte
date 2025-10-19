<script>
    import Konva from "konva";
    import { onDestroy, onMount } from "svelte";
    import { base } from "$app/paths";
    import { LEGION_COLORS, LEGION_ABBREV, LEGION_COLORS_DESAT, MF_MOD_ABBREVIATIONS } from "./drawingConstants";
    import { Pointer } from "lucide-svelte";
    import { bulk_result, cells_per_side } from "./store";
    import { isBright } from "$lib/utils";
    import {
        clearSelection,
        forceHidden,
        stashMetadata,
        bulkSelectedJewel
    } from "./resultsBrowserStore";
    import { searchDB } from "$lib/api";
    import { getBreakpoint } from "$lib/breakpoints";
    import { SBTooltip } from "$lib/tooltip";
    import { mode } from "mode-watcher";
    import { tick } from "svelte";

    const ZOOM_SCALE = 1.15;

    // Konva.showWarnings = false;
    let stage = null;
    let container;
    let observer;
    let bp;

    function selfCenter(el) {
        el.offsetX(el.width() / 2);
        el.offsetY(el.height() / 2);
    }

    function stageCenterX(el) {
        el.offsetX(el.width() / 2)
        el.x(stage.width() / 2)
    }

    function resizeStage() {
        if (!container || !stage) return;
        const { width, height } = container.getBoundingClientRect();

        try {
            if (stage.width() !== width) {
                // see if we need a new breakpoint
                const newBreakpoint = getBreakpoint(width)
                if (newBreakpoint.name !== bp.name) {
                    console.log('new breakpoint: ' + newBreakpoint.name)
                    bp = newBreakpoint
                    drawStash()
                }
            }
        } catch (e) {
            return;
        }
    }

    function drawStash() {

        stage = new Konva.Stage({
            container: "stashContainer",
            width: bp.stageW,
            height: bp.stageH,
        });

        const baseLayer = new Konva.Layer({ name: "base" }); // backdrop
        const frameLayer = new Konva.Layer({ name: 'frame' }); // tab label and frame
        frameLayer.offsetY(-bp.stageMargin)

        // draw the 'frame'
        const tabLabelText = new Konva.Text({
            x: 0,
            y: -bp.stageMargin + bp.stroke,
            text: $stashMetadata.name,
            fill: isBright($stashMetadata.color) ? "black" : "white",
            fontFamily: "Fontin-Regular",
            fontSize: bp.tabLabelFontSize,
            align: "center",
            preventDefault: false
        });

        stageCenterX(tabLabelText);

        const tabLabelHeight = tabLabelText.height() + 1.5 * bp.stroke
        const tabLabelRect = new Konva.Rect({
            x: 0,
            y: -bp.stageMargin,
            height: tabLabelHeight,
            width: tabLabelText.width() + 2 * bp.textMargin,
            fill: $stashMetadata.color,
            cornerRadius: [2 * bp.borderRadius, 2 * bp.borderRadius, 0, 0],
            preventDefault: false
        });
        stageCenterX(tabLabelRect)

        const tabLabelStashFrame = new Konva.Rect({
            x: 0,
            y: tabLabelHeight,
            width: bp.stageW - 2 * bp.stageMargin - 2 * bp.stroke,
            height: bp.stageW - 2 * bp.stageMargin - 2 * bp.stroke,
            // height: bp.stageH - tabLabelHeight - bp.stroke,
            stroke: $stashMetadata.color,
            strokeWidth: bp.stroke * 2,
            cornerRadius: [bp.borderRadius, bp.borderRadius, bp.borderRadius, bp.borderRadius],
            preventDefault: false
        });

        stageCenterX(tabLabelStashFrame)

        frameLayer.add(tabLabelStashFrame);
        frameLayer.add(tabLabelRect);
        frameLayer.add(tabLabelText);

        const backdropFill = mode.current === "dark" ? "#333333" : "#999999";
        // let backdropFill =
        //     mode.current === "dark" ? "hsl(var(--inset))" : "hsl(var(--inset))";
        let backdropOpacity = mode.current === "dark" ? 0.5 : 0.7;
        const backdrop = new Konva.Rect({
            x: 0,
            y: 0,
            width: tabLabelStashFrame.width(),
            height: tabLabelStashFrame.width(),
            fill: backdropFill,
            opacity: backdropOpacity,
            cornerRadius: [bp.borderRadius, bp.borderRadius, bp.borderRadius, bp.borderRadius],
            preventDefault: false
        });
        selfCenter(backdrop)
        baseLayer.offsetX(-bp.stageW / 2);
        baseLayer.offsetY(- (tabLabelStashFrame.width() / 2) - tabLabelHeight);

        function borderCrop (ctx) {
            ctx.roundRect(
                    0,
                    0,
                    tabLabelStashFrame.width(),
                    tabLabelStashFrame.width(),
                    [bp.borderRadius, bp.borderRadius, bp.borderRadius, bp.borderRadius]
                )
        }
        const allTilesGroup = new Konva.Group({
            clipFunc: borderCrop
        });
        const highlightTileGroup = new Konva.Group({
            clipFunc: borderCrop
        });

        const tileTargetsGroup = new Konva.Group()
        const gridGroup = new Konva.Group();

        const zoomTileLayer = new Konva.Layer({name: 'zoom'});
        zoomTileLayer.offsetY(-tabLabelHeight)

        const mouseoverLayer = new Konva.Layer({ name: "mouseover" });
        mouseoverLayer.offsetX(-bp.stroke)
        mouseoverLayer.offsetY(-tabLabelHeight);

        baseLayer.add(backdrop);

        function alignWithBackdrop(el) {
            if (el) {
                el.offsetX(backdrop.width() / 2)
                el.offsetY((backdrop.height() / 2))
            }
        }

        // draw the grid lines
        const gridColor = mode.current === "dark" ? "#999999" : "#CCCCCC";
        const cellSize = backdrop.width() / $cells_per_side;

        for (let i = 1; i < $cells_per_side; i++) {
            const lineLat = new Konva.Line({
                stroke: gridColor,
                strokeWidth: bp.stroke,
                points: [0, i * cellSize, backdrop.width(), i * cellSize],
                preventDefault: false
            });

            const lineLong = new Konva.Line({
                stroke: gridColor,
                strokeWidth: bp.stroke,
                points: [i * cellSize, 0, i * cellSize, backdrop.height()],
                preventDefault: false
            });

            gridGroup.add(lineLat);
            gridGroup.add(lineLong);
        }
        alignWithBackdrop(gridGroup)
        baseLayer.add(gridGroup)

        const tooltip = new SBTooltip(bp)
        baseLayer.add(tooltip.group);
        stage.add(baseLayer);

        let selectedTile = null;
        let selectedNumHits = null

        function updateSelectedTile (t, h) {
            // recolor to purple with white text

            t.oldFill = t.fill()
            t.fill('#5a00b3') // 'legion purple'
            h.fill('white')

            if (selectedTile && selectedNumHits) {
                selectedTile.fill(selectedTile.oldFill)
                selectedNumHits.fill('black')
            }

            selectedTile = t
            selectedNumHits = h
        }

        $bulk_result.forEach((r) => {
            const tile = new Konva.Rect({
                name: 'tile',
                x: r.x * cellSize + cellSize / 2,
                y: r.y * cellSize + cellSize / 2,
                width: cellSize,
                height: cellSize,
                fill: LEGION_COLORS.get(r.jewel_type),
                stroke: gridColor,
                strokeWidth: bp.stroke,
            });

            let numHitsFontSize = tile.height()
            const digits = r.seed_match.toString().length
            if (digits == 2) {
                numHitsFontSize = numHitsFontSize * 0.8;
            } else if (digits == 3) {
                numHitsFontSize = numHitsFontSize * 0.6;
            }
            // how many seed hits this jewel had
            const numHits = new Konva.Text({
                name: 'numHits',
                x: r.x * cellSize + cellSize / 2,
                y: r.y * cellSize + cellSize / 2,
                text: r.seed_match,
                fill: r.seed_match > 0 ? "black" : "#333333",
                fontSize: numHitsFontSize,
                fontFamily: "Fontin, Fontin-Regular",
                align: "center",
            });

            const tileTarget = new Konva.Rect({
                x: r.x * cellSize + cellSize / 2,
                y: r.y * cellSize + cellSize / 2,
                width: cellSize,
                height: cellSize,
                fill: LEGION_COLORS.get(r.jewel_type),
                opacity: 0,
            });

            if (r.seed_match === 0) {
                tile.opacity(0.5);
                tile.preventDefault(false)
                tileTarget.preventDefault(false)
            } else {

                function drawTooltip() {
                    try {
                        tooltip.formatText(bp, r)
                        tooltip.updatePosition(bp, stage, tabLabelHeight, backdrop)
                        tooltip.group.show();
                    } catch (e) {
                        console.log(e)
                        return;
                    }
                }

                const maxAnimTime = 1
                let zoomInStart = null
                let zoomOutStart = null
                const jewelMouseoverZoomIn = new Konva.Animation(function (
                    frame,
                ) {
                    if (!zoomInStart) zoomInStart = frame.time

                    tile.stroke(LEGION_COLORS.get(r.jewel_type))
                    tile.moveTo(highlightTileGroup);
                    numHits.moveTo(highlightTileGroup);
                    const scale = ZOOM_SCALE;
                    tile.scale({ x: scale, y: scale });
                    numHits.scale({ x: scale, y: scale });
                    highlightTileGroup.moveToTop()
                    drawTooltip();

                    if (frame.time - zoomInStart >= maxAnimTime) {
                        jewelMouseoverZoomIn.stop()
                    }
                });

                const jewelMouseoverZoomOut = new Konva.Animation(function (
                    frame,
                ) {
                    if (!zoomOutStart) zoomOutStart = frame.time

                    tile.stroke(gridColor)
                    tile.moveTo(allTilesGroup);
                    numHits.moveTo(allTilesGroup);
                    const scale = 1;
                    tile.scale({ x: scale, y: scale });
                    numHits.scale({ x: scale, y: scale });
                    tooltip.group.hide();

                    if (frame.time - zoomOutStart >= maxAnimTime) {
                        jewelMouseoverZoomOut.stop()
                    }
                });

                tileTarget.on("mousemove", function (e) {
                    e.target.getStage().container().style.cursor = "pointer";
                    jewelMouseoverZoomOut.stop();
                    jewelMouseoverZoomIn.start();
                });
                tileTarget.on("mouseout", function (e) {
                    e.target.getStage().container().style.cursor = "default";
                    jewelMouseoverZoomOut.start();
                    jewelMouseoverZoomIn.stop();
                });

                tileTarget.on("click", function (e) {
                    forceHidden.set(false);
                    clearSelection();
                    updateSelectedTile(tile, numHits)
                    searchDB(r);
                });

                tileTarget.on("tap", async function (e) {
                    forceHidden.set(false);
                    clearSelection();
                    updateSelectedTile(tile, numHits)
                    await searchDB(r);
                    await tick();
                    document.getElementById('resultsScrollTarget').scrollIntoView({ block: 'end', behavior: 'smooth' });
                });
            }

            selfCenter(tile)
            selfCenter(tileTarget)
            selfCenter(numHits)

            allTilesGroup.add(tile);
            allTilesGroup.add(numHits);
            tileTargetsGroup.add(tileTarget)
        });

        alignWithBackdrop(tooltip.group)
        alignWithBackdrop(allTilesGroup)
        alignWithBackdrop(highlightTileGroup)

        baseLayer.add(highlightTileGroup)
        alignWithBackdrop(zoomTileLayer)

        baseLayer.add(allTilesGroup)
        mouseoverLayer.add(tileTargetsGroup)

        stage.add(baseLayer);
        stage.add(zoomTileLayer);
        stage.add(frameLayer);
        stage.add(mouseoverLayer);

        observer = new ResizeObserver(resizeStage);
        observer.observe(container);
    }

    onMount(() => {
        container.style.position = "relative";
        container.style.overflow = "hidden";
        bp = getBreakpoint(container.getBoundingClientRect().width)

        if (!$bulk_result) {
            return;
        }
        drawStash();
    });

    onDestroy(() => {
        if (observer) observer?.disconnect();
        if (stage) stage?.remove();
        stage = null;
        observer = null;
    });

    $effect(() => {
        if (stage) {
            observer?.disconnect();
            stage.remove();
            stage = null;
            observer = null;
        }

        if (!$bulk_result) {
            return;
        }
        drawStash();
    });
</script>

<div class="w-full min-h-[200px] mt-4 xl:mt-0">
    <div
        bind:this={container}
        id="stashContainer"
        class="flex flex-row justify-center items-center w-full h-full"
    ></div>
</div>

<style>
</style>
