import * as dt from "./data.json"
import * as ao from "../libao";
import * as three from "three";

var simplex = ao.openSimplex;

//particle behaviours

var vcache = new THREE.Vector3();
var vecCal = new THREE.Object3D();
var xyz = [0, 0, 0];


var mod_crystal = ao.extra.particleModifier(
    (key, p, dt, arr, i, params, t) => {
        p.emissive_t = p.emissive_t || [0, 0, 0];
        p.steer_capability = p.steer_capability || ((Math.random() * 0.1) + 0.1);
        p.mode = p.mode == undefined ? -1 : p.mode;
        p.burst = p.burst == undefined ? 0 : p.burst;
        p.burst_norm = p.burst_norm == undefined ? 0 : p.burst_norm;
        p.mode_2_ramp = p.mode_2_ramp == undefined ? 0 : p.mode_2_ramp;
        if (p.mode != 2) {
            p.mode_2_ramp = 0;
        }
        if (params.mode != p.mode || params.burst) {
            p.mode = params.mode;
            p.burst = 1;
        }
        if (p.burst > -1) {
            p.burst -= 0.1;
            p.burst_norm = ao.normD(p.burst);
        }

        if (p.mode == 2) {
            p.v[0] = p.v[1] = p.v[2] = 0;
            if (key == 'p') {

                if (p.core.content.cid != data.ring_cursor.active_cid) {
                    if (p.core.content.fake) {
                        p.emissive_t[0] = 0x66;
                        p.emissive_t[1] = 0x66;
                        p.emissive_t[2] = 0x66;
                    } else {
                        p.emissive_t[0] = 0x1a;
                        p.emissive_t[1] = 0x1a;
                        p.emissive_t[2] = 0x1a;
                    }
                } else {
                    if (p.core.content.fake) {
                        p.emissive_t[0] = 0xff;
                        p.emissive_t[1] = 0xff;
                        p.emissive_t[2] = 0xff;
                    } else {
                        p.emissive_t[0] = 0xff;
                        p.emissive_t[1] = 0x66;
                        p.emissive_t[2] = 0x33;
                    }
                }

                if (p == data.ring_cursor.active_elem) {
                    p.emissive_t[0] = 0xff;
                    p.emissive_t[1] = 0xff;
                    p.emissive_t[2] = 0xff;
                }

                ao.extra.particleEasedPropertyVec3Update(p, 'emissive', 0.07);


                p.mode_2_ramp = ao.ease(p.mode_2_ramp, 1, 0.001, 0.0001);

                xyz[0] = p.core.content.reel.x / 30;
                xyz[1] = p.core.content.reel.y / 8;
                xyz[2] = p.core.content.reel.z / 30;
                xyz[0] = Math.cos((p.core.content.reel.theta + data.input.rot_offset_e * 1.5) * Math.PI * 2 * 0.5) * p.core.content.reel.r * 1.6;
                xyz[2] = Math.sin((p.core.content.reel.theta + data.input.rot_offset_e * 1.5) * Math.PI * 2 * 0.5) * p.core.content.reel.r * 1.6;


                //computation

                if (!p.core.content.fake) {
                    vcache.set(xyz[0], xyz[1], xyz[2]);
                    vcache = data.rotator.localToWorld(vcache); //closest = min Z
                    var dist = vcache.z + Math.abs(vcache.x) + Math.abs(vcache.y);
                    //sel computation
                    if (dist < data.ring_cursor.min_dist) {
                        data.ring_cursor.min_dist = dist;
                        data.ring_cursor.calc_elem = p;
                    }
                }
                //and from last frame
                if (p.core.content.cid == data.ring_cursor.active_cid && !p.core.content.fake) {
                    if (data.ring_cursor.active_elem == p) {
                        p.s = ao.ease(p.s, 20, 0.1, 0.0001);
                        p.r_t[0] = -Math.PI * 4 - Math.PI / 2;
                        p.r_t[1] += 0.01;
                        p.r_t[2] += 0.005;
                        ao.extra.particleEasedPropertyVec3Update(p, 'r', 0.05);
                        xyz[0] *= 0.8;
                        xyz[2] *= 0.5;
                    } else {
                        p.s = ao.ease(p.s, 7, 0.1, 0.0001);
                        p.r_t[0] = Math.PI / 2;
                        p.r_t[1] = 0;
                        p.r_t[2] = 0;
                        ao.extra.particleEasedPropertyVec3Update(p, 'r', 0.05);
                    }
                } else {
                    p.s = ao.ease(p.s, 2 + (
                        p.core.content.cid == data.ring_cursor.active_cid ? 1 : 0
                    ), 0.01, 0.0001);

                    p.r_t[0] = Math.PI / 4;
                    p.r_t[1] = 0;
                    p.r_t[2] = 0;
                    ao.extra.particleEasedPropertyVec3Update(p, 'r', 0.05);

                }

                var damp = (0.1 + (p.mode_2_ramp) * 3) * Math.sqrt(p.target_e);
                for (var i = 0; i < 3; i++) {
                    //G(m1m2) / R2
                    p.p[i] = ao.ease(p.p[i], xyz[i], damp, 0.0001);
                }

            }
            return;
        }


        if (key == 'p') {
            vecCal.lookAt(p.heading[0], p.heading[1], p.heading[2]);
            p.r_t[0] = vecCal.rotation.x;
            p.r_t[1] = vecCal.rotation.y;
            p.r_t[2] = vecCal.rotation.z;
            ao.extra.particleEasedPropertyVec3Update(p, 'r', 0.05);
            p.emissive_t[0] = 0x66;
            p.emissive_t[1] = 0xaa;
            p.emissive_t[2] = 0xff;
            ao.extra.particleEasedPropertyVec3Update(p, 'emissive', 0.07);
            return;
        }


        if (p.burst > -1) {
            p.burst -= 0.1;
            p.burst_norm = ao.normD(p.burst);
        }


        if (p.mode == 1) {
            if (key == 'a') {
                p.s = ao.ease(p.s, 1 * data.particle_size, 0.01, 0.0001);
                xyz[0] = p.core.position.x * 2;
                xyz[1] = p.core.position.y * 2;
                xyz[2] = p.core.position.z * 2;
                var damp = 0.2 * p.target_e;
                for (var i = 0; i < 3; i++) {
                    //G(m1m2) / R2
                    p.a[i] = (xyz[i] - p.p[i]) * damp;
                    p.a[i] += (1 + p.burst) * 0.01 * (simplex.noise2D(p.p[i] * 0.1 + t * 0.1, p.p[(i + 1) % 3] * 0.1 + t * 0.1)) * Math.min(1, Math.abs((xyz[i] - p.p[i])));
                }
            }
        } else if (p.mode == 0) {
            if (key == 'a') {
                xyz[0] = p.core.position.x * 3;
                xyz[1] = p.core.position.y * 3;
                xyz[2] = p.core.position.z * 3;
                p.s = ao.ease(p.s, 0.3 * data.particle_size, 0.01, 0.0001);
                var damp = 0.2 * p.target_e;
                for (var i = 0; i < 3; i++) {
                    //G(m1m2) / R2
                    p.a[i] = (xyz[i] - p.p[i]) * damp;
                    p.a[i] += (1 + p.burst) * 0.45 * (simplex.noise2D(p.p[i] * 0.1 + t * 0.1, p.p[(i + 1) % 3] * 0.1 + t * 0.1)) * Math.min(1, Math.abs((xyz[i] - p.p[i])));
                }
            }
        } else if (p.mode == 2) {
            if (key == 'a') {
                xyz[0] = p.core.position.x * 0;
                xyz[1] = p.core.position.y * 0;
                xyz[2] = p.core.position.z * 0;
                p.s = ao.ease(p.s, 0.001 * data.particle_size, 0.01, 0.0001);
                var damp = 0.2 * p.target_e;
                for (var i = 0; i < 3; i++) {
                    //G(m1m2) / R2
                    p.a[i] = (xyz[i] - p.p[i]) * damp;
                    p.a[i] += (1 + p.burst) * 0.45 * (simplex.noise2D(p.p[i] * 0.1 + t * 0.1, p.p[(i + 1) % 3] * 0.1 + t * 0.1)) * Math.min(1, Math.abs((xyz[i] - p.p[i])));
                }
            }
        }

        if (key == 'v') {
            ao.extra.particleUtilDamp(p.v, 0.84 + 0.06 * p.burst_norm);
            ao.extra.particleUtilClamp(p.v, 0, 2.8 + 5 * p.burst_norm);
            p.v[2] += Math.sin(p.offset + t) * 0.00001;
        }

    },
    'avp', {
        mode: 1
    }
);


var data = {
    scaler: 0.5,
    rotator: new three.Group(),
    vue: {
        elems: []
    },
    height: 1080,
    width: 2560,
    camera_pos: ao.eased(50, 50, 0.05, 0.0001),
    camera_elevation: ao.eased(0, 0, 0.1, 0.00001),
    current_scene: "reel",
    circuit_opacity: 0,
    particle_size: 1,
    circuit_opacity_ease: ao.eased(0, 0, 0.008, 0.00001),
    timeline_visibility: ao.eased(0, 0, 0.1, 0.0001),
    reel_visibility: ao.eased(0, 0, 0.1, 0.000001),
    global_e_color: [0x66, 0xaa, 0xff],

    ring_cursor: { //late update - frame delay => 1
        min_dist: 1000000,
        calc_elem: null,
        active_cid: null,
        active_elem: null
    },

    particle_control: {
        mod_crystal: mod_crystal
    },
    input: {
        rot_offset: 0,
        rot_offset_e: ao.eased(0, 0, 0.1, 0.00001),
        x: 0,
        y: 0,
        ex: ao.eased(0, 0, 0.1, 0.000001),
        ey: ao.eased(0, 0, 0.1, 0.000001)
    },
    data: dt.data,
    logos: [{
        logo: "logo_process",
        title: "process"
    }, {
        logo: "bb",
        title: "process"
    }, {
        logo: "b",
        title: "process"
    }]
};

window.data = data;


document.addEventListener("mousemove", e => {
    data.input.x = e.x / (data.width * data.scaler);
    data.input.y = e.y / (data.height * data.scaler);
    data.input.ex.to = data.input.x;
    data.input.ey.to = data.input.y;
});


var scene_idle = ao.sceneBuild((t, dt) => {
    data.circuit_opacity = scene_idle.visibility.to
    data.circuit_opacity_ease.e = data.circuit_opacity != 0 ? 0.008 : 0.01;
    if (scene_idle.visibility.to == 1) {
        data.camera_pos.e = 0.01;
        mod_crystal.params.mode = 1;
        data.particle_size = 1;
        data.camera_pos.to = 50;
        data.camera_elevation.e = 0.1;
        data.camera_elevation.to = 0;
    }
}, "main", "idle");

var scene_core = ao.sceneBuild((t, dt) => {
    if (scene_core.visibility.to == 1) {
        data.camera_pos.e = 0.005;
        mod_crystal.params.mode = 0;
        data.camera_pos.to = 20;
        data.particle_size = 1;
        data.camera_elevation.e = 0.1;
        data.camera_elevation.to = 0;
    }
}, "main", "core");

var scene_elevate = ao.sceneBuild((t, dt) => {
    data.timeline_visibility.to = scene_elevate.visibility.to
    if (scene_elevate.visibility.to == 1) {
        data.camera_pos.e = 0.012;
        mod_crystal.params.mode = 0;
        data.camera_pos.to = 0;
        data.camera_elevation.e = 0.1;
        data.particle_size = 0.3;
        data.camera_elevation.to = 0;
    }
}, "main", "elevate");

(() => {
    var reel_ui = [];
    for(var i = 0; i < 10; i++) {
        reel_ui.push({
            comp: "catpin",
            x: 0,
            y: 0,
            viz: 1
        });
    }
    data.vue.elems = data.vue.elems.concat(reel_ui);
    var scene_reel = ao.sceneBuild((t, dt) => {
        data.reel_visibility.to = scene_reel.visibility.to;
        if (scene_reel.visibility.to == 1) {
            data.camera_pos.e = 0.1;
            mod_crystal.params.mode = 2;
            data.camera_pos.to = 30;
            data.camera_elevation.e = 0.1;
            data.particle_size = 1;
            data.camera_elevation.to = 0;
        }
    }, "main", "reel");
})();


ao.loop(() => {
    data.circuit_opacity_ease.to = data.circuit_opacity;
    data.input.rot_offset = (data.input.ex.value - 0.5) * 1;
    data.input.rot_offset_e.to = data.input.rot_offset;
    ao.sceneGrpSelectId("main", data.current_scene, true);
});



export default data;