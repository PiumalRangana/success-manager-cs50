function buildAnalyticsUrl(endpoint, startDate, endDate) {
    const parameters = new URLSearchParams({
        start_date: startDate,
        end_date: endDate
    });

    return `${endpoint}?${parameters}`;
}

async function fetchAnalyticsJson(url, isExpectedData, options = {}) {
    let response;

    try {
        response = await fetch(url, options);
    } catch (error) {
        if (error.name === 'AbortError') {
            throw error;
        }

        throw new Error('Unable to load analytics. Check your connection and try again.');
    }

    if (response.redirected && response.url.includes('/login')) {
        throw new Error('Your session has expired. Please sign in again.');
    }

    let data;

    try {
        data = await response.json();
    } catch (error) {
        if (error.name === 'AbortError') {
            throw error;
        }

        throw new Error('Analytics returned an unreadable response. Please try again.');
    }

    if (!response.ok) {
        throw new Error(data?.error || 'Unable to load analytics. Please try again.');
    }

    if (!isExpectedData(data)) {
        throw new Error('Analytics returned unexpected data. Please try again.');
    }

    return data;
}

export function fetchSessionsForDateRange(startDate, endDate, options = {}) {
    return fetchAnalyticsJson(
        buildAnalyticsUrl('/api/analytics/sessions', startDate, endDate),
        Array.isArray,
        options
    );
}

export function fetchCalculatedAnalytics([startDate, endDate], options = {}) {
    return fetchAnalyticsJson(
        buildAnalyticsUrl('/api/analytics/calculated', startDate, endDate),
        data => typeof data === 'object' && data !== null && !Array.isArray(data),
        options
    );
}
