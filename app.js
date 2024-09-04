
function activate() {

  function toggleActiveClassOnScroll() {
    const button = document.getElementById('btn');
    if (!button) {
      return; // Exit the function if the button is not found
    }
    const scrollPosition = window.scrollY;
    const threshold = window.innerHeight / 2;

    if (scrollPosition > threshold) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  }
  window.addEventListener('scroll', toggleActiveClassOnScroll);
};

document.addEventListener('DOMContentLoaded', () => {
  activate();
});

swup.hooks.on('page:view', () => {
  activate();
});