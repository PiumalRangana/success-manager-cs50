function createCalendarSelectorButton() {
    return`
        <button type="button" class="btn dropdown-button ">
            <i class="bi bi-calendar4-range pe-2"></i>
            <small>Apr 20 - Apr 27, 2026</small>
            <i class="bi bi-caret-down ps-1"></i>
        </button>`}
;

const container = document.querySelector('#calendar-selector');
container.innerHTML = createCalendarSelectorButton();