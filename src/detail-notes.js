(function () {
  "use strict";

  var dialog = document.querySelector("[data-detail-dialog]");
  if (!dialog) return;

  var number = dialog.querySelector("[data-detail-dialog-number]");
  var title = dialog.querySelector("[data-detail-dialog-title]");
  var short = dialog.querySelector("[data-detail-dialog-short]");
  var long = dialog.querySelector("[data-detail-dialog-long]");
  var source = dialog.querySelector("[data-detail-dialog-source]");
  var closeButton = dialog.querySelector("[data-detail-close]");
  var lastTrigger = null;

  document.querySelectorAll("[data-detail-open]").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      lastTrigger = trigger;
      if (number) number.textContent = trigger.dataset.detailNumber || "";
      if (title) title.textContent = trigger.dataset.detailHeading || "System note";
      // The one-liner from the card is repeated at the top of the window on
      // purpose: the visitor clicked it, so it is what they are holding in
      // their head, and the long version reads as an answer to it.
      if (short) short.textContent = trigger.dataset.detailShort || "";
      if (long) long.textContent = trigger.dataset.detailLong || "";
      if (source) {
        source.href = trigger.dataset.detailSourceUrl || "#";
        source.textContent = trigger.dataset.detailSourceLabel
          ? "Reference: " + trigger.dataset.detailSourceLabel
          : "Reference";
      }
      dialog.showModal();
    });
  });

  if (closeButton) closeButton.addEventListener("click", function () { dialog.close(); });

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("close", function () {
    if (lastTrigger) lastTrigger.focus({ preventScroll: true });
  });
})();
