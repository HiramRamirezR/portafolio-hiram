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

backToTopBtn.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
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

// Animated Subtitle with Typewriter and Erase Effect
document.addEventListener('DOMContentLoaded', () => {
    const subtitleElement = document.getElementById('animated-subtitle');
    if (subtitleElement) {
        const phrases = [
            'def profile():',
            '    experience(years=3, language="Python")',
            '    speak(["Spanish", "English"])',
            '    open_to("remote_work")'
        ];
        let currentPhraseIndex = 0;
        let typingTimeout;
        let erasingTimeout;
        let cycleInterval;

        // Create cursor element
        const cursorSpan = document.createElement('span');
        cursorSpan.classList.add('typewriter-cursor');
        cursorSpan.textContent = '|'; // Use a pipe character for visibility

        const typeWriterEffect = (element, text, charDelay = 50, callback) => {
            let i = 0;
            element.textContent = ''; // Clear existing text
            element.appendChild(cursorSpan); // Append cursor

            const type = () => {
                if (i < text.length) {
                    element.textContent = text.substring(0, i + 1);
                    element.appendChild(cursorSpan); // Keep cursor at the end
                    i++;
                    typingTimeout = setTimeout(type, charDelay);
                } else {
                    // Typing complete, call callback if provided
                    if (callback) callback();
                }
            };
            type();
        };

        const eraseEffect = (element, charDelay = 30, callback) => {
            let i = element.textContent.length - 1; // Start from end of text
            // Remove cursor temporarily for erasing animation
            if (element.lastChild === cursorSpan) {
                element.removeChild(cursorSpan);
            }

            const erase = () => {
                if (i >= 0) {
                    element.textContent = element.textContent.substring(0, i);
                    element.appendChild(cursorSpan); // Keep cursor at the end of remaining text
                    i--;
                    erasingTimeout = setTimeout(erase, charDelay);
                } else {
                    // Erasing complete, call callback if provided
                    if (callback) callback();
                }
            };
            erase();
        };

        const startAnimationCycle = () => {
            const currentPhrase = phrases[currentPhraseIndex];

            typeWriterEffect(subtitleElement, currentPhrase, 50, () => {
                // After typing, wait for a moment, then erase
                typingTimeout = setTimeout(() => {
                    eraseEffect(subtitleElement, 30, () => {
                        // After erasing, move to next phrase and start typing again
                        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
                        cycleInterval = setTimeout(startAnimationCycle, 500); // Short delay before next phrase types
                    });
                }, 2000); // Display typed text for 2 seconds
            });
        };

        // Initial start
        startAnimationCycle();
    }
});