import Swup from 'https://unpkg.com/swup@4?module';

// Initiera Swup
const swup = new Swup();

function pageLoad() {
    resetScrollPosition();
    initIntroOptions();
    initNavigation();
    initCaseIntroButton();
    closeMobileMenu();
}

document.addEventListener('DOMContentLoaded', pageLoad);

swup.hooks.on('page:view', () => {
    pageLoad();

    gtag('config', 'G-85FPDY7LFE', {
        'page_path': window.location.pathname
    });
});

  function closeMobileMenu() {
    document.body.classList.remove('menu-is-active');
}

// Funktion för att återställa fönstrets scrollposition vid omladdning
function resetScrollPosition() {
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
        setTimeout(() => {
            sessionStorage.setItem("vennerstrom-visited", "true");
        }, 250);
    }
}

// Funktion för att hantera alternativ i intro-sektionen
function initIntroOptions() {
    const optionsContainer = document.querySelector('#intro .options');
    const gradientMaskLeft = document.querySelector('#intro .gradient-mask.left');
    const texts = document.querySelectorAll('#intro .texts h1');
    const options = document.querySelectorAll('#intro .option');

    if (!optionsContainer || !gradientMaskLeft || options.length === 0 || texts.length === 0) return;

    optionsContainer.addEventListener('scroll', () => {
        gradientMaskLeft.classList.toggle('is-visible', optionsContainer.scrollLeft > 0);
    });

    optionsContainer.addEventListener('click', (event) => {
        const clickedOption = event.target.closest('.option');
        if (clickedOption && optionsContainer.contains(clickedOption)) {
            handleOptionClick(clickedOption, options, texts);
        }
    });
}

function handleOptionClick(option, options, texts) {
    const textClass = option.classList[1];
    if (!textClass) return;

    options.forEach(opt => opt.classList.remove('is-active'));
    texts.forEach(txt => txt.classList.remove('is-visible'));

    option.classList.add('is-active');
    document.querySelector(`#intro .text.${textClass}`)?.classList.add('is-visible');
}

// Funktion för att initiera navigationslogik och smooth scroll
function initNavigation() {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-wrapper p');
    const navLinks = document.querySelectorAll('.nav-wrapper a, .button');
    const mobMenu = document.querySelector('.mob-menu');
    
    const navMap = cacheNavItems(navItems);

    initIntersectionObserver(sections, navMap, navItems);
    mobMenu?.addEventListener('click', toggleMenu);

    navLinks.forEach(link => link.addEventListener('click', smoothScroll));
}

function cacheNavItems(navItems) {
    return [...navItems].reduce((map, item) => {
        const link = item.querySelector('a');
        const sectionId = link?.getAttribute('href')?.substring(1);
        if (sectionId) map[sectionId] = item;
        return map;
    }, {});
}

function initIntersectionObserver(sections, navMap, navItems) {
    const isMobileLandscape = window.innerHeight < 500 && window.innerWidth > window.innerHeight;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActiveNavItem(entry.target.id, navMap, navItems);
            }
        });
    }, {
        rootMargin: isMobileLandscape ? '-10% 0px' : '-30% 0px',
        threshold: 0.1 
    });

    sections.forEach(section => observer.observe(section));

    // För Safari och iOS - tvinga omvärdering vid fönsterstorleksändring
    window.addEventListener('resize', () => {
        sections.forEach(section => observer.unobserve(section));
        sections.forEach(section => observer.observe(section));
    });
}
function setActiveNavItem(sectionId, navMap, navItems) {
    navItems.forEach(item => item.classList.remove('is-active'));
    navMap[sectionId]?.classList.add('is-active');
}

function toggleMenu() {
    document.body.classList.toggle('menu-is-active');
}

function smoothScroll(event) {
    const targetId = event.currentTarget.getAttribute('href');
    if (targetId?.startsWith('#')) {
        event.preventDefault();
        const sectionId = targetId.substring(1);
        const targetSection = document.getElementById(sectionId);
        if (!targetSection) return;

        const isMenuActive = document.body.classList.contains('menu-is-active');
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (isMenuActive) document.body.classList.remove('menu-is-active');
    }
}

// Funktion för att hantera knapptryck i case-intro-sektionen
function initCaseIntroButton() {
    const button = document.querySelector('#case-intro .heading .button');
    button?.addEventListener('click', () => {
        const caseIntro = button.closest('#case-intro');
        caseIntro?.classList.toggle('is-active');
    });
}
