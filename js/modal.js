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
    const modalGithub = document.getElementById('modal-github');
    const modalLive = document.getElementById('modal-live');
    const closeButton = document.querySelector('.close-button');

    function openModal(projectDiv) {
        modalTitle.textContent = getProjectData(projectDiv, 'title');
        modalSubtitle.textContent = getProjectData(projectDiv, 'subtitle');

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

        const projectTitle = getProjectData(projectDiv, 'title');
        const eventName = 'project:' + projectTitle.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        if (typeof trackEvent === 'function') trackEvent(eventName);
    }

    document.querySelectorAll('.details-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const projectDiv = e.target.closest('.project');
            openModal(projectDiv);
        });
    });

    document.addEventListener('languageChanged', () => {
        if (modal.style.display === 'block') {
            const openProject = document.querySelector('.project .details-button:focus');
            if (openProject) {
                const projectDiv = openProject.closest('.project');
                if (projectDiv) openModal(projectDiv);
            }
        }
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });
});