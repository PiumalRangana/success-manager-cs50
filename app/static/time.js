// start timer intent
// send the intention of starting the timer to the server
function startTimer(taskId) {
  fetch('/timer/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task_id: taskId })
  })
  .then(response => {
    // refresh the time ring to reflect the new session started
    renderDailyChart();
    document.querySelectorAll('.timer_button').forEach(btn => {
      btn.disabled = true;
    })
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
    renderDailyChart();
    document.querySelectorAll('.timer_button').forEach(btn => {
      btn.disabled = false;
    })
  })
  .catch(error => {
    console.error('Error stopping timer:', error);
  });
}