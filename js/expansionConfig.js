// Expansion configuration — ported from config.py

const EXPAN_CONFIGS = {
    0: {
        instance_enchant_template: instanceEnchantTemplateVan,
        instance_template: instanceTemplate,
        characters_template: charactersTemplateVan,
        pet_template: petTemplate,
        action_template: actionTemplate,
        quest_template: questTemplate,
        gem_property_map: {},
        gem_id_property_map: {},
        socket_bonus_map: {},
        version_sql: "required_z2819_01_characters_item_instance_text_id_fix",
        default_bag_id: DEFAULT_BAG_ID_VANILLA,
        negate_suffix: false,
        is_wotlk: false
    },
    1: {
        instance_enchant_template: instanceEnchantTemplateTBC,
        instance_template: instanceTemplate,
        characters_template: charactersTemplateTBC,
        pet_template: petTemplate,
        action_template: actionTemplate,
        quest_template: questTemplate,
        gem_property_map: gemPropertyMap,
        gem_id_property_map: gemIDPropertyMap,
        socket_bonus_map: itemSocketBonusMap,
        version_sql: "required_s2473_01_characters_item_instance_text_id_fix",
        default_bag_id: DEFAULT_BAG_ID_WOTLK_TBC,
        negate_suffix: true,
        is_wotlk: false
    },
    2: {
        instance_enchant_template: instanceEnchantTemplateWOTLK,
        instance_template: instanceTemplateWotLK,
        characters_template: charactersTemplateWOTLK,
        pet_template: petTemplateWotLK,
        action_template: actionTemplateWotLK,
        quest_template: questTemplateWotLK,
        gem_property_map: gemPropertyMapWotLK,
        gem_id_property_map: gemIDPropertyMapWotlk,
        socket_bonus_map: itemSocketBonusMapWotlk,
        version_sql: "required_14061_01_characters_fishingSteps",
        default_bag_id: DEFAULT_BAG_ID_WOTLK_TBC,
        negate_suffix: true,
        is_wotlk: true
    }
};

function getExpConfig(exp) {
    return EXPAN_CONFIGS[exp];
}
