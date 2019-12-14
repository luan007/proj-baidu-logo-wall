import * as three from "three";
import * as ao from "../libao";
import env from "./env";

export var grp = new three.Group();

var ids = {};
var counts = {};
env.data.forEach((v) => {
    ids[v.cid_name] = ids[v.cid_name] || [];
    ids[v.cid_name].push(v);
});

var multiplier = 5;
var sum = 0;
var cat_count = 0;
for (var i in ids) {
    counts[i] = ids[i].length * multiplier;
    sum += counts[i];
    cat_count++;
}

console.log(cat_count, counts, sum)

var geo = new three.Geometry();
var x = 0;
var _max_h = 50;
var x_margin = 5;
var x_tiny_margin = 2;
for (var cat in counts) {
    var y = 0;
    for (var i = 0; i < counts[cat]; i++) {
        var vec3 = new three.Vector3(
            x, -Math.min(counts[cat], _max_h) / 2 + y, 0
        );
        geo.vertices.push(vec3);
        y++;
        if (y > _max_h) {
            y = 0;
            x += x_tiny_margin;
        }
    }
    x += x_margin;
}
x -= x_margin; //?

var r = 900;
for (var i = 0; i < geo.vertices.length; i++) {
    var vec = geo.vertices[i];
    var _theta = (vec.x - x / 2) / x + Math.PI / 2;
    vec.theta = _theta;
    vec.y *= 10;
}

var ptmat = new three.PointsMaterial({
    color: 0xf0f000,
    size: 6
});

var ptmesh = new three.Points(geo, ptmat);
ptmesh.position.z = 0;
// ptmesh.position.x = -x / 2;
// grp.add(ptmesh);



var mat = new three.MeshBasicMaterial({
    color: 0xffffff
});


var bufgeo = new three.BoxBufferGeometry(1.5, 0.2, 1.5, 1, 1, 1);
var imesh = new three.InstancedMesh(bufgeo, mat, geo.vertices.length);

var transforms = [];

var offset3d = new three.Object3D();
var obj3d = new three.Object3D();
offset3d.add(obj3d);
for (var i = 0; i < geo.vertices.length; i++) {
    var vec = geo.vertices[i];
    obj3d.position.set(vec.x, vec.y, vec.z);
    obj3d.rotation.set(Math.random(), Math.random(), Math.random());
    obj3d.scale.set(5, 5, 5);
    obj3d.updateMatrixWorld();
    //billboard

    transforms.push({
        position: [vec.x, vec.y, vec.z],
        rotation: [0, 0, 0],
        scale: [3, 3, 3],
        r_rand: r - Math.random() * 400,
        r: r,
        theta: vec.theta,
        e_trans: Math.random() * 0.1 + 0.1,
        target_position: [vec.x, vec.y, vec.z],
        target_rotation: [0, 0, 0]
    });
    imesh.setMatrixAt(i, obj3d.matrixWorld);
}


ao.loop(() => {
    for (var i = 0; i < transforms.length; i++) {
        var transform = transforms[i];

        if (Math.random() < 0.001) {
            // transform.r = Math.random() > 0.5 ? transform.r_rand : r;
            transform.target_rotation[0] += Math.PI / 2;
            transform.target_rotation[1] += Math.PI / 2;
        } 

        var _r = transform.r;
        var _x = Math.cos((transform.theta + env.input.rot_offset_e * 1.5) * Math.PI * 2 * 0.5) * _r;
        var _z = Math.sin((transform.theta + env.input.rot_offset_e * 1.5) * Math.PI * 2 * 0.5) * _r;

        transform.target_position[0] = _x;
        transform.target_position[2] = _z;
        for (var j = 0; j < 3; j++) {
            transform.rotation[j] = ao.ease(transform.rotation[j], transform.target_rotation[j], 0.1, 0.0001);
            transform.position[j] = ao.ease(transform.position[j], transform.target_position[j], transform.e_trans, 0.0001);
        }

        obj3d.position.set(transform.position[0], transform.position[1], transform.position[2]);
        // obj3d.position.set(0, 0, 0);
        obj3d.rotation.set(transform.rotation[0], transform.rotation[1], transform.rotation[2]);
        obj3d.scale.set(transform.scale[0], transform.scale[1], transform.scale[2]);
        obj3d.updateMatrix();
        imesh.setMatrixAt(i, obj3d.matrix);
    }
    imesh.instanceMatrix.needsUpdate = true;
});

grp.add(imesh);
