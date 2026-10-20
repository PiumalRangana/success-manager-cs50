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

    const actions = document.createElement('div');
    actions.className = 'ai-insight-actions';

    const button = document.createElement('button');
    button.id = 'ai-insight-button';
    button.type = 'button';
    button.className = 'ai-insight-generate-button';
    button.textContent = 'Generate insights';

    const generateNewButton = document.createElement('button');
    generateNewButton.id = 'ai-insight-generate-new-button';
    generateNewButton.type = 'button';
    generateNewButton.className = 'ai-insight-generate-new-button';
    generateNewButton.textContent = 'Generate new';
    generateNewButton.hidden = true;

    actions.append(button, generateNewButton);
    header.append(heading, actions);

    const status = document.createElement('p');
    status.id = 'ai-insight-status';
    status.className = 'visually-hidden';
    status.setAttribute('aria-live', 'polite');

    const emptyState = document.createElement('div');
    emptyState.id = 'ai-insight-empty';
    emptyState.className = 'ai-insight-empty';

    const emptyIcon = document.createElement('i');
    emptyIcon.id = 'ai-insight-empty-icon';
    emptyIcon.className = 'bi bi-lightbulb';
    emptyIcon.setAttribute('aria-hidden', 'true');

    const emptyTitle = document.createElement('h3');
    emptyTitle.id = 'ai-insight-empty-title';
    emptyTitle.textContent = 'Turn your analytics into useful observations';

    const emptyText = document.createElement('p');
    emptyText.id = 'ai-insight-empty-text';
    emptyText.textContent = (
        'Generate insights to uncover changes, habits, and one practical next step.'
    );

    emptyState.append(emptyIcon, emptyTitle, emptyText);

    const cards = document.createElement('div');
    cards.id = 'ai-insight-cards';
    cards.className = 'row g-3 ai-insight-cards';

    const feedback = document.createElement('p');
    feedback.id = 'ai-insight-feedback';
    feedback.className = 'ai-insight-feedback';
    feedback.hidden = true;

    insightSection.append(header, status, emptyState, feedback, cards);
}

function setEmptyStateContent(iconClass, title, text) {
    const icon = document.getElementById('ai-insight-empty-icon');
    const emptyTitle = document.getElementById('ai-insight-empty-title');
    const emptyText = document.getElementById('ai-insight-empty-text');

    if (!icon || !emptyTitle || !emptyText) {
        return;
    }

    icon.className = iconClass;
    emptyTitle.textContent = title;
    emptyText.textContent = text;
}

function formatGeneratedAt(generatedAt) {
    const date = new Date(generatedAt);

    if (Number.isNaN(date.getTime())) {
        return 'an earlier time';
    }

    return date.toLocaleString([], {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
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
    const feedback = document.getElementById('ai-insight-feedback');
    const cards = document.getElementById('ai-insight-cards');
    const button = document.getElementById('ai-insight-button');
    const generateNewButton = document.getElementById('ai-insight-generate-new-button');

    if (!status || !emptyState || !feedback || !cards || !button || !generateNewButton) {
        return;
    }

    status.textContent = 'Insights cleared for the new selected period.';
    emptyState.hidden = false;
    setEmptyStateContent(
        'bi bi-lightbulb',
        'Turn your analytics into useful observations',
        'Generate insights to uncover changes, habits, and one practical next step.'
    );
    feedback.hidden = true;
    feedback.className = 'ai-insight-feedback';
    cards.replaceChildren();
    button.disabled = false;
    button.textContent = 'Generate insights';
    generateNewButton.hidden = true;
    generateNewButton.disabled = false;
}

// Offer a saved response when the user revisits a date range without generating again.
export function renderSavedInsightAvailable(savedInsight) {
    const status = document.getElementById('ai-insight-status');
    const emptyState = document.getElementById('ai-insight-empty');
    const feedback = document.getElementById('ai-insight-feedback');
    const cards = document.getElementById('ai-insight-cards');
    const button = document.getElementById('ai-insight-button');
    const generateNewButton = document.getElementById('ai-insight-generate-new-button');

    if (!status || !emptyState || !feedback || !cards || !button || !generateNewButton) {
        return;
    }

    const dataChanged = !savedInsight.matchesCurrentData;
    const generatedAt = formatGeneratedAt(savedInsight.generatedAt);

    status.textContent = dataChanged
        ? 'A previous insight is available, but analytics data has changed.'
        : 'A saved insight is available for this selected period.';
    emptyState.hidden = false;
    setEmptyStateContent(
        dataChanged ? 'bi bi-arrow-repeat' : 'bi bi-bookmark-check',
        dataChanged ? 'A previous insight is saved for this range' : 'An insight is saved for this range',
        dataChanged
            ? `Generated ${generatedAt}. View it, or generate an updated insight.`
            : `Generated ${generatedAt}. View it, or ask for a new insight.`
    );
    feedback.hidden = true;
    feedback.className = 'ai-insight-feedback';
    cards.replaceChildren();
    button.disabled = false;
    button.textContent = dataChanged ? 'View previous insight' : 'View saved insight';
    generateNewButton.hidden = false;
    generateNewButton.disabled = false;
    generateNewButton.textContent = dataChanged ? 'Generate updated' : 'Generate new';
}

// Show an in-panel progress message while the server is working.
export function renderInsightLoading() {
    const status = document.getElementById('ai-insight-status');
    const emptyState = document.getElementById('ai-insight-empty');
    const feedback = document.getElementById('ai-insight-feedback');
    const cards = document.getElementById('ai-insight-cards');
    const button = document.getElementById('ai-insight-button');
    const generateNewButton = document.getElementById('ai-insight-generate-new-button');

    if (!status || !emptyState || !feedback || !cards || !button || !generateNewButton) {
        return;
    }

    status.textContent = 'Generating AI insights.';
    emptyState.hidden = true;
    feedback.hidden = false;
    feedback.className = 'ai-insight-feedback ai-insight-feedback--loading';
    feedback.textContent = 'Looking for useful patterns in your selected period…';
    cards.replaceChildren();
    button.disabled = true;
    generateNewButton.disabled = true;
    button.textContent = 'Generating…';
}

// Show request limits and provider failures in the panel instead of only the console.
export function renderInsightError(message) {
    const status = document.getElementById('ai-insight-status');
    const emptyState = document.getElementById('ai-insight-empty');
    const feedback = document.getElementById('ai-insight-feedback');
    const cards = document.getElementById('ai-insight-cards');
    const button = document.getElementById('ai-insight-button');
    const generateNewButton = document.getElementById('ai-insight-generate-new-button');

    if (!status || !emptyState || !feedback || !cards || !button || !generateNewButton) {
        return;
    }

    status.textContent = message;
    emptyState.hidden = true;
    feedback.hidden = false;
    feedback.className = 'ai-insight-feedback ai-insight-feedback--error';
    feedback.textContent = message;
    cards.replaceChildren();
    button.disabled = false;
    button.textContent = 'Try again';
    generateNewButton.hidden = true;
    generateNewButton.disabled = false;
}

// Render structured insight cards returned by the server.
export function renderInsightResponse(insightData, savedGeneratedAt = null) {
    const status = document.getElementById('ai-insight-status');
    const emptyState = document.getElementById('ai-insight-empty');
    const feedback = document.getElementById('ai-insight-feedback');
    const cards = document.getElementById('ai-insight-cards');
    const button = document.getElementById('ai-insight-button');
    const generateNewButton = document.getElementById('ai-insight-generate-new-button');
    console.log("Rendering AI insight response:", insightData);

    if (!status || !emptyState || !feedback || !cards || !button || !generateNewButton || !Array.isArray(insightData.insights)) {
        return;
    }

    status.textContent = 'Insights are ready.';
    emptyState.hidden = true;
    feedback.hidden = false;
    feedback.className = 'ai-insight-feedback';

    if (savedGeneratedAt) {
        feedback.textContent = `Showing insight generated ${formatGeneratedAt(savedGeneratedAt)}.`;
    } else if (insightData.meta?.cached) {
        feedback.textContent = 'Showing saved insights for this data. No new generation was used.';
    } else {
        const remaining = insightData.meta?.remainingGenerations;
        feedback.textContent = Number.isInteger(remaining)
            ? `${remaining} AI generation${remaining === 1 ? '' : 's'} remaining today.`
            : 'Insights generated.';
    }

    cards.replaceChildren(...insightData.insights.map(createInsightCard));
    button.disabled = false;
    button.textContent = 'Generate new insight';
    generateNewButton.hidden = true;
    generateNewButton.disabled = false;
}
