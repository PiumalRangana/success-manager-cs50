import {
    getAnalyticsDashboard,
    subscribeToAnalyticsDashboardChanges
} from '../analyticsStore.js';
import { renderTimeDistributionChart } from './renderer.js';
import { groupByHour } from './pipeline.js';

export function initializeTimeDistributionByHourChart() {
    let chart = null;

    function updateChart(dashboard = getAnalyticsDashboard()) {
        const hourlyDistribution = dashboard?.periods.selected.stats.hourlyDistribution || [];
        const chartData = groupByHour(hourlyDistribution);

        chart?.destroy();
        chart = renderTimeDistributionChart(chartData);
    }

    updateChart();
    return subscribeToAnalyticsDashboardChanges(updateChart);
}
