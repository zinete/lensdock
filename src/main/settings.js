/**
 * LensDock — Centralized Settings State
 * Single source of truth for app settings, shared across all modules.
 */

const settings = {
    shape: 'circle',
    size: 200,
    mirrored: true,
    borderEnabled: true,
    cameraVisible: true,
}

function getSettings() {
    return { ...settings }
}

function updateSettings(newSettings) {
    Object.assign(settings, newSettings)
}

module.exports = { settings, getSettings, updateSettings }
