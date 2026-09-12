(function () {
  var root = document.documentElement;
  var themeBtn = document.getElementById("themeToggle");
  var stored = localStorage.getItem("antp-theme");
  if (stored === "light") root.classList.add("light");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      root.classList.toggle("light");
      localStorage.setItem("antp-theme", root.classList.contains("light") ? "light" : "dark");
    });
  }

  var params = new URLSearchParams(window.location.search);
  var lang = params.get("lang") || localStorage.getItem("antp-lang") || "en";
  var sel = document.getElementById("lang");
  if (sel) {
    sel.value = lang;
    sel.addEventListener("change", function () {
      var v = sel.value;
      localStorage.setItem("antp-lang", v);
      if (window.ANTP_I18N && window.ANTP_I18N.apply) window.ANTP_I18N.apply(v);
      var url = new URL(window.location.href);
      if (v === "en") url.searchParams.delete("lang");
      else url.searchParams.set("lang", v);
      history.replaceState(null, "", url);
    });
  }
  if (window.ANTP_I18N && window.ANTP_I18N.apply) window.ANTP_I18N.apply(lang);
})();
