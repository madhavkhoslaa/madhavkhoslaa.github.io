(function () {
  "use strict";

  /* waybar clock */
  var clockEl = document.querySelector("[data-clock]");
  if (clockEl) {
    var tick = function () {
      var d = new Date();
      var h24 = d.getHours();
      var ampm = h24 >= 12 ? "PM" : "AM";
      var h12 = h24 % 12;
      if (h12 === 0) h12 = 12;
      var mm = String(d.getMinutes()).padStart(2, "0");
      clockEl.textContent = h12 + ":" + mm + " " + ampm;
      clockEl.title = d.toDateString();
    };
    tick();
    setInterval(tick, 1000 * 15);
  }

  /* ---------------------------------------------------------
     Modal overlay: clicking a post link fetches its fragment
     output and opens it in a terminal window over a blurred
     backdrop, without leaving the current page. Falls back to
     a normal navigation if JS/fetch fails, and updates the URL
     via pushState so posts stay linkable + back button works.
     --------------------------------------------------------- */
  var overlay = document.querySelector(".modal-overlay");
  if (!overlay) return;

  var panel = overlay.querySelector(".modal-panel");
  var homeURL = document.body.getAttribute("data-home") || "/";
  var baseTitle = document.title;

  function openModal(html, url, title) {
    panel.innerHTML = html;
    overlay.classList.add("open");
    document.body.classList.add("modal-locked");
    if (title) document.title = title + " – " + baseTitle.split(" – ").pop();

    var closeBtn = panel.querySelector("[data-close]");
    if (closeBtn) closeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      closeModal(true);
    });
    var homeBtn = panel.querySelector("[data-home-link]");
    if (homeBtn) homeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = homeURL;
    });
  }

  function closeModal(pushHome) {
    overlay.classList.remove("open");
    document.body.classList.remove("modal-locked");
    document.title = baseTitle;
    if (pushHome && window.location.pathname !== homeURL) {
      history.pushState({ modal: false }, "", homeURL);
    }
  }

  function loadPost(link) {
    var url = link.getAttribute("href");
    var fragURL = url.replace(/\/?$/, "/") + "fragment.html";

    panel.innerHTML = '<div class="term-titlebar">' +
      '<span class="path"><span class="user">guest</span><span class="at">@</span><span class="host">madhav</span><span class="sep">:</span><span class="dir">~/loading</span></span>' +
      '<span class="close" data-close title="close">[x]</span></div>' +
      '<div class="modal-loading">loading…</div>';
    overlay.classList.add("open");
    document.body.classList.add("modal-locked");

    fetch(fragURL)
      .then(function (res) {
        if (!res.ok) throw new Error("fragment not found");
        return res.text();
      })
      .then(function (html) {
        openModal(html, url, link.getAttribute("data-title"));
        history.pushState({ modal: true, url: url }, "", url);
      })
      .catch(function () {
        window.location.href = url;
      });
  }

  document.body.addEventListener("click", function (e) {
    var link = e.target.closest("[data-modal-link]");
    if (!link) return;
    e.preventDefault();
    loadPost(link);
  });

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeModal(true);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("open")) {
      closeModal(true);
    }
  });

  window.addEventListener("popstate", function () {
    if (overlay.classList.contains("open")) {
      overlay.classList.remove("open");
      document.body.classList.remove("modal-locked");
      document.title = baseTitle;
    }
  });
})();
