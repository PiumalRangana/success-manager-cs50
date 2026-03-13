// start timer intent
// send the intention of starting the timer to the server
function startTimer(taskId) {
  fetch('/timer/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task_id: taskId })
  })
  .then(res => res.json())
  .then(data => {
  const startTime = new Date(data.start_time)

  startVisualTimer(startTime)
})
}

// Send the intention to stop the timer
function stopTimer(){

    stopVisualTimer()

    fetch('/timer/stop', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })

  .then(res => res.json())
  .then(data => {
    console.log(data.duration)
    })
  }
