import {
    addLocalDays,
    buildPeriodStats,
    formatLocalDate,
    getDateLabels,
    parseLocalDate
} from './analyticsCalculator.js';

function compareLocalDates(firstDate, secondDate) {
    return firstDate.getTime() - secondDate.getTime();
}

function createPeriod(startDate, endDate, options = {}) {
    return {
        startDate,
        endDate,
        sessions: options.sessions || [],
        isEqualLength: options.isEqualLength ?? true
    };
}

export function createDashboardPeriodPlan(startDate, endDate, today = new Date()) {
    const selectedStart = parseLocalDate(startDate);
    const selectedEnd = parseLocalDate(endDate);

    if (!selectedStart || !selectedEnd || selectedStart > selectedEnd) {
        throw new Error('A dashboard range requires valid start and end dates.');
    }

    const selectedDayCount = getDateLabels(startDate, endDate).length;
    const previousEnd = addLocalDays(selectedStart, -1);
    const previousStart = addLocalDays(previousEnd, -(selectedDayCount - 1));
    const todayStart = parseLocalDate(today);
    let present = null;

    if (todayStart && compareLocalDates(selectedEnd, todayStart) < 0) {
        const daysAfterSelectedPeriod = getDateLabels(
            formatLocalDate(addLocalDays(selectedEnd, 1)),
            formatLocalDate(todayStart)
        ).length;

        if (daysAfterSelectedPeriod >= selectedDayCount) {
            present = createPeriod(
                formatLocalDate(addLocalDays(todayStart, -(selectedDayCount - 1))),
                formatLocalDate(todayStart),
                { isEqualLength: true }
            );
        } else {
            present = createPeriod(
                formatLocalDate(addLocalDays(selectedEnd, 1)),
                formatLocalDate(todayStart),
                { isEqualLength: false }
            );
        }
    }

    return {
        selected: createPeriod(startDate, endDate),
        previous: createPeriod(
            formatLocalDate(previousStart),
            formatLocalDate(previousEnd)
        ),
        present
    };
}

function compareValue(from, to) {
    if (from === 0 && to === 0) {
        return {
            from,
            to,
            change: 0,
            percentageChange: null,
            state: 'unchanged'
        };
    }

    if (from === 0) {
        return {
            from,
            to,
            change: to,
            percentageChange: null,
            state: 'new'
        };
    }

    return {
        from,
        to,
        change: to - from,
        percentageChange: ((to - from) / from) * 100,
        state: 'available'
    };
}

function buildComparison(fromStats, toStats, mode) {
    const { summary: from } = fromStats;
    const { summary: to } = toStats;
    const metrics = {
        activeDayRate: compareValue(from.activeDayRate, to.activeDayRate),
        averageDailyFocusMinutes: compareValue(
            from.averageDailyFocusMinutes,
            to.averageDailyFocusMinutes
        ),
        averageSessionLengthMinutes: compareValue(
            from.averageSessionLengthMinutes,
            to.averageSessionLengthMinutes
        ),
        sessionsPerDay: compareValue(from.sessionsPerDay, to.sessionsPerDay)
    };

    if (mode === 'full') {
        Object.assign(metrics, {
            totalFocusMinutes: compareValue(
                from.totalFocusMinutes,
                to.totalFocusMinutes
            ),
            totalSessions: compareValue(from.totalSessions, to.totalSessions),
            activeDays: compareValue(from.activeDays, to.activeDays)
        });
    }

    return { mode, metrics };
}

function buildPeriodModel(period) {
    return {
        startDate: period.startDate,
        endDate: period.endDate,
        isEqualLength: period.isEqualLength,
        stats: buildPeriodStats(period)
    };
}

export function buildDashboardAnalytics(periods) {
    const selected = buildPeriodModel(periods.selected);
    const previous = buildPeriodModel(periods.previous);
    const present = periods.present
        ? buildPeriodModel(periods.present)
        : null;

    return {
        periods: {
            selected,
            previous,
            present
        },
        comparisons: {
            previousToSelected: buildComparison(
                previous.stats,
                selected.stats,
                'full'
            ),
            selectedToPresent: present
                ? buildComparison(
                    selected.stats,
                    present.stats,
                    present.isEqualLength ? 'full' : 'normalized'
                )
                : null
        }
    };
}
