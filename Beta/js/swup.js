import Swup from 'https://unpkg.com/swup@4.8.1';
const swup = new Swup({
  containers: ["#swup"]
});
swup.hooks.on('visit:start', () => {
//   console.log(window.location.href);
})