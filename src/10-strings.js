VK.formatAmount = function (n, precision) {
    if (typeof precision == "undefined") {
        precision = 1;
    }
    let n_format;
    if (n > 100 * 100 * 100 * 1000) {
        // Billion
        n_format = (n / 1000 / 100 / 100 / 100).toFixed(precision) + "B";
    } else if (n > 100 * 100 * 1000) {
        // Crore
        n_format = (n / 1000 / 100 / 100).toFixed(precision) + "C";
    } else if (n > 100 * 1000) {
        // Lakhs
        n_format = (n / 1000 / 100).toFixed(precision) + "L";
    } else if (n > 1000) {
        // Thousand
        n_format = (n / 1000).toFixed(precision) + "K";
    } else {
        n_format = n.toFixed(precision);
    }
    return n_format;
};

VK.trim = function (string, character) {
    if (undefined === character) {
        character = " |\t|n|\r";
    }
    character = "(" + character + ")";
    return string.replace(new RegExp("^" + character + "*|" + character + "*$", "g"), "");
};

// Trim (Original Trim doesn't support arguments)
VK.trimLeft = function (string, character) {
    if (undefined === character) {
        character = " |\t|n|\r";
    }
    character = "(" + character + ")";
    return string.replace(new RegExp("^" + character + "*"), "");
};

VK.trimRight = function (string, character) {
    if (undefined === character) {
        character = " |\t|n|\r";
    }
    character = "(" + character + ")";
    return string.replace(new RegExp(character + "*$"), "");
};

String.prototype.trim2 = function (character) {
    return VK.trim(this, character);
};

String.prototype.trimLeft = function (character) {
    return VK.trim(this, character);
};

String.prototype.trimRight = function (character) {
    return VK.trimRight(this, character);
};

// JS has no replaceAll :(
String.prototype.replaceAll = function (search, replacement) {
    let target = this;
    return target.split(search).join(replacement);
};
