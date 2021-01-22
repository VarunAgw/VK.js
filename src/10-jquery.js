VK.patchJquery = function ($) {
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
                let root = domElement;
                let text = [];

                function traverseTree(root) {
                    Array.prototype.forEach.call(root.childNodes, function (child) {
                        if (child.nodeType === 3) {
                            let str = child.nodeValue.trim();
                            if (str.length > 0) {
                                text.push(str);
                            }
                        } else {
                            traverseTree(child);
                        }
                    });
                }

                traverseTree(root);
                return text.join(" ");
            }

            $(this).text(text);
            try {
                let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "text").set;
                nativeInputValueSetter.call(this[0], text);
            } catch (e) {
                // Happens sometime
            }
            this[0].dispatchEvent(new Event("change", {bubbles: true}));
            this[0].dispatchEvent(new Event("input", {bubbles: true}));

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
            let t = event.target;
            while (t && t !== this) {
                if (t.matches(sel)) {
                    handler.call(t, $.event.fix(event));
                }
                t = t.parentNode;
            }
        }, true);
    }

    $.fn.swapWith = function (to) {
        return this.each(function () {
            let copy_to = $(to).clone(true);
            let copy_from = $(this).clone(true);
            $(to).replaceWith(copy_from);
            $(this).replaceWith(copy_to);
        });
    };

    $.expr[":"].icontains = function (a, i, m) {
        return $(a).text().toUpperCase()
            .indexOf(m[3].toUpperCase()) >= 0;
    };

    $.expr[":"].regex = function (elem, index, match) {
        let matchParams = match[3].split(","),
            validLabels = /^(data|css):/,
            attr = {
                method: matchParams[0].match(validLabels) ?
                    matchParams[0].split(":")[0] : "attr",
                property: matchParams.shift().replace(validLabels, "")
            },
            regexFlags = "ig",
            regex = new RegExp(matchParams.join("").replace(/^\s+|\s+$/g, ""), regexFlags);
        return regex.test($(elem)[attr.method](attr.property));
    }
}

if (typeof $ !== "undefined") {
    VK.patchJquery($);
}
