$(document).ready(function () {

    // Reset the window scroll position to top on every page load and re-load
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const optionsContainer = document.querySelector('#intro .options');
    const gradientMaskLeft = document.querySelector('#intro .gradient-mask.left');
    const texts = document.querySelectorAll('#intro .texts h1');
    const options = document.querySelectorAll('#intro .option');

    // Exit early if the container is not found
    if (!optionsContainer || !gradientMaskLeft || options.length === 0 || texts.length === 0) {
        return;
    }

    // Show/hide the gradient mask based on horizontal scroll
    optionsContainer.addEventListener('scroll', () => {
        gradientMaskLeft.classList.toggle('is-visible', optionsContainer.scrollLeft > 0);
    });

    // Function to handle option clicks
    const handleOptionClick = (option) => {
        const textClass = option.classList[1];
        if (!textClass) return;

        // Remove active state from all options and texts
        options.forEach(opt => opt.classList.remove('is-active'));
        texts.forEach(txt => txt.classList.remove('is-visible'));

        // Add active state to the clicked option and corresponding text
        option.classList.add('is-active');
        document.querySelector(`#intro .text.${textClass}`)?.classList.add('is-visible');
    };

    // Attach a single event listener using event delegation
    optionsContainer.addEventListener('click', (event) => {
        const clickedOption = event.target.closest('.option');
        if (clickedOption && optionsContainer.contains(clickedOption)) {
            handleOptionClick(clickedOption);
        }
    });
});





document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-wrapper p');
    const navLinks = document.querySelectorAll('.nav-wrapper a, .button');
    const mobMenu = document.querySelector('.mob-menu');

    // Cache nav items with their corresponding section IDs
    const navMap = [...navItems].reduce((map, item) => {
        const link = item.querySelector('a');
        const sectionId = link?.getAttribute('href')?.substring(1);
        if (sectionId) map[sectionId] = item;
        return map;
    }, {});

    // Function to update active navigation item based on section in view
    const setActiveNavItem = (sectionId) => {
        navItems.forEach(item => item.classList.remove('is-active'));
        navMap[sectionId]?.classList.add('is-active');
    };

    // Intersection Observer for detecting active section
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) setActiveNavItem(entry.target.id);
        });
    }, {
        rootMargin: '-45% 0px',
        threshold: 0
    });

    // Observe all sections
    sections.forEach(section => observer.observe(section));

    // Function to toggle menu class
    const toggleMenu = () => document.body.classList.toggle('menu-is-active');
    mobMenu?.addEventListener('click', toggleMenu);

    // Smooth scrolling with optional delay for active menu
    const smoothScroll = (event) => {
        event.preventDefault();
        const targetId = event.currentTarget.getAttribute('href')?.substring(1);
        const targetSection = document.getElementById(targetId);
        if (!targetSection) return;

        const isMenuActive = document.body.classList.contains('menu-is-active');
        if (isMenuActive) {
            setTimeout(() => {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                document.body.classList.remove('menu-is-active');
            }, 300); // Adjusted delay to 100ms as per your original requirement
        } else {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Add event listener for all navigation links
    navLinks.forEach(link => link.addEventListener('click', smoothScroll));
});

document.addEventListener('DOMContentLoaded', () => {
    // Select the button inside the heading
    const button = document.querySelector('#case-intro .heading .button');

    if (button) {
        // Add a click event listener to the button
        button.addEventListener('click', () => {
            const caseIntro = button.closest('#case-intro');
            caseIntro?.classList.toggle('is-active');
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    // Check if the user has visited before using sessionStorage
    const hasVisited = sessionStorage.getItem("vennerstrom-visited");

    if (!hasVisited) {
        // // First-time visit: add entry animation classes
        // document.body.classList.add("entry-animation");
        // document.body.classList.add("entry-loading");

        // After 1500ms, toggle the entry-loading class
        setTimeout(() => {
            document.body.classList.remove("entry-animation");
        }, 1500);
        setTimeout(() => {
            document.body.classList.remove("entry-loading");
        }, 2750);

        // Set the session storage variable to prevent future animations
        // sessionStorage.setItem("vennerstrom-visited", "true");
    }
});