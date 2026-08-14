(function () {
  "use strict";

  var desktop = document.querySelector("[data-desktop]");
  var startButton = document.querySelector("[data-start-button]");
  var startPanel = document.querySelector("[data-start-panel]");
  var systemWindow = document.querySelector("[data-window]");

  function setStart(open) {
    if (!startButton || !startPanel) return;
    startPanel.hidden = !open;
    startButton.setAttribute("aria-expanded", String(open));
    startButton.classList.toggle("is-active", open);
  }

  if (startButton && startPanel) {
    startButton.addEventListener("click", function (event) {
      event.stopPropagation();
      setStart(startPanel.hidden);
    });
    startPanel.addEventListener("click", function (event) { event.stopPropagation(); });
  }

  if (desktop) {
    desktop.addEventListener("click", function (event) {
      if (startPanel && !startPanel.hidden && !event.target.closest("[data-start-button], [data-start-panel]")) setStart(false);
    });
  }

  document.querySelectorAll("[data-window-action]").forEach(function (button) {
    button.addEventListener("click", function () {
      if (!systemWindow) return;
      var action = button.getAttribute("data-window-action");
      if (action === "close" || action === "minimise") systemWindow.hidden = true;
      if (action === "maximise") systemWindow.classList.toggle("is-maximised");
    });
  });

  document.querySelectorAll("[data-open-window]").forEach(function (button) {
    button.addEventListener("click", function () {
      if (!systemWindow) return;
      systemWindow.hidden = false;
      systemWindow.classList.remove("is-maximised");
      if (typeof systemWindow.focus === "function") {
        systemWindow.setAttribute("tabindex", "-1");
        systemWindow.focus({ preventScroll: true });
      }
    });
  });

  document.querySelectorAll("[data-system-clock]").forEach(function (clock) {
    var now = new Date();
    clock.textContent = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    clock.setAttribute("datetime", now.toISOString());
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && startPanel && !startPanel.hidden) {
      setStart(false);
      startButton.focus();
      return;
    }
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.target.matches("input, textarea, select")) return;
    if (event.key === "ArrowLeft") {
      var previous = document.querySelector(".previous-release");
      if (previous) window.location.href = previous.href;
    }
    if (event.key === "ArrowRight") {
      var next = document.querySelector(".next-release");
      if (next) window.location.href = next.href;
    }
  });
})();
