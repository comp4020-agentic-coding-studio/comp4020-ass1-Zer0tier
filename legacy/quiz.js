// The round: reads its regimes from the timeline's own nodes, asks ten, and
// opens the answer's entry whenever you get one wrong.
//
// Building the pool from the DOM rather than from a JSON payload is what makes
// "the quiz can never ask about a regime the timeline doesn't have" structural
// instead of a promise — there is no second copy of the data to drift.
(function () {
  "use strict";

  window.DYN = window.DYN || {};

  var quiz = document.getElementById("quiz");
  var startBtn = document.getElementById("quiz-start");
  var region = document.querySelector("[data-testid='quiz-questions']");
  var teachSlot = document.querySelector("[data-testid='quiz-detail']");
  var status = document.getElementById("quiz-status");
  if (!quiz || !startBtn || !region || !teachSlot || !status) return;
  if (!window.DYN.buildPool || !window.DYN.pickRound) return;

  var TOTAL = parseInt(quiz.getAttribute("data-total"), 10) || 10;

  function readRegimes() {
    var nodes = document.querySelectorAll("[data-dynasty][data-start]");
    var out = [];
    for (var i = 0; i < nodes.length; i += 1) {
      var n = nodes[i];
      if (n.getAttribute("data-kind") !== "regime") continue;
      out.push({
        id: n.getAttribute("data-dynasty"),
        name: n.getAttribute("data-name"),
        zh: n.getAttribute("data-zh"),
        label: n.getAttribute("data-name") + " " + n.getAttribute("data-zh"),
        years: n.getAttribute("data-years"),
        start: parseInt(n.getAttribute("data-start"), 10),
        end: parseInt(n.getAttribute("data-end"), 10),
        track: n.getAttribute("data-track"),
        trackName: n.getAttribute("data-track-name"),
        periodName: n.getAttribute("data-period-name"),
        artefact: n.getAttribute("data-artefact"),
      });
    }
    return out;
  }

  var pool = null;
  var round = [];
  var index = 0;
  var score = 0;
  var answered = false;

  function icon(name) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "mark");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("viewBox", "0 0 24 24");
    var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#" + name);
    svg.appendChild(use);
    return svg;
  }

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  }

  function renderQuestion() {
    var q = round[index];
    answered = false;
    region.textContent = "";
    teachSlot.textContent = "";

    var meter = el("p", "quiz-meter");
    meter.appendChild(el("span", null, "Question " + (index + 1) + " of " + TOTAL));
    meter.appendChild(el("span", null, "Score " + score));
    region.appendChild(meter);

    var prompt = el("p", "quiz-prompt", q.prompt);
    prompt.id = "q-prompt";
    prompt.setAttribute("tabindex", "-1");
    region.appendChild(prompt);

    var group = el("div");
    group.setAttribute("role", "group");
    group.setAttribute("aria-labelledby", "q-prompt");
    var ul = el("ul", "quiz-choices");
    for (var i = 0; i < q.choices.length; i += 1) {
      var c = q.choices[i];
      var li = el("li");
      var btn = el("button", "quiz-choice");
      btn.type = "button";
      btn.setAttribute("data-choice", c.id);
      btn.appendChild(icon("tick"));
      btn.appendChild(el("span", null, c.label));
      li.appendChild(btn);
      ul.appendChild(li);
    }
    group.appendChild(ul);
    region.appendChild(group);

    prompt.focus();
  }

  function reveal(q, chosenId) {
    var buttons = region.querySelectorAll(".quiz-choice");
    for (var i = 0; i < buttons.length; i += 1) {
      var btn = buttons[i];
      var id = btn.getAttribute("data-choice");
      // aria-disabled, never disabled: a disabled button loses focus and
      // drops out of the tab order, so you can no longer review the choices.
      btn.setAttribute("aria-disabled", "true");
      if (id === q.answer) {
        btn.classList.add("is-correct");
        btn.appendChild(el("span", "sr-only", " (correct answer)"));
      } else if (id === chosenId) {
        btn.classList.add("is-wrong");
        btn.replaceChild(icon("cross"), btn.firstChild);
        btn.appendChild(el("span", "sr-only", " (your answer)"));
      }
    }
  }

  function labelOf(q, id) {
    for (var i = 0; i < q.choices.length; i += 1) {
      if (q.choices[i].id === id) return q.choices[i].label;
    }
    return id;
  }

  function finish() {
    region.textContent = "";
    teachSlot.textContent = "";
    var box = el("div", "quiz-summary");
    box.setAttribute("tabindex", "-1");
    box.appendChild(el("h3", null, "You scored " + score + " out of " + TOTAL));
    box.appendChild(
      el(
        "p",
        null,
        score === TOTAL
          ? "Every one. You have the shape of it — including the parts most timelines leave out."
          : "The ones that catch people are the overlaps. They are all in the list below.",
      ),
    );
    var again = el("button", "button button-primary", "Play again");
    again.type = "button";
    again.id = "quiz-again";
    box.appendChild(again);
    region.appendChild(box);
    box.focus();

    if (window.DYN.scores) window.DYN.scores.record(score);
    again.addEventListener("click", start);
  }

  function next() {
    index += 1;
    if (index >= round.length) {
      finish();
      return;
    }
    renderQuestion();
  }

  function answer(q, chosenId) {
    if (answered) return;
    answered = true;
    var right = chosenId === q.answer;
    if (right) score += 1;
    reveal(q, chosenId);

    var because = el("p", "quiz-because", q.because);
    region.appendChild(because);

    if (right) {
      status.textContent = "Correct. " + q.because;
    } else {
      status.textContent =
        "Not quite. The answer is " + labelOf(q, q.answer) + ". " + q.because + " Their entry is below.";
      // The quiz has its own slot so this never scrolls you away from Next.
      if (window.DYN.showDetail) window.DYN.showDetail(q.teach, teachSlot);
    }

    var btn = el("button", "button", index + 1 >= round.length ? "See your score" : "Next question");
    btn.type = "button";
    btn.id = "quiz-next";
    region.appendChild(btn);
    btn.addEventListener("click", next);
    btn.focus();
  }

  function start() {
    if (!pool) pool = window.DYN.buildPool(readRegimes());
    round = window.DYN.pickRound(pool, TOTAL, Math.random);
    index = 0;
    score = 0;
    status.textContent = "Round started. Question 1 of " + TOTAL + ".";
    renderQuestion();
  }

  region.addEventListener("click", function (e) {
    var btn = e.target && e.target.closest ? e.target.closest(".quiz-choice") : null;
    if (!btn || btn.getAttribute("aria-disabled") === "true") return;
    answer(round[index], btn.getAttribute("data-choice"));
  });

  startBtn.addEventListener("click", start);
})();
