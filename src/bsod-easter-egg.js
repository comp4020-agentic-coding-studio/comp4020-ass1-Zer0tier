(function () {
  "use strict";

  var root = document.querySelector("[data-bsod-root]");
  if (!root) return;
  var trigger = root.querySelector("[data-bsod-trigger]");
  var screen = root.querySelector("[data-bsod-screen]");

  trigger.addEventListener("click", function () {
    document.documentElement.classList.add("bsod-active");
    document.body.classList.add("bsod-active");
    Array.from(document.body.children).forEach(function (child) {
      if (child === root) return;
      child.setAttribute("inert", "");
      child.setAttribute("aria-hidden", "true");
    });
    screen.hidden = false;
    screen.focus({ preventScroll: true });
  });
})();
