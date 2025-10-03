<script>
    import { onDestroy, onMount } from "svelte";
    import Konva from "konva";
    import { searchDBThenScroll } from "$lib/api";
    import { bulk_result, search_result } from "./store";
    import {
        clearSelection,
        forceHidden,
        stashMetadata,
    } from "./resultsBrowserStore";
    import { isBright } from "$lib/utils";
    import {
        LEGION_COLORS,
        LEGION_COLORS_DESAT,
        MF_MOD_ABBREVIATIONS,
    } from "./drawingConstants";

    let { sideLen, cellsPerSide, mode } = $props();

    Konva.showWarnings = false;

    let stage = null;
    const tabLabelH = 40;
    const gridStrokeW = 2;

    function drawBlankStage() {
        clearSelection();
        stage = new Konva.Stage({
            container: "stashContainer",
            width: sideLen + 4 * gridStrokeW,
            height: sideLen + tabLabelH + 3 * gridStrokeW,
        });
    }

    function stageCenterX(k) {
        k.offsetX(k.width() / 2);
        k.x(stage.width() / 2);
    }

    function drawStash() {
        const cellSize = sideLen / cellsPerSide;
        const numHitsFontSize = cellSize - 20;
        const backgroundColor = mode.current === "dark" ? "#333333" : "#999999";
        const gridColor = mode.current === "dark" ? "#999999" : "#CCCCCC";
        const bodyFontSize = 18;
        const mouseOverZoomScale = 1.15;

        // TODO gonna need to make this reactive
        const ttWidth = 300;
        let ttHeight = 400;

        stage = new Konva.Stage({
            container: "stashContainer",
            width: sideLen + 4 * gridStrokeW,
            height: sideLen + tabLabelH + 3 * gridStrokeW,
        });

        const tabLabelLayer = new Konva.Layer();
        const baseLayer = new Konva.Layer();
        const gridLines = new Konva.Layer();
        const tileLayer = new Konva.Layer();
        const zoomTileLayer = new Konva.Layer();
        const ttLayer = new Konva.Layer();
        const mouseoverLayer = new Konva.Layer();

        const allTilesGroup = new Konva.Group();
        const highlightTileGroup = new Konva.Group();

        // draw tab label
        const tabLabelText = new Konva.Text({
            x: 0,
            y: 0,
            text: $stashMetadata.name,
            fill: isBright($stashMetadata.color) ? "black" : "white",
            fontFamily: "Fontin-Regular",
            fontSize: bodyFontSize,
            lineHeight: 1.5,
            align: "center",
        });

        stageCenterX(tabLabelText);
        tabLabelText.offsetY(-tabLabelText.height() / 2 + 3);

        const tabLabelRect = new Konva.Rect({
            x: 0,
            y: 0,
            width: tabLabelText.width() + 20,
            height: tabLabelH - 4,
            fill: $stashMetadata.color,
            cornerRadius: [10, 10, 0, 0],
        });

        const tabLabelStashFrame = new Konva.Rect({
            x: gridStrokeW,
            y: tabLabelH,
            width: stage.width() - 2 * gridStrokeW,
            height: stage.height() - tabLabelH - 1 * gridStrokeW,
            stroke: $stashMetadata.color,
            strokeWidth: gridStrokeW * 2,
            cornerRadius: [2, 2, 2, 2],
        });

        stageCenterX(tabLabelRect);
        tabLabelRect.offsetY(-5);

        stageCenterX(tabLabelStashFrame);

        tabLabelLayer.add(tabLabelStashFrame);
        tabLabelLayer.add(tabLabelRect);
        tabLabelLayer.add(tabLabelText);

        // draw background color
        const backdrop = new Konva.Rect({
            x: 0,
            y: 0,
            width: sideLen + 6,
            height: sideLen,
            fill: backgroundColor,
            stroke: gridColor,
            strokeWidth: 0,
            opacity: 0.8,
        });

        stageCenterX(backdrop);
        baseLayer.add(backdrop);

        // draw the grid lines
        for (let i = 0; i < cellsPerSide + 1; i++) {
            const lineLat = new Konva.Line({
                stroke: gridColor,
                strokeWidth: gridStrokeW,
                points: [0, i * cellSize, sideLen, i * cellSize],
            });

            const lineLong = new Konva.Line({
                stroke: gridColor,
                strokeWidth: gridStrokeW,
                points: [i * cellSize, 0, i * cellSize, sideLen],
            });

            gridLines.add(lineLat);
            gridLines.add(lineLong);
        }

        // draw the jewels
        $bulk_result.forEach((r) => {
            const tile = new Konva.Rect({
                x: r.x * cellSize + cellSize / 2,
                y: r.y * cellSize + cellSize / 2,
                width: cellSize,
                height: cellSize,
                stroke: gridColor,
                strokeWidth: gridStrokeW,
                fill: LEGION_COLORS.get(r.jewel_type),
                zIndex: 0,
            });

            // how many seed hits this jewel had
            const numHits = new Konva.Text({
                x: r.x * cellSize + cellSize / 2,
                y: r.y * cellSize + cellSize / 2,
                text: r.seed_match,
                fill: r.seed_match > 0 ? "black" : "#333333",
                fontSize: numHitsFontSize,
                fontFamily: "Fontin",
                align: "center",
                zIndex: 1,
            });

            const tileTarget = new Konva.Rect({
                x: r.x * cellSize + cellSize / 2,
                y: r.y * cellSize + cellSize / 2,
                width: cellSize,
                height: cellSize,
                fill: LEGION_COLORS.get(r.jewel_type),
                opacity: 0,
                zIndex: 2,
            });

            // go with smaller font size if the # of hits is large
            // this works for 3 digits, good enough for 50 years of poe
            if (numHits.width() > tile.width() - 12) {
                numHits.fontSize(numHitsFontSize * 0.75);
            }

            // 'desaturate' the tile if hits is 0
            if (r.seed_match === 0) {
                tile.opacity(0.5);
            } else {
                // if there were hits, make the tile into a button and add a tooltip

                // tooltip
                const ttGroup = new Konva.Group();

                const ttBackground = new Konva.Rect({
                    x: 0,
                    y: 0,
                    width: ttWidth,
                    height: ttHeight,
                    fill: "black",
                    opacity: 1,
                    stroke: LEGION_COLORS_DESAT.get(r.jewel_type),
                    strokeWidth: gridStrokeW,
                    zIndex: 0,
                });

                function drawTooltip() {
                    try {
                        ttLayer.destroyChildren();

                        const mousePos = stage.getPointerPosition();
                        const base_offset_x = 5;
                        const base_offset_y = 5;
                        let offset_x = base_offset_x;
                        let offset_y = base_offset_y;
                        let push_margin = 20;

                        if (
                            mousePos.x +
                                ttBackground.width() +
                                offset_x +
                                push_margin >
                            stage.width()
                        ) {
                            offset_x = -(ttBackground.width() + base_offset_x);
                        }

                        if (
                            mousePos.y +
                                ttBackground.height() +
                                offset_y +
                                push_margin >
                            stage.height()
                        ) {
                            offset_y =
                                stage.height() -
                                (mousePos.y +
                                    ttBackground.height() +
                                    push_margin);
                        }

                        ttGroup.position({
                            x: mousePos.x + offset_x,
                            y: mousePos.y + offset_y,
                        });

                        // text content

                        const margin_top = 8;
                        // jewel name
                        const ttJewelName = new Konva.Text({
                            x: 0,
                            y: margin_top,
                            text: r.jewel_type,
                            fill: LEGION_COLORS.get(r.jewel_type),
                            fontFamily: "Fontin-SmallCaps",
                            fontSize: 24,
                            align: "center",
                        });
                        ttJewelName.offsetX(ttJewelName.width() / 2);
                        ttJewelName.x(ttBackground.width() / 2);

                        let y_accum = ttJewelName.height() + margin_top * 2;

                        // general and seed
                        const ttGenSeed = new Konva.Text({
                            x: 0,
                            y: y_accum,
                            text: `${r.general} #${r.seed}`,
                            fill: LEGION_COLORS.get(r.jewel_type),
                            fontFamily: "Fontin-Regular",
                            fontSize: bodyFontSize,
                            align: "center",
                        });
                        ttGenSeed.offsetX(ttGenSeed.width() / 2);
                        ttGenSeed.x(ttBackground.width() / 2);

                        y_accum += ttGenSeed.height() + margin_top;

                        // any mf mods
                        // if (true) {
                        let ttMfMods = null;
                        if (r.jewel_type === "Militant Faith") {
                            ttMfMods = new Konva.Text({
                                x: 0,
                                y: y_accum,
                                text: `${MF_MOD_ABBREVIATIONS.get(r.mf_mods[0])}\n${MF_MOD_ABBREVIATIONS.get(r.mf_mods[1])}`,
                                // text: 'borgus',
                                fill: LEGION_COLORS.get(r.jewel_type),
                                fontFamily: "Fontin-Regular",
                                fontSize: bodyFontSize,
                                // padding: 15,
                                lineHeight: 1.5,
                                align: "center",
                            });
                            ttMfMods.offsetX(ttMfMods.width() / 2);
                            ttMfMods.x(ttBackground.width() / 2);
                            // ttGroup.add(ttMfMods)
                            y_accum += ttMfMods.height() + margin_top;
                        }

                        const sep_height = y_accum;
                        y_accum += margin_top;

                        // seed match
                        // general match
                        // exact matches (mf only)

                        let matchText = `Matching Seed: ${r.seed_match}\nMatching General: ${r.general_match}`;

                        if (r.jewel_type === "Militant Faith") {
                            matchText += `\nExact Matches: ${r.exact_match}`;
                        }

                        const ttMatches = new Konva.Text({
                            x: 0,
                            y: y_accum,
                            text: matchText,
                            // fill: LEGION_COLORS.get(r.jewel_type),
                            fill: "white",
                            fontFamily: "Fontin-Regular",
                            fontSize: 18,
                            lineHeight: 1.5,
                            align: "center",
                        });
                        ttMatches.offsetX(ttMatches.width() / 2);
                        ttMatches.x(ttBackground.width() / 2);

                        y_accum += ttMatches.height() + margin_top;
                        ttBackground.height(y_accum);

                        let ttWidest = Math.max(
                            ttJewelName.width(),
                            ttGenSeed.width(),
                            ttMatches.width(),
                        );
                        if (ttMfMods) {
                            ttWidest = Math.max(ttWidest, ttMfMods.width());
                        }

                        const separator = new Konva.Line({
                            stroke: LEGION_COLORS_DESAT.get(r.jewel_type),
                            strokeWidth: gridStrokeW,
                            points: [0, sep_height, ttWidest + 40, sep_height],
                        });

                        ttBackground.width(ttWidest + 40);

                        ttGroup.add(ttBackground);
                        ttGroup.add(ttJewelName);
                        ttGroup.add(ttGenSeed);
                        ttGroup.add(separator);
                        ttGroup.add(ttMatches);

                        if (ttMfMods) {
                            ttGroup.add(ttMfMods);
                        }

                        ttLayer.add(ttGroup);

                        ttLayer.show();
                    } catch (e) {
                        return;
                    }
                }

                // zoom animation
                const jewelMouseoverZoomIn = new Konva.Animation(function (
                    frame,
                ) {
                    tile.moveTo(highlightTileGroup);
                    numHits.moveTo(highlightTileGroup);
                    const scale = mouseOverZoomScale;
                    tile.scale({ x: scale, y: scale });
                    numHits.scale({ x: scale, y: scale });
                    drawTooltip();
                });

                const jewelMouseoverZoomOut = new Konva.Animation(function (
                    frame,
                ) {
                    tile.moveTo(allTilesGroup);
                    numHits.moveTo(allTilesGroup);
                    const scale = 1;
                    tile.scale({ x: scale, y: scale });
                    numHits.scale({ x: scale, y: scale });
                    ttLayer.hide();
                });

                tileTarget.on("mousemove", function (e) {
                    e.target.getStage().container().style.cursor = "pointer";
                    jewelMouseoverZoomIn.start();
                });
                tileTarget.on("mouseout", function (e) {
                    e.target.getStage().container().style.cursor = "default";
                    jewelMouseoverZoomOut.start();
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
            tileTarget.offsetY(tile.height() / 2);
            numHits.offsetX(numHits.width() / 2);
            numHits.offsetY(numHits.height() / 2);

            allTilesGroup.add(tile);
            allTilesGroup.add(numHits);
            mouseoverLayer.add(tileTarget);
        });

        tileLayer.add(allTilesGroup);
        zoomTileLayer.add(highlightTileGroup);

        function tabLabelNudge(layer) {
            layer.offsetX(-2 * gridStrokeW);
            layer.offsetY(-(gridStrokeW + tabLabelH));
        }

        const non_tab_label_layers = [
            baseLayer,
            gridLines,
            tileLayer,
            zoomTileLayer,
            mouseoverLayer,
        ];
        non_tab_label_layers.forEach((l) => tabLabelNudge(l));

        // only draw anything if bulk_result exists
        if ($bulk_result) {
            // add layers to stage
            stage.add(baseLayer);
            stage.add(gridLines);
            stage.add(tileLayer);
            stage.add(tabLabelLayer);
            stage.add(zoomTileLayer);
            stage.add(ttLayer);
            stage.add(mouseoverLayer);
            ttLayer.hide();
        }
    }

    onMount(() => {
        if (!$bulk_result) {
            drawBlankStage();
            return;
        }

        drawStash();
    });

    onDestroy(() => {
        if (stage) {
            stage.remove();
            stage = null;
        }
    });

    // on update to props, re-render
    $effect(() => {
        if (stage) {
            stage.remove();
            stage = null;
        }

        if (!$bulk_result) {
            drawBlankStage();
            return;
        }
        drawStash();
    });
</script>

<div id="stashContainer"></div>
