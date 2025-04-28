// src/starfield.ts

export type Star = { x: number; y: number; z: number; r: number; vx: number; vy: number };

// Utilitario: rango aleatorio
function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// Configuración dinámica
const NUM_STARS = 500;
const FRICTION = 0.98;    // fricción para inercia
const DRIFT = 0.05;        // deriva suave aleatoria
const PUSH_FACTOR = 0.001;  // impulso al soplar con el cursor
// starfield.ts
const frameEl = document.querySelector('.frame') as HTMLElement;

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
/*function init() {
  stars = [];
  for (let i = 0; i < NUM_STARS; i++) {
    stars.push({
      x: randomRange(0, w),
      y: randomRange(0, h),
      z: randomRange(0.2, 1),
      r: randomRange(0.5, 1.5),
      vx: randomRange(-0.1, 0.1),
      vy: randomRange(-0.1, 0.1),
    });
  }
}
init();
*/
function init() {
  stars = [];
  // calculamos una sola vez el rectángulo de la caja
  const { left, top, right, bottom } = frameEl.getBoundingClientRect();

  for (let i = 0; i < NUM_STARS; i++) {
    let x: number, y: number;
    // vuelve a generar posición hasta que quede FUERA del marco
    do {
      x = randomRange(0, w);
      y = randomRange(0, h);
    } while (x >= left && x <= right && y >= top && y <= bottom);

    stars.push({
      x,
      y,
      z: randomRange(0.2, 1),
      r: randomRange(0.5, 1.5),
      vx: randomRange(-0.1, 0.1),
      vy: randomRange(-0.1, 0.1),
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
 
/*
function tick() {
  ctx.clearRect(0, 0, w, h);

 // Lee la posición y tamaño de la caja central
 const { left, top, right, bottom } = frameEl.getBoundingClientRect();

  for (const s of stars) {
    // deriva aleatoria y actualización de posición (igual que antes)
    s.vx += randomRange(-DRIFT, DRIFT) * s.z;
    s.vy += randomRange(-DRIFT, DRIFT) * s.z;
    s.x  += s.vx;
    s.y  += s.vy;
    if (s.x < 0) s.x += w;  if (s.x > w) s.x -= w;
    if (s.y < 0) s.y += h;  if (s.y > h) s.y -= h;

   // Si la estrella cae dentro de la caja, solo aplicamos fricción y saltamos el dibujo
   if (s.x >= left && s.x <= right && s.y >= top && s.y <= bottom) {
     s.vx *= FRICTION;
     s.vy *= FRICTION;
     continue;
   }

    // Dibuja fuera de la caja
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? "#ffffff" : "#000000";
    ctx.fill();

    // fricción normal
    s.vx *= FRICTION;
    s.vy *= FRICTION;
  }

  requestAnimationFrame(tick);
}
 
*/


// Bucle de animación
function tick() {
  ctx.clearRect(0, 0, w, h);

   // Lee la posición y tamaño de la caja central
   const { left, top, right, bottom } = frameEl.getBoundingClientRect();

  for (const s of stars) {
        // 1) guarda posición previa
    const prevX = s.x;
    const prevY = s.y;


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

       /* Si la estrella cae dentro de la caja, solo aplicamos fricción y saltamos el dibujo
   if (s.x >= left && s.x <= right && s.y >= top && s.y <= bottom) {
     s.vx *= FRICTION;
     s.vy *= FRICTION;
     continue;
   }*/

     

         // 3) colisión con la caja: si quedó dentro, rebotar
    if (s.x >= left && s.x <= right && s.y >= top && s.y <= bottom) {
      
      if (prevX < left && s.x >= left) {
        s.vx = -s.vx;
        s.x = left - (s.x - left);
      } else if (prevX > right && s.x <= right) {
        s.vx = -s.vx;
        s.x = right + (right - s.x);
      }
      
      if (prevY < top && s.y >= top) {
        s.vy = -s.vy;
        s.y = top - (s.y - top);
      } else if (prevY > bottom && s.y <= bottom) {
       s.vy = -s.vy;
        s.y = bottom + (bottom - s.y);
      }
    }

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
