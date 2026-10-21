// Send analytics data to one AI-insight endpoint and return its parsed response.
async function postInsightRequest(url, payload) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const message = errorBody?.error || 'Unable to generate the AI focus report.';
        throw new Error(message);
    }

    return response.json();
}

// Generate an insight, or explicitly bypass the exact-payload cache on request.
export function getAiInsight(payload, generateNew = false) {
    const endpoint = generateNew
        ? '/api/ai-insight?new=true'
        : '/api/ai-insight';

    return postInsightRequest(endpoint, payload);
}

// Check whether the selected range already has a saved insight. This never calls Gemini.
export function getSavedAiInsightStatus(payload) {
    return postInsightRequest('/api/ai-insight/status', payload);
}
