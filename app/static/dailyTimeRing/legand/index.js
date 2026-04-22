import { createLegendRenderer } from "./legendRenderer.js";
import { getLegendData } from "./legendPipeline.js";
import { getTodaySessions, subscribe } from "../dailySessionStore.js";
import { updateActiveTime, updateIdleTime } from "./legendRenderer.js";

// Initial full render of legend
function initDraw() {
    const sessions = getTodaySessions();
    const legendData = getLegendData(sessions);
    createLegendRenderer("#legend", legendData);
}

// Runs every second to update only dynamic parts (active task or idle)
function updateLegend() {
    const sessions = getTodaySessions();
    const legendData = getLegendData(sessions);
    const activeTasksKey = Object.keys(legendData.tasks).filter(task => legendData.tasks[task].is_active);
    if (activeTasksKey.length > 0) {
        updateActiveTime(legendData.tasks[activeTasksKey[0]].time);
    }else{
        updateIdleTime(legendData.idleTime);
    }
    
}

// Initializes legend system: initial render + subscribe + interval loop
export function initLegend(){
    initDraw();

    subscribe(() => {
        initDraw();
    });

    startLegendLoop();
}

let intervalId = null;

// Starts the interval loop (runs once)
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

