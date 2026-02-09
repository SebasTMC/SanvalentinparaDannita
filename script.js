// ==============================
// CONFIG
// ==============================
const START_DATE = new Date(2023, 11, 18, 0, 0, 0); // 18/12/2023

// Contador al día REAL
const USE_FIXED_NOW = false;
const FIXED_NOW = new Date(2026, 1, 14, 0, 0, 0);
function getNow(){ return USE_FIXED_NOW ? FIXED_NOW : new Date(); }

// ==============================
// ELEMENTS
// ==============================
const overlay = document.getElementById("startOverlay");
const startBtn = document.getElementById("startBtn");
const msgEl = document.getElementById("msg");
const timeEl = document.getElementById("time");

const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d", { alpha: false });

function pad(n){ return String(n).padStart(2,"0"); }
function rand(min, max){ return Math.random() * (max - min) + min; }
function randi(min, max){ return Math.floor(rand(min, max+1)); }
function pick(arr){ return arr[randi(0, arr.length-1)]; }

// ==============================
// TIMER
// ==============================
let timerInterval = null;

function computeDiff(){
  const now = getNow();
  let diff = now - START_DATE;
  if (diff < 0) diff = 0;

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return { days, hours, mins, secs };
}

function updateTimer(){
  const { days, hours, mins, secs } = computeDiff();
  timeEl.textContent = `${days} días ${pad(hours)} horas ${pad(mins)} minutos ${pad(secs)} segundos`;
  return days;
}

// ==============================
// MESSAGE
// ==============================
function buildMessage(days){
  return (
`No todo inició fácil, no todo inició perfecto… pero hace ${days} días que empezamos a hablar esa primera vez.

Desde entonces, sin hacer ruido, te fuiste quedando en mi rutina: en mis días buenos, en los pesados, en esos ratitos donde solo quiero respirar y sentir paz. Te has vuelto mi persona, mi día a día; y si pudiera elegir un lugar, sería a tu lado.

Si pudiera elegir un lugar seguro, sería a tu lado.
Contigo se siente como hogar: calma, sonrisa y esa tranquilidad de “aquí sí”.

Quiero que este año sea lindo contigo. Que nos pasen cosas bonitas, que tengamos momentos simples pero inolvidables, y que también sepamos cuidarnos cuando no estemos en nuestro mejor día.

Y si alguna vez hay peleas o discusiones, que nunca se nos olvide lo más importante: se habla, se entiende, se cuida y se resuelve. Que el orgullo no sea más grande que el cariño. Que podamos pedir perdón, tomar la mano del otro y volver a construir, porque tú vales la pena… y nosotros también.

Cuanto más tiempo estoy contigo, más te amo.
Y no hablo solo de amor bonito: hablo del amor que se queda, del que aprende, del que se esfuerza, del que no se rinde a la primera.

Feliz 14 de febrero, Dhannita.
Gracias por existir, por quedarte, y por hacerme sentir que lo simple puede ser perfecto cuando es contigo.
Ojalá este 2026 nos regale paz, risas, metas cumplidas y muchas razones para seguir eligiéndonos.

Con amor,
Tovi`
  );
}

// ==============================
// TYPEWRITER (y dispara fade del corazón grande)
// ==============================
let typingTimeout = null;
let typingStartedAt = 0; // para que el corazón grande se apague

function typewriter(text, speedMs = 17){
  msgEl.textContent = "";
  msgEl.classList.remove("typingDone");

  typingStartedAt = performance.now(); // 👈 aquí inicia el “apagado” del corazón

  let i = 0;
  const step = () => {
    if (i >= text.length){
      msgEl.classList.add("typingDone");
      return;
    }
    msgEl.textContent += text[i];
    i++;
    const jitter = (Math.random() < 0.07) ? 55 : 0;
    typingTimeout = setTimeout(step, speedMs + jitter);
  };
  step();
}

// ==============================
// CANVAS
// ==============================
function fitCanvas() {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
const W = () => canvas.getBoundingClientRect().width;
const H = () => canvas.getBoundingClientRect().height;

const PINKS = ["#ff3b30","#ff2d55","#ff5a5f","#ff7eb6","#ff4d6d","#e11d48","#ef4444"];
const BG_TOP = "#ffd6e0";
const BG_MID = "#ffdfe6";
const BG_BOT = "#ffe9ef";

function drawHeart(x, y, s, color, a, rot=0){
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.globalAlpha = a;
  ctx.fillStyle = color;

  ctx.beginPath();
  ctx.moveTo(0, s*0.35);
  ctx.bezierCurveTo(s*0.85, -s*0.05, s*0.85, -s*0.95, 0, -s*0.55);
  ctx.bezierCurveTo(-s*0.85, -s*0.95, -s*0.85, -s*0.05, 0, s*0.35);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawCorner(x, y, dir=1, bottom=false){
  ctx.save();
  ctx.translate(x, y);
  if (bottom) ctx.rotate(Math.PI);
  ctx.globalAlpha = 0.70;

  const colors = ["#ff7eb6","#ff4d6d","#ff5a5f","#ff2d55"];
  for (let i=0; i<4; i++){
    ctx.save();
    ctx.rotate((i*Math.PI/2) * dir);
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 34, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  ctx.fillStyle = "#ffffff";
  ctx.globalAlpha = 0.88;
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI*2);
  ctx.fill();

  // mini hojitas
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = "#ef4444";
  for (let i=0; i<3; i++){
    ctx.save();
    ctx.rotate((i-1)*0.5);
    ctx.beginPath();
    ctx.ellipse(28, -10, 6, 12, 0.6, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

function drawDottedHeart(cx, cy, scale, alpha){
  ctx.save();
  ctx.globalAlpha = alpha;

  const dots = 560;
  for (let i=0; i<dots; i++){
    const t = rand(0, Math.PI*2);
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);

    const k = Math.pow(Math.random(), 0.65);
    const px = cx + x * scale * 0.05 * k + rand(-0.9, 0.9);
    const py = cy - y * scale * 0.05 * k + rand(-0.9, 0.9);

    ctx.fillStyle = pick(PINKS);
    ctx.beginPath();
    ctx.arc(px, py, rand(1.0, 2.2), 0, Math.PI*2);
    ctx.fill();
  }

  // hilo
  ctx.globalAlpha = alpha * 0.45;
  ctx.strokeStyle = "#b91c1c";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy + scale*0.10);
  ctx.quadraticCurveTo(cx + 10, cy + scale*0.24, cx - 6, cy + scale*0.40);
  ctx.stroke();

  ctx.restore();
}

function drawCardBackground(){
  const w = W(), h = H();

  // Gradiente
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, BG_TOP);
  g.addColorStop(0.55, BG_MID);
  g.addColorStop(1, BG_BOT);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // “papel” suave
  ctx.save();
  ctx.globalAlpha = 0.10;
  ctx.fillStyle = "#ffffff";
  for (let i=0; i<160; i++){
    const x = rand(0, w), y = rand(0, h);
    const r = rand(0.6, 1.5);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.restore();

  // Marco
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 6;
  ctx.strokeRect(14, 14, w-28, h-28);
  ctx.globalAlpha = 0.24;
  ctx.lineWidth = 2;
  ctx.strokeRect(26, 26, w-52, h-52);
  ctx.restore();

  // I LOVE YOU centrado arriba
  ctx.save();
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = "#b91c1c";
  ctx.font = "900 22px Nunito, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("I LOVE YOU", w*0.50, 44);
  ctx.restore();

  // esquinas
  drawCorner(w*0.10, 68, 1);
  drawCorner(w*0.90, 68, -1);
  drawCorner(w*0.10, h-78, 1, true);
  drawCorner(w*0.90, h-78, -1, true);

  // ✅ corazón grande: centrado y detrás del “papel” del texto
  // ✅ y se va desvaneciendo después de que empieza a escribirse
  const now = performance.now();
  let alpha = 0.55; // visible al inicio

  if (typingStartedAt > 0){
    const dt = (now - typingStartedAt) / 1000; // segundos desde que empezó a escribir
    // se apaga en ~2.2s
    alpha = Math.max(0, 0.55 * (1 - dt/2.2));
  }

  // posición: arriba del bloque del texto, NO encima del texto (quedará detrás)
  drawDottedHeart(w*0.50, 150, Math.min(w,h)*0.18, alpha);
}

// ==============================
// Falling hearts
// ==============================
let hearts = [];
let animId = null;
let startedAt = 0;

function makeFaller(x, y){
  return {
    x, y,
    s: rand(4, 11),
    vy: rand(0.35, 1.20),
    vx: rand(-0.25, 0.25),
    rot: rand(-0.25, 0.25),
    spin: rand(-0.02, 0.02),
    a: rand(0.22, 0.70),
    c: pick(PINKS),
    wob: rand(0, Math.PI*2),
  };
}

function updateHearts(){
  const w = W(), h = H();
  for (const p of hearts){
    p.wob += 0.06;
    p.x += p.vx + Math.sin(p.wob)*0.30;
    p.y += p.vy;
    p.rot += p.spin;

    drawHeart(p.x, p.y, p.s, p.c, p.a, p.rot);

    if (p.y > h + 20){
      p.x = rand(0, w);
      p.y = rand(-h*0.25, -20);
      p.s = rand(4, 11);
      p.vy = rand(0.35, 1.20);
      p.vx = rand(-0.25, 0.25);
      p.rot = rand(-0.25, 0.25);
      p.spin = rand(-0.02, 0.02);
      p.a = rand(0.22, 0.70);
      p.c = pick(PINKS);
    }
  }
}

function animate(ts){
  if (!startedAt) startedAt = ts;
  const t = (ts - startedAt)/1000;

  drawCardBackground();

  // entrada gradual de corazones que caen
  const target = 60;
  const want = Math.min(target, Math.floor(target * Math.min(1, t/2.0)));
  while (hearts.length < want){
    hearts.push(makeFaller(rand(0, W()), rand(-H(), 0)));
  }

  updateHearts();

  animId = requestAnimationFrame(animate);
}

function startCanvas(){
  fitCanvas();
  hearts = [];
  startedAt = 0;
  animId = requestAnimationFrame(animate);
}

function stopCanvas(){
  if (animId) cancelAnimationFrame(animId);
  animId = null;
}

window.addEventListener("resize", () => {
  fitCanvas();
});

// ==============================
// START FLOW
// ==============================
function startExperience(){
  overlay.classList.add("hidden");

  startCanvas();

  const days = updateTimer();
  timerInterval = setInterval(updateTimer, 1000);

  // resetea apagado del corazón por si recargas
  typingStartedAt = 0;

  typewriter(buildMessage(days), 17);
}

// init
stopCanvas();
fitCanvas();
startBtn.addEventListener("click", startExperience);
