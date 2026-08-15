(function () {
  "use strict";

  /* theme toggle: dark (default) <-> light, persisted in localStorage */
  var root = document.documentElement;
  var toggles = document.querySelectorAll("[data-theme-toggle]");

  function currentTheme() {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function updateToggle(btn) {
    var icon = btn.querySelector("i");
    var light = currentTheme() === "light";
    if (icon) icon.className = light ? "fa-solid fa-moon" : "fa-solid fa-sun";
    btn.title = light ? "Switch to dark theme" : "Switch to light theme";
  }

  toggles.forEach(function (btn) {
    updateToggle(btn);
    btn.addEventListener("click", function () {
      var next = currentTheme() === "light" ? "dark" : "light";
      if (next === "light") {
        root.setAttribute("data-theme", "light");
      } else {
        root.removeAttribute("data-theme");
      }
      try { localStorage.setItem("theme", next); } catch (e) {}
      toggles.forEach(updateToggle);
    });
  });

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

  /* ---------------------------------------------------------
     In-page navigation: clicking a top-nav link (Posts, Archive,
     About, Tags, Draft, the logo) used to be a plain <a href>,
     causing a full page reload for every section change - flash,
     clock reset, bongo-cat restart, wallpaper re-decode. Fetch the
     target page instead and swap in just the <main> content, like
     the post modal already does for individual posts.
     --------------------------------------------------------- */
  var mainEl = document.querySelector("main.shell");

  function syncNav(pathname) {
    var navLinks = document.querySelectorAll(".waybar .group.left a.module:not(.logo)");
    var activeLink = null;
    navLinks.forEach(function (a) {
      var href = a.getAttribute("href");
      var isActive = href === pathname || (href !== "/" && pathname.indexOf(href) === 0);
      a.classList.toggle("active", isActive);
      if (isActive) activeLink = a;
    });
    var bongo = document.querySelector(".logo-gif");
    var target = activeLink || document.querySelector(".waybar .module.logo");
    if (bongo && target && bongo.parentElement !== target) {
      target.insertBefore(bongo, target.firstChild);
    }
  }

  function loadPage(url, opts) {
    opts = opts || {};
    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("nav fetch failed");
        return res.text();
      })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        var newMain = doc.querySelector("main.shell");
        if (!newMain || !mainEl) throw new Error("no main in response");

        if (overlay.classList.contains("open")) {
          overlay.classList.remove("open");
          document.body.classList.remove("modal-locked");
        }

        mainEl.innerHTML = newMain.innerHTML;
        document.title = doc.title;
        syncNav(new URL(url, location.href).pathname);
        window.scrollTo(0, 0);

        if (opts.push) {
          history.pushState({ page: true, url: url }, "", url);
        }
      })
      .catch(function () {
        window.location.href = url;
      });
  }

  document.body.addEventListener("click", function (e) {
    if (e.defaultPrevented) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    var link = e.target.closest("a[href]");
    if (!link) return;
    if (link.closest("[data-modal-link]")) return;
    if (link.target && link.target !== "_self") return;
    if (link.hasAttribute("download")) return;
    if (link.getAttribute("rel") === "external") return;

    var url;
    try { url = new URL(link.href, location.href); } catch (err) { return; }
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.hash) return;

    e.preventDefault();
    loadPage(url.href, { push: true });
  });

  window.addEventListener("popstate", function () {
    if (overlay.classList.contains("open")) {
      overlay.classList.remove("open");
      document.body.classList.remove("modal-locked");
      document.title = baseTitle;
    }
    loadPage(location.href, { push: false });
  });

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
})();
