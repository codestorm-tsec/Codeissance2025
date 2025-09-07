// Mobile menu toggle
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");

mobileMenuButton.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      // Close mobile menu if open
      mobileMenu.classList.add("hidden");
    }
  });
});

// Restore default cursor
document.body.style.cursor = "default";

// Handle typewriter animation completion
setTimeout(() => {
  const titleElement = document.querySelector(".typewriter-text");
  if (titleElement) {
    titleElement.classList.add("animation-complete");
  }
}, 6000); // 1s delay + 4s animation + 1s buffer

setTimeout(() => {
  const taglineElement = document.querySelector(".typewriter-tagline");
  if (taglineElement) {
    taglineElement.classList.add("animation-complete");
  }
}, 4000); // 3s animation + 1s buffer

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible", "opacity-100");
      entry.target.classList.remove("opacity-0");

      // Special handling for About section
      if (entry.target.classList.contains("about-section")) {
        entry.target.classList.add("animate");
      }

      // Special handling for Social section
      if (entry.target.classList.contains("social-section")) {
        entry.target.classList.add("animate");
      }
    }
  });
}, observerOptions);

// Observe all fade-in sections
document.querySelectorAll(".fade-in-section").forEach((section) => {
  observer.observe(section);
});

// Animated Background - Full Page with Particle Lines
const canvas = document.getElementById("background-canvas");
const ctx = canvas.getContext("2d");

let mouseX = 0;
let mouseY = 0;

// Set canvas size to cover entire document
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = Math.max(
    document.documentElement.scrollHeight,
    document.documentElement.clientHeight,
    window.innerHeight
  );
}

resizeCanvas();
window.addEventListener("resize", () => {
  resizeCanvas();
  initializeParticles();
});

// Enhanced Particle Lines system for full page coverage
const particles = [];
const particleCount = 140; // Increased for full page coverage
const connectionDistance = 200;
const maxConnections = 4;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
    this.radius = Math.random() * 2.5 + 1;

    // Color based on vertical position (gradient effect)
    const heightRatio = this.y / canvas.height;
    if (heightRatio < 0.25) {
      // Top area - white/light particles
      this.color = `rgba(255, 255, 255, ${0.7 + Math.random() * 0.3})`;
      this.glowColor = "rgba(255, 255, 255, 0.8)";
    } else if (heightRatio < 0.5) {
      // Upper middle - light mixed
      this.color =
        Math.random() > 0.4
          ? `rgba(255, 255, 255, ${0.5 + Math.random() * 0.4})`
          : `rgba(255, 128, 128, ${0.6 + Math.random() * 0.3})`;
      this.glowColor = "rgba(255, 180, 180, 0.6)";
    } else if (heightRatio < 0.75) {
      // Lower middle - red mixed
      this.color =
        Math.random() > 0.3
          ? `rgba(225, 6, 0, ${0.6 + Math.random() * 0.4})`
          : `rgba(255, 100, 100, ${0.5 + Math.random() * 0.4})`;
      this.glowColor = "rgba(225, 6, 0, 0.7)";
    } else {
      // Bottom area - predominantly red particles
      this.color = `rgba(225, 6, 0, ${0.7 + Math.random() * 0.3})`;
      this.glowColor = "rgba(225, 6, 0, 0.9)";
    }

    this.connections = 0;
    this.pulseSpeed = Math.random() * 0.02 + 0.01;
    this.pulseOffset = Math.random() * Math.PI * 2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Mouse interaction with scroll consideration
    const scrollY = window.scrollY || window.pageYOffset;
    const adjustedMouseY = mouseY + scrollY;

    const dx = mouseX - this.x;
    const dy = adjustedMouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 200) {
      const force = (200 - distance) / 200;
      this.vx += (dx / distance) * force * 0.03;
      this.vy += (dy / distance) * force * 0.03;
    }

    // Wrap around screen edges
    if (this.x < -20) this.x = canvas.width + 20;
    if (this.x > canvas.width + 20) this.x = -20;
    if (this.y < -20) this.y = canvas.height + 20;
    if (this.y > canvas.height + 20) this.y = -20;

    // Velocity damping and random movement
    this.vx *= 0.998;
    this.vy *= 0.998;
    this.vx += (Math.random() - 0.5) * 0.02;
    this.vy += (Math.random() - 0.5) * 0.02;

    // Limit velocity
    const maxVel = 2;
    this.vx = Math.max(-maxVel, Math.min(maxVel, this.vx));
    this.vy = Math.max(-maxVel, Math.min(maxVel, this.vy));

    // Reset connections for this frame
    this.connections = 0;
  }

  draw() {
    // Pulsing effect
    const pulse =
      (Math.sin(Date.now() * this.pulseSpeed + this.pulseOffset) + 1) * 0.3 +
      0.7;
    const currentRadius = this.radius * pulse;

    ctx.beginPath();
    ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;

    // Enhanced glow effect
    ctx.shadowBlur = currentRadius * 4;
    ctx.shadowColor = this.glowColor;
    ctx.fill();

    // Additional inner glow
    ctx.shadowBlur = currentRadius * 2;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

// Initialize particles
function initializeParticles() {
  particles.length = 0;
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

// Draw connections between nearby particles
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    const particleA = particles[i];

    if (particleA.connections >= maxConnections) continue;

    for (let j = i + 1; j < particles.length; j++) {
      const particleB = particles[j];

      if (particleB.connections >= maxConnections) continue;

      const dx = particleA.x - particleB.x;
      const dy = particleA.y - particleB.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < connectionDistance) {
        const opacity = (1 - distance / connectionDistance) * 0.5;

        // Line color based on average height position
        const avgHeight = (particleA.y + particleB.y) / 2;
        const heightRatio = avgHeight / canvas.height;

        let lineColor;
        if (heightRatio < 0.3) {
          lineColor = `rgba(255, 255, 255, ${opacity})`;
        } else if (heightRatio < 0.6) {
          lineColor = `rgba(255, 150, 150, ${opacity})`;
        } else {
          lineColor = `rgba(225, 6, 0, ${opacity})`;
        }

        // Main connection line
        ctx.beginPath();
        ctx.moveTo(particleA.x, particleA.y);
        ctx.lineTo(particleB.x, particleB.y);
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = opacity * 2;
        ctx.stroke();

        // Glow effect for closer connections
        if (distance < connectionDistance * 0.7) {
          ctx.beginPath();
          ctx.moveTo(particleA.x, particleA.y);
          ctx.lineTo(particleB.x, particleB.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
          ctx.lineWidth = opacity * 1;
          ctx.stroke();
        }

        particleA.connections++;
        particleB.connections++;
      }
    }
  }
}

// Mouse interaction
function handleMouseMove(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
}

// Animation loop with optimized rendering
function animate() {
  // Clear canvas with transparent background
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update and draw particles
  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  // Draw connections
  drawConnections();

  requestAnimationFrame(animate);
}

// Initialize and start animation
initializeParticles();
animate();

// Event listeners
document.addEventListener("mousemove", handleMouseMove);

// Update canvas size on scroll to maintain full coverage
let scrollTimeout;
window.addEventListener("scroll", () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    const newHeight = Math.max(
      document.documentElement.scrollHeight,
      document.documentElement.clientHeight,
      window.innerHeight
    );
    if (Math.abs(canvas.height - newHeight) > 100) {
      resizeCanvas();
    }
  }, 150);
});

// Carousel Functionality
let currentSlide = 0;
const totalSlides = 3;
const carouselContainer = document.getElementById("carousel-container");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const dots = document.querySelectorAll(".carousel-dot");

function updateCarousel() {
  const translateX = -currentSlide * 100;
  carouselContainer.style.transform = `translateX(${translateX}%)`;

  // Update dots
  dots.forEach((dot, index) => {
    if (index === currentSlide) {
      dot.className =
        "carousel-dot w-4 h-4 rounded-full bg-red-primary transition-all duration-300";
    } else {
      dot.className =
        "carousel-dot w-4 h-4 rounded-full bg-white/30 hover:bg-white/50 transition-all duration-300";
    }
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateCarousel();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateCarousel();
}

function goToSlide(slideIndex) {
  currentSlide = slideIndex;
  updateCarousel();
}

// Event listeners
if (nextBtn) nextBtn.addEventListener("click", nextSlide);
if (prevBtn) prevBtn.addEventListener("click", prevSlide);

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => goToSlide(index));
});

// Auto-advance carousel every 5 seconds
setInterval(nextSlide, 5000);

// Touch/swipe support for mobile
let startX = 0;
let endX = 0;

if (carouselContainer) {
  carouselContainer.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  carouselContainer.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    const swipeDistance = startX - endX;

    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  });
}
