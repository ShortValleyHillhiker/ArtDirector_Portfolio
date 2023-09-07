//

const elementToMove = document.getElementById("elementToMove");
let isScrolling = false;

function updateElementPosition() {
  const totalHeight = document.body.clientHeight - window.innerHeight;
  const scrollPercentage = (window.scrollY / totalHeight) * 100;
  const newPosition = scrollPercentage * 2 - 188;
  elementToMove.style.transform = `translateY(${newPosition}lvh)`;
  isScrolling = false;
}

window.addEventListener("scroll", () => {
  if (!isScrolling) {
    isScrolling = true;
    requestAnimationFrame(updateElementPosition);
  }
});

//
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
//
let kaffeknapp = document.querySelector(".kaffe-popup");
function kaffe() {
  kaffeknapp.classList.toggle("active");
}
