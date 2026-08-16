(function () {
  "use strict";

  document.querySelectorAll("[data-memory-scene]").forEach(function (scene) {
    var dialog = scene.querySelector("[data-memory-dialog]");
    var closeButton = scene.querySelector("[data-memory-close]");
    var dialogQuote = scene.querySelector("[data-memory-dialog-quote]");
    var dialogHandle = scene.querySelector("[data-memory-dialog-handle]");
    var dialogContext = scene.querySelector("[data-memory-dialog-context]");
    var dialogSource = scene.querySelector("[data-memory-dialog-source]");
    var lastTrigger = null;

    if (!dialog) return;

    scene.querySelectorAll("[data-memory-bubble]").forEach(function (bubble) {
      bubble.addEventListener("click", function () {
        lastTrigger = bubble;
        if (dialogQuote) dialogQuote.textContent = "“" + (bubble.dataset.memoryQuote || "") + "”";
        if (dialogHandle) dialogHandle.textContent = bubble.dataset.memoryHandle || "";
        if (dialogContext) dialogContext.textContent = bubble.dataset.memoryContext || "";
        if (dialogSource) {
          dialogSource.href = bubble.dataset.memorySourceUrl || "#";
          dialogSource.textContent = bubble.dataset.memorySourceLabel
            ? "Source: " + bubble.dataset.memorySourceLabel
            : "Read the original review";
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

    // The app cards, same window, same behaviour. Each card is a real anchor
    // to a real page, which is what a no-JS visitor gets and what a middle
    // click or "open in new tab" still does; here we intercept the plain
    // left click and show the story in place instead.
    var appDialog = scene.querySelector("[data-app-dialog]");
    var appClose = scene.querySelector("[data-app-close]");
    var appTitle = scene.querySelector("[data-app-dialog-title]");
    var appKind = scene.querySelector("[data-app-dialog-kind]");
    var appWhy = scene.querySelector("[data-app-dialog-why]");
    var appRelearn = scene.querySelector("[data-app-dialog-relearn]");
    var appSource = scene.querySelector("[data-app-dialog-source]");
    var lastAppTrigger = null;

    if (!appDialog) return;

    scene.querySelectorAll("[data-app-open]").forEach(function (link) {
      link.addEventListener("click", function (event) {
        // Leave every deliberate "open it properly" gesture alone.
        if (event.defaultPrevented) return;
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        event.preventDefault();
        lastAppTrigger = link;
        if (appTitle) appTitle.textContent = link.dataset.appName || "Popular software";
        if (appKind) appKind.textContent = link.dataset.appKind || "";
        if (appWhy) appWhy.textContent = link.dataset.appWhy || "";
        if (appRelearn) appRelearn.textContent = link.dataset.appRelearn || "";
        if (appSource) {
          appSource.href = link.dataset.appSourceUrl || "#";
          appSource.textContent = link.dataset.appSourceLabel
            ? "Reference: " + link.dataset.appSourceLabel
            : "Reference";
        }
        appDialog.showModal();
      });
    });

    if (appClose) appClose.addEventListener("click", function () { appDialog.close(); });

    appDialog.addEventListener("click", function (event) {
      if (event.target === appDialog) appDialog.close();
    });

    appDialog.addEventListener("close", function () {
      if (lastAppTrigger) lastAppTrigger.focus({ preventScroll: true });
    });
  });
})();
