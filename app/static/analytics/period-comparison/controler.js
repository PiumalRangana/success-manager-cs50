import {
    getAnalyticsDashboard,
    subscribeToAnalyticsDashboardChanges
} from '../analyticsStore.js';
import { buildPeriodComparisonView } from './pipeline.js';
import {
    renderPeriodComparison,
    renderPeriodComparisonLoading
} from './renderer.js';

export function initializePeriodComparison() {
    const container = document.getElementById('period-comparison-body');

    if (!container) {
        return null;
    }

    let target = 'previous';

    function updateComparison(dashboard = getAnalyticsDashboard()) {
        if (!dashboard) {
            renderPeriodComparisonLoading(container);
            return;
        }

        if (target === 'current' && !dashboard.periods.present) {
            target = 'previous';
        }

        const view = buildPeriodComparisonView(dashboard, target);
        renderPeriodComparison(container, view, nextTarget => {
            target = nextTarget;
            updateComparison(dashboard);
        });
    }

    updateComparison();
    return subscribeToAnalyticsDashboardChanges(updateComparison);
}
