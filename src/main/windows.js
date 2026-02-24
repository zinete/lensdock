/**
 * LensDock — Window Management
 * Creates and manages the camera overlay and settings windows.
 */

const { BrowserWindow, screen } = require('electron')
const path = require('node:path')
const { getSettings } = require('./settings')

const PRELOAD_PATH = path.join(__dirname, '..', 'preload', 'preload.js')
const CAMERA_HTML = path.join(__dirname, '..', 'renderer', 'camera', 'camera.html')
const SETTINGS_HTML = path.join(__dirname, '..', 'renderer', 'settings', 'settings.html')

let cameraWindow = null
let settingsWindow = null

// ---- Camera (transparent overlay) ----
function createCameraWindow() {
    const s = getSettings()
    const { width: screenW, height: screenH } = screen.getPrimaryDisplay().workAreaSize

    cameraWindow = new BrowserWindow({
        width: s.size,
        height: s.size,
        x: screenW - s.size - 40,
        y: screenH - s.size - 40,
        frame: false,
        transparent: true,
        hasShadow: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        resizable: false,
        roundedCorners: false,
        webPreferences: {
            preload: PRELOAD_PATH,
            contextIsolation: true,
            nodeIntegration: false,
        },
    })

    cameraWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
    cameraWindow.loadFile(CAMERA_HTML)

    cameraWindow.on('closed', () => {
        cameraWindow = null
    })
}

// ---- Settings ----
function createSettingsWindow() {
    if (settingsWindow && !settingsWindow.isDestroyed()) {
        settingsWindow.show()
        settingsWindow.focus()
        return
    }

    settingsWindow = new BrowserWindow({
        width: 780,
        height: 560,
        minWidth: 680,
        minHeight: 480,
        resizable: true,
        maximizable: false,
        minimizable: true,
        fullscreenable: false,
        titleBarStyle: 'hiddenInset',
        vibrancy: 'sidebar',
        webPreferences: {
            preload: PRELOAD_PATH,
            contextIsolation: true,
            nodeIntegration: false,
        },
    })

    settingsWindow.loadFile(SETTINGS_HTML)

    settingsWindow.on('closed', () => {
        settingsWindow = null
    })
}

// ---- Accessors ----
function getCameraWindow() {
    return cameraWindow && !cameraWindow.isDestroyed() ? cameraWindow : null
}

function getSettingsWindow() {
    return settingsWindow && !settingsWindow.isDestroyed() ? settingsWindow : null
}

module.exports = {
    createCameraWindow,
    createSettingsWindow,
    getCameraWindow,
    getSettingsWindow,
}
