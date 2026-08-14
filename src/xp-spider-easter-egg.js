(function () {
  "use strict";

  var root = document.querySelector("[data-xp-spider-easter-egg]");
  if (!root) return;

  var crawler = root.querySelector("[data-xp-spider]");
  var layer = root.querySelector("[data-spider-game-layer]");
  var gameWindow = root.querySelector("[data-spider-game-window]");
  var tableau = root.querySelector("[data-spider-tableau]");
  var status = root.querySelector("[data-spider-status]");
  var scoreOutput = root.querySelector("[data-spider-score]");
  var movesOutput = root.querySelector("[data-spider-moves]");
  var stockOutput = root.querySelector("[data-spider-stock-count]");
  var completedOutput = root.querySelector("[data-spider-completed]");
  var stockButton = root.querySelector("[data-spider-stock]");
  var taskButton = root.querySelector("[data-spider-task]");
  var announcement = root.querySelector("[data-spider-announcement]");
  if (!crawler || !layer || !gameWindow || !tableau || !status || !scoreOutput || !movesOutput || !stockOutput || !completedOutput || !stockButton || !taskButton) return;

  var columns = [];
  var stock = [];
  var selected = null;
  var moves = 0;
  var score = 500;
  var completed = 0;
  var crawlTimer = 0;
  var reducedMotion = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var rankNames = ["", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

  function shuffle(cards) {
    for (var index = cards.length - 1; index > 0; index -= 1) {
      var swapIndex = Math.floor(Math.random() * (index + 1));
      var temporary = cards[index];
      cards[index] = cards[swapIndex];
      cards[swapIndex] = temporary;
    }
    return cards;
  }

  function newGame() {
    var deck = [];
    for (var copy = 0; copy < 8; copy += 1) {
      for (var rank = 1; rank <= 13; rank += 1) deck.push({ rank: rank, faceUp: false });
    }
    shuffle(deck);
    columns = Array.from({ length: 10 }, function () { return []; });
    for (var columnIndex = 0; columnIndex < columns.length; columnIndex += 1) {
      var cardCount = columnIndex < 4 ? 6 : 5;
      for (var cardIndex = 0; cardIndex < cardCount; cardIndex += 1) columns[columnIndex].push(deck.pop());
      columns[columnIndex][columns[columnIndex].length - 1].faceUp = true;
    }
    stock = deck;
    selected = null;
    moves = 0;
    score = 500;
    completed = 0;
    status.textContent = "Build descending runs from King to Ace. Select a card, then choose its destination.";
    render();
  }

  function isMovableRun(column, startIndex) {
    if (!column[startIndex] || !column[startIndex].faceUp) return false;
    for (var index = startIndex; index < column.length - 1; index += 1) {
      if (!column[index + 1].faceUp || column[index].rank - 1 !== column[index + 1].rank) return false;
    }
    return true;
  }

  function updateOutputs() {
    scoreOutput.textContent = String(score);
    movesOutput.textContent = String(moves);
    stockOutput.textContent = String(stock.length);
    stockButton.disabled = stock.length < 10;
    completedOutput.replaceChildren();
    for (var index = 0; index < 8; index += 1) {
      var marker = document.createElement("span");
      marker.className = index < completed ? "is-complete" : "";
      marker.textContent = index < completed ? "K♠" : "";
      completedOutput.appendChild(marker);
    }
  }

  function render() {
    tableau.replaceChildren();
    columns.forEach(function (column, columnIndex) {
      var pile = document.createElement("div");
      pile.className = "xp-spider-column";
      pile.setAttribute("data-column", String(columnIndex));
      pile.setAttribute("role", "group");
      pile.setAttribute("aria-label", "Column " + String(columnIndex + 1) + ", " + String(column.length) + " cards");

      column.forEach(function (card, cardIndex) {
        var cardButton = document.createElement("button");
        cardButton.type = "button";
        cardButton.className = "xp-spider-card " + (card.faceUp ? "is-face-up" : "is-face-down");
        cardButton.setAttribute("data-card-index", String(cardIndex));
        cardButton.setAttribute("aria-label", card.faceUp ? rankNames[card.rank] + " of spades" : "Face-down card");
        if (selected && selected.column === columnIndex && cardIndex >= selected.index) cardButton.classList.add("is-selected");
        if (card.faceUp) {
          var top = document.createElement("span");
          top.innerHTML = "<b>" + rankNames[card.rank] + "</b><i>♠</i>";
          var center = document.createElement("strong");
          center.textContent = "♠";
          var bottom = document.createElement("span");
          bottom.innerHTML = "<b>" + rankNames[card.rank] + "</b><i>♠</i>";
          cardButton.append(top, center, bottom);
        }
        cardButton.addEventListener("click", function (event) {
          event.stopPropagation();
          chooseCard(columnIndex, cardIndex);
        });
        pile.appendChild(cardButton);
      });

      pile.addEventListener("click", function () { chooseDestination(columnIndex); });
      tableau.appendChild(pile);
    });
    updateOutputs();
  }

  function chooseCard(columnIndex, cardIndex) {
    if (selected) {
      if (selected.column !== columnIndex) {
        moveSelected(columnIndex);
        return;
      }
      if (selected.index === cardIndex) {
        selected = null;
        status.textContent = "Selection cleared.";
        render();
        return;
      }
    }
    if (!isMovableRun(columns[columnIndex], cardIndex)) {
      status.textContent = "Only a face-up descending run can move together.";
      return;
    }
    selected = { column: columnIndex, index: cardIndex };
    status.textContent = rankNames[columns[columnIndex][cardIndex].rank] + " selected. Choose another column.";
    render();
  }

  function chooseDestination(columnIndex) {
    if (selected) moveSelected(columnIndex);
  }

  function moveSelected(destinationIndex) {
    if (!selected || selected.column === destinationIndex) return;
    var source = columns[selected.column];
    var destination = columns[destinationIndex];
    var moving = source.slice(selected.index);
    var destinationCard = destination[destination.length - 1];
    if (destinationCard && destinationCard.rank !== moving[0].rank + 1) {
      status.textContent = "That run must land on the next higher card.";
      return;
    }
    source.splice(selected.index);
    destination.push.apply(destination, moving);
    if (source.length && !source[source.length - 1].faceUp) source[source.length - 1].faceUp = true;
    selected = null;
    moves += 1;
    score -= 1;
    status.textContent = "Run moved.";
    checkCompleted(destinationIndex);
    render();
  }

  function checkCompleted(columnIndex) {
    var column = columns[columnIndex];
    if (column.length < 13) return;
    var start = column.length - 13;
    for (var index = 0; index < 13; index += 1) {
      if (!column[start + index].faceUp || column[start + index].rank !== 13 - index) return;
    }
    column.splice(start, 13);
    if (column.length && !column[column.length - 1].faceUp) column[column.length - 1].faceUp = true;
    completed += 1;
    score += 100;
    status.textContent = completed === 8 ? "You won! Every suit is complete." : "Complete King-to-Ace suit cleared.";
  }

  function dealRow() {
    if (stock.length < 10) {
      status.textContent = "No more rows remain in the stock.";
      return;
    }
    if (columns.some(function (column) { return column.length === 0; })) {
      status.textContent = "Fill every empty column before dealing a new row.";
      return;
    }
    columns.forEach(function (column) {
      var card = stock.pop();
      card.faceUp = true;
      column.push(card);
    });
    moves += 1;
    score -= 1;
    status.textContent = "A new row was dealt.";
    columns.forEach(function (_, index) { checkCompleted(index); });
    render();
  }

  function openGame() {
    layer.hidden = false;
    layer.classList.remove("is-minimised");
    taskButton.hidden = true;
    document.body.classList.add("xp-spider-game-open");
    newGame();
    gameWindow.setAttribute("tabindex", "-1");
    gameWindow.focus({ preventScroll: true });
  }

  function closeGame() {
    layer.hidden = true;
    document.body.classList.remove("xp-spider-game-open");
  }

  function minimiseGame() {
    layer.classList.add("is-minimised");
    taskButton.hidden = false;
    document.body.classList.remove("xp-spider-game-open");
    taskButton.focus();
  }

  function restoreGame() {
    layer.classList.remove("is-minimised");
    taskButton.hidden = true;
    document.body.classList.add("xp-spider-game-open");
    gameWindow.focus({ preventScroll: true });
  }

  function scheduleCrawl() {
    window.clearTimeout(crawlTimer);
    if (reducedMotion || crawler.hidden || crawler.classList.contains("is-squashed")) return;
    crawlTimer = window.setTimeout(moveCrawler, 900 + Math.random() * 1300);
  }

  function moveCrawler() {
    var padding = 10;
    var maximumX = Math.max(padding, window.innerWidth - crawler.offsetWidth - padding);
    var maximumY = Math.max(padding, window.innerHeight - crawler.offsetHeight - padding);
    var currentX = Number.parseFloat(crawler.style.left || "0");
    var nextX = padding + Math.random() * (maximumX - padding);
    crawler.style.setProperty("--crawl-duration", String(1.5 + Math.random() * 1.7) + "s");
    crawler.style.setProperty("--spider-facing", nextX < currentX ? "-1" : "1");
    crawler.style.left = String(nextX) + "px";
    crawler.style.top = String(padding + Math.random() * (maximumY - padding)) + "px";
    scheduleCrawl();
  }

  crawler.addEventListener("pointerenter", function () { window.clearTimeout(crawlTimer); });
  crawler.addEventListener("pointerleave", scheduleCrawl);
  crawler.addEventListener("focus", function () { window.clearTimeout(crawlTimer); });
  crawler.addEventListener("blur", scheduleCrawl);
  crawler.addEventListener("click", function () {
    window.clearTimeout(crawlTimer);
    crawler.disabled = true;
    crawler.classList.add("is-squashed");
    if (announcement) announcement.textContent = "Spider caught. Opening Spider Solitaire.";
    window.setTimeout(function () {
      crawler.hidden = true;
      openGame();
    }, 380);
  });

  root.querySelectorAll("[data-spider-close]").forEach(function (button) { button.addEventListener("click", closeGame); });
  root.querySelector("[data-spider-minimise]").addEventListener("click", minimiseGame);
  root.querySelector("[data-spider-maximise]").addEventListener("click", function () { gameWindow.classList.toggle("is-maximised"); });
  root.querySelector("[data-spider-new]").addEventListener("click", newGame);
  root.querySelector("[data-spider-deal]").addEventListener("click", dealRow);
  root.querySelector("[data-spider-help]").addEventListener("click", function () { status.textContent = "Move descending runs onto the next higher card. Clear eight King-to-Ace sequences to win."; });
  stockButton.addEventListener("click", dealRow);
  taskButton.addEventListener("click", restoreGame);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !layer.hidden && !layer.classList.contains("is-minimised")) closeGame();
  });

  crawler.style.left = "72%";
  crawler.style.top = "58%";
  newGame();
  scheduleCrawl();
})();
