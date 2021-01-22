/**
 * Parse URL to simple JSON structure
 * @param {String} url URL to parse (skip it to parse document.location)
 * @return {parseURL.o}
 * @version 19.11.2018
 */
VK.parseURL = function (url) {
    if (typeof url === 'undefined') {
        url = document.location.href;
    }
    var a = document.createElement("a");
    a.href = url;
    url = a;

    var o = {};
    o.protocol = url.protocol; // http https
    o.hostname = url.hostname; // mail.google.com mail.varunagw.com
    o.port = url.port;         // 80 4521
    o.hostport = url.host;     // mail.google.com mail.varunagw.com:4521
    o.pathname = url.pathname; // /mail/a/b/ /mail/a/b/c
    o.search = url.search;     // ?s=a&ds=dsda&dds=vvv ?s&=a&ds=dsda&dds=vvv& ""
    o.hash = url.hash;         // #dsadas "" (cannot be # only)
    o.href = url.href;         // https://mail.google.com/mail/u/0/h/pis4p85m83kp/?s=a&ds=dsda&dds=vvv&#dsadas

    o.protocol = o.protocol.substr(0, o.protocol.indexOf(":"));

    o.host = url.hostname.split('.');
    o.hostrev = o.host.slice(0).reverse();
    o.hostlen = o.host.length;

    o.path = url.pathname.substr(1).split('/');
    o.pathrev = o.path.slice(0).reverse();
    o.pathlen = o.path.length;
    o.pathnow = o.pathrev[0];
    o.pathnow = o.pathrev[0];
    o.page = o.pathnow;

    o.filename = o.pathnow.split(".");
    o.extension = ((o.filename.length === 1 || o.filename.slice(-1)[0].match(/%20| /) !== null) ? "" : o.filename.pop());
    o.filename = o.filename.join(".");

    o.argname = o.search.substr(1).replace(/^&+|&+$/, "");
    o.arglen = o.argname.split("&").length;
    o.arg = {};
    o.argE = {};

    o.argname.split("&").forEach(function (value) {
        if ("" === value) {
            return;
        }
        var key = value.split("=")[0];
        o.argE[key] = (key === value ? undefined : value.substr(key.length + 1));
        o.arg[key] = (key === value ? undefined : decodeURIComponent(o.argE[key]).replace(/\+/g, " "));
    });
    o.toString = function () {
        return this.href;
    };
    o.match = function () {
        return this.href.match.apply(this, arguments);
    };
    o.replace = function () {
        return this.href.replace.apply(this, arguments);
    };
    return o;
}