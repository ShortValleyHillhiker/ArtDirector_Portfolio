const animateInOne = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry);
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
    }
  });
});

const hiddenElement1 = document.querySelectorAll(".hidden");
hiddenElement1.forEach((el) => animateInOne.observe(el));
