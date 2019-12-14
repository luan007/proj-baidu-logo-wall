import * as three from "three";
import * as ao from "../libao";
import * as ptarr from "./test-ptarray";
// import * as imesh from "./imesh";
import * as chipcage from "./chip-cage";
import * as psys from "./psys";
import * as baker from "./baker";
import * as comps from "./comps/*.vue";

import env from "./env";

var renderer = ao.threeRenderer({
    transparency: false,
    // powerPreference: "high-performance",
    height: env.height,
    width: env.width
})

renderer.setClearColor(0x030303);

renderer.gammaInput = true;
renderer.gammaOutput = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
renderer.toneMapping = THREE.LinearToneMapping;
renderer.toneMappingExposure = Math.pow(1, 4.0);

var scene = ao.threeScene();
var camera = ao.threePerspectiveCamera(45);
camera.position.z = 50;

document.querySelector(".scaler").style.transform = `scale(${env.scaler})`;
document.querySelector(".main").appendChild(renderer.domElement);

var rotator = env.rotator;
scene.add(rotator);

// rotator.add(ptarr.grp);
// rotator.add(imesh.grp);
rotator.add(psys.grp);
scene.add(psys.fixed);


// rotator.position.z = -200;
rotator.add(chipcage.grp);

ao.loop(() => {
    rotator.rotation.y = env.input.rot_offset_e;
    rotator.rotation.x = (0.5 - env.input.ey) * 0.7;
    camera.position.z = env.camera_pos.value;
    camera.position.y = env.camera_elevation.value;
});

ao.threeLoadCubemap("./assets/Warehouse-with-lights.jpg", renderer, "env");
ao.threeLoadLDR_PMREM("ldr", renderer, "./assets/ldr/");
ao.threeLoadObj("./assets/shape_verts_plate.obj", "testgeo");
ao.threeLoadObj("/assets/shape_shell.obj", "shell");

ao.threeLoadTexture("./assets/timeline.png", "timeline");
ao.threeLoadTexture("./assets/timeline_s.png", "timeline_s");

ao.threeLoadTexture("./process/border.png", "b");
ao.threeLoadTexture("./process/border_bold.png", "bb");
ao.threeLoadTexture("./process/logo_process.png", "logo_process");


ao.threeUnrealPostprocessingStack();
ao.threeOnload(() => {
    ao.vueLoadComponents(comps);
    ao.vueSetup("#app", env.vue);
    baker.init();
    psys.init();
    env.init();
    ao.threeLoop();
    ao.looperStart();
})