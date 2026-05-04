import { loadTodaySessions } from "./dailyTimeRing/dailySessionStore.js";
import { renderDailyChart } from "./dailyTimeRing/chart/chartCore.js";
import { initLegend } from "./dailyTimeRing/legand/index.js";
import { applyTextOverflowHelpers } from "./utils/domUtils.js";

async function initializeHomePage() {
    try {
        await loadTodaySessions();
        renderDailyChart();
        initLegend();
        applyTextOverflowHelpers(".task-text");
    } catch (err) {
        console.error("Error initializing home page:", err);
    }
}

initializeHomePage();