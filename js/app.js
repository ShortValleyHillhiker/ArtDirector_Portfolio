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
      behavior: window.innerWidth >= 768 ? 'smooth' : 'instant' 
    });
    if (window.innerWidth < 768) document.body.classList.remove('menu-active');
  });
});

// Close menu on mobile when clicking nav links
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth < 768) {
      document.body.classList.remove('menu-active');
    }
  });
});

// THEME SLIDER
// const themePicker = document.querySelector('.theme-picker input');

// themePicker.addEventListener('input', (e) => {
//   for (let i = 0; i <= 6; i++) {
//     document.body.classList.remove(`theme-${i}`);
//   }
  
//   document.body.classList.add(`theme-${e.target.value}`);
// });

// document.body.classList.add(`theme-${themePicker.value}`);


const themePicker = document.querySelector('.theme-picker input');
const themePickerBtn = document.querySelector('.btn-setting.theme-picker');
let isExpanded = false;

themePickerBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (!isExpanded) {
    isExpanded = true;
    themePickerBtn.classList.add('expanded');
    document.body.classList.add('theme-picker-active');
    setTimeout(() => themePicker.style.pointerEvents = 'auto', 500);
  }
});

themePicker.addEventListener('touchend', (e) => {
  e.stopPropagation();
});

document.body.addEventListener('click', () => {
  if (isExpanded) {
    isExpanded = false;
    themePicker.style.pointerEvents = 'none';
    themePickerBtn.classList.remove('expanded');
    document.body.classList.remove('theme-picker-active');
  }
});

themePicker.addEventListener('input', (e) => {
  for (let i = 0; i <= 6; i++) document.body.classList.remove(`theme-${i}`);
  document.body.classList.add(`theme-${e.target.value}`);
});

themePicker.style.pointerEvents = 'none';
document.body.classList.add(`theme-${themePicker.value}`);