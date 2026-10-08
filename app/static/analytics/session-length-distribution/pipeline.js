export function getSessionLengthDistributionData(distribution = []) {
    return {
        labels: distribution.map(bucket => [
            bucket.label.replace(' min', ''),
            'min'
        ]),
        percentages: distribution.map(bucket => bucket.percentage),
        counts: distribution.map(bucket => bucket.count)
    };
}
