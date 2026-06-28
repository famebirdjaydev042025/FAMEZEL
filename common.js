/* =========================================
   FAMEZEL COMMON JAVASCRIPT
   UNIFIED FUNCTIONALITY ACROSS ALL PAGES
   ========================================= */

// Initialize GSAP and Lenis
function initializeCore() {
    // Smooth scrolling with Lenis
    const lenis = new Lenis({ 
        duration: 1.2, 
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
    });
    
    function raf(time) { 
        lenis.raf(time); 
        requestAnimationFrame(raf); 
    }
    requestAnimationFrame(raf);
    
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);
    
    return { lenis };
}

// Unified Menu System
function initializeMenu() {
    const menuBtn = document.querySelector('.menu-btn');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuLinks = document.querySelectorAll('.menu-link');
    const menuSide = document.querySelector('.menu-side-info');
    const menuText = document.querySelector('.menu-text');
    let isMenuOpen = false;

    if (!menuBtn || !menuOverlay) return;

    menuBtn.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            menuOverlay.classList.add('active');
            menuBtn.classList.add('active');
            menuText.textContent = "Close";
            
            gsap.to('.menu-btn', { color: '#fff' });
            gsap.to('.bar', { backgroundColor: '#fff' });
            gsap.to(menuLinks, { 
                y: 0, 
                duration: 0.8, 
                stagger: 0.1, 
                ease: "power3.out", 
                delay: 0.3 
            });
            gsap.to(menuSide, { 
                opacity: 1, 
                y: 0, 
                duration: 0.8, 
                ease: "power3.out", 
                delay: 0.5 
            });
        } else {
            menuOverlay.classList.remove('active');
            menuBtn.classList.remove('active');
            menuText.textContent = "Menu";
            
            gsap.to(['.menu-btn', '.logo'], { color: '#fff' });
            gsap.to('.bar', { backgroundColor: '#fff' });
            gsap.to(menuLinks, { y: "100%", duration: 0.5 });
            gsap.to(menuSide, { opacity: 0, y: 20 });
        }
    });

    // Close menu when clicking links
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) menuBtn.click();
        });
    });
}

// Unified Animation System
function initializeAnimations() {
    // Line mask animations
    gsap.utils.toArray('.line-mask-inner').forEach(el => {
        gsap.to(el, { 
            y: "0%", 
            duration: 1.6, 
            ease: "power4.out", 
            delay: 0.2 
        });
    });

    // Split lines animation
    gsap.utils.toArray('.split-lines').forEach(el => {
        if (typeof SplitType !== 'undefined') {
            new SplitType(el, { types: 'lines' });
            const lines = el.querySelectorAll('.line');
            gsap.from(lines, {
                opacity: 0,
                y: 20,
                duration: 1.2,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%"
                }
            });
        }
    });

    // Fade up animations
    gsap.utils.toArray('.fade-up').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 1.5,
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%"
                }
            }
        );
    });
}

// Dust Particles System
function initializeDustParticles() {
    const canvas = document.getElementById('dust-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height, particles = [];
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initParticles();
    }
    
    function initParticles() {
        particles = [];
        for (let i = 0; i < 60; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2,
                alpha: Math.random() * 0.5
            });
        }
    }
    
    function drawParticles() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.globalAlpha = p.alpha;
            ctx.fill();
        });
        
        requestAnimationFrame(drawParticles);
    }
    
    window.addEventListener('resize', resize);
    resize();
    drawParticles();
}

// Progress Bar
function initializeProgressBar() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;
    
    gsap.to(".scroll-progress", {
        width: "100%",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3
        }
    });
}

// Footer Time and Reveal Animations
function initializeFooter() {
    // Real-time clock
    function updateTime() {
        const timeEl = document.getElementById('local-time');
        if (timeEl) {
            const now = new Date();
            timeEl.textContent = now.toLocaleTimeString('en-GB', {
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit', 
                hour12: false
            }) + " IST";
        }
    }
    setInterval(updateTime, 1000);
    updateTime();

    // Reveal animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal-item').forEach(item => {
        observer.observe(item);
    });
}

// Mobile Touch Device Optimizations
function initializeMobileOptimizations() {
    const isTouchDevice = window.matchMedia("(hover: none)").matches;
    
    if (isTouchDevice) {
        // Add touch class to body
        document.body.classList.add('is-touch');
        
        // Disable mouse-based parallax
        if (typeof gsap !== 'undefined') {
            gsap.killTweensOf(".parallax-text");
            gsap.set(".parallax-text", { x: 0, y: 0 });
        }
        
        // Pause marquee on touch instead of hover
        const marquee = document.querySelector(".footer-marquee");
        const marqueeTrack = document.querySelector(".marquee-track");
        
        if (marquee && marqueeTrack) {
            marquee.addEventListener("touchstart", () => {
                marqueeTrack.style.animationPlayState = "paused";
            });
            
            marquee.addEventListener("touchend", () => {
                marqueeTrack.style.animationPlayState = "running";
            });
        }
        
        console.log("📱 Mobile optimizations active");
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCore();
    initializeMenu();
    initializeAnimations();
    initializeDustParticles();
    initializeProgressBar();
    initializeFooter();
    initializeMobileOptimizations();
});

// Export for use in other scripts
window.FamezelCore = {
    initializeCore,
    initializeMenu,
    initializeAnimations,
    initializeDustParticles,
    initializeProgressBar,
    initializeFooter,
    initializeMobileOptimizations
};