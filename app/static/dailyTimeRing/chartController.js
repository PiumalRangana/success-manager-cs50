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
import { getTodaySessions } from "./dailySessionStore.js";

export function createChartController(renderer) {

  let intervalId = null;

  function getCenterTime(session) {
    const activeSession = session.find(s => s.end === null);
    if (activeSession){
      const elapsed = Date.now() - activeSession.start;
      return formatElapsed(elapsed);

    } else {
      return formatTime(new Date());
    }}
  
  function getStopButtonVisibility(sessions) {
    const activeSession = sessions.find(s => s.end === null);
    return activeSession ? true : false;
  }

  function start() {
    if (intervalId) {
      return; // Prevent multiple intervals
    }
    const sessions = getTodaySessions();
    const initialNow = Date.now();

    const segments = buildSegments(sessions, initialNow);
    const angles = segmentsToAngles(segments);

    renderer.drawRing(angles);

    let lastSegmentCount = segments.length;

    intervalId = setInterval(() => {
      const sessions = getTodaySessions();
      const now = Date.now();

      const segments = buildSegments(sessions, now);
      const angles = segmentsToAngles(segments);

      // Detect structural change
      if (segments.length === lastSegmentCount) {
        renderer.updateRing(angles);

      } else {
        renderer.clear();
        renderer.drawRing(angles);
        lastSegmentCount = segments.length;
      }

      renderer.updateCenter(
        getCenterTime(sessions),
        getCurrentStatus(sessions, now),
        getStopButtonVisibility(sessions)
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
