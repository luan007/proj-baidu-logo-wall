import * as THREE from "three";
import "./lib/SimplexNoise.js";
window.THREE = THREE;
console.log(THREE);

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
