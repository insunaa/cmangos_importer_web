// Item assembly — ported from items/assembly.py

function addToItemlists(output, exp, slotId, itemEntry, suffix, enchant, gems, buckle, opts) {
    const bagId = (opts && opts.bag_id) || "0";
    const itemCount = (opts && opts.item_count) || 1;

    suffix = Math.abs(parseInt(suffix));

    output.inventory_list += wornTemplate.fill({
        slot_id: slotId, item_guid: output.item_guid,
        item_entry: itemEntry, bag_id: bagId
    });

    const config = getExpConfig(exp);
    const matchedList = [gems[0].matched, gems[1].matched, gems[2].matched];
    const gemIds = [gems[0].id, gems[1].id, gems[2].id];

    const enchantments = buildEnchantments(
        exp, enchant, String(suffix), matchedList, parseInt(itemEntry), buckle, gemIds
    );

    const effectiveSuffix = config.negate_suffix ? -suffix : suffix;

    output.instance_list += config.instance_template.fill({
        item_guid: output.item_guid, item_entry: itemEntry,
        item_count: itemCount, item_suffix: effectiveSuffix,
        enchantments: enchantments
    });

    output.item_guid += ITEM_GUID_INCREMENT;
}
