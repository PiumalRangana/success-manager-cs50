import { getAnalyticsDateRange } from "./analyticsStore.js"

export function getRelatedDate(taskStartTime, taskEndTime) {
  const { startDate, endDate } = getAnalyticsDateRange();

  const selectedStartDate = new Date(startDate).setHours(0,0,0,0);
  const selectedEndDate = new Date(endDate).setHours(23,59,59,999);

  const start = taskStartTime ? new Date(taskStartTime) : selectedStartDate;
  const end = taskEndTime ? new Date(taskEndTime) : new Date(Date.now());

  const relevantStartTime = new Date(Math.max(start.getTime(), selectedStartDate));

  const relevantEndTime = new Date(Math.min(end.getTime(), selectedEndDate));

  if (relevantStartTime > relevantEndTime) {
    return { relevantStartTime: null, relevantEndTime: null };
  }

  return {
    relevantStartTime,
    relevantEndTime
  };
}
// here we are trying return the start and end date cliped to selected start and end date