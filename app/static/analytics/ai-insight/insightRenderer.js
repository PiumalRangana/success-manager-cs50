// Render the initial button and placeholder once when Analytics starts.
export function renderInsightButtonAndPlaceHolder() {
    if (document.getElementById('ai-insight')) {
        return;
    }

    const analyticsContainer = document.getElementById('analytics-container');

    if (!analyticsContainer) {
        console.error('Analytics container could not be found.');
        return;
    }

    const insightSection = document.createElement('section');
    insightSection.id = 'ai-insight';
    insightSection.className = 'p-2';

    const button = document.createElement('button');
    button.id = 'ai-insight-button';
    button.type = 'button';
    button.textContent = 'Generate AI Insight';

    const response = document.createElement('p');
    response.id = 'ai-insight-response';
    response.textContent = 'AI insights will appear here.';

    insightSection.append(button, response);
    analyticsContainer.append(insightSection);
}

// Render the server's temporary dummy response. Later this will render insight cards.
export function renderInsightResponse(insightData) {
    const response = document.getElementById('ai-insight-response');

    if (!response) {
        return;
    }

    response.textContent = insightData.message || 'AI insight received.';
}
