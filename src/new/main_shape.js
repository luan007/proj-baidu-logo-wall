import * as particles from "./particle";
import * as updatable from "./lib/updatable";
import * as three from "three";
import "./lib/SimplexNoise";
import _instance from 'three-instanced-mesh';
import * as shaders from "./shader/*.glsl";
import {
    InitParticleScenes
} from "./behaviourScene";
import {
    NumberBillboard,
    BarBillboard,
    MeshBillboard
} from "./billboards.js";
var InstancedMesh = _instance(window.THREE);
var noise = new SimplexNoise();
window.noise = noise;
import * as ao from "./lib/particle-util";

class particle {
    constructor(){
        this.p = [0, 0, 0];
        this.v = [0, 0, 0];
        this.a = [0, 0, 0];
        this.t = [0, 0, 0];
        this.i = [0, 0, 0];
    }
}

var ps = [];

export function build() {
    var len = 24, len3 = 3;
    var mainGrp = new THREE.Group();
    mainGrp.opaViz = 0;
    mainGrp.opaViz_t = 1;
    
    // star sky
    var starNum = 300;
    var starGeo = new THREE.Geometry();
    for (var i = -starNum; i < starNum; i ++) {
        starGeo.colors.push( new THREE.Color( 1, 1, 1 ) )
        starGeo.vertices.push(
            new THREE.Vector3(
                Math.random() * 500 - 250, 
                Math.random() * 500 - 250, 
                Math.random() * 500 - 250 //-50
            )
        )
    }
    var starMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1, 
        transparent: true,
        sizeAttributes: false,
        vertexColors: THREE.VertexColors
    });
    var star = new THREE.Points(starGeo, starMat);  
    mainGrp.add(star);

    // 时间轴
    var group = new THREE.Group();
    var geometry = new THREE.CylinderGeometry( 50, 50, 35, 32, 10, true, 0, 3.7 ); //new THREE.TorusGeometry( 60, 10, 16, 160 );
    var material = new THREE.MeshBasicMaterial( { 
        color: 0xffffff,
        transparent: true,
        opacity: 1,
        // wireframe: true,  // 将材质渲染成线框(背景线框)
        side: THREE.BackSide,
        map:  resources.time1
    } );
    var torus = new THREE.Mesh( geometry, material );
    torus.rotation.x = 3.13//5//1.4//Math.PI * 2 / 2;
    torus.rotation.y = 3//1.2//5//1.4//Math.PI * 2 / 2;
    group.add(torus);

    mainGrp.add(group);


    // logo;
    var radius = 300;
    var COUNT = 20000//1000000;
    var pointBG = new THREE.BufferGeometry();
    var pos_arr = new Float32Array(COUNT * 3);
    var targer_arr = new Float32Array(COUNT * 3);
    var acceleration_arr = new Float32Array(COUNT * 3);
    var velocity_arr = new Float32Array(COUNT * 3);
    var ball_arr = new Float32Array(COUNT * 3);
    var attrbuffer = new THREE.BufferAttribute(pos_arr, 3);
    var init_arr = new Float32Array(COUNT * 3);
    var pointMat = new THREE.PointsMaterial({
        color: 0xffffff,//0x0090fc,
        size: 30, 
        transparent: true,
        depthTest: false,
        depthWrite: false,
        //side: THREE.BackSide,
        map: resources.test,
        blending: THREE.AdditiveBlending
    });

    var mult = 1.7; // 1.7
    for (var i = 0; i < COUNT; i++) {
        var rotX = Math.random() * Math.PI * 2;
        var rotY = Math.random() * Math.PI * 2;
        var rotZ = Math.random() * Math.PI * 2;
        var euler = new THREE.Euler(rotX, rotY, rotZ);
        var vec = new THREE.Vector3(1, 0, 0);
        vec = vec.applyEuler(euler); 

        init_arr[i * 3 + 0] = (Math.random() * 2 - 1) * radius;
        init_arr[i * 3 + 1] = (Math.random() * 2 - 1) * radius;
        init_arr[i * 3 + 2] = (Math.random() * 2 - 1) * radius;

        pos_arr[i * 3 + 0] = (Math.random() * 2 - 1) * radius;
        pos_arr[i * 3 + 1] = (Math.random() * 2 - 1) * radius;
        pos_arr[i * 3 + 2] = (Math.random() * 2 - 1) * radius;

        var a = [0, 0, 0];
        ao.particleUtilEulerField(a, 0.2, pos_arr[i * 3 + 0], pos_arr[i * 3 + 1], pos_arr[i * 3 + 2]);

        acceleration_arr[i * 3 + 0] = a[0];
        acceleration_arr[i * 3 + 1] = a[1];
        acceleration_arr[i * 3 + 2] = a[2];

        velocity_arr[i * 3 + 0] = Math.random() * 0.01 - 0.005
        velocity_arr[i * 3 + 1] = Math.random() * 0.06 - 0.03
        velocity_arr[i * 3 + 2] = Math.random() * 0.01 - 0.005

        targer_arr[i * 3 + 0] = vec.x * radius; 
        targer_arr[i * 3 + 1] = vec.y * radius;
        targer_arr[i * 3 + 2] = vec.z * radius;

        // ball
        // mult = 1.3;
        ball_arr[i * 3 + 0] = vec.x * radius * mult ; 
        ball_arr[i * 3 + 1] = vec.y * radius * mult ;
        ball_arr[i * 3 + 2] = vec.z * radius * mult ;
    }
    pointBG.addAttribute("position", attrbuffer);
    var block_arr = new Float32Array(COUNT * 2);
    var block_buffer = new THREE.BufferAttribute(block_arr, 2);
    for (var i = 0; i < COUNT; i++) {
        if(Math.random() > 0.1){
            block_arr[i * 2] = Math.floor(Math.random() * len) / len;
            block_arr[i * 2 + 1] = Math.floor(Math.random() * len + (len - len3) ) / len;
            // console.log(block_arr[i * 2], block_arr[i * 2 + 1]);
        } else {
            block_arr[i * 2] = Math.floor(Math.random() * len) / len;
            block_arr[i * 2 + 1] = Math.floor(Math.random() * (len - len3) ) / len;
        }
    }
    pointBG.addAttribute("block", block_buffer);

    pointMat.onBeforeCompile = function (shader, renderer) {
        // console.log(shader);
        shader.vertexShader = shaders['point_vert'];
        shader.fragmentShader = shaders['point_flag'];
    }
    var point = new THREE.Points(pointBG, pointMat);//mat);
    point.rotation.x = 3

    var tilt_feel = new THREE.Group();
    tilt_feel.add(point); // point
    mainGrp.add(tilt_feel);

    var tem = new THREE.Vector3();
    updatable.enable((t) => {

        // 时间轴
        // group.rotation.x = -control.y / 10//  * Math.PI * 10 ;
        group.rotation.y = -control.x * Math.PI * 8//-control.x * Math.PI * 4;

        material.opacity = updatable.ease(material.opacity, control.mode == 3 ? 1 : 0, 0.1, 0.0001);
        material.alphaTest = updatable.ease(material.alphaTest, control.mode == 3 ? 0 : 0.5, 0.1, 0.0001);
        material.needsUpdate = true;

        star.rotation.x = -control.y / 1.5 ;
        star.rotation.y = -control.x ;

        tilt_feel.rotation.x = -control.y / 1.5 ;
        tilt_feel.rotation.y = -control.x ;

        pointMat.size = updatable.ease(pointMat.size, 10, 0.1, 0.0001);
        pointMat.needsUpdate = true;

        var position = pointBG.getAttribute("position");
        var pos = position.array;
        var key = control.billboard;
        if( control.mode == -1){
            for(let i = 0; i < pos.length; i++){
                pos[i] += (init_arr[i] - pos[i]) * 0.05;
            }
            pointMat.size = updatable.ease(pointMat.size, 50, 0.1, 0.0001);
        }
        if(control.mode == 1 && control.billboard == ""){
            for(let i = 0; i < pos.length; i++){
                pos[i] += (init_arr[i] - pos[i]) * 0.05;
            }
            pointMat.size = updatable.ease(pointMat.size, 20, 0.1, 0.0001);
        } else {
            for(let i = 0; i < pos.length; i++){
                pos[i] += (targer_arr[i] - pos[i]) * 0.05;
            }
            pointMat.size = updatable.ease(pointMat.size, 20, 0.1, 0.0001);
        }
        if(control.mode == 1 && billboards[key] == "ball"){
            for(let i = 0; i < pos.length  ; i++){
                // acceleration_arr[i * 3 + 0] = 0.02 * (noise.noise( pos[i * 3 + 0] * 0.01, pos[(i + 1) * 3 + 0] * 0.01)) * Math.abs((ball_arr[i * 3 + 0] - pos[i * 3 + 0] ))
                // acceleration_arr[i * 3 + 1] = 0.02 * (noise.noise( pos[i * 3 + 1] * 0.01, pos[(i + 1) * 3 + 1] * 0.01)) * Math.abs((ball_arr[i * 3 + 1] - pos[i * 3 + 1] ))
                // acceleration_arr[i * 3 + 2] = 0.02 * (noise.noise( pos[i * 3 + 2] * 0.01, pos[(i + 1) * 3 + 2] * 0.01)) * Math.abs((ball_arr[i * 3 + 2] - pos[i * 3 + 2] ))

                // velocity_arr[i * 3 + 0] += acceleration_arr[i * 3 + 0];
                // velocity_arr[i * 3 + 1] += acceleration_arr[i * 3 + 1];
                // velocity_arr[i * 3 + 2] += acceleration_arr[i * 3 + 2];
                // tem = ao.particleThreeArrToVec3( velocity_arr[i * 3 + 0],  velocity_arr[i * 3 + 1],  velocity_arr[i * 3 + 2]);
                // tem.clampLength(-2, 2);
                // pos[i * 3 + 0] += tem.x;
                // pos[i * 3 + 1] += tem.y;
                // pos[i * 3 + 2] += tem.z;

                pos[i] += (ball_arr[i] - pos[i]) * 0.1; // 0.5
            }
            pointMat.size = updatable.ease(pointMat.size, 70, 0.1, 0.0001);
            tilt_feel.rotation.x = -control.y  ;
            tilt_feel.rotation.y = -control.x * Math.PI * 4 ;
        }
        if(control.mode == 1 && billboards[key] == "number"){
            for(let i = 0; i < pos.length / 3; i++){
                var obj = billboards_pos[key][i % billboards_pos[key].length];
                acceleration_arr[i * 3 + 0] = (obj[0] - pos[i * 3 + 0]) * 0.001;
                acceleration_arr[i * 3 + 1] = (obj[1] - pos[i * 3 + 1]) * 0.001;
                acceleration_arr[i * 3 + 2] = (obj[2] - pos[i * 3 + 2]) * 0.001;

                velocity_arr[i * 3 + 0] += acceleration_arr[i * 3 + 0];
                velocity_arr[i * 3 + 1] += acceleration_arr[i * 3 + 1];
                velocity_arr[i * 3 + 2] += acceleration_arr[i * 3 + 2];

                pos[i * 3 + 0] += velocity_arr[i * 3 + 0];
                pos[i * 3 + 1] += velocity_arr[i * 3 + 1];
                pos[i * 3 + 2] += velocity_arr[i * 3 + 2];
            }
            pointMat.size = updatable.ease(pointMat.size, 20, 0.1, 0.0001);
        }
        position.needsUpdate = true;
    });

    //core shape 
    var mat = new THREE.MeshPhysicalMaterial({ // 粒子
        color: 0xffffff,
        clearCoat: 1, // 透明图层的透明度:0.0~1.0 [默认为0]
        clearCoatRoughness: 0, // 透明图层的粗糙度:0~1 [默认为0] 
        roughness: 0, // 粗糙度 0 平滑，1 漫反射，默认 0.5
        wireframe: window.DEBUG_VISUAL ? true : false,
        metalness: 0.1,
        envMap: window.WHITE_WF ? undefined : resources.env,
        envMapIntensity: 0.7
    });

    var instancedMesh = new THREE.InstancedMesh(
        resources.plate.children[0].geometry, // new THREE.CubeGeometry(1, 1, 1),
        mat,
        points.length,
        true,
        window.WHITE_WF ? false : true,
        //is the scale known to be uniform, will do less shader work, improperly applying this will result in wrong shading 
        false
    );

    var groups = new three.Group();
    groups.add(instancedMesh);

    instancedMesh.visible = true;
    instancedMesh.castShadow = false;  // 投射阴影
    instancedMesh.receiveShadow = false; // 接受阴影

    var particleSystem = [];
    for (var i = 0; i < points.length; i++) {
        var p = new particles.p_fly(points[i], instancedMesh);
        particleSystem.push(p);
    }

    InitParticleScenes(particleSystem);

    var pointS = points.filter( p => p.content != null);
    var data = pointS;
    var num = 5;
    function pinUpdate(){
        data = data.sort((a, b)=>{
            return b.content.world_position[2] - a.content.world_position[2] ;
        })
        for(let i = 0; i < num; i++){
            pins[i].visibility = 0;
        }        
        for(let i = 0; i < num; i++){
            var world2screen = project_arr( data[i].content.world_position )
            pins[i].x = (world2screen.x * window.data.width) / 2 + window.data.width / 2;
            pins[i].y = -(world2screen.y * window.data.height) / 2 + window.data.height / 2; 
            pins[i].data = data[i].content;
            pins[i].visibility = Math.sin( (data[0].content.world_position[2] - data[i].content.world_position[2]) ) * 4 // 1 - (data[i].content.world_position[2]  / 200) - (data[0].content.world_position[2] * 0.02 ) ;
        }
        for(let i = 0; i < data.length; i++){
            data[i].content.show = i < num ? true : false;
        }
    }

    var ex = 0;
    var ey = 0;
    var rotE = 0.05;

    var _t = 0;

    function spin(a, b) {
        if (a - b > 2) {
            a -= 2;
        } else if (b - a > 2) {
            a += 2;
        }
        return a;
    }
    
    var mesh_scale = updatable.ease(1, 1, 0.1, 0.0001);
    updatable.enable(() => {
        if(control.billboard == "" || typeof billboards[control.billboard] == "string"){
            mesh_scale = updatable.ease(mesh_scale, 0, 0.1, 0.0001);
        } else {
            mesh_scale = updatable.ease(mesh_scale, 1, 0.1, 0.0001);
        }
        instancedMesh.scale.set(mesh_scale, mesh_scale, mesh_scale)
        pinUpdate();
        
        _t += 0.01;
        if (control.useLocalXY > 0) {
            ex = spin(ex, control.localX);
            ey = spin(ey, control.localY);
            ex = updatable.ease(ex, control.localX, rotE, 0.00001);
            ey = updatable.ease(ey, control.localY, rotE, 0.00001);
        } else {
            ex = spin(ex, control.x);
            ey = spin(ey, control.y);
            ex = updatable.ease(ex, control.x, rotE, 0.00001);
            ey = updatable.ease(ey, control.y, rotE, 0.00001);
        }

        for (var i = 0; i < particleSystem.length; i++) {
            particleSystem[i].update(1 / 30, _t);
        }
        instancedMesh.needsUpdate('visible');
        instancedMesh.needsUpdate('position');
        instancedMesh.needsUpdate('scale');
        instancedMesh.needsUpdate('quaternion');
        (!window.WHITE_WF) && instancedMesh.needsUpdate('color');
        instancedMesh.rotation.x = ey * Math.PI * 2;
        instancedMesh.rotation.y = ex * Math.PI * 2; 
    })

    mainGrp.add(instancedMesh);
    window.mainGrp = mainGrp;
    return mainGrp;
}