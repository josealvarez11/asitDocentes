// src/snakeBorder.ts
export function animateSnakeBorder(frame: HTMLElement) {
    /* ───────── Preparar canvas ───────── */
    const style = getComputedStyle(frame);
    const padLeft   = parseFloat(style.paddingLeft);
    const padRight  = parseFloat(style.paddingRight);
    const padTop    = parseFloat(style.paddingTop);
    const padBottom = parseFloat(style.paddingBottom);
  
    const radius = 16;   // = border-radius en .frame
    const step   = 4;    // “tamaño de píxel”
    const thick  = 2;    // grosor
  
    const canvas = document.createElement('canvas');
    canvas.width  = frame.clientWidth  - padLeft - padRight;
    canvas.height = frame.clientHeight - padTop  - padBottom;
    Object.assign(canvas.style, {
      position: 'absolute',
      left:  `${padLeft}px`,
      top:   `${padTop}px`,
      pointerEvents: 'none',
      zIndex: '10'
    });
    frame.appendChild(canvas);
  
    const ctx = canvas.getContext('2d')!;
    if (!ctx) return;
  
    /* ───────── Generar el recorrido ───────── */
    const path: { x: number; y: number }[] = [];
  
    const L = thick / 2;                     // media línea para que no se corte
    const T = L;
    const R = canvas.width  - L;
    const B = canvas.height - L;
    const dA = step / radius;                // ≈ step px en el arco
  
    // 1. superior (izq → der)
    for (let x = L + radius; x <= R - radius; x += step) path.push({ x, y: T });
  
    // 2. esquina sup-der (⭣ gira N→E : 3π/2 → 2π)
    {
      const cx = R - radius, cy = T + radius;
      for (let a = 1.5 * Math.PI; a <= 2 * Math.PI; a += dA)
        path.push({ x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) });
    }
  
    // 3. derecha (arriba → abajo)
    for (let y = T + radius; y <= B - radius; y += step) path.push({ x: R, y });
  
    // 4. esquina inf-der (gira E→S : 0 → π/2)
    {
      const cx = R - radius, cy = B - radius;
      for (let a = 0; a <= 0.5 * Math.PI; a += dA)
        path.push({ x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) });
    }
  
    // 5. inferior (der → izq)
    for (let x = R - radius; x >= L + radius; x -= step) path.push({ x, y: B });
  
    // 6. esquina inf-izq (gira S→W : π/2 → π)
    {
      const cx = L + radius, cy = B - radius;
      for (let a = 0.5 * Math.PI; a <= Math.PI; a += dA)
        path.push({ x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) });
    }
  
    // 7. izquierda (abajo → arriba)
    for (let y = B - radius; y >= T + radius; y -= step) path.push({ x: L, y });
  
    // 8. esquina sup-izq (gira W→N : π → 3π/2)
    {
      const cx = L + radius, cy = T + radius;
      for (let a = Math.PI; a <= 1.5 * Math.PI; a += dA)
        path.push({ x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) });
    }
  
    /* ───────── Animación ───────── */
    let head = 0;
    const tail = 50;
  
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      for (let i = 0; i < tail; i++) {
        const p = path[(head - i + path.length) % path.length];
        const alpha = 1 - i / tail;
        ctx.fillStyle = `rgba(${255 - i * 5}, ${80 + i * 3}, ${200 - i * 4}, ${alpha})`;
        ctx.fillRect(p.x, p.y, thick, thick);
      }
  
      head = (head + 1) % path.length;
      requestAnimationFrame(draw);
    }
    draw();
  
    /* ───────── Re-generar al redimensionar ───────── */
    window.addEventListener(
      'resize',
      () => {
        canvas.remove();
        animateSnakeBorder(frame); // recalcula con nuevas medidas
      },
      { once: true }
    );
  }
  