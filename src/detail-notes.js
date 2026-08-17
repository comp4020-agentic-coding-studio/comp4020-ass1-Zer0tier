(function () {
  "use strict";

  document.querySelectorAll("[data-detail-dialog]").forEach(function (dialog) {
    if (dialog.dataset.detailEnhanced === "true") return;
    dialog.dataset.detailEnhanced = "true";
    var scope = dialog.closest("[data-version-section]") || document;
    var number = dialog.querySelector("[data-detail-dialog-number]");
    var title = dialog.querySelector("[data-detail-dialog-title]");
    var short = dialog.querySelector("[data-detail-dialog-short]");
    var long = dialog.querySelector("[data-detail-dialog-long]");
    var source = dialog.querySelector("[data-detail-dialog-source]");
    var closeButton = dialog.querySelector("[data-detail-close]");
    var lastTrigger = null;

    scope.querySelectorAll("[data-detail-open]").forEach(function (trigger) {
      if (trigger.getAttribute("aria-controls") !== dialog.id) return;
      trigger.addEventListener("click", function () {
        lastTrigger = trigger;
        if (number) number.textContent = trigger.dataset.detailNumber || "";
        if (title) title.textContent = trigger.dataset.detailHeading || "System note";
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
  });
})();
