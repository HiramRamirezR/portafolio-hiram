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
    <span class="syntax-function">print</span>(<span class="syntax-string">"""Not defined yet...
<span class="syntax-string">just like our working relationship 😉</span>"""</span>)
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
                }, 4000); // Display typed text for 2 seconds
            });
        };

        // Initial start
        startAnimationCycle();
    }
});
