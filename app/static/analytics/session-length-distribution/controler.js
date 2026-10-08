import {
    getAnalyticsDashboard,
    subscribeToAnalyticsDashboardChanges
} from '../analyticsStore.js';
import { getSessionLengthDistributionData } from './pipeline.js';
import { renderSessionLengthDistribution } from './renderer.js';

export function initializeSessionLengthDistribution() {
    let chart = null;

    function updateChart(dashboard = getAnalyticsDashboard()) {
        const distribution = dashboard?.periods.selected.stats.sessionLengthDistribution || [];
        const chartData = getSessionLengthDistributionData(distribution);

        chart?.destroy();
        chart = renderSessionLengthDistribution(chartData);
    }

    updateChart();
    return subscribeToAnalyticsDashboardChanges(updateChart);
}
