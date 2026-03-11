const canvas = document.getElementById('scratch-canvas');
const ctx = canvas.getContext('2d');

let isDragging = false;
let brushRadius = 12;

// Function to initialize the silver scratch-off layer
function initCanvas() {
    // Set actual canvas resolution to match pixel density for crispness
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    
    // Create base silver gradient
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, '#e0e0e0');
    gradient.addColorStop(0.5, '#b0b0b0');
    gradient.addColorStop(1, '#909090');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Add noise pattern text
    ctx.font = '700 24px Outfit';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Render "SCRATCH" multiple times
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 4; j++) {
            ctx.fillText('SCRATCH', i * 90 - 20, j * 50 + 20);
        }
    }
}

// Wait for fonts to load before drawing
document.fonts.ready.then(() => {
    initCanvas();
});

// Helper to get relative mouse/touch coordinates
const getMousePos = (e) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
};

const scratch = (e) => {
    if (!isDragging) return;
    
    if (e.cancelable) e.preventDefault(); // Prevent scrolling on touch
    
    const pos = getMousePos(e);
    
    // 'destination-out' erases the existing canvas content where the new shape is drawn
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, brushRadius, 0, Math.PI * 2);
    ctx.fill();
};

// Mouse Events
canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    scratch(e);
});
canvas.addEventListener('mousemove', scratch);
window.addEventListener('mouseup', () => isDragging = false);

// Touch Events
canvas.addEventListener('touchstart', (e) => {
    isDragging = true;
    scratch(e);
}, { passive: false });

canvas.addEventListener('touchmove', scratch, { passive: false });
canvas.addEventListener('touchend', () => isDragging = false);
canvas.addEventListener('touchcancel', () => isDragging = false);

// Handle window resize
window.addEventListener('resize', () => {
    // Re-initialize canvas on resize if needed, though usually fixed card size is fine
    // initCanvas();
});
