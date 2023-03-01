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

function scrollOne() {
  var element = document.getElementById("case");
  element.scrollIntoView();
}

function scrollTwo() {
  var element = document.getElementById("om-mig");
  element.scrollIntoView();
}

function scrollHome() {
  var element = document.getElementById("home");
  element.scrollIntoView();
}
