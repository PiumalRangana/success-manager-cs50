import { renderTimeDistributionChart } from "./renderer.js";
import { getAnalyticsSessions } from "../analyticsStore.js";
import { groupByHour } from "./pipeline.js";
import { subscribeToAnalyticsSessionsChanges } from "../analyticsStore.js";


export function initializeTimeDistributionByHourChart() {

    const rowSessions = getAnalyticsSessions()
    const groupedByHourData = groupByHour(rowSessions)
    let chart = renderTimeDistributionChart(groupedByHourData)

    subscribeToAnalyticsSessionsChanges((newSessions) => {
            chart.destroy();
            const updatedGroupedByHourDataData = groupByHour(newSessions);
            chart = renderTimeDistributionChart(updatedGroupedByHourDataData);
        }
    );
}
