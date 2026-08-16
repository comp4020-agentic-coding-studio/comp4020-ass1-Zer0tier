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
  var steps = Array.from(entry.querySelectorAll("[data-timeline-step]"));
  var selector = entry.querySelector("[data-timeline-selector]");
  var highlight = entry.querySelector("[data-timeline-highlight]");
  var keyboardStatus = entry.querySelector("[data-timeline-keyboard-status]");
  var reach = entry.querySelector("[data-timeline-reach]");
  var reachCount = reach.querySelector("[data-reach-count]");
  var reachMeter = reach.querySelector("[data-reach-meter]");
  var reachPeriod = reach.querySelector("[data-reach-period]");
  var reachDetail = reach.querySelector("[data-reach-detail]");
  var reachSource = reach.querySelector("[data-reach-source]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var index = -1;
  var wheelTotal = 0;
  var wheelDirection = 0;
  var lastWheelChange = 0;
  var touchStart = null;
  var suppressClick = false;
  var activeAnimations = [];
  var transitionToken = 0;
  var isTransitioning = false;
  var reachFrame = 0;
  var resizeFrame = 0;
  var displayedReachValue = Number(scenes[0].dataset.reachValue);

  function cancelAnimations() {
    activeAnimations.forEach(function (animation) { animation.cancel(); });
    activeAnimations = [];
  }

  function settleScenes(current) {
    scenes.forEach(function (scene) {
      scene.hidden = scene !== current;
      scene.style.removeProperty("z-index");
    });
    entry.classList.remove("is-transitioning");
    isTransitioning = false;
  }

  function animateChange(previous, current, direction) {
    cancelAnimations();
    transitionToken += 1;
    var token = transitionToken;

    if (!previous || reduceMotion.matches || typeof current.animate !== "function") {
      settleScenes(current);
      return;
    }

    isTransitioning = true;
    entry.classList.add("is-transitioning");
    entry.dataset.transitionDirection = direction > 0 ? "next" : "previous";
    scenes.forEach(function (scene) { scene.hidden = scene !== previous && scene !== current; });
    previous.style.zIndex = "1";
    current.style.zIndex = "2";

    var easing = "cubic-bezier(.45,.05,.55,.95)";
    activeAnimations.push(
      previous.animate([
        { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
        { opacity: 0, transform: "translate3d(0, " + (-direction * 4.5) + "%, 0) scale(.975)" },
      ], { duration: 460, easing: easing, fill: "both" }),
      current.animate([
        { opacity: 0, transform: "translate3d(0, " + (direction * 9) + "%, 0) scale(1.018)" },
        { opacity: 0.38, offset: 0.38 },
        { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
      ], { duration: 620, easing: easing, fill: "both" }),
      windowElement.animate([
        { transform: "translate3d(0, " + (direction * 4) + "px, 0) scale(.994)" },
        { transform: "translate3d(0, 0, 0) scale(1)" },
      ], { duration: 620, easing: easing }),
      title.animate([
        { opacity: 0, transform: "translateY(" + (direction * 7) + "px)" },
        { opacity: 1, transform: "translateY(0)" },
      ], { duration: 430, delay: 110, easing: "cubic-bezier(.2,.7,.2,1)" }),
      status.animate([
        { opacity: 0, transform: "translateY(" + (direction * 6) + "px)" },
        { opacity: 1, transform: "translateY(0)" },
      ], { duration: 390, delay: 140, easing: "cubic-bezier(.2,.7,.2,1)" }),
      counter.animate([
        { opacity: 0, transform: "translateY(" + (direction * 6) + "px)" },
        { opacity: 1, transform: "translateY(0)" },
      ], { duration: 390, delay: 140, easing: "cubic-bezier(.2,.7,.2,1)" }),
    );

    Promise.all(activeAnimations.map(function (animation) {
      return animation.finished.catch(function () {});
    })).then(function () {
      if (token !== transitionToken) return;
      cancelAnimations();
      settleScenes(current);
    });
  }

  function bump(direction) {
    if (reduceMotion.matches || !highlight) return;
    var className = direction < 0 ? "is-bumping-left" : "is-bumping-right";
    highlight.classList.remove("is-bumping-left", "is-bumping-right");
    void highlight.offsetWidth;
    highlight.classList.add(className);
    window.setTimeout(function () { highlight.classList.remove(className); }, 300);
    if (typeof windowElement.animate === "function") {
      windowElement.animate([
        { transform: "translateX(0)" },
        { transform: "translateX(" + (direction < 0 ? 7 : -7) + "px)", offset: 0.42 },
        { transform: "translateX(0)" },
      ], { duration: 300, easing: "cubic-bezier(.2,.75,.25,1)" });
    }
  }

  function keepStepVisible(step, instant) {
    if (!step || typeof step.scrollIntoView !== "function") return;
    var stepBox = step.getBoundingClientRect();
    var selectorBox = selector.getBoundingClientRect();
    if (stepBox.left < selectorBox.left || stepBox.right > selectorBox.right) {
      step.scrollIntoView({ behavior: reduceMotion.matches || instant ? "auto" : "smooth", block: "nearest", inline: "center" });
    }
  }

  function formatReach(value) {
    if (value >= 999.5) return (value / 1000).toFixed(value >= 1050 ? 1 : 0) + "B";
    if (value >= 100) return Math.round(value) + "M";
    if (value >= 10) return value.toFixed(value < 20 ? 1 : 0).replace(".0", "") + "M";
    if (value >= 1) return value.toFixed(1).replace(".0", "") + "M";
    return Math.round(value * 1000) + "K";
  }

  function updateReach(current) {
    var targetValue = Number(current.dataset.reachValue);
    var finalDisplay = current.dataset.reachDisplay;
    reachMeter.style.setProperty("--reach-scale", current.dataset.reachScale);
    reachPeriod.textContent = current.dataset.reachPeriod;
    reachDetail.textContent = current.dataset.reachDetail;
    reachSource.textContent = current.dataset.reachSource;
    reachSource.href = current.dataset.reachSourceUrl;
    reach.dataset.sourceUrl = current.dataset.reachSourceUrl;

    if (reachFrame && typeof window.cancelAnimationFrame === "function") window.cancelAnimationFrame(reachFrame);
    if (reduceMotion.matches || typeof window.requestAnimationFrame !== "function") {
      displayedReachValue = targetValue;
      reachCount.textContent = finalDisplay;
      return;
    }

    var startValue = displayedReachValue;
    var startTime = performance.now();
    function tick(now) {
      var progress = Math.min(1, (now - startTime) / 680);
      var eased = 1 - Math.pow(1 - progress, 3);
      displayedReachValue = startValue + (targetValue - startValue) * eased;
      reachCount.textContent = progress === 1 ? finalDisplay : formatReach(displayedReachValue);
      if (progress < 1) reachFrame = window.requestAnimationFrame(tick);
      else reachFrame = 0;
    }
    reachFrame = window.requestAnimationFrame(tick);

    if (typeof reach.animate === "function") {
      reach.animate([
        { opacity: 0.76, transform: "translateY(4px)" },
        { opacity: 1, transform: "translateY(0)" },
      ], { duration: 500, delay: 80, easing: "cubic-bezier(.2,.7,.2,1)" });
    }
  }

  function select(next, direction) {
    var bounded = Math.max(0, Math.min(scenes.length - 1, next));
    if (bounded === index && scenes[index].hidden === false) return;
    var previous = index >= 0 ? scenes[index] : null;
    index = bounded;
    var current = scenes[index];

    document.body.setAttribute("data-entry-version", current.dataset.id);
    title.textContent = current.dataset.title;
    status.textContent = current.dataset.name + " · " + current.dataset.year;
    counter.textContent = String(index + 1).padStart(2, "0");
    enter.href = current.dataset.href;
    enter.setAttribute("aria-label", "Enter the " + current.dataset.name + " page");
    windowElement.setAttribute("aria-label", current.dataset.name + ", " + current.dataset.year);
    selector.style.setProperty("--timeline-offset", (index * 100) + "%");
    steps.forEach(function (step, stepIndex) {
      var active = stepIndex === index;
      step.dataset.active = String(active);
      if (active) step.setAttribute("aria-current", "step");
      else step.removeAttribute("aria-current");
    });
    keepStepVisible(steps[index]);
    keyboardStatus.textContent = current.dataset.name + " selected, item " + (index + 1) + " of " + scenes.length + ".";
    updateReach(current);
    animateChange(previous, current, direction || 1);
  }

  function move(direction) {
    if (isTransitioning) return;
    var next = index + direction;
    if (next < 0 || next >= scenes.length) {
      bump(direction);
      keyboardStatus.textContent = direction < 0 ? "Start of the timeline. Windows 1.0 remains selected." : "End of the timeline. Windows 11 remains selected.";
      return;
    }
    select(next, direction);
  }

  steps.forEach(function (step) {
    step.addEventListener("click", function (event) {
      event.preventDefault();
      if (isTransitioning) return;
      var next = Number(step.dataset.stepIndex);
      select(next, next < index ? -1 : 1);
    });
  });

  window.addEventListener("wheel", function (event) {
    event.preventDefault();
    if (isTransitioning) return;
    var delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (delta === 0) return;
    var direction = delta > 0 ? 1 : -1;
    if (wheelDirection && direction !== wheelDirection) wheelTotal = 0;
    wheelDirection = direction;
    wheelTotal += delta;
    var now = Date.now();
    if (Math.abs(wheelTotal) < 28 || now - lastWheelChange < 460) return;
    move(direction);
    wheelTotal = 0;
    lastWheelChange = now;
  }, { passive: false });

  window.addEventListener("keydown", function (event) {
    var editable = event.target && typeof event.target.matches === "function" && event.target.matches("input, textarea, select, [contenteditable='true']");
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || editable) return;
    var key = event.key.toLowerCase();
    if (["ArrowDown", "ArrowRight", "PageDown"].includes(event.key) || key === "d") {
      event.preventDefault();
      move(1);
    }
    if (["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key) || key === "a") {
      event.preventDefault();
      move(-1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      if (!isTransitioning) select(0, -1);
    }
    if (event.key === "End") {
      event.preventDefault();
      if (!isTransitioning) select(scenes.length - 1, 1);
    }
  });

  window.addEventListener("touchstart", function (event) {
    var point = event.changedTouches[0];
    touchStart = { x: point.clientX, y: point.clientY };
  }, { passive: true });

  window.addEventListener("touchend", function (event) {
    if (touchStart === null) return;
    if (isTransitioning) {
      touchStart = null;
      return;
    }
    var point = event.changedTouches[0];
    var distanceX = touchStart.x - point.clientX;
    var distanceY = touchStart.y - point.clientY;
    var distance = Math.abs(distanceX) > Math.abs(distanceY) ? distanceX : distanceY;
    if (Math.abs(distance) > 42) {
      suppressClick = true;
      move(distance > 0 ? 1 : -1);
      window.setTimeout(function () { suppressClick = false; }, 700);
    }
    touchStart = null;
  }, { passive: true });

  window.addEventListener("touchcancel", function () { touchStart = null; }, { passive: true });

  window.addEventListener("resize", function () {
    if (isTransitioning) {
      cancelAnimations();
      settleScenes(scenes[index]);
    }
    if (resizeFrame && typeof window.cancelAnimationFrame === "function") window.cancelAnimationFrame(resizeFrame);
    if (typeof window.requestAnimationFrame !== "function") {
      keepStepVisible(steps[index], true);
      return;
    }
    resizeFrame = window.requestAnimationFrame(function () {
      keepStepVisible(steps[index], true);
      resizeFrame = 0;
    });
  });

  enter.addEventListener("click", function (event) {
    if (suppressClick) event.preventDefault();
  });

  select(0, 1);
})();
