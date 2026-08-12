// Glyphs parser — ported from parsers/glyphs.py

function parseGlyphs(data, output) {
    const rawGlyphs = data.glyphs || [];
    for (const glyph of rawGlyphs) {
        const glyphSpell = glyph.spellID;
        if (glyphMap[glyphSpell] === undefined) {
            console.warn(`Glyph spell ${glyphSpell} not found in glyph map, skipping.`);
            continue;
        }
        output.glyphs += glyphTemplate.fill({
            glyph_slot: glyph.socket - 1,
            glyph_id: glyphMap[glyphSpell]
        });
    }
}
