import { CONFIG } from '/js/halftone/config.js';

export function createGrid(canvas, spacing, dotRadius = CONFIG.baseRadius) {
    const grid = [];

    const usableWidth = canvas.width - 2 * dotRadius;
    const usableHeight = canvas.height - 2 * dotRadius;

    const cols = Math.floor(usableWidth / spacing);
    const rows = Math.floor(usableHeight / spacing);

    const totalGridWidth = cols * spacing;
    const totalGridHeight = rows * spacing;

    const offsetX = (canvas.width - totalGridWidth) / 2;
    const offsetY = (canvas.height - totalGridHeight) / 2;

    for (let y = 0; y <= rows; y++) {
        for (let x = 0; x <= cols; x++) {
            grid.push({
                x: offsetX + x * spacing,
                y: offsetY + y * spacing
            });
        }
    }

    return grid;
}

export function drawDotGrid(ctx, grid, getRadius) {
    let color = '#eee'; // default

    const canvas = ctx.canvas;
    const main = document.querySelector('main');

    if (canvas.classList.contains('theme-aware') && main?.classList.contains('inverted')) {
        color = '#1c1c1c';
    }
    if (canvas.classList.contains('theme-dark')) {
        color = '#eee';
    }

    ctx.fillStyle = color;

    for (let i = 0; i < grid.length; i++) {
        const { x, y } = grid[i];
        const r = getRadius(grid[i]);
        if (r <= 0) continue;
        ctx.beginPath();
        ctx.arc(Math.round(x), Math.round(y), r, 0, Math.PI * 2);
        ctx.fill();
    }
}

export function resizeCanvasAndGrid(canvas, spacing, dotRadius = CONFIG.baseRadius) {
    const wrapper = canvas.parentElement;
    canvas.width = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;
    return createGrid(canvas, spacing, dotRadius);
}