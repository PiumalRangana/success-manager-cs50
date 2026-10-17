// Send the payload to our Flask server and return its parsed JSON response.
export async function getAiInsight(payload) {
    console.log("sending the payload to the server");

    const response = await fetch('/api/ai-insight', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const message = errorBody?.error || 'Unable to generate AI insights.';
        throw new Error(message);
    }

    return response.json();
}
