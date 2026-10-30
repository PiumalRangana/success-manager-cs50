// AI assistance disclosure: ChatGPT, OpenAI Codex, Google Gemini, and GitHub
// Copilot were used throughout this project as learning and collaboration tools.
// See the project-wide disclosure in run.py.

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
import { initializeSessionLengthDistribution } from './session-length-distribution/controler.js';
import { initializePeriodComparison } from './period-comparison/controler.js';
import { initializeAiInsightFeature } from './ai-insight/insightController.js';
let activeDateRangeController = null;
let failedDateRange = null;

function hideAnalyticsError() {
    const feedback = document.getElementById('analytics-feedback');

    if (feedback) {
        feedback.hidden = true;
    }
}

function showAnalyticsError(message, canRetry = true) {
    const feedback = document.getElementById('analytics-feedback');
    const messageElement = document.getElementById('analytics-feedback-message');
    const retryButton = document.getElementById('analytics-retry-button');

    if (!feedback || !messageElement) {
        return;
    }

    messageElement.textContent = message;
    if (retryButton) {
        retryButton.hidden = !canRetry;
    }
    feedback.hidden = false;
}

function hideAnalyticsEmptyState() {
    const emptyState = document.getElementById('analytics-empty-state');

    if (emptyState) {
        emptyState.hidden = true;
    }
}

function showAnalyticsEmptyState() {
    const emptyState = document.getElementById('analytics-empty-state');

    if (emptyState) {
        emptyState.hidden = false;
    }
}

function initializeAnalyticsErrorFeedback() {
    const retryButton = document.getElementById('analytics-retry-button');

    if (!retryButton) {
        return;
    }

    retryButton.addEventListener('click', () => {
        if (failedDateRange) {
            applyDateRange(failedDateRange);
        }
    });
}

function analyticsVisualizationLibrariesAreAvailable() {
    // CDN failures leave these globals undefined; checking once prevents each
    // chart module from failing separately and leaving a blank dashboard.
    return typeof window.flatpickr === 'function'
        && typeof window.Chart === 'function'
        && typeof window.ChartDataLabels !== 'undefined';
}

export async function applyDateRange([startDate, endDate]) {
    // A fast range change can leave an older request in flight. Abort it so a
    // late response cannot overwrite the newer dashboard data.
    if (activeDateRangeController) {
        activeDateRangeController.abort();
    }

    const controller = new AbortController();
    activeDateRangeController = controller;

    setAnalyticsDateRange(startDate, endDate);
    setAnalyticsDashboard(null);
    failedDateRange = null;
    hideAnalyticsError();
    hideAnalyticsEmptyState();

    try {
        const periodPlan = createDashboardPeriodPlan(startDate, endDate);
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
        setAnalyticsSessions(selectedSessions);
        setCalculatedAnalytics(calculatedAnalytics);
        setAnalyticsDashboard(dashboard);

        if (dashboard.periods.selected.stats.summary.totalSessions === 0) {
            showAnalyticsEmptyState();
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            return;
        }

        console.error('Error applying date range:', error);
        failedDateRange = [startDate, endDate];
        showAnalyticsError(error.message || 'Unable to load analytics. Please try again.');
    } finally {
        if (activeDateRangeController === controller) {
            activeDateRangeController = null;
        }
    }
}

async function initializeAnalytics() {
    initializeAnalyticsErrorFeedback();

    if (!analyticsVisualizationLibrariesAreAvailable()) {
        showAnalyticsError('Visualizations are unavailable. Refresh and try again.', false);
        return;
    }

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
    initializeSessionLengthDistribution();
    initializePeriodComparison();
    initializeAiInsightFeature();

    await applyDateRange([startDate, endDate]);
}

initializeAnalytics().catch((error) => {
    console.error('Error initializing analytics:', error);
    showAnalyticsError('Visualizations are unavailable. Refresh and try again.', false);
});
