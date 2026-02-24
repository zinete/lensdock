/**
 * LensDock — Settings Renderer
 * Manages settings UI and syncs with main process.
 */

const shapeOptions = document.querySelectorAll('.shape-option')
const sizeSlider = document.getElementById('size-slider')
const sizeLabel = document.getElementById('size-label')
const mirrorToggle = document.getElementById('mirror-toggle')
const borderToggle = document.getElementById('border-toggle')

// ---- Current settings (local copy) ----
let currentSettings = {
    shape: 'circle',
    size: 200,
    mirrored: true,
    borderEnabled: true,
}

// ---- Broadcast settings to main ----
function pushSettings() {
    window.electronAPI.updateSettings({ ...currentSettings })
}

// ---- Shape ----
shapeOptions.forEach((btn) => {
    btn.addEventListener('click', () => {
        shapeOptions.forEach((b) => b.classList.remove('active'))
        btn.classList.add('active')
        currentSettings.shape = btn.dataset.shape
        pushSettings()
    })
})

// ---- Size ----
sizeSlider.addEventListener('input', (e) => {
    const size = parseInt(e.target.value, 10)
    sizeLabel.textContent = `${size}px`
    currentSettings.size = size
    pushSettings()
})

// ---- Mirror ----
mirrorToggle.addEventListener('change', () => {
    currentSettings.mirrored = mirrorToggle.checked
    pushSettings()
})

// ---- Border ----
borderToggle.addEventListener('change', () => {
    currentSettings.borderEnabled = borderToggle.checked
    pushSettings()
})

// ---- Apply settings to UI ----
function applyToUI(s) {
    currentSettings = { ...s }

    shapeOptions.forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.shape === s.shape)
    })

    sizeSlider.value = s.size
    sizeLabel.textContent = `${s.size}px`

    mirrorToggle.checked = s.mirrored
    borderToggle.checked = s.borderEnabled
}

// Listen for external changes (e.g. from tray menu)
window.electronAPI.onSettingsChanged(applyToUI)

// Load initial settings
window.electronAPI.getSettings().then(applyToUI)
