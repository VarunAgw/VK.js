// https://stackoverflow.com/questions/26420269/call-googles-match-patterns-api
// https://stackoverflow.com/questions/12433271/can-i-allow-the-extension-user-to-choose-matching-domains
VK.patternToRegExp = function (pattern) {
    if (pattern == "<all_urls>")
        return /^(?:http|https|file|ftp):\/\/.*/;

    let split = /^(\*|http|https|file|ftp):\/\/(.*)$/.exec(pattern);
    if (!split) {
        throw Error("Invalid schema in " + pattern);
    }
    let schema = split[1];
    let fullpath = split[2];

    split = /^([^\/]*)\/(.*)$/.exec(fullpath);
    if (!split) {
        throw Error("No path specified in " + pattern);
    }
    let host = split[1];
    let path = split[2];

    // File
    if (schema == "file" && host != "")
        throw Error("Non-empty host for file schema in " + pattern);

    if (schema != "file" && host == "")
        throw Error("No host specified in " + pattern);

    if (!(/^(\*|\*\.[^*]+|[^*]*)$/.exec(host)))
        throw Error("Illegal wildcard in host in " + pattern);

    let reString = "^";
    reString += (schema == "*") ? "https*" : schema;
    reString += ":\\/\\/";
    // Not overly concerned with intricacies
    //   of domain name restrictions and IDN
    //   as we're not testing domain validity
    reString += host.replace(/\*\.?/, "[^\\/]*");
    reString += "(:\\d+)?";
    reString += "\\/";
    reString += path.replace("*", ".*");
    reString += "$";

    return RegExp(reString);
}

VK.escapeHtml = function (html) {
    let text = document.createTextNode(html);
    let p = document.createElement("p");
    p.appendChild(text);
    return p.innerHTML;
}

// To be deleted if not needed after 6 months from 22-Jan-2020
// // RegEscape (I have no clue what it do whatsoever.
// // I once wrote it, now only God know what it does)
// VK.RegEscape = function (text) {
//     return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
// };
//
// // RegExp
// // Update 1-Sep-2017 still haven't figured this one
// VK.RegExp = function (regex) {
//     var match = regex.match(/^(\/|~|@|;|`|")(.*?)\1([gimuy]*)$/);
//     return new RegExp(match[2], match[3]);
// };

VK.escapeRegExp = function (string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

VK.matchPattern = function (str, pattern) {
    (1 === arguments.length) ? (pattern = str, str = document.location) : null;
    return VK.patternToRegExp(pattern).test(str);
}

VK.matchRegex = function (str, regex) {
    (1 === arguments.length) ? (regex = str, str = document.location) : null;
    if ("string" === typeof regex) {
        regex = new RegExp(regex);
    }
    return regex.test(str) ? regex : false;
}


VK.matchWildcard = function (str, wildcard) {
    (1 === arguments.length) ? (wildcard = str, str = document.location) : null;
    // Escape everything but * and then replace *
    wildcard = wildcard.replace(/[-[\]{}()+?.,\\^$|#\s]/g, "\\$&").replace(/\*/g, ".*");
    return new RegExp("^" + wildcard + "$").test(str);
}

VK.matchSubHost = function (currentHost, hostToMatch) {
    return new RegExp("(^|\\.)" + VK.escapeRegExp(hostToMatch) + "$").test(currentHost);
}

String.prototype.matchPattern = VK.matchPattern;
String.prototype.matchRegex = VK.matchRegex;
String.prototype.matchWildcard = VK.matchWildcard;
String.prototype.matchSubHost = VK.matchSubHost;
