import * as three from "three";
import * as baker from "./baker";
import env from "./env";
ao.threeInstanceMesh(THREE);
import * as ao from "../libao";
import {
    openSimplex
} from "../libao";

export var grp = new three.Group();
export var fixed = new three.Group();

var quad_geo = new three.PlaneGeometry(2, 2, 1, 1);

function single_logo(map) {
    var texture_mat = new three.MeshBasicMaterial({
        map: map,
        color: 0xffffff,
        transparent: true,
        alphaTest: 0.9
    });
    var grp = new three.Group();
    var main_mesh = new three.Mesh(quad_geo, texture_mat);
    grp.add(main_mesh);
    grp.viz = ao.eased(0, 0, 0.05, 0.00001);
    ao.loop(() => {
        grp.life -= grp.vl;
        grp.life = grp.life < 0 ? 0 : grp.life;
        if (Math.random() > 0.99 && grp.viz.value == 0 && grp.viz.to == 0) {
            grp.position.x = (Math.random() - 0.5) * 80;
            grp.position.y = (Math.random() - 0.5) * 50;
            grp.position.z = 30 - (Math.random()) * 130;
            grp.viz.to = 1;
        } else if (Math.random() > 0.99 && grp.viz.value == 1 && grp.viz.to == 1) {
            grp.viz.to = 0;
        }
        grp.viz.to *= env.circuit_opacity_ease.to;
        var s = (Math.random() < grp.viz.value ? grp.viz.value : 0) + 0.001;
        grp.scale.set(s, s, s)
    });

    grp.position.x = (Math.random() - 0.5) * 80;
    grp.position.y = (Math.random() - 0.5) * 50;
    grp.position.z = 30 - (Math.random()) * 50;
    return grp;
}

function logos() {
    var managed = [];
    var g = new three.Group();
    for (var i = 0; i < 100; i++) {
        var l = single_logo(ao.threeResources[env.logos[i % env.logos.length].logo]);
        managed.push(l);
        g.add(l);
    }
    grp.add(g);
}

function space() {
    var ptsMat = new three.PointsMaterial({
        sizeAttenuation: false,
        size: 2,
        transparent: true,
        color: 0x202020,
        depthTest: false,
        blending: three.AdditiveBlending,
        opacity: 1,
    });
    ao.loop(() => {
        ptsMat.opacity = 1 - env.reel_visibility.value * 0.5;
        ptsMat.needsUpdate = true;
    });
    var geo = new three.Geometry();
    var eul = new three.Euler();
    for (var i = 0; i < 50000; i++) {
        var v = new three.Vector3(1, 0, 0);
        eul.set(Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2);
        v.applyEuler(eul)
        v.multiplyScalar(Math.abs(openSimplex.noise3D(eul.x, eul.y, eul.z)) * 1000 + 10);
        geo.vertices.push(v);
    }
    var mesh = new three.Points(geo, ptsMat);
    grp.add(mesh);
}

function timeline() {
    var g = new three.Group();
    var R = 20;
    var H = 15;
    var r = Math.PI;
    var cyl = new three.CylinderGeometry(R, R, H, 300, 3, true, 0, r);
    var mb = new three.MeshBasicMaterial({
        side: three.DoubleSide,
        transparent: true,
        alphaTest: 0.3,
        color: 0xffffff,
        map: ao.threeResources["timeline"]
    });
    var mesh = new three.Mesh(cyl, mb);
    mesh.rotation.y = r / 2 + Math.PI;
    mesh.rotation.z = Math.PI;
    g.add(mesh);

    var disk = new three.RingGeometry(R - 0.2, R - 0.15, 300, 3);
    var diskMat = new three.MeshBasicMaterial({
        side: three.DoubleSide
    });

    var diskBot = new three.Mesh(disk, diskMat);
    diskBot.rotation.x = Math.PI / 2;
    diskBot.position.y = 6;
    g.add(diskBot);

    var diskTop = new three.Mesh(disk, diskMat);
    diskTop.rotation.x = -Math.PI / 2;
    diskTop.position.y = -6;
    g.add(diskTop);


    var base_geo = new three.OctahedronGeometry(20, 5);
    var obj = new three.Mesh(base_geo, new three.MeshBasicMaterial({
        wireframe: true,
        transparent: true,
        blending: three.AdditiveBlending,
        side: three.BackSide,
        depthTest: false,
        envMap: ao.threeResources["env"],
        color: 0x131313
    }));
    obj.rotation.x = Math.random() * Math.PI * 2;
    obj.rotation.y = Math.random() * Math.PI * 2;
    obj.rotation.z = Math.random() * Math.PI * 2;
    grp.add(obj); //benchmark


    ao.loop(() => {
        g.visible = obj.visible = (Math.random() < env.timeline_visibility.value ? true : false);
        var s = Math.random() < env.timeline_visibility.value ? env.timeline_visibility.value : 0;
        mb.color.setRGB(s, s, s);
        g.rotation.y = env.input.rot_offset_e.value * 2;
    });

    grp.add(g);

    return g;
}

function cursor() {
}

export function init() {

    logos();
    space();
    timeline();
    cursor();

    // base_geo = new three.Geometry();
    // //merge geometry
    // ao.threeResources["shell"].children.forEach(ms => {
    //     var g = (new three.Geometry()).fromBufferGeometry(ms.geometry);
    //     base_geo.merge(g);
    // });
    // console.log(base_geo.vertices.length)


    const PCOUNT = baker.baked.points.length;


    var sky_dome = new three.HemisphereLight(0xffffff, 0xffffff, 1);
    grp.add(sky_dome);

    var mat = new three.MeshPhysicalMaterial({
        color: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.5,
        roughness: 0.5,
        emissive: 0xffffff,
        emissiveIntensity: 1,
        wireframe: false,
        metalness: 0.9,
        envMap: ao.threeResources["ldr"],
        envMapIntensity: 1
    });

    var box = new three.BoxBufferGeometry(3, 0.5, 3); //ao.threeResources["testgeo"].children[0].geometry;

    var mesh = new THREE.InstancedMesh(
        box,
        mat,
        PCOUNT,
        true,
        true,
        //is the scale known to be uniform, will do less shader work, improperly applying this will result in wrong shading 
        false
    );
    grp.add(mesh);


    var spawn_mod = [
        ao.extra.particleModifier(
            (key, p, dt, arr, i, params, t) => {
                p.core = p.point = baker.baked.points[i];
                p.v[0] = Math.random();
                p.v[1] = Math.random();
                p.v[2] = Math.random();
                p.s = 1;
                p.r_t = [0, 0, 0];
                p.target_e = 0.01 + Math.random() * 0.02;
                p.life = 1;
                p.offset = Math.random();
                p.vlife = 0;
                p.p = [0, 0, 0];
            }, 'i'
        )
    ];


    var run_mod = [
        env.particle_control.mod_crystal
    ];

    //particle things
    var particles = ao.extra.particleFixedAllocate([], {
        // compute_size: true,
        // compute_rotation: true,
        compute_heading: true
    }, PCOUNT);
    //spawn all
    for (var i = 0; i < particles.length; i++) {
        var p = ao.extra.particleSpawn(particles, spawn_mod, true);
    }

    var pos = new three.Vector3(0, 0, 0);
    var sc = new three.Vector3(0.05, 0.05, 0.05);
    var col = new three.Color(0x66aaff);
    var euler = new three.Euler();

    var quat = new three.Quaternion();
    // ao.loop((t, dt) => {
    //     ao.extra.particlesUpdate(particles, run_mod, dt, t, 1.0);
    //     for (var i = 0; i < particles.length; i++) {
    //         pos.set(particles[i].p[0], particles[i].p[1], particles[i].p[2]);
    //         euler.set(particles[i].r[0], particles[i].r[1], particles[i].r[2]);
    //         quat.setFromEuler(euler);
    //         mesh.setQuaternionAt(i, quat);
    //         mesh.setPositionAt(i, pos);
    //         mesh.setColorAt(i, col);
    //         mesh.setScaleAt(i, sc);
    //     }

    //     mesh.needsUpdate('visible');
    //     mesh.needsUpdate('position');
    //     mesh.needsUpdate('scale');
    //     mesh.needsUpdate('quaternion');
    //     mesh.needsUpdate('color');
    // });

    env.particles = particles;
    ao.loop((t, dt) => {
        env.ring_cursor.active_elem = env.ring_cursor.calc_elem;
        env.ring_cursor.active_cid = env.ring_cursor.active_elem ? env.ring_cursor.active_elem.core.content.cid : null;
        env.ring_cursor.calc_elem = null;
        env.ring_cursor.min_dist = 100000;
        // console.log(env.ring_cursor);
        ao.extra.particlesUpdate(particles, run_mod, dt, t, 1.0);
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            pos.set(p.p[0], p.p[1], p.p[2]);
            euler.set(p.r[0], p.r[1], p.r[2]);
            sc.set(p.s * 0.05, p.s * 0.05, p.s * 0.05);
            col.setRGB(p.emissive[0] / 255, p.emissive[1] / 255, p.emissive[2] / 255);
            quat.setFromEuler(euler);
            mesh.setQuaternionAt(i, quat);
            mesh.setPositionAt(i, pos);
            mesh.setColorAt(i, col, 0);
            mesh.setColorAt(i, col, 1);
            mesh.setScaleAt(i, sc);
        }
        mat.needsUpdate = true;
        mesh.needsUpdate('quaternion');
        mesh.needsUpdate('colors');
        mesh.needsUpdate('scale');
        mesh.needsUpdate('position');
    });
}