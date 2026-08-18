import { convertTimePerTaskData } from './pipeline.js';
import { renderTimePerTaskDonutChart } from './renderer.js';
import { subscribeToAnalyticsSessionsChanges } from '../analyticsStore.js';
import { getAnalyticsSessions } from '../analyticsStore.js';

export function initializeTimePerTaskDonutChart() {

    const rowSessions = getAnalyticsSessions();
    const convertedData = convertTimePerTaskData(rowSessions);

    let chart = renderTimePerTaskDonutChart(convertedData);

    subscribeToAnalyticsSessionsChanges((newSessions) => {
        chart.destroy();
        const updatedConvertedData = convertTimePerTaskData(newSessions);
        chart = renderTimePerTaskDonutChart(updatedConvertedData);
    });
}
