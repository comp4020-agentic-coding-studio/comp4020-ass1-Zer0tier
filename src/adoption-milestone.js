(function () {
  "use strict";

  document.querySelectorAll("[data-adoption-milestone]").forEach(function (section) {
    if (section.dataset.adoptionEnhanced === "true") return;
    section.dataset.adoptionEnhanced = "true";
    var count = section.querySelector("[data-adoption-count]");
    var targetValue = Number(section.dataset.adoptionValue);
    var finalDisplay = section.dataset.adoptionDisplay;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var started = false;
    // The markup carries the real figure so a no-JS visitor reads a true
    // number. Only take it down to zero once we know we are the ones who will
    // count it back up — same condition the animated branch of reveal() uses.
    var willAnimate = !reduceMotion && typeof window.requestAnimationFrame === "function";
    if (willAnimate) count.textContent = "0";

    function formatValue(value) {
      if (value >= 999.5) return (value / 1000).toFixed(0) + "B";
      if (value >= 100) return Math.round(value) + "M";
      if (value >= 1) return value.toFixed(1).replace(".0", "") + "M";
      return Math.round(value * 1000) + "K";
    }

    function reveal() {
      if (started) return;
      started = true;
      section.classList.add("is-visible");
      if (reduceMotion || typeof window.requestAnimationFrame !== "function") {
        count.textContent = finalDisplay;
        return;
      }

      var startTime = performance.now();
      function tick(now) {
        var progress = Math.min(1, (now - startTime) / 900);
        var eased = 1 - Math.pow(1 - progress, 3);
        count.textContent = progress === 1 ? finalDisplay : formatValue(targetValue * eased);
        if (progress < 1) window.requestAnimationFrame(tick);
      }
      window.requestAnimationFrame(tick);
    }

    if (reduceMotion || typeof window.IntersectionObserver !== "function") {
      reveal();
      return;
    }

    var observer = new window.IntersectionObserver(function (entries) {
      if (!entries.some(function (entry) { return entry.isIntersecting; })) return;
      observer.disconnect();
      reveal();
    }, { threshold: 0.28 });
    observer.observe(section);
  });
})();
