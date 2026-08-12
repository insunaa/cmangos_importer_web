// Quests parser — ported from parsers/quests.py

function parseQuests(data, output, exp) {
    const config = getExpConfig(exp);
    const rawQuests = Array.isArray(data.quests) ? data.quests : [];
    for (const questId of rawQuests) {
        output.quests += config.quest_template.fill({ quest_id: questId });
    }
}
