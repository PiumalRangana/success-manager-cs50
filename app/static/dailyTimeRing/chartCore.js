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
import { loadTodaySessions } from "./dailySessionStore.js";
let controller = null;

async function renderDailyChart() {
  try {
    await loadTodaySessions();
    document.querySelector("#chart").innerHTML = "";
    const renderer = createChartRenderer("#chart");

    if (controller) controller.stop();

    controller = createChartController(renderer);
    controller.start();

  } catch (err) {
    console.error("Error rendering chart:", err);
  }
}

renderDailyChart();