(function () {
  "use strict";

  var controls = document.querySelector("[data-chapter-shortcuts]");
  var sections = Array.prototype.slice.call(document.querySelectorAll("[data-version-section]"));
  if (!controls || sections.length === 0) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var activeIndex = Math.max(0, sections.findIndex(function (section) {
    return window.location.hash === "#" + section.id;
  }));
  var navigationLockUntil = 0;
  var scrollFrame = 0;

  function isTypingTarget(target) {
    return target instanceof Element && Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
  }

  function indexAtReadingLine() {
    var readingLine = window.scrollY + window.innerHeight * 0.28;
    var index = 0;
    sections.forEach(function (section, candidate) {
      var sectionTop = section.getBoundingClientRect().top + window.scrollY;
      if (sectionTop <= readingLine) index = candidate;
    });
    return index;
  }

  function renderStatus() {
    controls.dataset.chapterIndex = String(activeIndex);
  }

  function goToChapter(nextIndex) {
    var boundedIndex = Math.max(0, Math.min(sections.length - 1, nextIndex));
    var target = sections[boundedIndex];
    activeIndex = boundedIndex;
    navigationLockUntil = Date.now() + 800;
    renderStatus();
    window.history.replaceState(null, "", "#" + target.id);
    target.scrollIntoView({
      block: "start",
      behavior: reduceMotion.matches ? "auto" : "smooth",
    });
    target.focus({ preventScroll: true });
  }

  window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || isTypingTarget(event.target)) return;
    var key = event.key.toLowerCase();
    if (key !== "w" && key !== "s") return;

    event.preventDefault();
    goToChapter(activeIndex + (key === "w" ? -1 : 1));
  });

  window.addEventListener("scroll", function () {
    if (Date.now() < navigationLockUntil || scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(function () {
      scrollFrame = 0;
      var nextIndex = indexAtReadingLine();
      if (nextIndex !== activeIndex) {
        activeIndex = nextIndex;
        renderStatus();
      }
    });
  }, { passive: true });

  window.addEventListener("hashchange", function () {
    var hashIndex = sections.findIndex(function (section) {
      return window.location.hash === "#" + section.id;
    });
    if (hashIndex >= 0) {
      activeIndex = hashIndex;
      renderStatus();
    }
  });

  renderStatus();
})();
