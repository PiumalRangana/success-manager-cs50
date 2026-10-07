import {
    getAnalyticsDashboard,
    subscribeToAnalyticsDashboardChanges
} from '../analyticsStore.js';
import { convertTimePerTaskData } from './pipeline.js';
import { renderTimePerTaskDonutChart } from './renderer.js';

export function initializeTimePerTaskDonutChart() {
    let chart = null;

    function updateChart(dashboard = getAnalyticsDashboard()) {
        const taskBreakdown = dashboard?.periods.selected.stats.taskBreakdown || [];
        const chartData = convertTimePerTaskData(taskBreakdown);

        chart?.destroy();
        chart = renderTimePerTaskDonutChart(chartData);
    }

    updateChart();
    return subscribeToAnalyticsDashboardChanges(updateChart);
}
