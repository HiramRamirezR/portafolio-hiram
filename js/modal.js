function getProjectData(projectDiv, field) {
  const lang = (typeof currentLang !== 'undefined') ? currentLang : 'en';
  if (lang === 'es') {
    const esVal = projectDiv.dataset[field + 'Es'];
    if (esVal) return esVal;
  }
  return projectDiv.dataset[field];
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const modalTags = document.getElementById('modal-tags');
    const modalArchitecture = document.getElementById('modal-architecture');
    const modalArchSection = document.getElementById('modal-architecture-section');
    const modalChallenges = document.getElementById('modal-challenges');
    const modalChallengesSection = document.getElementById('modal-challenges-section');
    const modalClients = document.getElementById('modal-clients');
    const modalClientsList = document.getElementById('modal-clients-list');
    const modalImpact = document.getElementById('modal-impact');
    const modalImpactSection = document.getElementById('modal-impact-section');
    const modalGithub = document.getElementById('modal-github');
    const modalLive = document.getElementById('modal-live');
    const modalCaseStudy = document.getElementById('modal-casestudy');
    const closeButton = document.querySelector('.close-button');
    let openProject = null;
    let lastFocused = null;

    function openModal(projectDiv, trigger) {
        if (modal.style.display !== 'block') {
            lastFocused = trigger || document.activeElement;
        }
        openProject = projectDiv;
        modalTitle.textContent = getProjectData(projectDiv, 'title');
        modalSubtitle.textContent = getProjectData(projectDiv, 'subtitle');

        const impactText = getProjectData(projectDiv, 'impact');
        if (impactText && impactText.trim()) {
            modalImpact.textContent = impactText;
            modalImpactSection.style.display = 'block';
        } else {
            modalImpactSection.style.display = 'none';
        }

        const archText = getProjectData(projectDiv, 'architecture');
        if (archText && archText.trim()) {
            modalArchitecture.textContent = archText;
            modalArchSection.style.display = 'block';
        } else {
            modalArchSection.style.display = 'none';
        }

        const challengesText = getProjectData(projectDiv, 'challenges');
        if (challengesText && challengesText.trim()) {
            modalChallenges.textContent = challengesText;
            modalChallengesSection.style.display = 'block';
        } else {
            modalChallengesSection.style.display = 'none';
        }

        if (projectDiv.dataset.githubUrl) {
            modalGithub.href = projectDiv.dataset.githubUrl;
            modalGithub.style.display = 'inline-block';
        } else {
            modalGithub.style.display = 'none';
        }

        if (projectDiv.dataset.liveUrl) {
            modalLive.href = projectDiv.dataset.liveUrl;
            modalLive.style.display = 'inline-block';
        } else {
            modalLive.style.display = 'none';
        }

        if (projectDiv.dataset.caseStudyUrl) {
            modalCaseStudy.href = projectDiv.dataset.caseStudyUrl;
            modalCaseStudy.style.display = 'inline-block';
        } else {
            modalCaseStudy.style.display = 'none';
        }

        const clientsKey = (typeof currentLang !== 'undefined' && currentLang === 'es') ? 'clientsEs' : 'clients';
        if (projectDiv.dataset[clientsKey]) {
            const clients = JSON.parse(projectDiv.dataset[clientsKey]);
            modalClientsList.innerHTML = '';
            clients.forEach(client => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = client.url;
                a.target = '_blank';
                a.textContent = client.name;
                a.style.color = '#00aaff';
                li.appendChild(a);
                if (client.description) {
                    li.innerHTML += ` - ${client.description}`;
                }
                modalClientsList.appendChild(li);
            });
            modalClients.style.display = 'block';
        } else {
            modalClients.style.display = 'none';
        }

        modalTags.innerHTML = '';
        const tags = projectDiv.querySelectorAll('.tag');
        tags.forEach(tag => {
            const newTag = document.createElement('span');
            newTag.className = 'tag';
            newTag.textContent = tag.textContent;
            modalTags.appendChild(newTag);
        });

        modal.style.display = 'block';
        modal.setAttribute('aria-hidden', 'false');
        closeButton.focus();

        const projectTitle = getProjectData(projectDiv, 'title');
        const eventName = 'project:' + projectTitle.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        if (typeof trackEvent === 'function') trackEvent(eventName);
    }

    function initCarousel(carousel) {
        const img = carousel.querySelector('[data-carousel-img]');
        const prevBtn = carousel.querySelector('[data-carousel-prev]');
        const nextBtn = carousel.querySelector('[data-carousel-next]');
        const dotsContainer = carousel.querySelector('[data-carousel-dots]');
        const slides = ['img/global.webp', 'img/quiromed.webp', 'img/encinas.webp', 'img/evi.webp'];
        const slideAlts = ['Global Mobility Puebla website', 'Quiromed website', 'Encinas y Asociados website', 'Educación para la Vida website'];
        let currentIndex = 0;
        let interval;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to image ${i + 1} of ${slides.length}`);
            if (i === 0) dot.setAttribute('aria-current', 'true');
            dot.addEventListener('click', () => { stopAuto(); goTo(i); });
            dotsContainer.appendChild(dot);
        });

        function goTo(index) {
            currentIndex = index;
            img.src = slides[currentIndex];
            img.alt = slideAlts[currentIndex] || img.alt;
            dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
                d.classList.toggle('active', i === currentIndex);
                if (i === currentIndex) d.setAttribute('aria-current', 'true');
                else d.removeAttribute('aria-current');
            });
        }

        function next() {
            goTo(currentIndex === slides.length - 1 ? 0 : currentIndex + 1);
        }

        function startAuto() {
            stopAuto();
            interval = setInterval(next, 3000);
        }

        function stopAuto() {
            clearInterval(interval);
        }

        carousel.addEventListener('mouseenter', stopAuto);
        carousel.addEventListener('mouseleave', startAuto);

        prevBtn.addEventListener('click', () => { stopAuto(); goTo(currentIndex === 0 ? slides.length - 1 : currentIndex - 1); });
        nextBtn.addEventListener('click', () => { stopAuto(); next(); });

        startAuto();
    }

    document.querySelectorAll('.project-carousel').forEach(initCarousel);

    document.querySelectorAll('.details-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const projectDiv = e.target.closest('.project');
            openModal(projectDiv, e.currentTarget);
        });
    });

    document.addEventListener('languageChanged', () => {
        if (modal.style.display === 'block' && openProject) {
            openModal(openProject);
        }
    });

    function closeModal() {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        openProject = null;
        if (lastFocused && typeof lastFocused.focus === 'function') {
            lastFocused.focus();
        }
        lastFocused = null;
    }

    closeButton.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (modal.style.display !== 'block') return;
        if (e.key === 'Escape') {
            closeModal();
            return;
        }
        if (e.key !== 'Tab') return;
        const focusables = modal.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        } else if (!modal.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
        }
    });

    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            closeModal();
        }
    });
});