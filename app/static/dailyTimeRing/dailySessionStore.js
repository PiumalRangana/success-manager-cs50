/**********************************************************
 * DAILY TIME RING – SESSION STORE
 * --------------------------------------------------------
 * Manages today's session data with a pub/sub pattern.
 *
 * Responsibilities:
 * - Fetch today's focus sessions from the API
 * - Parse ISO datetime strings to milliseconds
 * - Store sessions in memory
 * - Notify subscribers when data changes
 * - Provide read-only access to session data
 *
 * Does NOT:
 * - Contain rendering logic
 * - Contain time calculations
 **********************************************************/

/* ======================================================
 * ISO DATETIME → MILLISECONDS
 * ====================================================== */
export function isoToMillis(dateTimeIsoFormat) {
  return new Date(dateTimeIsoFormat).getTime();
}

/* ======================================================
 * STATE
 * ====================================================== */

let listeners = [];
let sessions = [];

/* ======================================================
 * LOAD & FETCH
 * ====================================================== */

/**
 * Fetch today's sessions from server API.
 * Parses ISO datetimes to milliseconds and notifies subscribers.
 */
export async function loadTodaySessions() {
  const res = await fetch('/api/sessions/daily', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await res.json();

    sessions = data.map(item => ({
      start: isoToMillis(item.start_time),
      end: item.end_time ? isoToMillis(item.end_time) : null,
      color: item.color
  }));
  notify();
  return sessions;
};

/* ======================================================
 * READ ACCESS
 * ====================================================== */

/**
 * Get current sessions from memory.
 * Returns the last successfully loaded session data.
 */
export function getTodaySessions() {
  return sessions;
}

/* ======================================================
 * PUB/SUB PATTERN
 * ====================================================== */

/**
 * Subscribe to session changes.
 * Callback receives updated sessions array when data loads.
 * Returns unsubscribe function.
 */
export function subscribe(fn) {
  listeners.push(fn);

  return () => {
    listeners = listeners.filter(l => l !== fn);
  };
}

/**
 * Notify all subscribers of changes.
 * Called when new session data is loaded.
 */
function notify() {
  listeners.forEach(fn => fn(sessions));
}