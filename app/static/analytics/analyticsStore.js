let analyticsData = {
    startDate: null,
    endDate: null,
    sessions: [],
    calculated: null
};

let analyticsSessionListeners = [];
let analyticsDataListeners = [];
let dateListeners = [];

// Set functions for analytics data

export function setAnalyticsDateRange(startDate, endDate) {
    analyticsData.startDate = startDate;
    analyticsData.endDate = endDate;
    notifyDateChanges()
}

export function setAnalyticsSessions(sessions) {
    analyticsData.sessions = sessions;
    notifySessionChanges();
}

export function setCalculatedAnalytics(calculatedAnalytics) {
    analyticsData.calculated = calculatedAnalytics;
    notifyAnalyticsChanges();
}

// Get functions for analytics data

export function getAnalyticsData() {
    return analyticsData;
}

export function getAnalyticsDateRange() {
    return {
        startDate: analyticsData.startDate,
        endDate: analyticsData.endDate
     };
}

export function getAnalyticsSessions() {
    return analyticsData.sessions;
}

// subscribe functions for analytics data

export function subscribeToDateChanges(fn) {
  dateListeners.push(fn);

  return () => {
    dateListeners = dateListeners.filter(l => l !== fn);
  };
}

export function subscribeToAnalyticsChanges(fn) {
  analyticsDataListeners.push(fn);

  return () => {
    analyticsDataListeners = analyticsDataListeners.filter(l => l !== fn);
  };
}

export function subscribeToAnalyticsSessionsChanges(fn) {
  analyticsSessionListeners.push(fn);

  return () => {
    analyticsSessionListeners = analyticsSessionListeners.filter(l => l !== fn);
  };
}

// notify functions for analytics data

function notifyDateChanges() {
  dateListeners.forEach(fn => fn(analyticsData.startDate,analyticsData.endDate));
}

function notifyAnalyticsChanges() {
  analyticsDataListeners.forEach(fn => fn(analyticsData.calculated));
}

function notifySessionChanges() {
  analyticsSessionListeners.forEach(fn => fn(analyticsData.sessions));
}