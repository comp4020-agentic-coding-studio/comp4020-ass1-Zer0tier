(function () {
  "use strict";

  document.querySelectorAll("[data-memory-scene]").forEach(function (scene) {
    var dialog = scene.querySelector("[data-memory-dialog]");
    var closeButton = scene.querySelector("[data-memory-close]");
    var dialogQuote = scene.querySelector("[data-memory-dialog-quote]");
    var dialogHandle = scene.querySelector("[data-memory-dialog-handle]");
    var dialogContext = scene.querySelector("[data-memory-dialog-context]");
    var lastTrigger = null;

    if (!dialog) return;

    scene.querySelectorAll("[data-memory-bubble]").forEach(function (bubble) {
      bubble.addEventListener("click", function () {
        lastTrigger = bubble;
        if (dialogQuote) dialogQuote.textContent = "“" + (bubble.dataset.memoryQuote || "") + "”";
        if (dialogHandle) dialogHandle.textContent = bubble.dataset.memoryHandle || "";
        if (dialogContext) dialogContext.textContent = bubble.dataset.memoryContext || "";
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
