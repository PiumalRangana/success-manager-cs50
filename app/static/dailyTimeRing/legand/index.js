import { createLegendRenderer } from "./legendRenderer.js";
import { getLegendData } from "./legendPipeline.js";
import { getTodaySessions, subscribe } from "../dailySessionStore.js";

export function initLegend(){
    let initialSessions = getTodaySessions();
    convertDataAndRender(initialSessions);

    subscribe((sessions) => {
        convertDataAndRender(sessions);
    });

    startLegendLoop();
}

let intervalId = null;

function startLegendLoop() {
    if (intervalId) return;

    intervalId = setInterval(() => {
        const sessions = getTodaySessions();
        convertDataAndRender(sessions);
    }, 1000);
}

function stopLegendLoop() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

function convertDataAndRender(sessions) {
        const legendData = getLegendData(sessions);
        createLegendRenderer("#legend", legendData);
}