// The question generator. Deliberately DOM-free: it takes a plain array of
// regime records and returns questions, so spec/quiz-pool.test.ts can evaluate
// this exact file and check that every answer it states is actually true.
//
// The pool is DETERMINISTIC — distractors are chosen by fixed index arithmetic,
// never Math.random. Only pickRound is random, and it takes an injected rng.
// So a bad question is reproducible instead of being a thing that happened once.
(function () {
  "use strict";

  window.DYN = window.DYN || {};

  function overlaps(a, b) {
    return a.start < b.end && b.start < a.end;
  }

  function toChoice(r) {
    return { id: r.id, label: r.label };
  }

  // Artefact strings are written to start a sentence ("The Houmuwu ding, ...").
  // Dropped into the middle of a prompt they read as a capitalised proper noun
  // that isn't one. Lower only a leading article — never a real first word.
  function midSentence(s) {
    return s.replace(/^(The|A|An) /, function (m) {
      return m.toLowerCase();
    });
  }

  // Deterministic: same list and same seed always give the same three.
  function pickThree(list, seed) {
    if (list.length < 3) return null;
    var out = [];
    for (var i = 0; out.length < 3 && i < list.length * 4; i += 1) {
      var cand = list[(seed * 7 + i * 13 + 1) % list.length];
      if (out.indexOf(cand) === -1) out.push(cand);
    }
    return out.length === 3 ? out : null;
  }

  function shuffle(list, rng) {
    for (var i = list.length - 1; i > 0; i -= 1) {
      var j = Math.floor(rng() * (i + 1));
      var t = list[i];
      list[i] = list[j];
      list[j] = t;
    }
    return list;
  }

  // ---- the six types -------------------------------------------------------

  // The question that only exists because the timeline is not a single line.
  function sameTime(rs) {
    var out = [];
    for (var i = 0; i < rs.length; i += 1) {
      var s = rs[i];
      var withIt = rs.filter(function (r) {
        return r.id !== s.id && overlaps(r, s);
      });
      var without = rs.filter(function (r) {
        return r.id !== s.id && !overlaps(r, s);
      });
      var wrong = pickThree(without, i);
      if (!withIt.length || !wrong) continue;
      var right = withIt[i % withIt.length];
      out.push({
        id: "same-" + s.id,
        type: "same-time",
        subject: s.id,
        teach: s.id,
        prompt: "Which of these ruled at the same time as " + s.label + " (" + s.years + ")?",
        answer: right.id,
        choices: [toChoice(right), toChoice(wrong[0]), toChoice(wrong[1]), toChoice(wrong[2])],
        because:
          right.label + " ran " + right.years + ", overlapping " + s.label + " " + s.years + ".",
      });
    }
    return out;
  }

  // The inverse, which catches anyone who learned the first by rote.
  function neverMet(rs) {
    var out = [];
    for (var i = 0; i < rs.length; i += 1) {
      var a = rs[i];
      var friends = rs.filter(function (r) {
        return r.id !== a.id && overlaps(r, a);
      });
      if (friends.length < 2) continue;
      var b = friends[i % friends.length];
      var c = friends[(i + 1) % friends.length];
      if (b.id === c.id) continue;
      var strangers = rs.filter(function (r) {
        return r.id !== a.id && r.id !== b.id && r.id !== c.id && !overlaps(r, a) && !overlaps(r, b) && !overlaps(r, c);
      });
      if (!strangers.length) continue;
      var odd = strangers[i % strangers.length];
      out.push({
        id: "never-" + a.id,
        type: "never-met",
        subject: a.id,
        teach: odd.id,
        prompt: "Three of these overlapped in time. Which one never did?",
        answer: odd.id,
        choices: [toChoice(a), toChoice(b), toChoice(c), toChoice(odd)],
        because:
          odd.label +
          " ran " +
          odd.years +
          " and shares not one year with the other three, which all overlapped each other.",
      });
    }
    return out;
  }

  // Turns the thesis into a number.
  function howMany(rs) {
    var out = [];
    for (var i = 0; i < rs.length; i += 1) {
      var year = rs[i].start;
      var live = rs.filter(function (r) {
        return r.start <= year && year < r.end;
      });
      if (live.length < 2) continue;
      var n = live.length;
      var opts = [];
      var offsets = [0, 1, -1, 2, -2, 3];
      for (var k = 0; k < offsets.length && opts.length < 4; k += 1) {
        var v = n + offsets[k];
        if (v >= 1 && opts.indexOf(v) === -1) opts.push(v);
      }
      if (opts.length < 4) continue;
      out.push({
        id: "count-" + rs[i].id,
        type: "how-many",
        subject: rs[i].id,
        teach: live[i % live.length].id,
        year: year,
        prompt:
          "In " +
          (year < 0 ? -year + " BC" : "AD " + year) +
          ", how many of the regimes on this timeline were running at once?",
        answer: "n-" + n,
        choices: opts.map(function (v) {
          return { id: "n-" + v, label: String(v) };
        }),
        because:
          n +
          ": " +
          live
            .map(function (r) {
              return r.label;
            })
            .join(", ") +
          ".",
      });
    }
    return out;
  }

  // Candidates are drawn so the order they are usually LISTED in misleads —
  // Northern Wei begins in 386, before Liu Song in 420, though every table
  // prints the southern dynasties first.
  function earliest(rs) {
    var out = [];
    for (var i = 0; i < rs.length; i += 1) {
      var s = rs[i];
      var others = rs.filter(function (r) {
        return r.id !== s.id && r.start !== s.start;
      });
      var three = pickThree(others, i + 3);
      if (!three) continue;
      var four = [s, three[0], three[1], three[2]];
      var starts = four.map(function (r) {
        return r.start;
      });
      var min = Math.min.apply(null, starts);
      if (
        starts.filter(function (v) {
          return v === min;
        }).length !== 1
      ) {
        continue;
      }
      var first = four.filter(function (r) {
        return r.start === min;
      })[0];
      out.push({
        id: "first-" + s.id,
        type: "earliest",
        subject: s.id,
        teach: first.id,
        prompt: "Which of these four began first?",
        answer: first.id,
        choices: four.map(toChoice),
        because:
          first.label + " began in " + first.years.split("–")[0].trim() + ", before any of the others.",
      });
    }
    return out;
  }

  // The geography of the split, not just the dates.
  function whichSide(rs) {
    var out = [];
    for (var i = 0; i < rs.length; i += 1) {
      var odd = rs[i];
      var sameTrackPool = rs.filter(function (r) {
        return r.id !== odd.id && r.track !== odd.track;
      });
      // All three distractors must share ONE track that isn't the answer's.
      var tracks = {};
      for (var k = 0; k < sameTrackPool.length; k += 1) {
        var t = sameTrackPool[k].track;
        if (!tracks[t]) tracks[t] = [];
        tracks[t].push(sameTrackPool[k]);
      }
      var names = Object.keys(tracks).filter(function (t) {
        return tracks[t].length >= 3;
      });
      if (!names.length) continue;
      var chosenTrack = names[i % names.length];
      var three = pickThree(tracks[chosenTrack], i + 5);
      if (!three) continue;
      out.push({
        id: "side-" + odd.id,
        type: "which-side",
        subject: odd.id,
        teach: odd.id,
        prompt:
          "Three of these belong to " +
          three[0].trackName.toLowerCase() +
          ". Which one does not?",
        answer: odd.id,
        choices: [toChoice(odd), toChoice(three[0]), toChoice(three[1]), toChoice(three[2])],
        because: odd.label + " belongs to " + odd.trackName.toLowerCase() + ", not " + three[0].trackName.toLowerCase() + ".",
      });
    }
    return out;
  }

  // Teaches the artefact content the detail panel holds — so a wrong answer
  // lands the reader exactly where the answer lives.
  function whoMade(rs) {
    var out = [];
    for (var i = 0; i < rs.length; i += 1) {
      var s = rs[i];
      if (!s.artefact) continue;
      var others = rs.filter(function (r) {
        return r.id !== s.id && r.artefact !== s.artefact;
      });
      var three = pickThree(others, i + 11);
      if (!three) continue;
      out.push({
        id: "made-" + s.id,
        type: "who-made",
        subject: s.id,
        teach: s.id,
        artefact: s.artefact,
        prompt: "Which of these left " + midSentence(s.artefact) + "?",
        answer: s.id,
        choices: [toChoice(s), toChoice(three[0]), toChoice(three[1]), toChoice(three[2])],
        because: s.label + ", " + s.years + ".",
      });
    }
    return out;
  }

  function buildPool(rs) {
    return []
      .concat(sameTime(rs))
      .concat(neverMet(rs))
      .concat(howMany(rs))
      .concat(earliest(rs))
      .concat(whichSide(rs))
      .concat(whoMade(rs));
  }

  /**
   * Ten questions, round-robin across the types rather than a straight draw.
   * A straight draw plus a cap needs a fallback pass that breaks the cap; going
   * type by type spreads them by construction, so no round can be seven
   * "who made this?" in a row and no fallback is needed.
   */
  function pickRound(pool, n, rng) {
    var byType = {};
    var order = [];
    var shuffled = shuffle(pool.slice(), rng);
    for (var i = 0; i < shuffled.length; i += 1) {
      var t = shuffled[i].type;
      if (!byType[t]) {
        byType[t] = [];
        order.push(t);
      }
      byType[t].push(shuffled[i]);
    }
    shuffle(order, rng);

    var chosen = [];
    var usedSubject = {};
    var progressed = true;
    while (chosen.length < n && progressed) {
      progressed = false;
      for (var k = 0; k < order.length && chosen.length < n; k += 1) {
        var list = byType[order[k]];
        while (list.length) {
          var q = list.shift();
          if (usedSubject[q.subject]) continue;
          usedSubject[q.subject] = true;
          chosen.push(q);
          progressed = true;
          break;
        }
      }
    }

    // Fresh objects with their own shuffled choices, so the pool is never
    // mutated and a second round from it is still a full draw.
    return chosen.map(function (q) {
      return {
        id: q.id,
        type: q.type,
        subject: q.subject,
        teach: q.teach,
        prompt: q.prompt,
        answer: q.answer,
        because: q.because,
        year: q.year,
        artefact: q.artefact,
        choices: shuffle(q.choices.slice(), rng),
      };
    });
  }

  window.DYN.buildPool = buildPool;
  window.DYN.pickRound = pickRound;
  window.DYN.overlaps = overlaps;
})();
