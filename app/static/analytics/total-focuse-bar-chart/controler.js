import { getAnalyticsSessions } from '../analyticsStore.js';
import { getBarChartData } from './data-pipe-line.js';
import { renderBarChart } from './renderer.js';
import { subscribeToAnalyticsSessionsChanges } from '../analyticsStore.js';

// initialize the bar chart with data from data-pipe-line.js
export function initializeTotalFocusBarChart() {
    try {
        const analyticsSessions = getAnalyticsSessions();
        const barChartData = getBarChartData(analyticsSessions);
        let chart = renderBarChart(barChartData);

        subscribeToAnalyticsSessionsChanges((sessions) => {
            chart.destroy(); // Destroy the previous chart instance before creating a new one
            const barChartData = getBarChartData(sessions);
            chart = renderBarChart(barChartData);
        });

    } catch (error) {
        console.error("Error initializing total focus bar chart:", error);
        return;
    }
}