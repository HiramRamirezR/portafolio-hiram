document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-button');
    const projects = document.querySelectorAll('.project');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            // Deactivate all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Activate the clicked button
            button.classList.add('active');

            projects.forEach(project => {
                const commercialBadge = project.querySelector('.highlight-badge.commercial');
                const personalBadge = project.querySelector('.highlight-badge.personal');
                const tags = Array.from(project.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());

                let hasTag = false;
                if (filter === 'all') {
                    hasTag = true;
                } else if (filter === 'commercial' && commercialBadge) {
                    hasTag = true;
                } else if (filter === 'personal' && personalBadge) {
                    hasTag = true;
                } else if (filter === 'html-css') {
                    if (tags.includes('html') || tags.includes('css')) {
                        hasTag = true;
                    }
                } else if (filter === 'hugging-face') {
                    if (tags.includes('hugging face')) {
                        hasTag = true;
                    }
                } else if (tags.includes(filter)) {
                    hasTag = true;
                }

                if (hasTag) {
                    project.style.display = 'block';
                } else {
                    project.style.display = 'none';
                }
            });
        });
    });
});