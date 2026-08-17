(function () {
  "use strict";

  var books = [];
  document.querySelectorAll("[data-history-book]").forEach(function (section) {
    if (section.dataset.historyEnhanced === "true") return;
    var book = section.querySelector("[data-book]");
    var list = section.querySelector("[data-book-pages]");
    var controls = section.querySelector("[data-book-controls]");
    var progress = section.querySelector("[data-book-progress]");
    var previousButton = section.querySelector("[data-book-previous]");
    var nextButton = section.querySelector("[data-book-next]");
    var leaves = Array.prototype.slice.call(section.querySelectorAll("[data-book-page]"));
    if (!book || !leaves.length) return;

    var spreads = Number(book.dataset.bookSpreads) || Math.ceil(leaves.length / 2);
    var spread = 0;
    var turning = false;
    var queued = 0;

    function reduceMotion() {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    function render() {
      leaves.forEach(function (leaf, index) {
        leaf.hidden = Math.floor(index / 2) !== spread;
      });
      if (progress) {
        var first = spread * 2 + 1;
        var last = Math.min(first + 1, leaves.length);
        progress.textContent = "Pages " + first + "–" + last + " of " + leaves.length;
      }
      if (previousButton) previousButton.disabled = spread === 0;
      if (nextButton) nextButton.disabled = spread >= spreads - 1;
    }

    function turn(delta) {
      if (turning) {
        queued = delta;
        return;
      }
      var next = spread + delta;
      if (next < 0 || next > spreads - 1) return;
      if (reduceMotion() || typeof book.animate !== "function") {
        spread = next;
        render();
        return;
      }

      turning = true;
      var direction = delta > 0 ? "forward" : "back";
      var half = 260;
      book.dataset.bookTurning = direction + "-out";
      window.setTimeout(function () {
        spread = next;
        render();
        book.dataset.bookTurning = direction + "-in";
      }, half);
      window.setTimeout(function () {
        delete book.dataset.bookTurning;
        turning = false;
        if (queued) {
          var nextQueued = queued;
          queued = 0;
          turn(nextQueued);
        }
      }, half * 2);
    }

    if (previousButton) previousButton.addEventListener("click", function () { turn(-1); });
    if (nextButton) nextButton.addEventListener("click", function () { turn(1); });
    section.dataset.historyEnhanced = "true";
    if (controls) controls.hidden = false;
    if (list) list.setAttribute("aria-label", "Open book, two pages at a time");
    render();
    books.push({ section: section, turn: turn });
  });

  function isTyping(target) {
    if (!target) return false;
    var tag = target.tagName;
    return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
  }

  document.addEventListener("keydown", function (event) {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || isTyping(event.target)) return;
    var key = event.key.toLowerCase();
    if (key !== "q" && key !== "e") return;
    var focusedBook = books.find(function (item) { return item.section.contains(document.activeElement); });
    var activeBook = focusedBook || books.reduce(function (closest, item) {
      var distance = Math.abs(item.section.getBoundingClientRect().top - window.innerHeight * 0.35);
      return !closest || distance < closest.distance ? { item: item, distance: distance } : closest;
    }, null)?.item;
    if (!activeBook) return;
    event.preventDefault();
    activeBook.turn(key === "e" ? 1 : -1);
  });
})();
