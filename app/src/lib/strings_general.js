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

const THAI_GENERAL_NAMES = [
    'แอเซแนธ',
    'บัลบาล่า',
    'นาซิมา',
    'คาดิโร',
    'แคสปีโรด',
    'วิคทาริโอ',
    'อะฮัวนา',
    'ดอร์ยานี',
    'ซิบาคัว',
    'อะโคยา',
    'คอมม์',
    'ราคียาตา',
    'อาวาริอุส',
    'โดมินัส',
    'แม็กซาเรียส'
]

export const KOREAN_GENERAL_NAMES = [
    '아세나스의',
    '발바라의',
    '나시마의',
    '카디로를',
    '카스피로를',
    '빅타리오를',
    '아후아나의',
    '도리아니의',
    '지바콰의',
    '아코야',
    '카옴',
    '라키아타',
    '고위 템플러 아배리우스가',
    '고위 템플러 도미누스가',
    '고위 템플러 막사리우스가'   
]

export const JAPANESE_GENERAL_NAMES = [
    'アセナスとのアカーラにより',
    'バルバラとのアカーラにより',
    'ナシマとのアカーラにより',
    'カディーロの記念コインを',
    'カスピロの記念コインを',
    'ヴィクタリオの記念コインを',
    'アフアナの名において捧げられた',
    'ドリヤニの名において捧げられた',
    'シバクアの名において捧げられた',
    'アコヤ配下の',
    'カオム配下の',
    'ラキアタ配下の',
    'ハイテンプラーアヴァリウスが改宗させた',
    'ハイテンプラードミナスが改宗させた',
    'ハイテンプラーマクサリウスが改宗させた'
]

export const ALL_GENERAL_NAMES = [...LATIN_GENERAL_NAMES, ...RUSSIAN_GENERAL_NAMES, ...THAI_GENERAL_NAMES]

export function map_general_name_to_latin(general_name) {
    const LANGUAGES = [RUSSIAN_GENERAL_NAMES, THAI_GENERAL_NAMES, KOREAN_GENERAL_NAMES, JAPANESE_GENERAL_NAMES]

    for (let i = 0; i < LANGUAGES.length; i++) {
        const index = LANGUAGES[i].findIndex((e) => e === general_name);
        if (index !== -1) {
            return LATIN_GENERAL_NAMES[index];
        }
    }
    return ''
}