// Main orchestrator — ported from parser.py

function parseFile(data, exp) {
    const output = {
        inventory_list: "", instance_list: "", item_guid: ITEM_GUID_START,
        spells: "", skills: "", talents: "", action_list: "", faction_list: "",
        quests: "", glyphs: "", achievements: "", char_skills: "", pet_list: "",
        class_name: ""
    };

    // Validate player data
    const player = data.player;
    if (!player) {
        throw new Error("Input JSON is missing the required 'player' section.");
    }

    const missing = REQUIRED_PLAYER_FIELDS.filter(f => !(f in player));
    if (missing.length) {
        throw new Error(`Player data is missing required fields: ${missing.join(", ")}`);
    }

    const charClassRaw = player.class;
    if (classes[charClassRaw] === undefined) {
        throw new Error(`Unknown character class '${charClassRaw}'.`);
    }
    if (!skillmap[charClassRaw]) {
        throw new Error(`No skill mapping for class '${charClassRaw}'.`);
    }

    const charRaceRaw = player.race;
    if (races[charRaceRaw] === undefined) {
        throw new Error(`Unknown character race '${charRaceRaw}'.`);
    }
    if (factions[charRaceRaw] === undefined) {
        throw new Error(`No faction mapping for race '${charRaceRaw}'.`);
    }

    // Build slot cache and char info
    const slotCache = {};
    for (const slot of slots) slotCache[slot] = 0;

    output.class_name = charClassRaw;

    const charInfo = {
        char_name: player.name,
        char_gender: String(player.gender),
        char_class: classes[charClassRaw],
        char_race: races[charRaceRaw],
        char_level: String(player.level),
        char_money: String(player.gold),
        char_expansion: String(player.expansion),
        char_locale: player.locale,
        char_health: "10000",
        char_power: "0",
        playerBytes: String(player._customPlayerBytes ?? 0),
        playerBytes2: String(player._customPlayerBytes2 ?? 0)
    };
    charInfo.char_race_key = charRaceRaw;

    // Run parse pipeline
    addDefaultSkills(charClassRaw, parseInt(charInfo.char_level), output);
    parseBagContents(data, output, exp);
    parseEquipment(data, output, exp, slotCache);
    parsePet(data, classes[charClassRaw], output, exp);
    parseSpells(data, charInfo.char_level, output, exp);
    parseTalents(data, output, exp);
    parseActions(data, output, exp);
    parseFactions(data, output);
    parseQuests(data, output, exp);
    parseGlyphs(data, output);
    parseAchievements(data, output);
    parseCharSkills(data, charInfo.char_locale, output, exp);

    return assembleSQL(charInfo, slotCache, output, exp);
}
