// Pet parser — ported from parsers/pet.py

function parsePet(data, charClassId, output, exp) {
    if (charClassId !== classes.hunter) return;

    const petData = data.pet;
    if (!petData) return;

    const config = getExpConfig(exp);

    const familyName = petData.family || null;
    let modelId;
    if (familyName) {
        modelId = genericPetModelMap[familyName] || DEFAULT_PET_MODEL;
    } else {
        modelId = DEFAULT_PET_MODEL;
    }

    output.pet_list = config.pet_template.fill({
        no_char_guid: true,
        pet_entry: String(petData.id),
        pet_owner: CHAR_GUID,
        pet_name: petData.name,
        pet_level: String(petData.level),
        pet_model: modelId,
        pet_health: parseInt(petData.health || 30000),
        pet_resource: parseInt(petData.power || 100)
    });
}
