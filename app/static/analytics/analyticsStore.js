let analyticsData = {
    startDate: null,
    endDate: null,
    sessions: []
};

export function setAnalyticsDateRange(startDate, endDate) {
    analyticsData.startDate = startDate;
    analyticsData.endDate = endDate;
}

export function setAnalyticsSessions(sessions) {
    analyticsData.sessions = sessions;
}
export function getAnalyticsData() {
    return analyticsData;
}

export function getAnalyticsDateRange() {
    return {
        startDate: analyticsData.startDate,
        endDate: analyticsData.endDate
     };
}