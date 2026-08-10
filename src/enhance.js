// Adds `.js` to <html>, which is what reveals every .js-only control.
//
// It only does so once the hooks the other scripts need are confirmed present.
// The failure this prevents is specific: markup drifts, a script bails out on
// its own missing element, and the visitor is left looking at a Start button
// that does nothing. Better to stay in the no-JS state, which is a working
// page, than to offer a control that lies.
(function () {
  "use strict";

  window.DYN = window.DYN || {};

  var NEEDED = [
    "detail",
    "detail-empty",
    "detail-status",
    "quiz",
    "quiz-start",
    "quiz-status",
    "score-list",
    "score-empty",
    "score-status",
  ];

  for (var i = 0; i < NEEDED.length; i += 1) {
    if (!document.getElementById(NEEDED[i])) return;
  }
  if (!document.querySelector("[data-dynasty]")) return;

  document.documentElement.classList.add("js");
})();
