<script>
    import Konva from "konva";
    import { onDestroy, onMount } from "svelte";
    import { base } from "$app/paths";
    import { hoverData } from "./resultsBrowserStore";
    import { LEGION_COLORS, LEGION_ABBREV } from "./drawingConstants";

    const darkImages = import.meta.glob("$lib/images/drawing/dark/*.svg", {
        eager: true,
    });
    const lightImages = import.meta.glob("$lib/images/drawing/light/*.svg", {
        eager: true,
    });

    let { w, h, mode } = $props();

    let stage = null;

    function drawJewel() {
        const SCALE_FACTOR = 0.22;
        const NODE_SIZE = 256;
        const TT_FONT_BODY = "#8183BF";
        const TT_FONT_TITLE = "#F8E5C9";
        const TT_FONT_UNIQUE = "#AF6127";
        const TT_FONT_REMINDER = "#7F7F7F";
        const TT_WIDTH = "";
        const TT_W_PADDING = 10;
        const RADIUS_PADDING = 50;
        const UN_COLOR = mode.current === "dark" ? "#666666" : "#333333";
        const TT_TITLE_SIZE = 20;
        const TT_BODY_SIZE = 16;
        const TT_REMINDER_SIZE = 14;

        const src_suffix = LEGION_ABBREV.get($hoverData.drawing.jewel_type);

        stage = new Konva.Stage({
            container: "drawingContainer",
            width: w,
            height: h,
        });

        function convert_coord(n, dim) {
            switch (dim) {
                case "x":
                    return stage.width() / 2 + n * SCALE_FACTOR;
                case "y":
                    return stage.height() / 2 + n * SCALE_FACTOR;
            }
        }

        const baseLayer = new Konva.Layer(); // backdrop
        const mouseoverLayer = new Konva.Layer(); // mouseover detectors
        const maskLayer = new Konva.Layer();
        const ttLayer = new Konva.Layer(); // tooltip

        // clipping group that trims the overall radius and punches holes for each node
        const edgeCropper = new Konva.Group({
            clipFunc: function (ctx) {
                ctx.arc(
                    stage.width() / 2,
                    stage.height() / 2,
                    ($hoverData.drawing.radius + RADIUS_PADDING) * SCALE_FACTOR,
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
            x: stage.width() / 2,
            y: stage.height() / 2,
            radius: ($hoverData.drawing.radius + RADIUS_PADDING) * SCALE_FACTOR,
            fill: backdropFill,
            opacity: backdropOpacity,
        });

        const timelessRadius = new Konva.Circle({
            x: stage.width() / 2,
            y: stage.height() / 2,
            radius: ($hoverData.drawing.radius + RADIUS_PADDING) * SCALE_FACTOR,
            stroke: LEGION_COLORS.get($hoverData.drawing.jewel_type),
            strokeWidth: 10,
        });

        baseLayer.add(backdrop);

        // TOOLTIP
        const ttGroup = new Konva.Group({
            offsetX: -8,
            offsetY: -8,
        });

        const ttBackground = new Konva.Rect({
            x: 0,
            y: 0,
            width: 650,
            height: 400,
            fill: "black",
            stroke: LEGION_COLORS.get($hoverData.drawing.jewel_type),
            strokeWidth: 2,
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
                points: [
                    convert_coord(edge.c[0].x, "x"),
                    convert_coord(edge.c[0].y, "y"),
                    convert_coord(edge.c[1].x, "x"),
                    convert_coord(edge.c[1].y, "y"),
                ],
                stroke: stroke,
                strokeWidth: 3,
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
            const cx = convert_coord(edge.c.x, "x");
            const cy = convert_coord(edge.c.y, "y");

            const arc = new Konva.Arc({
                x: cx,
                y: cy,
                innerRadius: edge.r * SCALE_FACTOR,
                outerRadius: edge.r * SCALE_FACTOR,
                rotation: edge.o,
                angle: edge.t,
                fill: "yellow",
                stroke: stroke,
                strokeWidth: 3,
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
                kText.fontSize(TT_TITLE_SIZE + 4);
            } else {
                kText.fontFamily("Fontin-Regular");
                kText.fill(TT_FONT_TITLE);
                kText.fontSize(TT_TITLE_SIZE);
            }

            kText.align("center");
            kText.text(node.l.title);
            kText.padding(10);
            kText.offsetX(0);
        };

        const tt_body_fmt = function (node, kText) {
            const t = node.l.body.join("\n");

            kText.text(t);
            kText.fontFamily("Fontin-Regular");
            kText.fill(TT_FONT_BODY);
            kText.fontSize(TT_BODY_SIZE);

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
            kText.padding(10);
            kText.offsetY(-ttTitle.height() + 10);
        };

        const tt_reminder_fmt = function (node, kText) {
            let t = "";
            if (node.l.replaced_title) {
                t = "(Replaced " + node.l.replaced_title + ")";
            }

            kText.text(t);
            kText.fontFamily("Fontin-Italic");
            kText.fill(TT_FONT_REMINDER);
            kText.fontSize(TT_REMINDER_SIZE);

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

            let body_height = node.l.body.length == 0 ? 10 : ttBody.height();

            kText.offsetX(-TT_W_PADDING);
            kText.offsetY(-(ttTitle.height() + body_height - 10));
        };

        // NODES
        Object.values($hoverData.drawing.nodes).forEach((node) => {
            const nodeImage = new Image();
            const nx = convert_coord(node.c.x, "x");
            const ny = convert_coord(node.c.y, "y");

            // images are always rects so we draw a circle to act as a mouseover target
            const nodeMouseoverDetector = new Konva.Circle({
                x: nx,
                y: ny,
                radius: (NODE_SIZE / 3) * SCALE_FACTOR,
                stroke: "black",
                fill: "white",
                strokeWidth: 0,
                opacity: 0,
            });

            nodeMouseoverDetector.on("mousemove", () => {
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
                ttBackground.width(maxW + 20);

                // HACK
                if (ttTitle.fontFamily() === "Fontin-SmallCaps") {
                    ttTitle.offsetX(
                        -ttBackground.width() / 2 + ttTitle.getTextWidth() / 2,
                    );
                }

                // set tooltip height
                let cumH = ttTitle.height();
                if (node.l.body.length > 0) {
                    cumH += ttBody.height() - 10;
                }
                if (node.l.replaced_title) {
                    cumH += ttReminder.height() + 10;
                }

                ttBackground.height(cumH);

                //update position
                const mousePos = stage.getPointerPosition();

                let offset_x = 10;
                let offset_y = 10;

                let push_margin = 30;

                if (
                    mousePos.x + ttBackground.width() + offset_x + push_margin >
                    stage.width()
                ) {
                    offset_x =
                        stage.width() -
                        (mousePos.x + ttBackground.width() + push_margin);
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
                        (mousePos.y + ttBackground.height() + push_margin);
                }

                ttGroup.position({
                    x: mousePos.x + offset_x,
                    y: mousePos.y + offset_y,
                });

                ttLayer.show();
            });

            nodeMouseoverDetector.on("mouseout", () => {
                ttLayer.hide();
            });
            mouseoverLayer.add(nodeMouseoverDetector);

            nodeImage.onload = () => {
                const img = new Konva.Image({
                    x: nx,
                    y: ny,
                    image: nodeImage,
                    width: NODE_SIZE * SCALE_FACTOR,
                    height: NODE_SIZE * SCALE_FACTOR,
                });
                img.offsetX((NODE_SIZE * SCALE_FACTOR) / 2);
                img.offsetY((NODE_SIZE * SCALE_FACTOR) / 2);
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

        baseLayer.add(edgeCropper);
        maskLayer.add(timelessRadius);
        stage.add(baseLayer);
        stage.add(maskLayer);
        stage.add(mouseoverLayer);

        stage.add(ttLayer);
    }

    onMount(() => {
        if (!$hoverData) {
            return;
        }

        drawJewel();
    });

    onDestroy(() => {
        stage.remove();
        stage = null;
    });

    // on update to props, re-render
    $effect(() => {
        if (stage) {
            stage.remove();
            stage = null;
        }

        if (!$hoverData) {
            return;
        }
        drawJewel();
    });
</script>

<div id="drawingContainer"></div>

<style>
    #drawingContainer {
        margin-top: 5px;
        margin-bottom: 10px;
    }
</style>
