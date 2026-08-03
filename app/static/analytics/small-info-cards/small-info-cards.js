import { getAnalyticsData, subscribeToAnalyticsChanges } from '../analyticsStore.js';

export function initializeSmallInfoCards() {
    //  Query DOM elements
    const totalFocusTimeValue = document.getElementById('total-focus-time-value');
    const averageDailyFocusValue = document.getElementById('average-daily-focus-value');
    const taskCompletedValue = document.getElementById('task-completed-value');
    const totalSessionsValue = document.getElementById('total-sessions-value');

    // apply state to existing DOM elements
    const updateUI = () => {
        const analyticsData = getAnalyticsData();
        const calculated = analyticsData.calculated || {};

        totalFocusTimeValue.textContent = calculated.total_focus_time?.display || '0';
        averageDailyFocusValue.textContent = calculated.average_daily_focus?.display || '0';
        taskCompletedValue.textContent = '0';
        totalSessionsValue.textContent = calculated.total_sessions || '0';
    };

    // Initial render
    updateUI();

    // Update on state changes
    subscribeToAnalyticsChanges(updateUI);
}