<script>
    import { onDestroy, onMount } from 'svelte';
    // import { Canvas, StaticCanvas, FabricText, loadSVGFromString } from 'fabric'
    // import { util } from 'fabric';
    import { base } from '$app/paths';
    import notableSVG from '$lib/images/drawing/notable.svg';
    import keystoneSVG from '$lib/images/drawing/keystone.svg';
    import smallPassiveSVG from '$lib/images/drawing/small_passive.svg';
    import jewelSocketSVG from '$lib/images/drawing/jewel_socket.svg';

    // jewel socket
    import jewelSocketBR from '$lib/images/drawing/jewel_socketBR.svg';
    import jewelSocketLP from '$lib/images/drawing/jewel_socketLP.svg';
    import jewelSocketGV from '$lib/images/drawing/jewel_socketGV.svg';
    import jewelSocketEH from '$lib/images/drawing/jewel_socketEH.svg';
    import jewelSocketMF from '$lib/images/drawing/jewel_socketMF.svg';
    import jewelSocketUN from '$lib/images/drawing/jewel_socketUN.svg';

    // keystone
    import keystoneGV from '$lib/images/drawing/keystone_GV.svg';
    import keystoneLP from '$lib/images/drawing/keystone_LP.svg';
    import keystoneBR from '$lib/images/drawing/keystone_BR.svg';
    import keystoneEH from '$lib/images/drawing/keystone_EH.svg';
    import keystoneMF from '$lib/images/drawing/keystone_MF.svg';
    import keystoneUN from '$lib/images/drawing/keystone_UN.svg';

    // notable
    import notableGV from '$lib/images/drawing/notable_GV.svg';
    import notableLP from '$lib/images/drawing/notable_LP.svg';
    import notableBR from '$lib/images/drawing/notable_BR.svg';
    import notableEH from '$lib/images/drawing/notable_EH.svg';
    import notableMF from '$lib/images/drawing/notable_MF.svg';
    import notableUN from '$lib/images/drawing/notable_UN.svg';

    // small passive
    import smallGV from '$lib/images/drawing/small_passiveGV.svg';
    import smallLP from '$lib/images/drawing/small_passiveLP.svg';
    import smallBR from '$lib/images/drawing/small_passiveBR.svg';
    import smallEH from '$lib/images/drawing/small_passiveEH.svg';
    import smallMF from '$lib/images/drawing/small_passiveMF.svg';
    import smallUN from '$lib/images/drawing/small_passiveUN.svg';

    let { drawData, w, h, mode } = $props();

    import Konva from 'konva';
    // import { Arc, Line } from 'svelte-konva';

    let stage = null;

    function drawJewel() {
        const SCALE_FACTOR = 0.22;
        const NODE_SIZE = 256;
        const TT_FONT_BODY = '#8183BF';
        const TT_FONT_TITLE = '#F8E5C9';
        const TT_FONT_UNIQUE = '#AF6127';
        const TT_FONT_REMINDER = '#7F7F7F';
        const TT_WIDTH = '';
        const TT_W_PADDING = 10
        const RADIUS_PADDING = 50

        const TT_TITLE_SIZE = 20;
        const TT_BODY_SIZE = 16;
        const TT_REMINDER_SIZE = 14

        // const JEWEL_SOCKET_SCALE = 0.5;

        const LEGION_COLORS = new Map([
            ['Brutal Restraint', '#E8A92B'],
            ['Militant Faith' , '#0BA94A'],
            ['Glorious Vanity' , '#E02828'],
            ['Elegant Hubris' , '#E6E7E8'],
            ['Lethal Pride' , '#E55C24']
        ])

        const LEGION_ABBREV = new Map([
            ['Brutal Restraint', 'BR'],
            ['Militant Faith' , 'MF'],
            ['Glorious Vanity' , 'GV'],
            ['Elegant Hubris' , 'EH'],
            ['Lethal Pride' , 'LP']
        ])

        const src_suffix = LEGION_ABBREV.get(drawData.jewel_type)

        stage = new Konva.Stage({
        container: 'container',
        width: w,
        height: h
        // width: window.innerWidth,
        // height: window.innerHeight,
        });
        
        function convert_coord(n, dim) {
            switch(dim) {
                case 'x':
                    return (stage.width() / 2) + (n * SCALE_FACTOR);
                case 'y':
                    return (stage.height() / 2) + (n * SCALE_FACTOR);
            }
        }
        
        const baseLayer = new Konva.Layer(); // backdrop
        const mouseoverLayer = new Konva.Layer(); // mouseover detectors
        const maskLayer = new Konva.Layer();
        const ttLayer = new Konva.Layer(); // tooltip

        // clipping group that trims the overall radius and punches holes for each node
        const edgeCropper = new Konva.Group({
            clipFunc: function (ctx) {
                ctx.arc(stage.width() / 2,
                        stage.height() / 2,
                        (drawData.radius + RADIUS_PADDING) * SCALE_FACTOR,
                        0,
                        360)
            }
        });

        // draw the radius
        const backdrop = new Konva.Circle({
            x: stage.width() / 2,
            y: stage.height() / 2,
            radius: (drawData.radius + RADIUS_PADDING) * SCALE_FACTOR,
            fill: mode.current === 'dark' ? 'black': 'white',
            opacity: 0.3
        })

        const timelessRadius = new Konva.Circle({
            x: stage.width() / 2,
            y: stage.height() / 2,
            radius: (drawData.radius + RADIUS_PADDING) * SCALE_FACTOR,
            stroke: LEGION_COLORS.get(drawData.jewel_type),
            strokeWidth: 10
        })

        baseLayer.add(backdrop);
        // baseLayer.add(timelessRadius);
        
        // TOOLTIP
        const ttGroup = new Konva.Group({
            // x: stage.width() / 2,
            // y: stage.height() / 2,

            // draggable: true
            offsetX: -8,
            offsetY: -8
        });

        const ttBackground = new Konva.Rect({
            x: 0,
            y: 0,
            width: 650,
            height: 400,
            fill: 'black',
            stroke: LEGION_COLORS.get(drawData.jewel_type),
            strokeWidth: 2,
            opacity: 0.8
            // draggable: true
            // visible: false
        });

        let ttTitle = new Konva.Text({})
        let ttBody = new Konva.Text({})
        let ttReminder = new Konva.Text({})
        // ttBackground.hide();
        ttGroup.add(ttBackground);
        ttGroup.add(ttTitle);
        ttGroup.add(ttBody);
        ttGroup.add(ttReminder);
        ttLayer.add(ttGroup);
        ttLayer.hide();

        // EDGES
        function make_straight_edge(edge) {
            let stroke = '#333333';
            if (edge.allocated) {
                stroke = LEGION_COLORS.get(drawData.jewel_type);
            }

            const sEdge = new Konva.Line({
                points: [convert_coord(edge.ends[0].relative.x, 'x'), convert_coord(edge.ends[0].relative.y, 'y'),
                            convert_coord(edge.ends[1].relative.x, 'x'), convert_coord(edge.ends[1].relative.y, 'y')],
                stroke: stroke,
                strokeWidth: 3,
                lineCap: 'square',
                lineJoin: 'square',
            });
            edgeCropper.add(sEdge);
        }

        function make_curved_edge(edge) {
            let stroke = '#333333';
            if (edge.allocated) {
                stroke = LEGION_COLORS.get(drawData.jewel_type);
            }
            const cx = convert_coord(edge.relative_center.x, 'x');
            const cy = convert_coord(edge.relative_center.y, 'y');
            
            const arc = new Konva.Arc({
                x: cx,
                y: cy,
                innerRadius: edge.radius * SCALE_FACTOR,
                outerRadius: edge.radius * SCALE_FACTOR,
                rotation: edge.rotation,
                angle: edge.angle,
                fill: 'yellow',
                stroke: stroke,
                strokeWidth: 3
            });
            edgeCropper.add(arc);

            // const label = new Konva.Text({
            //         fill: 'yellow',
            //         text: `${Math.trunc(edge.relative_center.x)}, ${Math.trunc(edge.relative_center.y)}`,
            //         x: cx,
            //         y: cy,
            //         align: 'center'
            //     })
            //     edgeCropper.add(label)
        }

        // draw unallocated first
        drawData.straight_edges.forEach((edge) => {
            if (!edge.allocated) {
                make_straight_edge(edge)
            }
        })
        
        drawData.curved_edges.forEach((edge) => {
            if (!edge.allocated) {
                make_curved_edge(edge)
            }
        })

        drawData.straight_edges.forEach((edge) => {
            if (edge.allocated) {
                make_straight_edge(edge)
            }
        })


        drawData.curved_edges.forEach((edge) => {
            if (edge.allocated) {
                make_curved_edge(edge)
            }
        })

        const tt_title_fmt = function(node, kText) {
            const jewel_titles = ['Glorious Vanity',
                                  'Militant Faith',
                                  'Brutal Restraint',
                                  'Lethal Pride',
                                  'Elegant Hubris']
            if (jewel_titles.includes(node.tooltip.title)) {
                kText.fontFamily('Fontin-SmallCaps') 
                kText.fill(TT_FONT_UNIQUE)
                kText.fontSize(TT_TITLE_SIZE + 4)
            } else {
                kText.fontFamily('Fontin-Regular')
                kText.fill(TT_FONT_TITLE)
                kText.fontSize(TT_TITLE_SIZE)
            }
            
            kText.align('center')
            kText.text(node.tooltip.title)
            kText.padding(10)

            // clear title centering from last node
            kText.offsetX(0)
        }

        const tt_body_fmt = function(node, kText) {
            const t = node.tooltip.body.join('\n')

            kText.text(t)
            kText.fontFamily('Fontin-Regular')
            kText.fill(TT_FONT_BODY)
            kText.fontSize(TT_BODY_SIZE)
            
            const jewel_titles = ['Glorious Vanity',
                                  'Militant Faith',
                                  'Brutal Restraint',
                                  'Lethal Pride',
                                  'Elegant Hubris']
            if (jewel_titles.includes(node.tooltip.title)) {
                kText.align('center')
            } else {
                kText.align('left')
            }
            kText.padding(10)
            // kText.letterSpacing(5)
            // kText.lineHeight(1.1)
            // kText.offsetX(-TT_W_PADDING)
            kText.offsetY(-ttTitle.height() + 10)
        }

        const tt_reminder_fmt = function(node, kText) {
            let t =''
            if (node.tooltip.replaced_title) {
                t = '(Replaced ' + node.tooltip.replaced_title + ')'
            }

            kText.text(t)
            kText.fontFamily('Fontin-Italic')
            kText.fill(TT_FONT_REMINDER)
            kText.fontSize(TT_REMINDER_SIZE)
            
            const jewel_titles = ['Glorious Vanity',
                                'Militant Faith',
                                'Brutal Restraint',
                                'Lethal Pride',
                                'Elegant Hubris']
            if (jewel_titles.includes(node.tooltip.title)) {
                kText.align('center')
            } else {
                kText.align('left')
            }

            let body_height = node.tooltip.body.length == 0 ? 10 : ttBody.height();
            
            kText.offsetX(-TT_W_PADDING)
            kText.offsetY(-(ttTitle.height() + body_height - 10))
        }

        // NODES
        Object.values(drawData.nodes).forEach((node) => {
            const nodeImage = new Image();
            const nx = convert_coord(node.relative_coords.x, 'x');
            const ny = convert_coord(node.relative_coords.y, 'y');

            // images are always rects so we draw a circle to act as a mouseover target
            const nodeMouseoverDetector = new Konva.Circle({
                x: nx,
                y: ny,
                radius: ((NODE_SIZE) / 3) * SCALE_FACTOR,
                stroke: 'black',
                fill: 'white',
                strokeWidth: 0,
                opacity: 0
            });

            nodeMouseoverDetector.on('mousemove', () => {
                tt_title_fmt(node, ttTitle);
                tt_body_fmt(node, ttBody);

                if (node.tooltip.replaced_title) {
                    tt_reminder_fmt(node, ttReminder);
                    ttReminder.show();
                } else {
                    ttReminder.hide();
                }

                // set tooltip width to longest text out of title, body and reminder
                const maxW = Math.max(ttTitle.getTextWidth(),
                                      ttBody.getTextWidth(),
                                      ttReminder.getTextWidth())
                ttBackground.width(maxW + 20)
                
                // HACK
                if (ttTitle.fontFamily() === 'Fontin-SmallCaps') {
                    ttTitle.offsetX((-ttBackground.width() / 2) +
                                    (ttTitle.getTextWidth() / 2))
                }

                // set tooltip height
                // let cumH = 0
                let cumH = ttTitle.height()
                if (node.tooltip.body.length > 0) {
                    cumH += ttBody.height() - 10
                }
                // cumH += 8
                if (node.tooltip.replaced_title) {
                    cumH += ttReminder.height() + 10
                }
                // cumH += ttReminder.height()
                
                ttBackground.height(cumH)

                //update position
                const mousePos = stage.getPointerPosition();

                let offset_x = 10;
                let offset_y = 10

                let push_margin = 30
                
                if (mousePos.x + ttBackground.width() + offset_x + push_margin > stage.width()) {
                    offset_x = stage.width() - (mousePos.x + ttBackground.width() + push_margin)
                }

                if (mousePos.y + ttBackground.height() + offset_y + push_margin > stage.height()) {
                    offset_y = stage.height() - (mousePos.y + ttBackground.height() + push_margin)
                }

                ttGroup.position({
                    x: mousePos.x + offset_x,
                    y: mousePos.y + offset_y,
                });

                ttLayer.show();
            });

            nodeMouseoverDetector.on('mouseout', () => {
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

                // const label = new Konva.Text({
                //     fill: 'white',
                //     text: node.node_id,
                //     x: nx,
                //     y: ny,
                //     align: 'center'
                // })
                // edgeCropper.add(label)
            }

            nodeImage.src = notableSVG;

            // select the appropriate color of node image
            // this is a terrible way to do this but I don't want to mess with
            // interacting with the svg dom
            switch(node.node_type) {
                case 'notable':
                    if (!node.allocated) {
                        nodeImage.src = notableUN;
                        break;
                    }
                    switch (src_suffix) {
                        case 'GV':
                            nodeImage.src = notableGV;
                            break;
                        case 'LP':
                            nodeImage.src = notableLP;
                            break;
                        case 'MF':
                            nodeImage.src = notableMF;
                            break;
                        case 'EH':
                            nodeImage.src = notableEH;
                            break;
                        case 'BR':
                            nodeImage.src = notableBR;
                            break;
                    }
                    break;
                case 'keystone':
                    if (!node.allocated) {
                        nodeImage.src = keystoneUN;
                        break;
                    }
                    switch (src_suffix) {
                        case 'GV':
                            nodeImage.src = keystoneGV;
                            break;
                        case 'LP':
                            nodeImage.src = keystoneLP;
                            break;
                        case 'MF':
                            nodeImage.src = keystoneMF;
                            break;
                        case 'EH':
                            nodeImage.src = keystoneEH;
                            break;
                        case 'BR':
                            nodeImage.src = keystoneBR;
                            break;
                    }
                    break;
                case 'small_passive':
                    if (!node.allocated) {
                        nodeImage.src = smallUN;
                        break;
                    }
                    switch (src_suffix) {
                        case 'GV':
                            nodeImage.src = smallGV;
                            break;
                        case 'LP':
                            nodeImage.src = smallLP;
                            break;
                        case 'MF':
                            nodeImage.src = smallMF;
                            break;
                        case 'EH':
                            nodeImage.src = smallEH;
                            break;
                        case 'BR':
                            nodeImage.src = smallBR;
                            break;
                    }
                    break;
                case 'jewel_socket':
                    if (!node.allocated) {
                        nodeImage.src = jewelSocketUN;
                        break;
                    }
                    switch (src_suffix) {
                        case 'GV':
                            nodeImage.src = jewelSocketGV;
                            break;
                        case 'LP':
                            nodeImage.src = jewelSocketLP;
                            break;
                        case 'MF':
                            nodeImage.src = jewelSocketMF;
                            break;
                        case 'EH':
                            nodeImage.src = jewelSocketEH;
                            break;
                        case 'BR':
                            nodeImage.src = jewelSocketBR;
                            break;
                    }
            }
            
        });

        baseLayer.add(edgeCropper);
        maskLayer.add(timelessRadius);
        stage.add(baseLayer);
        stage.add(maskLayer);
        stage.add(mouseoverLayer);
        
        stage.add(ttLayer);
    }


    onMount(() => {
        if (!drawData) {
            return;
        }

        drawJewel();
    });

    onDestroy(() => {
        stage.destroy();
        stage = null;
    });


    // on update to props, re-render
    $effect(() => {
        if (stage) {
            stage.destroy();
            stage = null;
        }

        if (!drawData) {
            return;
        }
        drawJewel();
    });

</script>

<div id="container">

</div>

<style>
    #container {
        margin-top: 5px;
        margin-bottom: 10px;
    }
</style>