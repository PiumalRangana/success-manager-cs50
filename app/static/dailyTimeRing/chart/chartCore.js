/**********************************************************
 * DAILY TIME RING – CORE
 * --------------------------------------------------------
 * Entry point for the daily time ring feature.
 *
 * Responsibilities:
 * - Load today's session data
 * - Initialize renderer and controller
 * - Wire renderer and controller together
 * - Start the chart controller
 *
 * Does NOT:
 * - Contain rendering logic (see chartRenderer.js)
 * - Contain time calculations (see chartDataPipeline.js)
 * - Parse database strings (see dailySessionStore.js)
 **********************************************************/

import { createChartRenderer } from "./chartRenderer.js";
import { createChartController } from "./chartController.js";
import { loadTodaySessions } from "../dailySessionStore.js";
let controller = null;

function showDailyChartFeedback() {
  const feedback = document.querySelector("#daily-chart-feedback");

  if (feedback) {
    feedback.hidden = false;
  }
}

function hideDailyChartFeedback() {
  const feedback = document.querySelector("#daily-chart-feedback");

  if (feedback) {
    feedback.hidden = true;
  }
}

async function renderDailyChart() {
  if (typeof window.d3 === "undefined") {
    showDailyChartFeedback();
    return;
  }

  hideDailyChartFeedback();

  try {
    document.querySelector("#chart").innerHTML = "";
    const renderer = createChartRenderer("#chart");

    if (controller) controller.stop();

    controller = createChartController(renderer);
    controller.start();

  } catch (err) {
    console.error("Error rendering chart:", err);
    showDailyChartFeedback();
  }
}

export{
  renderDailyChart
};
