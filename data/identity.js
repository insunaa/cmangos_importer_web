// Character identity lookups — slotMap, races, classes, factions, startPosMap, genericPetModelMap

const CHAR_GUID = 500;
const ITEM_GUID_START = 10000;
const ITEM_GUID_INCREMENT = 2;
const EQUIPMENT_SLOT_COUNT = 23;
const BAG_EQUIP_SLOT_OFFSET = 18;
const MAIN_ENCHANTS_ZERO_FILL = [0, 0, 0, 0];
const MAX_BACKPACK_SLOTS = 16;

const SPELL_GENERIC_MOUNT = 34093;
const SPELL_REMAP_348700 = 31892;
const SPELL_REMAP_348704 = 31801;
const RIDER_SKILL_NORMAL = 75;
const RIDER_SKILL_MAX = 150;
const SPELL_RIDE60 = 33388;
const SPELL_RIDE100 = 33391;

const MACRO_MIN_SLOT = 100;
const MACRO_GUID_BASE = 16777216;
const MACRO_GUID_OFFSET = 120;
const ACHIEVEMENT_YEAR_OFFSET = 2000;

const DEFAULT_PET_MODEL = 706;
const DEFAULT_BAG_ID_WOTLK_TBC = 23162;
const DEFAULT_BAG_ID_VANILLA = 14156;

const BUCKLE_ENCHANT_ID = 3729;

const REQUIRED_PLAYER_FIELDS = [
    "name", "gender", "class", "race", "level", "gold", "expansion", "locale"
];

const EQUIP_CACHE_SLOTS = [
    ["head", "head"], ["neck", "neck"], ["shoulder", "shoulder"],
    ["shirt", "shirt"], ["chest", "chest"], ["waist", "belt"],
    ["legs", "legs"], ["feet", "feet"], ["wrist", "wrist"],
    ["hands", "gloves"], ["back", "back"], ["main_hand", "mainhand"],
    ["off_hand", "offhand"], ["relic", "ranged"], ["tabard", "tabard"]
];

const slotMap = {
    head: 0, neck: 1, shoulder: 2, shirt: 3, chest: 4, waist: 5,
    legs: 6, feet: 7, wrist: 8, hands: 9, finger1: 10,
    finger2: 11, trinket1: 12, trinket2: 13, back: 14,
    main_hand: 15, off_hand: 16, relic: 17, tabard: 18
};

const slots = [
    "head", "neck", "shoulder", "shirt", "chest", "waist",
    "legs", "feet", "wrist", "hands", "finger1", "finger2",
    "trinket1", "trinket2", "back", "main_hand", "off_hand",
    "relic", "tabard"
];

const startPosMap = {
    0: {
        horde: ["1629.36", "-4373.4", "31.26", "1"],
        alliance: ["-8833.38", "628.62", "94", "0"]
    },
    1: {
        horde: ["-1817.69", "5321.56", "-12.4282", "530"],
        alliance: ["-1817.69", "5321.56", "-12.4282", "530"]
    },
    2: {
        horde: ["5804.14", "624.77", "647.8", "571"],
        alliance: ["5804.14", "624.77", "647.8", "571"]
    }
};

const factions = {
    "Human": "alliance", "Orc": "horde", "Dwarf": "alliance",
    "Night Elf": "alliance", "Undead": "horde", "Tauren": "horde",
    "Gnome": "alliance", "Troll": "horde", "Blood Elf": "horde",
    "Draenei": "alliance"
};

const races = {
    "Human": 1, "Orc": 2, "Dwarf": 3, "Night Elf": 4,
    "Undead": 5, "Tauren": 6, "Gnome": 7, "Troll": 8,
    "Blood Elf": 10, "Draenei": 11
};

const classes = {
    warrior: 1, paladin: 2, hunter: 3, rogue: 4, priest: 5,
    shaman: 7, mage: 8, warlock: 9, druid: 11, deathknight: 12
};

const genericPetModelMap = {
    "Bat": 7894, "Bear": 706, "Boar": 4714, "Carrion Bird": 20348,
    "Cat": 9954, "Crab": 699, "Crocolisk": 2850, "Dragonhawk": 20263,
    "Gorilla": 8129, "Hyena": 10904, "Nether Ray": 20098,
    "Bird of Prey": 10831, "Raptor": 19758, "Ravager": 20063,
    "Scorpid": 15433, "Serpent": 4312, "Spider": 17180,
    "Sporebat": 17751, "Tallstrider": 38, "Turtle": 5027,
    "Warp Stalker": 19998, "Wind Serpent": 3204, "Wolf": 741
};

// Action type mapping
const actionMap = { spell: 0, macro: 64, item: 128, companion: 0 };
