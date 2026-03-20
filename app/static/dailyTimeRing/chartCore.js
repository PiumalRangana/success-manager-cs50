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
import { parseToToday } from "./chartDataPipeline.js";

let controller = null;

function renderDailyChart() {
  fetch('/api/sessions/today', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(data => {
      return data.map(item => ({
        start: parseToToday(item.start_time),
        end: item.end_time ? parseToToday(item.end_time) : null,
        color: item.color
      }));
    })
    .then(sessions => {
      document.querySelector("#chart").innerHTML = "";
      const renderer = createChartRenderer("#chart");

      if (controller) {
        controller.stop();
      }

      controller = createChartController(renderer, sessions);
      controller.start();
    })
    .catch(error => {
      console.error("Error rendering chart:", error);
    });
}

window.renderDailyChart = renderDailyChart;

renderDailyChart();