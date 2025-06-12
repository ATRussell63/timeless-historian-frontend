// 'Templars' anchor will be different for every language, as will the MF mods themselves

const ENGLISH_MF_ANCHOR = 'Templars'
export const ENGLISH_MF_MODS = [
    'Regenerate 0.6 Mana per Second per 10 Devotion',
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

const FRENCH_MF_ANCHOR = 'Templiers'
const FRENCH_MF_MODS = [
    'Tous les 10 de Ferveur, vous avez 0.6 de Mana Régénéré par seconde',
    "Tous les 10 de Ferveur, vous avez 3% d'Augmentation de l'Effet sur les Ennemis de vos Altérations n'infligeant pas de Dégâts",
    "4% d'Augmentation des Dégâts de zone tous les 10 de Ferveur",
    "Tous les 10 de Ferveur, vous avez 1% d'Augmentation de l'Effet des Auras (Malédictions exceptés)",
    "4% d'Augmentation des Dégâts des Symboles tous les 10 de Ferveur",
    "Tous les 10 de Ferveur, les Aptitudes canalisées ont 4% d'Augmentation de Dégâts",
    "Tous les 10 de Ferveur, 4% de Réduction de la Durée des Malédictions vous affectant",
    "Tous les 10 de Ferveur, 4% de Réduction de la Durée des Altérations élémentaires vous affectant",
    "Tous les 10 de Ferveur, 4% d'Augmentation des Dégâts élémentaires",
    "Tous les 10 de Ferveur, +2% à toutes les Résistances élémentaires",
    "Tous les 10 de Ferveur, vous octroyez +60 de Score de Précision à vos Créatures",
    "Tous les 10 de Ferveur, vous avez 1% d'Augmentation de Vitesse d'attaque et d'incantation des Créatures",
    "1% de Réduction du Coût en Mana des Aptitudes tous les 10 de Ferveur",
    "Tous les 10 de Ferveur, 3% d'Augmentation des Défenses du bouclier équipé",
    "Tous les 10 de Ferveur, 4% d'Augmentation des Dégâts des Totems"
]

const GERMAN_MF_ANCHOR = 'Templern erobert'
const GERMAN_MF_MODS = [
    'Regeneriert 0.6 Mana pro Sekunde pro 10 Hingabe',
    '3% erhöhte Wirkung von nicht schädigenden Beeinträchtigungen bei Gegnern pro 10 Hingabe',
    '4% erhöhter Flächenschaden pro 10 Hingabe',
    '1% erhöhte Wirkung von Auren (Fluchauren ausgenommen) pro 10 Hingabe',
    '4% erhöhter Zeichenschaden pro 10 Hingabe',
    'Kanalisierungsfertigkeiten verursachen 4% erhöhten Schaden pro 10 Hingabe',
    '4% verkürzte Dauer von Flüchen auf Euch pro 10 Hingabe',
    '4% verlängerte Dauer von elementaren Beeinträchtigungen auf Euch pro 10 Hingabe',
    '4% erhöhter Elementarschaden pro 10 Hingabe',
    '+2% zu allen Elementarwiderständen pro 10 Hingabe',
    'Kreaturen haben +60 zu Treffergenauigkeit pro 10 Hingabe',
    '1% erhöhte Kreaturenangriffs- und Zaubergeschwindigkeit pro 10 Hingabe',
    '1% verringerte Manakosten von Fertigkeiten pro 10 Hingabe',
    '3% erhöhte Verteidigungswerte vom ausgerüsteten Schild pro 10 Hingabe',
    '4% erhöhter Totemschaden pro 10 Hingabe'
]

const PORTUGESE_MF_ANCHOR = 'Templários'
const PORTUGESE_MF_MODS = [
    '0.6 de Mana Regenerada por Segundo por cada 10 de Devoção',
    'Efeito de Afecções que não causam Dano nos Inimigos aumentado em 3% por cada 10 de Devoção',
    'Dano em Área aumentado em 4% por cada 10 de Devoção',
    'Efeito das Auras Não-Maldições aumentado em 1% por cada 10 de Devoção',
    'Dano de Runas aumentado em 4% por cada 10 de Devoção',
    'Habilidades Canalizadas causam Dano aumentado em 4% por cada 10 de Devoção',
    'Duração das Maldições em você reduzida em 4% por cada 10 de Devoção',
    'Duração das Afecções Elementais reduzidas em 4% por cada 10 de Devoção',
    'Dano Elemental aumentado em 4% por cada 10 de Devoção',
    '+2% de todas as Resistências Elementais por cada 10 de Devoção',
    'Lacaios tem +60 de Precisão por cada 10 de Devoção',
    'Velocidade de Ataque e Conjuração dos Lacaios aumentadas em 1% por cada 10 de Devoção',
    'Custo de Mana das Habilidades reduzido em 1% por cada 10 de Devoção Vida',
    'Defesas do Escudo Equipado aumentadas em 3% por cada 10 de Devoção',
    'Dano de Totens aumentado em 4% por cada 10 de Devoção'
]

const RUSSIAN_MF_ANCHOR = 'храмовниками'
const RUSSIAN_MF_MODS = [
    'Регенерация 0.6 маны в секунду за каждые 10 набожности',
    '3% усиление эффекта не наносящих урон состояний на врагах за каждые 10 набожности',
    '4% увеличение урона по области за каждые 10 набожности',
    '1% усиление эффекта аур не-проклятий за каждые 10 набожности',
    '4% увеличение урона клеймами за каждые 10 набожности',
    'Поддерживаемые умения наносят увеличенный на 4% урон за каждые 10 набожности',
    '4% уменьшение длительности проклятий на вас за каждые 10 набожности',
    '4% уменьшение длительности стихийных состояний на вас за каждые 10 набожности',
    '4% увеличение урона от стихий за каждые 10 набожности',
    '+2% к сопротивлению всем стихиям за каждые 10 набожности',
    'Приспешники имеют +60 к меткости за каждые 10 набожности',
    '1% повышение скорости атаки и сотворения чар приспешниками за каждые 10 набожности',
    '1% снижение затрат маны умениями за каждые 10 набожности',
    '3% повышение защиты от щита в руках за каждые 10 набожности',
    '4% увеличение урона тотемами за каждые 10 набожности'
]

const SPANISH_MF_ANCHOR = 'templarios'
const SPANISH_MF_MODS = [
    'Regeneras 0.6 de maná por segundo por cada 10 de Devoción',
    'Efecto de los estados alterados no dañinos sobre los enemigos aumentado un 3% por cada 10 de Devoción',
    'Daño de área aumentado un 4% por cada 10 de Devoción',
    'Efecto de las auras que no son maldiciones aumentado un 1% por cada 10 de Devoción',
    'Daño con marcas aumentado un 4% por cada 10 de devoción',
    'Las habilidades de canalización infligen su daño aumentado un 4% por cada 10 de Devoción',
    'Duración de las maldiciones sobre ti reducida un 4% por cada 10 de Devoción',
    'Duración de los estados alterados elementales sobre ti reducida un 4% por cada 10 de devoción',
    'Daño elemental aumentado un 4% por cada 10 de Devoción',
    '+2% a todas las resistencias elementales por cada 10 de Devoción',
    'Los esbirros tienen +60 a la precisión por cada 10 de Devoción',
    'Velocidades de ataque y lanzamiento de hechizos de los esbirros aumentadas un 1% por cada 10 de Devoción',
    'Costo de maná de las habilidades reducido un 1% por cada 10 de devoción',
    'Defensas por el escudo equipado aumentadas un 3% por cada 10 de Devoción',
    'Daño de tótems aumentado un 4% por cada 10 de Devoción'
]

const THAI_MF_ANCHOR = 'เหล่าเทมพลาร์'
const THAI_MF_MODS = [
    'ฟื้นฟูมานา 0.6 ต่อวินาที ต่อ ความภักดี 10 หน่วย',
    'เพิ่มผลของ สถานะเจ็บป่วยไร้ความเสียหาย ต่อศัตรู 3% ต่อ ความภักดี 10 หน่วย',
    'เพิ่มความเสียหาย พื้นที่ 4% ต่อ ความภักดี 10 หน่วย',
    'เพิ่มผลของ ออร่าที่ไม่ใช่คำสาป 1% ต่อ ความภักดี 10 หน่วย',
    'เพิ่มความเสียหายของ ตราเวท 4% ต่อ ความภักดี 10 หน่วย',
    'สกิลแชนเนล สร้างความเสียหาย เพิ่มขึ้น 4% ต่อ ความภักดี 10 หน่วย',
    'ลดระยะเวลาของคำสาป ต่อตัวคุณ 4% ต่อ ความภักดี 10 หน่วย',
    'ลดระยะเวลาของ สถานะเจ็บป่วยธาตุ ต่อตัวคุณ 4% ต่อ ความภักดี 10 หน่วย',
    'เพิ่มความเสียหาย ธาตุ 4% ต่อ ความภักดี 10 หน่วย',
    'ค่าต้านทาน ทุกธาตุ +2% ต่อ ความภักดี 10 หน่วย',
    'มิเนียน มีอัตราความแม่นยำ +60 ต่อ ความภักดี 10 หน่วย',
    'เพิ่มความเร็วในการโจมตีและร่ายของ มิเนียน 1% ต่อ ความภักดี 10 หน่วย',
    'ลดค่าใช้งานมานาของ สกิล 1% ต่อ ความภักดี 10 หน่วย',
    'เพิ่มค่าป้องกันจาก โล่ที่สวมใส่ 3% ต่อ ความภักดี 10 หน่วย',
    'เพิ่มความเสียหายของ โทเทม 4% ต่อ ความภักดี 10 หน่วย'
]

const KOREAN_MF_ANCHOR = '받음'
const KOREAN_MF_MODS = [
    '헌신 10당 1초마다 마나 0.6 재생',
    '헌신 10당 적에게 적용되는 비-피해 상태 이상 효과 3% 증가',
    '헌신 10당 범위 피해 4% 증가',
    '헌신 10당 비-저주 오라 효과 1% 증가',
    '헌신 10당 낙인 피해 4% 증가',
    '헌신 10당 집중 유지 스킬로 주는 피해 4% 증가',
    '헌신 10당 플레이어가에게 적용된 저주 지속시간 4% 감소',
    '헌신 10당 플레이어에게 적용되는 원소 상태 이상 지속시간 4% 감소',
    '헌신 10당 원소 피해 4% 증가',
    '헌신 10당 모든 원소 저항 +2%',
    '헌신 10당 소환수 정확도 +60',
    '헌신 10당 소환수 공격 및 시전 속도 1% 증가',
    '헌신 10당 스킬의 마나 소모 1% 감소',
    '헌신 10당 장착한 방패로 얻는 방어력 3% 증가',
    '헌신 10당 토템 피해 4% 증가'
]

export const ALL_MF_ANCHORS = [ENGLISH_MF_ANCHOR, FRENCH_MF_ANCHOR, GERMAN_MF_ANCHOR, PORTUGESE_MF_ANCHOR, RUSSIAN_MF_ANCHOR, SPANISH_MF_ANCHOR, THAI_MF_ANCHOR, KOREAN_MF_ANCHOR];
export const ALL_MF_MODS = [...ENGLISH_MF_MODS, ...FRENCH_MF_MODS, ...GERMAN_MF_MODS, ...PORTUGESE_MF_MODS, ...RUSSIAN_MF_MODS, ...SPANISH_MF_MODS, ...THAI_MF_MODS, ...KOREAN_MF_MODS];

export function map_mf_mod_to_english(mod) {
    const LANGUAGES = [FRENCH_MF_MODS, GERMAN_MF_MODS, PORTUGESE_MF_MODS, RUSSIAN_MF_MODS, SPANISH_MF_MODS, THAI_MF_MODS, KOREAN_MF_MODS]
    
    for (let i = 0; i < LANGUAGES.length; i++) {
        const index = LANGUAGES[i].findIndex((e) => e === mod);
        if (index !== -1) {
            return ENGLISH_MF_MODS[index];
        }
    }
    return ''
}