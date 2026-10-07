export function groupByHour(hourlyDistribution = []) {
    const minutesByHour = new Map(
        hourlyDistribution.map(item => [item.hour, item.minutes])
    );

    const hours = Array.from({ length: 24 }, (_, hour) => hour);

    return {
        labels: hours.map(hour => `${String(hour).padStart(2, '0')}:00`),
        data: hours.map(hour => minutesByHour.get(hour) || 0)
    };
}
