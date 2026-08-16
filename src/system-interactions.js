(function () {
  "use strict";

  var desktop = document.querySelector("[data-desktop]");
  var startButton = document.querySelector("[data-start-button]");
  var startPanel = document.querySelector("[data-start-panel]");
  var systemWindow = document.querySelector("[data-window]");
  var versionNav = document.querySelector("[data-version-nav]");
  var versionGlider = versionNav && versionNav.querySelector("[data-version-nav-glider]");
  var versionLinks = versionNav ? Array.from(versionNav.querySelectorAll("a[data-version-index]")) : [];
  var activeVersion = versionNav && versionNav.querySelector('a[aria-current="page"]');
  var reduceMotion = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var navigationStarted = false;

  function placeVersionGlider(link, instant) {
    if (!versionNav || !versionGlider || !link) return;
    var navRect = versionNav.getBoundingClientRect();
    var linkRect = link.getBoundingClientRect();
    if (instant) versionNav.classList.add("is-positioning");
    versionNav.style.setProperty("--version-glider-x", String(linkRect.left - navRect.left + versionNav.scrollLeft) + "px");
    versionNav.style.setProperty("--version-glider-y", String(linkRect.top - navRect.top) + "px");
    versionNav.style.setProperty("--version-glider-width", String(linkRect.width) + "px");
    versionNav.style.setProperty("--version-glider-height", String(linkRect.height) + "px");
    if (instant) {
      versionNav.getBoundingClientRect();
      versionNav.classList.remove("is-positioning");
    }
  }

  function keepVersionVisible(link) {
    if (!versionNav || !link || typeof versionNav.scrollTo !== "function") return;
    var navRect = versionNav.getBoundingClientRect();
    var linkRect = link.getBoundingClientRect();
    if (linkRect.left >= navRect.left && linkRect.right <= navRect.right) return;
    var left = versionNav.scrollLeft + linkRect.left - navRect.left - (navRect.width - linkRect.width) / 2;
    versionNav.scrollTo({ left: Math.max(0, left), behavior: "auto" });
  }

  function beginVersionNavigation(link) {
    if (!link || navigationStarted) return;
    if (link.getAttribute("aria-current") === "page") {
      versionNav.classList.remove("is-current-pulsing");
      versionNav.getBoundingClientRect();
      versionNav.classList.add("is-current-pulsing");
      return;
    }
    if (reduceMotion) {
      window.location.href = link.href;
      return;
    }
    navigationStarted = true;
    versionLinks.forEach(function (item) { item.classList.toggle("is-transition-target", item === link); });
    versionNav.classList.add("is-navigating");
    document.body.classList.add("is-version-leaving");
    placeVersionGlider(link, false);
    window.setTimeout(function () { window.location.href = link.href; }, 380);
  }

  function stepVersion(direction) {
    var currentIndex = versionLinks.indexOf(activeVersion);
    var target = versionLinks[currentIndex + direction];
    beginVersionNavigation(target || activeVersion);
  }

  if (versionNav && versionGlider && activeVersion) {
    keepVersionVisible(activeVersion);
    placeVersionGlider(activeVersion, true);
    versionNav.classList.add("is-enhanced");
    window.addEventListener("resize", function () {
      keepVersionVisible(activeVersion);
      window.requestAnimationFrame(function () { placeVersionGlider(activeVersion, true); });
    });
    versionLinks.forEach(function (link) {
      link.addEventListener("click", function (event) {
        if (event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        event.preventDefault();
        beginVersionNavigation(link);
      });
    });
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
    var eventTarget = event.target;
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || (eventTarget && typeof eventTarget.matches === "function" && eventTarget.matches("input, textarea, select"))) return;
    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
      event.preventDefault();
      stepVersion(-1);
    }
    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
      event.preventDefault();
      stepVersion(1);
    }
  });
})();
