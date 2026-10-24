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

function setTimerFeedback(message, type = "danger") {
  const feedback = document.getElementById("timer-feedback");

  if (!feedback) {
    return;
  }

  feedback.textContent = message;
  feedback.className = `alert alert-${type} mt-3`;
  feedback.hidden = false;
}

function clearTimerFeedback() {
  const feedback = document.getElementById("timer-feedback");

  if (feedback) {
    feedback.hidden = true;
    feedback.textContent = "";
  }
}

async function throwIfRequestFailed(response, fallbackMessage) {
  if (response.ok) {
    return;
  }

  const responseData = await response.json().catch(() => null);
  throw new Error(responseData?.error || fallbackMessage);
}

function setTimerButtonsDisabled(disabled) {
  document.querySelectorAll('.timer_button').forEach(button => {
    button.disabled = disabled;
  });
}

/**
 * Start a focus session for the given task.
 * Sends a request to the server and displays its error message when the
 * server rejects the request, such as when another timer is already running.
 */
async function startTimer(taskId) {
  clearTimerFeedback();

  try {
    const response = await fetch('/timer/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_id: taskId })
    });

    await throwIfRequestFailed(response, 'Unable to start the timer. Please try again.');
  } catch (error) {
    console.error('Error starting timer:', error);
    setTimerFeedback(error.message);
    return;
  }

  setTimerButtonsDisabled(true);

  try {
    await loadTodaySessions();
  } catch (error) {
    console.error('Error refreshing timer display:', error);
    setTimerFeedback('Timer started, but the display could not refresh. Please reload the page.', 'warning');
  }
}

/**
 * Stop the current focus session.
 * Keeps the Start buttons disabled unless the server confirms that the timer
 * was stopped, so a failed request cannot create a misleading UI state.
 */
async function stopTimer() {
  clearTimerFeedback();

  try {
    const response = await fetch('/timer/stop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    await throwIfRequestFailed(response, 'Unable to stop the timer. Please try again.');
  } catch (error) {
    console.error('Error stopping timer:', error);
    setTimerFeedback(error.message);
    return;
  }

  setTimerButtonsDisabled(false);

  try {
    await loadTodaySessions();
  } catch (error) {
    console.error('Error refreshing timer display:', error);
    setTimerFeedback('Timer stopped, but the display could not refresh. Please reload the page.', 'warning');
  }
}

/* ======================================================
 * GLOBAL EXPORTS
 * ====================================================== */

// Make it accessible globally
window.startTimer = startTimer;
window.stopTimer = stopTimer;
