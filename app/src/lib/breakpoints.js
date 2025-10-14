/**
 * Breakpoints
 * 
 * jewelDrawing is scaling fairly well but initial loads of StashBrowser are breaking
 * I don't really like these canvas elements scaling to the exact pixel anyway, so this class
 * will be responsible for representing different groups of constant values at different resolutions.
 */

class Breakpoint {
    constructor(name, stageW, stageMargin, stroke,
                bodyFontSize, titleFontSize, textMargin, tabLabelFontSize, borderRadius) {
        Object.assign(this, {name, stageW, stageMargin, stroke,
                             bodyFontSize, titleFontSize, textMargin, tabLabelFontSize, borderRadius})
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
    20,         //tabLabelFontSize
    2           //borderRadius
)

const xs = new Breakpoint(
    'xs',       //name
    390,        //stageW
    0,          //stageMargin
    2,          //stroke
    16,         //bodyFontSize
    20,         //titleFontSize
    5,          //textMargin
    20,         //tabLabelFontSize
    2           //borderRadius
)

const s = new Breakpoint(
    's',       //name
    420,        //stageW
    0,          //stageMargin
    2,          //stroke
    16,         //bodyFontSize
    20,         //titleFontSize
    5,          //textMargin
    20,         //tabLabelFontSize
    2           //borderRadius
)

const m = new Breakpoint(
    'm',      //name
    620,        //stageW
    0,          //stageMargin
    2,          //stroke
    16,         //bodyFontSize
    20,         //titleFontSize
    5,          //textMargin
    20,         //tabLabelFontSize
    2           //borderRadius
)

const lg = new Breakpoint(
    'lg',      //name
    760,        //stageW
    0,          //stageMargin
    4,          //stroke
    20,         //bodyFontSize
    24,         //titleFontSize
    6,          //textMargin
    28,         //tabLabelFontSize
    4           //borderRadius
)

// unused
const xl = new Breakpoint(
    'xl',      //name
    700,        //stageW
    0,          //stageMargin
    2,          //stroke
    16,         //bodyFontSize
    20,         //titleFontSize
    6,          //textMargin
    20,         //tabLabelFontSize
    2           //borderRadius
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


// page breakpoints

export function getPageBreakpoint() {
    const screenWidth = window.innerWidth
    if (screenWidth <= 380) {
        return 'xxs'
    } else if (screenWidth <= 420) {
        return 'xs'
    } else if (screenWidth <= 640) {
        return 'sm'
    } else if (screenWidth <= 768) {
        return 'md'
    } else if (screenWidth <= 1024 ) {
        return 'lg'
    } else if (screenWidth <= 1280) {
        return 'xl'
    } else {
        return '2xl'
    }
}

export function isMobile(bp) {
    const mobile_bps = ['xxs', 'xs', 'sm', 'md']
    return mobile_bps.includes(bp)
}