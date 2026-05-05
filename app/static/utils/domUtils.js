function applyConditionalTooltip(selector) {
  const elements = document.querySelectorAll(selector);

  elements.forEach(el => {
    if (el.scrollWidth > el.clientWidth) {
      el.setAttribute("title", el.textContent);
    } else {
      el.removeAttribute("title");
    }
  });
}

function enableWhiteSpaceToggle(selector) {
  const elements = document.querySelectorAll(selector);

  elements.forEach(el => {
    el.addEventListener("click", () => {
      const currentWhiteSpace = window.getComputedStyle(el).whiteSpace;
      el.style.whiteSpace = currentWhiteSpace === "normal" ? "nowrap" : "normal";
    });
  });
}

export function applyTextOverflowHelpers(selector) {
  applyConditionalTooltip(selector);
  enableWhiteSpaceToggle(selector);
}