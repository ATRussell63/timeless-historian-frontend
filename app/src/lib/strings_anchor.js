import { KOREAN_GENERAL_NAMES } from "./strings_general"

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

const THAI = [
    'รับใช้อังคะราแห่ง', // BR
    'สั่งทำเหรียญเป็นอนุสรณ์แด่', // EH
    'อาบเลือดเครื่องสังเวยในนามแห่ง', // GV
    'นำทัพนักรบใต้บัญชาแห่ง', // LP
    'สลักไว้เพื่อเชิดชูผู้ถูกแปรพักตร์โดยเทมพลาร์ระดับสูง', // MF
]

// seed line starts with the general's name in korean
const KOREAN = KOREAN_GENERAL_NAMES

export const ALL_SEED_LINE_ANCHORS = [...ENGLISH, ...FRENCH, ...GERMAN, ...PORTUGESE, ...RUSSIAN, ...SPANISH, ...THAI, ...KOREAN];