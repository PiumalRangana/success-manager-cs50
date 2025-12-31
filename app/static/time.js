// clock time
setInterval(() => {
  const now = new Date();
  let clock =document.getElementById('clock');
  if (clock){
    clock.textContent = now.toLocaleTimeString();
  }
    
}, 1000);

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
  let time_session_id = data.timer_id

  //store the time session id in local storage
  localStorage.setItem("running_time_session_id", time_session_id)

  startVisualTimer(startTime)
})
}

// Send the intention to stop the timer
function stopTimer(){

    stopVisualTimer()

    let time_session_id = localStorage.getItem("running_time_session_id");

    fetch('/timer/stop', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ time_session_id: time_session_id })
  })

  .then(res => res.json())
  .then(data => {
    console.log(data.duration)
    localStorage.removeItem("running_time_session_id");
    })
  }
