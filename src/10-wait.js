
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
