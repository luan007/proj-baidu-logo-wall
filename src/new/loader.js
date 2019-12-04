// instantiate a loader
import "../../node_modules/three/examples/js/loaders/OBJLoader.js";
import "../../node_modules/three/examples/js/loaders/RGBELoader.js";
var EquirectangularToCubemap = require('three.equirectangular-to-cubemap');

export var resources = [];
window.resources = resources;

function loadObj(file, key) {
    var loader = new THREE.OBJLoader();
    loader.load(
        // resource URL
        file,
        // called when resource is loaded
        function (object) {
            resources[key] = object;
        }
    );
}

function loadCubeMap(file, key, renderer) {
    var env_loader = new THREE.TextureLoader();
    env_loader.load(file, (res) => {
        var equiToCube = new EquirectangularToCubemap(renderer);
        var env = equiToCube.convert(res, 1024);
        resources[key] = env;
    });
}

function loadTexture(file, key) {
    resources[key] = new THREE.TextureLoader().load(file);
}

var manager = THREE.DefaultLoadingManager;
export function load(renderer, cb) {
    manager.onLoad = cb;
    manager.onProgress = function (url, itemsLoaded, itemsTotal) {
        console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    }
    //DO LOAD
    loadCubeMap("/assets/Warehouse-with-lights.jpg", "env", renderer);
    loadObj("/assets/shape_verts_plate.obj", "plate");
    loadObj("/assets/shape_shell.obj", "shell");
    loadTexture("/assets/logo/方正宽带.png", "logo1")
    loadTexture("/assets/时间轴的副本.png", "time1")
    loadTexture("/assets/时间轴的副本2.png", "time")
    loadTexture("/assets/star.png", "star")
    loadTexture("/assets/test5.png", "test")
}