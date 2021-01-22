VK.addStyle = function (code) {
    $("<style rel='stylesheet' type='text/css'>").text(code).appendTo("body");
};

VK.addScript = function (code) {
    $("<script type='text/javascript'>").text(code).appendTo("body");
};

VK.addStyleUrl = function (code) {
    $("<link rel='stylesheet' type='text/css'>").attr('href', url).appendTo("body");
}

VK.addScriptURL = function (url) {
    let script = document.createElement("script")
    script.setAttribute("src", url);
    document.querySelector("body").appendChild(script);
};

VK.addHtml = function (code, where = "body") {
    $(code).prependTo(where);
};