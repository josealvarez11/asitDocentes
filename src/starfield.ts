type Star = { x: number; y: number; z: number; r: number };

const canvas = document.getElementById("stars") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
let stars: Star[] = [];
let w = innerWidth;
let h = innerHeight;
canvas.width = w;
canvas.height = h;

const num = 500;

// Variable para saber si estamos en modo oscuro
let isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

// Escuchar cambios de tema en tiempo real
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    isDark = e.matches;
  });

function init() {
  stars = [];
  for (let i = 0; i < num; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 1 + 0.2,
      r: Math.random() * 1.2,
    });
  }
}

init();

window.addEventListener("resize", () => {
  w = innerWidth;
  h = innerHeight;
  canvas.width = w;
  canvas.height = h;
  init();
});

let mouseX = 0,
  mouseY = 0;
window.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = (e.clientX - rect.left) / w - 0.5;
  mouseY = (e.clientY - rect.top) / h - 0.5;
});

function tick() {
  ctx.clearRect(0, 0, w, h);
  for (const s of stars) {
    const nx = s.x + mouseX * 50 * s.z;
    const ny = s.y + mouseY * 50 * s.z;
    ctx.beginPath();
    ctx.arc(nx, ny, s.r, 0, Math.PI * 2);
    // Pintar estrellas blancas en modo oscuro, negras en modo claro
    ctx.fillStyle = isDark ? "#ffffff" : "#000000";
    ctx.fill();
  }
  requestAnimationFrame(tick);
}

tick();
