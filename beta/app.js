
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
  if (window.location.pathname === '/') {
    console.log("animated-intro start");

    const firstVisit = sessionStorage.getItem("visited");
    let backgroundAni = document.querySelector(".animated-intro");
    let allLines = document.querySelectorAll(".animated-intro span");

    if (firstVisit === null) {
      setTimeout(() => {
        backgroundAni.classList.remove("animate");
        sessionStorage.setItem("visited", 1);
      }, 1650);

      setTimeout(() => {
        backgroundAni.classList.remove("animated-intro");
      }, 2350);

    } else {
      backgroundAni.classList.remove("animated-intro");
      console.log("animated-intro removed");
    }
  } else {
    console.log("Not index");
  }
}


document.addEventListener('DOMContentLoaded', () => {
  visitCheck();
  console.log("first load");
});

swup.hooks.on('page:view', () => {
  visitCheck();
  console.log("every load");
});