export function initStarscape() {
    const canvas = document.getElementById('stars');
    if (!canvas) {
      console.error("Canvas element with id 'stars' not found");
      return;
    }
  
    const ctx = canvas.getContext('2d');
    let width, height;
  
    // Resize canvas to fit the window
    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
  
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
  
    const stars = [];
    const numStars = 500;
  
    // Initialize stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.5,
      });
    }
  
    // Update and draw stars
    function animate() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#ffffff';
  
      stars.forEach(star => {
        star.y += star.speed;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });
  
      requestAnimationFrame(animate);
    }
  
    animate();
  
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }
  