import {
    ParticleScene
} from "./behaviourScene";

export class SelectorScene extends ParticleScene {

    constructor() {
        super();
        window.visibility_t = this.visibility_t;
    }

    update() {
        if(control.mode == 3){
            this.visibility_t = 0;
            this.visibility = 0;
        } else if (control.mode == 2 || control.mode == 0) {
            // console.log(control.mode);
            this.visibility_t = 1;
        } else if (control.mode == 1 && control.billboard == '') {
            // console.log(control.mode);
            this.visibility_t = 1;
        } else {
            // console.log(control.mode);
            this.visibility_t = 0;
        }
        super.update();
    }

    particleUpdate(pt, dt, _t) {
        pt.targetArr(pt.opos, (this.visibility) * 0.3, _t, (1 - this.visibility) * 33);
        pt.damp = 0.01 + (this.visibility) * 0.02;
        pt.limitV(30);
        pt.driftScale(0.05, _t * 10, 0.1);
        pt.faceVelocity(_t);
        var c = 1;
        if (control.mode == 3) {
            pt.c_t.setRGB(0, 0, 0);
            pt.s_t = 0;
        }
        else if (control.mode == 2) {
            // if (!pt.point.content) {
            //     pt.c_t.setRGB(0.1, 0.1, 0.1);
            // } 
            // else {
                pt.c_t.setRGB(0.3, 0.3, 0.3); // pt.c_t.setRGB(1, 1, 1);
            // }
            if (pins[0].data == pt.point.content) {
                pt.c_t.setRGB(1, 0.5, 0.5);
                pt.s_t = 0.3;
                // window.pin = window.closestPatent;
            } 
        } else {
            pt.c_t.setRGB(1, 1, 1);
        }
        // pt.drift(_t, 0.0001);
    }
}

window.num = 0;
export class ChaosScene extends ParticleScene {
    constructor() {
        super();
        this.center = [0, 0, 0];
        this._t = 0;
    }
    update() {
        this._t += 0.001;
        if (control.mode == -1) {
            this.visibility_t = 1;
            mainGrp.opaViz_t = 0;
            control.zoom_t = 75;
            mainGrp.rotation.x += Math.sin(this._t) * 0.0002;
            mainGrp.rotation.x = mainGrp.rotation.x % (Math.PI * 2);
            mainGrp.rotation.y += 0.0002;
            mainGrp.rotation.y = mainGrp.rotation.y % (Math.PI * 2);
        } else {
            mainGrp.rotation.x *= 0.9;
            mainGrp.rotation.y *= 0.9;
            this.visibility_t = 0;
            mainGrp.opaViz_t = 1;
        }
        control.idleVisibility = this.visibility;
        super.update();
    }

    particleUpdate(pt, dt, _t) {
        pt.targetArr(pt.opos, (this.visibility) * 0.3, _t, (1 - this.visibility) * 33);
        pt.damp = 0.01 + (this.visibility) * 0.02;
        pt.limitV(30);
        pt.faceVelocity(_t);
        // pt.damp = 0.0;
        pt.c_t.setRGB(0, 0, 0)
        pt.driftScale(0.2, _t, 0.01);
        // pt.driftScale(0.05, _t * 10, 0.3);
    }
}