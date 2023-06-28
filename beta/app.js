function toggleTest() {
  let victorElement = document.querySelectorAll(".expander");
  let changeText = document.querySelector("#toggle-btn");

  victorElement.forEach((entry) => {
    entry.classList.toggle("expanded");
    if (changeText.innerHTML === "Se mer") {
      changeText.innerHTML = "Se mindre";
    } else {
      changeText.innerHTML = "Se mer";
    }
  });
}
function updateCurrentClass() {
  console.log(window.location.pathname);
  $(".active").removeClass("active");
  $(".n-links a").each(function (index) {
    if ($(this).attr("href") === window.location.pathname) {
      $(this).addClass("active");
    }
  });
}
// Toggle Active class for nav
const showAnim = gsap
  .from("nav.n-main", {
    yPercent: -100,
    paused: true,
    duration: 0.35,
    ease: "power2.inOut",
  })
  .progress(1);
ScrollTrigger.create({
  start: "top top",
  end: 99999,
  onUpdate: (self) => {
    self.direction === -1 ? showAnim.play() : showAnim.reverse();
  },
});
// Check cursor event location
let percentTop;
let percentLeft;
$(document).on("click", function (e) {
  let mouseTop = e.pageY - $(window).scrollTop();
  let mouseLeft = e.pageX;
  percentTop = (mouseTop / $(window).height()) * 100;
  percentLeft = (mouseLeft / $(window).width()) * 100;
});

// Animations
const animationEnter = (container) => {
  return gsap.from(container, { autoAlpha: 0, duration: 0.5, ease: "none", clearProps: "all" });
};
const animationLeave = (container) => {
  return gsap.to(container, {
    autoAlpha: 0,
    duration: 0.5,
    ease: "none",
    clearProps: "all",
    onComplete: () => {
      $(window).scrollTop(0);
    },
  });
};

const animationHomeEnter = (container) => {
  const caseImage = container.querySelectorAll(".c-grid--child");
  const tl = gsap.timeline({
    defaults: {
      duration: 0.5,
      ease: "power2.inOut",
    },
  });
  tl.from(caseImage, { yPercent: 10, stagger: 0.125, autoAlpha: 0 });
  return tl;
};

barba.init({
  preventRunning: true,
  transitions: [
    {
      name: "case-transition",
      to: {
        namespace: ["home"],
      },
      once({ next }) {
        animationHomeEnter(next.container);
      },
      leave: ({ current }) => animationLeave(current.container),
      enter({ next }) {
        updateCurrentClass(), animationHomeEnter(next.container);
      },
    },
    {
      name: "clip-transition",
      to: {
        namespace: ["case", "about"],
      },
      sync: true,
      enter(data) {
        updateCurrentClass();
        $(data.next.container).addClass("fixed");

        return gsap.fromTo(
          data.next.container,
          {
            clipPath: `circle(0% at ${percentLeft}% ${percentTop}%)`,
          },
          {
            clipPath: `circle(140% at ${percentLeft}% ${percentTop}%)`,
            duration: 0.75,
            ease: "power2.inOut",
            clearProps: "all",
            onComplete: () => {
              $(window).scrollTop(0);
              $(data.next.container).removeClass("fixed");
            },
          }
        );
      },
    },
  ],
});
