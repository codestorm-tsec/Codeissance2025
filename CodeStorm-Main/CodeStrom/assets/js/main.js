// ========== TREASURE CHEST & TREASURE CARDS ANIMATION (Scroll-synced) ========== //
document.addEventListener('DOMContentLoaded', () => {
    if (!window.gsap || !window.ScrollTrigger) return; 
    gsap.registerPlugin(ScrollTrigger);

    const prizes = document.querySelector('#prizes');
    const chestWrap = document.querySelector('.prizes__chest');
    if (!prizes || !chestWrap) return;

    // Ensure starting states + GPU acceleration hints
    gsap.set(['.chest--open', '.chest--closed', '.treasure__cards', '.treasure__card'], {
        willChange: 'transform, opacity',
        force3D: true
    });
    gsap.set('.chest--open', { opacity: 0, y: 10, scale: 0.90});
    gsap.set('.treasure__cards', { opacity: 0, y: 10, scale: 0.98 });
    gsap.set('.treasure__card', { opacity: 0, y: 30, scale: 0.9, rotate: -2 });

    // Build timelines per viewport for smoother mobile behavior
    ScrollTrigger.matchMedia({
        '(max-width: 768px)': function () {
            const tlMobile = gsap.timeline({
                scrollTrigger: {
                    trigger: chestWrap,
                    start: 'top top',
                    end: '+=35%',
                    scrub: 0.25,
                    pin: true,
                    pinType: 'transform',
                    anticipatePin: 1
                }
            });

            tlMobile.to('.chest--closed', { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: 'none' })
                .to('.chest--closed', { opacity: 0, y: -6, scale: 0.985, duration: 0.5, ease: 'power1.out' })
                .to('.chest--open', { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power1.out' }, '<')
                .to('.treasure__cards', { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power1.out' }, '-=0.15')
                .to('.treasure__card', {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotate: 0,
                    duration: 0.45,
                    ease: 'power1.out',
                    stagger: 0.12
                }, '-=0.15');
        },
        '(min-width: 769px)': function () {
            const tlDesktop = gsap.timeline({
                scrollTrigger: {
                    trigger: chestWrap,
                    start: 'top 0%',
                    end: '+=50%',
                    scrub: true,
                    pin: true,
                    anticipatePin: 1
                }
            });

            tlDesktop.to('.chest--closed', { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: 'none' })
                .to('.chest--closed', { opacity: 0, y: -8, scale: 0.98, duration: 0.6, ease: 'power2.out' })
                .to('.chest--open', { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out' }, '<')
                .to('.treasure__cards', { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out' }, '-=0.2')
                .to('.treasure__card', {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotate: 0,
                    duration: 0.6,
                    ease: 'back.out(1.4)',
                    stagger: 0.15
                }, '-=0.2');
        }
    });
});  
// Hide loading screen after page load
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
});
// === Timeline Animations: fade-in, progress, skull glow ===
document.addEventListener('DOMContentLoaded', () => {
    // Fade-in for timeline cards (in/out on scroll)
    const cards = document.querySelectorAll('.timeline__component');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                entry.target.classList.remove('in-view');
            }
        });
    }, { threshold: 0.2 });
    cards.forEach(card => cardObserver.observe(card));

    // Progress bar animation for pitstops
    const middles = document.querySelectorAll('.timeline__middle');
    const progressStates = Array.from(middles).map(() => 0);

    // Sequential timeline progress (one pitstop after another)
    function animateSequentialProgress() {
        middles.forEach((middle, idx) => {
            const progressLine = middle.querySelector('.timeline__progress-line');
            if (!progressLine) return;

            const rect = middle.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;

            // Start filling when the top of this pitstop enters the viewport
            const start = windowHeight * 0.25; // adjust trigger point (25% from top)
            const end = windowHeight * 0.75;   // fully filled when near center

            let percent = (windowHeight - rect.top - start) / (end - start);
            percent = Math.max(0, Math.min(1, percent));

            const totalHeight = rect.height;
            progressLine.style.height = `${percent * totalHeight}px`;

            // Optional skull glow: only glow when fully filled
            const skull = middle.querySelector('.timeline__icon');
            if (skull) {
                if (percent >= 1) {
                    skull.classList.add('glow');
                } else {
                    skull.classList.remove('glow');
                }
            }
        });
    }

    window.addEventListener('scroll', animateSequentialProgress, { passive: true });
    window.addEventListener('resize', animateSequentialProgress);
    animateSequentialProgress();


    // Skull glow when section is >50% visible
    const skulls = document.querySelectorAll('.timeline__icon');
    const skullObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.intersectionRatio > 0.5) {
                entry.target.classList.add('glow');
            } else {
                entry.target.classList.remove('glow');
            }
        });
    }, { threshold: [0, 0.5, 1] });
    skulls.forEach(skull => skullObserver.observe(skull));
});

// ========== NAVIGATION ========== //
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close');

if (navToggle) navToggle.addEventListener('click', () => navMenu.classList.add('show-menu'));
if (navClose) navClose.addEventListener('click', () => navMenu.classList.remove('show-menu'));

document.querySelectorAll('.nav__link').forEach(n => n.addEventListener('click', () => {
    navMenu.classList.remove('show-menu');
}));

// Header shadow on scroll
const shadowHeader = () => {
    const header = document.getElementById('header');
    window.scrollY >= 50 ? header.classList.add('shadow-header') : header.classList.remove('shadow-header');
};
window.addEventListener('scroll', shadowHeader);

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ========== FAQ ACCORDION ========== //
const faqItems = document.querySelectorAll('.faq__item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(f => f.classList.remove('active'));
        if (!isActive) item.classList.add('active');
    });
});

// ========== SCROLL ANIMATIONS (fade-in for multiple elements) ========== //
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        } else {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(20px)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.domain__card, .role__card, .timeline__item, .faq__item, .timeline__component'
    );
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

const poster = document.getElementById("crewPoster");

  poster.addEventListener("click", () => {
    if (poster.classList.contains("rolled")) {
      poster.src = "./assets/img/Wanted.png"; // replace with your wanted poster image
      poster.classList.remove("rolled");
      poster.classList.add("wanted");
    } else {
      poster.src = "./assets/img/rolled.png"; // back to rolled
      poster.classList.remove("wanted");
      poster.classList.add("rolled");
    }
  });


  