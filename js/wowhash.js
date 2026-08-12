// wowhash.js - Wowhead dressing room URL encoder/decoder
// Uses wowhead's exact compression/decompression algorithm from calc.js

const _WH_ALPHA = "0zMcmVokRsaqbdrfwihuGINALpTjnyxtgevElBCDFHJKOPQSUWXYZ123456789";
const _MAX_INDEX = 58;

// Race-specific choiceId bases for female characters (appearance value 1)
const _RACE_BASES_FEMALE = {
    1:  [17214, 17226, 17241, 17260, 17270],
    2:  [17327, 17338, 17347, 17355, 17363],
    3:  [17431, 17442, 17452, 17466, 17476],
    4:  [17521, 17530, 17539, 17546, 17554],
    5:  [17617, 17623, 17633, 17643, 17653],
    6:  [17703, 17714, 17718, 17725, 17728],
    7:  [17771, 17778, 17785, 17792, 17801],
    8:  [17855, 17870, 17876, 17881, 17891],
    10: [17962, 17978, 17988, 18003, 18013],
    11: [18072, 18084, 18094, 18105, 18112]
};

// Male bases - wowhead encodes male minimal choices as compressed zeros, not as longs.
const _RACE_BASES_MALE = {
    1:  [17159, 17171, 17183, 17195, 17205], // Human
    2:  [17277, 17292, 17301, 17308, 17316], // Orc
    3:  [17370, 17389, 17399, 17410, 17420], // Dwarf
    4:  [17482, 17491, 17500, 17507, 17515], // Night Elf
    5:  [17564, 17570, 17580, 17590, 17600], // Undead
    6:  [17661, 17680, 17685, 17693, 17696], // Tauren
    7:  [17733, 17740, 17747, 17754, 17763], // Gnome
    8:  [17808, 17823, 17828, 17834, 17844], // Troll
    10: [17905, 17921, 17931, 17942, 17952], // Blood Elf
    11: [18024, 18038, 18048, 18057, 18064]  // Draenei
};

// === Encoding Functions (exact wowhead algorithm) ===

function _encValue(val) {
    if (val <= _MAX_INDEX) return _WH_ALPHA[val];
    return _WH_ALPHA[0];
}

function _encLong(val) {
    if (val === 0) return _WH_ALPHA[0];
    const digits = [val];
    while (digits[0] > _MAX_INDEX) {
        const q = Math.floor(digits[0] / _MAX_INDEX);
        digits[0] -= q * _MAX_INDEX;
        digits.unshift(q);
    }
    return digits.map(d => _WH_ALPHA[d]).join("");
}

function _zeroes(s) {
    let result = "", zeros = [];
    const encLen = _WH_ALPHA.length;
    const maxRun = _MAX_INDEX + encLen - 1; // 117 max representable per group
    for (let i = 0; i < s.length; i++) {
        if (s[i] === "0") zeros.push("0");
        else {
            while (zeros.length) {
                const n = Math.min(zeros.length, maxRun);
                if (n < 2) result += zeros.splice(0, n).join("");
                else if (n > _MAX_INDEX) { result += "99" + _WH_ALPHA[n - _MAX_INDEX]; zeros.splice(0, n); }
                else { result += "9" + _WH_ALPHA[n]; zeros.splice(0, n); }
            }
            result += s[i];
        }
    }
    while (zeros.length) {
        const n = Math.min(zeros.length, maxRun);
        if (n < 2) result += zeros.splice(0, n).join("");
        else if (n > _MAX_INDEX) { result += "99" + _WH_ALPHA[n - _MAX_INDEX]; zeros.splice(0, n); }
        else { result += "9" + _WH_ALPHA[n]; zeros.splice(0, n); }
    }
    return result;
}

function _zeroDelimiters(s) {
    const chars = s.split("");
    let result = "", skipNext = false, pairs = [];
    const encLen = _WH_ALPHA.length; // 60
    const maxPairs = _MAX_INDEX + encLen - 1; // 117 max representable per group
    for (let a = 0; a <= chars.length; a++) {
        if (skipNext) { skipNext = false; continue; }
        if (chars[a] === "0" && chars[a + 1] === "8") { pairs.push("08"); skipNext = true; }
        else {
            while (pairs.length) {
                const n = Math.min(pairs.length, maxPairs);
                if (n < 2) result += pairs.splice(0, n).join("");
                else if (n > _MAX_INDEX) { result += "77" + _WH_ALPHA[n - _MAX_INDEX]; pairs.splice(0, n); }
                else { result += "7" + _WH_ALPHA[n]; pairs.splice(0, n); }
            }
            if (a < chars.length) result += chars[a];
        }
    }
    while (pairs.length) {
        const n = Math.min(pairs.length, maxPairs);
        if (n < 2) result += pairs.splice(0, n).join("");
        else if (n > _MAX_INDEX) { result += "77" + _WH_ALPHA[n - _MAX_INDEX]; pairs.splice(0, n); }
        else { result += "7" + _WH_ALPHA[n]; pairs.splice(0, n); }
    }
    return result;
}

// === Decompression Functions (exact inverse of encoding) ===

function _decompZeroes(s) {
    let result = "", flag = 0, delim0 = "9";
    for (let n = 0; n < s.length; n++) {
        if (flag && s[n] === delim0) { flag++; }
        else if (flag) {
            const count = _WH_ALPHA.indexOf(s[n]) + (flag - 1) * _MAX_INDEX;
            for (let i = 0; i < count; i++) result += "0";
            flag = 0;
        } else {
            if (s[n] === delim0) flag = 1;
            else result += s[n];
        }
    }
    return result;
}

function _decompZeroDelimiters(s) {
    let result = "", flag = 0, indicator = "7", delim1 = "8";
    for (let n = 0; n < s.length; n++) {
        if (flag && s[n] === indicator) { flag++; }
        else if (flag) {
            const count = _WH_ALPHA.indexOf(s[n]) + (flag - 1) * _MAX_INDEX;
            for (let i = 0; i < count; i++) result += "0" + delim1;
            flag = 0;
        } else {
            if (s[n] === indicator) flag = 1;
            else result += s[n];
        }
    }
    return result;
}

// === Decoding Functions ===

function _decodeLong(s) {
    let val = 0;
    for (let i = 0; i < s.length; i++) {
        const idx = _WH_ALPHA.indexOf(s[i]);
        if (idx >= 0 && idx <= _MAX_INDEX) val = val * _MAX_INDEX + idx;
    }
    return val;
}

// === Template Encoder ===

function _getValue(data, path) {
    let val = data;
    for (const p of path) { if (val == null) return 0; val = val[p]; }
    return val || 0;
}

function _encodeTemplate(characterData) {
    const fields = [
        // Version + Race + delimiter
        "version", "race", "delim",
        // Gender, Class, Spec, Level + delimiter
        "gender", "class", "spec", "level", "delim",
        // npcOptions, pepe, mount + delimiter
        "npcOpt", "pepe", "mount", "delim"
    ];

    let raw = "";
    for (const f of fields) {
        if (f === "version") raw += _encValue(15);
        else if (f === "race") raw += _encLong(characterData.settings.race);
        else if (f === "gender") raw += _encValue(characterData.settings.gender);
        else if (f === "class") raw += _encValue(characterData.settings.class);
        else if (f === "spec") raw += _encValue(characterData.settings.specialization || 0);
        else if (f === "level") raw += _encLong(characterData.settings.level);
        else if (f === "npcOpt") raw += _encValue(characterData.settings.npcOptions || 0);
        else if (f === "pepe") raw += _encValue(characterData.settings.pepe || 0);
        else if (f === "mount") raw += _encLong(characterData.settings.mount || 0);
        else if (f === "delim") raw += "8";
    }

    // 50 custChoices
    const cc = characterData.custChoices;
    for (let i = 0; i < 50; i++) {
        raw += _encLong(cc[i]?.optionId || 0) + "8" + _encLong(cc[i]?.choiceId || 0) + "8";
    }

    // Equipment slots 1-14
    const eq = characterData.equipment;
    for (let slot = 1; slot <= 14; slot++) {
        raw += _encLong(eq[slot]?.itemId || 0) + "8";
        if (slot === 12 || slot === 13) raw += _encLong(eq[slot]?.enchant || 0) + "8";
        raw += _encLong(eq[slot]?.bonusId || 0) + "8";
    }

    // Trailing fields
    raw += _encValue(characterData.settings.artifactMainHand || 0) + "8";
    raw += _encValue(characterData.settings.artifactOffHand || 0) + "8";
    raw += _encValue(characterData.settings.separateShoulders || 0);

    // Compress
    return _zeroDelimiters(_zeroes(raw));
}

// === Public API ===

function buildCharacterData(json, gearSlots) {
    const p = json.player || {};
    const eq = json.equipment || {};
    const slotNames = ["head","shoulder","back","chest","shirt","tabard","wrist","hands","waist","legs","feet","main_hand","off_hand"];
    const equipment = {};
    for (let i = 0; i < slotNames.length; i++) {
        const itemId = gearSlots ? (gearSlots[i + 1] || 0) : (eq[slotNames[i]]?.id || 0);
        equipment[i + 1] = { itemId, bonusId: 0, enchant: 0 };
    }
    equipment[14] = { itemId: 0, bonusId: 0, enchant: 0 };

    return {
        settings: {
            race: p.race || "Human", gender: parseInt(p.gender) ?? 1, class: p.class || "warrior",
            specialization: 0, level: parseInt(p.level) || 1, npcOptions: 0, pepe: 0, mount: 0,
            artifactMainHand: 0, artifactOffHand: 0, separateShoulders: 0
        },
        custChoices: Array(50).fill(null).map(() => ({ optionId: 0, choiceId: 0 })),
        equipment
    };
}

const _raceIds = { Human:1, Orc:2, Dwarf:3, "Night Elf":4, Undead:5, Tauren:6, Gnome:7, Troll:8, "Blood Elf":10, Draenei:11 };
const _classIds = { warrior:1, paladin:2, hunter:3, rogue:4, priest:5, shaman:7, mage:8, warlock:9, druid:11, deathknight:12 };

function buildWowheadURL(jsonData, gearSlots) {
    const p = jsonData.player || {};
    if (gearSlots) gearSlots[1] = 0; // Force head slot to 0
    const charData = buildCharacterData(jsonData, gearSlots);
    charData.settings.race = _raceIds[p.race] || 1;
    charData.settings.class = _classIds[p.class.toLowerCase()] || 1;
    const hash = _encodeTemplate(charData);
    return "https://www.wowhead.com/tbc/dressing-room#" + hash;
}

// === Appearance Decoder ===

function wowhashDecodeAppearance(hashStr) {
    if (!hashStr) return null;
    if (hashStr.startsWith("#")) hashStr = hashStr.substring(1);

    // Decompress (exact wowhead order: zeroes first, then zeroDelimiters)
    const stream = _decompZeroes(_decompZeroDelimiters(hashStr));
    const parts = stream.split("8");
    if (parts.length < 10) return null;

    // Extract race + gender from header
    // parts[0] = version char + race keyLong
    // parts[1][0] = gender char (ALPHA index: 0=male, 1=female)
    const raceId = _decodeLong(parts[0].substring(1));
    const isFemale = parts[1] && _WH_ALPHA.indexOf(parts[1][0]) === 1;

    // Pick bases by gender - males default to base=-1 (except Blood Elf)
    let bases;
    if (isFemale) {
        bases = _RACE_BASES_FEMALE[raceId];
    } else {
        bases = _RACE_BASES_MALE[raceId] || [-1, -1, -1, -1, -1];
    }

    if (!bases) return null;

    // CustChoices start at index 3, step=2 (optionId, choiceId pairs)
    const pIdx = 3;
    const skin = Math.max(0, _decodeLong(parts[pIdx + 1]) - bases[0] - 1);
    const faceType = Math.max(0, _decodeLong(parts[pIdx + 3]) - bases[1] - 1);
    const hairStyle = Math.max(0, _decodeLong(parts[pIdx + 5]) - bases[2] - 1);
    const hairColor = Math.max(0, _decodeLong(parts[pIdx + 7]) - bases[3] - 1);
    const facialHair = Math.max(0, _decodeLong(parts[pIdx + 9]) - bases[4] - 1);

    return { skin, faceType, hairStyle, hairColor, facialHair };
}

function wowhashToPlayerBytes(urlOrHash) {
    let hashStr = urlOrHash.trim();
    if (hashStr.startsWith("http")) {
        const idx = hashStr.indexOf("#");
        if (idx < 0) return null;
        hashStr = hashStr.substring(idx);
    }

    const app = wowhashDecodeAppearance(hashStr);
    if (!app) return null;

    // playerBytes: skin | (faceType << 8) | (hairStyle << 16) | (hairColor << 24)
    const playerBytes = (app.skin & 0xFF) | ((app.faceType & 0xFF) << 8) | ((app.hairStyle & 0xFF) << 16) | ((app.hairColor & 0xFF) << 24);
    // playerBytes2: facialHair in low byte
    const playerBytes2 = app.facialHair & 0xFF;

    return { playerBytes, playerBytes2 };
}
