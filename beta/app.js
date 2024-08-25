
function activate() {
  const btn = document.getElementById('btn');

  function getLvh(lvh) {
    return (lvh / 100) * Math.max(window.innerHeight, document.documentElement.clientHeight);
  }
  window.addEventListener('scroll', () => {
    const distanceFromBottom = document.body.offsetHeight - (window.innerHeight + window.scrollY);
    const lvh100 = getLvh(200);
    if (distanceFromBottom <= lvh100) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  activate();
});

swup.hooks.on('page:view', () => {
  activate();
});