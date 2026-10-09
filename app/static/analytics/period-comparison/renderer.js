function formatChange(change) {
    if (change.state === 'new') {
        return { text: 'New', tone: 'positive' };
    }

    if (change.state === 'unchanged' || change.change === 0) {
        return { text: 'No change', tone: 'neutral' };
    }

    const direction = change.change > 0 ? 'up' : 'down';
    const percentage = Math.round(Math.abs(change.percentageChange));

    return {
        text: `${direction === 'up' ? '\u2191' : '\u2193'} ${percentage}%`,
        tone: direction === 'up' ? 'positive' : 'negative'
    };
}

function createComparisonToggle(view, onTargetChange) {
    if (!view.hasCurrentPeriod) {
        return null;
    }

    const toggle = document.createElement('div');
    toggle.className = 'period-comparison-toggle';
    toggle.setAttribute('role', 'group');
    toggle.setAttribute('aria-label', 'Comparison period');

    const options = [
        { id: 'previous', label: 'Previous' },
        { id: 'current', label: 'Current' }
    ];

    options.forEach(option => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'period-comparison-toggle-button';
        button.textContent = option.label;
        button.classList.toggle('is-active', option.id === view.target);
        button.setAttribute('aria-pressed', String(option.id === view.target));
        button.addEventListener('click', () => onTargetChange(option.id));
        toggle.appendChild(button);
    });

    return toggle;
}

function createComparisonTable(view) {
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'period-comparison-table-wrapper';

    const table = document.createElement('table');
    table.className = 'period-comparison-table';

    const tableHead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Metric', view.headers.from, view.headers.to, 'Change'].forEach(text => {
        const header = document.createElement('th');
        header.scope = 'col';
        header.textContent = text;
        headerRow.appendChild(header);
    });
    tableHead.appendChild(headerRow);

    const tableBody = document.createElement('tbody');
    view.rows.forEach(row => {
        const tableRow = document.createElement('tr');
        const metric = document.createElement('th');
        metric.scope = 'row';
        metric.textContent = row.label;
        const from = document.createElement('td');
        from.textContent = row.from;
        const to = document.createElement('td');
        to.textContent = row.to;
        const change = document.createElement('td');
        const presentation = formatChange(row.change);
        change.className = `period-comparison-change period-comparison-change--${presentation.tone}`;
        change.textContent = presentation.text;

        tableRow.append(metric, from, to, change);
        tableBody.appendChild(tableRow);
    });

    table.append(tableHead, tableBody);
    tableWrapper.appendChild(table);
    return tableWrapper;
}

export function renderPeriodComparison(container, view, onTargetChange) {
    container.replaceChildren();

    const topLine = document.createElement('div');
    topLine.className = 'period-comparison-topline';

    const description = document.createElement('p');
    description.className = 'period-comparison-description';
    description.textContent = view.description;
    topLine.appendChild(description);

    const toggle = createComparisonToggle(view, onTargetChange);

    if (toggle) {
        topLine.appendChild(toggle);
    }

    container.appendChild(topLine);

    if (view.mode === 'normalized') {
        const badge = document.createElement('p');
        badge.className = 'period-comparison-mode';
        badge.textContent = 'Normalized comparison';
        container.appendChild(badge);
    }

    container.appendChild(createComparisonTable(view));
}

export function renderPeriodComparisonLoading(container) {
    container.replaceChildren();

    const loading = document.createElement('p');
    loading.className = 'period-comparison-loading';
    loading.textContent = 'Loading comparison...';
    container.appendChild(loading);
}
