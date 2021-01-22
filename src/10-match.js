// https://stackoverflow.com/questions/26420269/call-googles-match-patterns-api
// https://stackoverflow.com/questions/12433271/can-i-allow-the-extension-user-to-choose-matching-domains
VK.patternToRegExp = function (pattern) {
    if (pattern == "<all_urls>")
        return /^(?:http|https|file|ftp):\/\/.*/;

    var split = /^(\*|http|https|file|ftp):\/\/(.*)$/.exec(pattern);
    if (!split) {
        throw Error("Invalid schema in " + pattern);
    }
    var schema = split[1];
    var fullpath = split[2];

    var split = /^([^\/]*)\/(.*)$/.exec(fullpath);
    if (!split) {
        throw Error("No path specified in " + pattern);
    }
    var host = split[1];
    var path = split[2];

    // File
    if (schema == "file" && host != "")
        throw Error("Non-empty host for file schema in " + pattern);

    if (schema != "file" && host == "")
        throw Error("No host specified in " + pattern);

    if (!(/^(\*|\*\.[^*]+|[^*]*)$/.exec(host)))
        throw Error("Illegal wildcard in host in " + pattern);

    var reString = "^";
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

VK.matchPattern = function (str, pattern) {
    (1 === arguments.length) ? (pattern = str, str = document.location) : null;
    return VK.patternToRegExp(pattern).test(str);
}

VK.matchWildcard = function (str, wildcard) {
    (1 === arguments.length) ? (wildcard = str, str = document.location) : null;
    // Escape everything but * and then replace *
    wildcard = wildcard.replace(/[-[\]{}()+?.,\\^$|#\s]/g, '\\$&').replace(/\*/g, ".*");
    return new RegExp("^" + wildcard + "$").test(str);
}

VK.matchRegex = function (str, regex) {
    (1 === arguments.length) ? (regex = str, str = document.location) : null;
    if ("string" === typeof regex) {
        regex = new RegExp(regex);
    }
    return regex.test(str) ? regex : false;
}

VK.matchSubHost = function (currentHost, hostToMatch) {
    return new RegExp("(^|\\.)" + VK.escapeRegExp(hostToMatch) + "$").test(currentHost);
}