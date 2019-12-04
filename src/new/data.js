//control
import * as updatable from "./lib/updatable.js";
import "../../node_modules/leapjs/leap-0.6.4";
import {
    NumberBillboard,
    BarBillboard,
    MeshBillboard
} from "./billboards.js";
import {
    SelectorScene,
    ChaosScene
} from "./selector.js";

var test = require("../../excel/test.json");
var patents = [];
test.forEach(t => {
    if(Math.random() < 0.05){
        patents.push(t);
    }
});
// var patents = require("../../excel/test.json");
window.patents = patents;
window.DEBUG = false;

// console.log(patents);
window.pins = [];
// pins[0] = {};
for(let i = 0; i < 5; i++){
    pins[i] = {};
}

// var hashMap = new Map();
// test.forEach(t => {
//     hashMap.set(t.vendorName, t.vendorName);
// });
// var arr_name = [];
// for(let [key, value] of hashMap.entries()) {
//     if(value) {
//         arr_name.push(key);
//     }
// }
// console.log(arr_name);



// window.NO_TILT = true;
// window.THREE_BG = 0;
// window.ZOOM_IN = 20;
// window.DISABLE_BLOOM  = true;
// window.DEBUG_VISUAL = false;
// window.WHITE_WF = false;
// window.HDBOOST = false;

var obj = {
    "110": {
        "name": "镜像环境",
        "num": 0
    },
    "101": {
        "name": "建站推广",
        "num": 0
    },
    "102": {
        "name": "上云服务",
        "num": 0
    },
    "120": {
        "name": "安全服务",
        "num": 0
    },
    "115": {
        "name": "企业应用",
        "num": 0
    },
    "130": {
        "name": "API服务",
        "num": 0
    },
    "150": {
        "name": "公司服务",
        "num": 0
    },
    "135": {
        "name": "人工智能",
        "num": 0
    },
    "125": {
        "name": "数据应用",
        "num": 0
    },
    "140": {
        "name": "区块链",
        "num": 0
    },
    "145": {
        "name": "泛机器人",
        "num": 0
    }
}
// var obj_data = {}
// patents.forEach( p => {
//     for(let key in obj){
//         if(p.key == key){
//             obj[key].num++;
//             break;
//         }
//     }
// })
// for(let key in obj){
//     obj_data[obj[key].name] = obj[key].num;
// }
var obj_data = {
	"建站推广": 809,
	"上云服务": 262,
	"镜像环境": 171,
	"企业应用": 173,
	"安全服务": 118,
	"数据应用": 9,
	"API服务": 140,
	"人工智能": 651,
	"区块链": 2,
	"泛机器人": 27,
	"公司服务": 71
}

obj_data = sortObj(obj_data);

function sortObj(obj) {
    var arr = [];
    for (var i in obj) {
        arr.push([obj[i],i]);
    };
    arr.sort(function (a,b) {
        return a[0] - b[0];
    });
    var len = arr.length,
        obj = {};
    for (var i = len - 1; i >= 0; i--) {
        obj[arr[i][1]] = arr[i][0];
    }
    return obj;
}

//data
var z = 500;
var scale = 0.6;
var data = {
    hdBoost: window.HDBOOST ? 2 : 1,
    width: 2560, 
    height: 1080,
    z: z,
    scale: scale,
    tags: {
        //first one is "others" 
        "品类数量": {
            skipFace: 1,
            data: {
                // 建站推广、人工智能、安全服务、泛机器人、上云服务、公司服务、镜像服务、企业应用、API服务、数据应用、区块链
                "": 0, //use all
                // "区块链": 200,
                // "人工智能": 700,
                // "API服务": 400,
                // "安全服务": 201,
                // "泛机器人": 105,
                // "上云服务": 87,
                // "公司服务": 62,
                // "镜像环境": 42,
                // "企业应用": 36,
                // "数据应用": 29,
                // "建站推广": 19,
            }
        },
    },
    billboards: {
        "服务商数量": {
            selected: null,
            show: "number",
            pins: {},
            // kind: "number",
            zoom_t: 0,
            number: "2000+", // 10860
            en: "partner",
            desc: `2017年5月，百度云云市场1.0上线，正式对外发布\n2018年11月，百度云云市场2.0版本上线\n覆盖品类11大类（镜像环境、建站推广、上云服务、安全服务、企业应用、软件工具、机器人、人工智能、数据应用、区块链、公司服务）商品品类80+子类`
        },
        // "服务商AI NO.1": {
        //     selected: null,
        //     show: "number",
        //     // kind: "number",
        //     number: "AI NO.1", // 10860
        //     zoom_t: 0,
        //     pins: {},
        //     en: "ecosphere",
        //     // vert: 50,
        //     desc: ""
        // },
        "合作伙伴": {
            selected: null,
            show: "ball",
            // kind: "",
            zoom_t: 0,
            pins: {},
            en: "technical field",
            // vert: 50,
            desc: ""
        },
        "商品数量": {
            selected: null,
            show: "number",
            kind: "number",
            zoom_t: z - 100,
            number: "3000+", // 10860
            pins: {},
            en: "application area",
            desc: "商品数量3000+款、商品SKU8000+、覆盖品类80+"
        },
        "品类数量": {
            selected: null,
            show: false,
            kind: "bar",
            zoom_t: z - 100,
            pins: {},
            vert: 50,
            en: " quantity of goods",
            desc: ""
        },
        "服务产品": {
            selected: null,
            show: false,
            // kind: "number",
            zoom_t: z - 50,
            pins: {},
            // number: "3000+",//1064,
            en: "quantity of goods",
            desc: `2018年11月，百度云云市场2.0版本上线，覆盖品类11大类，80+子类。\n增加泛机器人、人工智能、数据应用、区块链、公司服务`
            // desc: `集团PCT专利累计申请2895项，其中2018年申请PCT专利2547项，位居全国企业第二，仅次于华为\n境外专利累计申请1064项，覆盖12个国家和地区，兼顾ABCDS五大技术领域`
        },
        "时间轴": {
            selected: null,
            show: false,
            // kind: "number",
            zoom_t: z - 20,
            pins: {},
            // number: "3000+",//1064,
            en: "quantity of goods",
            desc: `2018年11月，百度云云市场2.0版本上线，覆盖品类11大类，80+子类。\n增加泛机器人、人工智能、数据应用、区块链、公司服务`
            // desc: `集团PCT专利累计申请2895项，其中2018年申请PCT专利2547项，位居全国企业第二，仅次于华为\n境外专利累计申请1064项，覆盖12个国家和地区，兼顾ABCDS五大技术领域`
        }
    }
};

// console.log(obj_data);
for(var key in data.tags) {
    if(key == "品类数量"){
        // for( var i in data.tags[key].data ){
        //     if(data.tags[key].data[i] != ""){
        //         data.tags[key].data[i] = obj_data[i];
        //     }
        // }
        // data.tags[key].data[""] = 0;
        data.tags[key].data = obj_data
    }
}

for (var i in data.billboards) {
    if (!data.tags[i]) {
        continue;
    }
    for (var q in data.tags[i].data) {
        data.billboards[i].pins[q] = {
            x: 0,
            y: 0
        }
    }
}


function buildArchitype() {
    console.log("Calculating..");
    var obj = resources.shell;
    var points = [];
    for (var i = 0; i < obj.children.length; i++) {
        for (var j = 0; j < obj.children[i].geometry.attributes["position"].array.length; j += 3) {
            var prep = {
                position: new THREE.Vector3(obj.children[i].geometry.attributes["position"].array[j],
                    obj.children[i].geometry.attributes["position"].array[j + 1],
                    obj.children[i].geometry.attributes["position"].array[j + 2]),
                normal: new THREE.Vector3(obj.children[i].geometry.attributes["normal"].array[j],
                    obj.children[i].geometry.attributes["normal"].array[j + 1],
                    obj.children[i].geometry.attributes["normal"].array[j + 2]),
                face: i,
                id: points.length,
                tags: {},
                content: undefined
            };
            var found = false;
            for (var q = 0; q < points.length; q++) {
                if (points[q].position.manhattanDistanceTo(
                        prep.position
                    ) < 0.1) {
                    found = true;
                    break;
                }
            }
            if (found) {
                continue;
            }
            points.push(prep);
        }
    }
    // var rand_table = [];
    // var range = Math.floor(points.length /  window.patents.length); 
    // for (var p = 0; p < window.patents.length; p++) {
    //     var rand = Math.floor(Math.random() * range * 0.7);
    //     //da seperation
    //     rand_table.push(p + rand);
    // }
    // for (var i = 0; i < rand_table.length; i++) {
    //     //apply
    //     if( rand_table[i] + i * range > points.length){
    //         break;
    //     }
    //     points[rand_table[i] + i * range].content = window.patents[i];
    // }
    for (var i = 0; i < points.length; i++) {
        points[ Math.floor(Math.random() * points.length) ].content = window.patents[i];
    }
    return points;
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function bakePointMap(points) {
    for (var j in data.tags) {
        var tagData = data.tags[j].data;
        var ratio = {};
        var total = 0;
        for (var q in tagData) {
            total += tagData[q];
        }
        var rest = points.length;
        for (var q in tagData) {
            ratio[q] = Math.round(tagData[q] / total * points.length);
            rest -= ratio[q];
        }
        if (rest > 0) {
            for (var q in tagData) {
                if (ratio[q] > 0) {
                    ratio[q] += rest;
                    rest = 0;
                    break;
                }
            }
        }
        //calced ratio...
        //generate table
        var arr = [];
        for (var i in ratio) {
            while (ratio[i] > 0) {
                ratio[i]--;
                arr.push(i);
            }
        }
        if (data.tags[j].random) {
            arr = shuffle(arr);
        }

        //got table, find start index
        var start = 0;
        if (data.tags[j].skipFace) {
            for (var i = 0; i < points.length; i++) {
                //find skip?
                if (points[i].face == data.tags[j].skipFace) {
                    start = i;
                    break;
                }
            }
        }
        for (var i = 0; i < points.length; i++) {
            var index = (i + start) % points.length;
            points[index].tags[j] = arr[i];
        }
    }
    window.points = points;
}

function bakeBillboards() {
    var billboards = {};
    var billboards_pos = {};
    for (var i in data.billboards) {
        var cur = data.billboards[i];
        switch (cur.kind) {
            case 'number':
                billboards[i] = new NumberBillboard(i);
                break;
            case 'bar':
                billboards[i] = new BarBillboard(i);
                break;
            case 'mesh':
                billboards[i] = new MeshBillboard(i);
                break;
            default:
                billboards[i] = cur.show;
                break;
        }
        if(billboards[i] == cur.show && cur.number != null){
            // console.log(cur.show);
            var ctx = beginPaint(300, 100, false);
            doText(ctx, cur.number);
            billboards_pos[i] = shuffle(endPaint(ctx, 700, 0));
        }
    }
    window.billboards_pos = billboards_pos;
    window.billboards = billboards;
}

export function buildFakeData() {
    var points = buildArchitype();
    bakePointMap(points);
    bakeBillboards();

    new SelectorScene();
    new ChaosScene();
  
}

var control = {
    width: data.width,
    height: data.height,
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    mouse_down: false,
    localX: 0,
    localY: 0,
    useLocalXY: 0,
    e: 0.1,
    menu_shown: false,
    zoom_t: 0,
    zoom: 0,
    mode: 0,
    mouse: true,
    leap_bypass: true,
    leap: false,
    billboard: "",
    leap_z: 0,
    leap_zt: 0,
    motion: 0,
    idleThreshold: 1000 * 60 * 10
};

// if (control.leap) {
Leap.loop(function (d) {
    if (d.hands.length == 0 || control.leap_bypass) {
        control.leap_zt = -1;
        control.leap = 0;
        return;
    }
    control.motion = Date.now();
    var hand = d.hands[0];
    var x = Math.min(1, Math.max(-1, hand.palmPosition[0] / 150)) / 2 + 0.5;
    var z = Math.min(1, Math.max(-1, hand.palmPosition[2] / 130)) / 2 + 0.5;
    var y = Math.min(1, Math.max(0, hand.palmPosition[1] / 400));
    control.tx = x;
    control.ty = z;
    control.leap_zt = y;
    control.leap = 1;
});
// }

window.data = data;
window.control = control;


document.addEventListener("mousemove", function (e) {
    control.tx = e.clientX / (data.width * scale);
    control.ty = e.clientY / (data.height * scale);
    control.motion = Date.now();
});

// import * as io from "socket.io-client";
// var sock = io.default(":8900");
// sock.on("pack", (d) => {
//     if (d.key == 'slide') {
//         control.ty = 1;
//         control.tx = d.value;
//         control.mouse_down = false;
//     }
//     if (d.key == 'knob') {
//         control.ty = 0.5;
//         control.mouse_down = true;
//         control.tx += d.value;
//     }
//     control.motion = Date.now();
// });

document.addEventListener("mousedown", function (e) {
    control.mouse_down = true;
    control.motion = Date.now();
});
document.addEventListener("mouseup", function (e) {
    control.mouse_down = false;
    control.motion = Date.now();
});

updatable.enable(() => {
    control.x = updatable.ease(control.x, control.tx, control.e, 0.00001);
    control.y = updatable.ease(control.y, control.ty, control.e, 0.00001);
    control.leap = false;
    // control.leap_z = updatable.ease(control.leap_z, control.leap_zt, control.e, 0.00001);
    // if (!control.leap) {
        // controls  -1 待机  0 重启  1 显示菜单  2 深入
        if (Date.now() - control.motion > control.idleThreshold) {
            // console.log("!leap", 1);
            control.mode = -1;
            control.menu_shown = false;
            control.mouse_down = false;
        } else {
            if(control.z < 30){
                control.menu_shown = true //false;
                control.mode = 3;
            } else if ( control.z < 80 ) {//if (control.mouse_down ) {
                // console.log("!leap", 2);
                control.menu_shown = true //false;
                control.mode = 2;
            } else{
                control.menu_shown = true //false; control.y > 0.8;
                // console.log("!leap", 3); me
                if (control.menu_shown) {
                    control.mode = 1;
                } else {
                    control.mode = 0;
                }
            }
        }
    // }

    if (control.leap) {
        if (Date.now() - control.motion > control.idleThreshold) {
            // console.log("leap", 1);
            control.mode = -1;
            control.menu_shown = false;
            control.mouse_down = false;
        } else {
            if (control.leap_z > 0 && control.leap_z < 0.5) {
                // console.log("leap", 2);
                control.menu_shown = false//true;
                control.mode = 2;
            } else {
                control.menu_shown = false//true; control.leap_z > 0.8;
                // console.log("leap", 3);
                if (control.menu_shown) {
                    control.mode = 1;
                } else {
                    control.mode = 0;
                }
            }
        }
    }


    if (control.mode == 1 && data.billboards[control.billboard] &&
        data.billboards[control.billboard].kind == 'mesh') {
        skyRGB[0] = 0xff;
        skyRGB[1] = 0xff;
        skyRGB[2] = 0xff;
        groundRGB[0] = 0;
        groundRGB[0] = 0;
        groundRGB[0] = 0;
    } else {
        window.skyRGB[0] = 0xff;
        window.skyRGB[1] = 0x66;
        window.skyRGB[2] = 0x33;
        window.groundRGB[0] = 0xff;
        window.groundRGB[1] = 0x11;
        window.groundRGB[2] = 0x01;
    }

    control.zoom = updatable.ease(control.zoom, control.zoom_t, 0.02, 0.00001);
});