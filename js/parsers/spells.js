// Spells parser — ported from parsers/spells.py

function parseSpells(data, charLevel, output, exp) {
    const rawSpells = data.spells || [];
    const seen = new Set();

    if (exp > 0 && !rawSpells.includes(SPELL_GENERIC_MOUNT)) {
        output.spells += spellTemplate.fill({ spell_id: SPELL_GENERIC_MOUNT });
        seen.add(SPELL_GENERIC_MOUNT);
    }

    for (const sp of rawSpells) {
        let spellId = parseInt(sp);

        if (spellId === 348700) spellId = SPELL_REMAP_348700;
        else if (spellId === 348704) spellId = SPELL_REMAP_348704;

        if (seen.has(spellId)) continue;

        if (exp === 0 && ridingSpellMap[spellId] !== undefined) {
            let ridingSkill = RIDER_SKILL_NORMAL;
            let ridingSpell = SPELL_RIDE60;
            if (charLevel === "60") {
                ridingSkill = RIDER_SKILL_MAX;
                ridingSpell = SPELL_RIDE100;
            }

            output.skills += skillsTemplate.fill({
                skill_id: ridingSpellMap[spellId],
                current_skill: ridingSkill,
                max_skill: ridingSkill
            });
            if (!seen.has(ridingSpell)) {
                output.spells += spellTemplate.fill({ spell_id: ridingSpell });
                seen.add(ridingSpell);
            }
        }

        seen.add(spellId);
        output.spells += spellTemplate.fill({ spell_id: spellId });
    }
}
