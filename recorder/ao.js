//ffmpeg -framerate 60 -i 'jpg2_out_%5d.jpg' -c:v libx264 -pix_fmt yuv420p out_operation.mp4

const {
    app,
    BrowserWindow,
    nativeImage,
    ipcMain
} = require('electron')

app.commandLine.appendSwitch("--disable-http-cache");
// app.disableHardwareAcceleration()

let win
var fs = require('fs')
var i = 0

function pad(i) {
    var str = i + "";
    while (str.length < 5) {
        str = "0" + str;
    }
    return str;
}
app.once('ready', () => {

    var displayWin = new BrowserWindow({
        width: 800,
        height: 600,
        nodeIntegration: true,
        webPreferences: {
            nodeIntegration: true
        }
    });
    displayWin.loadURL(`file://${__dirname}/display.html`)

    win = new BrowserWindow({
        width: 1920,
        height: 1080,
        frame: false,
        enableLargerThanScreen: true,
        webPreferences: {
            preload: __dirname + "/test.js",
            offscreen: true
        }
    })

    win.loadURL('http://localhost:1234')
    win.setSize(1920, 1080);
    var controlling = false;
    var recording = false;
    win.webContents.on('paint', (event, dirty, image) => {
        displayWin.webContents.executeJavaScript(`setImage('${image.resize({
            width: 1920  / 4,
            height: 1080  / 4
        }).toDataURL()}')`)
        if (recording) {
            win.webContents.stopPainting()
            fs.writeFileSync("jpg2_out_" + pad(i++) + ".jpg", image.toJPEG(100));
            win.webContents.startPainting()
        }
    })

    ipcMain.on('mouse-down', (event, x, y) => {
        sendMouseInput('mouseDown', x, y)
    })
    ipcMain.on('mouse-up', (event, x, y) => {
        sendMouseInput('mouseUp', x, y)
    })
    ipcMain.on('mouse-move', (event, x, y) => {
        sendMouseInput('mouseMove', x, y)
    })
    ipcMain.on('mouse-enter', (event, x, y) => {
        sendMouseInput('mouseEnter', x, y)
    })
    ipcMain.on('mouse-leave', (event, x, y) => {
        sendMouseInput('mouseLeave', x, y)
    })

    ipcMain.on('rec', (x, r) => {
        recording = r
        console.log('rec', r);
    })
    ipcMain.on('ctl', (x, r) => {
        controlling = r
        console.log('ctrl', r);
    })

    sendMouseInput = (type, x, y) => {
        if (!controlling) return;
        win.focusOnWebView()
        console.log(type + ' ' + x + ' ' + y)
        let inputArgs = {
            type: type,
            x: x * 1920,
            y: y * 1080
        }
        if (type == 'mouseDown' || type == 'mouseUp') {
            inputArgs.clickCount = 1
            inputArgs.button = 'left';
        }
        win.webContents.sendInputEvent(inputArgs)
    }

    // win.webContents.beginFrameSubscription((data) => {
    //     console.log(i++);
    //     if (i++ > 10) {
    //         // win.webContents.stopPainting()
    //         // console.log(data);
    //         var img = nativeImage.createFromBuffer(data, {
    //             width: 1920,
    //             height: 1080
    //         })
    //         fs.writeFileSync("plus_out_" + pad(i++) + ".jpg", img.toPNG());
    //         // win.webContents.startPainting()
    //     }
    // })
    win.webContents.setFrameRate(60)
})