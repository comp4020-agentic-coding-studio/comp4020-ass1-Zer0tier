(function () {
  "use strict";

  function shuffle(values) {
    var items = values.slice();
    for (var index = items.length - 1; index > 0; index -= 1) {
      var other = Math.floor(Math.random() * (index + 1));
      var temporary = items[index];
      items[index] = items[other];
      items[other] = temporary;
    }
    return items;
  }

  document.querySelectorAll("[data-reversi]").forEach(function (game) {
    var size = 6;
    var board = game.querySelector("[data-reversi-board]");
    var status = game.querySelector("[data-reversi-status]");
    var cells = [];
    var state = [];
    var turn = "black";
    var directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

    function captures(position, colour) {
      if (state[position]) return [];
      var row = Math.floor(position / size);
      var column = position % size;
      var opponent = colour === "black" ? "white" : "black";
      var result = [];
      directions.forEach(function (direction) {
        var line = [];
        var nextRow = row + direction[0];
        var nextColumn = column + direction[1];
        while (nextRow >= 0 && nextRow < size && nextColumn >= 0 && nextColumn < size) {
          var nextPosition = nextRow * size + nextColumn;
          if (state[nextPosition] === opponent) line.push(nextPosition);
          else {
            if (state[nextPosition] === colour && line.length) result.push.apply(result, line);
            break;
          }
          nextRow += direction[0];
          nextColumn += direction[1];
        }
      });
      return result;
    }

    function validMoves(colour) {
      return state.map(function (_, index) { return captures(index, colour).length > 0; });
    }

    function render() {
      var valid = validMoves(turn);
      cells.forEach(function (cell, index) {
        cell.replaceChildren();
        cell.disabled = Boolean(state[index]) || !valid[index];
        cell.removeAttribute("data-piece");
        cell.setAttribute("data-valid", String(valid[index]));
        if (state[index]) {
          var piece = document.createElement("span");
          piece.className = "reversi-piece " + state[index];
          cell.append(piece);
          cell.setAttribute("data-piece", state[index]);
          cell.setAttribute("aria-label", "Row " + (Math.floor(index / size) + 1) + ", column " + (index % size + 1) + ", " + state[index]);
        } else {
          cell.setAttribute("aria-label", "Row " + (Math.floor(index / size) + 1) + ", column " + (index % size + 1) + (valid[index] ? ", valid move" : ", empty"));
        }
      });
    }

    function finish() {
      var black = state.filter(function (piece) { return piece === "black"; }).length;
      var white = state.filter(function (piece) { return piece === "white"; }).length;
      status.textContent = "Game over. Black " + black + ", white " + white + ". " + (black === white ? "Draw." : (black > white ? "Black" : "White") + " wins.");
      cells.forEach(function (cell) { cell.disabled = true; });
    }

    function move(position) {
      var flipped = captures(position, turn);
      if (!flipped.length) return;
      state[position] = turn;
      flipped.forEach(function (index) { state[index] = turn; });
      var opponent = turn === "black" ? "white" : "black";
      if (validMoves(opponent).some(Boolean)) turn = opponent;
      else if (!validMoves(turn).some(Boolean)) {
        render();
        finish();
        return;
      }
      status.textContent = turn.charAt(0).toUpperCase() + turn.slice(1) + " to move. " + flipped.length + " piece" + (flipped.length === 1 ? "" : "s") + " flipped.";
      render();
    }

    function reset() {
      state = Array(size * size).fill(null);
      state[14] = "white";
      state[15] = "black";
      state[20] = "black";
      state[21] = "white";
      turn = "black";
      status.textContent = "Black to move.";
      render();
    }

    for (var index = 0; index < size * size; index += 1) {
      var cell = document.createElement("button");
      cell.type = "button";
      (function (position) { cell.addEventListener("click", function () { move(position); }); })(index);
      cells.push(cell);
      board.append(cell);
    }
    game.querySelectorAll("[data-reversi-reset]").forEach(function (button) { button.addEventListener("click", reset); });
    reset();
  });

  document.querySelectorAll("[data-minesweeper]").forEach(function (game) {
    var size = 9;
    var mineTotal = 10;
    var board = game.querySelector("[data-mines-grid]");
    var status = game.querySelector("[data-mines-status]");
    var counter = game.querySelector("[data-mine-count]");
    var timer = game.querySelector("[data-mine-timer]");
    var flagMode = game.querySelector("[data-flag-mode]");
    var cells = [];
    var mines = new Set();
    var revealed = new Set();
    var flags = new Set();
    var started = false;
    var over = false;
    var seconds = 0;
    var timerId;

    function neighbours(position) {
      var row = Math.floor(position / size);
      var column = position % size;
      var result = [];
      for (var rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
        for (var columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
          var nextRow = row + rowOffset;
          var nextColumn = column + columnOffset;
          if ((rowOffset || columnOffset) && nextRow >= 0 && nextRow < size && nextColumn >= 0 && nextColumn < size) result.push(nextRow * size + nextColumn);
        }
      }
      return result;
    }

    function plantMines(safe) {
      var candidates = [];
      for (var index = 0; index < size * size; index += 1) if (index !== safe) candidates.push(index);
      mines = new Set(shuffle(candidates).slice(0, mineTotal));
    }

    function adjacentMines(position) {
      return neighbours(position).filter(function (index) { return mines.has(index); }).length;
    }

    function updateCounters() {
      counter.textContent = String(Math.max(0, mineTotal - flags.size)).padStart(3, "0");
      timer.textContent = String(Math.min(999, seconds)).padStart(3, "0");
    }

    function render() {
      cells.forEach(function (cell, index) {
        cell.className = "";
        cell.textContent = "";
        cell.disabled = over;
        if (revealed.has(index)) {
          cell.classList.add("is-revealed");
          if (mines.has(index)) {
            cell.classList.add("is-mine");
            cell.textContent = "*";
            cell.setAttribute("aria-label", "Mine");
          } else {
            var count = adjacentMines(index);
            if (count) {
              cell.textContent = String(count);
              cell.setAttribute("data-count", String(count));
            }
            cell.setAttribute("aria-label", "Revealed square" + (count ? ", " + count + " adjacent mines" : ", clear"));
          }
        } else if (flags.has(index)) {
          cell.classList.add("is-flagged");
          cell.textContent = "!";
          cell.setAttribute("aria-label", "Flagged hidden square");
        } else cell.setAttribute("aria-label", "Hidden square, row " + (Math.floor(index / size) + 1) + ", column " + (index % size + 1));
      });
      updateCounters();
    }

    function reveal(position) {
      if (over || flags.has(position) || revealed.has(position)) return;
      if (!started) {
        started = true;
        plantMines(position);
        timerId = window.setInterval(function () { seconds += 1; updateCounters(); }, 1000);
      }
      if (mines.has(position)) {
        mines.forEach(function (mine) { revealed.add(mine); });
        over = true;
        window.clearInterval(timerId);
        status.textContent = "Mine opened. Select Game or the face to try again.";
        render();
        return;
      }
      var queue = [position];
      while (queue.length) {
        var current = queue.pop();
        if (revealed.has(current) || flags.has(current)) continue;
        revealed.add(current);
        if (adjacentMines(current) === 0) neighbours(current).forEach(function (nearby) { if (!mines.has(nearby) && !revealed.has(nearby)) queue.push(nearby); });
      }
      if (revealed.size === size * size - mineTotal) {
        over = true;
        window.clearInterval(timerId);
        status.textContent = "Field cleared. You win!";
      } else status.textContent = "Square cleared. " + revealed.size + " of " + (size * size - mineTotal) + " safe squares found.";
      render();
    }

    function toggleFlag(position) {
      if (over || revealed.has(position)) return;
      if (flags.has(position)) flags.delete(position);
      else if (flags.size < mineTotal) flags.add(position);
      status.textContent = flags.has(position) ? "Square flagged." : "Flag removed.";
      render();
    }

    function reset() {
      window.clearInterval(timerId);
      mines = new Set();
      revealed = new Set();
      flags = new Set();
      started = false;
      over = false;
      seconds = 0;
      flagMode.setAttribute("aria-pressed", "false");
      flagMode.textContent = "Flag mode: off";
      status.textContent = "Choose a square to begin.";
      render();
    }

    for (var index = 0; index < size * size; index += 1) {
      var cell = document.createElement("button");
      cell.type = "button";
      (function (position) {
        cell.addEventListener("click", function (event) { if (flagMode.getAttribute("aria-pressed") === "true" || event.shiftKey) toggleFlag(position); else reveal(position); });
        cell.addEventListener("contextmenu", function (event) { event.preventDefault(); toggleFlag(position); });
      })(index);
      cells.push(cell);
      board.append(cell);
    }
    flagMode.addEventListener("click", function () {
      var active = flagMode.getAttribute("aria-pressed") !== "true";
      flagMode.setAttribute("aria-pressed", String(active));
      flagMode.textContent = "Flag mode: " + (active ? "on" : "off");
    });
    game.querySelectorAll("[data-mines-reset]").forEach(function (button) { button.addEventListener("click", reset); });
    reset();
  });

  document.querySelectorAll("[data-purble]").forEach(function (game) {
    var board = game.querySelector("[data-purble-grid]");
    var score = game.querySelector("[data-purble-score]");
    var status = game.querySelector("[data-purble-status]");
    var symbols = ["A", "B", "C", "D", "E", "F", "G", "H"];
    var cards = [];
    var open = [];
    var matched = new Set();
    var busy = false;

    function render() {
      board.replaceChildren();
      cards.forEach(function (symbol, index) {
        var button = document.createElement("button");
        var visible = open.includes(index) || matched.has(index);
        button.type = "button";
        button.setAttribute("data-symbol", symbol);
        button.setAttribute("aria-label", visible ? "Tile " + symbol : "Hidden tile " + (index + 1));
        button.className = visible ? "is-open symbol-" + symbol.toLowerCase() : "";
        button.textContent = visible ? symbol : "?";
        button.disabled = busy || matched.has(index);
        button.addEventListener("click", function () { choose(index); });
        board.append(button);
      });
      score.textContent = (matched.size / 2) + " / 8";
    }

    function choose(index) {
      if (busy || open.includes(index) || matched.has(index)) return;
      open.push(index);
      render();
      if (open.length < 2) {
        status.textContent = "Choose one more tile.";
        return;
      }
      if (cards[open[0]] === cards[open[1]]) {
        matched.add(open[0]);
        matched.add(open[1]);
        open = [];
        status.textContent = matched.size === cards.length ? "All pairs found. You win!" : "Pair found.";
        render();
      } else {
        busy = true;
        status.textContent = "No match. Remember those tiles.";
        window.setTimeout(function () { open = []; busy = false; render(); }, 700);
      }
    }

    function reset() {
      cards = shuffle(symbols.concat(symbols));
      open = [];
      matched = new Set();
      busy = false;
      status.textContent = "Choose two tiles.";
      render();
    }

    game.querySelector("[data-purble-reset]").addEventListener("click", reset);
    reset();
  });
})();
