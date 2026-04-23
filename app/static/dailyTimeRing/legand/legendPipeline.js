// make a object of tasks with task name as key and total time as value returned by getLegendData
const now = Date.now();

let todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);
todayStart = todayStart.getTime();

export function getLegendData(todaySessions) {
    let tasks = {};
    for (let session of todaySessions) {
        let taskTime
        if (!tasks[session.name]) {
            tasks[session.name] = { time: 0, color: session.color, is_active: false };
        }
        const effectiveStart = Math.max(session.start, todayStart);

        if (session.end) {
            taskTime =  session.end - effectiveStart;
        }

        else {
            taskTime = Date.now() - effectiveStart;
            tasks[session.name].is_active = true;
        }

        tasks[session.name].time += taskTime;
    }

    const idleTime = calculateIdleTime(
        calculateTotatalWorkingTime(tasks)
    );

    return {
        tasks,
        idleTime
    };
}

function calculateTotatalWorkingTime(tasks){
    let totalWorkingTime = 0;

    for (let taskName in tasks) {
        totalWorkingTime += tasks[taskName].time;
    }

    return totalWorkingTime
}

function calculateIdleTime(totalWorkingTime) {

    let todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    todayStart = todayStart.getTime();
    let timeSinceStartOfToday = Date.now() - todayStart;
    let idleTime = timeSinceStartOfToday - totalWorkingTime

    return idleTime
}
