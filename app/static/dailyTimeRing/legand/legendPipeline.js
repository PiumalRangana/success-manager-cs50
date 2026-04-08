

// make a object of tasks with task name as key and total time as value returned by getLegendData
export function getLegendData(todaySessions) {
    let tasks = {};
    for (let session of todaySessions) {

        if (!session.end) {
            console.log("continue session:", session);
            continue};

        if (!tasks[session.name]) {
            tasks[session.name] = 0;
            console.log("new task:", session.name);
        }
        tasks[session.name] += session.end - session.start;
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
        totalWorkingTime += tasks[taskName];
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
