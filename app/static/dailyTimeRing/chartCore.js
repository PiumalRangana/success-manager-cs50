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

const sessions = [];

fetch('/api/sessions/today', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
})
  .then(res => res.json())
  .then(data => {
      for(let i=0; i < data.length; i++){
        sessions.push({
          "start": parseToToday(data[i].start_time),
          "end": data[i].end_time ? parseToToday(data[i].end_time) : null,
          "color":data[i].color
        })
      }
        const renderer = createChartRenderer("#chart");
        const controller = createChartController(renderer, sessions);

        controller.start();
    }
);
