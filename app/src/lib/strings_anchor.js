// line anchor will vary based on language every time

const ENGLISH = [
    'Denoted', // BR
    'Commissioned', // EH
    'Bathed', // GV
    'Carved', // LP
    'Commanded', // MF
]

const FRENCH = [
    'A commémoré', // BR
    'A commandé', // EH
    'Imprégné', // GV
    'A fait', // LP
    'Gravé pour', // MF
]

const GERMAN = [
    'Im ergebenen', // BR
    'Unter der', // EH
    'Gebadet', // GV
    'Übernahm', // LP
    'Im Namen', // MF
]

const PORTUGESE = [
    'Denota', // BR
    'Comissionadas', // EH
    'Banhado', // GV
    'Liderança', // LP
    'Talhado', // MF
]

const RUSSIAN = [
    'Символизирует', // BR
    'Выделено', // EH
    'Омыт в', // GV
    'Повелевает', // LP
    'Выточен во', // MF
]

const SPANISH = [
    'Denota', // BR
    'Se encargaron', // EH
    'Bañada', // GV
    'Otorgada', // LP
    'Tallada', // MF
]


export const ALL_SEED_LINE_ANCHORS = [...ENGLISH, ...FRENCH, ...GERMAN, ...PORTUGESE, ...RUSSIAN, ...SPANISH];