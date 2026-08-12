// Skills parser — ported from parsers/skills.py

function addDefaultSkills(charClass, charLevel, output) {
    const armorSkill = skillmap[charClass].armor;
    const weaponSkills = skillmap[charClass].weapons;
    const levelInt = parseInt(charLevel);

    if (armorSkill) {
        output.skills += skillsTemplate.fill({
            skill_id: armorSkill[0], current_skill: 1, max_skill: 1
        });
    }
    for (const ws of weaponSkills) {
        output.skills += skillsTemplate.fill({
            skill_id: ws, current_skill: levelInt * 5, max_skill: levelInt * 5
        });
    }
}

function parseCharSkills(data, charLocale, output, exp) {
    if (!vanillaSkillMap[charLocale] && !tbcSkillMap[charLocale]) {
        console.log("Client language not supported for skill export");
        return;
    }

    const rawSkills = data.skills || [];
    const className = output.class_name;

    let skillMapLocal, mapLabel;
    if (exp === 0) {
        skillMapLocal = vanillaSkillMap[charLocale] || {};
        mapLabel = "Vanilla";
    } else if (exp === 1) {
        skillMapLocal = tbcSkillMap[charLocale] || {};
        mapLabel = "TBC";
    } else {
        console.log("WotLK not supported for skill export yet");
        return;
    }

    const dupSkills = duplicateSkills[charLocale] || {};

    for (const skill of rawSkills) {
        const skillName = skill.name;
        const skillRank = parseInt(skill.rank);
        const maxRank = parseInt(skill.maxRank);

        let skillId = 0;
        if (dupSkills[skillName]) {
            skillId = dupSkills[skillName][className] || 0;
        } else if (skillMapLocal[skillName]) {
            skillId = skillMapLocal[skillName];
        } else {
            console.log(`Skill not found in ${mapLabel} skill map`);
        }

        output.char_skills += skillsTemplate.fill({
            skill_id: skillId, current_skill: skillRank, max_skill: maxRank
        });
    }
}
