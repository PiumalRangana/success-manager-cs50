// Wait until the DOM (HTML structure) is fully loaded before running JS
document.addEventListener("DOMContentLoaded", () => {

  // ================= Toggle Password Visibility =================
  const togglePassword = document.getElementById("togglePassword"); // Eye icon for password field
  const passwordInput = document.getElementById("password");        // Password input field

  // When the eye icon is clicked, toggle between "password" and "text" type
  togglePassword.addEventListener("click", () => {
    const type = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = type;

    // Switch the icon between "eye" and "eye-slash"
    togglePassword.classList.toggle("bi-eye");
    togglePassword.classList.toggle("bi-eye-slash");
  });


  // ================= Toggle Confirm Password Visibility =================
  const toggleConfirmPassword = document.getElementById("toggleConfirmPassword"); // Eye icon for confirm password
  const confirmPasswordInput = document.getElementById("confirm_password");       // Confirm password input field

  // When the eye icon is clicked, toggle between "password" and "text" type
  toggleConfirmPassword.addEventListener("click", () => {
    const type = confirmPasswordInput.type === "password" ? "text" : "password";
    confirmPasswordInput.type = type;

    // Switch the icon between "eye" and "eye-slash"
    toggleConfirmPassword.classList.toggle("bi-eye");
    toggleConfirmPassword.classList.toggle("bi-eye-slash");
  });
  // ================= Confirm password Validation =================
  const registerForm = document.getElementById("registerForm");
  const errorField = document.getElementById("errorField")
  registerForm.addEventListener("submit", (e) => {
    if (passwordInput.value !== confirmPasswordInput.value) {
      e.preventDefault(); // stop form from submitting
      errorField.textContent = "Passwords do not match!";
      confirmPasswordInput.focus();
    }
  });
})


// timer
function updateTimer(elapsed) {
  const totalSeconds = Math.floor(elapsed / 1000)
  const seconds = totalSeconds % 60
  const minutes = Math.floor(totalSeconds / 60) % 60
  const hours = Math.floor(totalSeconds / 3600)
  document.getElementById('timer').textContent = hours + ":" + minutes + ":" + seconds
}

// store running timer id
let intervalId = null;

function startVisualTimer(startTime) {
  if (intervalId) return;
  
  document.getElementById('timer').textContent = "0:0:0"
  document.getElementById('timer').hidden = false
  document.getElementById('stopTimerButton').hidden = false
  document.querySelectorAll('.timer_button').forEach(btn => {
    btn.disabled = true
  })
  intervalId = setInterval(() => {
    const elapsed = new Date()- startTime;
    updateTimer(elapsed)
  }, 1000)
}

function stopVisualTimer() {
  document.getElementById("stopTimerButton").hidden = true
  document.getElementById("timer").hidden = true
  document.querySelectorAll('.timer_button').forEach(btn => {
    btn.disabled = false
  document.getElementById('timer').textContent = "0:0:0"
  })
  clearInterval(intervalId);
  intervalId = null;
}

  // If a timer is running when the user logs in or refresh the page, this will show the running timer and the stop button.
document.addEventListener("DOMContentLoaded", () => {
  const timerEl = document.getElementById("running-timer");

  if (timerEl) {

    const startedTime = new Date(timerEl.dataset.startedTime);
    startVisualTimer(startedTime);
  }
});