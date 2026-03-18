<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const canvasRef = ref(null);
let animationFrame = null;

class Particle {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.w;
    this.y = Math.random() * this.h;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 2;
    this.alpha = Math.random() * 0.5 + 0.2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > this.w || this.y < 0 || this.y > this.h) {
      this.reset();
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 242, 255, ${this.alpha})`;
    ctx.fill();
  }
}

const init = () => {
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  const w = canvas.width = window.innerWidth;
  const h = canvas.height = window.innerHeight;

  const particles = Array.from({ length: 80 }, () => new Particle(w, h));

  const animate = () => {
    ctx.clearRect(0, 0, w, h);
    
    // Draw connections
    ctx.beginPath();
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 242, 255, ${0.1 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
        }
      }
    }
    ctx.stroke();

    particles.forEach(p => {
      p.update();
      p.draw(ctx);
    });

    animationFrame = requestAnimationFrame(animate);
  };
  
  animate();
};

onMounted(() => {
  init();
  window.addEventListener('resize', init);
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrame);
  window.removeEventListener('resize', init);
});
</script>

<template>
  <canvas ref="canvasRef" class="particle-canvas"></canvas>
</template>

<style scoped>
.particle-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(135deg, #0a1929 0%, #001e3c 100%);
}
</style>
