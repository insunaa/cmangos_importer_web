// Output assembly — ported from output.py

function emptyEnchant(exp) {
    if (exp === 0) {
        return instanceEnchantTemplateVan.fill({
            main_enchant: 0, enchant_1: 0, enchant_2: 0, enchant_3: 0
        });
    } else if (exp === 1) {
        return instanceEnchantTemplateTBC.fill({
            main_enchant: 0, gem1: 0, gem2: 0, gem3: 0, socket_bonus: 0,
            enchant_1: 0, enchant_2: 0, enchant_3: 0
        });
    } else {
        return instanceEnchantTemplateWOTLK.fill({
            main_enchant: 0, gem1: 0, gem2: 0, gem3: 0, socket_bonus: 0,
            enchant_1: 0, enchant_2: 0, enchant_3: 0
        });
    }
}

function fillEquipmentCache(slotCache) {
    const cacheValues = {};
    for (const [k, v] of EQUIP_CACHE_SLOTS) {
        cacheValues[v] = slotCache[k] || 0;
    }
    return equipmentTemplate.fill(cacheValues);
}

function assembleSQL(charInfo, slotCache, output, exp) {
    const config = getExpConfig(exp);

    const factionKey = factions[charInfo.char_race_key];
    const startPos = startPosMap[exp][factionKey];
    const [posX, posY, posZ, startMap] = startPos;

    const equipmentCache = fillEquipmentCache(slotCache);

    let emptyEnchantStr, charactersRow;

    if (exp === 2) {
        emptyEnchantStr = instanceEnchantTemplateWOTLK.fill({
            main_enchant: 0, gem1: 0, gem2: 0, gem3: 0, socket_bonus: 0,
            enchant_1: 0, enchant_2: 0, enchant_3: 0
        });
        charactersRow = config.characters_template.fill({
            ...charInfo, pos_x: posX, pos_y: posY, pos_z: posZ,
            start_map: startMap, equipmentCache: equipmentCache
        });
    } else {
        emptyEnchantStr = emptyEnchant(exp);
        charactersRow = config.characters_template.fill({
            ...charInfo, pos_x: posX, pos_y: posY, pos_z: posZ,
            start_map: startMap, equipmentCache: equipmentCache
        });
    }

    return pdumpTemplate.fill({
        bag_id: config.default_bag_id,
        characters_row: charactersRow,
        enchantments: emptyEnchantStr,
        database_version: config.version_sql,
        pos_x: posX, pos_y: posY, pos_z: posZ,
        start_map: startMap,
        skills: output.char_skills,
        actions: output.action_list,
        quests: output.quests,
        inventory_list: output.inventory_list,
        pet_list: output.pet_list,
        spells: output.spells,
        talents: output.talents,
        instance_list: output.instance_list,
        factions: output.faction_list,
        text: exp === 2 ? ", ''" : "",
        glyphs: output.glyphs,
        achievements: output.achievements
    });
}

function downloadSQL(sqlContent, filename) {
    const blob = new Blob([sqlContent], { type: "text/sql" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
