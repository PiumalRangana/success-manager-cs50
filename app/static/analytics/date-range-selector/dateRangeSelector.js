const dateRangeSelectorContainer = document.getElementById("date-range-selector");

const RangeOptions = ["1D", "1W", "1M", "3M", "6M", "1Y"];

function createDateRangeSelectorButtons() {
    for (let i = 0; i < RangeOptions.length; i++) {
        const button = document.createElement("button");
        button.value = RangeOptions[i];
        button.innerHTML = `<small>${RangeOptions[i]}</small>`;
        dateRangeSelectorContainer.appendChild(button);
    }
}
createDateRangeSelectorButtons();

let buttons = document.querySelectorAll("#date-range-selector>button");
buttons.forEach(button => {
    button.addEventListener("click", () => {
        const range = button.value;
        buttons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        console.log(`Selected range: ${range}`);
    });
});