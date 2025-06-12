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

export const ALL_MF_ANCHORS = [ENGLISH_MF_ANCHOR, FRENCH_MF_ANCHOR, GERMAN_MF_ANCHOR, PORTUGESE_MF_ANCHOR, RUSSIAN_MF_ANCHOR];
export const ALL_MF_MODS = [...ENGLISH_MF_MODS, ...FRENCH_MF_MODS, ...GERMAN_MF_MODS, ...PORTUGESE_MF_MODS, ...RUSSIAN_MF_MODS];

export function map_mf_mod_to_english(mod) {
    const LANGUAGES = [FRENCH_MF_MODS, GERMAN_MF_MODS, PORTUGESE_MF_MODS, RUSSIAN_MF_MODS]
    
    for (let i = 0; i < LANGUAGES.length; i++) {
        const index = LANGUAGES[i].findIndex((e) => e === mod);
        if (index !== -1) {
            return ENGLISH_MF_MODS[index];
        }
    }
    return ''
}