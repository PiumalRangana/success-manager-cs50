const insightTypeLabels = {
    change: 'What changed',
    pattern: 'Pattern noticed',
    suggestion: 'Try next'
};

// Render the panel's shared header and its initial empty state once.
export function renderInsightButtonAndPlaceHolder() {
    const insightSection = document.getElementById('ai-insight');

    if (!insightSection) {
        console.error('AI Insights panel could not be found.');
        return;
    }

    if (document.getElementById('ai-insight-button')) {
        return;
    }

    const header = document.createElement('header');
    header.className = 'ai-insight-header';

    const heading = document.createElement('div');
    heading.className = 'ai-insight-heading';

    const icon = document.createElement('span');
    icon.className = 'ai-insight-icon';
    icon.setAttribute('aria-hidden', 'true');

    const iconElement = document.createElement('i');
    iconElement.className = 'bi bi-stars';
    icon.append(iconElement);

    const title = document.createElement('h2');
    title.id = 'ai-insight-title';
    title.className = 'ai-insight-title';
    title.textContent = 'AI Insights';

    const subtitle = document.createElement('p');
    subtitle.className = 'ai-insight-subtitle';
    subtitle.textContent = 'Highlights from your selected period';

    const headingText = document.createElement('div');
    headingText.append(title, subtitle);
    heading.append(icon, headingText);

    const button = document.createElement('button');
    button.id = 'ai-insight-button';
    button.type = 'button';
    button.className = 'ai-insight-generate-button';
    button.textContent = 'Generate insights';

    header.append(heading, button);

    const status = document.createElement('p');
    status.id = 'ai-insight-status';
    status.className = 'visually-hidden';
    status.setAttribute('aria-live', 'polite');

    const emptyState = document.createElement('div');
    emptyState.id = 'ai-insight-empty';
    emptyState.className = 'ai-insight-empty';

    const emptyIcon = document.createElement('i');
    emptyIcon.className = 'bi bi-lightbulb';
    emptyIcon.setAttribute('aria-hidden', 'true');

    const emptyTitle = document.createElement('h3');
    emptyTitle.textContent = 'Turn your analytics into useful observations';

    const emptyText = document.createElement('p');
    emptyText.textContent = (
        'Generate insights to uncover changes, habits, and one practical next step.'
    );

    emptyState.append(emptyIcon, emptyTitle, emptyText);

    const cards = document.createElement('div');
    cards.id = 'ai-insight-cards';
    cards.className = 'row g-3 ai-insight-cards';

    insightSection.append(header, status, emptyState, cards);
}

function createInsightCard(insight) {
    const column = document.createElement('div');
    column.className = 'col-12 col-md-4';

    const card = document.createElement('article');
    card.className = `small-card h-100 ai-insight-card ai-insight-card--${insight.type}`;

    const type = document.createElement('p');
    type.className = 'ai-insight-card-type';
    type.textContent = insightTypeLabels[insight.type] || 'Insight';

    const title = document.createElement('h3');
    title.className = 'ai-insight-card-title';
    title.textContent = insight.title;

    const message = document.createElement('p');
    message.className = 'ai-insight-card-message';
    message.textContent = insight.message;

    const evidence = document.createElement('p');
    evidence.className = 'ai-insight-card-evidence';
    evidence.textContent = insight.evidence;

    card.append(type, title, message, evidence);
    column.append(card);

    return column;
}

// Return to the empty state when Analytics publishes a new date-range dashboard.
export function renderInsightEmptyState() {
    const status = document.getElementById('ai-insight-status');
    const emptyState = document.getElementById('ai-insight-empty');
    const cards = document.getElementById('ai-insight-cards');

    if (!status || !emptyState || !cards) {
        return;
    }

    status.textContent = 'Insights cleared for the new selected period.';
    emptyState.hidden = false;
    cards.replaceChildren();
}

// Render structured insight cards returned by the server.
export function renderInsightResponse(insightData) {
    const status = document.getElementById('ai-insight-status');
    const emptyState = document.getElementById('ai-insight-empty');
    const cards = document.getElementById('ai-insight-cards');
    console.log("Rendering AI insight response:", insightData);

    if (!status || !emptyState || !cards || !Array.isArray(insightData.insights)) {
        return;
    }

    status.textContent = 'Insights are ready.';
    emptyState.hidden = true;

    cards.replaceChildren(...insightData.insights.map(createInsightCard));
}
