/**
 * LensDock — Application Entry Point
 * Initializes the app, sets up IPC, creates windows, and starts the tray.
 */

const { app } = require('electron')
const { setupIPC } = require('./ipc')
const { createCameraWindow, getCameraWindow } = require('./windows')
const { createTray } = require('./tray')

app.whenReady().then(() => {
    setupIPC()
    createCameraWindow()
    createTray()

    app.on('activate', () => {
        if (!getCameraWindow()) {
            createCameraWindow()
        }
    })
})

app.on('window-all-closed', () => {
    // Don't quit on macOS — keep running in tray
})
