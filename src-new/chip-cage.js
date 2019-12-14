import * as three from "three";
import * as ao from "../libao";
import env from "./env.js";

export var grp = new three.Group();



var colors = [];
var geos = [];
var ptmat = new three.PointsMaterial({
    blending: three.AdditiveBlending,
    color: 0x333333,
    sizeAttenuation: true,
    depthTest: false,
    size: 0.2,
});

function chip_cage(rot) {

    function pick_col() {
        var c = new THREE.Color(ao.pick([
            // 0x033313,
            // 0x101233,
            // 0x000001,
            // 0x020602,
            // 0x030501
            0x101233,
            0x020602,
            0x030601
        ]));
        c.old = c.clone();
        colors.push(c);
        return c;
    }

    var geo = new three.Geometry();
    geos.push(geo);
    var ptgeo = new three.Geometry();
    var mat = new three.LineBasicMaterial({
        blending: three.AdditiveBlending,
        color: 0xffffff,
        vertexColors: three.VertexColors,
        depthTest: false,
        depthWrite: false
    });
    var dirs = [
        new three.Vector3(-1, 0, 0),
        new three.Vector3(-1, -1, 0).normalize(),
        new three.Vector3(0, -1, 0),
    ];

    function grow(loc, dir, steps, stripCol) {
        if (steps > 50 || Math.random() > 0.92) return;
        if (Math.random() > 0.95) {
            ptgeo.vertices.push(loc);
        }
        var v = loc.clone();
        var delta = dirs[dir].clone().multiplyScalar(Math.pow(Math.random() + 0.05, 2) * 3);
        v = v.add(delta);
        geo.vertices.push(loc);
        geo.vertices.push(v);
        geo.colors.push(stripCol);
        geo.colors.push(stripCol);

        if (Math.random() > 0.9) { //chance of turnning
            dir += Math.random() > 0.5 ? 1 : -1;
            dir = dir < 0 ? 0 : (dir > (dirs.length - 1) ? (dirs.length - 1) : dir);
        }
        grow(v, dir, steps + 1, stripCol); //next
        if (Math.random() > 0.85) { //split
            dir += Math.random() > 0.5 ? 1 : -1;
            dir = dir < 0 ? 0 : (dir > (dirs.length - 1) ? (dirs.length - 1) : dir);
            grow(v, dir, steps + 1, pick_col());
        }
    }
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            grow(new three.Vector3(
                    Math.floor(Math.random() * 10) * 2,
                    Math.floor(Math.random() * 10) * 2, (j - 5) * 5),
                1, 0, pick_col());
        }
    }

    var m = new three.LineSegments(geo, mat);
    m.rotation.z = rot * Math.PI / 2;
    var pt = new three.Points(ptgeo, ptmat);
    pt.rotation.z = rot * Math.PI / 2;
    grp.add(m);
    grp.add(pt);
}

chip_cage(0);
chip_cage(1);
chip_cage(2);
chip_cage(3);

ao.loop((t) => {
    var jtx = Math.random() < env.circuit_opacity_ease.value ? env.circuit_opacity_ease.value : 0;
    for (var i = 0; i < colors.length; i++) {
        var alpha = (0.5 + 0.5 * Math.sin(t * 3 + i / 10)) * jtx;
        colors[i].setRGB(
            ao.ease(colors[i].r, colors[i].old.r * alpha, 0.1, 0.0001),
            ao.ease(colors[i].g, colors[i].old.g * alpha, 0.1, 0.0001),
            ao.ease(colors[i].b, colors[i].old.b * alpha, 0.1, 0.0001)
        );
    }
    for (var i = 0; i < geos.length; i++) {
        geos[i].colorsNeedUpdate = true;
    }
    var po = jtx * 0.2;
    ptmat.color.setRGB(po, po, po);
})