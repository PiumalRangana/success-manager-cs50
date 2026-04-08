export function createLegendRenderer(containerSelector) {
    document.querySelector(containerSelector).innerHTML = `
        <h3>Legend</h3>
        <div class="legend-items"></div>
    `;
}