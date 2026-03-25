/**********************************************************
 * DAILY TIME RING – CORE
 * --------------------------------------------------------
 * Entry point for the daily time ring feature.
 *
 * Responsibilities:
 * - Fetch today's session data from backend
 * - Parse database time strings into local timestamps
 * - Wire renderer and controller together
 *
 * Does NOT:
 * - Contain rendering logic
 * - Contain time calculations
 **********************************************************/

import { createChartRenderer } from "./chartRenderer.js";
import { createChartController } from "./chartController.js";
import { loadTodaySessions } from "./dailySessionStore.js";
let controller = null;

async function renderDailyChart() {
  try {
    await loadTodaySessions()
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