// Item normalization — ported from items/normalizer.py

function defaultGems() {
    return [
        { id: 0, matched: false },
        { id: 0, matched: false },
        { id: 0, matched: false }
    ];
}

function padGems(rawGems) {
    const result = defaultGems();
    if (!rawGems) return result;
    for (let i = 0; i < rawGems.length && i < 3; i++) {
        result[i] = { id: parseInt(rawGems[i].id), matched: Boolean(rawGems[i].matched) };
    }
    return result;
}

function normalizeItemFields(item) {
    const suffixRaw = item.suffix || 0;
    const enchantRaw = item.enchantId || 0;
    const buckleRaw = item.buckle;
    return {
        suffix: suffixRaw ? String(suffixRaw) : "0",
        enchant: enchantRaw ? String(enchantRaw) : "0",
        gems: padGems(item.gems),
        buckle: buckleRaw !== undefined ? String(buckleRaw).toLowerCase() : "false"
    };
}
