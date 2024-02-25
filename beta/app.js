
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry);
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
    // else {
    //   entry.target.classList.remove("show");
    // }
  });
});

const hiddenElements = document.querySelectorAll(".hidden");
hiddenElements.forEach((el) => observer.observe(el));


// Siteload


const swup = new Swup();

document.addEventListener('DOMContentLoaded', () => {
  const firstVisit = sessionStorage.getItem("visited");

  let backgroundAni = document.querySelector(".animated-intro");
  let allLines = document.querySelectorAll(".animated-intro span");

  if (firstVisit == null) {
    window.addEventListener("DOMContentLoaded", () => {
      setTimeout(() => {
        backgroundAni.classList.remove("animate");
        sessionStorage.setItem("visited", 1);
      }, 1650);

      setTimeout(() => {
        backgroundAni.classList.toggle("animated-intro");

      }, 1750);
    });
  } else {
    backgroundAni.classList.remove("animate");
    backgroundAni.classList.toggle("animated-intro");
  }

  console.log("Hello world!");
});

swup.hooks.on('page:view', () => {
  const firstVisit = sessionStorage.getItem("visited");

  let backgroundAni = document.querySelector(".animated-intro");
  let allLines = document.querySelectorAll(".animated-intro span");

  if (firstVisit == null) {
    window.addEventListener("DOMContentLoaded", () => {
      setTimeout(() => {
        backgroundAni.classList.remove("animate");
        sessionStorage.setItem("visited", 1);
      }, 1650);

      setTimeout(() => {
        backgroundAni.classList.toggle("animated-intro");

      }, 1750);
    });
  } else {
    backgroundAni.classList.remove("animate");
    backgroundAni.classList.toggle("animated-intro");
  }

  console.log("every load");
});