// The top-five board, kept in localStorage.
//
// The read is guarded four ways, which is what C2's favourites.js taught: a
// missing key, unparseable JSON, a value that isn't an array, and — the one
// people skip — rows that are individually wrong. A stored 47-out-of-10 is
// corrupt data, not a high score, and the page's own data-total is what says so.
(function () {
  "use strict";

  window.DYN = window.DYN || {};

  var KEY = "dyn-scores-v1";
  var MAX = 5;

  var list = document.getElementById("score-list");
  var empty = document.getElementById("score-empty");
  var clearBtn = document.getElementById("score-clear");
  var status = document.getElementById("score-status");
  var quiz = document.getElementById("quiz");
  if (!list || !empty || !clearBtn || !status || !quiz) return;

  var TOTAL = parseInt(quiz.getAttribute("data-total"), 10) || 0;

  // A fixed table rather than toLocaleDateString, so a marker's machine and CI
  // render the same string regardless of locale.
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function read() {
    var out = [];
    try {
      var raw = JSON.parse(window.localStorage.getItem(KEY) || "[]");
      if (Object.prototype.toString.call(raw) !== "[object Array]") return out;
      for (var i = 0; i < raw.length; i += 1) {
        var row = raw[i];
        if (!row || typeof row !== "object") continue;
        var score = parseInt(row.score, 10);
        var total = parseInt(row.total, 10);
        // NaN fails both comparisons, so corrupt numbers drop out here.
        if (!(total === TOTAL && score >= 0 && score <= TOTAL)) continue;
        out.push({ score: score, total: total, at: typeof row.at === "string" ? row.at : "" });
      }
    } catch {
      return [];
    }
    return out.slice(0, MAX);
  }

  function write(rows) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(rows));
      return true;
    } catch {
      // Private mode, or quota. Losing the board is not worth throwing over.
      return false;
    }
  }

  function pretty(iso) {
    var p = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    if (!p) return "";
    var m = MONTHS[parseInt(p[2], 10) - 1];
    return m ? parseInt(p[3], 10) + " " + m + " " + p[1] : "";
  }

  function today() {
    var d = new Date();
    function pad(n) {
      return (n < 10 ? "0" : "") + n;
    }
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function render(rows, highlight) {
    list.textContent = "";
    for (var i = 0; i < rows.length; i += 1) {
      var row = rows[i];
      var li = document.createElement("li");
      li.className = "score-row" + (row === highlight ? " is-new" : "");

      var rank = document.createElement("span");
      rank.className = "score-rank";
      // The <ol> already conveys order, so the numeral is decorative.
      rank.setAttribute("aria-hidden", "true");
      rank.textContent = String(i + 1);

      var value = document.createElement("span");
      value.className = "score-value";
      value.textContent = row.score + " out of " + row.total;

      var when = document.createElement("span");
      when.className = "score-when";
      when.textContent = pretty(row.at);

      li.appendChild(rank);
      li.appendChild(value);
      li.appendChild(when);
      list.appendChild(li);
    }
    // Mutually exclusive, and only meaningful because of the [hidden] guard.
    list.hidden = rows.length === 0;
    empty.hidden = rows.length > 0;
    clearBtn.parentNode.hidden = rows.length === 0;
  }

  function record(score) {
    var rows = read();
    var entry = { score: score, total: TOTAL, at: today() };
    rows.push(entry);
    rows.sort(function (a, b) {
      // Score first; on a tie the older round outranks the newer one, so an
      // earlier achievement is not demoted by repeating it.
      return b.score - a.score || (a.at < b.at ? -1 : a.at > b.at ? 1 : 0);
    });
    var top = rows.slice(0, MAX);
    var saved = write(top);
    var rank = top.indexOf(entry);

    render(top, rank === -1 ? null : entry);

    var head = "Round over. You scored " + score + " out of " + TOTAL + ".";
    if (!saved) {
      status.textContent = head + " This browser is not saving scores, so it will not be listed.";
    } else if (rank === -1) {
      var lowest = top[top.length - 1];
      status.textContent =
        head +
        " That does not reach the top five; the lowest saved score is " +
        lowest.score +
        " out of " +
        lowest.total +
        ".";
    } else {
      var place = ["first", "second", "third", "fourth", "fifth"][rank] || String(rank + 1);
      status.textContent =
        head + " " + place + " of " + top.length + " saved " + (top.length === 1 ? "score" : "scores") + ".";
    }
  }

  function clear() {
    write([]);
    render([], null);
    status.textContent = "Saved scores cleared. There are no rounds listed.";
    // The list this button sat beside is gone; put focus somewhere deliberate.
    empty.focus();
  }

  clearBtn.addEventListener("click", clear);

  window.DYN.scores = { record: record, render: render, clear: clear, read: read };

  render(read(), null);
})();
