import { parseToToday } from "./chartDataPipeline.js";

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
    return sessions;
}

export function getTodaySessions() {
  return sessions;
}