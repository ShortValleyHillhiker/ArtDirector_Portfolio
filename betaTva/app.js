const firstVisit = localStorage.getItem("visited");

let kiss = document.querySelector(".intro-top");
let bajs = document.querySelector(".intro-parent");
let testIgen = document.querySelector(".testIgen");
let test = document.querySelector(".test");
let botStartSpan = document.querySelectorAll(".bot-mid span");
let botEndSpan = document.querySelectorAll(".bot-head span");
let batten = document.querySelector(".bot-btn");
let body = document.querySelector("body");
let skitande = document.querySelector(".skitande");

if (firstVisit == null) {
  //TEST
  window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      setTimeout(() => {
        botStartSpan.forEach((span, idx) => {
          setTimeout(() => {
            span.classList.add("active");
          }, (idx + 1) * 155);
        });
      }, 350);

      setTimeout(() => {
        testIgen.classList.add("active");
      }, 0);
      setTimeout(() => {
        test.classList.add("active");
      }, 175);

      setTimeout(() => {
        botEndSpan.forEach((span, idx) => {
          setTimeout(() => {
            span.classList.add("active");
          }, (idx + 1) * 155);
        });
      }, 1400);
      setTimeout(() => {
        bajs.style.transform = "translateY(0)";
        kiss.style.transform = "translateY(calc(-100%)-1rem)";
        skitande.style.minHeight = "auto";
        skitande.style.marginBottom = "2rem";
      }, 2300);
      setTimeout(() => {
        kiss.style.display = "none";
        batten.classList.add("active");
        body.classList.remove("no-scroll");
      }, 2425);
    });
  });
  //TEST
  localStorage.setItem("visited", 1);
} else {
  //TEST
  setTimeout(() => {
    kiss.style.display = "none";
    batten.classList.add("active");
    body.classList.remove("no-scroll");
    bajs.style.transform = "translateY(0)";
    kiss.style.transform = "translateY(calc(-100%)-1rem)";
    skitande.style.minHeight = "auto";
    skitande.style.marginBottom = "2rem";

    test.classList.add("active");
    testIgen.classList.add("active");
    botStartSpan.forEach((span, idx) => {
      setTimeout(() => {
        span.classList.add("active");
      });
    });

    botEndSpan.forEach((span, idx) => {
      setTimeout(() => {
        span.classList.add("active");
      });
    });
  }, 0);
}

//animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry);
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

const hiddenElements = document.querySelectorAll(".hidden");
hiddenElements.forEach((el) => observer.observe(el));
