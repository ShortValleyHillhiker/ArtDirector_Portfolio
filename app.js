function initializeIntro() {
    const introSection = document.querySelector('#intro');
    if (!introSection) return;

    const leftMask = document.querySelector('.scroll-mask.left');
    const rightMask = document.querySelector('.scroll-mask.right');

    // Options toggle
    introSection.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', () => {
            introSection.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
            option.classList.add('active');
            const targetClass = option.classList[1];
            introSection.querySelector(`.message.${targetClass}`)?.classList.add('active');
        });
    });

    // Scroll masks with debounce
    const introOptions = introSection.querySelector('.intro-options');
    if (introOptions) {
        let timeoutId;
        introOptions.addEventListener('scroll', function () {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                const { scrollLeft, scrollWidth, clientWidth } = this;
                leftMask?.classList.toggle('scrolled', scrollLeft > 16);
                rightMask?.classList.toggle('scrolled', scrollLeft < scrollWidth - clientWidth - 16);
            }, 16);
        });
    }
}

function initializeNavigation() {
    const sections = document.querySelectorAll('main > section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const navLink = document.querySelector(`nav a[href="#${entry.target.id}"]`);
                if (navLink) {
                    document.querySelectorAll('nav li').forEach(li => li.classList.remove('active'));
                    navLink.parentElement.classList.add('active');
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '-10% 0px'
    });
    
    sections.forEach(section => observer.observe(section));
}

// Case

function loadProjectIntoSkeleton(project, skeleton) {
    const img = new Image();
    img.src = project.headerImage;
    
    img.onload = () => {
        const link = createProjectLink(project);
        skeleton.replaceWith(link);
    };
}

async function initializeWork() {
    const workSection = document.querySelector('#work');
    if (!workSection) return;

    let currentIndex = 4;
    let sortedProjects = [];

    try {
        const projectList = await fetch('/data/projects.json').then(res => res.json());
        const projectFiles = projectList.map(file => `/data/${file}`);
        const responses = await Promise.all(
            projectFiles.map(file => fetch(file).then(res => res.json()))
        );

        sortedProjects = responses.sort((a, b) => a.postOrder - b.postOrder);
        const skeletons = workSection.querySelectorAll('.skeleton');

        sortedProjects.slice(0, 4).forEach((project, index) => {
            if (!skeletons[index]) return;
            loadProjectIntoSkeleton(project, skeletons[index]);
        });

        if (sortedProjects.length > 4) {
            const loadMoreBtn = document.createElement('span');
            loadMoreBtn.innerHTML = '<p class="load-more">Load More</p>';
            workSection.appendChild(loadMoreBtn);

            loadMoreBtn.addEventListener('click', () => {
                const nextBatch = sortedProjects.slice(currentIndex, currentIndex + 4);

                nextBatch.forEach(project => {
                    const skeleton = document.createElement('article');
                    skeleton.classList.add('skeleton');
                    skeleton.innerHTML = `
            <div class="skeleton-img"></div>
            <div class="skeleton-info">
                <div>
                    <p>placeholder</p>
                    <p class="customer">placeholder</p>
                </div>
                <p class="project-type">placeholder</p>
            </div>
        `;

                    workSection.insertBefore(skeleton, loadMoreBtn);
                    loadProjectIntoSkeleton(project, skeleton);
                });

                currentIndex += 4;

                if (currentIndex >= sortedProjects.length) {
                    loadMoreBtn.remove();
                }
            });
        }

        const path = window.location.pathname.replace(/^\/|\/$/g, '');
        if (path) {
            const matchedProject = sortedProjects.find(p => p.url === path);
            if (matchedProject) {
                openModal(matchedProject);
            }
        }
    } catch (error) {
        console.error('Failed to load projects:', error);
    }
}

const preloadedProjects = new Set();

function createProjectLink(project) {
    const link = document.createElement('a');
    link.href = `/${project.url}`;
    link.innerHTML = `
        <article>
            <div class="case-img_wrapper">
                <img src="${project.headerImage}" alt="${project.title}">
            </div>
            <div class="case-info">
                <div>
                    <h2>${project.title}</h2>
                    <p class="customer">${project.customer}</p>
                </div>
                <p class="project-type">${project.projectType}</p>
            </div>
        </article>
    `;

const preloadContent = () => {
    if (preloadedProjects.has(project.url)) return;

    if (project.content && Array.isArray(project.content)) {
        project.content.forEach(block => {
            if (block.type === 'image') {
                const existing = document.head.querySelector(`link[rel="preload"][href="${block.src}"]`);
                if (!existing) {
                    const preload = document.createElement('link');
                    preload.rel = 'preload';
                    preload.as = 'image';
                    preload.href = block.src;
                    document.head.appendChild(preload);
                }
            }
        });
    }

    preloadedProjects.add(project.url);
};

    link.addEventListener('mouseenter', preloadContent);
    link.addEventListener('touchstart', preloadContent, { passive: true });

    link.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(project);
        history.pushState(null, '', `/${project.url}`);
    });

    return link;
}

let currentProjectUrl = null;

function openModal(project) {
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    const content = modal.querySelector('.modal-content');

    // Only rebuild if it's a different project
    if (currentProjectUrl !== project.url) {
        let html = `
            <div>
                <p class="modal-heading">${project.title}</p>
                <p class="modal-customer">${project.customer}</p>
            </div>
        `;

        if (project.content && Array.isArray(project.content)) {
            project.content.forEach(block => {
                switch (block.type) {
                    case 'text':
                        html += `<p>${block.value}</p>`;
                        break;
                    case 'image':
                        html += `<img src="${block.src}" alt="${block.alt || ''}">`;
                        break;
                    case 'heading':
                        html += `<h2>${block.value}</h2>`;
                        break;
                    default:
                        console.warn('Unknown content type:', block.type);
                }
            });
        }

        content.innerHTML = html;
        currentProjectUrl = project.url;
    }

    document.body.classList.add('project-modal-open');

    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.onclick = closeModal;
}

function closeModal() {
    document.body.classList.remove('project-modal-open');
    history.pushState(null, '', '/');
}

window.addEventListener('popstate', () => {
    if (document.body.classList.contains('project-modal-open')) {
        document.body.classList.remove('project-modal-open');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    initializeIntro();
    initializeNavigation();
    initializeWork();
});