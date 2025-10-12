/**
 * Breakpoints
 * 
 * jewelDrawing is scaling fairly well but initial loads of StashBrowser are breaking
 * I don't really like these canvas elements scaling to the exact pixel anyway, so this class
 * will be responsible for representing different groups of constant values at different resolutions.
 */

class Breakpoint {
    constructor(name, stageW, stageMargin, stroke,
                bodyFontSize, titleFontSize, textMargin, tabLabelFontSize) {
        Object.assign(this, {name, stageW, stageMargin, stroke,
                             bodyFontSize, titleFontSize, textMargin, tabLabelFontSize})
        // I probably calculated this wrong but everything is drawn from the top anyway
        this.stageH = this.stageW + this.tabLabelFontSize + this.stroke * 4
    }
}

const xxs = new Breakpoint(
    'xxs',      //name
    325,        //stageW
    0,          //stageMargin
    2,          //stroke
    16,         //bodyFontSize
    20,         //titleFontSize
    5,          //textMargin
    20          //tabLabelFontSize
)

const xs = new Breakpoint(
    'xs',       //name
    325,        //stageW
    5,          //stageMargin
    2,          //stroke
    16,         //bodyFontSize
    20,         //titleFontSize
    5,          //textMargin
    12          //tabLabelFontSize
)

const s = new Breakpoint(
    's',       //name
    325,        //stageW
    5,          //stageMargin
    2,          //stroke
    16,         //bodyFontSize
    20,         //titleFontSize
    5,          //textMargin
    12          //tabLabelFontSize
)

const m = new Breakpoint(
    'm',      //name
    325,        //stageW
    5,          //stageMargin
    2,          //stroke
    16,         //bodyFontSize
    20,         //titleFontSize
    5,          //textMargin
    12          //tabLabelFontSize
)

const lg = new Breakpoint(
    'lg',      //name
    325,        //stageW
    5,          //stageMargin
    2,          //stroke
    16,         //bodyFontSize
    20,         //titleFontSize
    5,          //textMargin
    12          //tabLabelFontSize
)

const xl = new Breakpoint(
    'xl',      //name
    325,        //stageW
    5,          //stageMargin
    2,          //stroke
    16,         //bodyFontSize
    20,         //titleFontSize
    5,          //textMargin
    12          //tabLabelFontSize
)

export function getBreakpoint(screenWidth) {
    if (screenWidth <= 380) {
        return xxs
    } else if (screenWidth <= 420) {
        return xs
    } else if (screenWidth <= 640) {
        return s
    } else if (screenWidth <= 768) {
        return m
    } else if (screenWidth <= 1024 ) {
        return lg
    } else {
        return xl
    }
}