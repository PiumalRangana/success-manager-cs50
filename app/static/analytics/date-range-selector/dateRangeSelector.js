import { applyDateRange } from '../analyticsController.js';
import { getAnalyticsDateRange } from '../analyticsStore.js';

/*
=====================================
Configuration
=====================================
*/
const RANGE_OPTIONS = ["1D", "1W", "1M", "3M", "6M", "1Y"];


/*
=====================================
Render Functions
=====================================
*/

function createDateRangeSelectorButtons(RANGE_OPTIONS, container) {

    for (let i = 0; i < RANGE_OPTIONS.length; i++) {
        const button = document.createElement("button");
        button.id = `date-range-${RANGE_OPTIONS[i]}`;
        button.value = RANGE_OPTIONS[i];
        button.innerHTML = `<small>${RANGE_OPTIONS[i]}</small>`;
        container.appendChild(button);
    }
    let matchingPreset = getMatchingPreSet();
    if (matchingPreset) {
        const matchingButton = document.getElementById(`date-range-${matchingPreset}`);
        matchingButton.classList.add("active");
    }
}

/*
=====================================
Business Logic
=====================================
*/

function calculateDateRange(range){
    const endDate = new Date();
    const startDate = new Date();

    /*
    Ranges are inclusive of the current day.

    Examples:
    1D = today
    1W = last 7 calendar days including today
    1M = same day last month through today
    */

    switch (range) {
        case "1D":
            startDate.setDate(endDate.getDate());
            break;
        case "1W":
            startDate.setDate(endDate.getDate() - 6);
            break;
        case "1M":
            startDate.setMonth(endDate.getMonth() - 1);
            break;
        case "3M":
            startDate.setMonth(endDate.getMonth() - 3);
            break;
        case "6M":
            startDate.setMonth(endDate.getMonth() - 6);
            break;
        case "1Y":
            startDate.setFullYear(endDate.getFullYear() - 1);
            break;
    }
    return { startDate, endDate };
}

/*
=====================================
Event Handlers
=====================================
*/

function handleRangeButtonClick(event) {
    const selectedButton = event.currentTarget;

    const buttons = document.querySelectorAll("#date-range-selector > button");

    buttons.forEach(button =>
        button.classList.remove("active")
    );

    selectedButton.classList.add("active");

    const { startDate, endDate } =
        calculateDateRange(selectedButton.value);

    applyDateRange([
        formatDate(startDate),
        formatDate(endDate)
    ]);
}

/*
=====================================
Utility Functions
=====================================
*/

function formatDate(date) {
    return new Intl.DateTimeFormat('sv-SE').format(date);
}

function getMatchingPreSet() {
    const { startDate, endDate } = getAnalyticsDateRange();

    for (let preset of RANGE_OPTIONS) {
        const {
            startDate: calculatedStartDate,
            endDate: calculatedEndDate
        } = calculateDateRange(preset);

        if (
            formatDate(calculatedStartDate) === startDate &&
            formatDate(calculatedEndDate) === endDate
        ) {
            return preset;
        }
    }
    return null;
}

export function renderDateRangeSelector() {
    /*
    =====================================
    DOM References
    =====================================
    */

    const dateRangeSelectorContainer = document.getElementById("date-range-selector");

    createDateRangeSelectorButtons(RANGE_OPTIONS, dateRangeSelectorContainer);

    const buttons =
    document.querySelectorAll("#date-range-selector > button");

    buttons.forEach(button => {
        button.addEventListener(
            "click",
            handleRangeButtonClick
        );
    });
};
