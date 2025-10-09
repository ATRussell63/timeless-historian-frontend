<script>
    import Konva from "konva";
    import { onDestroy, onMount } from "svelte";
    import { base } from "$app/paths";
    import { hoverData } from "./resultsBrowserStore";
    import { LEGION_COLORS, LEGION_ABBREV } from "./drawingConstants";
    import { Pointer } from "lucide-svelte";
    import { mobile_layout } from "./store";

    const darkImages = import.meta.glob("$lib/images/drawing/dark/*.svg", {
        eager: true,
    });
    const lightImages = import.meta.glob("$lib/images/drawing/light/*.svg", {
        eager: true,
    });

    let { mode } = $props();

    const RADIUS_PADDING = 50;
    const MARGIN = 20;

    Konva.showWarnings = false;
    let stage = null;
    let container;
    let observer;
    let currentScale;

    function getDesignScale() {
        if ($hoverData) {
            const s = ($hoverData.drawing.radius + RADIUS_PADDING) * 2;
            return s;
        } else {
            console.log("hey I didnt find hoverdata :(");
            return 3600;
        }
    }

    function ignoreScale(val) {
        return val / currentScale;
    }

    function resizeStage() {
        if (!container || !stage) return;
        const { width, height } = container.getBoundingClientRect();
        const size = Math.min(width, height);

        try {
            if (stage.width() !== width || stage.height() !== height) {
                const usableSize = size - MARGIN * 2;
                stage.width(width);
                stage.height(height);
                currentScale = usableSize / getDesignScale();
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

    function drawJewel() {
        console.log("drawinge....");

        const NODE_SIZE = 256;
        const TT_FONT_BODY = "#8183BF";
        const TT_FONT_TITLE = "#F8E5C9";
        const TT_FONT_UNIQUE = "#AF6127";
        const TT_FONT_REMINDER = "#7F7F7F";
        const TT_WIDTH = "";
        const TT_W_PADDING = 10;

        const UN_COLOR = mode.current === "dark" ? "#666666" : "#333333";
        const TT_TITLE_SIZE = 20;
        const TT_BODY_SIZE = 16;
        const TT_REMINDER_SIZE = 14;
        let tt_shown_via_click = false;

        const src_suffix = LEGION_ABBREV.get($hoverData.drawing.jewel_type);

        const stageW = container.getBoundingClientRect();
        const stageH = container.getBoundingClientRect();

        stage = new Konva.Stage({
            container: "drawingContainer",
            width: stageW,
            height: stageH,
        });

        const baseLayer = new Konva.Layer({ name: "base" }); // backdrop
        const mouseoverLayer = new Konva.Layer({ name: "mouseover" }); // mouseover detectors
        const maskLayer = new Konva.Layer({ name: "mask" });
        const ttLayer = new Konva.Layer({ name: "tooltip" }); // tooltip

        // clipping group that trims the overall radius and punches holes for each node
        const edgeCropper = new Konva.Group({
            clipFunc: function (ctx) {
                ctx.arc(
                    0,
                    0,
                    $hoverData.drawing.radius + RADIUS_PADDING,
                    0,
                    360,
                );
            },
        });

        let backdropFill =
            mode.current === "dark" ? "hsl(var(--inset))" : "hsl(var(--inset))";
        let backdropOpacity = mode.current === "dark" ? 0.5 : 0.2;

        // really hard to make out white on light grey
        if (
            mode.current !== "dark" &&
            $hoverData.drawing.jewel_type == "Elegant Hubris"
        ) {
            // backdropFill = 'black'
            backdropOpacity = 0.5;
        }

        // draw the radius
        const backdrop = new Konva.Circle({
            x: 0,
            y: 0,
            radius: $hoverData.drawing.radius + RADIUS_PADDING,
            fill: backdropFill,
            opacity: backdropOpacity,
        });

        const timelessRadius = new Konva.Circle({
            x: 0,
            y: 0,
            radius: $hoverData.drawing.radius + RADIUS_PADDING,
            stroke: LEGION_COLORS.get($hoverData.drawing.jewel_type),
            strokeWidth: 60,
        });

        baseLayer.add(backdrop);

        // TOOLTIP
        const ttGroup = new Konva.Group({
            offsetX: 0,
            offsetY: 0,
        });

        const ttBackground = new Konva.Rect({
            x: 0,
            y: 0,
            width: 650,
            height: 400,
            fill: "black",
            stroke: LEGION_COLORS.get($hoverData.drawing.jewel_type),
            strokeWidth: ignoreScale(2),
            opacity: 0.8,
        });

        let ttTitle = new Konva.Text({});
        let ttBody = new Konva.Text({});
        let ttReminder = new Konva.Text({});

        ttGroup.add(ttBackground);
        ttGroup.add(ttTitle);
        ttGroup.add(ttBody);
        ttGroup.add(ttReminder);
        ttLayer.add(ttGroup);
        ttLayer.hide();

        // EDGES
        function make_straight_edge(edge) {
            let stroke = UN_COLOR;
            if (edge.a) {
                stroke = LEGION_COLORS.get($hoverData.drawing.jewel_type);
            }

            const sEdge = new Konva.Line({
                points: [edge.c[0].x, edge.c[0].y, edge.c[1].x, edge.c[1].y],
                stroke: stroke,
                strokeWidth: ignoreScale(3),
                lineCap: "square",
                lineJoin: "square",
            });
            edgeCropper.add(sEdge);
        }

        function make_curved_edge(edge) {
            let stroke = UN_COLOR;
            if (edge.a) {
                stroke = LEGION_COLORS.get($hoverData.drawing.jewel_type);
            }
            const cx = edge.c.x;
            const cy = edge.c.y;

            const arc = new Konva.Arc({
                x: cx,
                y: cy,
                innerRadius: edge.r,
                outerRadius: edge.r,
                rotation: edge.o,
                angle: edge.t,
                fill: "yellow",
                stroke: stroke,
                strokeWidth: ignoreScale(3),
            });
            edgeCropper.add(arc);
        }

        // draw unallocated first
        $hoverData.drawing.straight_edges.forEach((edge) => {
            if (!edge.a) {
                make_straight_edge(edge);
            }
        });

        $hoverData.drawing.curved_edges.forEach((edge) => {
            if (!edge.a) {
                make_curved_edge(edge);
            }
        });

        $hoverData.drawing.straight_edges.forEach((edge) => {
            if (edge.a) {
                make_straight_edge(edge);
            }
        });

        $hoverData.drawing.curved_edges.forEach((edge) => {
            if (edge.a) {
                make_curved_edge(edge);
            }
        });

        const tt_title_fmt = function (node, kText) {
            const jewel_titles = [
                "Glorious Vanity",
                "Militant Faith",
                "Brutal Restraint",
                "Lethal Pride",
                "Elegant Hubris",
            ];
            if (jewel_titles.includes(node.l.title)) {
                kText.fontFamily("Fontin-SmallCaps");
                kText.fill(TT_FONT_UNIQUE);
                kText.fontSize(ignoreScale(TT_TITLE_SIZE + 4));
            } else {
                kText.fontFamily("Fontin-Regular");
                kText.fill(TT_FONT_TITLE);
                kText.fontSize(ignoreScale(TT_TITLE_SIZE));
            }

            kText.align("center");
            kText.text(node.l.title);
            kText.padding(ignoreScale(10));
            kText.offsetX(0);
        };

        const tt_body_fmt = function (node, kText) {
            const t = node.l.body.join("\n");

            kText.text(t);
            kText.fontFamily("Fontin-Regular");
            kText.fill(TT_FONT_BODY);

            if (mobile_layout) {
                kText.fontSize(ignoreScale(TT_BODY_SIZE - 2));
            } else {
                kText.fontSize(ignoreScale(TT_BODY_SIZE));
            }

            const jewel_titles = [
                "Glorious Vanity",
                "Militant Faith",
                "Brutal Restraint",
                "Lethal Pride",
                "Elegant Hubris",
            ];
            if (jewel_titles.includes(node.l.title)) {
                kText.align("center");
            } else {
                kText.align("left");
            }
            kText.padding(ignoreScale(10));
            kText.offsetY(-ttTitle.height() + ignoreScale(10));
        };

        const tt_reminder_fmt = function (node, kText) {
            let t = "";
            if (node.l.replaced_title) {
                t = "(Replaced " + node.l.replaced_title + ")";
            }

            kText.text(t);
            kText.fontFamily("Fontin-Italic");
            kText.fill(TT_FONT_REMINDER);
            kText.fontSize(ignoreScale(TT_REMINDER_SIZE));

            const jewel_titles = [
                "Glorious Vanity",
                "Militant Faith",
                "Brutal Restraint",
                "Lethal Pride",
                "Elegant Hubris",
            ];
            if (jewel_titles.includes(node.l.title)) {
                kText.align("center");
            } else {
                kText.align("left");
            }

            let body_height = node.l.body.length == 0 ? ignoreScale(5) : ttBody.height();

            kText.offsetX(-ignoreScale(TT_W_PADDING));
            kText.offsetY(-(ttTitle.height() + body_height - ignoreScale(10)));
        };

        // NODES
        Object.values($hoverData.drawing.nodes).forEach((node) => {
            const nodeImage = new Image();
            const nx = node.c.x;
            const ny = node.c.y;

            // images are always rects so we draw a circle to act as a mouseover target
            const nodeMouseoverDetector = new Konva.Circle({
                name: "mouseoverDetector",
                x: nx,
                y: ny,
                radius: NODE_SIZE / 3,
                stroke: "black",
                fill: "white",
                strokeWidth: 0,
                opacity: 0,
            });

            function drawTooltip() {
                tt_title_fmt(node, ttTitle);
                tt_body_fmt(node, ttBody);

                if (node.l.replaced_title) {
                    tt_reminder_fmt(node, ttReminder);
                    ttReminder.show();
                } else {
                    ttReminder.hide();
                }

                // set tooltip width to longest text out of title, body and reminder
                const maxW = Math.max(
                    ttTitle.getTextWidth(),
                    ttBody.getTextWidth(),
                    ttReminder.getTextWidth(),
                );
                ttBackground.width(maxW + ignoreScale(20));

                // HACK
                if (ttTitle.fontFamily() === "Fontin-SmallCaps") {
                    ttTitle.offsetX(
                        -ttBackground.width() / 2 + ttTitle.getTextWidth() / 2,
                    );
                }

                // set tooltip height
                let cumH = ttTitle.height();
                if (node.l.body.length > 0) {
                    cumH += ttBody.height() - ignoreScale(10);
                }
                if (node.l.replaced_title) {
                    cumH += ttReminder.height() + ignoreScale(10);
                }

                ttBackground.height(cumH);

                //update position
                const mousePos = mouseoverLayer.getRelativePointerPosition();

                let offset_x = ignoreScale(5);
                let offset_y = ignoreScale(5);

                let push_margin_bottom = ignoreScale(20);
                let push_margin_right = ignoreScale(20);

                let tooltipX = mousePos.x + offset_x;
                let tooltipY = mousePos.y + offset_y;

                const tooltipW = ttBackground.width();
                const tooltipH = ttBackground.height();

                const stageWidthWorld = ignoreScale(stage.width());
                const stageHeightWorld = ignoreScale(stage.height());

                const centerX = stage.width() / 2 / currentScale;
                const centerY = stage.height() / 2 / currentScale;

                const minX = -centerX + push_margin_bottom;
                const maxX = centerX - push_margin_right;
                const minY = -centerY;
                const maxY = centerY;

                tooltipX = Math.min(tooltipX, maxX - tooltipW);
                tooltipX = Math.max(tooltipX, minX);

                if (tooltipY + tooltipH > maxY) {
                    tooltipY = mousePos.y - tooltipH - offset_y;
                } else {
                    tooltipY = mousePos.y + offset_y;
                }

                ttGroup.position({
                    x: tooltipX,
                    y: tooltipY,
                });
            }

            nodeMouseoverDetector.on("mousemove", () => {
                if (!tt_shown_via_click) {
                    drawTooltip();
                    ttLayer.show();
                }
            });

            nodeMouseoverDetector.on("mouseout", () => {
                // console.log("off");
                if (!tt_shown_via_click) {
                    ttLayer.hide();
                }
            });

            nodeMouseoverDetector.on("tap", () => {
                console.log("clicking time");
                tt_shown_via_click = true;
                drawTooltip();
                ttLayer.show();
            });

            mouseoverLayer.add(nodeMouseoverDetector);

            nodeImage.onload = () => {
                const img = new Konva.Image({
                    x: nx,
                    y: ny,
                    image: nodeImage,
                    width: NODE_SIZE,
                    height: NODE_SIZE,
                });
                img.offsetX(NODE_SIZE / 2);
                img.offsetY(NODE_SIZE / 2);
                edgeCropper.add(img);
            };

            const images = mode.current === "dark" ? darkImages : lightImages;
            const suffix = node.a ? src_suffix : "UN";
            const filename = node.t + "_" + suffix + ".svg";

            let src = null;
            for (const path in images) {
                if (path.endsWith(`/${filename}`)) {
                    src = images[path].default;
                    break;
                }
            }

            nodeImage.src = src;
        });

        stage.on("click", (e) => {
            if (!e.target.hasName("mouseoverDetector")) {
                ttLayer.hide();
                tt_shown_via_click = false;
            }
        });
        stage.on("tap", (e) => {
            if (!e.target.hasName("mouseoverDetector")) {
                ttLayer.hide();
                tt_shown_via_click = false;
            }
        });

        baseLayer.add(edgeCropper);
        maskLayer.add(timelessRadius);
        stage.add(baseLayer);
        stage.add(maskLayer);
        stage.add(mouseoverLayer);
        stage.add(ttLayer);

        resizeStage();

        observer = new ResizeObserver(() => {
            requestAnimationFrame(resizeStage);
        });
        observer.observe(container);

        console.log("done :^)");
    }

    onMount(() => {
        container.style.position = "relative";
        container.style.overflow = "hidden";

        if (!$hoverData) {
            return;
        }

        drawJewel();
    });

    onDestroy(() => {
        observer?.disconnect();
        stage.remove();
        stage = null;
        observer = null;
    });

    // on update to props, re-render
    $effect(() => {
        console.log("update");

        if (stage) {
            observer?.disconnect();
            stage.remove();
            stage = null;
            observer = null;
        }

        if (!$hoverData) {
            return;
        }
        drawJewel();
    });
</script>

<div class="w-full aspect-square min-h-[200px]">
    <div
        bind:this={container}
        id="drawingContainer"
        class="w-full h-full"
    ></div>
</div>

<style>
    /* #drawingContainer {
        width: 100%;
        height: 100%;
    } */
</style>
