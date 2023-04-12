const firstVisit = sessionStorage.getItem("visited");

let iT = document.querySelector(".intro-top");
let iP = document.querySelector(".intro-parent");
let testIgen = document.querySelector(".testIgen");
let test = document.querySelector(".test");
let bmSpan = document.querySelectorAll(".bot-mid span");
let bhSpan = document.querySelectorAll(".bot-head span");
let bb = document.querySelector(".bot-btn");
let body = document.querySelector("body");
let skitande = document.querySelector(".skitande");

if (firstVisit == null) {
  //TEST
  window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      setTimeout(() => {
        bmSpan.forEach((span, idx) => {
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
        bhSpan.forEach((span, idx) => {
          setTimeout(() => {
            span.classList.add("active");
          }, (idx + 1) * 155);
        });
      }, 1400);
      setTimeout(() => {
        iP.style.transform = "translateY(0)";
        iT.style.transform = "translateY(calc(-100%)-1rem)";
        skitande.style.minHeight = "auto";
        skitande.style.marginBottom = "2rem";
        sessionStorage.setItem("visited", 1);
      }, 2300);
      setTimeout(() => {
        iT.style.display = "none";
        bb.classList.add("active");
        body.classList.remove("no-scroll");
      }, 2425);
    });
  });
  //TEST
} else {
  //TEST
  setTimeout(() => {
    iP.style.transition = "none";
    iT.style.display = "none";
    bb.classList.add("active");
    body.classList.remove("no-scroll");
    iP.style.transform = "translateY(0)";
    iT.style.transform = "translateY(calc(-100%)-1rem)";
    skitande.style.minHeight = "auto";
    skitande.style.marginBottom = "2rem";

    test.classList.add("active");
    testIgen.classList.add("active");
    bmSpan.forEach((span, idx) => {
      setTimeout(() => {
        span.classList.add("active");
      });
    });

    bhSpan.forEach((span, idx) => {
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
