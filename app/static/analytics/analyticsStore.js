let analyticsData = {
    startDate: null,
    endDate: null,
    sessions: []
};

let dateListeners = [];
let sessionListners = [];

export function setAnalyticsDateRange(startDate, endDate) {
    analyticsData.startDate = startDate;
    analyticsData.endDate = endDate;
    notifyDateChanges()
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

export function subscribeToDateChanges(fn) {
  dateListeners.push(fn);

  return () => {
    dateListeners = dateListeners.filter(l => l !== fn);
  };
}

function notifyDateChanges() {
  dateListeners.forEach(fn => fn(analyticsData.startDate,analyticsData.endDate));
}

// make two subscribe paths to date listners and session listeners