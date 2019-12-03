window.NO_TILT = true;
window.THREE_BG = 0;
window.ZOOM_IN = 20;
window.DISABLE_BLOOM  = true;
window.DEBUG_VISUAL = false;
window.WHITE_WF = false;
window.HDBOOST = true;



// setTimeout(() => {

//     /* specify our style rules in a string */
//     var cssRules = `
//     * { 
//         color:transparent !important;
//         background: transparent !important;
//         border: none !important;
//      }
//     img { opacity: 0!important; }
//     `;

//     /* create the style element */
//     var styleElement = document.createElement('style');

//     /* add style rules to the style element */
//     styleElement.appendChild(document.createTextNode(cssRules));

//     /* attach the style element to the document head */
//     document.getElementsByTagName('head')[0].appendChild(styleElement);
// }, 1500);


var ticks = Date.now();

function update() {
    ticks += 5; //slower than common
    requestAnimationFrame(update);
}
requestAnimationFrame(update);

Date.now = function () {
    return ticks;
}