VK.AJAX = function (url, method = "GET", data = {}, headers = {}) {
    return $.ajax({
        url: url,
        method: method,
        data: data,
        headers: headers,
    });
};

VK.asyncDelay = async function (ms) {
    return await new Promise(resolve => setTimeout(resolve, ms));
}

VK.Beep = function () {
    let audio = new Audio("https://win/_/beep.wav");
    audio.play();
};

VK.copyToClipboard = function (text) {
    let $temp = $("<input>");
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();
}

VK.Debug = function (msg, beep, log) {
    if (true === log || undefined === log) {
        let date = new Date();
        let output = ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2) + ":" + ("00" + date.getMilliseconds()).slice(-3);
        if (undefined !== msg) {
            // output = output + " " + msg;
        }
        console.log(output, msg);
    }
    if (true === beep) {
        VK.Beep();
    }
};

VK.setInterval = function (fn, interval, times) {
    interval = interval || 1000;
    times = times || 10;
    let x = 0;

    let intervalID = setInterval(function () {
        fn();
        if (++x === times) {
            window.clearInterval(intervalID);
        }
    }, 1000);
}

VK.uuidv1 = function () {
    return VK.uuidv4().substr(0, 8);
}

VK.uuidv4 = function () {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

VK.xor = function (a, b) {
    return (a || b) && !(a && b);
}
