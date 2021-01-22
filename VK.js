VK = {};
// Organize later
VK.copyToClipboard = function (text) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();
}

VK.asyncDelay = async function (ms) {
    return await new Promise(resolve => setTimeout(resolve, ms));
}

VK.escapeRegExp = function (string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}


VK.formatAmount = function (n, precision) {
    if (typeof precision == 'undefined') {
        precision = 1;
    }
    var n_format;
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
}

// ************************************************************************************************************ String/Array modifier *********************************************************************************************************

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

VK.trim = function (string, character) {
    if (undefined === character) {
        character = " |\t|n|\r";
    }
    character = "(" + character + ")";
    return string.replace(new RegExp("^" + character + "*|" + character + "*$", "g"), "");
};

String.trim2 = function (character) {
    return VK.trim(this, character);
};
String.trimLeft = function (character) {
    return VK.trim(this, character);
};
String.trim2Right = function (character) {
    return VK.trimRight(this, character);
};

// JS has no replaceAll :(
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

// Cause error in many site including https://paytm.com/recharge
/*Array.prototype.reverse = function (string) {
    return VK.reverse(this);
};*/

// Reverse (Original modify array rather than returning change)
VK.reverse = function (array) {
    return array.slice(0).reverse();
};

VK.in_array = function (array, content) {
    return array.indexOf(content) !== -1;
};

// ***************************************************************************************** Inject styles/scripts ****************************************************
VK.addStyle = function (code) {
    $("<style rel='stylesheet' type='text/css'>").text(code).appendTo("head");
};
VK.addStyleUrl = function (url) {
    $("<link rel='stylesheet' type='text/css'>").attr('href', url).appendTo("head");
};
VK.addScript = function (code) {
    $("<script type='text/javascript'>").text(code).appendTo("body");
};
VK.addScriptURL = function (url) {
    let script = document.createElement("script")
    script.setAttribute("src", url);
    document.querySelector("body").appendChild(script);
};
VK.addHtml = function (code) {
    $(code).prependTo("body");
};
VK.escapeHtml = function (html) {
    var text = document.createTextNode(html);
    var p = document.createElement('p');
    p.appendChild(text);
    return p.innerHTML;
}

VK.uuidv1 = function () {
    return VK.uuidv4().substr(0, 8);
}
VK.uuidv4 = function () {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

// *********************************************************************** JAX ******************************************************************

VK.SJAX = function (url, method = "GET", data = {}, headers = {}) {
    var xhr = $.ajax({
        url: url,
        method: method,
        data: data,
        headers: headers,
        async: false
    });
    return {text: xhr.responseText, xhr: xhr};
};

VK.AJAX = function (url, method = "GET", data = {}, headers = {}, finish_callback = null, fail_callback = null, always_callback = null, progress_callback = null) {
    var xhr = $.ajax({
        url: url,
        method: method,
        data: data,
        headers: headers,
    }).done(function () {
        finish_callback();
    })
        .fail(function () {
            fail_callback();
        })
        .always(function () {
            always_callback();
        });
    return xhr;
};

// *************************************************************************** Downloading random stuff on w3 ****************************************************
VK.DownloadSelector = function (selector, filter, MsgBox) {
    var $els = (selector instanceof $) ? selector : $(selector);
    var length = $els.length;
    var output = [];

    $els.each(function (index) {
        var url = $(this).prop('src') || $(this).prop('href');
        var response = {url: url};

        if ("string" === typeof $(this).prop('alt') && $(this).prop('alt').length > 0) {
            response.name = $(this).prop('alt');
        }

        if ("function" === typeof filter) {
            var ret = filter.call(this, url, index, $els, $(this));
            if (false === response) {
                return;
            }
            if ("string" === typeof ret) {
                response.url = ret;
            }
            if ("object" === typeof ret) {
                if (false === ret.url) {
                    return;
                }
                if ("string" === typeof ret.src) {
                    response.url = ret.url;
                }
                if ("string" === typeof ret.name) {
                    response.name = ret.name;
                }
                if (false === ret.name) {
                    delete response.name;
                }
            }
        }
        output.push(response);
    });
    if (true === MsgBox) {
        GM_setClipboard(JSON.stringify(output, null, 2));
        alert("Saved to clipboard!\n\n" + JSON.stringify(output, null, 2));
    } else {
        return output;
    }
};

VK.DownloadSelectorArray = function (output) {
    var out = [];
    output.forEach(function (val) {
        out.push(val.url);
    });
    return out;
};
VK.DownloadSelectorString = function (output, noClip) {
    var out = VK.DownloadSelectorArray(output).join("\n");
    GM_setClipboard(out);
    return out;
};

VK.DownloadSelector500px = function (MsgBox) {
    return VK.DownloadSelector("a.photo_link img", function () {
        return {name: $(this).prop('alt') + ".jpg"};
    }, MsgBox);
};

VK.DownloadSelector500pxHigh = function () {
    var images = VK.DownloadSelector("a.photo_link", function (src, index, $els, $el) {
        return {name: $(this).find('img').prop('alt') + ".jpg"};
    }, false);

    images.forEach(function (image) {
    });
};

// ********************************************************************** Misc functions *****************************************************************************


VK.Beep = function () {
    var audio = new Audio('https://win/_/beep.wav');
    audio.play();
};

VK.Debug = function (msg, beep, log) {
    if (true === log || undefined === log) {
        var date = new Date();
        var output = ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2) + ":" + ("00" + date.getMilliseconds()).slice(-3);
        if (undefined !== msg) {
            // output = output + " " + msg;
        }
        console.log(output, msg);
    }
    if (true === beep) {
        VK.Beep();
    }
};

$.fn.click2 = function () {
    const el = this[0];
    const event = new Event("click", {bubbles: true});
    event.simulated = true;

    try {
        el.dispatchEvent(event);
    } catch (e) {
        console.log(e);
        // Also, happens sometime
    }
};

$.fn.html2 = function (html) {
    if (this.html() !== html) {
        this.html(html);
    }
}

$.fn.text2 = function (text) {
    if (this.text() !== text) {
        // Returns text with space between different elements.
        function getText(domElement) {
            var root = domElement;
            var text = [];

            function traverseTree(root) {
                Array.prototype.forEach.call(root.childNodes, function (child) {
                    if (child.nodeType === 3) {
                        var str = child.nodeValue.trim();
                        if (str.length > 0) {
                            text.push(str);
                        }
                    } else {
                        traverseTree(child);
                    }
                });
            }

            traverseTree(root);
            return text.join(' ');
        }

        $(this).text(text);
        try {
            var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "text").set;
            nativeInputValueSetter.call(this[0], text);
        } catch (e) {
            // Happens sometime
        }
        this[0].dispatchEvent(new Event('change', {bubbles: true}));
        this[0].dispatchEvent(new Event('input', {bubbles: true}));

        return getText(this[0]);
    }
}

$.fn.val2 = function (value) {
    const el = this[0];
    const lastValue = el.value;
    el.value = value;
    const event = new Event("input", {bubbles: true});
    event.simulated = true;

    try {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(el, value);
    } catch (e) {
        console.log(e);
        // Happens sometime
    }

    try {
        const tracker = el._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
    } catch (e) {
        console.log(e);
        // Also, happens sometime
    }

    try {
        el.dispatchEvent(event);
    } catch (e) {
        console.log(e);
        // Also, happens sometime
    }
};

$.fn.on2 = function (type, sel, handler) {
    this[0].addEventListener(type, function (event) {
        var t = event.target;
        while (t && t !== this) {
            if (t.matches(sel)) {
                handler.call(t, $.event.fix(event));
            }
            t = t.parentNode;
        }
    }, true);
}

$.expr[':'].icontains = function (a, i, m) {
    return $(a).text().toUpperCase()
        .indexOf(m[3].toUpperCase()) >= 0;
};

$.expr[':'].regex = function (elem, index, match) {
    var matchParams = match[3].split(','),
        validLabels = /^(data|css):/,
        attr = {
            method: matchParams[0].match(validLabels) ?
                matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels, '')
        },
        regexFlags = 'ig',
        regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g, ''), regexFlags);
    return regex.test($(elem)[attr.method](attr.property));
}

$.fn.swapWith = function (to) {
    return this.each(function () {
        var copy_to = $(to).clone(true);
        var copy_from = $(this).clone(true);
        $(to).replaceWith(copy_from);
        $(this).replaceWith(copy_to);
    });
};

// RegEscape (I have no clue what it do whatsoever.
// I once wrote it, now only God know what it does)
VK.RegEscape = function (text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

// RegExp
// Update 1-Sep-2017 still haven't figured this one
VK.RegExp = function (regex) {
    var match = regex.match(/^(\/|~|@|;|`|")(.*?)\1([gimuy]*)$/);
    return new RegExp(match[2], match[3]);
};

VK.setInterval = function (fn, interval, times) {
    interval = interval || 1000;
    times = times || 10;
    var x = 0;

    var intervalID = setInterval(function () {
        fn();
        if (++x === times) {
            window.clearInterval(intervalID);
        }
    }, 1000);
}


// String/Array modifier


String.prototype.trim2 = function (character) {
    return VK.trim(this, character);
};
String.prototype.trimLeft = function (character) {
    return VK.trim(this, character);
};
String.prototype.trim2Right = function (character) {
    return VK.trimRight(this, character);
};

// Cause error in many site including https://paytm.com/recharge
/*Array.prototype.reverse = function (string) {
    return VK.reverse(this);
};*/


// ***************************************************************************************** Inject styles/scripts ****************************************************
VK.addStyle = function (code) {
    $("<style rel='stylesheet' type='text/css'>").text(code).appendTo("body");
};
VK.addStyleUrl = function (code) {
    $("<link rel='stylesheet' type='text/css'>").attr('href', url).appendTo("body");
}
VK.addScriptURL = function (url) {
    $("<script type='text/javascript'>").attr('src', url).appendTo("body");
};

// ********************************************************************************************* keep waiting ***************************************************************


// waitUntilExists
VK.waitUntilExists = function (selectors, opt_count, callback) {
    var length = opt_count;
    if (undefined === callback) {
        callback = opt_count;
        length = ">0";
    }
    if (length === parseInt(length)) {
        length = "===" + length;
    }
    (function () {
        if (true === eval($(selectors).length + length)) {
            callback.apply($(selectors).get(), [selectors]);
        } else {
            setTimeout(arguments.callee, 50);
        }
    })();
};

// waitUntilMore
VK.waitUntilMore = function (selectors, callback) {
    var $old_elements = [];
    (function () {
        var $new_elements = $(selectors).not($old_elements);
        $old_elements = $(selectors);
        $new_elements.each(function (index) {
            callback.apply(this, [selectors, this]);
        });
        setTimeout(arguments.callee, 50);
    })();
};

// *********************************************************************** JAX ******************************************************************


// ********************************************************************** Match it *********************************************************************

String.prototype.match_pattern = function (pattern) {
    return match_pattern(this, pattern);
};
String.prototype.match_url = function (url) {
    return match_url(this, url);
};
String.prototype.match_regex = function (regex) {
    return match_regex(this, regex);
};

// *************************************************************************** Downloading random stuff on w3 ****************************************************


// ********************************************************************** Misc functions *****************************************************************************


$.fn.val2 = function (val) {
    this.val(val);
    this.trigger('keyup');
};

$.fn.text2 = function (text) {
    this.text(text);
    this.trigger('keyup');
};


function isElementInViewport(el) {
    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }
    if (!el) {
        return false;
    }
    var rect = el.getBoundingClientRect();

    // this one is better (prev deleted)
    return (rect.bottom >= 0 && rect.right >= 0 && rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.left <= (window.innerWidth || document.documentElement.clientWidth));
}

function isElementInViewportCompletely(el) {
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }
    if (!el) {
        return false;
    }
    var rect = el.getBoundingClientRect();
    return rect.top >= 0 && rect.bottom <= window.innerHeight;
}


function xor(a, b) {
    return (a || b) && !(a && b);
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function getClientWidth() {
    return document.documentElement.clientWidth
        - parseInt($('body').css('margin-left').replace("px", ""))
        - parseInt($('body').css('margin-right').replace("px", ""));
}

function getClientHeight() {
    return document.documentElement.clientHeight
        - parseInt($('body').css('margin-top').replace("px", ""))
        - parseInt($('body').css('margin-bottom').replace("px", ""));
}
/**
 * A fancier way to parse JS keydown events
 * Author: Varun Agrawal <Varun@VarunAgw.com>
 * Version: 1.3
 * Last Updated: 23-July-2016
 *
 * @param {object}             event:             Just forward the event
 * @param {array|number}       possibleKeyCodes:  Use single keycode or an array of codes to match either of them
 * @param {array|string|regex} possibleModifiers: Ctrl/Alt/Shift/Meta key that were pressed (Note: Order for matching is "casm")
 * @returns {Boolean}
 *
 * Note:
 * - Use empty array [] or undefined to skip an argument
 * - Missing parameter is always evaluated as true (i.e. it will match any event)
 *
 * Examples:
 * KeyCode(e, KeyCode.NUMPAD0, "")                // Numpad0 with no modifiers
 * KeyCode(e, [KeyCode.NUMPAD0, KeyCode.NUMPAD1]) // Numpad0 or Numpad1 with any modifiers
 * KeyCode(e, KeyCode.NUMPAD0, "cs")              // Numpad0 with exactly Ctrl and Shift pressed
 * KeyCode(e, [], "c")                            // Modifier Ctrl with any key pressed
 * KeyCode(e, KeyCode.NUMPAD0, ["c", "a"])        // Numpad0 with either ctrl or alt, but not both
 * KeyCode(e, KeyCode.NUMPAD0, /^(c|a)s$/)        // Numpad0 with only (Ctrl or Alt) + Shift pressed
 * KeyCode(e, KeyCode.CONTROL)                    // If only Ctrl is pressed
 * KeyCode(e)                                     // Match all events
 */
VK.KeyCode = function (event, possibleKeyCodes, possibleModifiers) {
    let res1 = true, res2 = true;

    if ("number" === typeof possibleKeyCodes) {
        res1 = (event.keyCode === possibleKeyCodes);
    } else if (Array.isArray(possibleKeyCodes) && possibleKeyCodes.length > 0) {
        res1 = (possibleKeyCodes.indexOf(event.keyCode) !== -1);
    }

    let modifiers = "";
    modifiers += (event.ctrlKey ? "c" : "") + (event.altKey ? "a" : "");
    modifiers += (event.shiftKey ? "s" : "") + (event.metaKey ? "m" : "");

    if ("string" === typeof possibleModifiers) {
        res2 = (modifiers === possibleModifiers);
    } else if (Array.isArray(possibleModifiers) && possibleModifiers.length > 0) {
        res2 = (possibleModifiers.indexOf(modifiers) !== -1)
    } else if ("undefined" !== typeof possibleModifiers && possibleModifiers.constructor === RegExp) {
        res2 = (modifiers.match(possibleModifiers) !== null);
    }

    return (res1 && res2);
};

VK.keys_DSATGVAS692sSds562 = {
    CANCEL: 3,
    HELP: 6,
    BACK_SPACE: 8,
    TAB: 9,
    CLEAR: 12,
    RETURN: 13,
    ENTER: 14,
    SHIFT: 16,
    CONTROL: 17,
    ALT: 18,
    PAUSE: 19,
    CAPS_LOCK: 20,
    ESCAPE: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    PRINTSCREEN: 44,
    INSERT: 45,
    DELETE: 46,
    0: 48,
    1: 49,
    2: 50,
    3: 51,
    4: 52,
    5: 53,
    6: 54,
    7: 55,
    8: 56,
    9: 57,
    SEMICOLON: 59,
    EQUALS: 61,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    CONTEXT_MENU: 93,
    NUMPAD0: 96,
    NUMPAD1: 97,
    NUMPAD2: 98,
    NUMPAD3: 99,
    NUMPAD4: 100,
    NUMPAD5: 101,
    NUMPAD6: 102,
    NUMPAD7: 103,
    NUMPAD8: 104,
    NUMPAD9: 105,
    MULTIPLY: 106,
    ADD: 107,
    SEPARATOR: 108,
    SUBTRACT: 109,
    DECIMAL: 110,
    DIVIDE: 111,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    F13: 124,
    F14: 125,
    F15: 126,
    F16: 127,
    F17: 128,
    F18: 129,
    F19: 130,
    F20: 131,
    F21: 132,
    F22: 133,
    F23: 134,
    F24: 135,
    NUM_LOCK: 144,
    SCROLL_LOCK: 145,
    COMMA: 188,
    PERIOD: 190,
    SLASH: 191,
    BACK_QUOTE: 192,
    OPEN_BRACKET: 219,
    BACK_SLASH: 220,
    CLOSE_BRACKET: 221,
    QUOTE: 222,
    META: 224
};

for (let attrname in VK.keys_DSATGVAS692sSds562) {
    VK.KeyCode[attrname] = VK.keys_DSATGVAS692sSds562[attrname];
}

// delete VK.keys_DSATGVAS692sSds562;
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

// waitUntilTrue
VK.waitUntilTrue = function (func, callback) {
    (function () {
        if (true === func()) {
            callback.apply(undefined, [func]);
        } else {
            setTimeout(arguments.callee, 50);
        }
    })();
};

// waitUntilExists
VK.waitUntilExists = function (selectors, callback, length, timeout) {
    if (length === undefined) {
        length = ">0";
    } else if (length === parseInt(length)) {
        length = "===" + length;
    }
    if (timeout === undefined) {
        timeout = 2000;
    }

    var time = new Date().getTime();
    (function () {
        if (true === eval($(selectors).length + length)) {
            callback.apply($(selectors).get(), [selectors]);
        } else {
            if (timeout === 0 || new Date().getTime() - time < timeout) {
                window.setTimeout(arguments.callee, 50);
            }
        }
    })();
};

// waitUntilMore
VK.waitUntilMore = function (selectors, callback, interval) {
    let operationUuid = "TM_" + VK.uuidv1();
    interval = interval || 50;

    console.log(selectors, operationUuid, interval);
    (function () {
        var $new_elements = $(selectors).not(`.${operationUuid}`);
        $new_elements.addClass(operationUuid);
        $new_elements.each(function (index) {
            callback.apply(this, [selectors, this]);
        });
        setTimeout(arguments.callee, interval);
    })();
};

VK.URL = VK.parseURL();
