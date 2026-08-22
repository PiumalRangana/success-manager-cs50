import { getRelatedDate } from '../utils.js';

export function groupByHour(rowSessions) {
    const groupedData = {};

    for (let session of rowSessions) {
        let { relevantStartTime, relevantEndTime } = getRelatedDate(session.start_time, session.end_time)

        if (!relevantStartTime || !relevantEndTime) {
            continue;
        }

        let currentStart = relevantStartTime;

        while (currentStart < relevantEndTime) {
            const currentHour = currentStart.getHours();
            const nextHour = new Date(currentStart);
            nextHour.setHours(currentHour + 1, 0, 0, 0);

            const currentEnd = nextHour < relevantEndTime ? nextHour : relevantEndTime;
            const durationInMinutes = (currentEnd - currentStart) / (1000 * 60);

            if (!groupedData[currentHour]) {
                groupedData[currentHour] = 0;
            }

            groupedData[currentHour] += durationInMinutes;
            currentStart = currentEnd;
        }

    }

    const labels = Object.keys(groupedData)
        .map(Number)
        .sort((a, b) => a - b);

    return {
        labels: labels.map((hour) => `${String(hour).padStart(2, '0')}:00`),
        data: labels.map((hour) => groupedData[hour])
    };
}
