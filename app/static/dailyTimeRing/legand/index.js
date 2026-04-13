import { createLegendRenderer } from "./legendRenderer.js";
import { getLegendData } from "./legendPipeline.js";
import { getTodaySessions, subscribe } from "../dailySessionStore.js";

export function initLegend(){
    let todaySessions = getTodaySessions();
    const legendData = getLegendData(todaySessions);
    createLegendRenderer("#legend", legendData);

    subscribe((sessions) => {
        const legendData = getLegendData(sessions);
        createLegendRenderer("#legend", legendData);
    });
}
