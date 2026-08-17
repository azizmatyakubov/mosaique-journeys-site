const storageKey = "mosaique-admin-workspace-v1";

const defaults = {
  journeys: [
    {
      id: "journey-essential", order: 0, published: true, link: "#enquire",
      image: "assets/uz-registan.webp",
      duration: "9 Days",
      title: "The Essential Silk Road",
      summary: "An ideal first journey through Uzbekistan's four iconic Silk Road cities — Khiva, Bukhara, Samarkand, and Tashkent. Magnificent Islamic architecture, UNESCO sites, bustling bazaars, and centuries of history.",
      updatedAt: "2026-07-11",
      t: {
        ru: { duration: "9 дней", title: "Классический Шёлковый путь", summary: "Идеальное первое путешествие по четырём легендарным городам Шёлкового пути — Хиве, Бухаре, Самарканду и Ташкенту. Величественная исламская архитектура, объекты ЮНЕСКО, шумные базары и многовековая история." },
        de: { duration: "9 Tage", title: "Die klassische Seidenstraße", summary: "Eine ideale erste Reise durch Usbekistans vier legendäre Seidenstraßen-Städte — Chiwa, Buchara, Samarkand und Taschkent. Prächtige islamische Architektur, UNESCO-Stätten, lebhafte Basare und jahrhundertealte Geschichte." },
        fr: { duration: "9 jours", title: "La Route de la Soie essentielle", summary: "Un premier voyage idéal à travers les quatre villes emblématiques de la Route de la Soie en Ouzbékistan — Khiva, Boukhara, Samarcande et Tachkent. Architecture islamique magnifique, sites de l'UNESCO, bazars animés et des siècles d'histoire." },
        es: { duration: "9 días", title: "La Ruta de la Seda esencial", summary: "Un primer viaje ideal por las cuatro ciudades icónicas de la Ruta de la Seda de Uzbekistán — Jiva, Bujará, Samarcanda y Taskent. Magnífica arquitectura islámica, sitios de la UNESCO, bazares bulliciosos y siglos de historia." },
        it: { duration: "9 giorni", title: "La Via della Seta essenziale", summary: "Un primo viaggio ideale tra le quattro città iconiche della Via della Seta in Uzbekistan — Khiva, Bukhara, Samarcanda e Tashkent. Magnifica architettura islamica, siti UNESCO, bazar animati e secoli di storia." }
      }
    },
    {
      id: "journey-desert", order: 1, published: true, link: "#enquire",
      image: "assets/uz-kyzylkum-night.webp",
      duration: "11 Days",
      title: "Silk Road & Desert Escape",
      summary: "Everything in the Essential Silk Road, plus a night in a traditional yurt camp by the ancient Ayaz Kala fortresses in the Kyzylkum Desert — local hospitality, live music, and unforgettable stargazing.",
      updatedAt: "2026-07-11",
      t: {
        ru: { duration: "11 дней", title: "Шёлковый путь и пустыня", summary: "Всё из «Классического Шёлкового пути» плюс ночь в традиционном юрточном лагере у древних крепостей Аяз-Кала в пустыне Кызылкум — местное гостеприимство, живая музыка и незабываемое звёздное небо." },
        de: { duration: "11 Tage", title: "Seidenstraße & Wüsten-Auszeit", summary: "Alles aus der klassischen Seidenstraße, dazu eine Nacht in einem traditionellen Jurtencamp bei den antiken Ayaz-Kala-Festungen in der Kyzylkum-Wüste — lokale Gastfreundschaft, Live-Musik und unvergesslicher Sternenhimmel." },
        fr: { duration: "11 jours", title: "Route de la Soie & escapade dans le désert", summary: "Tout le voyage essentiel, plus une nuit dans un campement de yourtes traditionnel près des anciennes forteresses d'Ayaz Kala dans le désert du Kyzylkoum — hospitalité locale, musique live et un ciel étoilé inoubliable." },
        es: { duration: "11 días", title: "Ruta de la Seda y escapada al desierto", summary: "Todo el viaje esencial, más una noche en un campamento de yurtas junto a las antiguas fortalezas de Ayaz Kala en el desierto de Kyzylkum — hospitalidad local, música en vivo y un cielo estrellado inolvidable." },
        it: { duration: "11 giorni", title: "Via della Seta e fuga nel deserto", summary: "Tutto il viaggio essenziale, più una notte in un campo tendato tradizionale vicino alle antiche fortezze di Ayaz Kala nel deserto del Kyzylkum — ospitalità locale, musica dal vivo e un cielo stellato indimenticabile." }
      }
    },
    {
      id: "journey-complete", order: 2, published: true, link: "#enquire",
      image: "assets/uz-chorminor.webp",
      duration: "14 Days",
      title: "The Complete Uzbekistan Journey",
      summary: "Our most complete itinerary: the legendary Silk Road cities together with Shahrisabz, birthplace of Amir Timur, and the craft-rich Fergana Valley — ceramics, silk, and authentic local life.",
      updatedAt: "2026-07-11",
      t: {
        ru: { duration: "14 дней", title: "Полное путешествие по Узбекистану", summary: "Наш самый полный маршрут: легендарные города Шёлкового пути вместе с Шахрисабзом, родиной Амира Тимура, и богатой ремёслами Ферганской долиной — керамика, шёлк и подлинная местная жизнь." },
        de: { duration: "14 Tage", title: "Die komplette Usbekistan-Reise", summary: "Unsere umfassendste Route: die legendären Seidenstraßen-Städte zusammen mit Shahrisabz, dem Geburtsort von Amir Timur, und dem handwerklich reichen Ferghanatal — Keramik, Seide und authentisches lokales Leben." },
        fr: { duration: "14 jours", title: "Le grand voyage en Ouzbékistan", summary: "Notre itinéraire le plus complet : les villes légendaires de la Route de la Soie avec Shakhrisabz, berceau d'Amir Timur, et la vallée de Ferghana, riche en artisanat — céramique, soie et vie locale authentique." },
        es: { duration: "14 días", title: "El viaje completo por Uzbekistán", summary: "Nuestro itinerario más completo: las legendarias ciudades de la Ruta de la Seda junto con Shajrisabz, cuna de Amir Timur, y el valle de Fergana, rico en artesanía — cerámica, seda y vida local auténtica." },
        it: { duration: "14 giorni", title: "Il viaggio completo in Uzbekistan", summary: "Il nostro itinerario più completo: le leggendarie città della Via della Seta insieme a Shahrisabz, città natale di Amir Timur, e la valle di Fergana, ricca di artigianato — ceramica, seta e autentica vita locale." }
      }
    }
  ],
  articles: [
    {
      id: "article-best-time",
      title: "Best time to visit Uzbekistan",
      topic: "Travel advice",
      readTime: "6 min",
      summary: "A clear month-by-month guide for spring, autumn, summer, and winter routes.",
      body:
        "Spring and autumn are the easiest seasons for most travellers. Summer can be hot in the historic cities, while winter is quieter and good for guests who prefer fewer crowds.",
      published: true,
      updatedAt: "2026-06-22",
    },
    {
      id: "article-senior-comfort",
      title: "Comfort notes for senior travellers",
      topic: "Travel advice",
      readTime: "5 min",
      summary: "Practical guidance on walking pace, hotels, transfers, and private guiding.",
      body:
        "The best Uzbekistan routes for older guests include shorter sightseeing blocks, private vehicles, central hotels, and clear daily rest time.",
      published: false,
      updatedAt: "2026-06-22",
    },
  ],
  trips: [
    {
      id: "trip-classic-silk-road",
      title: "Classic Silk Road private tour",
      duration: "8-10 days",
      price: "From EUR 2,450 pp",
      cities: "Tashkent, Samarkand, Bukhara",
      summary:
        "A comfortable first visit with major monuments, old town walks, local food, and time to rest between sightseeing blocks.",
      includes: "Private guide, private transfers, train tickets, selected hotels, airport assistance.",
      published: true,
      updatedAt: "2026-06-22",
    },
    {
      id: "trip-khiva-extension",
      title: "Khiva and walled city extension",
      duration: "2-3 days",
      price: "From EUR 690 pp",
      cities: "Bukhara, Khiva",
      summary:
        "A slower historic extension for guests who want the atmosphere of Itchan Kala and short walking distances.",
      includes: "Domestic transfer planning, private guide, old city hotel options, airport support.",
      published: true,
      updatedAt: "2026-06-22",
    },
  ],
  offers: [
    {
      id: "offer-registan-road",
      image: "assets/uz-registan.webp",
      duration: "10 days",
      title: "The Registan Road",
      price: "From €4,950 pp",
      published: true,
      updatedAt: "2026-06-22",
    },
    {
      id: "offer-bukhara-artisans",
      image: "assets/uz-kalyan.webp",
      duration: "5 days",
      title: "Bukhara & the Artisans",
      price: "From €2,650 pp",
      published: true,
      updatedAt: "2026-06-22",
    },
    {
      id: "offer-walls-khiva",
      image: "assets/uz-khiva-madrasa.webp",
      duration: "4 days",
      title: "Walls of Khiva",
      price: "From €2,150 pp",
      published: true,
      updatedAt: "2026-06-22",
    },
    {
      id: "offer-kyzylkum-stars",
      image: "assets/uz-camel.webp",
      duration: "3 days",
      title: "Kyzylkum Under Stars",
      price: "From €1,750 pp",
      published: true,
      updatedAt: "2026-06-22",
    },
  ],
  categories: [
    {
      id: "cat-samarkand",
      image: "assets/uz-registan.webp",
      kicker: "Destination",
      title: "Samarkand",
      summary: "The jewel of the Silk Road — Registan, Shah-i-Zinda, Gur-e-Amir",
      group: "cities",
      link: "destinations/samarkand.html",
      published: true,
      updatedAt: "2026-06-29",
    },
    {
      id: "cat-bukhara",
      image: "assets/uz-kalyan.webp",
      kicker: "Destination",
      title: "Bukhara",
      summary: "A living museum of madrasas, minarets, and bazaars",
      group: "cities",
      link: "destinations/bukhara.html",
      published: true,
      updatedAt: "2026-06-29",
    },
    {
      id: "cat-khiva",
      image: "assets/uz-khiva-walls.webp",
      kicker: "Destination",
      title: "Khiva",
      summary: "A perfectly walled open-air museum city",
      group: "cities",
      link: "destinations/khiva.html",
      published: true,
      updatedAt: "2026-06-29",
    },
    {
      id: "cat-tashkent",
      image: "assets/uz-bibikhanym.webp",
      kicker: "Destination",
      title: "Tashkent",
      summary: "The capital where the journey begins and ends",
      group: "cities",
      link: "destinations/tashkent.html",
      published: true,
      updatedAt: "2026-06-29",
    },
    {
      id: "cat-shahrisabz",
      image: "assets/uz-chorminor.webp",
      kicker: "Destination",
      title: "Shahrisabz",
      summary: "Birthplace of Amir Timur, and his Ak-Saray palace",
      group: "cities",
      link: "destinations/shahrisabz.html",
      published: true,
      updatedAt: "2026-06-29",
    },
    {
      id: "cat-fergana",
      image: "assets/uz-ulugbek-tile.webp",
      kicker: "Destination",
      title: "Fergana Valley",
      summary: "Master ceramicists, silk weaving, and living craft",
      group: "nature",
      link: "destinations/fergana-valley.html",
      published: true,
      updatedAt: "2026-06-29",
    },
    {
      id: "cat-kyzylkum",
      image: "assets/uz-camel.webp",
      kicker: "Destination",
      title: "Kyzylkum Desert",
      summary: "Yurt camps, the Ayaz Kala fortresses, and endless stars",
      group: "nature",
      link: "destinations/kyzylkum.html",
      published: true,
      updatedAt: "2026-06-29",
    },
  ],
  groups: [
    {
      id: "group-spring-silk-road",
      title: "Spring Silk Road small group",
      startDate: "2027-04-14",
      endDate: "2027-04-23",
      seats: "14",
      booked: "6",
      price: "EUR 1,980 pp",
      language: "English",
      bookingStatus: "Open",
      route: "Tashkent, Samarkand, Bukhara, Khiva",
      summary:
        "A fixed-date small group route for travellers who want a preplanned Uzbekistan journey with clear pacing.",
      published: true,
      updatedAt: "2026-06-22",
    },
    {
      id: "group-french-autumn",
      title: "French-speaking autumn departure",
      startDate: "2027-09-18",
      endDate: "2027-09-27",
      seats: "12",
      booked: "10",
      price: "EUR 2,150 pp",
      language: "French",
      bookingStatus: "Few seats",
      route: "Tashkent, Samarkand, Shahrisabz, Bukhara",
      summary:
        "A French-speaking group departure focused on cultural sites, comfortable hotels, and slower daily timing.",
      published: false,
      updatedAt: "2026-06-22",
    },
  ],
};

const state = loadState();
const selected = {
  article: state.articles[0]?.id || "",
  trip: state.trips[0]?.id || "",
  group: state.groups[0]?.id || "",
  offer: state.offers[0]?.id || "",
  category: state.categories[0]?.id || "",
  journey: state.journeys[0]?.id || "",
};

const collectionByType = {
  article: "articles",
  trip: "trips",
  group: "groups",
  offer: "offers",
  category: "categories",
  journey: "journeys",
};

const listLabels = {
  article: "article",
  trip: "private trip",
  group: "group trip",
  offer: "landing offer",
  category: "journey category",
  journey: "journey card",
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved?.articles && saved?.trips && saved?.groups) {
      // Backward-compatible: seed landing collections for older saved states.
      if (!Array.isArray(saved.offers)) saved.offers = JSON.parse(JSON.stringify(defaults.offers));
      if (!Array.isArray(saved.categories)) saved.categories = JSON.parse(JSON.stringify(defaults.categories));
      if (!Array.isArray(saved.journeys)) saved.journeys = JSON.parse(JSON.stringify(defaults.journeys));
      return saved;
    }
  } catch {
    localStorage.removeItem(storageKey);
  }
  return JSON.parse(JSON.stringify(defaults));
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

/* ── Cloud Firestore sync for landing-page content (offers + categories) ──
   Firestore is the source of truth for what shows on the public homepage;
   localStorage above stays as a local cache. Articles/trips/groups remain
   local-only. */
function isLanding(type) {
  return type === "offer" || type === "category" || type === "journey";
}
function fsDb() {
  return window.firebase && firebase.firestore ? firebase.firestore() : null;
}
// Write every item in a landing collection with its array index as `order`,
// so the homepage can render them in the agency's chosen order.
function fsSyncCollection(type) {
  var db = fsDb();
  if (!db || !isLanding(type)) return Promise.resolve();
  var col = collectionByType[type];
  var items = getItems(type);
  var batch = db.batch();
  items.forEach(function (item, i) {
    batch.set(db.collection(col).doc(item.id), Object.assign({}, item, { order: i }));
  });
  return batch.commit().catch(function (e) { console.warn("Firestore sync failed", e); });
}
function fsDeleteDoc(type, id) {
  var db = fsDb();
  if (!db || !isLanding(type)) return Promise.resolve();
  return db.collection(collectionByType[type]).doc(id).delete()
    .catch(function (e) { console.warn("Firestore delete failed", e); });
}
// Load landing collections from Firestore on startup; seed defaults the first
// time (when the cloud collections are still empty).
function fsLoadLanding() {
  var db = fsDb();
  if (!db) return Promise.resolve();
  return Promise.all(["offer", "category", "journey"].map(function (type) {
    var col = collectionByType[type];
    return db.collection(col).orderBy("order").get().then(function (snap) {
      if (snap.empty) {
        return fsSyncCollection(type); // seed cloud from local defaults
      }
      var arr = [];
      snap.forEach(function (d) { arr.push(d.data()); });
      state[col] = arr;
      selected[type] = arr[0] ? arr[0].id : "";
    });
  })).then(function () {
    saveState();
    renderAll();
  }).catch(function (e) { console.warn("Firestore load failed", e); });
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function makeId(type) {
  return `${type}-${Date.now().toString(36)}`;
}

function getItems(type) {
  return state[collectionByType[type]];
}

function getSelectedItem(type) {
  return getItems(type).find((item) => item.id === selected[type]);
}

function statusBadge(item) {
  return `<span class="status ${item.published ? "won" : "active"}">${item.published ? "Published" : "Draft"}</span>`;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderList(type) {
  const list = document.querySelector(`[data-list="${collectionByType[type]}"]`);
  if (!list) return;

  const rows = getItems(type)
    .map((item) => {
      const selectedClass = item.id === selected[type] ? "is-selected" : "";
      if (type === "article") {
        return `
          <button class="content-row ${selectedClass}" type="button" data-edit-item="article" data-id="${item.id}">
            <span class="row-main">
              <strong>${escapeHtml(item.title)}</strong>
              <small>${escapeHtml(item.summary || "No summary yet")}</small>
            </span>
            <span class="row-meta">
              <span>${escapeHtml(item.topic || "Untitled")}</span>
              <span>${escapeHtml(item.readTime || "No time")}</span>
            </span>
            <span class="row-status">${statusBadge(item)}</span>
          </button>
        `;
      }
      if (type === "trip") {
        return `
          <button class="content-row ${selectedClass}" type="button" data-edit-item="trip" data-id="${item.id}">
            <span class="row-main">
              <strong>${escapeHtml(item.title)}</strong>
              <small>${escapeHtml(item.cities || "No cities selected")}</small>
            </span>
            <span class="row-meta">
              <span>${escapeHtml(item.duration || "-")}</span>
              <span>${escapeHtml(item.price || "-")}</span>
            </span>
            <span class="row-status">${statusBadge(item)}</span>
          </button>
        `;
      }
      if (type === "journey") {
        const thumb = item.image
          ? `<img class="row-thumb" src="${escapeHtml(item.image)}" alt="" />`
          : `<span class="row-thumb row-thumb-empty">+</span>`;
        const meta = `${escapeHtml(item.duration || "")}${item.duration && item.summary ? " · " : ""}${escapeHtml((item.summary || "").slice(0, 60))}${(item.summary || "").length > 60 ? "…" : ""}`;
        return `
          <div class="content-row content-row-media ${selectedClass}">
            <button class="row-open" type="button" data-edit-item="journey" data-id="${item.id}">
              ${thumb}
              <span class="row-main">
                <strong>${escapeHtml(item.title)}</strong>
                <small>${meta}</small>
              </span>
            </button>
            <span class="row-status">${statusBadge(item)}</span>
            <span class="row-move">
              <button type="button" data-move-item="journey" data-id="${item.id}" data-dir="up" aria-label="Move up">&#8593;</button>
              <button type="button" data-move-item="journey" data-id="${item.id}" data-dir="down" aria-label="Move down">&#8595;</button>
            </span>
          </div>
        `;
      }
      if (type === "offer" || type === "category") {
        const meta =
          type === "offer"
            ? `${escapeHtml(item.duration || "-")} · ${escapeHtml(item.price || "-")}`
            : escapeHtml(item.summary || "No description yet");
        const thumb = item.image
          ? `<img class="row-thumb" src="${escapeHtml(item.image)}" alt="" />`
          : `<span class="row-thumb row-thumb-empty">+</span>`;
        return `
          <div class="content-row content-row-media ${selectedClass}">
            <button class="row-open" type="button" data-edit-item="${type}" data-id="${item.id}">
              ${thumb}
              <span class="row-main">
                <strong>${escapeHtml(item.title)}</strong>
                <small>${meta}</small>
              </span>
            </button>
            <span class="row-status">${statusBadge(item)}</span>
            <span class="row-move">
              <button type="button" data-move-item="${type}" data-id="${item.id}" data-dir="up" aria-label="Move up">&#8593;</button>
              <button type="button" data-move-item="${type}" data-id="${item.id}" data-dir="down" aria-label="Move down">&#8595;</button>
            </span>
          </div>
        `;
      }
      const available = Math.max(Number(item.seats || 0) - Number(item.booked || 0), 0);
      return `
        <button class="content-row ${selectedClass}" type="button" data-edit-item="group" data-id="${item.id}">
          <span class="row-main">
            <strong>${escapeHtml(item.title)}</strong>
            <small>${escapeHtml(item.route || "No route selected")}</small>
          </span>
          <span class="row-meta">
            <span>${escapeHtml(formatRange(item.startDate, item.endDate))}</span>
            <span>${available}/${escapeHtml(item.seats || 0)} left</span>
          </span>
          <span class="row-status">${statusBadge(item)} <span class="status subtle">${escapeHtml(item.bookingStatus || "Open")}</span></span>
        </button>
      `;
    })
    .join("");

  list.innerHTML = rows || `<div class="content-empty">No ${collectionByType[type]} yet.</div>`;
}

function formatRange(start, end) {
  if (!start && !end) return "-";
  if (!end || start === end) return start;
  return `${start} to ${end}`;
}

function renderDaysContainer(form, days) {
  var container = form.querySelector("[data-days-container]");
  if (!container) return;
  container.innerHTML = (days || []).map(function (d, i) {
    return '<div class="day-row" data-day-index="' + i + '">' +
      '<div class="day-row-header">' +
        '<strong class="day-row-num">Day ' + (d.day || (i + 1)) + '</strong>' +
        '<button type="button" class="text-button danger day-row-remove" data-remove-day aria-label="Remove day">\xd7</button>' +
      '</div>' +
      '<input class="day-row-title" type="text" placeholder="Day title" value="' + escapeHtml(d.title || "") + '" />' +
      '<textarea class="day-row-body" rows="3" placeholder="Day description…">' + escapeHtml(d.body || "") + '</textarea>' +
    '</div>';
  }).join("");
  syncDaysToHidden(form);
}

function syncDaysToHidden(form) {
  var container = form.querySelector("[data-days-container]");
  var hidden = form.elements["days_json"];
  if (!container || !hidden) return;
  var days = Array.from(container.querySelectorAll("[data-day-index]")).map(function (row, i) {
    return {
      day: i + 1,
      title: (row.querySelector(".day-row-title")?.value || "").trim(),
      body: (row.querySelector(".day-row-body")?.value || "").trim()
    };
  });
  hidden.value = JSON.stringify(days);
}

function fillEditor(type) {
  const form = document.querySelector(`[data-editor="${type}"]`);
  const item = getSelectedItem(type);
  if (!form) return;

  form.reset();
  if (!item) {
    form.elements.id.value = "";
    syncRichFromItem(form, { body: "" });
    if (type === "journey") renderDaysContainer(form, []);
    const title = document.querySelector(`[data-editor-title="${type}"]`);
    if (title) {
      title.textContent = `Create ${listLabels[type]}`;
    }
    return;
  }

  Object.entries(item).forEach(([key, value]) => {
    const field = form.elements[key];
    if (!field) return;
    if (field.type === "checkbox") {
      field.checked = Boolean(value);
    } else {
      field.value = value ?? "";
    }
  });

  const title = document.querySelector(`[data-editor-title="${type}"]`);
  if (title) {
    title.textContent = `Edit ${listLabels[type]}`;
  }

  if (type === "journey") {
    var t = item.t || {};
    // fill array → textarea
    var hl = form.elements["highlights_text"];
    if (hl) hl.value = (item.highlights || []).join("\n");
    var inc = form.elements["includes_text"];
    if (inc) inc.value = (item.includes || []).join("\n");
    var exc = form.elements["excludes_text"];
    if (exc) exc.value = (item.excludes || []).join("\n");
    var cit = form.elements["cities_text"];
    if (cit) cit.value = (item.cities || []).join(", ");
    // fill translation tabs
    ["ru", "de", "fr", "es", "it"].forEach(function (lang) {
      var langData = t[lang] || {};
      ["title", "summary", "duration"].forEach(function (field) {
        var el = form.elements["t_" + lang + "_" + field];
        if (el) el.value = langData[field] || "";
      });
      var prEl = form.elements["t_" + lang + "_price"];
      if (prEl) prEl.value = langData.price || "";
      var hlEl = form.elements["t_" + lang + "_highlights_text"];
      if (hlEl) hlEl.value = (langData.highlights || []).join("\n");
    });
    renderDaysContainer(form, item.days || []);
  }

  syncRichFromItem(form, item);
}

function syncRichFromItem(form, item) {
  const editor = form.querySelector("[data-rich-editor]");
  const source = form.querySelector("[data-rich-source]");
  if (!editor || !source) return;

  const body = item.body || "";
  if (/<[a-z][\s\S]*>/i.test(body)) {
    editor.innerHTML = body;
  } else {
    editor.textContent = body;
  }
  source.value = editor.innerHTML;
}

function syncRichToSource(form) {
  const editor = form.querySelector("[data-rich-editor]");
  const source = form.querySelector("[data-rich-source]");
  if (!editor || !source) return;
  source.value = editor.innerHTML.trim();
}

function runRichCommand(button) {
  const form = button.closest("[data-editor]");
  const editor = form?.querySelector("[data-rich-editor]");
  if (!form || !editor) return;

  editor.focus();
  const command = button.dataset.richCommand;
  let value = button.dataset.richValue || null;

  if (command === "createLink") {
    value = window.prompt("URL");
    if (!value) return;
  }

  document.execCommand(command, false, value);
  syncRichToSource(form);
}

function renderMetrics() {
  const publishedArticles = state.articles.filter((item) => item.published).length;
  const publishedTrips = state.trips.filter((item) => item.published).length;
  const publishedGroups = state.groups.filter((item) => item.published).length;
  const publishedJourneys = state.journeys.filter((item) => item.published).length;
  const drafts = [...state.articles, ...state.trips, ...state.groups, ...state.offers, ...state.categories, ...state.journeys].filter(
    (item) => !item.published,
  ).length;

  setText("[data-metric='articles']", publishedArticles);
  setText("[data-metric='trips']", publishedTrips);
  setText("[data-metric='groups']", publishedGroups);
  setText("[data-metric='journeys']", publishedJourneys);
  setText("[data-metric='drafts']", drafts);
  setText(
    "[data-admin-summary]",
    `${publishedArticles + publishedTrips + publishedGroups + publishedJourneys} published, ${drafts} drafts`,
  );
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function renderAll() {
  ["article", "trip", "group", "offer", "category", "journey"].forEach((type) => {
    renderList(type);
    fillEditor(type);
    syncImagePreview(type);
  });
  renderMetrics();
}

function syncImagePreview(type) {
  const form = document.querySelector(`[data-editor="${type}"]`);
  if (!form) return;
  const preview = form.querySelector("[data-image-preview]");
  const value = form.elements.image ? form.elements.image.value : "";
  if (!preview) return;
  if (value) {
    preview.innerHTML = `<img src="${escapeHtml(value)}" alt="Card image preview" />`;
    preview.classList.add("has-image");
  } else {
    preview.innerHTML = `<span>No image yet</span>`;
    preview.classList.remove("has-image");
  }
}

function readForm(type, form) {
  syncRichToSource(form);
  if (type === "journey") syncDaysToHidden(form);
  const data = Object.fromEntries(new FormData(form).entries());
  const existing = getItems(type).find((item) => item.id === data.id);

  let t;
  if (type === "journey") {
    t = (existing && existing.t) ? JSON.parse(JSON.stringify(existing.t)) : {};
    ["ru", "de", "fr", "es", "it"].forEach(function (lang) {
      if (!t[lang]) t[lang] = {};
      ["title", "summary", "duration"].forEach(function (field) {
        const key = "t_" + lang + "_" + field;
        const val = (data[key] || "").trim();
        if (val) t[lang][field] = val;
        else delete t[lang][field];
        delete data[key];
      });
      if (!Object.keys(t[lang]).length) delete t[lang];
    });

    // convert textarea fields → arrays
    var toLines = function (s) { return (s || "").split("\n").map(function (x) { return x.trim(); }).filter(Boolean); };
    var toCommas = function (s) { return (s || "").split(",").map(function (x) { return x.trim(); }).filter(Boolean); };
    data.highlights = toLines(data.highlights_text); delete data.highlights_text;
    data.includes = toLines(data.includes_text); delete data.includes_text;
    data.excludes = toLines(data.excludes_text); delete data.excludes_text;
    data.cities = toCommas(data.cities_text); delete data.cities_text;
    try { data.days = JSON.parse(data.days_json || "[]"); } catch (e) { data.days = []; }
    delete data.days_json;

    // also handle per-language price + highlights in t
    ["ru", "de", "fr", "es", "it"].forEach(function (lang) {
      if (!t[lang]) t[lang] = {};
      var prKey = "t_" + lang + "_price";
      var prVal = (data[prKey] || "").trim();
      if (prVal) t[lang].price = prVal; else delete t[lang].price;
      delete data[prKey];
      var hlKey = "t_" + lang + "_highlights_text";
      var hlVal = toLines(data[hlKey]);
      if (hlVal.length) t[lang].highlights = hlVal; else delete t[lang].highlights;
      delete data[hlKey];
      if (!Object.keys(t[lang]).length) delete t[lang];
    });
  }

  const item = {
    ...existing,
    ...data,
    id: data.id || makeId(type),
    published: Boolean(form.elements.published?.checked),
    updatedAt: today(),
  };
  if (type === "journey") item.t = t;
  return item;
}

function saveItem(type, form) {
  const item = readForm(type, form);
  const items = getItems(type);
  const index = items.findIndex((entry) => entry.id === item.id);
  if (index >= 0) {
    items[index] = item;
  } else {
    items.unshift(item);
  }
  selected[type] = item.id;
  saveState();
  if (isLanding(type)) fsSyncCollection(type);
  renderAll();
  showToast(`${capitalize(listLabels[type])} saved`);
}

function newItem(type) {
  const item = createBlankItem(type);
  getItems(type).unshift(item);
  selected[type] = item.id;
  saveState();
  if (isLanding(type)) fsSyncCollection(type);
  renderAll();
  document.querySelector(`[data-editor="${type}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  showToast(`New ${listLabels[type]} draft created`);
}

function createBlankItem(type) {
  const base = {
    id: makeId(type),
    title: "Untitled draft",
    summary: "",
    published: false,
    updatedAt: today(),
  };
  if (type === "article") {
    return { ...base, topic: "Travel advice", readTime: "", body: "" };
  }
  if (type === "trip") {
    return { ...base, duration: "", price: "", cities: "", includes: "" };
  }
  if (type === "journey") {
    return { ...base, image: "", duration: "", price: "", cities: [], highlights: [], includes: [], excludes: [], days: [], link: "#enquire", t: {} };
  }
  if (type === "offer") {
    return { ...base, image: "", duration: "", price: "" };
  }
  if (type === "category") {
    return { ...base, image: "", kicker: "Destination", group: "cities", link: "" };
  }
  return {
    ...base,
    startDate: "",
    endDate: "",
    seats: "12",
    booked: "0",
    price: "",
    language: "English",
    bookingStatus: "Open",
    route: "",
  };
}

function deleteSelected(type) {
  const item = getSelectedItem(type);
  if (!item) return;
  if (!window.confirm(`Delete "${item.title}"?`)) return;

  const items = getItems(type);
  const index = items.findIndex((entry) => entry.id === item.id);
  items.splice(index, 1);
  selected[type] = items[0]?.id || "";
  saveState();
  if (isLanding(type)) {
    fsDeleteDoc(type, item.id).then(function () { fsSyncCollection(type); });
  }
  renderAll();
  showToast(`${capitalize(listLabels[type])} deleted`);
}

function moveItem(type, id, dir) {
  const items = getItems(type);
  const index = items.findIndex((entry) => entry.id === id);
  if (index < 0) return;
  const target = dir === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= items.length) return;
  [items[index], items[target]] = [items[target], items[index]];
  saveState();
  if (isLanding(type)) fsSyncCollection(type);
  renderAll();
  showToast("Order updated");
}

// Read an uploaded image, downscale it, and return a compact data URL so the
// browser-stored workspace stays small enough for localStorage.
function readImageFile(file, onDone) {
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const maxW = 1100;
      const scale = Math.min(1, maxW / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      onDone(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => onDone(reader.result);
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function exportWorkspace() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `mosaique-content-${today()}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Content JSON exported");
}

let toastTimer;

function showToast(message) {
  const toast = document.querySelector("[data-admin-toast]");
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 2200);
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

document.addEventListener("click", function (e) {
  // Add day button
  if (e.target.closest("[data-add-day]")) {
    var form = e.target.closest("[data-editor='journey']");
    if (!form) return;
    var container = form.querySelector("[data-days-container]");
    var currentCount = container ? container.querySelectorAll("[data-day-index]").length : 0;
    var blank = { day: currentCount + 1, title: "", body: "" };
    var existing = Array.from(container.querySelectorAll("[data-day-index]")).map(function (row, i) {
      return {
        day: i + 1,
        title: (row.querySelector(".day-row-title")?.value || "").trim(),
        body: (row.querySelector(".day-row-body")?.value || "").trim()
      };
    });
    renderDaysContainer(form, [...existing, blank]);
  }

  // Remove day button
  if (e.target.closest("[data-remove-day]")) {
    var row = e.target.closest("[data-day-index]");
    var form2 = e.target.closest("[data-editor='journey']");
    if (!row || !form2) return;
    var container2 = form2.querySelector("[data-days-container]");
    var remaining = Array.from(container2.querySelectorAll("[data-day-index]"))
      .filter(function (r) { return r !== row; })
      .map(function (r, i) {
        return {
          day: i + 1,
          title: (r.querySelector(".day-row-title")?.value || "").trim(),
          body: (r.querySelector(".day-row-body")?.value || "").trim()
        };
      });
    renderDaysContainer(form2, remaining);
  }
});

document.addEventListener("click", (event) => {
  const richButton = event.target.closest("[data-rich-command]");
  const editButton = event.target.closest("[data-edit-item]");
  const newButton = event.target.closest("[data-new-item]");
  const deleteButton = event.target.closest("[data-delete-item]");
  const moveButton = event.target.closest("[data-move-item]");
  const exportButton = event.target.closest("[data-admin-export]");
  const navLink = event.target.closest(".admin-nav a");
  const langTab = event.target.closest("[data-lang-tab]");

  if (langTab) {
    const editor = langTab.closest("[data-editor]");
    if (editor) {
      const lang = langTab.dataset.langTab;
      editor.querySelectorAll(".lang-tab").forEach((btn) => btn.classList.toggle("is-active", btn === langTab));
      editor.querySelectorAll(".lang-panel").forEach((panel) => panel.classList.toggle("is-active", panel.dataset.langPanel === lang));
    }
  }

  if (richButton) {
    runRichCommand(richButton);
  }

  if (moveButton) {
    moveItem(moveButton.dataset.moveItem, moveButton.dataset.id, moveButton.dataset.dir);
  }

  if (editButton) {
    selected[editButton.dataset.editItem] = editButton.dataset.id;
    renderAll();
  }

  if (newButton) {
    newItem(newButton.dataset.newItem);
  }

  if (deleteButton) {
    deleteSelected(deleteButton.dataset.deleteItem);
  }

  if (exportButton) {
    exportWorkspace();
  }

  if (navLink) {
    document.querySelectorAll(".admin-nav a").forEach((link) => link.classList.toggle("is-active", link === navLink));
  }
});

document.addEventListener("input", (event) => {
  const editor = event.target.closest("[data-rich-editor]");
  if (!editor) return;
  const form = editor.closest("[data-editor]");
  if (form) syncRichToSource(form);
});

document.addEventListener("change", (event) => {
  const fileInput = event.target.closest("[data-image-input]");
  if (!fileInput || !fileInput.files || !fileInput.files.length) return;
  const form = fileInput.closest("[data-editor]");
  if (!form) return;
  readImageFile(fileInput.files[0], (dataUrl) => {
    if (form.elements.image) form.elements.image.value = dataUrl;
    syncImagePreview(form.dataset.editor);
    fileInput.value = "";
  });
});

document.addEventListener("click", (event) => {
  const clearBtn = event.target.closest("[data-image-clear]");
  if (!clearBtn) return;
  const form = clearBtn.closest("[data-editor]");
  if (form && form.elements.image) {
    form.elements.image.value = "";
    syncImagePreview(form.dataset.editor);
  }
});

document.querySelectorAll("[data-editor]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    saveItem(form.dataset.editor, form);
  });
});

renderAll();

/* ── Enquiries inbox (leads submitted from the website) ── */
function escAdmin(value) {
  return String(value == null ? "" : value).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
  });
}
function fmtEnquiryDate(ts) {
  if (!ts || !ts.toDate) return "";
  return ts.toDate().toLocaleString(undefined, {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}
let enquiryUnsub = null;
function initEnquiries() {
  const db = fsDb();
  const list = document.querySelector("[data-admin-enquiry-list]");
  if (!db || !list || enquiryUnsub) return;
  enquiryUnsub = db.collection("enquiries").orderBy("createdAt", "desc").onSnapshot(
    function (snap) {
      const items = [];
      snap.forEach(function (d) { const o = d.data(); o.id = d.id; items.push(o); });
      renderEnquiries(items);
      setText("[data-metric='enquiries']", items.filter(function (i) { return i.status !== "handled"; }).length);
    },
    function () { list.innerHTML = '<div class="content-empty">Could not load enquiries.</div>'; },
  );
}
function renderEnquiries(items) {
  const list = document.querySelector("[data-admin-enquiry-list]");
  if (!list) return;
  if (!items.length) {
    list.innerHTML = '<div class="content-empty">No enquiries yet. They’ll appear here the moment someone submits the website form.</div>';
    return;
  }
  list.innerHTML = items.map(function (it) {
    const handled = it.status === "handled";
    const trip = [it.dates, it.party, it.destinations].filter(Boolean).map(escAdmin).join(" · ");
    return '<article class="enquiry-card' + (handled ? " is-handled" : "") + '">' +
      '<div class="enquiry-card-top">' +
        '<div class="enquiry-who"><strong>' + escAdmin(it.name) + "</strong>" +
        '<a class="enquiry-email" href="mailto:' + escAdmin(it.email) + '">' + escAdmin(it.email) + "</a></div>" +
        '<div class="enquiry-card-meta">' +
          '<span class="status ' + (handled ? "won" : "new") + '">' + (handled ? "Handled" : "New") + "</span>" +
          "<time>" + fmtEnquiryDate(it.createdAt) + "</time>" +
        "</div>" +
      "</div>" +
      (trip ? '<p class="enquiry-trip">' + trip + "</p>" : "") +
      '<p class="enquiry-msg">' + escAdmin(it.message) + "</p>" +
      '<div class="enquiry-actions">' +
        '<a class="text-button" href="mailto:' + escAdmin(it.email) + "?subject=" +
          encodeURIComponent("Re: your Mosaique Journeys enquiry") + '">Reply</a>' +
        '<button type="button" class="text-button" data-enq-toggle="' + escAdmin(it.id) + '" data-handled="' + handled + '">' +
          (handled ? "Reopen" : "Mark handled") + "</button>" +
        '<button type="button" class="text-button danger" data-enq-delete="' + escAdmin(it.id) + '">Delete</button>' +
      "</div>" +
    "</article>";
  }).join("");
}
document.addEventListener("click", function (e) {
  const db = fsDb();
  if (!db) return;
  const toggle = e.target.closest("[data-enq-toggle]");
  const del = e.target.closest("[data-enq-delete]");
  const refresh = e.target.closest("[data-enquiry-refresh]");
  if (toggle) {
    const handled = toggle.getAttribute("data-handled") === "true";
    db.collection("enquiries").doc(toggle.getAttribute("data-enq-toggle")).update({ status: handled ? "new" : "handled" });
  }
  if (del && window.confirm("Delete this enquiry permanently?")) {
    db.collection("enquiries").doc(del.getAttribute("data-enq-delete")).delete();
  }
  if (refresh) initEnquiries();
});

/* ── Guest reviews moderation ── */
let reviewsUnsub = null;
function initReviews() {
  var db = fsDb();
  var list = document.querySelector("[data-admin-reviews-list]");
  if (!db || !list || reviewsUnsub) return;
  reviewsUnsub = db.collection("reviews").orderBy("createdAt", "desc").onSnapshot(
    function (snap) {
      var items = [];
      snap.forEach(function (d) { var o = d.data(); o.id = d.id; items.push(o); });
      renderReviews(items);
      setText("[data-metric='reviews']", items.filter(function (i) { return !i.approved; }).length);
    },
    function () { list.innerHTML = '<div class="content-empty">Could not load reviews.</div>'; }
  );
}
function renderReviews(items) {
  var list = document.querySelector("[data-admin-reviews-list]");
  if (!list) return;
  if (!items.length) {
    list.innerHTML = '<div class="content-empty">No reviews submitted yet.</div>';
    return;
  }
  list.innerHTML = items.map(function (it) {
    var stars = "★".repeat(Math.max(0, Math.min(5, it.rating || 0)));
    var empty = "☆".repeat(Math.max(0, 5 - Math.min(5, it.rating || 0)));
    return '<article class="enquiry-card' + (it.approved ? " is-handled" : "") + '">' +
      '<div class="enquiry-card-top">' +
        '<div class="enquiry-who"><strong>' + escAdmin(it.name) + "</strong></div>" +
        '<div class="enquiry-card-meta">' +
          '<span class="status ' + (it.approved ? "won" : "new") + '">' + (it.approved ? "Approved" : "Pending") + "</span>" +
          '<span style="letter-spacing:1px;color:#c6a05c">' + stars + '</span><span style="letter-spacing:1px;color:#bbb">' + empty + "</span>" +
          "<time>" + fmtEnquiryDate(it.createdAt) + "</time>" +
        "</div>" +
      "</div>" +
      '<p class="enquiry-msg">' + escAdmin(it.message) + "</p>" +
      '<div class="enquiry-actions">' +
        '<button type="button" class="text-button" data-review-toggle="' + escAdmin(it.id) + '" data-approved="' + it.approved + '">' +
          (it.approved ? "Unapprove" : "Approve &amp; publish") + "</button>" +
        '<button type="button" class="text-button danger" data-review-delete="' + escAdmin(it.id) + '">Delete</button>' +
      "</div>" +
    "</article>";
  }).join("");
}
document.addEventListener("click", function (e) {
  var db = fsDb();
  if (!db) return;
  var toggle = e.target.closest("[data-review-toggle]");
  var del = e.target.closest("[data-review-delete]");
  var refresh = e.target.closest("[data-reviews-refresh]");
  if (toggle) {
    var approved = toggle.getAttribute("data-approved") === "true";
    db.collection("reviews").doc(toggle.getAttribute("data-review-toggle")).update({ approved: !approved });
  }
  if (del && window.confirm("Delete this review permanently?")) {
    db.collection("reviews").doc(del.getAttribute("data-review-delete")).delete();
  }
  if (refresh) { reviewsUnsub = null; initReviews(); }
});

/* ── Newsletter subscribers ── */
function loadSubscribers() {
  var db = fsDb();
  var list = document.querySelector("[data-admin-subscribers-list]");
  if (!db || !list) return;
  list.innerHTML = '<div class="content-empty">Loading subscribers…</div>';
  db.collection("subscribers").orderBy("createdAt", "desc").get().then(function (snap) {
    var items = [];
    snap.forEach(function (d) { var o = d.data(); o.id = d.id; items.push(o); });
    if (!items.length) {
      list.innerHTML = '<div class="content-empty">No subscribers yet.</div>';
      return;
    }
    list.innerHTML = items.map(function (it) {
      return '<div class="content-row">' +
        '<span class="row-main"><strong>' + escAdmin(it.email) + "</strong>" +
        "<small>" + fmtEnquiryDate(it.createdAt) + "</small></span>" +
        '<span class="row-status"><button type="button" class="text-button danger" data-sub-delete="' + escAdmin(it.id) + '">Remove</button></span>' +
      "</div>";
    }).join("");
    setText("[data-metric='subscribers']", items.length);
  }).catch(function () {
    list.innerHTML = '<div class="content-empty">Could not load subscribers.</div>';
  });
}
document.addEventListener("click", function (e) {
  var db = fsDb();
  if (!db) return;
  var del = e.target.closest("[data-sub-delete]");
  var refresh = e.target.closest("[data-subscribers-refresh]");
  if (del && window.confirm("Remove this subscriber?")) {
    db.collection("subscribers").doc(del.getAttribute("data-sub-delete")).delete().then(loadSubscribers);
  }
  if (refresh) loadSubscribers();
});

// Pull the live landing content from Firestore once the agency is signed in
// (writes need an authenticated session; reads/seeding then run as that user).
if (window.firebase && firebase.auth) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      fsLoadLanding();
      initEnquiries();
      initReviews();
      loadSubscribers();
    } else {
      // Session missing/expired — send back to the login gate.
      sessionStorage.removeItem("mosaique_admin_auth");
      window.location.replace("admin-login.html");
    }
  });
}
