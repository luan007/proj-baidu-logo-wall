//tiny updatez
const PRECISION = 0.01;
var deltaT = 0;
export function ease(f, t, sp, precision) {
    precision = precision || PRECISION;
    if (Math.abs(f - t) < precision) {
        return t;
    }
    return f + (t - f) * sp * deltaT;
}
var all = [];
var removal = [];
var t = (Date.now() / 1000) % 1000000;
var prevT = (Date.now() / 1000) % 1000000;
export function update() {
    deltaT = (t - prevT) * 60;
    prevT = t;
    if (deltaT < 0) {
        deltaT = 1;
    }
    if (deltaT > 3) {
        deltaT = 1;
    }
    t = ((Date.now()) % 1000000) * 0.001;
    if (removal.length > 0) {
        var _new = [];
        for (var i = 0; i < all.length; i++) {
            if (removal.indexOf(all[i]) >= 0) {
                continue;
            }
            _new.push(all[i]);
        }
        removal = [];
        all = _new;
    }
    for (var i = 0; i < all.length; i++) {
        all[i](t, deltaT);
    }
}
export function enable(func) {
    if (all.indexOf(func) >= 0) {
        return;
    }
    all.push(func);
}
export function disable(func) {
    if (removal.indexOf(func) >= 0) {
        return;
    }
    removal.push(func);
}
export function init() {
    var _updator_thread = function() {
        requestAnimationFrame(_updator_thread);
        update();
    };
    _updator_thread();
}