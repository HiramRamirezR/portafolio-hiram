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
        const phrases = `
<span class="syntax-keyword">try</span>:
    <span class="syntax-keyword">def</span> <span class="syntax-function">profile</span>():
        <span class="syntax-function">experience</span>(years = <span class="syntax-number">3</span>, language = <span class="syntax-string">"Python"</span>)
        <span class="syntax-function">speak</span>([<span class="syntax-string">"Spanish"</span>, <span class="syntax-string">"English"</span>])
        <span class="syntax-function">open_to</span>(<span class="syntax-string">"remote_work"</span>)

    <span class="syntax-function">profile</span>()
<span class="syntax-keyword">except</span> <span class="syntax-builtin">Exception</span>:
    <span class="syntax-function">print</span>(<span class="syntax-string">"""Not defined yet...</span>
<span class="syntax-string">just like our working relationship 😉"""</span>)
`;

        let typingTimeout;

        // Create cursor element
        const cursorSpan = document.createElement('span');
        cursorSpan.classList.add('typewriter-cursor');
        cursorSpan.textContent = '|'; // Use a pipe character for visibility

        const typeWriterEffect = (element, lines, lineIndex, charDelay, callback) => {
            if (lineIndex >= lines.length) {
                if (callback) callback();
                return;
            }

            let i = 0; // This will be the index in the *visible* text
            const line = lines[lineIndex];
            const isFirstLine = lineIndex === 0;

            if (!isFirstLine) {
                element.innerHTML += '<br>';
            }

            const currentContent = element.innerHTML.replace(/<span class="typewriter-cursor">[^<]*<\/span>/, '');

            const type = () => {
                // Find the corresponding HTML substring that contains 'i' visible characters
                let htmlToRender = '';
                let visibleCharCount = 0;
                let rawCharIndex = 0;

                while (visibleCharCount <= i && rawCharIndex < line.length) {
                    const char = line[rawCharIndex];
                    if (char === '<') {
                        // Skip HTML tag
                        while (rawCharIndex < line.length && line[rawCharIndex] !== '>') {
                            htmlToRender += line[rawCharIndex];
                            rawCharIndex++;
                        }
                        htmlToRender += '>'; // Include the closing '>'
                        rawCharIndex++;
                    } else {
                        htmlToRender += char;
                        visibleCharCount++;
                        rawCharIndex++;
                    }
                }

                if (i < visibleCharCount) { // Only proceed if there are more visible characters to type
                    element.innerHTML = currentContent + htmlToRender;
                    element.appendChild(cursorSpan);
                    i++; // Increment visible character index
                    typingTimeout = setTimeout(type, charDelay);
                } else {
                    // Typing of current line complete, move to next line
                    typeWriterEffect(element, lines, lineIndex + 1, charDelay, callback);
                }
            };
            type();
        };

        const startAnimationCycle = () => {
            subtitleElement.innerHTML = ''; // Clear previous content
            const lines = phrases.split('\n').filter(line => line.trim().length > 0);
            typeWriterEffect(subtitleElement, lines, 0, 50, () => {
                // After typing all lines, wait, then restart
                typingTimeout = setTimeout(() => {
                    subtitleElement.innerHTML = ''; // Disappear
                    setTimeout(startAnimationCycle, 500); // Restart
                }, 2000); // Display typed text for 2 seconds
            });
        };

        // Initial start
        startAnimationCycle();
    }
});