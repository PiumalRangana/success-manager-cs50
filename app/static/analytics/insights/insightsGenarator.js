// ============================================================
// INSIGHT GENERATOR
// ============================================================
//
// Flow:
//
// periodsAndSessions
//        ↓
// Period calculations
//        ↓
// Period statistics
//        ↓
// Comparisons
//        ↓
// Insight generation
//
// ============================================================


// ============================================================
// 1. FOCUS TIME CALCULATIONS
// ============================================================

function getTotalFocusTimeOfASession(session) {
    const endTime = session.end_time
        ? new Date(session.end_time)
        : Date.now();

    const startTime = new Date(session.start_time);
    return Math.round(
        (endTime - startTime) / (1000 * 60)
    );
}


function getTotalFocusTimeForPeriod(sessions) {
    let totalFocusTimeOfThePeriod = 0;

    for (const session of Object.values(sessions)) {
        const focusTimeOfTheSession =
            getTotalFocusTimeOfASession(session);

        totalFocusTimeOfThePeriod += focusTimeOfTheSession;
    }

    return totalFocusTimeOfThePeriod;
}


// This is the public calculation for the Focus Time category.
function calculateFocusTime(sessions) {
    const total = getTotalFocusTimeForPeriod(sessions);

    return {
        total
    };
}


// ============================================================
// 2. CONSISTENCY CALCULATIONS
// ============================================================

function getDaysWithin2Dates(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const dates = [];
    let currentDate = new Date(start.getTime());

    while (currentDate <= end) {
        dates.push(new Date(currentDate));

        currentDate.setDate(
            currentDate.getDate() + 1
        );
    }

    return dates;
}


function getShowedUpDays(dates, sessions) {
    const attendanceObject = {};

    const sortedDates = [...dates].sort(
        (a, b) => new Date(a) - new Date(b)
    );

    for (const date of sortedDates) {
        attendanceObject[date] = false;
    }

    const sessionArray = Object.values(sessions);

    for (const session of sessionArray) {
        const sessionStart = new Date(session.start_time);

        const sessionEnd = session.end_time
            ? new Date(session.end_time)
            : new Date();

        let currentDate = new Date(sessionStart);

        while (currentDate <= sessionEnd) {

            currentDate.setHours(0, 0, 0, 0);

            if (attendanceObject.hasOwnProperty(currentDate)) {
                attendanceObject[currentDate] = true;
            }

            currentDate.setDate(
                currentDate.getDate() + 1
            );
        }
    }
    return attendanceObject;
}


function getStreaks(attendanceObject) {
    const dates = Object.keys(attendanceObject).sort(
        (a, b) => new Date(a) - new Date(b)
    );

    const workingStreaks = [];
    const breakStreaks = [];

    let currentStreak = 0;
    let currentStreakType = null;

    for (const date of dates) {
        const isPresent = attendanceObject[date];

        const streakType = isPresent
            ? 'working'
            : 'break';

        if (currentStreakType === null) {

            // Initialize the first streak.
            currentStreakType = streakType;
            currentStreak = 1;

        } else if (currentStreakType === streakType) {

            // Continue the current streak.
            currentStreak++;

        } else {

            // The streak type changed.
            if (currentStreakType === 'working') {
                workingStreaks.push(currentStreak);
            } else {
                breakStreaks.push(currentStreak);
            }

            currentStreak = 1;
            currentStreakType = streakType;
        }
    }

    // Add the final streak.
    if (currentStreak > 0) {

        if (currentStreakType === 'working') {
            workingStreaks.push(currentStreak);

        } else if (currentStreakType === 'break') {
            breakStreaks.push(currentStreak);
        }
    }

    return {
        workingStreaks,
        breakStreaks
    };
}


// This is the public calculation for the Consistency category.
function calculateConsistency(period) {

    const dates = getDaysWithin2Dates(
        period.startDate,
        period.endDate
    );

    const attendance = getShowedUpDays(
        dates,
        period.sessions
    );

    const totalDays = Object.keys(attendance).length;

    const activeDays = Object.values(attendance)
        .filter(value => value === true)
        .length;

    const activePercentage =
        (activeDays / totalDays) * 100;

    const {
        workingStreaks,
        breakStreaks
    } = getStreaks(attendance);

    return {
        attendance,
        totalDays,
        activeDays,
        activePercentage,
        workingStreaks,
        breakStreaks
    };
}


// ============================================================
// 3. SESSION LENGTH CALCULATIONS
// ============================================================

function getSessionLengths(sessions) {
    const sessionLengths = [];

    for (const session of Object.values(sessions)) {

        const sessionLengthInMinutes =
            getTotalFocusTimeOfASession(session);

        sessionLengths.push(
            sessionLengthInMinutes
        );
    }
    return sessionLengths;
}


// This is the public calculation for the Session Length category.
function calculateSessionLength(sessions) {

    const lengths = getSessionLengths(sessions);

    const longest =
        lengths.length > 0
            ? Math.max(...lengths)
            : 0;

    return {
        lengths,
        longest,
        count: lengths.length
    };
}


// ============================================================
// 4. AVERAGE CALCULATIONS
// ============================================================

// Average focus time per active day.
function calculateAverageDailyFocus(
    totalFocusTime,
    totalDays
) {

    if (totalDays === 0) {
        return 0;
    }

    return totalFocusTime / totalDays;
}


// Average length of a session.
function calculateAverageSessionLength(
    totalSessionTime,
    sessionCount
) {

    if (sessionCount === 0) {
        return 0;
    }

    return totalSessionTime / sessionCount;
}


// ============================================================
// 5. PERIOD STATISTICS
// ============================================================
//
// This function takes ONE period:
//
// {
//     startDate,
//     endDate,
//     sessions
// }
//
// and turns it into calculated statistics.
//
// ============================================================

function calculatePeriodStats(period) {

    const focusTime =
        calculateFocusTime(period.sessions);

    const consistency =
        calculateConsistency(period);

    const sessionLength =
        calculateSessionLength(period.sessions);


    const averageDailyFocus =
        calculateAverageDailyFocus(
            focusTime.total,
            consistency.totalDays
        );


    const averageSessionLength =
        calculateAverageSessionLength(
            focusTime.total,
            sessionLength.count
        );


    return {

        focusTime,

        consistency,

        sessionLength,

        averages: {
            dailyFocus: averageDailyFocus,
            sessionLength: averageSessionLength
        }

    };
}


// ============================================================
// 6. CALCULATE ALL PERIOD STATISTICS
// ============================================================
//
// This converts:
//
// periodsAndSessions
//
// into:
//
// {
//     selected: {...},
//     previous: {...},
//     present: {...}
// }
//
// ============================================================

function calculateAllPeriodStats(periodsDataObject) {

    const selected =
        calculatePeriodStats(
            periodsDataObject.selected
        );


    const previous =
        calculatePeriodStats(
            periodsDataObject.previous
        );


    let present = null;

    const hasPresentPeriod =
        periodsDataObject.present.startDate !== null;


    if (hasPresentPeriod) {

        present =
            calculatePeriodStats(
                periodsDataObject.present
            );
    }

    return {
        selected,
        previous,
        present
    };
}


// ============================================================
// 7. COMPARISON LAYER
// ============================================================
//
// This is intentionally empty for now.
//
// The next step will compare:
//
// previous → selected
//
// and, where appropriate:
//
// selected → present
//
// ============================================================

function comparePeriods(periodStats) {

    const compareValues = (from, to) => ({
        from,
        to,
        change: to - from,
        percentageChange: from === 0
            ? null
            : ((to - from) / from) * 100
    });

    const compareStats = (from, to) => ({
        focusTime: {
            total: compareValues(
                from.focusTime.total,
                to.focusTime.total
            )
        },
        consistency: {
            activeDays: compareValues(
                from.consistency.activeDays,
                to.consistency.activeDays
            ),
            activePercentage: compareValues(
                from.consistency.activePercentage,
                to.consistency.activePercentage
            )
        },
        sessionLength: {
            longest: compareValues(
                from.sessionLength.longest,
                to.sessionLength.longest
            ),
            count: compareValues(
                from.sessionLength.count,
                to.sessionLength.count
            )
        },
        averages: {
            dailyFocus: compareValues(
                from.averages.dailyFocus,
                to.averages.dailyFocus
            ),
            sessionLength: compareValues(
                from.averages.sessionLength,
                to.averages.sessionLength
            )
        }
    });

    return {
        previousToSelected: compareStats(
            periodStats.previous,
            periodStats.selected
        ),
        selectedToPresent: periodStats.present
            ? compareStats(periodStats.selected, periodStats.present)
            : null
    };
}


// ============================================================
// 8. INSIGHT GENERATION
// ============================================================
//
// This should eventually:
//     1. receive calculated statistics
//     2. receive comparisons
//     3. generate insight objects
//
// It should NOT calculate raw session statistics anymore.
//
// ============================================================

function generateInsightObjects(
    periodStats,
    comparisons
) {
    console.log('periodStats:', periodStats);
    const selected = periodStats.selected;
    const longestWorkingStreak = Math.max(
        0,
        ...selected.consistency.workingStreaks
    );

    return {
        metrics: [
            {
                id: 'focus-time',
                value: selected.focusTime.total,
                unit: 'minutes'
            },
            {
                id: 'active-days',
                value: selected.consistency.activeDays,
                unit: 'days'
            },
            {
                id: 'attendance',
                value: selected.consistency.activePercentage,
                unit: 'percent'
            },
            {
                id: 'longest-session',
                value: selected.sessionLength.longest,
                unit: 'minutes'
            },
            {
                id: 'average-daily-focus',
                value: selected.averages.dailyFocus,
                unit: 'minutes'
            },
            {
                id: 'average-session-length',
                value: selected.averages.sessionLength,
                unit: 'minutes'
            }
        ],
        changes: comparisons.previousToSelected,
        milestones: [
            {
                id: 'longest-working-streak',
                value: longestWorkingStreak,
                unit: 'days'
            },
            {
                id: 'longest-session',
                value: selected.sessionLength.longest,
                unit: 'minutes'
            }
        ]
    };
}


// ============================================================
// 9. PUBLIC FUNCTION
// ============================================================

export function generateInsights(periodsDataObject) {

    // --------------------------------------------------------
    // Calculate statistics for selected / previous / present.
    // --------------------------------------------------------

    const periodStats =
        calculateAllPeriodStats(
            periodsDataObject
        );


    // --------------------------------------------------------
    // Compare the periods.
    // --------------------------------------------------------

    const comparisons =
        comparePeriods(
            periodStats
        );


    // --------------------------------------------------------
    // Generate the final insight objects.
    // --------------------------------------------------------

    const insights =
        generateInsightObjects(
            periodStats,
            comparisons
        );


    return insights;
}
