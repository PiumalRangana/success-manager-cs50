// Waits for the button click and coordinates the feature.
import {
    renderInsightButtonAndPlaceHolder,
    renderInsightEmptyState,
    renderInsightError,
    renderInsightLoading,
    renderInsightResponse,
    renderSavedInsightAvailable
} from './insightRenderer.js';
import {
    getAnalyticsDashboard,
    subscribeToAnalyticsDashboardChanges
} from '../analyticsStore.js';
import { createInsightPayload } from './insightPayload.js';
import { getAiInsight, getSavedAiInsightStatus } from './insightService.js';

export function initializeAiInsightFeature() {
    // 1 render button and the place holder from renderer
    renderInsightButtonAndPlaceHolder();

    // 2 listen to the button click
    const insightButton = document.getElementById('ai-insight-button');
    const generateNewButton = document.getElementById('ai-insight-generate-new-button');

    if (!insightButton || !generateNewButton) {
        console.error('AI Insight buttons could not be found.');
        return;
    }

    let savedInsight = null;
    let primaryAction = 'generate';
    let availabilityRequestVersion = 0;

    // Date changes never generate AI text. They only check whether this range
    // has a previous saved response that the user may choose to view.
    subscribeToAnalyticsDashboardChanges(async dashboardData => {
        const requestVersion = ++availabilityRequestVersion;
        savedInsight = null;
        primaryAction = 'generate';
        renderInsightEmptyState();

        const payload = createInsightPayload(dashboardData);

        if (!payload) {
            return;
        }

        try {
            const savedStatus = await getSavedAiInsightStatus(payload);

            if (requestVersion !== availabilityRequestVersion || !savedStatus.exists) {
                return;
            }

            savedInsight = savedStatus;
            primaryAction = 'viewSaved';
            renderSavedInsightAvailable(savedStatus);
        } catch (error) {
            // A saved-response lookup is optional. A user can still generate
            // a new insight when it is unavailable.
            console.error('Unable to check saved AI insights:', error);
        }
    });

    async function generateInsight(generateNew) {
        // Prevent a late saved-insight lookup from replacing this request's UI.
        availabilityRequestVersion += 1;

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
            const insightData = await getAiInsight(payload, generateNew);

            // 6 receive the response from the server
            // 7 render the response through renderer
            renderInsightResponse(insightData);
            savedInsight = null;
            primaryAction = 'generateNew';
        } catch (error) {
            console.error('Unable to get an AI insight:', error);
            renderInsightError(error.message);
        }
    }

    insightButton.addEventListener('click', async () => {
        if (primaryAction === 'viewSaved' && savedInsight) {
            renderInsightResponse(savedInsight.insight, savedInsight.generatedAt);
            savedInsight = null;
            primaryAction = 'generateNew';
            return;
        }

        await generateInsight(primaryAction === 'generateNew');
    });

    generateNewButton.addEventListener('click', async () => {
        await generateInsight(true);
    });
}
