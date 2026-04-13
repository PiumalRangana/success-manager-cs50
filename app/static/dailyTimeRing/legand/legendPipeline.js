// make a object of tasks with task name as key and total time as value returned by getLegendData

export function getLegendData(todaySessions) {
    let tasks = {};
    for (let session of todaySessions) {
        let taskTime
        if (!tasks[session.name]) {
            tasks[session.name] = { time: 0, color: session.color};
        }
        if (session.end) {
            taskTime =  session.end - session.start;
        }

        else {
            taskTime = Date.now() - session.start;
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
