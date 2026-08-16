(function () {
  "use strict";

  var section = document.querySelector("[data-history-book]");
  if (!section) return;

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
      var onThisSpread = Math.floor(index / 2) === spread;
      leaf.hidden = !onThisSpread;
    });
    if (progress) {
      var first = spread * 2 + 1;
      var last = Math.min(first + 1, leaves.length);
      progress.textContent = "Pages " + first + "–" + last + " of " + leaves.length;
    }
    if (previousButton) previousButton.disabled = spread === 0;
    if (nextButton) nextButton.disabled = spread >= spreads - 1;
  }

  // The turn is a class on the book plus one animationend. Direction matters:
  // forward lifts the right-hand leaf and lays it to the left, back does the
  // reverse, so the motion agrees with which way the reader is going.
  function turn(delta) {
    // A second press during a turn is remembered rather than dropped. Reading
    // fast is the normal way to use a book, and swallowing the keystroke makes
    // the controls feel broken even though the guard is doing its job.
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
      // Swap the content while the leaf is edge-on and nothing on it can be
      // read, then hand over to the settling half. The incoming leaf is a
      // different element, which is why it needs its own animation rather
      // than the second half of a shared one.
      spread = next;
      render();
      book.dataset.bookTurning = direction + "-in";
    }, half);

    window.setTimeout(function () {
      delete book.dataset.bookTurning;
      turning = false;
      if (queued) {
        var next = queued;
        queued = 0;
        turn(next);
      }
    }, half * 2);
  }

  function isTyping(target) {
    if (!target) return false;
    var tag = target.tagName;
    return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
  }

  document.addEventListener("keydown", function (event) {
    // The command prompt on this page has a text input, and the release pages
    // carry other shortcuts; never take a key that is being typed into
    // something, and never take one that is part of a browser or OS chord.
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
    if (isTyping(event.target)) return;

    var key = event.key.toLowerCase();
    if (key !== "q" && key !== "e") return;

    event.preventDefault();
    turn(key === "e" ? 1 : -1);
  });

  if (previousButton) previousButton.addEventListener("click", function () { turn(-1); });
  if (nextButton) nextButton.addEventListener("click", function () { turn(1); });

  section.dataset.historyEnhanced = "true";
  if (controls) controls.hidden = false;
  if (list) list.setAttribute("aria-label", "Open book, two pages at a time");
  render();
})();
