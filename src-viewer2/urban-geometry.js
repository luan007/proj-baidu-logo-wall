import env from "./env"
import * as three from "three";
import * as ao from "../libao";
export var group = new three.Group();

export function init() {
    for (var x = -20; x < 20; x += 2) {
        (() => {
            var m = new three.MeshBasicMaterial({
                envMap: ao.threeResources["env"]
            });
            var g = new three.BoxGeometry(0.9, 0.9, 0.1);
            var ms = new three.Mesh(g, m);
            ms.rotation.y = Math.PI / 2;
            ms.rotation.x -= Math.PI / 8;
            ms.position.x = x * 4;
            group.add(ms);
            var target = 0;
            ao.loop(() => {
                target += Math.random() > 0.99 ? Math.PI / 2 : 0;
                ms.rotation.y = ao.ease(ms.rotation.y, target, 0.05, 0.00001);
                ms.rotation.x = ao.ease(ms.rotation.x, target, 0.05, 0.00001);
            });
        })();
    }


    for (var v = 0; v < 10; v++) {
        var y = ((Math.random() > 0.5 ? 1 : -1) * Math.random() * 3)
        var sz = Math.random() * 100
        for (var x = -40; x < 40; x += 0.5) {
            ((x) => {
                var m = new three.MeshStandardMaterial({
                    envMap: ao.threeResources["ldr"],
                });
                var g = new three.BoxGeometry(0.3, 0.3, 0.05);
                var ms = new three.Mesh(g, m);
                ms.rotation.y = Math.PI / 2;
                ms.position.x = x;
                ms.position.y = y;
                ms.position.z = -10 - sz;
                group.add(ms);
                var target = 0;
                ao.loop((t) => {
                    // target += Math.random() > 0.99 ? Math.PI / 2 : 0;
                    var q = t * 0.1 + x * 0.1;
                    ms.rotation.y = q;
                    ms.rotation.x = q;
                });
            })(x);
        }
    }

}