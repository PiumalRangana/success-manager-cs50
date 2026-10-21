// Transform the shared dashboard into the smaller, AI-specific request payload.
// This module reads dashboard data but never changes it.

const MAX_DAILY_ACTIVITY_DAYS = 90;
const MAX_TASKS = 8;

function round(value) {
    return Math.round(value * 100) / 100;
}

function formatRange(range) {
    return {
        startDate: range.startDate,
        endDate: range.endDate,
        dayCount: range.dayCount
    };
}

function buildActivityPattern(dailyActivity, dayCount) {
    if (dayCount <= MAX_DAILY_ACTIVITY_DAYS) {
        return {
            granularity: 'daily',
            entries: dailyActivity.map(day => ({
                date: day.date,
                focusMinutes: round(day.minutes),
                sessions: day.sessions,
                active: day.active
            }))
        };
    }

    const entries = [];

    for (let index = 0; index < dailyActivity.length; index += 7) {
        const days = dailyActivity.slice(index, index + 7);

        entries.push({
            startDate: days[0].date,
            endDate: days[days.length - 1].date,
            focusMinutes: round(days.reduce((total, day) => total + day.minutes, 0)),
            sessions: days.reduce((total, day) => total + day.sessions, 0),
            activeDays: days.filter(day => day.active).length
        });
    }

    return {
        granularity: 'weekly',
        entries
    };
}

function buildSummary(summary) {
    return {
        totalFocusMinutes: round(summary.totalFocusMinutes),
        totalSessions: summary.totalSessions,
        activeDays: summary.activeDays,
        activeDayRate: round(summary.activeDayRate),
        averageDailyFocusMinutes: round(summary.averageDailyFocusMinutes),
        averageSessionLengthMinutes: round(summary.averageSessionLengthMinutes),
        sessionsPerDay: round(summary.sessionsPerDay)
    };
}

function buildPeriod(period) {
    if (!period) {
        return null;
    }

    return {
        range: formatRange(period.stats.range),
        isEqualLength: period.isEqualLength,
        summary: buildSummary(period.stats.summary)
    };
}

function buildComparison(fromPeriod, toPeriod, comparison) {
    if (!comparison) {
        return null;
    }

    return {
        fromPeriod,
        toPeriod,
        mode: comparison.mode,
        metrics: comparison.metrics
    };
}

function buildTaskPattern(taskBreakdown) {
    const tasks = taskBreakdown.slice(0, MAX_TASKS).map(task => ({
        name: task.name,
        focusMinutes: round(task.minutes),
        percentageOfFocusTime: round(task.percentage)
    }));

    return {
        tasks,
        omittedTaskCount: Math.max(0, taskBreakdown.length - tasks.length)
    };
}

export function createInsightPayload(dashboardData) {
    const selected = dashboardData?.periods?.selected;

    if (!selected) {
        return null;
    }

    const { stats } = selected;
    const { consistency } = stats;
    const periods = {
        previous: buildPeriod(dashboardData.periods.previous),
        selected: buildPeriod(selected),
        present: buildPeriod(dashboardData.periods.present)
    };

    // This is the full first-version input contract. It supports a concise,
    // data-grounded report across three labeled periods without exposing raw sessions.
    return {
        periods,
        comparisons: {
            previousToSelected: buildComparison(
                'previous',
                'selected',
                dashboardData.comparisons.previousToSelected
            ),
            selectedToPresent: buildComparison(
                'selected',
                'present',
                dashboardData.comparisons.selectedToPresent
            )
        },
        consistency: {
            longestWorkingStreak: consistency.longestWorkingStreak,
            longestBreakStreak: consistency.longestBreakStreak
        },
        patterns: {
            activity: buildActivityPattern(stats.dailyActivity, stats.range.dayCount),
            hourlyFocus: stats.hourlyDistribution.map(hour => ({
                hour: hour.hour,
                focusMinutes: round(hour.minutes)
            })),
            sessionLengths: stats.sessionLengthDistribution.map(bucket => ({
                label: bucket.label,
                sessionCount: bucket.count,
                percentage: round(bucket.percentage)
            })),
            tasks: buildTaskPattern(stats.taskBreakdown)
        }
    };
}
