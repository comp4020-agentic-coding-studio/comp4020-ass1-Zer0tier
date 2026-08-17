(function () {
  "use strict";

  document.querySelectorAll("[data-version-section]").forEach(function (root) {
    var desktop = root.querySelector("[data-desktop]");
    var startButton = root.querySelector("[data-start-button]");
    var startPanel = root.querySelector("[data-start-panel]");
    var systemWindow = root.querySelector("[data-window]");
    var versionNav = root.querySelector("[data-version-nav]");
    var versionGlider = versionNav && versionNav.querySelector("[data-version-nav-glider]");
    var activeVersion = versionNav && versionNav.querySelector('a[aria-current="page"]');

    function placeVersionGlider() {
      if (!versionNav || !versionGlider || !activeVersion) return;
      var navRect = versionNav.getBoundingClientRect();
      var linkRect = activeVersion.getBoundingClientRect();
      versionNav.style.setProperty("--version-glider-x", String(linkRect.left - navRect.left + versionNav.scrollLeft) + "px");
      versionNav.style.setProperty("--version-glider-y", String(linkRect.top - navRect.top) + "px");
      versionNav.style.setProperty("--version-glider-width", String(linkRect.width) + "px");
      versionNav.style.setProperty("--version-glider-height", String(linkRect.height) + "px");
      versionNav.classList.add("is-enhanced");
    }

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

    root.querySelectorAll("[data-window-action]").forEach(function (button) {
      button.addEventListener("click", function () {
        if (!systemWindow) return;
        var action = button.getAttribute("data-window-action");
        if (action === "close" || action === "minimise") systemWindow.hidden = true;
        if (action === "maximise") systemWindow.classList.toggle("is-maximised");
      });
    });

    root.querySelectorAll("[data-open-window]").forEach(function (button) {
      button.addEventListener("click", function () {
        if (!systemWindow) return;
        systemWindow.hidden = false;
        systemWindow.classList.remove("is-maximised");
        systemWindow.setAttribute("tabindex", "-1");
        systemWindow.focus({ preventScroll: true });
      });
    });

    root.querySelectorAll("[data-system-clock]").forEach(function (clock) {
      var now = new Date();
      clock.textContent = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      clock.setAttribute("datetime", now.toISOString());
    });

    root.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && startPanel && !startPanel.hidden) {
        setStart(false);
        startButton.focus();
      }
    });

    placeVersionGlider();
    window.addEventListener("resize", function () { window.requestAnimationFrame(placeVersionGlider); });
  });

  function settleHashTarget() {
    var target = window.location.hash && document.querySelector(window.location.hash);
    if (!target) return;
    window.requestAnimationFrame(function () {
      target.scrollIntoView({ block: "start", behavior: "instant" });
      window.requestAnimationFrame(function () {
        target.scrollIntoView({ block: "start", behavior: "instant" });
        if (typeof target.focus === "function") target.focus({ preventScroll: true });
      });
    });
  }

  window.addEventListener("hashchange", settleHashTarget);
  if (document.readyState === "complete") settleHashTarget();
  else window.addEventListener("load", settleHashTarget, { once: true });
})();
