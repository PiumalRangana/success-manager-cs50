import { fetchSessionsForDateRange, fetchCalculatedAnalytics } from './analyticsService.js';
import { setAnalyticsSessions, setAnalyticsDateRange, setCalculatedAnalytics, getAnalyticsData } from './analyticsStore.js';
import { renderCalendarSelector } from './calendar-selector/calendar-selector.js';
import { renderDateRangeSelector } from './date-range-selector/dateRangeSelector.js';

export async function applyDateRange([startDate, endDate]) {
    setAnalyticsDateRange(startDate, endDate);
    try {
        const [sessions, calculatedAnalytics] = await Promise.all([
            fetchSessionsForDateRange(startDate, endDate),
            fetchCalculatedAnalytics([startDate, endDate])
        ]);

        setAnalyticsSessions(sessions);
        setCalculatedAnalytics(calculatedAnalytics);
    } catch (error) {
        console.error("Error applying date range:", error);
    }

    const analyticsData = getAnalyticsData();
    console.log("Sessions for selected date range:", analyticsData.sessions);
    console.log("Calculated analytics:", analyticsData.calculated);
}

async function initializeAnalytics() {

    renderDateRangeSelector();

    const modalContainer = document.querySelector('#calendar-selector-form-modal-container');
    const container = document.querySelector('#calendar-selector');

    renderCalendarSelector(container, modalContainer);

    const startDate = new Intl.DateTimeFormat('sv-SE').format(new Date());
    const endDate = new Intl.DateTimeFormat('sv-SE').format(new Date());

    await applyDateRange([startDate, endDate]);

    const analyticsData = getAnalyticsData();
    const totalFocusTimeValue = document.getElementById('total-focus-time-value');
    const averageDailyFocusValue = document.getElementById('average-daily-focus-value');
    const taskCompletedValue = document.getElementById('task-completed-value');
    const totalSessionsValue = document.getElementById('total-sessions-value');

    const calculated = analyticsData.calculated || {};

    totalFocusTimeValue.textContent = calculated.total_focus_time?.display || '0';
    averageDailyFocusValue.textContent = calculated.average_daily_focus?.display || '0';
    taskCompletedValue.textContent = calculated.taskCompleted || '0';
    totalSessionsValue.textContent = calculated.total_sessions || '0';

}

initializeAnalytics().catch((error) => {
    console.error("Error initializing analytics:", error);
});