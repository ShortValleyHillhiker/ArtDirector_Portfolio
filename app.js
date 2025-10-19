// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Intro section
function initializeIntro() {
    const introSection = document.querySelector('#intro');
    if (!introSection) return;

    const leftMask = document.querySelector('.scroll-mask.left');
    const rightMask = document.querySelector('.scroll-mask.right');
    const introOptions = introSection.querySelector('.intro-options');

    // Options toggle
    introSection.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', () => {
            introSection.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
            option.classList.add('active');
            introSection.querySelector(`.message.${option.classList[1]}`)?.classList.add('active');
        });
    });

    // Scroll masks with debounce
    if (introOptions) {
        const handleScroll = debounce(function() {
            const { scrollLeft, scrollWidth, clientWidth } = this;
            leftMask?.classList.toggle('scrolled', scrollLeft > 16);
            rightMask?.classList.toggle('scrolled', scrollLeft < scrollWidth - clientWidth - 16);
        }, 16);
        
        introOptions.addEventListener('scroll', handleScroll);
    }
}

// Project functions
const preloadedProjects = new Set();
let allProjects = []; // Store all projects globally for routing

function loadProjectIntoSkeleton(project, skeleton) {
    const img = new Image();
    img.src = project.headerImage;
    
    img.onload = () => {
        requestAnimationFrame(() => {
            skeleton.replaceWith(createProjectLink(project));
        });
    };
}

function createProjectLink(project) {
    const link = document.createElement('a');
    link.href = `/${project.url}`;
    link.innerHTML = `
        <article>
            <div class="case-img_wrapper">
                <img src="${project.headerImage}" alt="${project.title}" loading="lazy">
                <div class="image-overlay"></div>
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

    // Preload content on hover/touch
    const preloadContent = () => {
        if (preloadedProjects.has(project.url)) return;
        
        project.content?.forEach(block => {
            if (block.type === 'image') {
                const preload = document.createElement('link');
                preload.rel = 'preload';
                preload.as = 'image';
                preload.href = block.src;
                document.head.appendChild(preload);
            }
        });
        
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

function createSkeleton() {
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
    return skeleton;
}

async function initializeWork() {
    const workSection = document.querySelector('#work');
    if (!workSection) return;

    let currentIndex = 4;

    try {
        const projectList = await fetch('/data/projects.json').then(res => res.json());
        const responses = await Promise.all(
            projectList.map(file => fetch(`/data/${file}`).then(res => res.json()))
        );

        allProjects = responses.sort((a, b) => a.postOrder - b.postOrder);
        const skeletons = workSection.querySelectorAll('.skeleton');

        // Load initial projects
        allProjects.slice(0, 4).forEach((project, index) => {
            if (skeletons[index]) loadProjectIntoSkeleton(project, skeletons[index]);
        });

        // Add load more button if needed
        if (allProjects.length > 4) {
            const loadMoreBtn = document.createElement('span');
            loadMoreBtn.innerHTML = '<p class="load-more">Fler projekt</p>';
            workSection.appendChild(loadMoreBtn);

            loadMoreBtn.addEventListener('click', () => {
                const nextBatch = allProjects.slice(currentIndex, currentIndex + 4);

                nextBatch.forEach(project => {
                    const skeleton = createSkeleton();
                    workSection.insertBefore(skeleton, loadMoreBtn);
                    loadProjectIntoSkeleton(project, skeleton);
                });

                currentIndex += 4;
                if (currentIndex >= allProjects.length) loadMoreBtn.remove();
            });
        }

        // Handle initial route
        handleRoute();
    } catch (error) {
        console.error('Failed to load projects:', error);
    }
}

// Router function
function handleRoute() {
    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    
    if (!path) {
        // We're on the homepage, close modal if open
        if (document.body.classList.contains('project-modal-open')) {
            closeModal();
        }
        return;
    }
    
    // Find and open the matching project
    const matchedProject = allProjects.find(p => p.url === path);
    if (matchedProject) {
        openModal(matchedProject);
    } else {
        // Project not found, redirect to homepage
        history.replaceState(null, '', '/');
    }
}

// Modal functions
function openModal(project) {
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    const content = modal.querySelector('.modal-content');
    let html = `
        <div>
            <p class="modal-heading">${project.title}</p>
            <p class="modal-customer">${project.customer}</p>
        </div>
    `;

    project.content?.forEach(block => {
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
        }
    });

    content.innerHTML = html;
    document.body.classList.add('project-modal-open');
    modal.querySelector('.modal-close').onclick = closeModal;
}

function closeModal() {
    document.body.classList.remove('project-modal-open');
    history.pushState(null, '', '/');
}

// Navigation
function initializeNavigation() {
    if (window.innerWidth < 768) return;
    
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

// Appearance slider
function initializeAppearanceSlider() {
    const appearanceOption = document.querySelector('.option.appearance');
    const slider = document.querySelector('.site-controls .slider');
    
    if (!appearanceOption || !slider) return;

    const body = document.body;
    const html = document.documentElement;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    html.classList.add(isTouchDevice ? 'touchevents' : 'no-touchevents');

    function removeColorSchemeClasses() {
        body.className = body.className.replace(/color-scheme--\d+/g, '').trim();
    }

    function toggleSliderVisibility(visible) {
        body.classList.toggle('appearance-slider--is--visible', visible);
    }

    if (isTouchDevice) {
        appearanceOption.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSliderVisibility(true);
        });
        
        html.addEventListener('click', (event) => {
            if (!event.target.closest('.option.appearance')) {
                toggleSliderVisibility(false);
            }
        });
    } else {
        appearanceOption.addEventListener('mouseenter', () => toggleSliderVisibility(true));
        appearanceOption.addEventListener('mouseleave', () => toggleSliderVisibility(false));
    }

    slider.addEventListener('input', function() {
        const value = this.value < 10 ? '0' + this.value : this.value;
        removeColorSchemeClasses();
        body.classList.add('color-scheme--' + value);
    });
    
    // Set initial value and trigger the change
    slider.value = 4;
    slider.dispatchEvent(new Event('input'));
}

// Initialize all
document.addEventListener('DOMContentLoaded', () => {
    initializeIntro();
    initializeWork();
    initializeNavigation();
    initializeAppearanceSlider();
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    handleRoute();
});