const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    // Drag (camera window)
    startDrag: (mouseX, mouseY) => ipcRenderer.send('start-drag', mouseX, mouseY),
    dragging: (mouseX, mouseY) => ipcRenderer.send('dragging', mouseX, mouseY),
    endDrag: () => ipcRenderer.send('end-drag'),

    // Settings
    getSettings: () => ipcRenderer.invoke('get-settings'),
    updateSettings: (settings) => ipcRenderer.send('update-settings', settings),
    onSettingsChanged: (callback) => ipcRenderer.on('settings-changed', (_event, settings) => callback(settings)),
})
