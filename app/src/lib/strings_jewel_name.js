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

const SPANISH_ANCHOR = 'Rareza: Único'
const SPANISH_NAMES = ['Restricción brutal', 'Arrogancia elegante', 'Vanidad gloriosa', 'Orgullo letal', 'Fe combativa']

const THAI_ANCHOR = 'ความหายาก: ยูนิค'
const THAI_NAMES = ENGLISH_JEWEL_NAMES

const KOREAN_ANCHOR = '아이템 희귀도: 고유'
const KOREAN_NAMES = ['잔인한 속박', '고상한 오만', '찬란한 허영심', '치명적인 긍지', '호전적인 신념']

const JAPANESE_ANCHOR = 'レアリティ: ユニーク'
const JAPANESE_NAMES = ['残忍な自制心', '上品な慢心', '栄光ある虚栄心', '致命的な自尊心', '戦闘的な信仰心']

export const ALL_RARITY_ANCHORS = [ENGLISH_ANCHOR, FRENCH_ANCHOR, GERMAN_ANCHOR, PORTUGESE_ANCHOR, RUSSIAN_ANCHOR, SPANISH_ANCHOR, THAI_ANCHOR, KOREAN_ANCHOR, JAPANESE_ANCHOR]
export const ALL_JEWEL_NAMES = [...ENGLISH_JEWEL_NAMES, ...FRENCH_NAMES, ...GERMAN_NAMES, ...PORTUGESE_NAMES, ...RUSSIAN_NAMES, ...SPANISH_NAMES, ...THAI_NAMES, ...KOREAN_NAMES, ...JAPANESE_NAMES]


export function map_jewel_name_to_english(jewel_name) {
    const LANGUAGES = [FRENCH_NAMES, GERMAN_NAMES, PORTUGESE_NAMES, RUSSIAN_NAMES, SPANISH_NAMES, KOREAN_NAMES, JAPANESE_NAMES]

    for (let i = 0; i < LANGUAGES.length; i++) {
        const index = LANGUAGES[i].findIndex((e) => e === jewel_name);
        if (index !== -1) {
            return ENGLISH_JEWEL_NAMES[index];
        }
    }
    return ''
}