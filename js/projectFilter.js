document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-button');
    const projects = document.querySelectorAll('.project');
    const projectCountElement = document.getElementById('project-count'); // Get the counter element

    function updateProjectCount() {
        let count = 0;
        projects.forEach(project => {
            // Check computed style for display, as inline style might not be immediately reflected
            if (window.getComputedStyle(project).display !== 'none') {
                count++;
            }
        });
        if (count === 1) {
            projectCountElement.textContent = `${count} project`;
        } else {
            projectCountElement.textContent = `${count} projects`;
        }
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            // Deactivate all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Activate the clicked button
            button.classList.add('active');

            projects.forEach(project => {
                // Obtiene todos los filtros del proyecto desde su atributo data-filter
                const projectFilters = project.dataset.filter ? project.dataset.filter.split(' ') : [];

                // Muestra el proyecto si el filtro es 'all' o si el filtro del botón está en la lista de filtros del proyecto
                if (filter === 'all' || projectFilters.includes(filter)) {
                    project.style.display = 'block';
                } else {
                    project.style.display = 'none';
                }
            });
            updateProjectCount(); // Update count after filtering
        });
    });

    // Trigger a click on the "All" button to set initial state and count
    const allButton = document.querySelector('.filter-button[data-filter="all"]');
    if (allButton) {
        allButton.click();
    } else {
        // Fallback if "All" button is not found, just update count
        updateProjectCount();
    }
});