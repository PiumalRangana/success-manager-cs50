/**********************************************************
 * DAILY TIME RING – CONTROLLER
 * --------------------------------------------------------
 * Coordinates:
 * - Data pipeline
 * - Renderer
 * - 1-second update loop
 *
 * Rebuilds ring from truth every tick.
 **********************************************************/

import {
  buildSegments,
  segmentsToAngles,
  getCurrentStatus,
  formatTime
} from "./chartDataPipeline.js";

export function createChartController(renderer, sessions) {

  let intervalId = null;

  function start() {

    const initialNow = Date.now();

    const segments = buildSegments(sessions, initialNow);
    const angles = segmentsToAngles(segments);

    renderer.drawRing(angles);

    intervalId = setInterval(() => {
      const now = Date.now();

      const segments = buildSegments(sessions, now);
      const angles = segmentsToAngles(segments);

      renderer.updateRing(angles);

      renderer.updateCenter(
        formatTime(new Date(now)),
        getCurrentStatus(sessions, now)
      );

    }, 1000);
  }

  function stop() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  return {
    start,
    stop
  };
}
