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
                // Obtiene todos los filtros del proyecto desde su atributo data-filter
                const projectFilters = project.dataset.filter ? project.dataset.filter.split(' ') : [];

                // Muestra el proyecto si el filtro es 'all' o si el filtro del botón está en la lista de filtros del proyecto
                if (filter === 'all' || projectFilters.includes(filter)) {
                    project.style.display = 'block';
                } else {
                    project.style.display = 'none';
                }
            });
        });
    });
});