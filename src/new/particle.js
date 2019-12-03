import * as updator from "./lib/updatable";
import "./lib/SimplexNoise";
import {
    UpdateParticleScenes
} from "./behaviourScene";


var vecCal = new THREE.Object3D();
var normVec = new THREE.Vector3();
var noise = new SimplexNoise();

export class p {
    constructor() {
        this.p = [0, 0, 0];
        this.v = [0, 0, 0];
        this.a = [0, 0, 0];
        this.r = [0, 0, 0];
        this.offset = Math.random() * 10;
        this.c = new THREE.Color(0, 0, 0);
        this.c_t = new THREE.Color(1, 1, 1);
        this.c_e = 0.01 + Math.random() * 0.1;
        this.damp = 0;
        this.qdamp = Math.random() * 0.06 + 0.02;
        this.r_t = [0, 0, 0];
        this.r_e = 0.02 + Math.random() * 0.05;
        this.l = 0;
        this.ls = 0;
        this.s = 0;
        this.s_t = 0.3;
        this.s_e = 0.01 + Math.random() * 0.1;
        this.lim = -1;
    }
    faceVelocity(t) {
        // var x = noise.noise(this.p[0] / 100 + t / 10, this.p[1]);
        // var y = noise.noise(this.p[1] / 100 + t / 10, this.p[2]);
        // var z = noise.noise(this.p[2] / 100 + t / 10, this.p[3]);
        normVec.set(this.v[0], this.v[1], this.v[2]);
        vecCal.lookAt(normVec);
        this.r_t[0] = vecCal.rotation.x; // + x;
        this.r_t[1] = vecCal.rotation.y; // + y;
        this.r_t[2] = vecCal.rotation.z; // + z;
    }
    driftScale(base, _t, amount) {
        this.s_t = base + (0.5 + 0.5 * Math.min(1, Math.max(-1, noise.noise3d(this.p[0] / 100 + _t / 10, this.p[1] / 100 + _t / 20, this.p[2] / 100 + _t / 30)))) * amount;
    }
    setC(r, g, b) {
        this.c_t.setRGB(r, g, b);
    }
    setCarr(arr) {
        this.setC(arr[0], arr[1], arr[2]);
    }
    setRt(a, b, c) {
        this.setRtArr([a, b, c]);
    }
    setRtArr(arr) {
        this.r_t[0] = arr[0];
        this.r_t[1] = arr[1];
        this.r_t[2] = arr[2];
    }
    target(x, y, z, damp) {
        //calculate pos
        var xyz = [x, y, z];
        this.targetArr(xyz, damp);
    }
    drift(_t, amount) {
        this.v[2] += Math.sin(this.offset + _t) * amount;
    }

    limitV(lim) {
        this.lim = lim;
    }
    limitV_Calc() {
        var lim = this.lim;
        normVec.set(this.v[0], this.v[1], this.v[2]);
        var l = Math.min(normVec.length(), lim);
        var v = normVec.normalize().multiplyScalar(l);
        this.v[0] = v.x;
        this.v[1] = v.y;
        this.v[2] = v.z;
    }
    targetArr(xyz, damp, _t, n) {
        //calculate pos
        for (var i = 0; i < 3; i++) {
            //G(m1m2) / R2
            this.a[i] = (xyz[i] - this.p[i]) * damp;
            if (n) {
                // this.a[i] += 10 * (noise.noise3d(this.p[0] * 0.01 + _t * 0.1, this.p[1] * 0.01 + _t * 0.1, this.p[2] * 0.01 + _t * 0.1)) * Math.abs((xyz[i] - this.p[i]));
                this.a[i] += n * (noise.noise(this.p[i] * 0.01 + _t * 0.1, this.p[(i + 1) % 3] * 0.01 + _t * 0.1)) * Math.abs((xyz[i] - this.p[i]));
            }
            // this.v[i] = (xyz[i] - this.p[i]) * damp;
        }
    }
    targetPureNoise(_t, n) {
        for (var i = 0; i < 3; i++) {
            //G(m1m2) / R2
            this.a[i] += n * (noise.noise(this.p[i] * 0.01 + _t * 0.1, this.p[(i + 1) % 3] * 0.01 + _t * 0.1))
        }
    }
    update(dt) {
        //this.l -= this.ls * dt;
        this.c.setRGB(
            updator.ease(this.c.r, this.c_t.r, this.c_e, 0.000001),
            updator.ease(this.c.g, this.c_t.g, this.c_e, 0.000001),
            updator.ease(this.c.b, this.c_t.b, this.c_e, 0.000001)
        );
        this.s = updator.ease(this.s, this.s_t, this.s_e, 0.000001);
        for (var i = 0; i < 3; i++) {
            this.r[i] = updator.ease(this.r[i], this.r_t[i], this.r_e, 0.000001);
            this.v[i] += this.a[i] * dt;
            this.v[i] = this.v[i] * (1 - this.damp);
        }
        if (this.lim >= 0) {
            this.limitV_Calc();
        }
        for (var i = 0; i < 3; i++) {
            this.p[i] += this.v[i] * dt;
            this.a[i] = 0; //auto clear!
        }
        this.lim = -1;
    }
}

window.topMostPatent = null;
window.closestPatent = null;
window.closestPoint = null;

var MAX_RAND = 15;
window.rand_picks = [];

var rot = new THREE.Euler();
var quat = new THREE.Quaternion();
var pos = new THREE.Vector3();
var sz = new THREE.Vector3();
export class p_fly extends p {
    constructor(point, instanced_mesh) {
        super();
        this.point = point;
        this.id = this.point.id;
        this.instanced_mesh = instanced_mesh;
        this.opos = [
            this.point.position.x * 5,
            this.point.position.y * 5,
            this.point.position.z * 5
        ];
        this.point.front = 0;
        // if (this.point.tags["申请地区"] == "中国") {
        //     this.c_t.setRGB(1, 1, 1);
        //     this.opos = [
        //         this.point.position.x * 9,
        //         this.point.position.y * 9,
        //         this.point.position.z * 9
        //     ];
        // } else {
        //     this.c_t.setRGB(0.1, 0.1, 0.1);
        // }
    }
    update(dt, _t) {
        UpdateParticleScenes(this, dt, _t);
        super.update(dt);
        pos.set(this.p[0], this.p[1], this.p[2]);
        rot.set(this.r[0], this.r[1], this.r[2]);
        sz.set(this.s, this.s, this.s);
        quat.setFromEuler(rot);
        this.instanced_mesh.setQuaternionAt(this.id, quat);
        this.instanced_mesh.setPositionAt(this.id, pos);
        this.instanced_mesh.setColorAt(this.id, this.c);
        this.instanced_mesh.setScaleAt(this.id, sz);
        var v = this.instanced_mesh.localToWorld(pos);
        if (this.point.content) {
            this.point.content.world_position[0] = v.x;
            this.point.content.world_position[1] = v.y;
            this.point.content.world_position[2] = v.z;
            if (!window.topMostPatent || (window.topMostPatent.world_position[2] <= this.point.content.world_position[2])) {
                window.topMostPatent = this.point.content;
            }
        }

        var pt = project_arr([v.x, v.y, v.z]);
        this.point.pt = this.point.pt || [];
        this.point.pt[0] = pt.x;
        this.point.pt[1] = pt.y;
        this.point.front = v.z;


        // if (!window.closestPoint ||
        //     (
        //         v.z > 0 &&
        //         (Math.abs(pt.x) + Math.abs(pt.y) <
        //             Math.abs(window.closestPoint.point.pt[0]) + Math.abs(window.closestPoint.point.pt[1])
        //         ))
        // ) {
        //     window.closestPoint = this;
        // }

        if (control.mode == -1) {
            var remove = false;
            var old = window.rand_picks.indexOf(this.point);
            var cx = (pt.x);
            var cy = -(pt.y);
            if (v.z > 0 && rand_picks.length < MAX_RAND && old == -1) {
                if ((Math.abs(cx) + Math.abs(cy)) < 1 && Math.random() < 0.5) {
                    window.rand_picks.push(this.point);
                }
            } else if (Math.abs(cx) > 0.8 || Math.abs(cy) > 0.8) {
                remove = true;
            }
            if (v.z <= 0 || Math.random() < 0.01) {
                remove = true;
            }
            if (old >= 0 && remove) {
                window.rand_picks.splice(old, 1);
            }
        }
    }
}

export class p_shape extends p {
    constructor(pos, target) {
        super();
        this.p = pos;
        this.target_pos = target;
        this.init_pos = pos;
        console.log(this);
    }
    update(dt, _t) {
        super.update(dt);
    }
}