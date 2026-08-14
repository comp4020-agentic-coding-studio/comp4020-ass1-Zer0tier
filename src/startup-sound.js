(function () {
  "use strict";

  var panel = document.querySelector("[data-startup-sound]");
  if (!panel || panel.getAttribute("data-silent") === "true") return;

  var audio = panel.querySelector("[data-startup-audio]");
  var button = panel.querySelector("[data-sound-play]");
  var status = panel.querySelector("[data-sound-status]");
  if (!audio || !button || !status) return;

  function setState(state, message, buttonLabel) {
    status.setAttribute("data-state", state);
    status.textContent = message;
    button.textContent = buttonLabel;
  }

  function playSound() {
    audio.currentTime = 0;
    setState("loading", "Loading the original startup sound…", "Loading…");
    button.disabled = true;

    var attempt = audio.play();
    if (!attempt || typeof attempt.then !== "function") return;

    attempt.then(function () {
      setState("playing", "Playing the original startup sound.", "Stop sound");
      button.disabled = false;
    }).catch(function () {
      setState("blocked", "Your browser paused automatic audio. Use Play sound to hear it.", "Play sound");
      button.disabled = false;
    });
  }

  button.addEventListener("click", function () {
    if (!audio.paused) {
      audio.pause();
      audio.currentTime = 0;
      setState("stopped", "Startup sound stopped.", "Replay sound");
      return;
    }
    playSound();
  });
  audio.addEventListener("ended", function () {
    setState("complete", "Original startup sound played.", "Replay sound");
  });
  audio.addEventListener("error", function () {
    setState("error", "The startup sound could not be loaded.", "Try again");
    button.disabled = false;
  });

  playSound();
})();
