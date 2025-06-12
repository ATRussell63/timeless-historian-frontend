// Rarity: Unique anchor will be different for every language, as will the jewel name
const ENGLISH_ANCHOR = 'Rarity: Unique'
export const ENGLISH_JEWEL_NAMES = ['Brutal Restraint', 'Elegant Hubris', 'Glorious Vanity', 'Lethal Pride', 'Militant Faith'];

const FRENCH_ANCHOR = 'Rareté: Unique'
const FRENCH_NAMES = ['Retenue brutale', 'Orgueil élégant', 'Vanité glorieuse', 'Fierté fatale', 'Foi militante'];

const GERMAN_ANCHOR = 'Seltenheit: Einzigartig'
const GERMAN_NAMES = ['Brutale Beherrschung', 'Heikler Übermut', 'Glorreiche Eitelkeit', 'Tödlicher Stolz', 'Militanter Glaube'];

const PORTUGESE_ANCHOR = 'Raridade: Único'
const PORTUGESE_NAMES = ['Restrição Brutal', 'Arrogância Elegante', 'Vaidade Gloriosa', 'Orgulho Letal', 'Fé Militante'];

const RUSSIAN_ANCHOR = 'Редкость: Уникальный'
const RUSSIAN_NAMES = ['Жестокая сдержанность', 'Изящный эготизм', 'Блистательное тщеславие', 'Смертельная гордость', 'Воинственная вера']

export const ALL_RARITY_ANCHORS = [ENGLISH_ANCHOR, FRENCH_ANCHOR, GERMAN_ANCHOR, PORTUGESE_ANCHOR, RUSSIAN_ANCHOR]
export const ALL_JEWEL_NAMES = [...ENGLISH_JEWEL_NAMES, ...FRENCH_NAMES, ...GERMAN_NAMES, ...PORTUGESE_NAMES, ...RUSSIAN_NAMES]


export function map_jewel_name_to_english(jewel_name) {
    const LANGUAGES = [FRENCH_NAMES, GERMAN_NAMES, PORTUGESE_NAMES, RUSSIAN_NAMES]

    for (let i = 0; i < LANGUAGES.length; i++) {
        const index = LANGUAGES[i].findIndex((e) => e === jewel_name);
        if (index !== -1) {
            return ENGLISH_JEWEL_NAMES[index];
        }
    }
    return ''
}