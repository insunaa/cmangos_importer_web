// Bags parser — ported from parsers/bags.py
// Detects overflow from backpack slots 17-20 and redistributes to gaps in other bags.

function _scanBagUsage(bagEntries) {
    const usage = new Map();
    for (const item of bagEntries) {
        if (item.count === undefined || item.slot === undefined) continue;
        const bagNum = parseInt(item.bag);
        if (!usage.has(bagNum)) usage.set(bagNum, new Set());
        usage.get(bagNum).add(parseInt(item.slot) - 1);
    }
    return usage;
}

function _findEmptySlotsInBag(used, needed) {
    if (!used || !used.size) return null;
    // Bag capacity = highest occupied slot index + 1.
    // Only fill gaps between existing items (idx < maxSlot).
    const maxIdx = Math.max(...used);
    const result = [];
    for (let idx = 0; idx < maxIdx && result.length < needed; idx++) {
        if (!used.has(idx)) result.push(idx);
    }
    return result.length ? result : null;
}

function _redistributeBagOverflow(bagEntries, containerGuidMap) {
    const usage = _scanBagUsage(bagEntries);

    // Collect backpack overflow items (bag 0, slot index >= MAX_BACKPACK_SLOTS)
    const overflow = [];
    for (const item of bagEntries) {
        if (item.count === undefined || item.slot === undefined) continue;
        const bagNum = parseInt(item.bag);
        if (bagNum !== 0) continue;
        const slotIdx = parseInt(item.slot) - 1;
        if (slotIdx >= MAX_BACKPACK_SLOTS) {
            overflow.push(item);
        }
    }

    if (!overflow.length) return;

    console.log(`Bag overflow detected: ${overflow.length} item(s) in backpack slots 17+.`);

    // Find which bags can receive overflow items. Exclude bag 0 (backpack itself).
    const allBags = [...usage.keys()];
    const candidateBags = allBags.filter(b => b !== 0);

    let remaining = overflow.slice();
    let redistributed = 0;

    for (const bagNum of candidateBags) {
        if (!remaining.length) break;
        const freeSlots = _findEmptySlotsInBag(usage.get(bagNum), remaining.length);
        if (!freeSlots || !freeSlots.length) continue;

        const toMove = Math.min(remaining.length, freeSlots.length);
        for (let i = 0; i < toMove; i++) {
            remaining[i].bag = String(bagNum);
            remaining[i].slot = String(freeSlots[i] + 1);
            usage.get(bagNum).add(freeSlots[i]);
            redistributed++;
        }
        remaining = remaining.slice(toMove);
    }

    if (redistributed > 0)
        console.log(`Redistributed ${redistributed} item(s) to other bags.`);
    if (remaining.length)
        console.warn(`${remaining.length} overflow item(s) could not be redistributed — no bag gaps available.`);
}

function parseBagContents(data, output, exp) {
    const bagEntries = data.bagContents || [];
    if (!bagEntries.length) return;

    // First pass: assign deterministic GUIDs to container entries
    const containerGuidMap = {};
    let containerIdx = 0;
    for (const item of bagEntries) {
        if (item.count === undefined && item.slot === undefined) {
            const bagNum = parseInt(item.bag);
            containerGuidMap[bagNum] = ITEM_GUID_START + (containerIdx * ITEM_GUID_INCREMENT);
            containerIdx++;
        }
    }

    // Pre-process: redistribute overflow from backpack slots 17-20
    for (const item of bagEntries) {
        if (item.slot !== undefined) item._origSlot = item.slot;
    }
    _redistributeBagOverflow(bagEntries, containerGuidMap);

    // Second pass: actually add everything
    for (const item of bagEntries) {
        if (item.count === undefined && item.slot === undefined) {
            const slotId = parseInt(item.bag) + BAG_EQUIP_SLOT_OFFSET;
            addToItemlists(output, exp, slotId, item.id, "0", "0", defaultGems(), "false");
            continue;
        }

        const bagNum = parseInt(item.bag);
        let invBagId, slotId;
        if (containerGuidMap[bagNum] !== undefined) {
            invBagId = String(containerGuidMap[bagNum]);
            slotId = parseInt(item.slot) - 1;
        } else {
            invBagId = "0";
            slotId = parseInt(item.slot) - 1 + EQUIPMENT_SLOT_COUNT;
        }

        const fields = normalizeItemFields(item);
        addToItemlists(output, exp, slotId, item.id, fields.suffix, fields.enchant,
            fields.gems, fields.buckle, { bag_id: invBagId, item_count: item.count || 1 });
    }
}
