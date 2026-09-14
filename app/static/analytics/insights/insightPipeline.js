import { getSelectedPeriodsAndSessions, getSessionsForDateRange } from "./insightservice.js"

export async function makeInsightSessionsObject({ signal } = {}) {

    // object to hold the selected, previous and present periods and their sessions
    let periodsAndSessions = {
        selected: {
            startDate: null,
            endDate: null,
            sessions: null
        },
        previous: {
            startDate: null,
            endDate: null,
            sessions: null
        },
        present: {
            startDate: null,
            endDate: null,
            sessions: null
        }
    }

    // get selected periods and sessions
    const selected = getSelectedPeriodsAndSessions()

    if (!selected) {
        return periodsAndSessions
    }

    const { startDate, endDate, sessions: selectedSessions } = selected

    periodsAndSessions.selected.startDate = new Date(startDate)
    periodsAndSessions.selected.endDate = new Date(endDate)
    periodsAndSessions.selected.sessions = selectedSessions


    // get number of days in the selected date range
    const MS_PER_DAY = 1000 * 60 * 60 * 24

    const selectedStartDate = new Date(startDate)
    const selectedEndDate = new Date(endDate)

    const numSelectedDates = Math.round((selectedEndDate - selectedStartDate) / MS_PER_DAY) + 1

    // get previous equal date range

    const previousEnd = new Date(selectedStartDate)
    previousEnd.setDate(previousEnd.getDate() - 1)

    const previousStart = new Date(previousEnd)
    previousStart.setDate(previousStart.getDate() - (numSelectedDates - 1))

    periodsAndSessions.previous.startDate = previousStart
    periodsAndSessions.previous.endDate = previousEnd

    const previousSessionsPromise = getSessionsForDateRange(
        previousStart,
        previousEnd,
        { signal }
    )

    let presentSessionsPromise = Promise.resolve(null)

    // if selected end date != today
    const today = new Date().setHours(0, 0, 0, 0);
    const selectedEndDateDate = new Date(selectedEndDate).setHours(0, 0, 0, 0);

    if (selectedEndDateDate != today && selectedEndDateDate < today) {
        // if selected end date to today doesn't have equal or more amount of dayas like selected dates
        if ((today - selectedEndDateDate) / (1000 * 60 * 60 * 24) >= numSelectedDates) {
            console.log("present period has equal or more days than selected period. Getting sessions for present period.")

            // get sessions for the present period
            const presentStartDate = new Date(today - (numSelectedDates - 1) * MS_PER_DAY);
            const presentEndDate = new Date(today);

            presentSessionsPromise = getSessionsForDateRange(
                presentStartDate,
                presentEndDate,
                { signal }
            )

            periodsAndSessions.present.startDate = presentStartDate;
            periodsAndSessions.present.endDate = presentEndDate;
            periodsAndSessions.present.isEqualLength = true;

        } else {
            // else get range from selected end date to today and get sessions for that date
            console.log("present period has less days than selected period. Getting sessions for present period.")
            const presentStartDate = new Date(selectedEndDate)
            presentStartDate.setDate(presentStartDate.getDate() + 1);
            const presentEndDate = new Date(today);

            console.log("present start date: ", presentStartDate, "present end date: ", presentEndDate)

            // get sessions for that date
            presentSessionsPromise = getSessionsForDateRange(
                presentStartDate,
                presentEndDate,
                { signal }
            )

            periodsAndSessions.present.startDate = presentStartDate;
            periodsAndSessions.present.endDate = presentEndDate;
            periodsAndSessions.present.isEqualLength = false;

        }
    } else {
        console.log("end dates matched or selected end date is in the future. No present period to compare.")
    }

    const [previousSessions, presentSessions] = await Promise.all([
        previousSessionsPromise,
        presentSessionsPromise
    ])

    periodsAndSessions.previous.sessions = previousSessions
    periodsAndSessions.present.sessions = presentSessions

    return periodsAndSessions
}
