import "./after_init";
import * as updator from "./lib/updatable.js";
import * as loader from "./loader.js";
import * as dt from "./data.js";
import * as q from "./components/*.vue";
import Vue from 'vue'

window.sharedData = {
    patents: window.patents,
    control: window.control,
    data: window.data,
    pins: window.pins
};

for (var i in q) {
    Vue.component(i, q[i].default);
}

import * as mainShape from "./main_shape"

window.THREE.ShaderChunk["color_fragment"] = [
    '#ifdef USE_COLOR',
    'diffuseColor.rgb *= vColor;',
    '#endif',
    '#if defined(INSTANCE_COLOR)',
    'diffuseColor.rgb *= vInstanceColor;',
    // '#ifdef PHYSICAL',
    // 'totalEmissiveRadiance.rgb *= vInstanceColor;',
    // '#endif',
    '#endif'
].join("\n");

//main scene..

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

const composer = new THREE.EffectComposer(renderer);

// const composer = new EffectComposer(new THREE.WebGLRenderer());
// composer.renderer.setClearColor(0xdd6601);
// composer.renderer.setClearColor(window.THREE_BG != undefined ? window.THREE_BG : 0xaaaaaa);

const camera = new THREE.PerspectiveCamera(
    50,
    data.width / data.height,
    0.1,
    1000
);

window.camera = camera;

// const ambientLight = new THREE.AmbientLight(0xffffff);
const scene = new THREE.Scene();
// scene.add(ambientLight);
// scene.background = new THREE.Color( 'green' );
var light = new THREE.HemisphereLight(0x008af1, 0x108cee, 1);//new THREE.HemisphereLight(0x0090fc, 0x0c65f2, 2); // window.WHITE_WF ? new THREE.HemisphereLight(0xffffff, 0, 2) : 
// var light = new THREE.HemisphereLight(0xee8822, 0x0011ff, 2);
// var light = new THREE.HemisphereLight(0xff6611, 0x113322, 1);
window.light = light;

scene.add(light);

var orbit_controls;
if (window.DEBUG) {
    var orbit_controls = new THREE.OrbitControls(camera);
    orbit_controls.update();
}

camera.position.set(0, 0, window.data.z);

var calc_vec = new THREE.Vector3();
window.project_arr = function (p) {
    calc_vec.set(p[0], p[1], p[2]);
    // console.log(p[0], p[1], p[2], calc_vec.project(camera));
    return calc_vec.project(camera);
}


window.skyRGB = [0xff, 0xff, 0xff];//[0xff, 0x66, 0x33];
window.groundRGB = [0xff, 0xff, 0xff];//[0xff, 0x11, 0x01];

var skyRGB_E = [0xff, 0xff, 0xff];//[0xff, 0x66, 0x33]; 
var groundRGB_E = [0xff, 0xff, 0xff];//[0xff, 0x11, 0x01];
updator.enable(function () {
    if (window.DEBUG) {
        orbit_controls.update();
    } else {
        // sharedData.data.z.to = ;
        // console.log(control.zoom);
        camera.position.set(0, 0, window.data.z - (window.ZOOM_IN || 0) - control.zoom);
        control.zoom_t = 0;
        control.z = window.data.z - (window.ZOOM_IN || 0) - control.zoom;
    }
    for (var i = 0; i < 3; i++) {
        skyRGB_E[i] = updator.ease(skyRGB_E[i], skyRGB[i], 0.1, 0.00001);
        groundRGB_E[i] = updator.ease(groundRGB_E[i], groundRGB[i], 0.1, 0.00001);
    }
    // if(!window.WHITE_WF) {
    //     light.color.setRGB(skyRGB_E[0] / 255, skyRGB_E[1] / 255, skyRGB_E[2] / 255);
    //     light.groundColor.setRGB(groundRGB_E[0] / 255, groundRGB_E[1] / 255, groundRGB_E[2] / 255);
    // }
    
    composer.render();
});

composer.addPass(new THREE.RenderPass(scene, camera));

var effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
effectFXAA.uniforms.resolution.value.set(1 / 
    (data.width  * data.hdBoost), 1 / (data.height * data.hdBoost));
composer.addPass(effectFXAA);

window.composer = composer;


var bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(data.width, data.height), 0.5, 0.5, 0.8);
window.DISABLE_BLOOM ? null : composer.addPass(bloomPass);

var copyShader = new THREE.ShaderPass(THREE.CopyShader);
copyShader.renderToScreen = true;
composer.addPass(copyShader);

renderer.gammaInput = true;
renderer.gammaOutput = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
renderer.toneMapping = THREE.LinearToneMapping;
renderer.toneMappingExposure = Math.pow(1, 4.0);

renderer.setSize(data.width * data.hdBoost, data.height * data.hdBoost);
composer.setSize(data.width * data.hdBoost, data.height * data.hdBoost);

loader.load(renderer, () => {
    dt.buildFakeData();
    document.body.querySelector(".main").appendChild(
        composer.renderer.domElement
    );
    composer.renderer.domElement.style.height = data.height;
    composer.renderer.domElement.style.width = data.width;
    scene.add(mainShape.build());
    updator.init()


    new Vue({
        el: '#app',
        data: sharedData,
        methods: {
            toggle: function() {
                window.sharedData.control.leap_bypass = !window.sharedData.control.leap_bypass;
            }
        },
        computed: {}
    })

});