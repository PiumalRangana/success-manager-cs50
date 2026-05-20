/*
=====================================
Render Functions
=====================================
*/

function createCalendarSelectorButton() {
    return`
        <button type="button" class="btn dropdown-button"  data-bs-toggle="modal" data-bs-target="#calendar-selector-form-modal">
            <i class="bi bi-calendar4-range pe-2"></i>
            <small>Apr 20 - Apr 27, 2026</small>
            <i class="bi bi-caret-down ps-1"></i>
        </button>`}
;

function createCalendarSelectorModal() {
    return `
    <div class="modal fade" id="calendar-selector-form-modal" tabindex="-1"
        aria-labelledby="calendar-selector-form-modal" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content bg-dark text-light">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="calendar-selector-form-modal-label">Select Date Range</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <form>
                        <!-- Date input fields -->
                        <div class="form-group row g-3" id="calendar-inputs">
                            <div class="start-date col-6">
                                <label for="start-date" class="form-label">Start Date</label>
                                <input type="text" id="start-date" class="form-control bg-dark text-light border-secondary start-date">
                            </div>
                            <div class="end-date col-6">
                                <label for="end-date" class="form-label">End Date</label>
                                <input type="text" id="end-date" class="form-control bg-dark text-light border-secondary end-date" disabled placeholder="Select start date first">
                            </div>
                            <div class="calendar-container" id="calendar-container">
                            </div>
                        </div>
                    </form>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary" id="apply-date-range" onclick="applyDateRange()" disabled>Apply</button>
                </div>
            </div>
        </div>
    </div>`
};


/*
=====================================
DOM Injection
=====================================
*/


const modalContainer = document.querySelector('#calendar-selector-form-modal-container');
modalContainer.innerHTML = createCalendarSelectorModal();

const container = document.querySelector('#calendar-selector');
container.innerHTML = createCalendarSelectorButton();


/*
=====================================
DOM References
=====================================
*/

const startInput = document.querySelector("#start-date");
const endInput = document.querySelector("#end-date");
const applyButton = document.querySelector("#apply-date-range");


/*
=====================================
Flatpickr Initialization
=====================================
*/

const fp = flatpickr("#calendar-container", {
    inline: true,
    mode: "range",
    dateFormat: "Y-m-d",

    onChange(selectedDates) {
        applyCalendarDatesToInputs(selectedDates);
    }

});


/*
=====================================
Event Handlers
=====================================
*/

function handleStartDateChange() {
    const endDate = fp.selectedDates[1];

    fp.setDate([
        startInput.value,
        endDate
    ]);
    endInput.disabled = !startInput.value;
    if (!startInput.value) {
        endInput.value = "";
        applyButton.disabled = true;
    }

    console.log("Start date changed:", fp.selectedDates);
}

function handleEndDateChange() {
    const startDate = fp.selectedDates[0];

    fp.setDate([
        startDate || null,
        endInput.value
    ]);
    applyButton.disabled = !isValidDateRange();
    console.log("End date changed:", fp.selectedDates);
}


/*
=====================================
Event Listeners
=====================================
*/

startInput.addEventListener("change", handleStartDateChange);
endInput.addEventListener("change", handleEndDateChange);


/*
=====================================
Utility Functions
=====================================
*/

function applyDateRange() {
    const startDate = fp.selectedDates[0];
    const endDate = fp.selectedDates[1];
    if (startDate && endDate) {
        console.log("Applying date range:", startDate, endDate);
    }
}

function isValidDateRange() {
    const startDate = fp.selectedDates[0];
    const endDate = fp.selectedDates[1];
    return startDate && endDate && startDate <= endDate;
}

function applyCalendarDatesToInputs(selectedDates) {
    if (selectedDates[0]) {
        startInput.value = fp.formatDate(selectedDates[0], "Y-m-d");
        endInput.disabled = false;
    }
    else {
        startInput.value = "";
        endInput.disabled = true;
    }

    if (selectedDates[1]) {
        endInput.value = fp.formatDate(selectedDates[1], "Y-m-d");
        applyButton.disabled = !isValidDateRange();
    }
    else {
        endInput.value = "";
        applyButton.disabled = true;
    }
}