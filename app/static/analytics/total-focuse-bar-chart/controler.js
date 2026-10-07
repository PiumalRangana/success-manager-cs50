import {
    getAnalyticsDashboard,
    subscribeToAnalyticsDashboardChanges
} from '../analyticsStore.js';
import { getBarChartData } from './data-pipe-line.js';
import { renderBarChart } from './renderer.js';

export function initializeTotalFocusBarChart() {
    let chart = null;

    function updateChart(dashboard = getAnalyticsDashboard()) {
        const dailyActivity = dashboard?.periods.selected.stats.dailyActivity || [];
        const barChartData = getBarChartData(dailyActivity);

        chart?.destroy();
        chart = renderBarChart(barChartData);
    }

    try {
        updateChart();
        return subscribeToAnalyticsDashboardChanges(updateChart);
    } catch (error) {
        console.error('Error initializing total focus bar chart:', error);
        return null;
    }
}
