(function () {
  var CACHE_KEY = "mosaique_journeys_cache_v3";

  function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function currentLang() {
    try { return localStorage.getItem("mosaique_lang") || "en"; } catch (e) { return "en"; }
  }

  function pick(o, field, lang) {
    if (lang && lang !== "en" && o.t && o.t[lang] && o.t[lang][field] != null) return o.t[lang][field];
    return o[field];
  }

  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function findInCache(id) {
    try {
      var cached = JSON.parse(localStorage.getItem(CACHE_KEY));
      if (Array.isArray(cached)) {
        for (var i = 0; i < cached.length; i++) {
          if (cached[i].id === id) return cached[i];
        }
      }
    } catch (e) {}
    return null;
  }

  function render(journey) {
    var lang = currentLang();
    var title = pick(journey, "title", lang) || "";
    var duration = pick(journey, "duration", lang) || "";
    var price = pick(journey, "price", lang) || journey.price || "";
    var highlights = pick(journey, "highlights", lang) || journey.highlights || [];
    var days = pick(journey, "days", lang) || journey.days || [];
    var inc = journey.includes || [];
    var exc = journey.excludes || [];
    var cities = journey.cities || [];

    // Page title + meta
    document.title = title + " | Mosaique Journeys";
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", journey.summary || title);

    // Hero
    var hero = document.querySelector("[data-journey-hero]");
    if (hero && journey.image) hero.style.backgroundImage = "url(" + esc(journey.image) + ")";
    var titleEl = document.querySelector("[data-journey-title]");
    if (titleEl) titleEl.textContent = title;
    var durEl = document.querySelector("[data-journey-duration]");
    if (durEl) durEl.textContent = duration;
    var priceEl = document.querySelector("[data-journey-price]");
    if (priceEl) priceEl.textContent = price;

    // Highlights
    var hlEl = document.querySelector("[data-journey-highlights]");
    if (hlEl) {
      if (highlights.length) {
        hlEl.innerHTML = highlights.map(function (h) {
          return "<li><span class='jd-hl-icon' aria-hidden='true'>✦</span>" + esc(h) + "</li>";
        }).join("");
      } else {
        var hlSection = hlEl.closest(".jd-highlights-section");
        if (hlSection) hlSection.style.display = "none";
      }
    }

    // Day-by-day
    var daysEl = document.querySelector("[data-journey-days]");
    if (daysEl) {
      if (days.length) {
        daysEl.innerHTML = days.map(function (d, i) {
          return '<div class="jd-day">' +
            '<span class="jd-day-num">Day ' + esc(d.day || (i + 1)) + '</span>' +
            '<div class="jd-day-content">' +
              '<h3 class="jd-day-title">' + esc(d.title || "") + '</h3>' +
              '<p class="jd-day-body">' + esc(d.body || "") + '</p>' +
            '</div>' +
          '</div>';
        }).join("");
      } else {
        var daySection = daysEl.closest(".jd-days-section");
        if (daySection) daySection.style.display = "none";
      }
    }

    // Included
    var incEl = document.querySelector("[data-journey-includes]");
    if (incEl) {
      incEl.innerHTML = inc.map(function (s) {
        return "<li><span class='jd-check' aria-hidden='true'>✓</span>" + esc(s) + "</li>";
      }).join("");
    }

    // Excluded
    var excEl = document.querySelector("[data-journey-excludes]");
    if (excEl) {
      excEl.innerHTML = exc.map(function (s) {
        return "<li><span class='jd-cross' aria-hidden='true'>✗</span>" + esc(s) + "</li>";
      }).join("");
    }

    // Route
    var routeEl = document.querySelector("[data-journey-route]");
    if (routeEl) {
      if (cities.length) {
        routeEl.innerHTML = cities.map(function (city, i) {
          return (i > 0 ? '<span class="jd-route-line" aria-hidden="true"></span>' : "") +
            '<span class="jd-route-stop">' +
              '<span class="jd-route-dot" aria-hidden="true"></span>' +
              '<span class="jd-route-city">' + esc(city) + '</span>' +
            '</span>';
        }).join("");
      } else {
        var routeSection = routeEl.closest(".jd-route-section");
        if (routeSection) routeSection.style.display = "none";
      }
    }

  }

  var id = getParam("id");
  if (!id) { window.location.replace("index.html#tours"); return; }

  var currentJourney = null;

  // Enquire CTA — bound once; reads currentJourney so it works after re-renders
  var enquireBtn = document.querySelector("[data-journey-enquire]");
  if (enquireBtn) {
    enquireBtn.addEventListener("click", function () {
      if (!currentJourney) return;
      var lang = currentLang();
      var title = pick(currentJourney, "title", lang) || "";
      try { localStorage.setItem("mosaique_enquiry_journey", title); } catch (e) {}
    });
  }

  function renderJourney(journey) {
    currentJourney = journey;
    render(journey);
  }

  // Re-render when user switches language so translated content updates
  document.addEventListener("mosaique:lang", function () {
    if (currentJourney) render(currentJourney);
  });

  var cached = findInCache(id);
  if (cached) renderJourney(cached);

  if (window.firebase && firebase.firestore) {
    firebase.firestore().collection("journeys").doc(id).get().then(function (doc) {
      if (doc.exists && Number(doc.data().offerVersion || 0) >= 3) {
        renderJourney(doc.data());
      } else if (!cached) {
        window.location.replace("index.html#tours");
      }
    }).catch(function () {
      if (!cached) window.location.replace("index.html#tours");
    });
  } else if (!cached) {
    window.location.replace("index.html#tours");
  }
})();
