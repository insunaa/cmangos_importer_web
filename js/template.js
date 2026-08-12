// SQL template utility — mimics Python string.Template with $placeholder syntax

function Template(str) {
    this._str = str;
}

Template.prototype.fill = function(kwds) {
    if (kwds.no_char_guid !== true) {
        kwds.char_guid = CHAR_GUID;
    }
    for (const k in kwds) {
        if (typeof kwds[k] === "string") {
            kwds[k] = kwds[k].replace(/\n+$/, "");
        }
    }
    return this._str.replace(/\$(\w+)/g, function(m, key) {
        return (kwds[key] !== undefined) ? kwds[key] : m;
    });
};
