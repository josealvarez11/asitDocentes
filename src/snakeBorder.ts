export function animateSnakeBorder(frame: HTMLElement) {
    /* ───────── Parámetros ───────── */
    const radius = 16;            // border-radius de .frame
    const thick  = 2;             // grosor de cada píxel
    const step   = thick;         // espaciado igual al grosor
    const speed  = 3;             // pasos por frame (más dinámico)
    const tail   = 60;            // cola ligeramente más larga para efecto
  
    /* ───────── Preparar canvas al ras ───────── */
    const canvas = document.createElement('canvas');
    canvas.width  = frame.clientWidth;
    canvas.height = frame.clientHeight;
    Object.assign(canvas.style, {
      position: 'absolute',
      top: '0', left: '0',
      pointerEvents: 'none', zIndex: '10'
    });
    frame.style.position = 'relative';
    frame.appendChild(canvas);
    const ctx = canvas.getContext('2d')!;
  
    /* ───────── Generar recorrido pixelado con curvas ───────── */
    const path: { x: number; y: number }[] = [];
    const L = thick / 2;
    const T = L;
    const R = canvas.width  - L;
    const B = canvas.height - L;
    const dA = step / radius;
  
    // Secuencia de bordes y esquinas redondeadas
    for (let x = L + radius; x <= R - radius; x += step) path.push({ x, y: T });
    { const cx = R - radius, cy = T + radius; for (let a = 1.5*Math.PI; a <= 2*Math.PI; a += dA) path.push({ x: cx + radius*Math.cos(a), y: cy + radius*Math.sin(a) }); }
    for (let y = T + radius; y <= B - radius; y += step) path.push({ x: R, y });
    { const cx = R - radius, cy = B - radius; for (let a = 0; a <= 0.5*Math.PI; a += dA) path.push({ x: cx + radius*Math.cos(a), y: cy + radius*Math.sin(a) }); }
    for (let x = R - radius; x >= L + radius; x -= step) path.push({ x, y: B });
    { const cx = L + radius, cy = B - radius; for (let a = 0.5*Math.PI; a <= Math.PI; a += dA) path.push({ x: cx + radius*Math.cos(a), y: cy + radius*Math.sin(a) }); }
    for (let y = B - radius; y >= T + radius; y -= step) path.push({ x: L, y });
    { const cx = L + radius, cy = T + radius; for (let a = Math.PI; a <= 1.5*Math.PI; a += dA) path.push({ x: cx + radius*Math.cos(a), y: cy + radius*Math.sin(a) }); }
  
    /* ───────── Animación sorpresa: rainbow pixel trail ───────── */
    let head1 = 0;
    let head2 = Math.floor(path.length / 2);
  
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const timeOffset = performance.now() / 50;  // acelera el cambio de color
  
      [head1, head2].forEach(head => {
        for (let i = 0; i < tail; i++) {
          const idx = (head - i + path.length) % path.length;
          const p = path[idx];
          const alpha = 1 - i / tail;
          // Textura rainbow: varía el hue según posición + tiempo
          const hue = (timeOffset + (i * 360) / tail) % 360;
          ctx.fillStyle = `hsla(${hue.toFixed(1)}, 100%, 50%, ${alpha.toFixed(2)})`;
          ctx.fillRect(p.x - L, p.y - L, thick, thick);
        }
      });
  
      head1 = (head1 + speed) % path.length;
      head2 = (head2 + speed) % path.length;
      requestAnimationFrame(draw);
    }
    draw();
  
    /* ───────── Recalcular al redimensionar ───────── */
    window.addEventListener('resize', () => {
      canvas.remove();
      animateSnakeBorder(frame);
    }, { once: true });
  }
  