// Siteload
const firstVisit = sessionStorage.getItem("visited");

let backgroundAni = document.querySelector(".animated-intro");
let allLines = document.querySelectorAll(".animated-intro span");
let animateIntro = document.querySelector(".introduction");

if (firstVisit == null) {
  window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      allLines.forEach((span, idx) => {
        setTimeout(() => {
          span.classList.add("move-in");
        }, (idx + 1) * 350);
        setTimeout(() => {
          setTimeout(() => {
            span.classList.add("move-out");
            span.classList.remove("move-in");
          }, (idx + 1) * 350);
        }, 350);
      });
    });

    setTimeout(() => {
      backgroundAni.classList.remove("animate");
      sessionStorage.setItem("visited", 1);
    }, 1750);

    setTimeout(() => {
      backgroundAni.remove(".animated-intro");
      animateIntro.classList.toggle("animated-hidden");
    }, 1950);
  });
} else {
  backgroundAni.classList.remove("animate");
  backgroundAni.remove(".animated-intro");
  animateIntro.classList.toggle("animated-hidden");
}
