import { generateInsightsFromDashboard } from './insightsGenarator.js';
import { renderInsights } from './insightRenderer.js';
import {
    getAnalyticsDashboard,
    subscribeToAnalyticsDashboardChanges
} from '../analyticsStore.js';

let cleanupInsights = null;

function refreshInsights(dashboard = getAnalyticsDashboard()) {
    if (!dashboard) {
        return;
    }

    const insights = generateInsightsFromDashboard(dashboard);

    if (insights) {
        renderInsights(insights);
    }
}

export async function initializeInsights({ renderCurrent = true } = {}) {
    if (cleanupInsights) {
        cleanupInsights();
    }

    const unsubscribeFromDashboard = subscribeToAnalyticsDashboardChanges(
        refreshInsights
    );

    const cleanup = () => {
        unsubscribeFromDashboard();

        if (cleanupInsights === cleanup) {
            cleanupInsights = null;
        }
    };

    cleanupInsights = cleanup;

    if (renderCurrent) {
        refreshInsights();
    }

    return cleanup;
}
