// Rarity: Unique anchor will be different for every language, as will the jewel name
const ENGLISH_ANCHOR = 'Rarity: Unique'
export const ENGLISH_JEWEL_NAMES = ['Brutal Restraint', 'Elegant Hubris', 'Lethal Pride', 'Militant Faith', 'Glorious Vanity'];

const FRENCH_ANCHOR = 'Rareté: Unique'
const FRENCH_NAMES = ['Retenue brutale', 'Orgueil élégant', 'Fierté fatale', 'Foi militante', 'Vanité glorieuse'];

const GERMAN_ANCHOR = 'Seltenheit: Einzigartig'
const GERMAN_NAMES = ['Brutale Beherrschung', 'Heikler Übermut', 'Tödlicher Stolz', 'Militanter Glaube', 'Glorreiche Eitelkeit'];

export const ALL_RARITY_ANCHORS = [ENGLISH_ANCHOR, FRENCH_ANCHOR, GERMAN_ANCHOR]
export const ALL_JEWEL_NAMES = [...ENGLISH_JEWEL_NAMES, ...FRENCH_NAMES, ...GERMAN_NAMES]


export function map_jewel_name_to_english(jewel_name) {
    const LANGUAGES = [FRENCH_NAMES, GERMAN_NAMES]

    for (let i = 0; i < LANGUAGES.length; i++) {
        const index = LANGUAGES[i].findIndex((e) => e === jewel_name);
        if (index !== -1) {
            return ENGLISH_JEWEL_NAMES[index];
        }
    }
    return ''
}