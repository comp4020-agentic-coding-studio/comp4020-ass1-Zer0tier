(function () {
  "use strict";

  document.querySelectorAll("[data-command-shell]").forEach(function (shell) {
    var desktop = shell.closest("[data-desktop]");
    var openButton = shell.querySelector("[data-command-open]");
    var externalOpenButtons = Array.from(desktop.querySelectorAll("[data-command-external-open]"));
    var commandWindow = shell.querySelector("[data-command-window]");
    var closeButton = shell.querySelector("[data-command-close]");
    var minimiseButton = shell.querySelector("[data-command-minimise]");
    var maximiseButton = shell.querySelector("[data-command-maximise]");
    var handle = shell.querySelector("[data-command-handle]");
    var form = shell.querySelector("[data-command-form]");
    var input = shell.querySelector("[data-command-input]");
    var output = shell.querySelector("[data-command-output]");
    var screen = shell.querySelector("[data-command-screen]");
    var prompt = shell.dataset.commandPrompt;
    var version = shell.dataset.commandVersion;
    var legacy = shell.dataset.commandLegacy === "true";
    var releaseYear = shell.dataset.commandYear;
    var history = [];
    var historyIndex = 0;
    var lastOpenButton = openButton;

    function showWindow(event) {
      lastOpenButton = event && event.currentTarget ? event.currentTarget : openButton;
      commandWindow.hidden = false;
      commandWindow.classList.remove("is-minimised");
      window.setTimeout(function () { input.focus({ preventScroll: true }); }, 0);
    }

    function writeLine(text, className) {
      var line = document.createElement("p");
      if (className) line.className = className;
      line.textContent = text || "\u00a0";
      output.appendChild(line);
    }

    function directoryListing() {
      writeLine(" Volume in drive C has no label.");
      writeLine(" Volume Serial Number is 3A7F-19C2");
      writeLine("");
      writeLine(" Directory of " + prompt.slice(0, -1));
      writeLine("");
      writeLine("04/15/" + releaseYear + "  08:42 PM    <DIR>          WINDOWS");
      writeLine("04/15/" + releaseYear + "  08:42 PM    <DIR>          PROGRA~1");
      writeLine("04/15/" + releaseYear + "  08:42 PM               124 AUTOEXEC.BAT");
      writeLine("04/15/" + releaseYear + "  08:42 PM               421 CONFIG.SYS");
      writeLine("               2 File(s)            545 bytes");
      writeLine("               2 Dir(s)     1,245,683,200 bytes free");
    }

    function runCommand(rawCommand) {
      var command = rawCommand.trim();
      var lower = command.toLowerCase();
      writeLine(prompt + command, "command-entered");
      if (!command) return;
      if (lower === "cls") {
        output.textContent = "";
        return;
      }
      if (lower === "help") {
        writeLine("For more information on a specific command, type HELP command-name");
        writeLine("CLS        Clears the screen.");
        writeLine("DATE       Displays the current date.");
        writeLine("DIR        Displays files and subdirectories.");
        writeLine("ECHO       Displays messages.");
        writeLine("HELP       Provides Help information.");
        writeLine("TIME       Displays the current time.");
        writeLine("VER        Displays the Windows version.");
        return;
      }
      if (lower === "ver") {
        writeLine(version.replace("\n", " "));
        return;
      }
      if (lower === "dir" || lower.startsWith("dir ")) {
        directoryListing();
        return;
      }
      if (lower === "date") {
        writeLine("Current date is " + new Date().toLocaleDateString("en-AU"));
        return;
      }
      if (lower === "time") {
        writeLine("Current time is " + new Date().toLocaleTimeString("en-AU"));
        return;
      }
      if (lower === "whoami" && !legacy) {
        writeLine("desktop-evolution\\alex");
        return;
      }
      if (lower === "winver") {
        writeLine(version.replace("\n", " "));
        return;
      }
      if (lower === "exit") {
        commandWindow.hidden = true;
        lastOpenButton.focus();
        return;
      }
      if (lower === "echo") {
        writeLine("ECHO is on.");
        return;
      }
      if (lower.startsWith("echo ")) {
        writeLine(command.slice(5));
        return;
      }
      writeLine(legacy ? "Bad command or file name" : "'" + command + "' is not recognized as an internal or external command,");
      if (!legacy) writeLine("operable program or batch file.");
    }

    openButton.addEventListener("click", showWindow);
    externalOpenButtons.forEach(function (button) { button.addEventListener("click", showWindow); });
    closeButton.addEventListener("click", function () {
      commandWindow.hidden = true;
      lastOpenButton.focus();
    });
    minimiseButton.addEventListener("click", function () {
      commandWindow.hidden = true;
      lastOpenButton.focus();
    });
    maximiseButton.addEventListener("click", function () {
      commandWindow.classList.toggle("is-maximised");
      input.focus({ preventScroll: true });
    });
    screen.addEventListener("click", function () { input.focus({ preventScroll: true }); });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var command = input.value;
      if (command.trim()) {
        history.push(command);
        historyIndex = history.length;
      }
      runCommand(command);
      input.value = "";
      screen.scrollTop = screen.scrollHeight;
    });

    input.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
      event.preventDefault();
      if (event.key === "ArrowUp" && historyIndex > 0) historyIndex -= 1;
      if (event.key === "ArrowDown" && historyIndex < history.length) historyIndex += 1;
      input.value = history[historyIndex] || "";
    });

    var drag = null;
    handle.addEventListener("pointerdown", function (event) {
      if (event.target.closest("button") || commandWindow.classList.contains("is-maximised")) return;
      var windowBox = commandWindow.getBoundingClientRect();
      var desktopBox = desktop.getBoundingClientRect();
      drag = { x: event.clientX, y: event.clientY, left: windowBox.left - desktopBox.left, top: windowBox.top - desktopBox.top };
      handle.setPointerCapture(event.pointerId);
    });
    handle.addEventListener("pointermove", function (event) {
      if (!drag) return;
      var maxLeft = Math.max(0, desktop.clientWidth - commandWindow.offsetWidth);
      var maxTop = Math.max(0, desktop.clientHeight - commandWindow.offsetHeight - 44);
      commandWindow.style.left = Math.max(0, Math.min(maxLeft, drag.left + event.clientX - drag.x)) + "px";
      commandWindow.style.top = Math.max(0, Math.min(maxTop, drag.top + event.clientY - drag.y)) + "px";
    });
    handle.addEventListener("pointerup", function (event) {
      drag = null;
      if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
    });
  });
})();
