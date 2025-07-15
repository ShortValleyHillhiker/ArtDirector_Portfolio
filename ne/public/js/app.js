(() => {
  // ns-hugo-imp:C:\Users\travi\Desktop\AOE-Final\assets\js\halftone\config.js
  var CONFIG = {
    spacing: 16,
    baseRadius: 4,
    rippleWidth: 24,
    rippleSpeed: 14,
    dragCooldown: 50,
    maxRipples: 25,
    fadeFactor: 0.9,
    frameRate: 12
  };

  // ns-hugo-imp:C:\Users\travi\Desktop\AOE-Final\assets\js\halftone\grid-utils.js
  function createGrid(canvas, spacing3, dotRadius = CONFIG.baseRadius) {
    const grid = [];
    const usableWidth = canvas.width - 2 * dotRadius;
    const usableHeight = canvas.height - 2 * dotRadius;
    const cols = Math.floor(usableWidth / spacing3);
    const rows = Math.floor(usableHeight / spacing3);
    const totalGridWidth = cols * spacing3;
    const totalGridHeight = rows * spacing3;
    const offsetX = (canvas.width - totalGridWidth) / 2;
    const offsetY = (canvas.height - totalGridHeight) / 2;
    for (let y = 0; y <= rows; y++) {
      for (let x = 0; x <= cols; x++) {
        grid.push({
          x: offsetX + x * spacing3,
          y: offsetY + y * spacing3
        });
      }
    }
    return grid;
  }
  function drawDotGrid(ctx, grid, getRadius) {
    let color = "#eee";
    const canvas = ctx.canvas;
    const main = document.querySelector("main");
    if (canvas.classList.contains("theme-aware") && main?.classList.contains("inverted")) {
      color = "#1c1c1c";
    }
    if (canvas.classList.contains("theme-dark")) {
      color = "#eee";
    }
    ctx.fillStyle = color;
    for (let i = 0; i < grid.length; i++) {
      const { x, y } = grid[i];
      const r = getRadius(grid[i]);
      if (r <= 0) continue;
      ctx.beginPath();
      ctx.arc(Math.round(x), Math.round(y), r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  function resizeCanvasAndGrid(canvas, spacing3, dotRadius = CONFIG.baseRadius) {
    const wrapper = canvas.parentElement;
    canvas.width = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;
    return createGrid(canvas, spacing3, dotRadius);
  }

  // ns-hugo-imp:C:\Users\travi\Desktop\AOE-Final\assets\js\halftone\image-utils.js
  function getBrightnessAt(imageData, x, y, width) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const idx = (iy * width + ix) * 4;
    const [r, g, b] = imageData.data.slice(idx, idx + 3);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }

  // ns-hugo-imp:C:\Users\travi\Desktop\AOE-Final\assets\js\halftone\halftone.js
  var { spacing, baseRadius } = CONFIG;
  var frameInterval = 1e3 / 12;
  var totalSteps = 10;
  function setupHalftoneCanvas(canvas) {
    const ctx = canvas.getContext("2d");
    const wrapper = canvas.parentElement;
    const source = wrapper.querySelector("img");
    if (!source) return;
    const hidden = document.createElement("canvas");
    const hctx = hidden.getContext("2d", { willReadFrequently: true });
    let grid = [], imageData = null;
    let progress = 0;
    let animating = false, hasAnimated = false;
    let lastFrame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawDotGrid(ctx, grid, ({ x, y }) => {
        const b = getBrightnessAt(imageData, x, y, canvas.width);
        const scale = 1 + (1 - b - 1) * progress;
        return Math.round(baseRadius * scale * 2);
      });
    };
    const renderImage = () => {
      hctx.drawImage(source, 0, 0, canvas.width, canvas.height);
      imageData = hctx.getImageData(0, 0, canvas.width, canvas.height);
    };
    const resize = () => {
      grid = resizeCanvasAndGrid(canvas, spacing);
      hidden.width = canvas.width;
      hidden.height = canvas.height;
      if (source.complete && source.naturalWidth) renderImage();
    };
    const animate = (ts) => {
      if (ts - lastFrame >= frameInterval) {
        lastFrame = ts;
        progress = Math.min(progress + 1 / totalSteps, 1);
        draw();
        if (progress >= 1) {
          animating = false;
          hasAnimated = true;
          return;
        }
      }
      if (animating) requestAnimationFrame(animate);
    };
    const start = () => {
      if (animating || hasAnimated) return;
      animating = true;
      progress = 0;
      requestAnimationFrame(animate);
    };
    source.onload = () => {
      resize();
      draw();
    };
    if (source.complete && source.naturalWidth) {
      resize();
      draw();
    }
    window.addEventListener("resize", () => {
      resize();
      draw();
    });
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        setTimeout(start, 350);
      }
    }, { threshold: 0.1 }).observe(canvas);
  }
  function initHalftoneCanvases() {
    document.querySelectorAll("canvas.ripple-canvas.halftone").forEach(setupHalftoneCanvas);
  }

  // ns-hugo-imp:C:\Users\travi\Desktop\AOE-Final\assets\js\halftone\ripplecanvas.js
  var {
    spacing: spacing2,
    baseRadius: baseRadius2,
    rippleWidth,
    rippleSpeed,
    dragCooldown,
    maxRipples,
    fadeFactor,
    frameRate
  } = CONFIG;
  var frameInterval2 = 1e3 / frameRate;
  function setupRippleCanvas(canvas) {
    const ctx = canvas.getContext("2d");
    const isTouch = canvas.classList.contains("touch");
    const isAuto = canvas.classList.contains("automatic");
    const isLoop = canvas.classList.contains("loop");
    let grid = resizeCanvasAndGrid(canvas, spacing2);
    let ripples = [];
    let lastFrame = 0;
    let dragging = false;
    let lastDrag = 0;
    let animating = false;
    let inView = true;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawDotGrid(ctx, grid, ({ x, y }) => {
        let scale = 1;
        for (const r of ripples) {
          if (r.alpha < 0.01) continue;
          const dx = x - r.x, dy = y - r.y;
          if (Math.abs(dx) > r.radius + rippleWidth || Math.abs(dy) > r.radius + rippleWidth) continue;
          const d2 = dx * dx + dy * dy;
          const min = r.radius - rippleWidth, max = r.radius + rippleWidth;
          if (d2 < min * min || d2 > max * max) continue;
          const d = Math.sqrt(d2), diff = Math.abs(d - r.radius);
          scale += (1 - diff / rippleWidth) * r.alpha * 2;
        }
        return Math.round(baseRadius2 * scale);
      });
    };
    const animate = (ts) => {
      if (ts - lastFrame >= frameInterval2) {
        lastFrame = ts;
        draw();
        ripples = ripples.map((r) => ({
          ...r,
          radius: r.radius + rippleSpeed,
          alpha: r.alpha * fadeFactor
        })).filter((r) => r.alpha > 0.01);
        if (isAuto && Math.random() < 0.1) addRipple(Math.random() * canvas.width, Math.random() * canvas.height);
        if (isLoop && ripples.length === 0) addRipple(canvas.width / 2, canvas.height / 2);
      }
      const needsAnim = inView && (ripples.length || isAuto || isLoop || isTouch && dragging);
      if (needsAnim) requestAnimationFrame(animate);
      else animating = false;
    };
    const addRipple = (x, y) => {
      if (!inView) return;
      if (ripples.length >= maxRipples) ripples.shift();
      ripples.push({ x, y, radius: 0, alpha: 1 });
      if (!animating) {
        animating = true;
        requestAnimationFrame(animate);
      }
    };
    if (isTouch) {
      canvas.addEventListener("pointerdown", (e) => {
        dragging = true;
        const r = canvas.getBoundingClientRect();
        addRipple(e.clientX - r.left, e.clientY - r.top);
        lastDrag = Date.now();
      });
      canvas.addEventListener("pointerup", () => dragging = false);
      canvas.addEventListener("pointermove", (e) => {
        if (!dragging || Date.now() - lastDrag < dragCooldown) return;
        const r = canvas.getBoundingClientRect();
        addRipple(e.clientX - r.left, e.clientY - r.top);
        lastDrag = Date.now();
      });
    }
    window.addEventListener("resize", () => {
      clearTimeout(canvas._resizeTimeout);
      canvas._resizeTimeout = setTimeout(() => {
        grid = resizeCanvasAndGrid(canvas, spacing2);
        draw();
      }, 250);
    });
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView && !animating) {
        animating = true;
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.1 }).observe(canvas);
    draw();
    if (!animating) {
      animating = true;
      requestAnimationFrame(animate);
    }
  }
  function initRippleCanvases() {
    document.querySelectorAll("canvas.ripple-canvas:not(.halftone)").forEach(setupRippleCanvas);
  }

  // <stdin>
  var swup = new Swup();
  function initExpanders() {
    document.querySelectorAll(".expander-toggle").forEach((button) => {
      const target = document.getElementById(button.dataset.target);
      if (target) {
        button.addEventListener("click", () => {
          target.classList.toggle("hidden");
        });
      }
    });
  }
  document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector("canvas.halftone")) {
      initHalftoneCanvases();
    }
    initRippleCanvases();
    initExpanders();
    const target = document.querySelector(".page-bottom");
    const header = document.querySelector("header");
    if (target && header) {
      const headerHeight = header.offsetHeight;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            document.body.classList.add("nav-inverted");
          } else {
            document.body.classList.remove("nav-inverted");
          }
        },
        {
          root: null,
          threshold: 0,
          // bottom margin = viewport - header height
          // this delays the intersection until the element reaches that point
          rootMargin: `0px 0px -${window.innerHeight - headerHeight * 0.95}px 0px`
        }
      );
      observer.observe(target);
    }
  });
  swup.hooks.on("page:view", ({ visit }) => {
    if (document.querySelector("canvas.halftone")) {
      initHalftoneCanvases();
    }
    initRippleCanvases();
    initExpanders();
  });
})();
