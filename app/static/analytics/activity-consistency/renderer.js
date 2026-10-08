function formatMinutes(minutes) {
    const roundedMinutes = Math.round(minutes);
    const hours = Math.floor(roundedMinutes / 60);
    const remainingMinutes = roundedMinutes % 60;

    if (hours === 0) {
        return `${remainingMinutes} min`;
    }

    return remainingMinutes === 0
        ? `${hours} hr`
        : `${hours} hr ${remainingMinutes} min`;
}

function createSummaryItem(iconClass, label, value) {
    const item = document.createElement('div');
    item.className = 'activity-summary-item';

    const icon = document.createElement('i');
    icon.className = `bi ${iconClass} activity-summary-icon`;

    const text = document.createElement('div');
    const itemLabel = document.createElement('p');
    itemLabel.className = 'activity-summary-label';
    itemLabel.textContent = label;
    const itemValue = document.createElement('p');
    itemValue.className = 'activity-summary-value';
    itemValue.textContent = value;

    text.append(itemLabel, itemValue);
    item.append(icon, text);
    return item;
}

function createDayCell(day) {
    const cell = document.createElement('div');
    cell.className = 'activity-calendar-day';

    if (day.outsideSelectedRange) {
        cell.classList.add('activity-calendar-day--outside');
        cell.setAttribute('aria-hidden', 'true');
        return cell;
    }

    cell.classList.add(
        day.active
            ? 'activity-calendar-day--active'
            : 'activity-calendar-day--inactive'
    );
    cell.setAttribute('role', 'gridcell');
    cell.tabIndex = 0;

    const date = new Date(`${day.date}T00:00:00`);
    const dateText = date.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
    const activityText = day.active
        ? `Active: ${formatMinutes(day.minutes)} across ${day.sessions} ${day.sessions === 1 ? 'session' : 'sessions'}`
        : 'Inactive: no focus sessions';

    cell.setAttribute('aria-label', `${dateText}. ${activityText}`);
    cell.title = `${dateText} — ${activityText}`;

    const dot = document.createElement('span');
    dot.className = 'activity-calendar-dot';
    cell.appendChild(dot);

    return cell;
}

function renderCalendar(calendar) {
    const scrollArea = document.createElement('div');
    scrollArea.className = 'activity-calendar-scroll';
    scrollArea.tabIndex = 0;
    scrollArea.setAttribute('aria-label', 'Scrollable activity calendar');

    const calendarContent = document.createElement('div');
    calendarContent.className = 'activity-calendar-content';
    calendarContent.style.setProperty('--calendar-weeks', calendar.weeks.length);

    const monthRow = document.createElement('div');
    monthRow.className = 'activity-calendar-month-row';
    monthRow.appendChild(document.createElement('span'));

    calendar.weeks.forEach(week => {
        const label = document.createElement('span');
        label.className = 'activity-calendar-month-label';
        label.textContent = week.monthLabel;
        monthRow.appendChild(label);
    });

    const calendarMain = document.createElement('div');
    calendarMain.className = 'activity-calendar-main';

    const weekdayLabels = document.createElement('div');
    weekdayLabels.className = 'activity-calendar-weekday-labels';
    calendar.weekdayLabels.forEach(label => {
        const weekday = document.createElement('span');
        weekday.textContent = label;
        weekdayLabels.appendChild(weekday);
    });

    const daysGrid = document.createElement('div');
    daysGrid.className = 'activity-calendar-days-grid';
    daysGrid.setAttribute('role', 'grid');
    daysGrid.setAttribute('aria-label', 'Selected date range activity');

    for (let dayIndex = 0; dayIndex < calendar.weekdayLabels.length; dayIndex += 1) {
        calendar.weeks.forEach(week => {
            daysGrid.appendChild(createDayCell(week.days[dayIndex]));
        });
    }

    calendarMain.append(weekdayLabels, daysGrid);
    calendarContent.append(monthRow, calendarMain);
    scrollArea.appendChild(calendarContent);
    return scrollArea;
}

function renderSummary(calendar) {
    const summary = document.createElement('aside');
    summary.className = 'activity-summary';
    summary.setAttribute('aria-label', 'Consistency summary');

    const activeDayRate = `${Math.round(calendar.summary.activeDayRate)}%`;

    summary.append(
        createSummaryItem(
            'bi-fire',
            'Longest Working Streak',
            `${calendar.summary.longestWorkingStreak} days`
        ),
        createSummaryItem(
            'bi-calendar-check',
            'Active Days',
            `${calendar.summary.activeDays} / ${calendar.summary.totalDays} (${activeDayRate})`
        ),
        createSummaryItem(
            'bi-cup-hot',
            'Longest Break Streak',
            `${calendar.summary.longestBreakStreak} days`
        )
    );

    return summary;
}

export function renderActivityConsistency(container, calendar) {
    container.replaceChildren();

    const layout = document.createElement('div');
    layout.className = `activity-consistency-layout activity-consistency-layout--${calendar.layout}`;

    const calendarSection = document.createElement('section');
    calendarSection.className = 'activity-calendar-section';
    calendarSection.appendChild(renderCalendar(calendar));

    const legend = document.createElement('div');
    legend.className = 'activity-calendar-legend';
    legend.innerHTML = `
        <span><i class="activity-calendar-dot activity-calendar-dot--active"></i> Active day</span>
        <span><i class="activity-calendar-dot activity-calendar-dot--inactive"></i> Inactive day</span>
    `;
    calendarSection.appendChild(legend);

    layout.append(calendarSection, renderSummary(calendar));
    container.appendChild(layout);
}

export function renderActivityConsistencyLoading(container) {
    container.replaceChildren();

    const loading = document.createElement('p');
    loading.className = 'activity-consistency-loading';
    loading.textContent = 'Loading activity…';
    container.appendChild(loading);
}
