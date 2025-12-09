function gridToggle() {
  document.body.classList.toggle('grid-active');
}

function clrToggle() {
  document.body.classList.toggle('theme-changed');
}

function menuToggle() {
  if (document.body.classList.contains('overlay-active')) {
    document.body.classList.remove('overlay-active');
    history.pushState(null, '', '/');
  } else {
    document.body.classList.toggle('menu-active');
  }
}

// Nav 
const sections = document.querySelectorAll('main > section');
const navLinks = document.querySelectorAll('nav li a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.parentElement.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, {
  rootMargin: '-20% 0px -60% 0px',
  threshold: 0
});

sections.forEach(section => observer.observe(section));

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector(link.getAttribute('href')).scrollIntoView({ 
      behavior: window.innerWidth >= 500 ? 'smooth' : 'instant' 
    });
    if (window.innerWidth < 500) document.body.classList.remove('menu-active');
  });
});

// THEME SLIDER
const themePicker = document.querySelector('.theme-picker input');
const themePickerBtn = document.querySelector('.btn-setting.theme-picker');
const isTouchDevice = window.matchMedia('(hover: none)').matches;

themePicker.addEventListener('input', (e) => {
  document.body.className = document.body.className.replace(/theme-\d+/g, '');
  document.body.classList.add(`theme-${e.target.value}`);
});

if (isTouchDevice) {
  themePickerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    themePickerBtn.classList.toggle('expanded');
  });

  document.addEventListener('click', () => {
    themePickerBtn.classList.remove('expanded');
  });
}

document.body.classList.add(`theme-${themePicker.value}`);





























































// Intro message switcher
const options = document.querySelectorAll('.intro-options .option');
const messages = document.querySelectorAll('.intro-content .message');

options.forEach(option => {
  option.addEventListener('click', () => {
    // Get the class that matches (O1, O2, etc.)
    const targetClass = Array.from(option.classList).find(cls => cls.startsWith('O'));
    
    // Remove active from all options and messages
    options.forEach(opt => opt.classList.remove('active'));
    messages.forEach(msg => msg.classList.remove('active'));
    
    // Add active to clicked option and corresponding message
    option.classList.add('active');
    document.querySelector(`.message.${targetClass}`).classList.add('active');
  });
});

// Intro scroll masks
const introOptions = document.querySelector('.intro-options');
const leftMask = document.querySelector('.scroll-mask.left');
const rightMask = document.querySelector('.scroll-mask.right');

introOptions.addEventListener('scroll', () => {
  const scrollLeft = introOptions.scrollLeft;
  const maxScroll = introOptions.scrollWidth - introOptions.clientWidth;
  
  // Show left mask when scrolled more than 25px from left
  leftMask.classList.toggle('scrolled', scrollLeft > 25);
  
  // Remove scrolled from right mask when within 25px of right edge
  rightMask.classList.toggle('scrolled', maxScroll - scrollLeft > 25);
});