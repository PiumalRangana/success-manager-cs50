/**********************************************************
 * DAILY TIME RING
 * --------------------------------------------------------
 * Core truth model:
 *
 *   time → sessions → segments → angles → SVG
 *
 * Rules:
 * - Ring is rebuilt from truth every tick
 * - No internal state inside the ring
 * - Animation is cosmetic only
 * - Center shows "present", ring shows "history"
 *
 * Converts database time string (HH:MM:SS:ms)
 * into a local timestamp for today.
 *
 * Used to align backend local times with
 * ring orientation (midnight at top).
 **********************************************************/

const DAY_SECONDS = 24 * 60 * 60;

/* ======================================================
 * TIME HELPERS
 * ====================================================== */

// Midnight timestamp of today
function getDayStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

// Convert timestamp → angle (0 → 2π)
function timeToAngle(timestamp, dayStart) {
  const secondsSinceMidnight = (timestamp - dayStart) / 1000;
  return (secondsSinceMidnight / DAY_SECONDS) * 2 * Math.PI;
}

/* ======================================================
 * COLOR LOGIC
 * ====================================================== */

function getRingColor(type, taskColor) {
  return type === "task" ? taskColor : "#ddd";
}

/* ======================================================
 * SESSION → SEGMENTS
 * ====================================================== */

/**
 * Input:
 *   sessions = [{ start, end|null, color }]
 * Output:
 *   ordered segments covering 00:00 → now
 */
export function buildSegments(sessions, now) {
  const segments = [];
  const dayStart = getDayStart();
  let cursor = dayStart;

  // Ensure chronological order
  sessions.sort((a, b) => a.start - b.start);

  for (const s of sessions) {
    const start = s.start;
    const end = s.end ?? now;

    // Idle gap before task
    if (cursor < start) {
      segments.push({
        start: cursor,
        end: start,
        type: "idle"
      });
    }

    // Task segment
    segments.push({
      start,
      end,
      type: "task",
      color: s.color
    });

    cursor = end;
  }

  // Idle after last session
  if (cursor < now) {
    segments.push({
      start: cursor,
      end: now,
      type: "idle"
    });
  }
  
  return segments;
}


/* ======================================================
 * SEGMENTS → ANGLES
 * ====================================================== */

export function segmentsToAngles(segments) {
  const dayStart = getDayStart();

  return segments.map(seg => ({
    startAngle: timeToAngle(seg.start, dayStart),
    endAngle: timeToAngle(seg.end, dayStart),
    color: getRingColor(seg.type, seg.color)
  }));
}

/* ======================================================
 * CENTER STATE
 * ====================================================== */

export function getCurrentStatus(sessions, now) {
  const running = sessions.find(
    s => s.start <= now && (!s.end || s.end >= now)
  );

  return running ? "FOCUSING" : "IDLE";
}

// Format time for center clock
export function formatTime(date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

// Format elapsed time for center clock
export function formatElapsed(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);

  const pad = (n) => n.toString().padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
/* ======================================================
 * PARSING DATABASE STRINGS TO LOCAL TIMESTAMPS
 * ====================================================== */


export function parseToToday(datetimeStr) {
  const [hour, minute, second, mSeconds] = datetimeStr.split(":").map(Number);
      
  // milliseconds since midnight
  return new Date().setHours(hour, minute, second, mSeconds);
}