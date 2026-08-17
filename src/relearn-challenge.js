(function () {
  "use strict";

  document.querySelectorAll("[data-relearn]").forEach(function (section) {
    if (section.dataset.relearnEnhanced === "true") return;
    section.dataset.relearnEnhanced = "true";
    var scope = section.closest("[data-version-section]") || document;
    var desktop = scope.querySelector("[data-desktop]");
    if (!desktop) return;

    var target = desktop.querySelector("[data-relearn-target]");
    if (!target) return;

    var answer = section.querySelector("[data-relearn-answer]");
    var ask = section.querySelector("[data-relearn-ask]");
    var status = section.querySelector("[data-relearn-status]");
    var reveal = section.querySelector("[data-relearn-reveal]");
    var moved = section.querySelector("[data-relearn-moved]");
    var explanation = section.querySelector("[data-relearn-explanation]");
    var settled = false;
    var misses = 0;

    answer.hidden = true;
    if (explanation) explanation.hidden = true;
    ask.hidden = false;
    reveal.hidden = false;
    section.dataset.relearnState = "asking";

    function settle(outcome, message) {
      settled = true;
      section.dataset.relearnState = outcome;
      status.textContent = message;
      answer.hidden = false;
      if (explanation) explanation.hidden = false;
      if (moved) moved.hidden = false;
      reveal.hidden = true;
      ask.hidden = true;
      target.classList.add("is-relearn-found");
    }

    desktop.addEventListener("click", function (event) {
      if (settled) return;
      if (target.contains(event.target) || event.target === target) {
        settle("correct", "Correct — that is where it lives in this release.");
        return;
      }
      misses += 1;
      section.dataset.relearnState = "missed";
      status.textContent = misses === 1
        ? "Not there. Try again, or use Show me where."
        : "Still not there — which is rather the point. Show me where will end it.";
    }, true);

    reveal.addEventListener("click", function () {
      if (settled) return;
      settle("revealed", "Here it is. Every release below moved it again.");
    });
  });
})();
