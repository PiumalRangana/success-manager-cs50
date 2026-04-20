import { createLegendRenderer } from "./legendRenderer.js";
import { getLegendData } from "./legendPipeline.js";
import { getTodaySessions, subscribe } from "../dailySessionStore.js";

function updateLegend() {
    const sessions = getTodaySessions();
    const legendData = getLegendData(sessions);
    createLegendRenderer("#legend", legendData);
}

export function initLegend(){
    updateLegend();

    subscribe(() => {
        updateLegend();
    });

    startLegendLoop();
}

let intervalId = null;

function startLegendLoop() {
    if (intervalId) return;

    intervalId = setInterval(() => {
        updateLegend();
    }, 1000);
}

function stopLegendLoop() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

