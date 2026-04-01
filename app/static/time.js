/**********************************************************
 * TIMER CONTROL
 * --------------------------------------------------------
 * Handles timer start/stop operations.
 *
 * Responsibilities:
 * - Send timer control requests to the server
 * - Refresh session data after state changes
 * - Manage UI button disabled state
 *
 * Does NOT:
 * - Render the daily time ring (separate module)
 * - Calculate time values
 **********************************************************/

import { loadTodaySessions } from "./dailyTimeRing/dailySessionStore.js";

/* ======================================================
 * TIMER CONTROL
 * ====================================================== */

/**
 * Start a focus session for the given task.
 * Sends request to server, disables buttons, and refreshes ring.
 */
function startTimer(taskId) {
  fetch('/timer/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task_id: taskId })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Timer already running");
    }
    return response.json();
  })
  .then(() => {
    // Disable buttons and refresh the time ring
    document.querySelectorAll('.timer_button').forEach(btn => {
      btn.disabled = true;
    })
    loadTodaySessions()
  })
  .catch(error => {
    console.error('Error starting timer:', error);
  });
}

/**
 * Stop the current focus session.
 * Sends request to server, enables buttons, and refreshes ring.
 */
function stopTimer() {
  fetch('/timer/stop', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
  .then(response => {
    // Enable buttons and refresh the time ring
    document.querySelectorAll('.timer_button').forEach(btn => {
      btn.disabled = false;
    })
    loadTodaySessions()
  })
  .catch(error => {
    console.error('Error stopping timer:', error);
  });
}

/* ======================================================
 * GLOBAL EXPORTS
 * ====================================================== */

// Make it accessible globally
window.startTimer = startTimer;
window.stopTimer = stopTimer;