// Convert the shared daily activity records into the shape used by this renderer.
export function getBarChartData(dailyActivity = []) {
    return Object.fromEntries(
        dailyActivity.map(day => [day.date, day.minutes])
    );
}
