import { initHalftoneCanvases } from '/js/halftone/halftone.js';
import { initRippleCanvases } from '/js/halftone/ripplecanvas.js';

const swup = new Swup();

function initExpanders() {
  document.querySelectorAll('.expander-toggle').forEach(button => {
    const target = document.getElementById(button.dataset.target)
    if (target) {
      button.addEventListener('click', () => {
        target.classList.toggle('hidden')
      })
    }
  })
}

document.addEventListener('DOMContentLoaded', () => {

  if (document.querySelector('canvas.halftone')) {
    initHalftoneCanvases();
  }
  initRippleCanvases();
  initExpanders();


const target = document.querySelector('.page-bottom');
const header = document.querySelector('header');

if (target && header) {
  const headerHeight = header.offsetHeight;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        document.body.classList.add('nav-inverted');
      } else {
        document.body.classList.remove('nav-inverted');
      }
    },
    {
      root: null,
      threshold: 0,
      // bottom margin = viewport - header height
      // this delays the intersection until the element reaches that point
      rootMargin: `0px 0px -${window.innerHeight - (headerHeight * .95)}px 0px`
    }
  );

  observer.observe(target);
}



});

swup.hooks.on('page:view', ({ visit }) => {
  if (document.querySelector('canvas.halftone')) {
    initHalftoneCanvases();
  }
  initRippleCanvases();
  initExpanders();
});
