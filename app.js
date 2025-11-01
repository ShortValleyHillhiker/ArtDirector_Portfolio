(function () {
    "use strict";

    const BODY = document.body;
    const SELECTORS = {
        THEME_SLIDER: '.theme-selector input',
        BRAND_GRID_TOGGLE: '.toggle.brand-grid',
        DYNAMIC_CONTENT_TOGGLE: '.toggle.dynamic-content',
        OVERLAY: '.overlay.dynamic-content',
        SKELETON_ARTICLE: '.skeleton-article',
        LOAD_MORE_BTN: '.load-more',
        WORK_SECTION: '.work',
        THOUGHTS_SECTION: '.thoughts',
        CONTENT: '.content'
    };

    class PostListManager {
        constructor() {
            this.posts = [];
            this.loadedCounts = { work: 0, blog: 0 };
            this.config = {
                work: { initialLoad: 4, loadMore: 4, selector: SELECTORS.WORK_SECTION },
                blog: { initialLoad: 5, loadMore: 5, selector: SELECTORS.THOUGHTS_SECTION }
            };
            this.init();
        }

        async init() {
            await this.fetchPosts();
            this.renderPosts();
            this.setupIntersectionObserver();
        }

        async fetchPosts() {
            try {
                const response = await fetch('data/post-index.json');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                this.posts = Array.isArray(data.posts) ? data.posts : [];
            } catch (error) {
                console.error("Could not fetch posts:", error);
                this.posts = [];
            }
        }

        renderPosts() {
            const workPosts = this.posts.filter(post => post.type === 'work');
            const blogPosts = this.posts.filter(post => post.type === 'blog');
            this.renderSection('work', workPosts, this.config.work.initialLoad);
            this.renderSection('blog', blogPosts, this.config.blog.initialLoad);
        }

        setupIntersectionObserver() {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('loaded');
                        this.observer.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '50px', threshold: 0.1 });

            document.querySelectorAll('.work article, .thoughts article').forEach(article => {
                this.observer.observe(article);
            });
        }

        renderSection(type, allPosts, loadCount) {
            const config = this.config[type];
            const section = document.querySelector(config.selector);
            if (!section) return;

            const content = section.querySelector(SELECTORS.CONTENT);
            if (!content) return;

            const startIndex = this.loadedCounts[type];
            const endIndex = Math.min(startIndex + loadCount, allPosts.length);
            const postsToRender = allPosts.slice(startIndex, endIndex);
            const fragment = document.createDocumentFragment();
            const loadMoreBtnWrapper = content.querySelector('span:has(.load-more)');

            if (startIndex === 0) {
                content.querySelectorAll(SELECTORS.SKELETON_ARTICLE).forEach(el => el.remove());
            }

            postsToRender.forEach((post, index) => {
                const article = this.createArticle(post, type);
                article.style.setProperty('--i', index);
                fragment.appendChild(article);
                this.loadedCounts[type]++;
                if (this.observer) this.observer.observe(article);
            });

            if (loadMoreBtnWrapper) {
                content.insertBefore(fragment, loadMoreBtnWrapper);
            } else {
                content.appendChild(fragment);
            }

            this.updateLoadMoreButton(type, content, allPosts.length);
        }

        createArticle(post, type) {
            const article = document.createElement('article');

            if (type === 'work') {
                article.innerHTML = `
                    <div class="post-img_wrapper">
                        <img src="${post.image}" alt="${post.alt || post.title}">
                    </div>
                    <div class="post-txt_wrapper">
                        <span>
                            <h3>${post.title}</h3>
                            <p>${post.client}</p>
                        </span>
                        <ul>${post.tags?.map(tag => `<li>${tag}</li>`).join('') || ''}</ul>
                    </div>
                    <a href="#" class="block-link" data-post-id="${post.id}" aria-label="View ${post.title}"></a>
                `;
            } else {
                const formattedDate = new Date(post.date).toLocaleDateString('sv-SE', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                });
                article.innerHTML = `
                    <div>
                        <time datetime="${post.date}">${formattedDate}</time>
                        <h3>${post.title}</h3>
                    </div>
                    <a href="#" data-post-id="${post.id}" aria-label="Read ${post.title}">${post.linkText || 'Läs mer'}</a>
                `;
            }

            return article;
        }

        updateLoadMoreButton(type, content, totalPosts) {
            const remaining = totalPosts - this.loadedCounts[type];
            let btnWrapper = content.querySelector('span:has(.load-more)');

            if (remaining > 0) {
                if (!btnWrapper) {
                    btnWrapper = document.createElement('span');
                    const btn = document.createElement('p');
                    Object.assign(btn, {
                        className: 'load-more',
                        textContent: type === 'work' ? 'Fler projekt' : 'Läs fler tankar',
                        tabIndex: 0,
                        onclick: () => this.loadMore(type),
                        onkeydown: (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                this.loadMore(type);
                            }
                        }
                    });
                    btn.setAttribute('role', 'button');
                    btn.setAttribute('aria-label', `Load more ${type === 'work' ? 'projects' : 'thoughts'}`);
                    btnWrapper.appendChild(btn);
                    content.appendChild(btnWrapper);
                }
            } else {
                btnWrapper?.remove();
            }
        }

        loadMore(type) {
            const allPosts = this.posts.filter(post => post.type === type);
            this.renderSection(type, allPosts, this.config[type].loadMore);
        }
    }

    class OverlayManager {
        constructor() {
            this.overlay = document.querySelector(SELECTORS.OVERLAY);
            this.overlayContent = this.overlay?.querySelector('section');
            this.cache = new Map();
            this.currentPostId = null;
            this.isOpening = false;
            this.previousFocus = null;
            this.init();
        }

        init() {
            document.addEventListener('click', (e) => {
                const link = e.target.closest('[data-post-id]');
                if (link) {
                    e.preventDefault();
                    this.openOverlay(link.dataset.postId);
                }
            });

            this.overlay?.addEventListener('click', (e) => {
                if (e.target === this.overlay) this.closeOverlay();
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && BODY.classList.contains('overlay-open')) {
                    this.closeOverlay();
                }
            });

            let popstateTimeout;
            window.addEventListener('popstate', () => {
                clearTimeout(popstateTimeout);
                popstateTimeout = setTimeout(() => this.handleRoute(), 10);
            });

            this.handleRoute();
        }

        handleRoute() {
            const path = window.location.pathname.replace(/^\/|\/$/g, '');

            if (!path) {
                if (BODY.classList.contains('overlay-open')) {
                    this.closeOverlay(false);
                }
                return;
            }

            if (BODY.classList.contains('overlay-open') && this.currentPostId === path) {
                return;
            }

            this.openOverlay(path);
        }

        async openOverlay(postId) {
            if (this.isOpening) return;
            this.isOpening = true;
            this.previousFocus = document.activeElement;

            try {
                let postData = this.cache.get(postId);

                if (!postData) {
                    const response = await fetch(`data/posts/${postId}.json`);
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    postData = await response.json();
                    this.cache.set(postId, postData);
                }

                this.renderOverlayContent(postData);
                this.currentPostId = postId;
                BODY.classList.add('overlay-open');

                if (this.overlay) {
                    Object.assign(this.overlay, {
                        role: 'dialog',
                        ariaModal: 'true',
                        ariaLabel: postData.title || 'Content overlay'
                    });

                    setTimeout(() => {
                        const firstFocusable = this.overlayContent?.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
                        if (firstFocusable) {
                            firstFocusable.focus();
                        } else {
                            this.overlayContent?.setAttribute('tabindex', '-1');
                            this.overlayContent?.focus();
                        }
                    }, 100);
                }

                if (window.location.pathname.replace(/^\/|\/$/g, '') !== postId) {
                    window.history.pushState(null, '', `/${postId}`);
                }
            } catch (error) {
                console.error("Could not fetch post content:", error);
                window.history.replaceState(null, '', '/');
            } finally {
                this.isOpening = false;
            }
        }

        closeOverlay(updateHistory = true) {
            BODY.classList.remove('overlay-open');
            this.currentPostId = null;

            if (this.overlay) {
                this.overlay.removeAttribute('role');
                this.overlay.removeAttribute('aria-modal');
                this.overlay.removeAttribute('aria-label');
            }

            if (this.previousFocus?.focus) {
                this.previousFocus.focus();
                this.previousFocus = null;
            }

            if (updateHistory && window.location.pathname !== '/') {
                window.history.pushState(null, '', '/');
            }
        }

        renderOverlayContent(postData) {
            if (!this.overlayContent) return;

            const fragment = document.createDocumentFragment();

            if (postData.hero) {
                const hero = document.createElement('div');
                hero.className = 'hero';
                hero.innerHTML = `<img src="${postData.hero.image}" alt="${postData.hero.alt}">`;
                fragment.appendChild(hero);
            }

            postData.content?.forEach(block => {
                const element = this.createContentBlock(block);
                if (element) fragment.appendChild(element);
            });

            if (postData.credits) {
                const credits = document.createElement('div');
                credits.className = 'credits';
                credits.innerHTML = '<h3>Credits</h3>' +
                    Object.entries(postData.credits)
                        .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
                        .join('');
                fragment.appendChild(credits);
            }

            this.overlayContent.innerHTML = '';
            this.overlayContent.appendChild(fragment);
        }

        createContentBlock(block) {
            switch (block.type) {
                case 'text':
                    const p = document.createElement('p');
                    p.textContent = block.value;
                    return p;
                case 'image':
                    const figure = document.createElement('figure');
                    figure.innerHTML = `
                        <img src="${block.src}" alt="${block.alt}">
                        ${block.caption ? `<figcaption>${block.caption}</figcaption>` : ''}
                    `;
                    return figure;
                case 'gallery':
                    const gallery = document.createElement('div');
                    gallery.className = 'gallery';
                    gallery.innerHTML = block.images?.map(img => `<img src="${img.src}" alt="${img.alt}">`).join('') || '';
                    return gallery;
                default:
                    return null;
            }
        }
    }

    class NavigationManager {
        constructor() {
            this.navLinks = document.querySelectorAll('.spa-nav li a');
            this.sections = document.querySelectorAll('main > section[id]');
            this.init();
        }

        init() {
            if (!this.sections.length || !this.navLinks.length) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.setActiveNav(entry.target.id);
                    }
                });
            }, {
                rootMargin: '-20% 0px -60% 0px',
                threshold: 0
            });

            this.sections.forEach(section => observer.observe(section));

            this.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth < 800) {
                        BODY.classList.remove('nav-open');
                    }
                });
            });
        }

        setActiveNav(sectionId) {
            this.navLinks.forEach(link => {
                const li = link.parentElement;
                const href = link.getAttribute('href');

                if (href === `#${sectionId}` || (href === '#' && sectionId === 'intro')) {
                    li.classList.add('active');
                } else {
                    li.classList.remove('active');
                }
            });
        }
    }

    function initializeIntro() {
        const introSection = document.querySelector('#intro');
        if (!introSection) return;

        const leftMask = document.querySelector('.scroll-mask.left');
        const rightMask = document.querySelector('.scroll-mask.right');
        const introOptions = introSection.querySelector('.intro-options');

        introSection.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', () => {
                introSection.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
                option.classList.add('active');
                
                const identifierClass = Array.from(option.classList).find(cls => cls !== 'option' && cls !== 'active');
                if (identifierClass) {
                    introSection.querySelector(`.message.${identifierClass}`)?.classList.add('active');
                }
            });
        });

        if (introOptions) {
            introOptions.addEventListener('scroll', function() {
                const { scrollLeft, scrollWidth, clientWidth } = this;
                leftMask?.classList.toggle('scrolled', scrollLeft > 0);
                rightMask?.classList.toggle('scrolled', scrollLeft < scrollWidth - clientWidth);
            });
        }
    }

    function smoothScrollTo(target, duration = 330) {
        const start = window.pageYOffset;
        const end = target.getBoundingClientRect().top + start;
        const distance = end - start;
        const startTime = performance.now();
        
        const easeInOutCustom = (t) => {
            if (t < 0.5) {
                return 4 * t * t * t;
            }
            return 1 - Math.pow(-2 * t + 2, 3) / 2;
        };

        function animation(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeInOutCustom(progress);
            
            window.scrollTo(0, start + distance * eased);
            
            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
    }

    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) smoothScrollTo(target);
            });
        });
    }

    function setupToggles() {
        const themeSlider = document.querySelector(SELECTORS.THEME_SLIDER);
        if (themeSlider) {
            themeSlider.addEventListener('input', (e) => {
                const currentTheme = Array.from(BODY.classList).find(cls => cls.startsWith('theme-'));
                if (currentTheme) BODY.classList.remove(currentTheme);
                BODY.classList.add(`theme-${e.target.value}`);
            });
        }

        const brandGridToggle = document.querySelector(SELECTORS.BRAND_GRID_TOGGLE);
        if (brandGridToggle) {
            brandGridToggle.addEventListener('click', () => {
                BODY.classList.toggle('brand-grid_toggled');
            });
        }

        const dynamicContentToggle = document.querySelector(SELECTORS.DYNAMIC_CONTENT_TOGGLE);
        if (dynamicContentToggle) {
            dynamicContentToggle.addEventListener('click', () => {
                if (BODY.classList.contains('overlay-open')) {
                    BODY.classList.remove('overlay-open');
                    if (window.location.pathname !== '/') {
                        window.history.pushState(null, '', '/');
                    }
                } else {
                    BODY.classList.toggle('nav-open');
                }
            });
        }
    }

    function initApp() {
        initializeIntro();
        setupSmoothScroll();
        setupToggles();
        new PostListManager();
        new OverlayManager();
        new NavigationManager();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
})();