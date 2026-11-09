(function () {
  "use strict";

  function money(n) {
    if (!Number.isFinite(n)) return "—";
    return "$" + n.toFixed(2);
  }

  function num(id) {
    var el = document.getElementById(id);
    var v = parseFloat(el && el.value);
    return Number.isFinite(v) ? v : NaN;
  }

  function recalc() {
    var ing = num("ing");
    var pack = num("pack");
    var labor = num("labor");
    var oh = num("oh");
    var yld = num("yield");
    var markupPct = num("markup");
    var marginPct = num("margin");

    var warn = document.getElementById("demo-warn");
    var batchEl = document.getElementById("out-batch");
    var unitEl = document.getElementById("out-unit");
    var markupEl = document.getElementById("out-markup");
    var marginEl = document.getElementById("out-margin");

    var messages = [];
    if ([ing, pack, labor, oh, yld, markupPct, marginPct].some(function (x) { return !Number.isFinite(x); })) {
      messages.push("Enter valid numbers in every field.");
    }
    if (Number.isFinite(ing) && ing < 0) messages.push("Ingredient cost cannot be negative.");
    if (Number.isFinite(pack) && pack < 0) messages.push("Packaging cost cannot be negative.");
    if (Number.isFinite(labor) && labor < 0) messages.push("Labor cost cannot be negative.");
    if (Number.isFinite(oh) && oh < 0) messages.push("Overhead cannot be negative.");
    if (Number.isFinite(yld) && yld <= 0) messages.push("Finished yield must be greater than zero.");
    if (Number.isFinite(markupPct) && markupPct < 0) messages.push("Markup cannot be negative.");
    if (Number.isFinite(marginPct) && (marginPct < 0 || marginPct >= 100)) {
      messages.push("Margin must be between 0% and 99.99%.");
    }

    if (messages.length) {
      warn.hidden = false;
      warn.textContent = messages.join(" ");
      batchEl.textContent = "—";
      unitEl.textContent = "—";
      markupEl.textContent = "—";
      marginEl.textContent = "—";
      return;
    }

    warn.hidden = true;
    warn.textContent = "";

    var batch = ing + pack + labor + oh;
    var unit = batch / yld;
    var markupFrac = markupPct / 100;
    var marginFrac = marginPct / 100;
    var priceMarkup = unit * (1 + markupFrac);
    var priceMargin = unit / (1 - marginFrac);

    batchEl.textContent = money(batch);
    unitEl.textContent = money(unit);
    markupEl.textContent = money(priceMarkup);
    marginEl.textContent = money(priceMargin);
  }

  var form = document.getElementById("demo-form");
  if (!form) return;
  form.addEventListener("input", recalc);
  form.addEventListener("change", recalc);
  recalc();

  // Expose for headless verification
  window.__demoRecalc = recalc;
  window.__demoGet = function () {
    return {
      batch: document.getElementById("out-batch").textContent,
      unit: document.getElementById("out-unit").textContent,
      markup: document.getElementById("out-markup").textContent,
      margin: document.getElementById("out-margin").textContent
    };
  };
})();
