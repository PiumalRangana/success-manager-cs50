import { getRelatedDate } from "../utils.js"

export function convertTimePerTaskData(rawSessions) {

    const labels = []
    let totalsPerTask = {}

    for (const session of rawSessions){
        if (!labels.includes(session.name))
            labels.push(session.name)
    }

    for(const label of labels){
        if (!totalsPerTask[label]){
            totalsPerTask[label] = {
                duration : 0,
                color : null
            }
        }
    }

    for(let session of rawSessions){
        let {relevantStartTime, relevantEndTime} = getRelatedDate(session.start_time, session.end_time)
        if (!relevantStartTime || !relevantEndTime) {
            continue;
        }

        relevantStartTime = relevantStartTime.getTime()
        relevantEndTime = relevantEndTime.getTime()
        const duration = (relevantEndTime - relevantStartTime) / (1000 * 60)
        totalsPerTask[session.name].duration += duration
        if (!totalsPerTask[session.name].color){
            totalsPerTask[session.name].color = session.color
        }
    }

    return totalsPerTask;
}
