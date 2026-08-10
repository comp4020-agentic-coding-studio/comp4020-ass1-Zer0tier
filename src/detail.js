// Fills a detail slot from the server-rendered reference article.
//
// The panel is never given content that isn't already in the page: it clones
// #d-<id> from the reference list. So the thing a JavaScript visitor sees and
// the thing a no-JavaScript visitor sees are the same bytes, and the panel
// cannot drift from the list.
//
// Exposed as window.DYN.showDetail so the quiz can reuse it for wrong answers.
(function () {
  "use strict";

  window.DYN = window.DYN || {};

  var panel = document.getElementById("detail");
  var empty = document.getElementById("detail-empty");
  var body = document.querySelector("[data-testid='dynasty-detail']");
  var status = document.getElementById("detail-status");
  if (!panel || !empty || !body || !status) return;

  var TRACKS = ["court", "north", "south", "steppe", "rival"];

  function fill(id, slot) {
    var source = document.getElementById("d-" + id);
    if (!source || !slot) return false;
    // Append the article's CHILDREN, not the article — cloning the element
    // itself would duplicate its id and break every #d-<id> link on the page.
    var clone = source.cloneNode(true);
    slot.textContent = "";
    while (clone.firstChild) slot.appendChild(clone.firstChild);
    return true;
  }

  function triggerFor(id) {
    return document.querySelector('[data-dynasty="' + id + '"]');
  }

  function tint(el, track) {
    for (var i = 0; i < TRACKS.length; i += 1) el.classList.remove("is-" + TRACKS[i]);
    if (track) el.classList.add("is-" + track);
  }

  /**
   * Fill a slot with a regime's detail. Returns false if the id is unknown, so
   * a caller can fall back rather than silently showing nothing.
   */
  function showDetail(id, slot) {
    var target = slot || body;
    if (!fill(id, target)) return false;

    var trigger = triggerFor(id);
    tint(target, trigger && trigger.getAttribute("data-track"));

    if (target === body) {
      empty.hidden = true;
      var back = document.createElement("a");
      back.className = "detail-back";
      back.href = "#explore";
      back.textContent = "Back to the timeline";
      target.appendChild(back);
    }
    return true;
  }

  function announce(id) {
    var t = triggerFor(id);
    if (!t) return;
    status.textContent =
      "Showing " +
      t.getAttribute("data-name") +
      " " +
      t.getAttribute("data-zh") +
      ", " +
      t.getAttribute("data-years") +
      ".";
  }

  window.DYN.showDetail = showDetail;
  window.DYN.announceDetail = announce;

  // One delegated listener, so this keeps working for any card regardless of
  // which band it sits in.
  document.addEventListener("click", function (e) {
    var link = e.target && e.target.closest ? e.target.closest("[data-dynasty]") : null;
    if (!link) return;
    // Let modified clicks do what the browser would normally do with a link.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    var id = link.getAttribute("data-dynasty");
    if (!showDetail(id, body)) return; // unknown id: let the anchor navigate

    e.preventDefault();
    announce(id);
    // A large content change from a deliberate activation wants focus moved,
    // not a live region reading the whole panel aloud. focus() also scrolls it
    // into view, which is the answer on a phone where the panel is below.
    panel.focus();
  });
})();
