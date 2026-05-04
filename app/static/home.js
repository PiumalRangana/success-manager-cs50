import { loadTodaySessions } from "./dailyTimeRing/dailySessionStore.js";
import { renderDailyChart } from "./dailyTimeRing/chart/chartCore.js";
import { initLegend } from "./dailyTimeRing/legand/index.js";
import { applyConditionalTooltip } from "./utils/domUtils.js";

async function initializeHomePage() {
    try {
        await loadTodaySessions();
        renderDailyChart();
        initLegend();
        applyConditionalTooltip(".task-text");
    } catch (err) {
        console.error("Error initializing home page:", err);
    }
}

initializeHomePage();