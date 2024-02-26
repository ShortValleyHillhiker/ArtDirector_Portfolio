
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
function visitCheck() {
  if (window.location.pathname === '/index.html') {
    const firstVisit = sessionStorage.getItem("visited");
    let backgroundAni = document.querySelector(".animated-intro");
    if (firstVisit === null) {
      setTimeout(() => {
        backgroundAni.classList.remove("animate");
        sessionStorage.setItem("visited", 1);
      }, 1650);
      setTimeout(() => {
        backgroundAni.classList.remove("animated-intro");
      }, 1750);
    } else {
      backgroundAni.classList.remove("animated-intro");
    }
  } else {
    console.log("Not index");
  }
}


document.addEventListener('DOMContentLoaded', () => {
  visitCheck();
});

swup.hooks.on('page:view', () => {
  visitCheck();
});