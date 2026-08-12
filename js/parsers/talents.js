// Talents parser — ported from parsers/talents.py

// Pre-build spell_id -> (talent_id, rank) lookup from talentArray
const _spellToTalent = {};
for (const entry of talentArray) {
    for (let r = 0; r <= 4; r++) {
        const key = "r" + r;
        const spellId = parseInt(entry[key]);
        if (spellId !== 0) {
            _spellToTalent[spellId] = {
                talent_id: parseInt(entry.id),
                rank: r
            };
        }
    }
}

function parseTalents(data, output, exp) {
    if (exp < 2) return;

    const rawSpells = new Set(data.spells || []);
    const bestRank = {};

    for (const [spellIdStr, info] of Object.entries(_spellToTalent)) {
        const spellId = parseInt(spellIdStr);
        if (!rawSpells.has(spellId)) continue;
        if (bestRank[info.talent_id] === undefined || info.rank > bestRank[info.talent_id]) {
            bestRank[info.talent_id] = info.rank;
        }
    }

    for (const [talentIdStr, rank] of Object.entries(bestRank).sort()) {
        output.talents += talentTemplate.fill({
            talent_id: parseInt(talentIdStr),
            current_rank: rank
        });
    }
}
