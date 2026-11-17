(function () {
  var WHATSAPP = "212698804769";
  var LANGS = ["fr", "en", "ary"];
  var HTML_LANG = { fr: "fr", en: "en", ary: "ary" };

  function pickInitialLang() {
    // ?lang=en dans l'URL (pratique pour le lien sur Upwork)
    var fromUrl = new URLSearchParams(location.search).get("lang");
    if (fromUrl === "darija") fromUrl = "ary";
    if (fromUrl && LANGS.indexOf(fromUrl) !== -1) return fromUrl;
    var saved = null;
    try { saved = localStorage.getItem("lang"); } catch (e) {}
    if (saved && LANGS.indexOf(saved) !== -1) return saved;
    var nav = (navigator.language || "fr").toLowerCase();
    if (nav.indexOf("en") === 0) return "en";
    return "fr";
  }

  function setLang(lang) {
    var dict = window.I18N[lang] || window.I18N.fr;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key] != null) el.textContent = dict[key];
    });

    // Liens WhatsApp avec message pré-rempli dans la bonne langue
    document.querySelectorAll("[data-wa]").forEach(function (el) {
      var key = el.getAttribute("data-wa-key") || "wa.default";
      el.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(dict[key]);
    });

    document.documentElement.lang = HTML_LANG[lang];
    document.title = dict["meta.title"];
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", dict["meta.description"]);

    document.querySelectorAll(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });

    try { localStorage.setItem("lang", lang); } catch (e) {}
  }

  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
  });

  setLang(pickInitialLang());

  // Animation du workflow : un signal parcourt les étapes, une par une
  var nodes = document.querySelectorAll(".flow .node");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
    nodes.forEach(function (n) { n.classList.add("is-done"); });
  } else if (nodes.length) {
    var step = 0;
    setInterval(function () {
      if (step === nodes.length) {
        nodes.forEach(function (n) { n.classList.remove("is-done", "is-active"); });
        step = 0;
        return;
      }
      if (step > 0) {
        nodes[step - 1].classList.remove("is-active");
        nodes[step - 1].classList.add("is-done");
      }
      nodes[step].classList.add("is-active");
      step++;
    }, 1100);
  }

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
