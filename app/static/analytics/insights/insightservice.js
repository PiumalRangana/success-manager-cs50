import { fetchSessionsForDateRange } from "../analyticsService.js"
import { getAnalyticsDateRange, getAnalyticsSessions } from "../analyticsStore.js"

export function getSessionsForDateRange(startDate, endDate, options = {}) {
    const formatedStartDate = new Intl.DateTimeFormat('sv-SE').format(startDate)
    const formatedEndDate = new Intl.DateTimeFormat('sv-SE').format(endDate)

    return fetchSessionsForDateRange(formatedStartDate, formatedEndDate, options)
}

export function getSelectedPeriodsAndSessions() {
    const { startDate, endDate } = getAnalyticsDateRange()
    console.log("Selected date range:", startDate, endDate);

    if (!startDate || !endDate) {
        console.log("No date range selected.");
        return;
    }
    const selectedSessions = getAnalyticsSessions()

    return {
        startDate,
        endDate,
        sessions: selectedSessions
    }
}
