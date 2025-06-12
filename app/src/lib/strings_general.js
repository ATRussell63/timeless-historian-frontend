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


export const ALL_GENERAL_NAMES = [...LATIN_GENERAL_NAMES]

export function map_general_name_to_latin(general_name) {
    const LANGUAGES = []

    for (let i = 0; i < LANGUAGES.length; i++) {
        const index = LANGUAGES[i].findIndex((e) => e === general_name);
        if (index !== -1) {
            return LATIN_GENERAL_NAMES[index];
        }
    }
    return ''
}