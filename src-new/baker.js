import * as ao from "../libao";
import * as three from "three";
import env from "./env";

export var baked = {
    points: [],
    counts: {},
    ids: {},
    pos_target: {
        big_main:  bake_big_numbers('No.1'),
        big_vendor:  bake_big_numbers('2000+'),
        big_sku:  bake_big_numbers('3000+')
    }
};

export function init() {
    baked.points = buildArchitype();
    bindData(baked.points);
    bake_shape_reel();
}

function buildArchitype() {
    console.log("Calculating..");
    var obj = ao.threeResources["shell"];
    var points = [];
    for (var i = 0; i < obj.children.length; i++) {
        for (var j = 0; j < obj.children[i].geometry.attributes["position"].array.length; j += 3) {
            var prep = {
                position: new THREE.Vector3(obj.children[i].geometry.attributes["position"].array[j],
                    obj.children[i].geometry.attributes["position"].array[j + 1],
                    obj.children[i].geometry.attributes["position"].array[j + 2]),
                normal: new THREE.Vector3(obj.children[i].geometry.attributes["normal"].array[j],
                    obj.children[i].geometry.attributes["normal"].array[j + 1],
                    obj.children[i].geometry.attributes["normal"].array[j + 2]),
                face: i,
                id: points.length,
                content: undefined
            };
            var found = false;
            for (var q = 0; q < points.length; q++) {
                if (points[q].position.manhattanDistanceTo(
                        prep.position
                    ) < 0.1) {
                    found = true;
                    break;
                }
            }
            if (found) {
                continue;
            }
            points.push(prep);
        }
    }
    // var rand_table = [];
    // var range = Math.floor(points.length /  window.patents.length); 
    // for (var p = 0; p < window.patents.length; p++) {
    //     var rand = Math.floor(Math.random() * range * 0.7);
    //     //da seperation
    //     rand_table.push(p + rand);
    // }
    // for (var i = 0; i < rand_table.length; i++) {
    //     //apply
    //     if( rand_table[i] + i * range > points.length){
    //         break;
    //     }
    //     points[rand_table[i] + i * range].content = window.patents[i];
    // }
    // for (var i = 0; i < points.length; i++) {
    //     points[Math.floor(Math.random() * points.length)].content = window.patents[i];
    // }
    return points;
}

function bindData(points) {
    var len = points.length;
    var dtlen = env.data.length;
    var multiplier = Math.floor(len / dtlen);
    var calc_len = multiplier * dtlen;

    var ids = {};
    var counts = {};
    env.data.forEach((v) => {
        ids[v.cid_name] = ids[v.cid_name] || [];
        ids[v.cid_name].push(v);
    });

    var sum = 0;
    var cat_count = 0;
    var last_cat = null;
    for (var i in ids) {
        counts[i] = Math.floor(ids[i].length * multiplier);
        sum += counts[i];
        cat_count++;
        last_cat = counts[i];
    }
    var keys = Object.keys(counts);
    var roundrobin = 0;
    while (sum < len) {
        var key = keys[roundrobin];
        roundrobin++;
        roundrobin = roundrobin % keys.length;
        counts[key]++;
        sum++;
    }
    for (var i in counts) {
        while (ids[i].length < counts[i]) {
            var o = ids[i][0];
            ids[i].push({
                "key": o.key,
                "cid": o.cid,
                "cid_name": o.cid_name,
                "fake": 1
            });
        }
        ids[i] = ao.shuffleArray(ids[i]);
        console.log(ids[i]);
    }

    var ptid = 0;
    for (var i in counts) {
        var ori_id = ptid;
        for (var j = 0; j < ids[i].length; j++) {
            baked.points[ptid].content = ids[i][j];
            baked.points[ptid++].content.targets = {};
        }
        while (true) { //bad bad choice
            var anchor = Math.floor(Math.random() * ids[i].length) + ori_id;
            if (!baked.points[anchor].content.fake) continue; //..wow
            ids[i].anchor = anchor;
            break;
        }
    }

    baked.counts = counts;
    baked.ids = ids;
    console.log(cat_count, counts, sum, len)
}

function bake_shape_reel() {
    var geo = new three.Geometry(); //for debug reasons
    var counts = baked.counts;
    var ids = baked.ids;
    var x = 0;
    var _max_h = 50;
    var x_margin = 8;
    var x_tiny_margin = 2;
    for (var cat in counts) {
        var y = 0;
        for (var i = 0; i < counts[cat]; i++) {
            var vec3 = new three.Vector3(
                x, -Math.min(counts[cat], _max_h) / 2 + y, 0
            );
            ids[cat][i].reel = vec3;
            geo.vertices.push(vec3);
            y++;
            if (y > _max_h) {
                y = 0;
                x += x_tiny_margin;
            }
        }
        x += x_margin;
    }
    x -= x_margin; //?

    var r = 80;
    for (var i = 0; i < geo.vertices.length; i++) {
        var vec = geo.vertices[i];
        var _theta = (vec.x - x / 2) / x + Math.PI / 2;
        vec.theta = _theta;
        vec.r = r;
        vec.y *= 10;
    }
}


//paint utils

function beginPaint(w, h, debug) {
    var canvas = document.createElement("CANVAS");
    canvas.height = h;
    canvas.width = w;
    if (debug) {
        document.body.appendChild(canvas);
    }
    var ctx = canvas.getContext("2d");
    ctx.w = w;
    ctx.h = h;
    return ctx;
}

function doText(c, str, font) {
    // console.log(typeof str); typeof str == "string" ? "74px DINCond-Black" :
    font = font || "90px DINCond-Black";
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
    return ao.shuffleArray(pos);
}

window.beginPaint = beginPaint;
window.endPaint = endPaint;
window.doText = doText;


function bake_big_numbers(number) {
    var ctx = beginPaint(300, 100, false);
    doText(ctx, number);
    var pos = endPaint(ctx, 1, 0);
    return pos;
}