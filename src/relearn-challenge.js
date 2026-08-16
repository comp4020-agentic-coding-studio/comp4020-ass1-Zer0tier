(function () {
  "use strict";

  var section = document.querySelector("[data-relearn]");
  var desktop = document.querySelector("[data-desktop]");
  if (!section || !desktop) return;

  var target = desktop.querySelector("[data-relearn-target]");
  if (!target) return;

  var answer = section.querySelector("[data-relearn-answer]");
  var ask = section.querySelector("[data-relearn-ask]");
  var status = section.querySelector("[data-relearn-status]");
  var reveal = section.querySelector("[data-relearn-reveal]");
  var moved = section.querySelector("[data-relearn-moved]");
  var settled = false;
  var misses = 0;

  // Turn the statement into a question. Everything below this line only runs
  // when scripting is available, which is why the server-rendered markup is
  // the answer rather than a placeholder.
  answer.hidden = true;
  ask.hidden = false;
  reveal.hidden = false;
  section.dataset.relearnState = "asking";

  function settle(outcome, message) {
    settled = true;
    section.dataset.relearnState = outcome;
    status.textContent = message;
    answer.hidden = false;
    if (moved) moved.hidden = false;
    reveal.hidden = true;
    ask.hidden = true;
    target.classList.add("is-relearn-found");
  }

  // Capture phase, deliberately. On most releases the answer IS the Start
  // button, and system-interactions.js calls stopPropagation() there so that
  // opening the Start menu does not immediately trip the desktop's
  // click-outside-to-close handler. A bubble listener here never sees the one
  // click that matters. Capture runs ancestor-first, before that call.
  desktop.addEventListener("click", function (event) {
    if (settled) return;
    // Nothing in here calls preventDefault or stopPropagation: the
    // recreation's own controls still do what they did before, so a correct
    // guess also opens the real Start menu. Getting it right should feel like
    // using the machine.
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
    // Focus is deliberately not moved: the visitor asked where it is, not to
    // be sent there. The highlight and the revealed answer say it instead.
  });
})();
