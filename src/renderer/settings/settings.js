/**
 * LensDock — Settings Renderer
 * Handles sidebar navigation, camera preview, and settings controls.
 */

// ---- Elements ----
const navItems = document.querySelectorAll('.nav-item')
const pages = document.querySelectorAll('.page')

// Settings controls
const shapeOptions = document.querySelectorAll('.shape-option')
const sizeSlider = document.getElementById('size-slider')
const sizeLabel = document.getElementById('size-label')
const mirrorToggle = document.getElementById('mirror-toggle')
const borderToggle = document.getElementById('border-toggle')

// Preview elements
const previewContainer = document.getElementById('preview-container')
const previewVideo = document.getElementById('preview-video')
const metaShape = document.getElementById('meta-shape')
const metaSize = document.getElementById('meta-size')
const metaMirror = document.getElementById('meta-mirror')

// ---- State ----
let currentSettings = {
    shape: 'circle',
    size: 200,
    mirrored: true,
    borderEnabled: true,
}

const SHAPE_LABELS = { circle: '圆形', rounded: '圆角', square: '方形' }

// ================================
// Sidebar Navigation
// ================================
navItems.forEach((item) => {
    item.addEventListener('click', () => {
        const page = item.dataset.page

        // Update nav
        navItems.forEach((n) => n.classList.remove('active'))
        item.classList.add('active')

        // Switch page
        pages.forEach((p) => p.classList.remove('active'))
        document.getElementById(`page-${page}`).classList.add('active')
    })
})

// ================================
// Camera Preview (home page)
// ================================
async function initPreviewCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 640 }, facingMode: 'user' },
            audio: false,
        })
        previewVideo.srcObject = stream
    } catch (err) {
        console.error('Preview camera failed:', err)
        previewContainer.style.background = 'linear-gradient(135deg, #1e1b4b, #312e81)'
    }
}

// ================================
// Settings Controls
// ================================

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

// ================================
// Sync
// ================================

function pushSettings() {
    window.electronAPI.updateSettings({ ...currentSettings })
    applyToPreview(currentSettings)
}

function applyToUI(s) {
    currentSettings = { ...s }

    // Settings controls
    shapeOptions.forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.shape === s.shape)
    })
    sizeSlider.value = s.size
    sizeLabel.textContent = `${s.size}px`
    mirrorToggle.checked = s.mirrored
    borderToggle.checked = s.borderEnabled

    // Preview
    applyToPreview(s)
}

function applyToPreview(s) {
    // Preview shape
    previewContainer.className = `shape-${s.shape}`
    previewVideo.style.transform = s.mirrored ? 'scaleX(-1)' : 'none'
    previewContainer.style.borderWidth = s.borderEnabled ? '2px' : '0'

    // Meta info
    metaShape.textContent = SHAPE_LABELS[s.shape] || s.shape
    metaSize.textContent = `${s.size}px`
    metaMirror.textContent = s.mirrored ? '开启' : '关闭'
}

// ---- IPC listeners ----
window.electronAPI.onSettingsChanged(applyToUI)
window.electronAPI.getSettings().then(applyToUI)

// ---- Init ----
initPreviewCamera()
