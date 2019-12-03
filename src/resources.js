// instantiate a loader
import "../node_modules/three/examples/js/loaders/OBJLoader.js";
import "../node_modules/three/examples/js/loaders/RGBELoader.js";
var loader = new THREE.OBJLoader();

export function load(cb) {
    // load a resource
    loader.load(
        // resource URL
        'assets/shape_shell.obj',
        // called when resource is loaded
        function (object) {
            cb(object);
        }
    );
}

export function loadarb(file, cb) {
    // load a resource
    loader.load(
        // resource URL
        file,
        // called when resource is loaded
        function (object) {
            cb(object);
        }
    );
}