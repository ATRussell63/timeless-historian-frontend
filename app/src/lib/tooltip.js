import Konva from "konva";
import { LEGION_COLORS, LEGION_COLORS_DESAT, MF_MOD_ABBREVIATIONS } from "../drawingConstants";

export class SBTooltip {
    constructor(breakpoint) {

        this.background = new Konva.Rect({
            x: 0,
            y: 0,
            width: 2, // arbitrary
            height: 2,
            fill: "black",
            opacity: 1,
            stroke: 'white',
            strokeWidth: breakpoint.stroke,
        });
        
        this.jewelName = new Konva.Text({
            name: 'ttJewelName',
            x: 0,
            y: 0,
            text: '',
            fill: 'white',
            fontFamily: 'Fontin-SmallCaps',
            fontSize: breakpoint.titleFontSize,
            align: 'center'
        })

        this.genSeed = new Konva.Text({
            name: 'ttGenSeed',
            x: 0,
            y: 0,
            text: '',
            fill: 'white',
            fontFamily: 'Fontin-Regular',
            fontSize: breakpoint.bodyFontSize,
            align: 'center'
        })

        this.mfMods = new Konva.Text({
            name: 'ttMfMods',
            x: 0,
            y: 0,
            text: '',
            fill: 'white',
            fontFamily: 'Fontin-Regular',
            fontSize: breakpoint.bodyFontSize,
            lineHeight: 1.5,
            align: 'center'
        })

        this.matches = new Konva.Text({
            name: 'ttMatches',
            x: 0,
            y: 0,
            text: '',
            fill: 'white',
            fontFamily: 'Fontin-Regular',
            fontSize: breakpoint.bodyFontSize,
            align: 'center'
        })

        this.separator = new Konva.Line({
            name: 'ttSeparator',
            stroke: 'white',
            strokeWidth: breakpoint.stroke,
        })

        this.group = new Konva.Group();
        this.group.add(this.background)
        this.group.add(this.jewelName)
        this.group.add(this.genSeed)
        this.group.add(this.mfMods)
        this.group.add(this.separator)
        this.group.add(this.matches)
        this.group.hide()
    }

    formatText(breakpoint, j_result) {
        // set text
        this.jewelName.text(j_result.jewel_type)
        this.genSeed.text(`${j_result.general} #${j_result.seed}`)

        if (j_result.jewel_type === 'Militant Faith') {
            this.mfMods.text(`${MF_MOD_ABBREVIATIONS.get(j_result.mf_mods[0])}\n${MF_MOD_ABBREVIATIONS.get(j_result.mf_mods[1])}`)
        } else {
            this.mfMods.text('')
        }
        let matchText = `Matching Seed: ${j_result.seed_match}\nMatching General: ${j_result.general_match}`;

        if (j_result.jewel_type === "Militant Faith") {
            matchText += `\nExact Matches: ${j_result.exact_match}`;
        }
        this.matches.text(matchText)

        const widest = Math.max(this.jewelName.width(), this.genSeed.width(), this.mfMods.width(), this.matches.width())
        
        // set color, position of texts and separator
        const ttElements = [this.jewelName, this.genSeed, this.mfMods, this.separator, this.matches]
        let y_accum = breakpoint.textMargin
        for (const t of ttElements) {
            // skip if t is mf mod text and type is not militant faith
            if (t.name() === 'ttMfMods' && j_result.jewel_type !== 'Militant Faith') continue;

            if (t.name() !== 'ttSeparator') {
                t.fill(LEGION_COLORS.get(j_result.jewel_type))
            } else {
                t.stroke(LEGION_COLORS_DESAT.get(j_result.jewel_type))
                t.points([0, 0, widest + 4 * breakpoint.textMargin, 0])
            }
            
            t.offsetX(t.width() / 2)
            t.y(y_accum)
            y_accum += t.getSelfRect().height + breakpoint.textMargin
        }

        // size ttBackground to fit elements
        this.background.width(widest + 4 * breakpoint.textMargin)
        this.background.height(y_accum)
        this.background.stroke(LEGION_COLORS_DESAT.get(j_result.jewel_type))

        // center X everything wrt ttBackground
        for (const t of ttElements) {
            t.x(this.background.width() / 2)
        }
    }

    updatePosition(breakpoint, stage, tabLabelH, backdrop) {
        const mousePos = stage.getPointerPosition();
        const base_offset_x = 0;
        const base_offset_y = 0;
        let offset_x = base_offset_x;
        let offset_y = base_offset_y;
        let push_margin = 40;

        
        if (
            mousePos.x +
                this.background.width() +
                offset_x +
                push_margin >
            stage.width()
        ) {
            offset_x = (stage.width() - mousePos.x) -(this.background.width() + base_offset_x + push_margin);
        }

        // this is a little fried but measuring from the top is the only way
        // bottom most y coord should be tab label + backdrop + stroke
        const bottomY = tabLabelH + backdrop.height() + breakpoint.stroke
        const tooltipBottom = mousePos.y + this.background.height() + offset_y

        if (tooltipBottom + push_margin > bottomY) {
            offset_y = (stage.height() - mousePos.y) -(this.background.height() + base_offset_y + push_margin);
        }

        this.group.position({
            x: mousePos.x + offset_x,
            y: mousePos.y + offset_y,
        });
        this.group.moveToTop()
    }
}