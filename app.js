const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry);
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
    }
  });
});

const hiddenElements = document.querySelectorAll(".hidden");
hiddenElements.forEach((el) => observer.observe(el));

function scrollOne() {
  var element = document.getElementById("one");
  element.scrollIntoView();
}

function scrollTwo() {
  var element = document.getElementById("two");
  element.scrollIntoView();
}

function scrollHome() {
  var element = document.getElementById("home");
  element.scrollIntoView();
}
