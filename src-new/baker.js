import * as ao from "../libao";
import * as three from "three";
import env from "./env";

export var baked = {
    points: [],
    counts: {},
    ids: {}
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
        for (var j = 0; j < ids[i].length; j++) {
            baked.points[ptid].content = ids[i][j];
            baked.points[ptid++].content.targets = {};
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