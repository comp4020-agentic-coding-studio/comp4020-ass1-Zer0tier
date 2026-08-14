(function () {
  "use strict";

  document.querySelectorAll("[data-release-quiz]").forEach(function (quiz) {
    var data = quiz.querySelector("[data-quiz-data]");
    var form = quiz.querySelector("[data-quiz-form]");
    var prompt = quiz.querySelector("[data-quiz-prompt]");
    var choices = quiz.querySelector("[data-quiz-choices]");
    var feedback = quiz.querySelector("[data-quiz-feedback]");
    var check = quiz.querySelector("[data-quiz-check]");
    var next = quiz.querySelector("[data-quiz-next]");
    var count = quiz.querySelector("[data-quiz-count]");
    var questions = JSON.parse(data.textContent);
    var current = 0;

    function randomIndex(previous) {
      if (questions.length < 2) return 0;
      var candidate = Math.floor(Math.random() * questions.length);
      return candidate === previous ? (candidate + 1) % questions.length : candidate;
    }

    function render(index) {
      var question = questions[index];
      current = index;
      prompt.textContent = question.prompt;
      choices.replaceChildren();
      question.choices.forEach(function (choice, choiceIndex) {
        var label = document.createElement("label");
        var input = document.createElement("input");
        var text = document.createElement("span");
        input.type = "radio";
        input.name = "quiz-answer";
        input.value = String(choiceIndex);
        text.textContent = choice;
        label.append(input, text);
        choices.append(label);
      });
      feedback.textContent = "";
      feedback.removeAttribute("data-result");
      check.hidden = false;
      next.hidden = true;
      count.textContent = "Random question · " + questions.length + " available";
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var selected = form.querySelector("input[name='quiz-answer']:checked");
      if (!selected) {
        feedback.textContent = "Choose an answer before revealing the result.";
        feedback.setAttribute("data-result", "missing");
        choices.querySelector("input").focus();
        return;
      }

      var question = questions[current];
      var correct = Number(selected.value) === question.answer;
      feedback.textContent = (correct ? "Correct. " : "Not quite. ") + question.explanation;
      feedback.setAttribute("data-result", correct ? "correct" : "incorrect");
      choices.querySelectorAll("input").forEach(function (input) { input.disabled = true; });
      choices.querySelectorAll("label").forEach(function (label, index) {
        if (index === question.answer) label.setAttribute("data-correct", "true");
      });
      check.hidden = true;
      next.hidden = false;
      next.focus();
    });

    next.addEventListener("click", function () { render(randomIndex(current)); });
    render(randomIndex(-1));
  });
})();
