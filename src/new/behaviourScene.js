import * as updatable from "./lib/updatable";
var scenes = [];

export class Scene {
    constructor() {
        this.visibility = 0;
        this.visibility_t = 0;
        this.visibility_e = 0.05;
        scenes.push(this);
    }
    update() {
        this.visibility = updatable.ease(this.visibility, this.visibility_t, this.visibility_e);
    }
}

updatable.enable(() => {
    for (var i = 0; i < scenes.length; i++) {
        scenes[i].update(scenes[i]);
    }
});

var _selected_particle_scene;
export class ParticleScene extends Scene {
    constructor() {
        super();
    }
    update() {
        super.update();
        if (this.visibility_t == 1) {
            _selected_particle_scene = this;
        } else if (_selected_particle_scene == this) {
            _selected_particle_scene = null;
        }
    }
    particleInit(pt) {}
    particleUpdate(pt, _t) {}
}

export function InitParticleScenes(ps) {
    for (var i = 0; i < scenes.length; i++) {
        scenes[i].particleInit(ps);
    }
}
export function UpdateParticleScenes(p, dt, _t) {
    if (_selected_particle_scene) {
        _selected_particle_scene.particleUpdate(p, dt, _t);
    }
}