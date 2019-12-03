import * as updatable from "./updatable.js";

var control = {
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    e: 0.03
};

window.control = control;


document.addEventListener("mousemove", function (e) {
    control.tx = e.clientX / 1920;
    control.ty = e.clientY / 1080;
});


updatable.enable(() => {
    control.x = updatable.ease(control.x, control.tx, control.e, 0.00001);
    control.y = updatable.ease(control.y, control.ty, control.e, 0.00001);
});