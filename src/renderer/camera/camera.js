/**
 * LensDock — Camera Renderer
 * Handles camera capture, drag, and settings sync.
 */

const video = document.getElementById('camera-video')
const container = document.getElementById('camera-container')
const dragHandle = document.getElementById('drag-handle')

// ---- Camera Init ----
async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 640 }, facingMode: 'user' },
            audio: false,
        })
        video.srcObject = stream
    } catch (err) {
        console.error('Camera access failed:', err)
        container.style.background = 'linear-gradient(135deg, #1e1b4b, #312e81)'
    }
}

// ---- Manual Drag ----
let isDragging = false

dragHandle.addEventListener('mousedown', (e) => {
    isDragging = true
    window.electronAPI.startDrag(e.screenX, e.screenY)

    const onMouseMove = (ev) => {
        if (isDragging) window.electronAPI.dragging(ev.screenX, ev.screenY)
    }
    const onMouseUp = () => {
        isDragging = false
        window.electronAPI.endDrag()
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
})

// ---- Apply Settings ----
function applySettings(s) {
    container.className = `shape-${s.shape}`
    video.style.transform = s.mirrored ? 'scaleX(-1)' : 'none'
    container.style.borderWidth = s.borderEnabled ? '2px' : '0'
}

window.electronAPI.onSettingsChanged(applySettings)
window.electronAPI.getSettings().then(applySettings)

// Start
initCamera()
