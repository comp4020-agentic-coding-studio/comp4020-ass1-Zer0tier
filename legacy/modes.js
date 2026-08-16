// Upgrades the two nav anchors into a mode switch. Without this the same
// anchors are ordinary in-page links to two sections that are both present —
// which is why nothing here is required for the page to work.
(function () {
  "use strict";

  window.DYN = window.DYN || {};

  var nav = document.querySelector(".modes");
  var explore = document.getElementById("explore");
  var quiz = document.getElementById("quiz");
  var board = document.getElementById("scoreboard");
  if (!nav || !explore || !quiz || !board) return;

  var links = nav.querySelectorAll("a[href^='#']");
  if (links.length < 2) return;

  function show(mode) {
    var quizMode = mode === "quiz";
    explore.hidden = quizMode;
    quiz.hidden = !quizMode;
    board.hidden = !quizMode;
    for (var i = 0; i < links.length; i += 1) {
      var target = links[i].getAttribute("href").slice(1);
      var active = (target === "quiz") === quizMode;
      if (active) {
        links[i].setAttribute("aria-current", "true");
      } else {
        links[i].removeAttribute("aria-current");
      }
    }
  }

  nav.addEventListener("click", function (e) {
    var link = e.target && e.target.closest ? e.target.closest("a[href^='#']") : null;
    if (!link) return;
    var id = link.getAttribute("href").slice(1);
    if (id !== "explore" && id !== "quiz") return;
    e.preventDefault();
    show(id);
    // replaceState, not pushState: the mode is a view preference, not a place.
    // Filling the back stack with it would trap anyone trying to leave.
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", "#" + id);
    }
    var heading = document.getElementById(id === "quiz" ? "quiz-title" : "explore-title");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus();
    }
  });

  // A link into the page from outside — or from the reference list — should
  // land on the right mode rather than on a hidden section.
  function fromHash() {
    var id = window.location.hash.slice(1);
    if (id === "quiz" || id === "scoreboard") {
      show("quiz");
    } else {
      show("explore");
    }
  }

  window.addEventListener("hashchange", fromHash);
  fromHash();
})();
