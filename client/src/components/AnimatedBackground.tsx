import { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  speed: number;
  size: number;
  direction: number;
  color: string;
  alpha: number;
  shape: 'circle' | 'triangle' | 'square';
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: Particle[] = [];
    const particleCount = isMobile ? 30 : Math.min(Math.floor(window.innerWidth / 20), 80);
    const shapes: Array<'circle' | 'triangle' | 'square'> = ['circle', 'triangle', 'square'];
    const colors = ['#00BFFF', '#87CEEB', '#B0E0E6', '#4682B4'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.2 + Math.random() * 0.3,
        size: isMobile ? 2 + Math.random() * 2 : 3 + Math.random() * 3,
        direction: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.1 + Math.random() * 0.4,
        shape: shapes[Math.floor(Math.random() * shapes.length)]
      });
    }

    const drawShape = (ctx: CanvasRenderingContext2D, particle: Particle) => {
      switch (particle.shape) {
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y - particle.size);
          ctx.lineTo(particle.x - particle.size, particle.y + particle.size);
          ctx.lineTo(particle.x + particle.size, particle.y + particle.size);
          ctx.closePath();
          break;
        case 'square':
          ctx.beginPath();
          ctx.rect(
            particle.x - particle.size,
            particle.y - particle.size,
            particle.size * 2,
            particle.size * 2
          );
          break;
        default:
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      }
    };

    const animate = () => {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#2A3B4D');
      gradient.addColorStop(1, '#00BFFF');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.direction += (Math.random() - 0.5) * 0.02;
        particle.x += Math.cos(particle.direction) * particle.speed;
        particle.y += Math.sin(particle.direction) * particle.speed;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        drawShape(ctx, particle);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha;
        ctx.fill();


        ctx.globalAlpha = 1;
      });

      requestAnimationFrame(animate);
    };

    let mouseX = 0;
    let mouseY = 0;
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ opacity: 0.9 }}
    />
  );
}