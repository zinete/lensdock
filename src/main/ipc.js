/**
 * LensDock — IPC Handlers
 * Handles all inter-process communication between main and renderer processes.
 */

const { ipcMain } = require('electron')
const { getSettings, updateSettings } = require('./settings')
const { getCameraWindow } = require('./windows')

let dragStartPos = null

function setupIPC() {
    // ---- Camera drag ----
    ipcMain.on('start-drag', (_event, mouseX, mouseY) => {
        const win = getCameraWindow()
        if (win) {
            const [winX, winY] = win.getPosition()
            dragStartPos = { winX, winY, mouseX, mouseY }
        }
    })

    ipcMain.on('dragging', (_event, mouseX, mouseY) => {
        const win = getCameraWindow()
        if (win && dragStartPos) {
            const newX = dragStartPos.winX + (mouseX - dragStartPos.mouseX)
            const newY = dragStartPos.winY + (mouseY - dragStartPos.mouseY)
            win.setPosition(Math.round(newX), Math.round(newY))
        }
    })

    ipcMain.on('end-drag', () => {
        dragStartPos = null
    })

    // ---- Settings ----
    ipcMain.handle('get-settings', () => getSettings())

    ipcMain.on('update-settings', (_event, newSettings) => {
        const oldSize = getSettings().size
        updateSettings(newSettings)
        const current = getSettings()

        const win = getCameraWindow()
        if (win) {
            if (current.size !== oldSize) {
                win.setSize(current.size, current.size)
            }
            win.webContents.send('settings-changed', current)
        }
    })
}

module.exports = { setupIPC }
