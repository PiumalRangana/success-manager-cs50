import { parseToToday, testParse } from "./chartDataPipeline.js";

let listeners = [];
let sessions = [];


// testing
let testSessions = [];

export async function callTestRoute() {
  const res = await fetch('/api/chart/sessions', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await res.json();

    testSessions = data.map(item => ({
      start: testParse(item.start_time),
      end: item.end_time ? testParse(item.end_time) : null,
      color: item.color
  }));
  notify();
  console.log("Test route data:", testSessions);
  return testSessions;
};


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
  console.log("Today's sessions data:", sessions);
  return sessions;
}

export function getTodaySessions() {
  return testSessions;
}

export function subscribe(fn) {
  listeners.push(fn);

  return () => {
    listeners = listeners.filter(l => l !== fn);
  };
}

function notify() {
  listeners.forEach(fn => fn(testSessions));
}