import { createLegendRenderer } from "./legendRenderer.js";
import { getLegendData } from "./legendPipeline.js";
import { getTodaySessions } from "../dailySessionStore.js";

export function initLegend(){
    let todaySessions = getTodaySessions();
    createLegendRenderer("#legend");
    const legendData = getLegendData(todaySessions);
    console.log("legendData:", legendData);
}

