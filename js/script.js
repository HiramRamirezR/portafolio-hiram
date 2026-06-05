// Analytics tracking
const API = '/api/track';

async function trackVisit() {
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'pageview' })
    });
    const data = await res.json();
    const el = document.querySelector('[data-metric="visits"]');
    if (el && data.monthlyCount !== undefined) {
      el.dataset.count = data.monthlyCount;
      el.textContent = data.monthlyCount;
    }
  } catch (e) {}
}

async function trackEvent(eventName) {
  try {
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'event', event: eventName })
    });
  } catch (e) {}
}

// Auto-update footer year
document.getElementById('current-year').textContent = new Date().getFullYear();

AOS.init();

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Back to Top button functionality
const backToTopBtn = document.getElementById("backToTopBtn");

window.addEventListener('scroll', () => {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        if(backToTopBtn) backToTopBtn.style.display = "block";
    } else {
        if(backToTopBtn) backToTopBtn.style.display = "none";
    }
});

if(backToTopBtn) {
    backToTopBtn.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Skills carousel auto-scroll and line animation
document.addEventListener('DOMContentLoaded', () => {
    const skillsCarousel = document.querySelector('.skills-carousel');
    const skillsGrid = document.querySelector('.skills-carousel .skills-grid');
    const skillsH2 = document.querySelector('#intro-skills h2');

    if (skillsCarousel && skillsGrid && skillsH2) {
        let scrollAmount = 0;
        let animationFrameId;
        const scrollSpeed = 10; // Adjust scroll speed as needed

        // Duplicate content for seamless loop
        skillsGrid.innerHTML += skillsGrid.innerHTML;

        const updateLine = () => {
            const originalContentWidth = skillsGrid.scrollWidth / 2; // Width of one set of skills
            const carouselVisibleWidth = skillsCarousel.clientWidth;
            const currentScrollLeft = skillsCarousel.scrollLeft;

            // Calculate the maximum scrollable distance for one set of skills
            const maxScrollDistance = originalContentWidth - carouselVisibleWidth;

            let progress = 0;
            if (maxScrollDistance > 0) {
                // Ensure currentScrollLeft is within the bounds of the original content's scroll
                const effectiveScrollLeft = currentScrollLeft % originalContentWidth;
                progress = effectiveScrollLeft / maxScrollDistance;
            }

            // Clamp progress between 0 and 1
            progress = Math.max(0, Math.min(1, progress));

            const lineWidth = progress * 100;
            skillsH2.style.setProperty('--line-width', `${lineWidth}%`);
        };

        const autoScroll = () => {
            scrollAmount += scrollSpeed;
            if (scrollAmount >= skillsGrid.scrollWidth / 2) { // Loop back after one full original content pass
                scrollAmount = 0;
            }
            skillsCarousel.scrollLeft = scrollAmount;
            updateLine();
            animationFrameId = requestAnimationFrame(autoScroll);
        };

        skillsCarousel.addEventListener('mouseenter', () => {
            cancelAnimationFrame(animationFrameId);
        });

        skillsCarousel.addEventListener('mouseleave', () => {
            scrollAmount = skillsCarousel.scrollLeft; // Update scrollAmount to current position
            animationFrameId = requestAnimationFrame(autoScroll);
        });

        // Initial setup
        updateLine();
        animationFrameId = requestAnimationFrame(autoScroll);

        // Update line on manual scroll (if user scrolls)
        skillsCarousel.addEventListener('scroll', updateLine);

        // Observe changes in skillsGrid size (e.g., if skills are added dynamically)
        const resizeObserver = new ResizeObserver(() => {
            // Recalculate scrollWidth and clientWidth on resize
            updateLine();
            // Restart scroll to adjust to new dimensions
            cancelAnimationFrame(animationFrameId);
            scrollAmount = skillsCarousel.scrollLeft; // Maintain current scroll position
            animationFrameId = requestAnimationFrame(autoScroll);
        });
        resizeObserver.observe(skillsGrid);
    }
});

trackVisit();

// Metrics counting animation
function animateMetrics() {
    const counters = document.querySelectorAll('.metric-value[data-count]');
    if (!counters.length) return;

    const duration = 1000;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => {
                    const target = parseFloat(counter.dataset.count);
                    const prefix = counter.dataset.prefix || '';
                    const suffix = counter.dataset.suffix || '';
                    const startTime = performance.now();

                    function update(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 2);
                        const current = target * eased;

                        if (Number.isInteger(target)) {
                            counter.textContent = prefix + Math.floor(current) + suffix;
                        } else {
                            counter.textContent = prefix + current.toFixed(1) + suffix;
                        }

                        if (progress < 1) {
                            requestAnimationFrame(update);
                        } else {
                            counter.textContent = prefix + target + suffix;
                        }
                    }

                    requestAnimationFrame(update);
                });
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });

    const metricsSection = document.getElementById('metrics');
    if (metricsSection) observer.observe(metricsSection);
}

document.addEventListener('DOMContentLoaded', animateMetrics);
