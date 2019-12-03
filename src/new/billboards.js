import * as updatable from "./lib/updatable";
import {
    ParticleScene
} from "./behaviourScene";

function beginPaint(w, h, debug) {
    var canvas = document.createElement("CANVAS");
    canvas.height = h;
    canvas.width = w;
    if (debug) {
        document.querySelector(".debug").appendChild(canvas);
    }
    var ctx = canvas.getContext("2d");
    ctx.w = w;
    ctx.h = h;
    // document.body.appendChild(canvas);
    return ctx;
}

function doText(c, str, font) {
    // console.log(typeof str); typeof str == "string" ? "74px DINCond-Black" :
    font = font ||  "90px DINCond-Black";
    c.textBaseline = "middle";
    c.textAlign = "center";
    c.font = font;
    c.fillStyle = "white";
    c.fillText(str, c.w / 2, c.h / 2);
}

function endPaint(c, n, z) {
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
                (x - c.w / 2) / c.w * n,
                (y - c.h / 2) / c.h / 3 * n,
                z
            ]);
        }
    }
    return pos;
}

window.beginPaint = beginPaint;
window.endPaint = endPaint;
window.doText = doText;

window.shuffle = shuffle;

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

export class Billboard extends ParticleScene {
    constructor(key) {
        super();
        this.key = key;
        this.data = data.billboards[key];
    }
    update() {
        // && this.data.show || 
        this.visibility_t = control.mode == 1 && control.billboard == this.key && typeof billboards[this.key] != "string" ? 1 : 0;
        super.update();
    }
    particleInit(pt) {}
    particleUpdate(pt, _t) {}
}

// 境外数量， 总数量
export class NumberBillboard extends Billboard {
    constructor(key) {
        super(key);
        this.ctx = beginPaint(300, 100, false);
        doText(this.ctx, this.data.number);
        this.pts = shuffle(endPaint(this.ctx, 150, 0));
    }
    particleUpdate(pt, dt, _t) {
        var v = this.visibility;
        pt.targetArr(this.pts[pt.id % this.pts.length], 1, _t, 0.2);
        pt.damp = 0.01 + 0.02;
        pt.driftScale(0.2, _t, 0.05);
        pt.faceVelocity(_t);
        // pt.drift(_t, 0.001);
    }
}

class AbstractCategoryBillboard extends Billboard {
    constructor(key) {
        super(key);
        this.selected = "";
        this.pins = [];
        this.closestPoint = null;
    }

    update() {
        if (this.closestPoint) {
            this.selected = this.closestPoint.point.tags[this.key];
        }
        window.data.billboards[this.key].selected = this.selected;
        super.update();
    }

    particleInit(pts) {
        var categories = {};
        for (var i = 0; i < pts.length; i++) {
            categories[pts[i].point.tags[this.key]] =
                categories[pts[i].point.tags[this.key]] || [];
            categories[pts[i].point.tags[this.key]].push(pts[i]);
            //roll dice
        }
        for (var i in categories) {
            if (categories[i] && categories[i].length > 0) {
                var rand = Math.round(Math.random() * 10000000) % categories[i].length;
                categories[i][rand].meshpin = categories[i][rand].meshpin || [];
                categories[i][rand].meshpin.push(this.key);
                this.pins.push(categories[i][rand]);
            }
        }
        // console.log(this.key, this.pins);
    }

    particleUpdate(pt, dt, t) {
        if (this.pins.indexOf(pt) >= 0) {
            window.data.billboards[this.key].pins[pt.point.tags[this.key]].x = (pt.point.pt[0] * window.data.width) / 2 + window.data.width / 2;
            window.data.billboards[this.key].pins[pt.point.tags[this.key]].y = -(pt.point.pt[1] * window.data.height) / 2 + window.data.height / 2;
            window.data.billboards[this.key].pins[pt.point.tags[this.key]].z = pt.point.front;

            if (!this.closestPoint ||
                (
                    pt.point.front > 0 && pt.point.pt &&
                    (Math.abs(pt.point.pt[0]) + Math.abs(pt.point.pt[1]) <
                        Math.abs(this.closestPoint.point.pt[0]) + Math.abs(this.closestPoint.point.pt[1])
                    ))
            ) {
                this.closestPoint = pt;
            }
            
        }
    }
}

// 技术领域 生态领域
export class MeshBillboard extends AbstractCategoryBillboard {
    constructor(key) {
        super(key);
        this.key = key;
        this.meshExp = {};
        var step = 0;
        for (var i in window.data.tags[key].data) {
            this.meshExp[i] = this.meshExp[i] || {};
            this.meshExp[i].expand = step * 0.15 + 0.8;
            var gr = Math.random() * 0.8 + 0.2;
            this.meshExp[i].c = [1, 0.4, 0.1]; //[0.2 * step + 0.4, 0.2 * step, 0.05 * step];
            step++;
        }
        console.log(this.meshExp);
    }
    update() {
        super.update();
    }

    particleInit(pts) {
        super.particleInit(pts);
        for (var i = 0; i < pts.length; i++) {
            pts[i]["expand_" + this.key] = [
                pts[i].opos[0] * this.meshExp[pts[i].point.tags[this.key]].expand,
                pts[i].opos[1] * this.meshExp[pts[i].point.tags[this.key]].expand,
                pts[i].opos[2] * this.meshExp[pts[i].point.tags[this.key]].expand
            ];
        }
    }

    particleUpdate(pt, dt, _t) {
        super.particleUpdate(pt, dt, _t);
        var choosen = (pt.point.tags[this.key] == this.selected && pt.point.tags[this.key]);
        // pt.targetArr(
        // choosen ?
        // pt["expand_" + this.key] :
        // pt.opos, 1, _t, 0.2);
        pt.targetArr(
            pt["expand_" + this.key], 2, _t, 0.2);
        // pt.targetArr(
        //     pt["expand_" + this.key] :
        //     pt.opos, 1, _t, 0.2);

        // var c = pt.point.tags[this.key] == this.selected ? 0.5 : 0;
        var c = 0;
        var rgb = this.meshExp[pt.point.tags[this.key]].c;
        
        pt.c_t.setRGB(
            pt.point.tags[this.key] ? rgb[0] : c,
            pt.point.tags[this.key] ? rgb[1] : c,
            pt.point.tags[this.key] ? rgb[2] : c);

        if (choosen) {
            pt.c_t.setRGB(1, 1, 1);
        }
        pt.damp = pt.qdamp * 2;
        // pt.driftScale(0.2, _t, 0.05);
        pt.s_t = choosen ? 0.25 : 0.2;
        pt.faceVelocity(_t);
        // pt.drift(_t, 0.001);

    }
}

// 申请地区 集团公司
export class BarBillboard extends AbstractCategoryBillboard {
    constructor(key) {
        super(key);
        this.key = key;
    }

    update() {
        super.update();
    }

    particleInit(pts) {
        super.particleInit(pts);
        var dt = {};
        for (var k in data.tags[this.key].data) {
            dt[k] = {
                count: 0,
                pts: []
            }
        }
        for (var p = 0; p < pts.length; p++) {
            dt[pts[p].point.tags[this.key]].count++;
        }
        var span = 0.5;
        var vert = this.data.vert;

        var maxX = 0;
        var maxY = 0;

        var curX = 0;
        var curY = 0;

        for (var k in dt) {
            while (dt[k].count > 0) {
                dt[k].count--;
                maxX = curX > maxX ? curX : maxX;
                maxY = curY > maxY ? curY : maxY;
                dt[k].pts.push([
                    curX * span,
                    curY * span,
                    0
                ]);
                curY++;
                if (curY >= vert) {
                    curY = 0;
                    curX++;
                }

            }
            curX += 4;
            curY = 0;
        }
        maxX *= span;
        maxY *= span;


        for (var i = 0; i < pts.length; i++) {
            var d = dt[pts[i].point.tags[this.key]].pts.pop();
            pts[i]["billboard_" + this.key] = [
                d[0] - maxX / 2,
                d[1] - maxY / 2,
                0
            ];
        }
    }
    particleUpdate(pt, dt, _t) {
        super.particleUpdate(pt, dt, _t);

        pt.targetArr(pt["billboard_" + this.key], 1, _t, 0.3);
        pt.damp = 0.01 + 0.03;
        pt.driftScale(0.2, _t, 0.1);
        // pt.r_t[0] = pt.r_t[1] = pt.r_t[2] = 0;
        pt.faceVelocity(_t);
        pt.c_t.setRGB(1, 1, 1); 
        // pt.drift(_t, 0.001);
    }
}