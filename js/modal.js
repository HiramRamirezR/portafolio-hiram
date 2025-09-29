document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    // const modalImage = document.getElementById('modal-image');
    const modalTags = document.getElementById('modal-tags');
    const modalArchitecture = document.getElementById('modal-architecture');
    const modalChallenges = document.getElementById('modal-challenges');
    const modalGithub = document.getElementById('modal-github');
    const modalLive = document.getElementById('modal-live');
    const closeButton = document.querySelector('.close-button');

    document.querySelectorAll('.details-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const projectDiv = e.target.closest('.project');

            modalTitle.textContent = projectDiv.dataset.title;
            modalSubtitle.textContent = projectDiv.dataset.subtitle;
            // modalImage.src = projectDiv.dataset.imgSrc;
            modalArchitecture.textContent = projectDiv.dataset.architecture;
            modalChallenges.textContent = projectDiv.dataset.challenges;

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

            modalTags.innerHTML = '';
            const tags = projectDiv.querySelectorAll('.tag');
            tags.forEach(tag => {
                const newTag = document.createElement('span');
                newTag.className = 'tag';
                newTag.textContent = tag.textContent;
                modalTags.appendChild(newTag);
            });

            modal.style.display = 'block';
        });
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