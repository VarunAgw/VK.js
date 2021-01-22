VK.inArray = function (array, content) {
    return array.indexOf(content) !== -1;
};

// To be deleted if not needed after 6 months from 22-Jan-2020
// // Reverse (Array.reverse modify array rather than returning change)
// VK.reverse = function (array) {
//     return array.slice(0).reverse();
// };

// Cause error in many site including https://paytm.com/recharge
/*
Array.prototype.reverse = function (string) {
    return VK.reverse(this);
};
*/

VK.shuffleArray = function (array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

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