(() => {
  // <stdin>
  var intersectionObserver = null;
  var introOptionsScrollListener = null;
  function initializeNavToggle() {
    const navToggle = document.getElementById("nav-toggle");
    const mainNav = document.getElementById("main-nav");
    navToggle?.addEventListener("click", () => {
      mainNav.classList.toggle("open");
    });
    const navLinks = document.querySelectorAll("#main-nav a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 480) {
          mainNav.classList.remove("open");
        }
      });
    });
  }
  function initializeOptions() {
    const introSection = document.querySelector("#intro");
    if (!introSection) return;
    introSection.querySelectorAll(".option").forEach((option) => {
      option.addEventListener("click", () => {
        introSection.querySelectorAll(".active").forEach((el) => el.classList.remove("active"));
        option.classList.add("active");
        const targetClass = option.classList[1];
        introSection.querySelector(`.message.${targetClass}`)?.classList.add("active");
      });
    });
  }
  function initializeIntroScroll() {
    const introOptions = document.querySelector(".intro-options");
    if (introOptions) {
      if (introOptionsScrollListener) {
        introOptions.removeEventListener("scroll", introOptionsScrollListener);
      }
      introOptionsScrollListener = () => {
        const { scrollLeft, scrollWidth, clientWidth } = introOptions;
        document.querySelector(".scroll-mask.left")?.classList.toggle("scrolled", scrollLeft > 16);
        document.querySelector(".scroll-mask.right")?.classList.toggle("scrolled", scrollLeft < scrollWidth - clientWidth);
      };
      introOptions.addEventListener("scroll", introOptionsScrollListener);
    }
  }
  function initializeIntersectionObserver() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll('#main-nav a[href^="#"]');
    if (intersectionObserver) {
      intersectionObserver.disconnect();
    }
    if (sections.length > 0 && navLinks.length > 0) {
      intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const navLink = document.querySelector(`#main-nav a[href="#${entry.target.id}"]`);
            if (navLink) {
              document.querySelectorAll("#main-nav li").forEach((li) => li.classList.remove("active"));
              navLink.parentElement.classList.add("active");
            }
          }
        });
      }, {
        threshold: 0.1,
        // 50% of section must be visible
        rootMargin: "-10% 0px"
      });
      sections.forEach((section) => intersectionObserver.observe(section));
    }
  }
  function initializeLoadAnimations() {
    const elementsToAnimate = document.querySelectorAll(".on-load");
    if (elementsToAnimate.length === 0) return;
    let animationQueue = 0;
    const staggerDelay = 70;
    const loadObserver = new IntersectionObserver((entries) => {
      entries.sort((a, b) => {
        return a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      });
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const delay = index * staggerDelay;
          setTimeout(() => {
            entry.target.classList.add("loaded-in");
          }, delay);
          loadObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "-25% 0px"
    });
    elementsToAnimate.forEach((element) => {
      loadObserver.observe(element);
    });
  }
  function pageLoad() {
    initializeLoadAnimations();
    initializeNavToggle();
    initializeOptions();
    initializeIntroScroll();
    initializeIntersectionObserver();
    initializeTester();
  }
  function pageUnload() {
    if (intersectionObserver) {
      intersectionObserver.disconnect();
      intersectionObserver = null;
    }
    const introOptions = document.querySelector(".intro-options");
    if (introOptions && introOptionsScrollListener) {
      introOptions.removeEventListener("scroll", introOptionsScrollListener);
      introOptionsScrollListener = null;
    }
  }
  document.addEventListener("DOMContentLoaded", () => {
    const swup = new Swup({
      plugins: [new SwupHeadPlugin()]
    });
    pageLoad();
    swup.hooks.on("page:view", pageLoad);
    swup.hooks.on("content:replace", pageUnload);
  });
})();
