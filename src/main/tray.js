/**
 * LensDock — System Tray
 * Creates the macOS menu bar tray icon with quick actions.
 */

const { app, Tray, Menu, nativeImage } = require('electron')
const path = require('node:path')
const { settings } = require('./settings')
const { createSettingsWindow, getCameraWindow, getSettingsWindow } = require('./windows')

const ICON_PATH = path.join(__dirname, '..', '..', 'assets', 'trayIconTemplate.png')

let tray = null

function createTray() {

    console.log(ICON_PATH, 'ICON_PATH')
    const icon = nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACTSURBVHgBpZKBCYAgEEV/TeAIjuIIbdQIuUGt0CS1gW1iZ2jIVaTnhw+Cvs8/OYDJA4Y8kR3ZR2/kmazxJbpUEfQ/Dm/UG7wVwHkjlQdMFfDdJMFaACebnjJGyDWgcnZu1/lrCrl6NCoEHJBrDwEr5NrT6ko/UV8xdLAC2N49mlc5CylpYh8wCwqrvbBGLoKGvz8Bfq0QPWEUo/EAAAAASUVORK5CYII=')
    app.whenReady().then(() => {
        tray = new Tray(icon)
        tray.setToolTip('LensDock')
        tray.on('click', () => {
            createSettingsWindow()
        })
        // Right click → quick menu
        const contextMenu = Menu.buildFromTemplate([
            { type: 'separator' },
            {
                label: '显示浮窗',
                type: 'checkbox',
                checked: settings.cameraVisible,
                click: (menuItem) => {
                    settings.cameraVisible = menuItem.checked
                    const cam = getCameraWindow()
                    if (cam) {
                        if (settings.cameraVisible) {
                            cam.showInactive()
                        } else {
                            cam.hide()
                        }
                        cam.webContents.send('settings-changed', { ...settings })
                    }
                    const stg = getSettingsWindow()
                    if (stg) stg.webContents.send('settings-changed', { ...settings })
                },
            },
            {
                label: '镜像画面',
                type: 'checkbox',
                checked: settings.mirrored,
                click: (menuItem) => {
                    settings.mirrored = menuItem.checked
                    const cam = getCameraWindow()
                    if (cam) cam.webContents.send('settings-changed', { ...settings })
                    const stg = getSettingsWindow()
                    if (stg) stg.webContents.send('settings-changed', { ...settings })
                },
            },
            { label: '退出', click: () => app.quit() },
        ])

        tray.setContextMenu(contextMenu)
    })


}

module.exports = { createTray }
