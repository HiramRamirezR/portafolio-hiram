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
