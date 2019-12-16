import * as three from "three";
import * as ao from "../libao"
import env from "./env"
import {
    Line2
} from "three/examples/jsm/lines/Line2"
import {
    LineGeometry
} from "three/examples/jsm/lines/LineGeometry"
import {
    LineMaterial
} from "three/examples/jsm/lines/LineMaterial"

export var group = new three.Group();

const lineMaterial = new LineMaterial({
    color: 0x010101,
    depthTest: false,
    linewidth: 2,
    blending: three.AdditiveBlending,

});

function wire(r, freq) {
    var points = [];
    for (var x = -35; x < 35; x += 0.01) {
        points.push(x);
        points.push(Math.sin(x / 2 * freq) * r);
        points.push(Math.cos(x / 2 * freq) * r);
    }
    var pts = new Float32Array(points);

    const geometry = new LineGeometry();
    geometry.setPositions(pts);
    lineMaterial.resolution.set(env.width, env.height);
    const line = new Line2(geometry, lineMaterial);
    return line;
}

function DNA() {
    var grp = new three.Group();
    ao.loop(() => {
    });

    for (var i = 0; i < 80; i++) {
        (() => {
            var w = wire(1 + Math.random() * 4, 1 / (Math.random() * 5 + 4));
            w.spd = Math.random() * 0.01;
            w.position.x = Math.random() * 10;
            ao.loop(() => {
                w.rotation.x += w.spd;
            });
            grp.add(w);
        })();
    }
    return grp;
}


group.add(DNA());