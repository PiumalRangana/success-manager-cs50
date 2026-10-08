import { fetchSessionsForDateRange, fetchCalculatedAnalytics } from './analyticsService.js';
import {
    setAnalyticsSessions,
    setAnalyticsDateRange,
    setCalculatedAnalytics,
    setAnalyticsDashboard
} from './analyticsStore.js';
import {
    buildDashboardAnalytics,
    createDashboardPeriodPlan
} from './dashboardPipeline.js';
import { renderCalendarSelector } from './calendar-selector/calendar-selector.js';
import { renderDateRangeSelector } from './date-range-selector/dateRangeSelector.js';
import { initializeSmallInfoCards } from './small-info-cards/small-info-cards.js';
import { initializeTotalFocusBarChart } from './total-focuse-bar-chart/controler.js';
import { initializeTimePerTaskDonutChart } from './time-per-task/controler.js';
import { initializeTimeDistributionByHourChart } from './time-distribution-by-hour/controler.js';
import { initializeActivityConsistency } from './activity-consistency/controller.js';
import { initializeInsights } from './insights/insightsControler.js';

let activeDateRangeController = null;

export async function applyDateRange([startDate, endDate]) {
    if (activeDateRangeController) {
        activeDateRangeController.abort();
    }

    const controller = new AbortController();
    activeDateRangeController = controller;

    setAnalyticsDateRange(startDate, endDate);
    setAnalyticsDashboard(null);

    const periodPlan = createDashboardPeriodPlan(startDate, endDate);

    try {
        const selectedSessionsPromise = fetchSessionsForDateRange(startDate, endDate, {
            signal: controller.signal
        });
        const previousSessionsPromise = fetchSessionsForDateRange(
            periodPlan.previous.startDate,
            periodPlan.previous.endDate,
            { signal: controller.signal }
        );
        const presentSessionsPromise = periodPlan.present
            ? fetchSessionsForDateRange(
                periodPlan.present.startDate,
                periodPlan.present.endDate,
                { signal: controller.signal }
            )
            : Promise.resolve([]);
        const calculatedAnalyticsPromise = fetchCalculatedAnalytics([startDate, endDate], {
            signal: controller.signal
        });
        const [
            selectedSessions,
            previousSessions,
            presentSessions,
            calculatedAnalytics
        ] = await Promise.all([
            selectedSessionsPromise,
            previousSessionsPromise,
            presentSessionsPromise,
            calculatedAnalyticsPromise
        ]);

        if (controller.signal.aborted) {
            return;
        }

        const dashboard = buildDashboardAnalytics({
            selected: {
                ...periodPlan.selected,
                sessions: selectedSessions
            },
            previous: {
                ...periodPlan.previous,
                sessions: previousSessions
            },
            present: periodPlan.present
                ? {
                    ...periodPlan.present,
                    sessions: presentSessions
                }
                : null
        });
        // Existing chart/card modules continue to receive their current inputs
        // until they are migrated to the shared dashboard model.
        setAnalyticsSessions(selectedSessions);
        setCalculatedAnalytics(calculatedAnalytics);
        setAnalyticsDashboard(dashboard);
    } catch (error) {
        if (error.name === 'AbortError') {
            return;
        }

        console.error('Error applying date range:', error);
    } finally {
        if (activeDateRangeController === controller) {
            activeDateRangeController = null;
        }
    }
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
    initializeTimeDistributionByHourChart();
    initializeActivityConsistency();

    await initializeInsights({ renderCurrent: false });
    await applyDateRange([startDate, endDate]);
}

initializeAnalytics().catch((error) => {
    console.error('Error initializing analytics:', error);
});
