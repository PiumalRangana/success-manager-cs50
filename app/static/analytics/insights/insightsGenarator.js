import { buildDashboardAnalytics } from '../dashboardPipeline.js';

function generateInsightObjects(dashboard) {
    const selected = dashboard.periods.selected.stats;
    const { summary, consistency } = selected;

    return {
        metrics: [
            {
                id: 'focus-time',
                value: summary.totalFocusMinutes,
                unit: 'minutes'
            },
            {
                id: 'active-days',
                value: summary.activeDays,
                total: selected.range.dayCount,
                unit: 'days'
            },
            {
                id: 'active-day-rate',
                value: summary.activeDayRate,
                unit: 'percent'
            },
            {
                id: 'average-daily-focus',
                value: summary.averageDailyFocusMinutes,
                unit: 'minutes'
            },
            {
                id: 'average-session-length',
                value: summary.averageSessionLengthMinutes,
                unit: 'minutes'
            }
        ],
        changes: dashboard.comparisons.previousToSelected,
        presentComparison: dashboard.comparisons.selectedToPresent,
        milestones: [
            {
                id: 'longest-working-streak',
                value: consistency.longestWorkingStreak,
                unit: 'days'
            },
            {
                id: 'longest-break-streak',
                value: consistency.longestBreakStreak,
                unit: 'days'
            }
        ]
    };
}

export function generateInsightsFromDashboard(dashboard) {
    if (!dashboard?.periods?.selected) {
        return null;
    }

    return generateInsightObjects(dashboard);
}

// Kept for callers that still pass the raw selected/previous/present periods.
export function generateInsights(periods) {
    return generateInsightsFromDashboard(buildDashboardAnalytics(periods));
}
