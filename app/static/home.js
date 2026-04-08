import { loadTodaySessions } from "./dailyTimeRing/dailySessionStore.js";
import { renderDailyChart } from "./dailyTimeRing/chart/chartCore.js";
import { initLegend } from "./dailyTimeRing/legand/index.js";

async function initializeHomePage() {
    try {
        await loadTodaySessions();
        renderDailyChart();
        initLegend();
    } catch (err) {
        console.error("Error initializing home page:", err);
    }
}

initializeHomePage();