export function createLegendRenderer(containerSelector, legendData) {
    console.log("Creating legend renderer with data:", legendData);
    let container = document.querySelector(containerSelector);
    let html = `
        <h3>Legend</h3>`
    for (let task in legendData.tasks) {
        html += `
        <div class="legend-item ${legendData.tasks[task].is_active ? "active" : ""}">
            <span class="legend-color" style="background-color: ${legendData.tasks[task].color};"></span>
            <span class="legend-name">${task}</span>
            <span class="legend-time">${milisecondToTime(legendData.tasks[task].time)}</span>
        </div>
`;
    }
    html += `
        <div class="legend-item">
            <span class="legend-color" style="background-color: #ddd;"></span>
            <span class="legend-name">Idle</span>
            <span class="legend-time">${milisecondToTime(legendData.idleTime)}</span>
        </div>
`;

    container.innerHTML = html;
}
function milisecondToTime(ms) {
    let seconds = Math.floor((ms / 1000) % 60);
    let minutes = Math.floor((ms / (1000 * 60)) % 60);
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return `${hours}h ${minutes}m ${seconds}s`;
}