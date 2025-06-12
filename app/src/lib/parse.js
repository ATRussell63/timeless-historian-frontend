import { ALL_SEED_LINE_ANCHORS } from "./strings_anchor";
import { ALL_GENERAL_NAMES, LATIN_GENERAL_NAMES, KOREAN_GENERAL_NAMES, map_general_name_to_latin } from "./strings_general";
import { ALL_RARITY_ANCHORS, ALL_JEWEL_NAMES, ENGLISH_JEWEL_NAMES, map_jewel_name_to_english } from "./strings_jewel_name";
import { ALL_MF_ANCHORS, ENGLISH_MF_MODS, map_mf_mod_to_english } from "./strings_mf_mods";

export function parse_jewel_seed(jewel_text) {
    if (jewel_text.length === 0) {
        return ''
    }

    const capture_seed = new RegExp(`(?:${ALL_SEED_LINE_ANCHORS.join('|')}).* (\\d+)`);
    const m = jewel_text.match(capture_seed);

    if (!m || m.length === 0) {
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

    //weirdly only Portugese includes the roll range for generals on this line regardless of holding alt
    const capture_general = new RegExp(`(?:${ALL_SEED_LINE_ANCHORS.join('|')}).* (${ALL_GENERAL_NAMES.join('|')})`)
    const m = jewel_text.match(capture_general);
    
    if (!m || m.length === 0) {
        // korean requires a different regex since general is the anchor
        const re = new RegExp(`(${KOREAN_GENERAL_NAMES.join('|')})`)
        const match = jewel_text.match(re)

        if (match) {
            return map_general_name_to_latin(match[0])
        }
        
        return ''
    }
    
    let parsed_general = m[1];
    if (LATIN_GENERAL_NAMES.includes(parsed_general)) {
        return parsed_general
    } else {
        // go through each language set and return the mapped latin general name
        return map_general_name_to_latin(parsed_general)
    }
}

export function parse_jewel_type(jewel_text) {
    if (jewel_text.length === 0) {
        return ''
    }

    const capture_type = new RegExp(`(?:${ALL_RARITY_ANCHORS.join('|')})\\n(${ALL_JEWEL_NAMES.join('|')})`);
    const m = jewel_text.match(capture_type);

    if (!m || m.length === 0) {
        return ''
    }
    
    let parsed_jewel_name = m[1]
    if (ENGLISH_JEWEL_NAMES.includes(parsed_jewel_name)){
        return parsed_jewel_name
    } else {
        return map_jewel_name_to_english(parsed_jewel_name)
    }
}

export function parse_jewel_mf_mods(jewel_text) {
    
    const capture_mf_mods = new RegExp(`(?:${ALL_MF_ANCHORS.join('|')})\\n(.*)\\n(.*)`);
    const m = jewel_text.match(capture_mf_mods);

    if (!m || m.length !== 3) {
        return ['', '']
    } else if (ENGLISH_MF_MODS.includes(m[1]) && ENGLISH_MF_MODS.includes(m[2])) {
        return [m[1], m[2]]
    } else {
        return [map_mf_mod_to_english(m[1]), map_mf_mod_to_english(m[2])]
    }
}