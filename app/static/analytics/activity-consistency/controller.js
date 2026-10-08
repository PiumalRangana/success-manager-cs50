import {
    getAnalyticsDashboard,
    subscribeToAnalyticsDashboardChanges
} from '../analyticsStore.js';
import { buildActivityCalendar } from './calendarGrid.js';
import {
    renderActivityConsistency,
    renderActivityConsistencyLoading
} from './renderer.js';

function applyLayoutMode(layout) {
    const column = document.getElementById('activity-consistency-column');

    if (!column) {
        return;
    }

    const isCompact = layout === 'compact';

    column.classList.toggle('col-md-6', isCompact);
    column.classList.toggle('activity-consistency-column--wide', !isCompact);
}

export function initializeActivityConsistency() {
    const container = document.getElementById('activity-consistency-body');

    if (!container) {
        return null;
    }

    function updateActivityConsistency(dashboard = getAnalyticsDashboard()) {
        if (!dashboard) {
            applyLayoutMode('compact');
            renderActivityConsistencyLoading(container);
            return;
        }

        const stats = dashboard.periods.selected.stats;
        const calendar = buildActivityCalendar(stats);

        applyLayoutMode(calendar.layout);
        renderActivityConsistency(container, calendar);
    }

    updateActivityConsistency();
    return subscribeToAnalyticsDashboardChanges(updateActivityConsistency);
}
