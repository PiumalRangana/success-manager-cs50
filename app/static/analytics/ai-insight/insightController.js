// Waits for the button click and coordinates the feature.
import { renderInsightButtonAndPlaceHolder, renderInsightResponse } from './insightRenderer.js';
import { getAnalyticsDashboard } from '../analyticsStore.js';
import { createInsightPayload } from './insightPayload.js';
import { getAiInsight } from './insightService.js';

export function initializeAiInsightFeature() {
    // 1 render button and the place holder from renderer
    renderInsightButtonAndPlaceHolder();

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

        try {
            // 5 send the payload to server through service
            const insightData = await getAiInsight(payload);

            // 6 receive the response from the server
            // 7 render the response through renderer
            renderInsightResponse(insightData);
        } catch (error) {
            console.error('Unable to get an AI insight:', error);
        }
    });
}
