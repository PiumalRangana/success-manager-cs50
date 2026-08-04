export function fetchSessionsForDateRange(startDate, endDate, options = {}) {
    return fetch(`/api/analytics/sessions?start_date=${startDate}&end_date=${endDate}`, options)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            if (error.name === 'AbortError') {
                throw error;
            }

            console.error("Error fetching sessions:", error);
            return [];
        });
}

export function fetchCalculatedAnalytics([startDate, endDate], options = {}) {
    return fetch(`/api/analytics/calculated?start_date=${startDate}&end_date=${endDate}`, options)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            if (error.name === 'AbortError') {
                throw error;
            }

            console.error("Error fetching calculated analytics:", error);
            return {};
        });
}
