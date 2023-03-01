const modals = document.querySelectorAll("[data-modal]");

modals.forEach(function (trigger) {
  trigger.addEventListener("click", function (event) {
    event.preventDefault();
    const modal = document.getElementById(trigger.dataset.modal);
    modal.classList.add("open");
    const exits = modal.querySelectorAll(".modal-exit");
    exits.forEach(function (exit) {
      exit.addEventListener("click", function (event) {
        event.preventDefault();
        modal.classList.remove("open");
      });
    });
  });
});

function trialScroll() {
  var element = document.getElementById("trial");
  element.scrollIntoView();
}

function scrollOne() {
  var element = document.getElementById("till-case");
  element.scrollIntoView();
}

function scrollTwo() {
  var element = document.getElementById("till-om-mig");
  element.scrollIntoView();
}
