import { fetchSessionsForDateRange, fetchCalculatedAnalytics } from './analyticsService.js';
import { setAnalyticsSessions, setAnalyticsDateRange, setCalculatedAnalytics, getAnalyticsData } from './analyticsStore.js';
import { renderCalendarSelector } from './calendar-selector/calendar-selector.js';
import { renderDateRangeSelector } from './date-range-selector/dateRangeSelector.js';
import { initializeSmallInfoCards } from './small-info-cards/small-info-cards.js';
import {initializeTotalFocusBarChart} from './total-focuse-bar-chart/controler.js';
import { initializeTimePerTaskDonutChart } from './time-per-task/controler.js';

let activeDateRangeController = null;

export async function applyDateRange([startDate, endDate]) {
    if (activeDateRangeController) {
        activeDateRangeController.abort();
    }

    const controller = new AbortController();
    activeDateRangeController = controller;

    setAnalyticsDateRange(startDate, endDate);
    try {
        const [sessions, calculatedAnalytics] = await Promise.all([
            fetchSessionsForDateRange(startDate, endDate, {
                signal: controller.signal
            }),
            fetchCalculatedAnalytics([startDate, endDate], {
                signal: controller.signal
            })
        ]);

        if (controller.signal.aborted) {
            return;
        }

        setAnalyticsSessions(sessions);
        setCalculatedAnalytics(calculatedAnalytics);
    } catch (error) {
        if (error.name === 'AbortError') {
            return;
        }

        console.error("Error applying date range:", error);
    } finally {
        if (activeDateRangeController === controller) {
            activeDateRangeController = null;
        }
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

    initializeSmallInfoCards();
    initializeTotalFocusBarChart();
    initializeTimePerTaskDonutChart();
    await applyDateRange([startDate, endDate]);
}

initializeAnalytics().catch((error) => {
    console.error("Error initializing analytics:", error);
});
