// Enchantment building — ported from items/enchantments.py

function lookupSuffixEnchants(suffixStr) {
    if (suffixTable[suffixStr] !== undefined) {
        const vals = suffixTable[suffixStr];
        return [vals[0], vals[1], vals[2]];
    }
    if (suffixTable2[suffixStr] !== undefined) {
        const vals = suffixTable2[suffixStr];
        return [vals[0], vals[1], vals[2]];
    }
    return [...MAIN_ENCHANTS_ZERO_FILL];
}

function resolveSocketBonus(matched, itemEntry, socketBonusMap) {
    if (!matched.includes(false) && matched.includes(true) && socketBonusMap[itemEntry] !== undefined) {
        return socketBonusMap[itemEntry];
    }
    return 0;
}

function resolveGemValues(gemIds, gemIdPropertyMap, gemPropertyMap) {
    return [
        gemPropertyMap[gemIdPropertyMap[parseInt(gemIds[0])]],
        gemPropertyMap[gemIdPropertyMap[parseInt(gemIds[1])]],
        gemPropertyMap[gemIdPropertyMap[parseInt(gemIds[2])]]
    ];
}

function buildEnchantmentsVanilla(enchant, suffixStr) {
    const [e1, e2, e3] = lookupSuffixEnchants(suffixStr);
    return instanceEnchantTemplateVan.fill({
        main_enchant: enchant, enchant_1: e1, enchant_2: e2, enchant_3: e3
    });
}

function buildEnchantmentsPostVanilla(enchant, suffixStr, matched, itemEntry, buckle, config, gemIds) {
    const socketBonus = resolveSocketBonus(matched, itemEntry, config.socket_bonus_map);

    let sStr = suffixStr;
    if (config.is_wotlk && !suffixTable[suffixStr]) {
        sStr = "0";
    }

    const [g1, g2, g3] = resolveGemValues(gemIds, config.gem_id_property_map, config.gem_property_map);

    let sufE1, sufE2, sufE3;
    [sufE1, sufE2, sufE3] = lookupSuffixEnchants(sStr);

    if (config.is_wotlk && buckle !== "false") {
        sufE1 = BUCKLE_ENCHANT_ID;
    }

    return config.instance_enchant_template.fill({
        main_enchant: enchant, gem1: g1, gem2: g2, gem3: g3,
        socket_bonus: socketBonus, enchant_1: sufE1, enchant_2: sufE2, enchant_3: sufE3
    });
}

function buildEnchantments(exp, enchant, suffixStr, matched, itemEntry, buckle, gemIds) {
    if (exp === 0) {
        return buildEnchantmentsVanilla(enchant, suffixStr);
    }
    const config = getExpConfig(exp);
    return buildEnchantmentsPostVanilla(enchant, suffixStr, matched, itemEntry, buckle, config, gemIds);
}
