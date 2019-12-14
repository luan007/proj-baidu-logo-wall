import * as three from "three";
import * as ao from "../libao";
import env from "./env";


export var grp = new three.Group();

var ids = {};
var counts = {};
env.data.forEach((v) => {
    ids[v.cid_name] = ids[v.cid_name] || [];
    ids[v.cid_name].push(v);
});

var multiplier = 5;
var sum = 0;
var cat_count = 0;
for (var i in ids) {
    counts[i] = ids[i].length * multiplier;
    sum += counts[i];
    cat_count++;
}

// console.log(cat_count, counts, sum)

var geo = new three.Geometry();
var x = 0;
var _max_h = 50;
for (var cat in counts) {
    var y = 0;
    for (var i = 0; i < counts[cat]; i++) {
        var vec3 = new three.Vector3(
            x, -Math.min(counts[cat], _max_h) / 2 + y, 0
        );
        geo.vertices.push(vec3);
        y++;
        if (y > _max_h) {
            y = 0;
            x += 1;
        }
    }
    x += 2;
}
x -= 2; //?

var r = 1000;
for (var i = 0; i < geo.vertices.length; i++) {
    var vec = geo.vertices[i];
    var _theta = (vec.x - x / 2) / x + Math.PI / 2;
    var _x = Math.cos(_theta * Math.PI * 2 * 0.5) * r;
    var _z = Math.sin(_theta * Math.PI * 2 * 0.5) * r;
    vec.x = _x;
    vec.z = _z;
    vec.y *= 10;
}

var ptmat = new three.PointsMaterial({
    color: 0xfffffff,
    size: 6
});

var ptmesh = new three.Points(geo, ptmat);
ptmesh.position.z = 0;
// ptmesh.position.x = -x / 2;

grp.add(ptmesh);