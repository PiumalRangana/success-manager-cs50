export function applyConditionalTooltip(selector) {
  const elements = document.querySelectorAll(selector);

  elements.forEach(el => {
    if (el.scrollWidth > el.clientWidth) {
      el.setAttribute("title", el.textContent);
    } else {
      el.removeAttribute("title");
    }
  });
}