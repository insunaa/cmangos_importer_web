// Equipment parser — ported from parsers/equipment.js

function parseEquipment(data, output, exp, slotCache) {
    const equipment = data.equipment || {};
    for (const [slotName, item] of Object.entries(equipment)) {
        if (slotMap[slotName] === undefined) {
            console.warn(`Unknown equipment slot '${slotName}', skipping.`);
            continue;
        }

        const fields = normalizeItemFields(item);
        addToItemlists(output, exp, slotMap[slotName], item.id,
            fields.suffix, fields.enchant, fields.gems, fields.buckle);
        slotCache[slotName] = item.id;
    }
}
