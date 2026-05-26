export function fetchSessionsForDateRange(startDate, endDate) {
    return fetch(`/api/analytics/sessions?start_date=${startDate}&end_date=${endDate}`)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error("Error fetching sessions:", error);
            return [];
        });
}