(function () {
  "use strict";

  var entry = document.querySelector("[data-timeline-entry]");
  if (!entry) return;

  var scenes = Array.from(entry.querySelectorAll("[data-timeline-scene]"));
  var windowElement = entry.querySelector("[data-timeline-window]");
  var enter = entry.querySelector("[data-timeline-enter]");
  var title = entry.querySelector("[data-timeline-title]");
  var status = entry.querySelector("[data-timeline-status]");
  var counter = entry.querySelector("[data-timeline-index]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var index = -1;
  var wheelTotal = 0;
  var lastWheelChange = 0;
  var touchStart = null;
  var suppressClick = false;
  var activeAnimations = [];

  function stopAnimations() {
    activeAnimations.forEach(function (animation) { animation.cancel(); });
    activeAnimations = [];
  }

  function animateChange(scene, direction) {
    stopAnimations();
    if (reduceMotion.matches || typeof scene.animate !== "function") return;
    activeAnimations.push(
      windowElement.animate([
        { opacity: 0.72, transform: "translateY(" + (-direction * 8) + "px) scale(0.992)" },
        { opacity: 1, transform: "translateY(0) scale(1)" },
      ], { duration: 420, easing: "cubic-bezier(.2,.75,.25,1)" }),
      scene.animate([
        { opacity: 0, transform: "translateY(" + (direction * 28) + "px)" },
        { opacity: 1, transform: "translateY(0)" },
      ], { duration: 440, easing: "cubic-bezier(.2,.75,.25,1)" }),
    );
  }

  function select(next, direction) {
    var bounded = Math.max(0, Math.min(scenes.length - 1, next));
    if (bounded === index && scenes[index].hidden === false) return;
    index = bounded;
    scenes.forEach(function (scene, sceneIndex) { scene.hidden = sceneIndex !== index; });
    var current = scenes[index];
    document.body.setAttribute("data-entry-version", current.dataset.id);
    title.textContent = current.dataset.title;
    status.textContent = current.dataset.name + " · " + current.dataset.year;
    counter.textContent = String(index + 1).padStart(2, "0");
    enter.href = current.dataset.href;
    enter.setAttribute("aria-label", "Enter the " + current.dataset.name + " page");
    windowElement.setAttribute("aria-label", current.dataset.name + ", " + current.dataset.year);
    animateChange(current, direction || 1);
  }

  function move(direction) {
    select(index + direction, direction);
  }

  window.addEventListener("wheel", function (event) {
    event.preventDefault();
    wheelTotal += event.deltaY;
    var now = Date.now();
    if (Math.abs(wheelTotal) < 24 || now - lastWheelChange < 360) return;
    move(wheelTotal > 0 ? 1 : -1);
    wheelTotal = 0;
    lastWheelChange = now;
  }, { passive: false });

  window.addEventListener("keydown", function (event) {
    if (["ArrowDown", "ArrowRight", "PageDown"].includes(event.key)) {
      event.preventDefault();
      move(1);
    }
    if (["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)) {
      event.preventDefault();
      move(-1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      select(0, -1);
    }
    if (event.key === "End") {
      event.preventDefault();
      select(scenes.length - 1, 1);
    }
  });

  window.addEventListener("touchstart", function (event) {
    touchStart = event.changedTouches[0].clientY;
  }, { passive: true });

  window.addEventListener("touchend", function (event) {
    if (touchStart === null) return;
    var distance = touchStart - event.changedTouches[0].clientY;
    if (Math.abs(distance) > 42) {
      suppressClick = true;
      move(distance > 0 ? 1 : -1);
      window.setTimeout(function () { suppressClick = false; }, 350);
    }
    touchStart = null;
  }, { passive: true });

  enter.addEventListener("click", function (event) {
    if (suppressClick) event.preventDefault();
  });

  select(0, 1);
})();
