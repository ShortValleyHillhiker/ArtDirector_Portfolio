const header = document.querySelector("#contact");
const sectionOne = document.querySelector(".home-intro");

const faders = document.querySelectorAll(".fade-in");
const sliders = document.querySelectorAll(".slide-in");

const sectionOneOptions = {
  rootMargin: "100px 0px  0px 0px",
};

const sectionOneObserver = new IntersectionObserver(function (entries, sectionOneObserver) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      header.classList.add("nav-scrolled");
    } else {
      header.classList.remove("nav-scrolled");
    }
  });
}, sectionOneOptions);

sectionOneObserver.observe(sectionOne);
