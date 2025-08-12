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

window.onscroll = function () {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
};

backToTopBtn.addEventListener('click', function () {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
});

// Skills carousel auto-scroll and line animation
document.addEventListener('DOMContentLoaded', () => {
    const skillsCarousel = document.querySelector('.skills-carousel');
    const skillsGrid = document.querySelector('.skills-carousel .skills-grid');
    const skillsH2 = document.querySelector('#intro-skills h2');

    if (skillsCarousel && skillsGrid && skillsH2) {
        let scrollAmount = 0;
        let animationFrameId;
        const scrollSpeed = 0.5; // Adjust scroll speed as needed

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

// Animated Subtitle
document.addEventListener('DOMContentLoaded', () => {
    const subtitleElement = document.getElementById('animated-subtitle');
    if (subtitleElement) {
        const phrases = [
            "Backend developer with 3 years of experience in Python.",
            "Bilingual (Spanish-English).",
            "Open to remote work opportunities."
        ];
        let currentPhraseIndex = 0;

        const typeWriterEffect = (element, text, delay = 50) => {
            let i = 0;
            element.textContent = ''; // Clear existing text
            const typingInterval = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typingInterval);
                }
            }, delay);
        };

        const updateSubtitle = () => {
            const phrase = phrases[currentPhraseIndex];
            typeWriterEffect(subtitleElement, phrase); // Use typewriter effect
            currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        };

        // Initial display
        updateSubtitle();

        // Change subtitle every 4 seconds (adjust time as needed)
        setInterval(updateSubtitle, 4000); // 4000ms = 4 seconds
    }
});