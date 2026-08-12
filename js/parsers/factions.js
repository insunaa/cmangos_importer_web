// Factions parser — ported from parsers/factions.py

function parseFactions(data, output) {
    const rawFactions = data.factions || [];
    for (const faction of rawFactions) {
        output.faction_list += factionTemplate.fill({
            faction_id: faction.factionID,
            faction_standing: faction.earnedValue
        });
    }
}
