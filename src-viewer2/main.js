import * as three from "three";
import * as ao from "../libao";
import * as comps from "./comps/*.vue";
import * as urban from "./urban-geometry";
// import * as dna from "./dna";

import env from "./env";

var renderer = ao.threeRenderer({
    transparency: false,
    // powerPreference: "high-performance",
    height: env.height,
    width: env.width
})

renderer.gammaFactor = 2.2;
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = three.PCFSoftShadowMap;
renderer.shadowMap.autoUpdate = false;
renderer.toneMapping = three.ACESFilmicToneMapping;

renderer.setClearColor(0xcccccc);

renderer.gammaInput = true;
renderer.gammaOutput = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
renderer.toneMapping = THREE.LinearToneMapping;
renderer.toneMappingExposure = Math.pow(1, 4.0);

var scene = ao.threeScene();
var camera = ao.threePerspectiveCamera(6);
camera.position.z = 100;
camera.position.y = 0;

document.querySelector(".scaler").style.transform = `scale(${env.scaler})`;
document.querySelector(".main").appendChild(renderer.domElement);



var rotator = new three.Group();
scene.add(rotator);
scene.add(urban.group);

ao.threeLoadCubemap("./assets/Warehouse-with-lights.jpg", renderer, "env");
ao.threeLoadLDR_PMREM("ldr", renderer, "./assets/ldr/");

// ao.threeUnrealPostprocessingStack();
ao.threeOnload(() => {
    ao.vueLoadComponents(comps);
    ao.vueSetup("#app", env.vue);
    urban.init();
    // env.init();
    ao.threeLoop();
    ao.looperStart();
})