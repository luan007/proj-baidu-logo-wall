import * as updator from "./updatable.js";
import * as THREE from "three";

window.mode = 0;

var numbers = document.createElement("CANVAS");
var ctx = numbers.getContext('2d');
document.body.appendChild(numbers);
numbers.width = numbers.height = 216;
var tlist = [];
var clist = [];
var _flag = false;
setInterval(() => {
    ctx.clearRect(0, 0, 216, 216);
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = 'Bold 150px PingFang SC';
    ctx.fillText(Math.round(Math.random() * 50 + 40), 216 / 2, 216 / 2);
    var d = ctx.getImageData(0, 0, 216, 216).data;
    tlist = [];
    clist = [];
    console.log(d);
    for (var i = 0; i < 216 * 216; i++) {
        if (d[i * 4 + 3] == 0) {
            continue;
        } else {
            tlist.push([0.05 * (i % 216 - 216 / 2), -0.05 * (Math.round(i / 216) - 216 / 2), 0]);
            clist.push(d[i * 4 + 3]);
        }
    }
    _flag = 200;
}, 15000);


var system = () => {

    //some very min stuff
    var ps = [];

    const COUNT = 36 * 36 * 36;
    var geo = new THREE.Geometry();
    var material = new THREE.PointCloudMaterial({
        vertexColors: true,
        size: 0.08,
        opacity: 0.5,
        transparent: true,
        blending: THREE.MultiplyBlending,
        depthTest: false
    });
    var _x = 0;
    var _y = 0;
    var _cx = 0;
    var _cy = 0;
    var _cz = 0;
    for (var i = 0; i < COUNT; i++) {
        var vert = new THREE.Vector3(10 * (-Math.random() * 1 + 0.5), 10 * (-Math.random() * 1 + 0.5), 10 * (-Math.random() * 1 + 0.5));
        ps.push({
            p: [0, 0, 0],
            damp: 0.92,
            v: [2 * (-Math.random() * 1 + 0.5), 2 * (-Math.random() * 1 + 0.5), 2 * (-Math.random() * 1 + 0.5)],
            a: [0, 0, 0],
            acc_seed: Math.random() * 0.3 + 0.7,
            target: [0, 0, 0],
            cube_target: [0.13 * (_cx - 18), 0.13 * (_cy - 18), 0.13 * (_cz - 18)],
            matrix_target: [12.3 * (_cx - 18), 12.3 * (_cy - 18), 12.3 * (_cz - 18)],
            center: _cx == 18 && _cy == 18 && _cz == 18
        });
        geo.colors.push(new THREE.Color(0xda5e28));
        geo.vertices.push(vert);
        _cx++;
        _cy = _cx >= 36 ? _cy + 1 : _cy;
        _cx = _cx >= 36 ? 0 : _cx;
        _cz = _cy >= 36 ? _cz + 1 : _cz;
        _cy = _cy >= 36 ? 0 : _cy;
    }
    var mesh = new THREE.PointCloud(geo, material);

    function updateParticle() {
        var t = 0.1;
        for (var i = 0; i < COUNT; i++) {
            var cur = ps[i];
            var p = geo.vertices[i];

            switch (mode) {
                case 0:
                    //36*36*36
                    cur.target = cur.cube_target;
                    cur.damp = 0.92;
                    if (cur.center) {
                        geo.colors[i].set(0xda5e28);
                    }
                    break;
                case 1:
                    cur.damp = 0.6;
                    cur.target = cur.matrix_target;
                    if (cur.center) {
                        geo.colors[i].set(0xffffff);
                    }
                    break;
                case 2:
                    if (_flag > 100) {
                        for (var j = 0; j < 3; j++) {
                            cur.v[j] += 0.5 * (-Math.random() * 1 + 0.5); //, 0.1 * (-Math.random() * 1 + 0.5), 0.1 * (-Math.random() * 1 + 0.5)];
                        }
                    }
                    if (_flag > 0) {
                        for (var j = 0; j < 3; j++) {
                            cur.v[j] += 0.1 * (-Math.random() * 1 + 0.5); //, 0.1 * (-Math.random() * 1 + 0.5), 0.1 * (-Math.random() * 1 + 0.5)];
                        }
                    }
                    if (cur.center) {
                        geo.colors[i].set(0xda5e28);
                    }
                    cur.damp = Math.random() * 0.05 + 0.9;
                    cur.target = tlist.length == 0 ? cur.taget : tlist[i % tlist.length];
                    break;
            }

            for (var j = 0; j < 3; j++) {
                cur.a[j] = (cur.target[j] - cur.p[j]) * 0.2 * (cur.acc_seed); //target
                cur.v[j] += cur.a[j] * t; //acc
                cur.v[j] *= cur.damp; //damp
                cur.p[j] += cur.v[j] * t; //move
            }

            p.setX(cur.p[0]);
            p.setY(cur.p[1]);
            p.setZ(cur.p[2]);
        }
        geo.verticesNeedUpdate = true;
        geo.colorsNeedUpdate = true;
        _flag = _flag > 0 ? (_flag - 1) : _flag;
    }

    var rotX = 0;
    var rotY = 0;
    var rotZ = 0;
    var ezX = 0;
    var ezY = 0;
    var ezZ = 0;
    updator.enable((t, dt) => {
        updateParticle();
        //36*36*36

        switch (mode) {
            case 0:
                //36*36*36
                mesh.rotateX(0.001);
                mesh.rotateY(0.002);
                break;
            case 1:
                rotX = mesh.rotation.x;
                rotY = mesh.rotation.y;
                rotZ = mesh.rotation.z;
                rotX = updator.ease(rotX, 0.2, 0.02, 0.00001);
                rotY = updator.ease(rotY, -.9, 0.02, 0.00001);
                rotZ = updator.ease(rotZ, 0.7, 0.02, 0.00001);
                mesh.rotation.set(
                    rotX,
                    rotY,
                    rotZ
                )
                break;
            default:
                rotX = mesh.rotation.x;
                rotY = mesh.rotation.y;
                rotZ = mesh.rotation.z;
                rotX = updator.ease(rotX, 0, 0.02, 0.00001);
                rotY = updator.ease(rotY, 0, 0.02, 0.00001);
                rotZ = updator.ease(rotZ, 0, 0.02, 0.00001);
                mesh.rotation.set(
                    rotX,
                    rotY,
                    rotZ
                )
                break;
        }


    });




    return mesh;
}



const WIDTH = 1920;
const HEIGHT = 1080;

function init() {
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
    });
    renderer.setClearColor(0xffffff);

    const camera = new THREE.PerspectiveCamera(
        50,
        WIDTH / HEIGHT,
        0.1,
        1000
    );
    const scene = new THREE.Scene();
    camera.position.z = 20;
    var light = new THREE.HemisphereLight(0xf0f0f0, 0x333333, 3);

    scene.add(light);

    scene.add(camera);

    var core = () => {
        var scale = 0;
        var cubeGrp = new THREE.Group();
        var cube = new THREE.TetrahedronBufferGeometry(0.5, 1);
        var cubeMat = new THREE.MeshBasicMaterial({
            color: 0xda5e28,
            transparent: true,
            opacity: 0.9,
            wireframe: true,
        });
        var cubeMesh = new THREE.Mesh(cube, cubeMat);

        var cubeMat2 = new THREE.MeshStandardMaterial({
            color: 0xda5e28,
            flatShading: true,
            roughness: 0.5,
        });
        var cubeMesh2 = new THREE.Mesh(cube, cubeMat2);
        cubeMesh2.scale.set(0.3, 0.3, 0.3);
        cubeGrp.add(cubeMesh);
        cubeGrp.add(cubeMesh2);

        updator.enable(() => {
            switch (window.mode) {
                case 1:
                    scale = updator.ease(scale, 2, 0.0005, 0.0001);
                    break;
                default:
                    scale = updator.ease(scale, 0, 0.1, 0.0001);
                    break;
            }
            if (scale == 0) {
                cubeGrp.visible = false;
            } else {
                cubeGrp.visible = true;
                cubeGrp.scale.set(scale, scale, scale);
            }
            cubeGrp.rotateX(0.02);
            cubeGrp.rotateY(0.01);
        });
        return cubeGrp;
    }

    scene.add(core());
    scene.add(system());
    renderer.setSize(WIDTH, HEIGHT);
    renderer.update = function () {

        switch (window.mode) {
            case 1:
                camera.position.z = updator.ease(camera.position.z, 5, 0.01, 0.00001);
                break;
            default:
                camera.position.z = updator.ease(camera.position.z, 20, 0.01, 0.00001);
                break;
        }

        renderer.render(scene, camera);
    };
    return renderer;
}
var renderer = init();
document.body.querySelector(".main").appendChild(
    renderer.domElement
);
updator.enable(renderer.update);
updator.init();