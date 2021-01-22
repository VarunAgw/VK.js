VK.DownloadSelector = function (selector, filter, MsgBox) {
    let $els = (selector instanceof $) ? selector : $(selector);
    let length = $els.length;
    let output = [];

    $els.each(function (index) {
        let url = $(this).prop("src") || $(this).prop("href");
        let response = {url: url};

        if ("string" === typeof $(this).prop("alt") && $(this).prop("alt").length > 0) {
            response.name = $(this).prop("alt");
        }

        if ("function" === typeof filter) {
            let ret = filter.call(this, url, index, $els, $(this));
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
    let out = [];
    output.forEach(function (val) {
        out.push(val.url);
    });
    return out;
};

VK.DownloadSelectorString = function (output, noClip) {
    let out = VK.DownloadSelectorArray(output).join("\n");
    GM_setClipboard(out);
    return out;
};

VK.DownloadSelector500px = function (MsgBox) {
    return VK.DownloadSelector("a.photo_link img", function () {
        return {name: $(this).prop("alt") + ".jpg"};
    }, MsgBox);
};

VK.DownloadSelector500pxHigh = function () {
    let images = VK.DownloadSelector("a.photo_link", function (src, index, $els, $el) {
        return {name: $(this).find("img").prop("alt") + ".jpg"};
    }, false);

    images.forEach(function (image) {
    });
};