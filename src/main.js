import * as updator from "./updatable.js";
// import * as THREE from "three";
import * as MainShape from "./mainshape.js";
import * as Controller from "./orbit.js";
import "./SimplexNoise.js";

import * as Painter from "./datapaint.js";

const CONTROLS = false;
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

import "../node_modules/three/examples/js/controls/OrbitControls.js";
import "../node_modules/three/examples/js/shaders/CopyShader.js";
import "../node_modules/three/examples/js/shaders/BokehShader.js";
import "../node_modules/three/examples/js/shaders/SSAOShader.js";
import "../node_modules/three/examples/js/shaders/LuminosityHighPassShader.js";
import "../node_modules/three/examples/js/shaders/SMAAShader.js";
import "../node_modules/three/examples/js/shaders/ConvolutionShader.js";
import "../node_modules/three/examples/js/shaders/FXAAShader.js";
import "../node_modules/three/examples/js/postprocessing/EffectComposer.js";
import "../node_modules/three/examples/js/postprocessing/BokehPass.js";
import "../node_modules/three/examples/js/postprocessing/ShaderPass.js";
import "../node_modules/three/examples/js/postprocessing/RenderPass.js";
import "../node_modules/three/examples/js/postprocessing/SSAOPass.js";
import "../node_modules/three/examples/js/postprocessing/SMAAPass.js";
import "../node_modules/three/examples/js/postprocessing/BloomPass.js";
import "../node_modules/three/examples/js/postprocessing/UnrealBloomPass.js";

const WIDTH = 1920;
const HEIGHT = 1080;

const clock = new THREE.Clock();

function init() {

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: 1,
        transparency: 1
    });

    const composer = new THREE.EffectComposer(renderer);

    // const composer = new EffectComposer(new THREE.WebGLRenderer());
    // composer.renderer.setClearColor(0xdd6601);
    composer.renderer.setClearColor(0x222222);

    const camera = new THREE.PerspectiveCamera(
        50,
        WIDTH / HEIGHT,
        0.1,
        1000
    );

    // const ambientLight = new THREE.AmbientLight(0xffffff);
    const scene = new THREE.Scene();
    // scene.add(ambientLight);

    if (CONTROLS) {
        var controls = new THREE.OrbitControls(camera);
        controls.update();
    }
    camera.position.set(0, 0, 100);


    // var dirLight = new THREE.DirectionalLight(0xffffff, 1);
    // dirLight.position.set(0, 0, 100);

    // dirLight.shadow.mapSize.width = 2048; // default
    // dirLight.shadow.mapSize.height = 2048; // default
    // dirLight.shadow.camera.near = 0.5; // default
    // dirLight.shadow.camera.far = 500; // default
    // dirLight.shadow.camera.left =
    //     dirLight.shadow.camera.bottom = -30; // default
    // dirLight.shadow.camera.right =
    //     dirLight.shadow.camera.top = 30; // default

    // dirLight.castShadow = true;
    // scene.add(dirLight);


    // var lightBulb = new THREE.PointLight(0xffffff, 1);
    // lightBulb.position.set(0, 0, 100);

    // scene.add(lightBulb);

    // var lightBulb2 = new THREE.PointLight(0xffffff, 1);
    // lightBulb2.position.set(0, 0, -100);

    // scene.add(lightBulb2);


    // var planeGeometry = new THREE.PlaneBufferGeometry(20, 20, 32, 32);
    // var planeMaterial = new THREE.MeshStandardMaterial({
    //     color: 0x00ff00
    // })
    // var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // plane.receiveShadow = true;
    // scene.add(plane);

    // var directionalLightShadowHelper = new THREE.CameraHelper(dirLight.shadow.camera);
    // scene.add(directionalLightShadowHelper);

    // var dirLight2 = new THREE.DirectionalLight(0xaaeeff, 1);
    // dirLight2.position.set(2000, 10, -10);
    // dirLight2.castShadow = false;
    // scene.add(dirLight2);


    var light = new THREE.HemisphereLight(0xff6633, 0xff1101, 2);
    scene.add(light);
    // scene.add(camera);

    var core = () => {
        var cubeGrp = new THREE.Group();
        updator.enable(() => {});
        return cubeGrp;
    }

    scene.add(core());
    MainShape.build(composer.renderer, (o) => {
        scene.add(o);
    });
    composer.renderer.update = function () {
        if (CONTROLS) {
            controls.update();
        }
        // renderer.render(scene, camera);
        composer.render();
    };

    composer.addPass(new THREE.RenderPass(scene, camera));

    // var bokehPass = new THREE.BokehPass(scene, camera, {
    //     focus: 4,
    //     aperture: 2,
    //     maxblur: 0.1,
    //     width: WIDTH,
    //     height: HEIGHT
    // });
    // bokehPass.renderToScreen = true;
    // composer.addPass(bokehPass);



    var effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
    effectFXAA.uniforms.resolution.value.set(1 / WIDTH, 1 / HEIGHT);
    composer.addPass(effectFXAA);


    var bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(WIDTH, HEIGHT), 0.5, 0.5, 0.8);
    composer.addPass(bloomPass);

    var copyShader = new THREE.ShaderPass(THREE.CopyShader);
    copyShader.renderToScreen = true;
    composer.addPass(copyShader);

    // var ssaoPass = new THREE.SSAOPass(scene, camera, WIDTH, HEIGHT);
    // ssaoPass.kernelRadius = 20;
    // ssaoPass.minDistance = 0.0113;
    // ssaoPass.maxDistance = 0.08;
    // ssaoPass.renderToScreen = true;
    // composer.addPass(ssaoPass);


    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = Math.pow(1, 4.0);


    renderer.setSize(WIDTH, HEIGHT);
    composer.setSize(WIDTH, HEIGHT);
    return composer;
}


var composer = init();
document.body.querySelector(".main").appendChild(
    composer.renderer.domElement
);
updator.enable(composer.renderer.update);
updator.init();