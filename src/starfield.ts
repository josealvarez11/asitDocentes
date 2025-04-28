// src/starfield.ts

export type Star = { x: number; y: number; z: number; r: number; vx: number; vy: number };

// Utilitario: rango aleatorio
function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// Configuración dinámica
const NUM_STARS = 500;
const FRICTION = 0.96;    // fricción para inercia
const DRIFT = 0.1;        // deriva suave aleatoria
const PUSH_FACTOR = 0.3;  // impulso al soplar con el cursor

// Canvas
const canvas = document.getElementById("stars") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
let w = window.innerWidth;
let h = window.innerHeight;
canvas.width = w;
canvas.height = h;

// Estado
let stars: Star[] = [];
let isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

// Detectar cambio de esquema de color
window.matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => { isDark = e.matches; });

// Inicializar estrellas con velocidad propia
function init() {
  stars = [];
  for (let i = 0; i < NUM_STARS; i++) {
    stars.push({
      x: randomRange(0, w),
      y: randomRange(0, h),
      z: randomRange(0.2, 1),
      r: randomRange(0.5, 1.5),
      vx: randomRange(-0.2, 0.2),
      vy: randomRange(-0.2, 0.2),
    });
  }
}
init();

// Adaptar al cambiar el tamaño
window.addEventListener("resize", () => {
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
  init();
});

// Al mover el cursor: sopla a las estrellas
document.addEventListener("mousemove", (e) => {
  const dx = -e.movementX * PUSH_FACTOR;
  const dy = -e.movementY * PUSH_FACTOR;
  for (const s of stars) {
    // Aplica impulso según profundidad
    s.vx += dx * s.z;
    s.vy += dy * s.z;
  }
});

// Bucle de animación
function tick() {
  ctx.clearRect(0, 0, w, h);

  for (const s of stars) {
    // Deriva aleatoria suave
    s.vx += randomRange(-DRIFT, DRIFT) * s.z;
    s.vy += randomRange(-DRIFT, DRIFT) * s.z;

    // Actualiza posición
    s.x += s.vx;
    s.y += s.vy;

    // Envolver en bordes
    if (s.x < 0) s.x += w;
    if (s.x > w) s.x -= w;
    if (s.y < 0) s.y += h;
    if (s.y > h) s.y -= h;

    // Dibuja estrella
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? "#ffffff" : "#000000";
    ctx.fill();

    // Fricción para inercia
    s.vx *= FRICTION;
    s.vy *= FRICTION;
  }

  requestAnimationFrame(tick);
}

tick();
