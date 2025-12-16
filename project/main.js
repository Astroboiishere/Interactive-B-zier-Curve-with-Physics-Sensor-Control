const canvas = document.getElementById('bezierCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const P0 = { x: width * 0.1, y: height * 0.5 };   
const P3 = { x: width * 0.9, y: height * 0.5 };

const P1 = {
  pos: { x: width * 0.3, y: height * 0.3 },
  vel: { x: 0, y: 0 },
  target: { x: width * 0.3, y: height * 0.3 }
};
const P2 = {
  pos: { x: width * 0.7, y: height * 0.7 },
  vel: { x: 0, y: 0 },
  target: { x: width * 0.7, y: height * 0.7 }
};
const k = 40;
const damping = 12;  
function bezierPoint(t, P0, P1, P2, P3) {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;
  const x =  uuu * P0.x + 3 * uu * t * P1.x +  3 * u * tt * P2.x + ttt * P3.x;
  const y = uuu * P0.y + 3 * uu * t * P1.y + 3 * u * tt * P2.y + ttt * P3.y;
  return { x, y };
}
function bezierTangent(t, P0, P1, P2, P3) {
  const u = 1 - t;
  const x = 3 * u * u * (P1.x - P0.x) + 6 * u * t * (P2.x - P1.x) + 3 * t * t * (P3.x - P2.x);
  const y = 3 * u * u * (P1.y - P0.y) + 6 * u * t * (P2.y - P1.y) + 3 * t * t * (P3.y - P2.y);
  return { x, y };
}
function updateSpring(point, dt) {
  const dx = point.pos.x - point.target.x;
  const dy = point.pos.y - point.target.y;
  const ax = -k * dx - damping * point.vel.x;
  const ay = -k * dy - damping * point.vel.y;
  point.vel.x += ax * dt;
  point.vel.y += ay * dt;
  point.pos.x += point.vel.x * dt;
  point.pos.y += point.vel.y * dt;
}
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  P1.target.x = mx;
  P1.target.y = my;
  P2.target.x = mx;
  P2.target.y = height - my;
});

function drawPoint(p, color, radius = 5) {
  ctx.beginPath();
  ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}
function drawTangent(p, tan) {
  const len = Math.hypot(tan.x, tan.y) || 1;
  const nx = tan.x / len;
  const ny = tan.y / len;
  const L = 50;
  ctx.beginPath();
  ctx.moveTo(p.x - nx * L / 2, p.y - ny * L / 2);
  ctx.lineTo(p.x + nx * L / 2, p.y + ny * L / 2);
  ctx.strokeStyle = 'green';
  ctx.lineWidth = 1;
  ctx.stroke();
}
function drawCurve() {
  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();
  let first = true;
  for (let t = 0; t <= 1.0001; t += 0.01) {
    const p = bezierPoint(t, P0, P1.pos, P2.pos, P3);
    if (first) {
      ctx.moveTo(p.x, p.y);
      first = false;
    } else {
      ctx.lineTo(p.x, p.y);
    }
  }
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 2;
  ctx.stroke();
  drawPoint(P0, 'red');
  drawPoint(P1.pos, 'yellow');
  drawPoint(P2.pos, 'yellow');
  drawPoint(P3, 'red');
  const sampleTs = [0.0, 0.25, 0.5, 0.75, 1.0];
  sampleTs.forEach(t => {
    const p = bezierPoint(t, P0, P1.pos, P2.pos, P3);
    const tan = bezierTangent(t, P0, P1.pos, P2.pos, P3);
    drawTangent(p, tan);
  });
}

let lastTime = performance.now();
function loop(now) {
  const dt = (now - lastTime) / 1000; 
  lastTime = now;
  const clampedDt = Math.min(dt, 0.033);
  updateSpring(P1, clampedDt);
  updateSpring(P2, clampedDt);
  drawCurve();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
