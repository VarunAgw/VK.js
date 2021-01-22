VK.isElementInViewport = function (el) {
    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }
    if (!el) {
        return false;
    }
    let rect = el.getBoundingClientRect();

    // this one is better (prev deleted)
    return (rect.bottom >= 0 && rect.right >= 0 && rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.left <= (window.innerWidth || document.documentElement.clientWidth));
}

VK.isElementInViewportCompletely = function (el) {
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }
    if (!el) {
        return false;
    }
    let rect = el.getBoundingClientRect();
    return rect.top >= 0 && rect.bottom <= window.innerHeight;
}

VK.getClientWidth = function () {
    return document.documentElement.clientWidth
        - parseInt($("body").css("margin-left").replace("px", ""))
        - parseInt($("body").css("margin-right").replace("px", ""));
}

VK.getClientHeight = function () {
    return document.documentElement.clientHeight
        - parseInt($("body").css("margin-top").replace("px", ""))
        - parseInt($("body").css("margin-bottom").replace("px", ""));
}