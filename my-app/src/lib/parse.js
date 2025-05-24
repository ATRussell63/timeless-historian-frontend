// import { z } from 'zod';

// export const mf_mods = {'Regenerate 0.6 Mana per Second per 10 Devotion': 
//                      'Regenerate 0.6 Mana per Second per 10 Devotion',
//                      '3% increased Effect of non-Damaging Ailments on Enemies per 10 Devotion':
//                      '3% increased Effect of non-Damaging Ailments on Enemies per 10 Devotion',
//                      '4% increased Area Damage per 10 Devotion':
//                      '4% increased Area Damage per 10 Devotion',
//                      '1% increased effect of Non-Curse Auras per 10 Devotion':
//                      '1% increased effect of Non-Curse Auras per 10 Devotion',
//                      '4% increased Brand Damage per 10 Devotion':
//                      '4% increased Brand Damage per 10 Devotion',
//                      'Channelling Skills deal 4% increased Damage per 10 Devotion':
//                      'Channelling Skills deal 4% increased Damage per 10 Devotion',
//                      '4% reduced Duration of Curses on you per 10 Devotion':
//                      '4% reduced Duration of Curses on you per 10 Devotion',
//                      '4% reduced Elemental Ailment Duration on you per 10 Devotion':
//                      '4% reduced Elemental Ailment Duration on you per 10 Devotion',
//                      '4% increased Elemental Damage per 10 Devotion':
//                      '4% increased Elemental Damage per 10 Devotion',
//                      '+2% to all Elemental Resistances per 10 Devotion':
//                      '+2% to all Elemental Resistances per 10 Devotion',
//                      'Minions have +60 to Accuracy Rating per 10 Devotion':
//                      'Minions have +60 to Accuracy Rating per 10 Devotion',
//                      '1% increased Minion Attack and Cast Speed per 10 Devotion':
//                      '1% increased Minion Attack and Cast Speed per 10 Devotion',
//                      '1% reduced Mana Cost of Skills per 10 Devotion':
//                      '1% reduced Mana Cost of Skills per 10 Devotion',
//                      '3% increased Defences from Equipped Shield per 10 Devotion':
//                      '3% increased Defences from Equipped Shield per 10 Devotion',
//                      '4% increased Totem Damage per 10 Devotion':
//                      '4% increased Totem Damage per 10 Devotion'};

// export const mf_schema = z.object({
//     mf_mods: z.array(z.enum(Object.keys(mf_mods))).length(2, "Please select 2 mods.")
// });

// TODO - need lut endpoints to validate data against

export function parse_jewel_seed(jewel_text) {
    if (jewel_text.length === 0) {
        return ''
    }

    const capture_seed = /Item Level: \d\d\n(?:-*)\n\D*(\d*)/;
    const m = jewel_text.match(capture_seed);
    if (!m) {
        // console.log('parse jewel seed was null')
        return ''
    }

    if (m.length === 0) {
        return ''
    } else if (isNaN(parseInt(m[1]))){
        return ''
    } else {
        return m[1]
    }
}

export function parse_jewel_general(jewel_text) {
    if (jewel_text.length === 0) {
        return ''
    }

    const capture_general = /Item Level: \d\d\n(?:-*)\n.*(\b\w+)/;
    const m = jewel_text.match(capture_general);
    
    if (!m) {
        // console.log('parse general was null')
        return ''
    }

    const generals = ['Asenath',
                        'Balbala',
                        'Nasima',
                        'Cadiro',
                        'Caspiro',
                        'Victario',
                        'Ahuana',
                        'Doryani',
                        'Xibaqua',
                        'Akoya',
                        'Kaom',
                        'Rakiata',
                        'Avarius',
                        'Dominus',
                        'Maxarius']

    if (m.length === 0) {
        return ''
    } else if (!generals.includes(m[1])){
        return ''
    } else {
        return m[1]
    }
}

export function parse_jewel_type(jewel_text) {
    // console.log('Start parse jewel type')
    // console.log(jewel_text.length)
    if (jewel_text.length === 0) {
        return ''
    }

    // works with RegExp constructor
    const capture_type = /Rarity: Unique\n(.*)/;
    const m = jewel_text.match(capture_type);
    const jewel_types = ['Brutal Restraint', 'Elegant Hubris', 'Lethal Pride', 'Militant Faith', 'Glorious Vanity'];
    
    if (!m) {
        // console.log('parse jewel type was null')
        return ''
    }

    if (m.length === 0) {
        return ''
    } else if (!jewel_types.includes(m[1])){
        return ''
    } else {
        // console.log(`returning ${m[1]}`)
        return m[1]
    }
}

export function parse_jewel_mf_mods(jewel_text) {
    // // if it's not militant faith return a valid but empty value
    // if (parse_jewel_type(jewel_text) !== 'Militant Faith') {
    //     return []
    // } 
    
    const m = jewel_text.match(/Templars\n(.*)\n(.*)/);
    const mf_mods = ['Regenerate 0.6 Mana per Second per 10 Devotion',
                        '3% increased Effect of non-Damaging Ailments on Enemies per 10 Devotion',
                        '4% increased Area Damage per 10 Devotion',
                        '1% increased effect of Non-Curse Auras per 10 Devotion',
                        '4% increased Brand Damage per 10 Devotion',
                        'Channelling Skills deal 4% increased Damage per 10 Devotion',
                        '4% reduced Duration of Curses on you per 10 Devotion',
                        '4% reduced Elemental Ailment Duration on you per 10 Devotion',
                        '4% increased Elemental Damage per 10 Devotion',
                        '+2% to all Elemental Resistances per 10 Devotion',
                        'Minions have +60 to Accuracy Rating per 10 Devotion',
                        '1% increased Minion Attack and Cast Speed per 10 Devotion',
                        '1% reduced Mana Cost of Skills per 10 Devotion',
                        '3% increased Defences from Equipped Shield per 10 Devotion',
                        '4% increased Totem Damage per 10 Devotion'];

    if (!m) {
        return []
    } else if (m.length !== 3) {
        return []
    } else if (!mf_mods.includes(m[1]) || !mf_mods.includes(m[2])) {
        return []
    } else {
        return [m[1], m[2]]
    }
}