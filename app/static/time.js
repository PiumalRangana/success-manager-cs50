import { loadTodaySessions } from "./dailyTimeRing/dailySessionStore.js";

// start timer intent
// send the intention of starting the timer to the server
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
    // refresh the time ring to reflect the new session started
    document.querySelectorAll('.timer_button').forEach(btn => {
      btn.disabled = true;
    })
    loadTodaySessions()
  })
  .catch(error => {
    console.error('Error starting timer:', error);
  });
}
// Send the intention to stop the timer
function stopTimer() {
  fetch('/timer/stop', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
  .then(response => {
    // Optionally check response.ok or parse JSON here
    document.querySelectorAll('.timer_button').forEach(btn => {
      btn.disabled = false;
    })
    loadTodaySessions()
  })
  .catch(error => {
    console.error('Error stopping timer:', error);
  });
}

// Make it accessible globally
window.startTimer = startTimer;
window.stopTimer = stopTimer;