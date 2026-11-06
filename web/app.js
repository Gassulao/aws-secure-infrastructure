"use strict";

const POLL_MS = 5000;
const MAX_POINTS = 30;
const MAX_LOG = 7;

const $ = (id) => document.getElementById(id);
const history = [];
let timer = null;

async function probe(url) {
  const started = performance.now();
  try {
    const res = await fetch(url, { cache: "no-store" });
    const ms = Math.round(performance.now() - started);
    const body = await res.text();
    return { ok: res.ok, status: res.status, ms, body };
  } catch (err) {
    return { ok: false, status: 0, ms: Math.round(performance.now() - started), body: "" };
  }
}

function parseJson(text) {
  try { return JSON.parse(text); } catch (e) { return null; }
}

function formatUptime(total) {
  const s = Math.max(0, Math.floor(total));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const parts = [];
  if (d) parts.push(d + "d");
  if (d || h) parts.push(h + "h");
  parts.push(m + "m");
  if (!d) parts.push(sec + "s");
  return parts.join(" ");
}

function setStatus(ok) {
  $("ring").className = "ring " + (ok ? "ok" : "down");
  $("ring-icon").textContent = ok ? "✓" : "✕";
  $("status-text").textContent = ok ? "Operativo" : "Sin respuesta";
}

function addLog(path, result) {
  const li = document.createElement("li");
  const t = document.createElement("span");
  t.className = "t";
  t.textContent = new Date().toLocaleTimeString("es-ES");
  const p = document.createElement("span");
  p.textContent = path;
  const st = document.createElement("span");
  st.className = result.ok ? "ok" : "err";
  st.textContent = result.status || "ERR";
  const ms = document.createElement("span");
  ms.className = "ms";
  ms.textContent = result.ms + " ms";
  li.append(t, p, st, ms);
  const list = $("log");
  list.prepend(li);
  while (list.children.length > MAX_LOG) list.lastChild.remove();
}

function drawSpark() {
  const svg = $("spark");
  const NS = "http://www.w3.org/2000/svg";
  svg.replaceChildren();

  const defs = document.createElementNS(NS, "defs");
  const grad = document.createElementNS(NS, "linearGradient");
  grad.setAttribute("id", "sparkfill");
  grad.setAttribute("x1", "0"); grad.setAttribute("y1", "0");
  grad.setAttribute("x2", "0"); grad.setAttribute("y2", "1");
  [["0", "0.45"], ["1", "0"]].forEach(([off, op]) => {
    const stop = document.createElementNS(NS, "stop");
    stop.setAttribute("offset", off);
    stop.setAttribute("stop-color", "#38bdf8");
    stop.setAttribute("stop-opacity", op);
    grad.appendChild(stop);
  });
  defs.appendChild(grad);
  svg.appendChild(defs);

  if (history.length < 2) return;
  const W = 600, H = 140, pad = 10;
  const max = Math.max(...history, 10);
  const step = W / (history.length - 1);
  const pts = history.map((v, i) => {
    const x = i * step;
    const y = H - pad - (v / max) * (H - pad * 2);
    return [x, y];
  });
  const line = pts.map(([x, y]) => x.toFixed(1) + "," + y.toFixed(1)).join(" ");
  const area = "0," + H + " " + line + " " + pts[pts.length - 1][0].toFixed(1) + "," + H;

  const a = document.createElementNS(NS, "polygon");
  a.setAttribute("class", "area");
  a.setAttribute("points", area);
  const l = document.createElementNS(NS, "polyline");
  l.setAttribute("class", "line");
  l.setAttribute("points", line);
  svg.append(a, l);
}

function parseNginx(text) {
  const active = /Active connections:\s*(\d+)/.exec(text);
  const totals = /\n\s*(\d+)\s+(\d+)\s+(\d+)/.exec(text);
  const rw = /Reading:\s*(\d+)\s+Writing:\s*(\d+)/.exec(text);
  if (!active) return null;
  return {
    active: active[1],
    requests: totals ? totals[3] : "—",
    reading: rw ? rw[1] : "—",
    writing: rw ? rw[2] : "—",
  };
}

async function refresh() {
  const [health, version, nginx] = await Promise.all([
    probe("/api/health"),
    probe("/api/version"),
    probe("/nginx_status"),
  ]);

  const healthData = parseJson(health.body);
  setStatus(health.ok && healthData && healthData.status === "ok");

  history.push(health.ms);
  if (history.length > MAX_POINTS) history.shift();
  $("latency").textContent = health.ms;
  const avg = Math.round(history.reduce((a, b) => a + b, 0) / history.length);
  $("latency-avg").textContent = avg;
  drawSpark();

  const v = parseJson(version.body);
  if (version.ok && v) {
    $("version").textContent = v.version;
    $("uptime").textContent = formatUptime(v.uptime_seconds);
  } else {
    $("version").textContent = "—";
    $("uptime").textContent = "—";
  }

  const ng = nginx.ok ? parseNginx(nginx.body) : null;
  if (ng) {
    $("ng-active").textContent = ng.active;
    $("ng-requests").textContent = ng.requests;
    $("ng-rw").textContent = ng.reading + " / " + ng.writing;
    $("ng-note").textContent = "GET /nginx_status";
  } else {
    $("ng-active").textContent = "—";
    $("ng-requests").textContent = "—";
    $("ng-rw").textContent = "—";
    $("ng-note").textContent = "/nginx_status no disponible (aún sin configurar)";
  }

  addLog("/api/health", health);
  addLog("/api/version", version);
  $("last-update").textContent = "Actualizado " + new Date().toLocaleTimeString("es-ES");
}

function schedule() {
  clearInterval(timer);
  if ($("auto").checked) timer = setInterval(refresh, POLL_MS);
}

$("refresh").addEventListener("click", refresh);
$("auto").addEventListener("change", schedule);

refresh();
schedule();
