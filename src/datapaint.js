export function beginPaint(w, h, debug) {
    var canvas = document.createElement("CANVAS");
    canvas.height = h;
    canvas.width = w;
    if (debug) {
        document.querySelector(".debug").appendChild(canvas);
    }
    var ctx = canvas.getContext("2d");
    ctx.w = w;
    ctx.h = h;
    return ctx;
}

export function doText(c, str, font) {
    font = font || "90px DINCond-Black";
    c.textBaseline = "middle";
    c.textAlign = "center";
    c.font = font;
    c.fillStyle = "white";
    c.fillText(str, c.w / 2, c.h / 2);
}

export function endPaint(c) {
    var data = c.getImageData(0, 0, c.w, c.h).data;
    var pos = [];
    var x = 0;
    var y = 0;
    for (var i = 0; i < data.length; i += 4) {
        x++;
        if (x >= c.w) {
            x = 0;
            y++;
        }
        if (data[i] > 100) {
            //calculate x,y position
            pos.push([
                (x - c.w / 2) / c.w,
                (y - c.h / 2) / c.h / 2
            ]);
        }
    }
    return pos;
}

window.beginPaint = beginPaint;
window.endPaint = endPaint;
window.doText = doText;