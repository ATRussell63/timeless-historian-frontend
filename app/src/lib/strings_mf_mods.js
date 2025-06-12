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
const FRENCH_MF_MODS = ['Tous les 10 de Ferveur, vous avez 0.6 de Mana Régénéré par seconde',
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


export const ALL_MF_ANCHORS = [ENGLISH_MF_ANCHOR, FRENCH_MF_ANCHOR];
export const ALL_MF_MODS = [...ENGLISH_MF_MODS, ...FRENCH_MF_MODS]

export function map_mf_mod_to_english(mod) {
    const LANGUAGES = [FRENCH_MF_MODS]
    
    for (let i = 0; i < LANGUAGES.length; i++) {
        const index = LANGUAGES[i].findIndex((e) => e === mod);
        if (index !== -1) {
            return ENGLISH_MF_MODS[index];
        }
    }
    return ''
}