// Waits for the button click and coordinates the feature.
import {
    renderInsightButtonAndPlaceHolder,
    renderInsightEmptyState,
    renderInsightError,
    renderInsightLoading,
    renderInsightResponse
} from './insightRenderer.js';
import {
    getAnalyticsDashboard,
    subscribeToAnalyticsDashboardChanges
} from '../analyticsStore.js';
import { createInsightPayload } from './insightPayload.js';
import { getAiInsight } from './insightService.js';

export function initializeAiInsightFeature() {
    // 1 render button and the place holder from renderer
    renderInsightButtonAndPlaceHolder();

    // A new date range clears old cards, but never makes an AI request.
    subscribeToAnalyticsDashboardChanges(renderInsightEmptyState);

    // 2 listen to the button click
    const insightButton = document.getElementById('ai-insight-button');

    if (!insightButton) {
        console.error('AI Insight button could not be found.');
        return;
    }

    insightButton.addEventListener('click', async () => {
        console.log("AI Insight button clicked");

        // 3 get the current dashboard directly from analyticsStore
        const dashboardData = getAnalyticsDashboard();

        // 4 create payload through insight payload
        const payload = createInsightPayload(dashboardData);

        if (!payload) {
            renderInsightError('Analytics is still loading. Please try again in a moment.');
            return;
        }

        try {
            // 5 send the payload to server through service
            renderInsightLoading();
            const insightData = await getAiInsight(payload);

            // 6 receive the response from the server
            // 7 render the response through renderer
            renderInsightResponse(insightData);
        } catch (error) {
            console.error('Unable to get an AI insight:', error);
            renderInsightError(error.message);
        }
    });
}
