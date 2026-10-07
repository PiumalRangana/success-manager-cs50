const MINUTE_IN_MS = 60 * 1000;

export function parseLocalDate(dateLabel) {
    if (dateLabel instanceof Date) {
        return new Date(
            dateLabel.getFullYear(),
            dateLabel.getMonth(),
            dateLabel.getDate()
        );
    }

    if (typeof dateLabel !== 'string') {
        return null;
    }

    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateLabel);

    if (!match) {
        return null;
    }

    const [, year, month, day] = match.map(Number);
    const date = new Date(year, month - 1, day);

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }

    return date;
}

export function formatLocalDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function addLocalDays(date, numberOfDays) {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + numberOfDays);
    return nextDate;
}

function getNextLocalMidnight(date) {
    const nextMidnight = new Date(date);
    nextMidnight.setHours(0, 0, 0, 0);
    nextMidnight.setDate(nextMidnight.getDate() + 1);
    return nextMidnight;
}

export function getDateLabels(startDate, endDate) {
    const start = parseLocalDate(startDate);
    const end = parseLocalDate(endDate);

    if (!start || !end || start > end) {
        return [];
    }

    const labels = [];
    let currentDate = new Date(start);

    while (currentDate <= end) {
        labels.push(formatLocalDate(currentDate));
        currentDate = addLocalDays(currentDate, 1);
    }

    return labels;
}

function createSessionBoundary(session, rangeStart, rangeEndExclusive) {
    const sessionStart = new Date(session.start_time);
    const sessionEnd = session.end_time
        ? new Date(session.end_time)
        : new Date();

    if (
        Number.isNaN(sessionStart.getTime()) ||
        Number.isNaN(sessionEnd.getTime())
    ) {
        return null;
    }

    const start = new Date(Math.max(sessionStart.getTime(), rangeStart.getTime()));
    const end = new Date(Math.min(sessionEnd.getTime(), rangeEndExclusive.getTime()));

    if (end <= start) {
        return null;
    }

    return { start, end };
}

function buildSessionLengthDistribution(lengths) {
    const buckets = [
        { id: 'under-15', label: '0-14 min', min: 0, max: 15 },
        { id: '15-to-29', label: '15-29 min', min: 15, max: 30 },
        { id: '30-to-59', label: '30-59 min', min: 30, max: 60 },
        { id: '60-to-89', label: '60-89 min', min: 60, max: 90 },
        { id: '90-plus', label: '90+ min', min: 90, max: Infinity }
    ].map(bucket => ({ ...bucket, count: 0, percentage: 0 }));

    for (const length of lengths) {
        const bucket = buckets.find(item => length >= item.min && length < item.max);

        if (bucket) {
            bucket.count += 1;
        }
    }

    const totalSessions = lengths.length;

    return buckets.map(bucket => ({
        ...bucket,
        percentage: totalSessions === 0
            ? 0
            : (bucket.count / totalSessions) * 100
    }));
}

function getStreaks(dailyActivity) {
    const workingStreaks = [];
    const breakStreaks = [];
    let streakLength = 0;
    let isWorkingStreak = null;

    for (const day of dailyActivity) {
        if (isWorkingStreak === null || day.active === isWorkingStreak) {
            streakLength += 1;
            isWorkingStreak = day.active;
            continue;
        }

        if (isWorkingStreak) {
            workingStreaks.push(streakLength);
        } else {
            breakStreaks.push(streakLength);
        }

        streakLength = 1;
        isWorkingStreak = day.active;
    }

    if (streakLength > 0) {
        if (isWorkingStreak) {
            workingStreaks.push(streakLength);
        } else {
            breakStreaks.push(streakLength);
        }
    }

    return {
        workingStreaks,
        breakStreaks,
        longestWorkingStreak: Math.max(0, ...workingStreaks),
        longestBreakStreak: Math.max(0, ...breakStreaks)
    };
}

function getTaskKey(session) {
    if (session.task_id !== undefined && session.task_id !== null) {
        return `task-${session.task_id}`;
    }

    return `name-${session.name || 'Unassigned'}`;
}

export function buildPeriodStats(period) {
    const start = parseLocalDate(period?.startDate);
    const end = parseLocalDate(period?.endDate);

    if (!start || !end || start > end) {
        throw new Error('A period requires a valid inclusive startDate and endDate.');
    }

    const dateLabels = getDateLabels(period.startDate, period.endDate);
    const rangeEndExclusive = getNextLocalMidnight(end);
    const dailyActivity = dateLabels.map(date => ({
        date,
        minutes: 0,
        sessions: 0,
        active: false
    }));
    const activityByDate = new Map(dailyActivity.map(day => [day.date, day]));
    const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        label: `${String(hour).padStart(2, '0')}:00`,
        minutes: 0
    }));
    const taskTotals = new Map();
    const sessionLengths = [];
    let totalFocusMinutes = 0;
    let totalSessions = 0;

    for (const session of period.sessions || []) {
        const boundary = createSessionBoundary(session, start, rangeEndExclusive);

        if (!boundary) {
            continue;
        }

        const sessionMinutes = (boundary.end - boundary.start) / MINUTE_IN_MS;

        totalFocusMinutes += sessionMinutes;
        totalSessions += 1;
        sessionLengths.push(sessionMinutes);

        const taskKey = getTaskKey(session);
        const task = taskTotals.get(taskKey) || {
            taskId: session.task_id ?? null,
            name: session.name || 'Unassigned',
            color: session.color || null,
            minutes: 0
        };

        task.minutes += sessionMinutes;
        taskTotals.set(taskKey, task);

        let dayCursor = new Date(boundary.start);

        while (dayCursor < boundary.end) {
            const dayEnd = getNextLocalMidnight(dayCursor);
            const partEnd = dayEnd < boundary.end ? dayEnd : boundary.end;
            const minutes = (partEnd - dayCursor) / MINUTE_IN_MS;
            const day = activityByDate.get(formatLocalDate(dayCursor));

            if (day) {
                day.minutes += minutes;
                day.sessions += 1;
                day.active = true;
            }

            let hourCursor = new Date(dayCursor);

            while (hourCursor < partEnd) {
                const nextHour = new Date(hourCursor);
                nextHour.setMinutes(0, 0, 0);
                nextHour.setHours(nextHour.getHours() + 1);

                const hourEnd = nextHour < partEnd ? nextHour : partEnd;
                const hourMinutes = (hourEnd - hourCursor) / MINUTE_IN_MS;

                hourlyDistribution[hourCursor.getHours()].minutes += hourMinutes;
                hourCursor = hourEnd;
            }

            dayCursor = partEnd;
        }
    }

    const activeDays = dailyActivity.filter(day => day.active).length;
    const dayCount = dateLabels.length;
    const taskBreakdown = Array.from(taskTotals.values())
        .map(task => ({
            ...task,
            percentage: totalFocusMinutes === 0
                ? 0
                : (task.minutes / totalFocusMinutes) * 100
        }))
        .sort((first, second) => second.minutes - first.minutes);
    const attendance = Object.fromEntries(
        dailyActivity.map(day => [day.date, day.active])
    );
    const streaks = getStreaks(dailyActivity);

    return {
        range: {
            startDate: period.startDate,
            endDate: period.endDate,
            dayCount
        },
        summary: {
            totalFocusMinutes,
            totalSessions,
            activeDays,
            activeDayRate: dayCount === 0 ? 0 : (activeDays / dayCount) * 100,
            averageDailyFocusMinutes: dayCount === 0 ? 0 : totalFocusMinutes / dayCount,
            averageSessionLengthMinutes: totalSessions === 0
                ? 0
                : totalFocusMinutes / totalSessions,
            sessionsPerDay: dayCount === 0 ? 0 : totalSessions / dayCount
        },
        consistency: {
            attendance,
            ...streaks
        },
        dailyActivity,
        taskBreakdown,
        hourlyDistribution,
        sessionLengths,
        sessionLengthDistribution: buildSessionLengthDistribution(sessionLengths)
    };
}
