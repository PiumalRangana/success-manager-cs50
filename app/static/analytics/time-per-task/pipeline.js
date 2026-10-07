// Preserve task identity from the dashboard model while adapting it for Chart.js.
export function convertTimePerTaskData(taskBreakdown = []) {
    return taskBreakdown.map(task => ({
        taskId: task.taskId,
        name: task.name,
        duration: task.minutes,
        color: task.color
    }));
}
