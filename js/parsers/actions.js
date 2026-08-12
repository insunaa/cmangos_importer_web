// Actions parser — ported from parsers/actions.py

function parseActions(data, output, exp) {
    const config = getExpConfig(exp);
    const rawActions = data.actions || [];

    for (const action of rawActions) {
        const actionTypeName = action.type;
        if (actionMap[actionTypeName] === undefined) {
            console.warn(`Unknown action type '${actionTypeName}', skipping.`);
            continue;
        }

        output.action_list += config.action_template.fill({
            slot_id: parseInt(action.slot) - 1,
            action_id: String(action.id),
            action_type: actionMap[actionTypeName]
        });
    }
}
