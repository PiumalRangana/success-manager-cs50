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
  formatTime,
  formatElapsed
} from "./chartDataPipeline.js";

export function createChartController(renderer, sessions) {

  let intervalId = null;

  function getCenterTime(session) {
    const activeSession = session.find(s => s.end === null);
    if (activeSession){
     // console.log(activeSession)
      const elapsed = Date.now() - activeSession.start;

      return formatElapsed(elapsed);

    } else {
      return formatTime(new Date());
    }}

  function start() {
    if (intervalId) {
      return; // Prevent multiple intervals
    }
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
        getCenterTime(sessions),
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
