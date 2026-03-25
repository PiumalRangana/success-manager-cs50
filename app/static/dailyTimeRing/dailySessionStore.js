import { parseToToday } from "./chartDataPipeline.js";

let listeners = [];
let sessions = [];

export async function loadTodaySessions() {
  const res = await fetch('/api/sessions/today', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await res.json();

  sessions = data.map(item => ({
    start: parseToToday(item.start_time),
    end: item.end_time ? parseToToday(item.end_time) : null,
    color: item.color
  }));
    notify();
    return sessions;
}

export function getTodaySessions() {
  return sessions;
}

export function subscribe(fn) {
  listeners.push(fn);

  return () => {
    listeners = listeners.filter(l => l !== fn);
  };
}

function notify() {
  listeners.forEach(fn => fn(sessions));
}