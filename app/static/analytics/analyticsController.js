import { fetchSessionsForDateRange } from './analyticsService.js';
import { setAnalyticsSessions, setAnalyticsDateRange, getAnalyticsData } from './analyticsStore.js';
import { renderCalendarSelector } from './calendar-selector/calendar-selector.js';
import { renderDateRangeSelector } from './date-range-selector/dateRangeSelector.js';

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

function initializeAnalytics() {

    renderDateRangeSelector();

    const modalContainer = document.querySelector('#calendar-selector-form-modal-container');
    const container = document.querySelector('#calendar-selector');
    
    renderCalendarSelector(container, modalContainer);

    const startDate = new Intl.DateTimeFormat('sv-SE').format(new Date());
    const endDate = new Intl.DateTimeFormat('sv-SE').format(new Date());

    applyDateRange([startDate, endDate]);
}

initializeAnalytics();