setInterval(() => {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString();
}, 1000);
