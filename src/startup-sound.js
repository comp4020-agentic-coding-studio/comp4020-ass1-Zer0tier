(function () {
  "use strict";

  var controllers = [];
  var panels = Array.from(document.querySelectorAll("[data-startup-sound]"));

  panels.forEach(function (panel) {
    if (panel.dataset.soundEnhanced === "true" || panel.getAttribute("data-silent") === "true") return;
    panel.dataset.soundEnhanced = "true";

    var audio = panel.querySelector("[data-startup-audio]");
    var button = panel.querySelector("[data-sound-play]");
    var status = panel.querySelector("[data-sound-status]");
    if (!audio || !button || !status) return;

    var active = false;
    var requestId = 0;

    function setState(state, message, buttonLabel) {
      status.setAttribute("data-state", state);
      status.textContent = message;
      button.textContent = buttonLabel;
      button.setAttribute("aria-pressed", String(state === "playing"));
      panel.setAttribute("aria-busy", String(state === "loading"));
    }

    function resetAudio() {
      audio.pause();
      try {
        audio.currentTime = 0;
      } catch {
        // A not-yet-loaded media element may reject seeking; playback can still start normally.
      }
    }

    function stopSound(message) {
      active = false;
      requestId += 1;
      resetAudio();
      setState("stopped", message || "Startup sound stopped.", "Replay sound");
    }

    function playSound() {
      controllers.forEach(function (other) {
        if (other.audio !== audio && other.isActive()) other.stop("Another startup sound was selected.");
      });

      active = true;
      requestId += 1;
      var currentRequest = requestId;
      resetAudio();
      setState("loading", "Loading the original startup sound…", "Cancel loading");

      var attempt;
      try {
        attempt = audio.play();
      } catch {
        active = false;
        setState("error", "The startup sound could not be started.", "Try again");
        return;
      }

      if (!attempt || typeof attempt.then !== "function") return;
      attempt.then(function () {
        if (!active || currentRequest !== requestId) return;
        setState("playing", "Playing the original startup sound.", "Stop sound");
      }).catch(function () {
        if (currentRequest !== requestId) return;
        active = false;
        setState("error", "Playback could not start. Try again.", "Try again");
      });
    }

    var controller = {
      audio: audio,
      isActive: function () { return active; },
      stop: stopSound
    };
    controllers.push(controller);

    button.setAttribute("aria-pressed", "false");
    panel.setAttribute("aria-busy", "false");
    button.addEventListener("click", function () {
      if (active) stopSound();
      else playSound();
    });
    audio.addEventListener("playing", function () {
      if (active) setState("playing", "Playing the original startup sound.", "Stop sound");
    });
    audio.addEventListener("waiting", function () {
      if (active) setState("loading", "Loading the original startup sound…", "Cancel loading");
    });
    audio.addEventListener("ended", function () {
      active = false;
      setState("complete", "Original startup sound played.", "Replay sound");
    });
    audio.addEventListener("error", function () {
      active = false;
      setState("error", "The startup sound could not be loaded.", "Try again");
    });
  });
})();
