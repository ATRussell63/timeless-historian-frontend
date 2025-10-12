<script>
    import Konva from "konva";
    import { onDestroy, onMount } from "svelte";
    import { base } from "$app/paths";
    import { LEGION_COLORS, LEGION_ABBREV, LEGION_COLORS_DESAT, MF_MOD_ABBREVIATIONS } from "./drawingConstants";
    import { Pointer } from "lucide-svelte";
    import { bulk_result, mobile_layout, cells_per_side } from "./store";
    import { isBright } from "$lib/utils";
    import {
        clearSelection,
        forceHidden,
        stashMetadata,
    } from "./resultsBrowserStore";
    import { searchDBThenScroll } from "$lib/api";

    let { mode } = $props();

    const RADIUS_PADDING = 50;
    const MARGIN = 5;
    const TAB_LABEL_FONT_SIZE = 18;
    const NUM_HITS_FONT_SIZE = 5;
    const GRID_STROKE = 1;

    // Konva.showWarnings = false;
    let stage = null;
    let container;
    let observer;
    let currentScale;

    const DESIGN_SCALE = 100;

    function ignoreScale(val) {
        if (!currentScale) {
            return val / DESIGN_SCALE
        }
        return val / currentScale;
    }

    function resizeStage() {
        if (!container || !stage) return;
        const { width, height } = container.getBoundingClientRect();
        const size = Math.min(width, height);

        try {
            if (stage.width() !== width || stage.height() !== height) {
                console.log('resize')
                const usableSize = size;
                stage.width(width);
                stage.height(height);
                currentScale = usableSize / DESIGN_SCALE;
                const layers = stage.getLayers();
                for (const layer of layers) {
                    layer.x(width / 2);
                    layer.y(height / 2);
                    layer.scale({ x: currentScale, y: currentScale });
                    layer.batchDraw();
                }
            }
        } catch (e) {
            return;
        }
    }

    function drawStash() {

        const stageW = container.getBoundingClientRect().width;
        const stageH = container.getBoundingClientRect().height;

        stage = new Konva.Stage({
            container: "stashContainer",
            // width: stageW,
            // height: stageH,
        });


        const baseLayer = new Konva.Layer({ name: "base" }); // backdrop
        const mouseoverLayer = new Konva.Layer({ name: "mouseover" }); // mouseover detectors
        const frameLayer = new Konva.Layer({ name: 'frame' }); // tab label and frame
        const zoomTileLayer = new Konva.Layer({name: 'zoom'}); // enlarged tiles

        const gridGroup = new Konva.Group();
        const ttGroup = new Konva.Group();
        const highlightTileGroup = new Konva.Group();
        
        // const backdropFill = mode.current === "dark" ? "#333333" : "#999999";
        let backdropFill =
            mode.current === "dark" ? "hsl(var(--inset))" : "hsl(var(--inset))";
        let backdropOpacity = mode.current === "dark" ? 0.5 : 0.7;
        const gridColor = mode.current === "dark" ? "#999999" : "#CCCCCC";

        const backdrop = new Konva.Rect({
            x: 0,
            y: 0,
            width: DESIGN_SCALE - MARGIN,
            height: DESIGN_SCALE - MARGIN,
            fill: backdropFill,
            opacity: backdropOpacity,
            cornerRadius: [2, 2, 2, 2],
        });
        backdrop.offsetX(backdrop.width() / 2)
        backdrop.offsetY(backdrop.height() / 2)

        const allTilesGroup = new Konva.Group({
            clipFunc: function (ctx) {
                ctx.roundRect(
                    0,
                    0,
                    backdrop.width(),
                    backdrop.height(),
                    [2, 2, 2, 2]
                )
            }
        });

        // draw the 'frame'
        const tabLabelText = new Konva.Text({
            x: 0,
            y: (-(DESIGN_SCALE - MARGIN) / 2) - 1.7,
            text: $stashMetadata.name,
            fill: isBright($stashMetadata.color) ? "black" : "white",
            fontFamily: "Fontin-Regular",
            align: "center",
        });

        const tabLabelRect = new Konva.Rect({
            x: 0,
            y: (-(DESIGN_SCALE - MARGIN) / 2) - 2.6,
            width: 0,
            height: 0,
            fill: $stashMetadata.color,
            cornerRadius: [2, 2, 0, 0],
        });

        const tabLabelStashFrame = new Konva.Rect({
            x: 0,
            y: 0,
            width: backdrop.width(),
            height: backdrop.height(),
            stroke: $stashMetadata.color,
            strokeWidth: GRID_STROKE,
            cornerRadius: [2, 2, 2, 2],
        });
        tabLabelStashFrame.offsetX(tabLabelStashFrame.width() / 2)
        tabLabelStashFrame.offsetY(tabLabelStashFrame.height() / 2)

        frameLayer.add(tabLabelStashFrame);
        frameLayer.add(tabLabelRect);
        frameLayer.add(tabLabelText);

        baseLayer.add(backdrop);
        baseLayer.offsetY((stage.height() - MARGIN / 2) + 0.4);

        function alignWithBackdrop(el) {
            if (el) {
                el.offsetX(backdrop.width() / 2)
                el.offsetY((backdrop.height() / 2))
            }
        }

        // draw the grid lines
        const cellSize = backdrop.width() / $cells_per_side;
        // console.log(`cellSize ${cellSize}`)
        for (let i = 1; i < $cells_per_side; i++) {
            const lineLat = new Konva.Line({
                stroke: gridColor,
                strokeWidth: GRID_STROKE / 2,
                points: [0, i * cellSize, backdrop.width(), i * cellSize],
            });

            const lineLong = new Konva.Line({
                stroke: gridColor,
                strokeWidth: GRID_STROKE / 2,
                points: [i * cellSize, 0, i * cellSize, backdrop.height()],
            });

            gridGroup.add(lineLat);
            gridGroup.add(lineLong);
        }
        alignWithBackdrop(gridGroup)
        baseLayer.add(gridGroup)

        const TT_BODY_FONT_SIZE = 18 / currentScale;
        const TT_TITLE_FONT_SIZE = 24 / currentScale;
        const ZOOM_SCALE = 1.15;
        const TT_MARGIN_TOP = 1.5;
        
        // empty tooltip
        const ttBackground = new Konva.Rect({
            x: 0,
            y: 0,
            width: 2, // arbitrary
            height: 2,
            fill: "black",
            opacity: 1,
            stroke: 'white',
            strokeWidth: GRID_STROKE / 2,
            // zIndex: 0,
        });
        
        const ttJewelName = new Konva.Text({
            name: 'ttJewelName',
            x: 0,
            y: 0,
            text: '',
            fill: 'white',
            fontFamily: 'Fontin-SmallCaps',
            fontSize: TT_TITLE_FONT_SIZE,
            align: 'center'
        })

        const ttGenSeed = new Konva.Text({
            name: 'ttGenSeed',
            x: 0,
            y: 0,
            text: '',
            fill: 'white',
            fontFamily: 'Fontin-Regular',
            fontSize: TT_BODY_FONT_SIZE,
            align: 'center'
        })

        const ttMfMods = new Konva.Text({
            name: 'ttMfMods',
            x: 0,
            y: 0,
            text: '',
            fill: 'white',
            fontFamily: 'Fontin-Regular',
            fontSize: TT_BODY_FONT_SIZE,
            lineHeight: 1.5,
            align: 'center'
        })

        const ttMatches = new Konva.Text({
            name: 'ttMatches',
            x: 0,
            y: 0,
            text: '',
            fill: 'white',
            fontFamily: 'Fontin-Regular',
            fontSize: TT_BODY_FONT_SIZE,
            align: 'center'
        })

        const ttSeparator = new Konva.Line({
            name: 'ttSeparator',
            stroke: 'white',
            strokeWidth: GRID_STROKE / 2,
            // points: [0, 0]
        })

        ttGroup.add(ttBackground);
        ttGroup.add(ttJewelName);
        ttGroup.add(ttGenSeed);
        ttGroup.add(ttMfMods)
        ttGroup.add(ttSeparator);
        ttGroup.add(ttMatches);
        baseLayer.add(ttGroup);
        stage.add(baseLayer);

        $bulk_result.forEach((r) => {     
            const tile = new Konva.Rect({
                name: 'tile',
                x: r.x * cellSize + cellSize / 2,
                y: r.y * cellSize + cellSize / 2,
                width: cellSize,
                height: cellSize,
                fill: LEGION_COLORS.get(r.jewel_type),
                // zIndex: 0,
            });

            // how many seed hits this jewel had
            const numHits = new Konva.Text({
                name: 'numHits',
                x: r.x * cellSize + cellSize / 2,
                y: r.y * cellSize + cellSize / 2,
                text: r.seed_match,
                // text: '123',
                fill: r.seed_match > 0 ? "black" : "#333333",
                fontSize: NUM_HITS_FONT_SIZE,
                fontFamily: "Fontin",
                align: "center",
                // zIndex: 1,
            });

            const tileTarget = new Konva.Rect({
                x: r.x * cellSize + cellSize / 2,
                y: r.y * cellSize + cellSize / 2,
                width: cellSize,
                height: cellSize,
                fill: LEGION_COLORS.get(r.jewel_type),
                opacity: 0,
                // zIndex: 2,
            });

            // go with smaller font size if the # of hits is large
            // this works for 3 digits, good enough for 50 years of poe
            // if (numHits.width() > tile.width() - 12) {
            //     numHits.fontSize(numHitsFontSize * 0.75);
            // }

            if (r.seed_match === 0) {
                tile.opacity(0.5);
            } else {

                function formatTooltipText(r) {
                    // set text
                    ttJewelName.text(r.jewel_type)
                    ttGenSeed.text(`${r.general} #${r.seed}`)

                    if (r.jewel_type === 'Militant Faith') {
                        ttMfMods.text(`${MF_MOD_ABBREVIATIONS.get(r.mf_mods[0])}\n${MF_MOD_ABBREVIATIONS.get(r.mf_mods[1])}`)
                    } else {
                        ttMfMods.text('')
                    }
                    let matchText = `Matching Seed: ${r.seed_match}\nMatching General: ${r.general_match}`;

                    if (r.jewel_type === "Militant Faith") {
                        matchText += `\nExact Matches: ${r.exact_match}`;
                    }
                    ttMatches.text(matchText)

                    const widest = Math.max(ttJewelName.width(), ttGenSeed.width(), ttMfMods.width(), ttMatches.width())
                    
                    // set color, position of texts and separator
                    const ttElements = [ttJewelName, ttGenSeed, ttMfMods, ttSeparator, ttMatches]
                    let y_accum = TT_MARGIN_TOP
                    for (const t of ttElements) {

                        if (t.name() !== 'ttSeparator') {
                            t.fill(LEGION_COLORS.get(r.jewel_type))
                        } else {
                            console.log(y_accum)
                            t.stroke(LEGION_COLORS_DESAT.get(r.jewel_type))
                            t.points([0, -y_accum, widest + 5, -y_accum])
                        }
                        
                        t.offsetX(t.width() / 2)
                        t.y(y_accum)
                        // console.log(t.getSelfRect().height)
                        console.log(t.height())
                        console.log(t.width())
                        y_accum += t.getSelfRect().height + TT_MARGIN_TOP
                    }

                    // size ttBackground to fit elements
                    ttBackground.width(widest + 5)
                    ttBackground.height(y_accum)
                    ttBackground.stroke(LEGION_COLORS_DESAT.get(r.jewel_type))
                    // ttSeparator.offsetY(ttBackground.height() / 2)

                    // center X everything wrt ttBackground
                    for (const t of ttElements) {
                        t.x(ttBackground.width() / 2)
                    }
                }

                function updateTooltipPosition() {
                    // const mousePos = mouseoverLayer.getRelativePointerPosition();
                    // const base_offset_x = 0;
                    // const base_offset_y = 0;
                    // let offset_x = base_offset_x;
                    // let offset_y = base_offset_y;
                    // let push_margin = 0;

                    // if (
                    //     mousePos.x +
                    //         ttBackground.width() +
                    //         offset_x +
                    //         push_margin >
                    //     stage.width()
                    // ) {
                    //     offset_x = -(ttBackground.width() + base_offset_x);
                    // }

                    // if (
                    //     mousePos.y +
                    //         ttBackground.height() +
                    //         offset_y +
                    //         push_margin >
                    //     stage.height()
                    // ) {
                    //     offset_y =
                    //         stage.height() -
                    //         (mousePos.y +
                    //             ttBackground.height() +
                    //             push_margin);
                    // }

                    // console.log(`tt x: ${mousePos.x}, y: ${mousePos.y}`)
                    // if (mousePos) {
                    //     ttGroup.position({
                    //         // x: mousePos.x + offset_x,
                    //         // y: mousePos.y + offset_y,
                    //         x: mousePos.x,
                    //         y: mousePos.y
                    //     });
                    // }

                    // ttGroup.scale({x: currentScale, y: currentScale})
                    ttGroup.moveToTop()
                }


                function drawTooltip() {
                    try {
                        console.log(`drawing ${ttGroup.getChildren().length} tooltip elements`)
                        formatTooltipText(r)
                        updateTooltipPosition()
                        ttGroup.show();
                    } catch (e) {
                        console.log('halp')
                        console.log(e)
                        return;
                    }
                }

                const maxAnimTime = 1
                let zoomInStart = null
                let zoomOutStart = null
                // zoom animation
                const jewelMouseoverZoomIn = new Konva.Animation(function (
                    frame,
                ) {
                    if (!zoomInStart) zoomInStart = frame.time

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

                    tile.moveTo(allTilesGroup);
                    numHits.moveTo(allTilesGroup);
                    const scale = 1;
                    tile.scale({ x: scale, y: scale });
                    numHits.scale({ x: scale, y: scale });
                    ttGroup.hide();

                    if (frame.time - zoomOutStart >= maxAnimTime) {
                        jewelMouseoverZoomOut.stop()
                    }
                });

                tileTarget.on("mouseover", function (e) {
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
                    searchDBThenScroll(r, "resultsScrollTarget");
                });
            }

            tile.offsetX(tile.width() / 2);
            tile.offsetY(tile.height() / 2);
            tileTarget.offsetX(tile.width() / 2);
            tileTarget.offsetY(tile.height() / 2 - 2.2); // i am actually regarded
            numHits.offsetX(numHits.width() / 2);
            numHits.offsetY(numHits.height() / 2);

            allTilesGroup.add(tile);
            allTilesGroup.add(numHits);
            mouseoverLayer.add(tileTarget);
        });

        alignWithBackdrop(ttGroup)
        alignWithBackdrop(allTilesGroup)
        alignWithBackdrop(mouseoverLayer)
        alignWithBackdrop(highlightTileGroup)

        // zoomTileLayer.add(highlightTileGroup);
        baseLayer.add(highlightTileGroup)
        alignWithBackdrop(zoomTileLayer)

        baseLayer.add(allTilesGroup)
        

        stage.add(baseLayer);
        stage.add(zoomTileLayer);
        stage.add(frameLayer);
        stage.add(mouseoverLayer);

        ttGroup.hide()

        resizeStage();

        // this is incredibly demonic
        for (const shape of allTilesGroup.children) {
            // console.log(shape)
            if (shape.name() === 'tile') {
                shape.stroke(gridColor)
                shape.strokeWidth(GRID_STROKE / 2)
            }
        }

        tabLabelText.fontSize(TAB_LABEL_FONT_SIZE / currentScale)
        tabLabelText.offsetX(tabLabelText.width() / 2)
        tabLabelRect.width(tabLabelText.width() + 4)
        tabLabelRect.height(tabLabelText.height() + 1)
        tabLabelRect.offsetX(tabLabelRect.width() / 2)
        tabLabelStashFrame.y(tabLabelRect.height() / 2 - 0.5)

        observer = new ResizeObserver(resizeStage);
        observer.observe(container);
    }

    onMount(() => {
        container.style.position = "relative";
        container.style.overflow = "hidden";

        if (!$bulk_result) {
            return;
        }
        resizeStage();
        drawStash();
    });

    onDestroy(() => {
        observer?.disconnect();
        stage.remove();
        stage = null;
        observer = null;
    });

    // on update to props, re-render
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

<div class="w-full aspect-square min-h-[200px] mt-4">
    <div
        bind:this={container}
        id="stashContainer"
        class="w-full h-full"
    ></div>
</div>

<style>
</style>
