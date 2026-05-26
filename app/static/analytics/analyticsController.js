import { fetchSessionsForDateRange } from './analyticsService.js';
import { setAnalyticsSessions, setAnalyticsDateRange, getAnalyticsData } from './analyticsStore.js';

export async function applyDateRange([startDate, endDate]) {
    setAnalyticsDateRange(startDate, endDate);
    try {
        const sessions = await fetchSessionsForDateRange(startDate, endDate);
        setAnalyticsSessions(sessions);
    } catch (error) {
        console.error("Error applying date range:", error);
    }
    const sessions = getAnalyticsData().sessions;
    console.log("Sessions for selected date range:", sessions);
}
