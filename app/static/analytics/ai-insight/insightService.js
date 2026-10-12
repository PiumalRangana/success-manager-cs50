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
        throw new Error(`AI insight request failed with status ${response.status}.`);
    }

    return response.json();
}
