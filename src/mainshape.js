// import * as THREE from "three";
import * as Loader from "./resources.js";
import _instance from 'three-instanced-mesh';
import * as updator from './updatable.js';
import "./SimplexNoise.js";
import * as Control from "./orbit.js";
import * as Painter from "./datapaint.js";
var EquirectangularToCubemap = require('three.equirectangular-to-cubemap');
//https://matheowis.github.io/HDRI-to-CubeMap/
const pi2 = 3.1415926;
var InstancedMesh = _instance(window.THREE);
window.mode = 0;
var vecCal = new THREE.Object3D();
var normVec = new THREE.Vector3();

var noise = new SimplexNoise();


window.form = 3;
window.form_t = 3;

updator.enable(() => {
    window.form = updator.ease(window.form, window.form_t, 0.3);
});


window.addEventListener("load", () => {
    var ct = beginPaint(300, 150, false);
    doText(ct, "12051");
    window.mainData = {
        main: endPaint(ct)
    }
})


class p {
    constructor(id, iNum) {
        this.p = [0, 0, 0];
        this.v = [0, 0, 0];
        this.a = [0, 0, 0];
        this.r = [0, 0, 0];
        this.c = new THREE.Color(0, 0, 0);
        this.c_t = new THREE.Color(0, 0, 0);
        this.c_e = 0.1;
        this.damp = 0;
        this.qdamp = Math.random() * 0.06 + 0.02;
        this.r_t = [0, 0, 0];
        this.r_e = 0.02 + Math.random() * 0.05;
        this.l = 0;
        this.ls = 0;
        this.id = id;
        if (id / iNum < 4589 / 12051) {
            this.c_t = new THREE.Color(.1,.1,.1);
        } else  {
            this.c_t = new THREE.Color(1, 1, 1);
        }

    }
    faceVelocity(t) {
        var x = noise.noise(this.p[0] / 100 + t / 10, this.p[1]);
        var y = noise.noise(this.p[1] / 100 + t / 10, this.p[2]);
        var z = noise.noise(this.p[2] / 100 + t / 10, this.p[3]);
        normVec.set(this.v[0], this.v[1], this.v[2]);
        vecCal.lookAt(normVec);
        this.r_t[0] = vecCal.rotation.x; // + x;
        this.r_t[1] = vecCal.rotation.y; // + y;
        this.r_t[2] = vecCal.rotation.z; // + z;
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

    limitV(lim) {
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
            this.a[i] = (xyz[i] - this.p[i]) * damp * (1 - this.damp);
            if (n) {
                // this.a[i] += 10 * (noise.noise3d(this.p[0] * 0.01 + _t * 0.1, this.p[1] * 0.01 + _t * 0.1, this.p[2] * 0.01 + _t * 0.1)) * Math.abs((xyz[i] - this.p[i]));
                this.a[i] += n * (noise.noise3d(this.p[0] * 0.01 + _t * 0.1, this.p[1] * 0.01 + _t * 0.1, this.p[2] * 0.01 + _t * 0.1)) * Math.abs((xyz[i] - this.p[i]));
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
        this.l -= this.ls * dt;
        this.c.setRGB(
            updator.ease(this.c.r, this.c_t.r, this.c_e, 0.000001),
            updator.ease(this.c.g, this.c_t.g, this.c_e, 0.000001),
            updator.ease(this.c.b, this.c_t.b, this.c_e, 0.000001)
        );
        for (var i = 0; i < 3; i++) {
            this.r[i] = updator.ease(this.r[i], this.r_t[i], this.r_e, 0.000001);
            this.v[i] += this.a[i] * dt;
            this.v[i] = this.v[i] * (1 - this.damp);
            this.p[i] += this.v[i] * dt;
            this.a[i] = 0; //auto clear!
        }
    }
}

export function build(renderer, cb) {
    var mainGrp = new THREE.Group();

    var ball = new THREE.SphereGeometry(100, 60, 60);
    var ballmat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.1,
        wireframe: true,
        side: THREE.BackSide
    });

    var ballMesh = new THREE.Mesh(ball, ballmat);
    mainGrp.add(ballMesh);

    updator.enable(() => {
        ballMesh.rotation.y += 0.001;
    });

    var geo;
    var env_loader = new THREE.TextureLoader();
    env_loader.load("./assets/Warehouse-with-lights.jpg", (res) => {

        var equiToCube = new EquirectangularToCubemap(renderer);

        var env = equiToCube.convert(res, 1024);
        // env.mapping = THREE.CubeRefractionMapping;
        //new THREE.CubeTextureLoader().setPath('assets/env2/').load(['xp.png', 'xn.png', 'yp.png', 'yn.png', 'zp.png', 'zn.png']);
        var mapper = new THREE.TextureLoader().load('assets/dots.png');
        var height = new THREE.TextureLoader().load('assets/data.png');

        var particles = [];
        // var box = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshStandardMaterial({
        //     color: 0xff0000
        // }));
        // mainGrp.add(box);

        Loader.loadarb("./assets/shape_verts_plate.obj", (obj) => {
            geo = obj.children[0].geometry;
            // geo = new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1);
            var mat = new THREE.MeshStandardMaterial({
                // color: 0x4d1f03, //0xff3300,
                color: 0xffffff,
                // emissive: 0xffffff,
                envMapIntensity: 1,
                // emissiveIntensity: 3,
                // bumpMap: height,
                // bumpScale: 0.001,
                // envMap: env,
                clearCoat: 1,
                clearCoatRoughness: 0,
            });

            window.mat = mat;
            mat.roughness = 0;
            mat.metalness = 0;
            Loader.load((obj) => {
                // mainGrp.add(obj);
                var arr = [];
                var norms = [];
                for (var i = 0; i < obj.children.length; i++) {
                    for (var j = 0; j < obj.children[i].geometry.attributes["position"].array.length; j++) {
                        arr.push(obj.children[i].geometry.attributes["position"].array[j]);
                        norms.push(obj.children[i].geometry.attributes["normal"].array[j]);
                    }
                }
                var positions = [];
                var normals = [];
                for (var i = 0; i < arr.length / 3; i++) {
                    var x = arr[i * 3];
                    var y = arr[i * 3 + 1];
                    var z = arr[i * 3 + 2];
                    var found = false;
                    for (var q = 0; q < positions.length / 3; q++) {
                        var _x = positions[q * 3];
                        var _y = positions[q * 3 + 1];
                        var _z = positions[q * 3 + 2];
                        if (Math.abs(_x - x) + Math.abs(_y - y) + Math.abs(_z - z) < 0.1) {
                            found = true;
                            break;
                        }
                    }
                    if (found) {
                        continue;
                    }
                    positions.push(x);
                    positions.push(y);
                    positions.push(z);
                    normals.push(norms[i * 3]);
                    normals.push(norms[i * 3 + 1]);
                    normals.push(norms[i * 3 + 2]);
                }
                console.log("built.", positions.length);
                var iNum = positions.length / 3;
                var instancedMesh = new THREE.InstancedMesh(
                    //provide geometry
                    geo,
                    //provide material
                    mat,
                    //how many instances to allocate
                    iNum,

                    //will the position attributes be changed
                    true,
                    //should there be per instance color variation
                    true,
                    //is the scale known to be uniform, will do less shader work, improperly applying this will result in wrong shading 
                    false
                );
                var obj = new THREE.Object3D();
                let rot = new THREE.Euler(0, 0, 0);
                let quat = new THREE.Quaternion().setFromEuler(rot);
                var ss = new THREE.Vector3(1, 1, 1);
                var ss2 = new THREE.Vector3(0.2, 0.2, 0.2);
                var axisx = new THREE.Vector3(1, 0, 0);
                var axisy = new THREE.Vector3(0, 1, 0);
                var axisz = new THREE.Vector3(0, 0, 1);
                var norm = new THREE.Vector3(0, 0, 0);
                var wrap = 58 * 1.732;
                for (var i = 0; i < iNum; i++) {
                    ss.x = positions[i * 3] * 5;
                    ss.y = positions[i * 3 + 1] * 5;
                    ss.z = positions[i * 3 + 2] * 5;
                    var pt = new p(i, iNum);
                    particles.push(pt);
                    var q = Math.random() * 1 + 1;
                    pt.opos = [];
                    // pt.gridpos = [(i % wrap) - wrap / 2, Math.round(i / wrap) - wrap / 2, 0];
                    pt.gridpos = [ss.x * q, ss.y * q, ss.z * q];
                    pt.targets = [
                        [window.mainData.main[i % window.mainData.main.length][0] * 150,
                            window.mainData.main[i % window.mainData.main.length][1] * 150,
                            0
                        ]
                    ];

                    pt.p[0] = pt.opos[0] = ss.x;
                    pt.p[1] = pt.opos[1] = ss.y;
                    pt.p[2] = pt.opos[2] = ss.z;
                    pt.p[0] = pt.p[1] = pt.p[2] = 0;
                    pt.damp = 0;
                    norm.set(normals[i * 3], normals[i * 3 + 1], normals[i * 3 + 2]);
                    instancedMesh.setPositionAt(i, ss);
                    instancedMesh.setQuaternionAt(i, quat);
                    instancedMesh.setScaleAt(i, ss2);
                    // if (color) {
                    //     _color.setHSL(Math.random(), 0.5, 0.5);
                    //     instancedMesh.setColorAt(i, _color);
                    // }
                }

                var _t = 0;
                var cc = new THREE.Color(0.8, 0.58, 0.31);
                updator.enable(() => {
                    _t += 0.01;
                    // for (var i = 0; i < iNum; i++) {
                    //     let rot = new THREE.Euler(_t / 200 + i / 30000, _t + i / 30000, i / 30000 - _t * 0.3);
                    //     let quat = new THREE.Quaternion().setFromEuler(rot);
                    //     instancedMesh.setQuaternionAt(i, quat);
                    // }
                    for (var i = 0; i < iNum; i++) {
                        if (window.mode == 0) {
                            particles[i].targetArr(particles[i].opos, 0.2, _t, 0.1);
                            particles[i].damp = particles[i].qdamp * 0.4;
                            particles[i].limitV(30);
                            // var j = Math.pow(Math.sin(_t * 2 + i / 1000) * 0.5 + 0.5, 20);
                            // particles[i].setC(j, j, j);
                        } else if (mode == 1) {
                            // particles[i].targetArr(particles[i].gridpos, 2.3);
                            particles[i].targetArr(particles[i].targets[0], 0.5, _t, form);
                            particles[i].damp = particles[i].qdamp * 0.7;
                            particles[i].limitV(30);
                            // particles[i].setRt(0, 3.14 / 2 + 3.14 * 2, 3.14 * 2);
                        } else {
                            // particles[i].targetArr(particles[i].gridpos, 2.3);
                            particles[i].targetPureNoise(23.3, _t);
                            particles[i].damp = 0.01;
                            particles[i].limitV(30);
                            // particles[i].setRt(0, 3.14 / 2 + 3.14 * 2, 3.14 * 2);
                        }
                        particles[i].faceVelocity(_t);

                        particles[i].update(1 / 30);

                        ss.x = particles[i].p[0];
                        ss.y = particles[i].p[1];
                        ss.z = particles[i].p[2];
                        let rot = new THREE.Euler(particles[i].r[0], particles[i].r[1], particles[i].r[2]);
                        let quat = new THREE.Quaternion().setFromEuler(rot);
                        instancedMesh.setQuaternionAt(i, quat);
                        instancedMesh.setPositionAt(i, ss);
                        instancedMesh.setColorAt(i, particles[i].c);
                    }
                    instancedMesh.needsUpdate('position');
                    instancedMesh.needsUpdate('scale');
                    instancedMesh.needsUpdate('quaternion');
                    instancedMesh.needsUpdate('color');
                    instancedMesh.rotation.x = window.control.y * Math.PI * 2;
                    instancedMesh.rotation.y = window.control.x * Math.PI * 2;
                    // instancedMesh.rotation.y = Control.ty;
                    // instancedMesh.rotation.y += 0.0002;
                });
                instancedMesh.visible = true;
                instancedMesh.castShadow = false;
                instancedMesh.receiveShadow = false;
                mainGrp.add(instancedMesh);
                return cb(mainGrp);
            });
        });
    });
}