// different character systems will have different names

export const LATIN_GENERAL_NAMES = [
    'Asenath',
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

const RUSSIAN_GENERAL_NAMES = [
    'Азенат',
    'Балбалы',
    'Насимы',
    'Кадиро',
    'Каспиро',
    'Виктарио',
    'Ахваны',
    'Дориани',
    'Шибаквы',
    'Акойи',
    'Каома',
    'Ракиаты',
    'Аварием',
    'Владыкой',
    'Макерием'
]


export const ALL_GENERAL_NAMES = [...LATIN_GENERAL_NAMES, ...RUSSIAN_GENERAL_NAMES]

export function map_general_name_to_latin(general_name) {
    const LANGUAGES = [RUSSIAN_GENERAL_NAMES]

    for (let i = 0; i < LANGUAGES.length; i++) {
        const index = LANGUAGES[i].findIndex((e) => e === general_name);
        if (index !== -1) {
            return LATIN_GENERAL_NAMES[index];
        }
    }
    return ''
}