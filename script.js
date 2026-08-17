/* ── Landing offers + categories, controlled from the agency admin ──
   Reads live from Cloud Firestore so the agency's edits appear for every
   visitor with no deploy. A localStorage cache gives an instant first paint
   (and keeps filters working), and the hard-coded HTML is the final fallback
   when there is neither cache nor cloud data. Runs first so rebuilt cards are
   captured by the filter + i18n logic below. */
(function () {
  var CACHE_KEY = "mosaique_journeys_cache_v3";
  // Fixed CTA label per language (the only static string on the card).
  var CTA = { en: "View this journey", ru: "Смотреть маршрут", de: "Reise ansehen", fr: "Voir ce voyage", es: "Ver este viaje", it: "Vedi il viaggio" };

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function currentLang() {
    try { return localStorage.getItem("mosaique_lang") || "en"; } catch (e) { return "en"; }
  }
  // Base fields are English; o.t[lang] holds per-language overrides.
  function pick(o, field, lang) {
    if (lang && lang !== "en" && o.t && o.t[lang] && o.t[lang][field]) return o.t[lang][field];
    return o[field] || "";
  }

  // Fallback journeys: shown until the agency publishes their own in Firestore.
  var JOURNEYS = [
    {
      id: "journey-essential", order: 0, offerVersion: 3, published: true, link: "#enquire",
      image: "assets/uz-registan.webp",
      duration: "9 Days",
      title: "Classic Uzbekistan",
      summary: "A relaxed private journey through Tashkent, Samarkand, Bukhara, and Khiva, combining guided discovery with time to explore each city at your own pace.",
      price: "2 guests: From €1,350 pp · 4 guests: From €1,050 pp",
      cities: ["Tashkent", "Samarkand", "Bukhara", "Khiva", "Tashkent"],
      highlights: [
        "Uzbekistan's four essential cities in one carefully paced journey",
        "Guided discovery in Tashkent, Samarkand, Bukhara, and Khiva",
        "High-speed rail between Tashkent, Samarkand, and Bukhara",
        "Domestic flights from Bukhara to Urgench and Urgench to Tashkent",
        "Free time for markets, cafés, workshops, and optional experiences"
      ],
      includes: ["3- to 4-star hotels in a double or twin room", "Daily breakfast", "Airport, railway station, and hotel transfers", "Private transportation", "English-speaking guide", "High-speed train tickets where specified", "Domestic flights where specified", "Entrance fees"],
      excludes: ["International flights", "Travel insurance", "Lunches and dinners unless specified", "Optional masterclasses and activities", "Personal expenses"],
      days: [
        { day: 1, title: "Arrival in Tashkent", body: "Welcome to Uzbekistan! Upon arrival at Tashkent International Airport, you will be met by your guide and transferred to your hotel. Depending on your arrival time, enjoy a guided introduction to the capital, discovering its blend of modern life, Soviet heritage, and traditional Uzbek culture. Overnight in Tashkent." },
        { day: 2, title: "Tashkent at Leisure → Samarkand", body: "Enjoy the day at your own pace. Visit museums, browse lively Chorsu Bazaar, relax in one of the city's cafés, or choose from optional experiences. In the evening, transfer to the railway station and board the high-speed train to Samarkand. Upon arrival, transfer to your hotel." },
        { day: 3, title: "Discover Samarkand", body: "Spend a full day exploring the legendary Silk Road city of Samarkand. Accompanied by your guide, discover its magnificent architectural masterpieces, historic neighborhoods, and vibrant atmosphere while learning about its remarkable history." },
        { day: 4, title: "Samarkand at Leisure", body: "Enjoy Samarkand at your own pace. Revisit your favorite monuments, wander through local markets, or relax in the city's charming cafés. Optional paper-making workshops, wine tasting, cooking classes, or countryside excursions can be arranged upon request." },
        { day: 5, title: "Samarkand → Bukhara", body: "After breakfast, transfer to the railway station for the high-speed train to Bukhara. Upon arrival, check in to your hotel before joining a guided afternoon walk through the UNESCO-listed Old Town. In the evening, enjoy dinner in one of Bukhara's atmospheric traditional restaurants." },
        { day: 6, title: "Explore Bukhara", body: "Continue discovering Bukhara during a half-day guided excursion through its historic monuments, trading domes, and picturesque alleyways. The afternoon is free for independent exploration, shopping, or simply soaking up the timeless atmosphere of this ancient city." },
        { day: 7, title: "Bukhara → Khiva", body: "Transfer to the airport for your domestic flight to Urgench. Upon arrival, continue to Khiva and begin your guided exploration of magnificent Ichan-Kala, one of the best-preserved medieval cities along the Silk Road. Overnight in Khiva." },
        { day: 8, title: "Khiva → Tashkent", body: "Enjoy a relaxed morning and walk through Khiva's quieter streets before transferring to Urgench Airport for your domestic flight to Tashkent. Upon arrival, transfer to your hotel and enjoy the rest of the day at leisure for shopping, independent sightseeing, or a farewell dinner." },
        { day: 9, title: "Departure", body: "After breakfast, transfer to Tashkent International Airport for your onward flight, marking the end of your unforgettable journey through the Silk Road cities of Uzbekistan." }
      ],
      t: {
        ru: { duration: "9 дней", title: "Классический Узбекистан", price: "2 гостя: от €1 350 · 4 гостя: от €1 050 с человека" },
        de: { duration: "9 Tage", title: "Klassisches Usbekistan", price: "2 Gäste: ab €1.350 · 4 Gäste: ab €1.050 p.P." },
        fr: { duration: "9 jours", title: "Ouzbékistan classique", price: "2 voyageurs : dès 1 350 € · 4 voyageurs : dès 1 050 € p.p." },
        es: { duration: "9 días", title: "Uzbekistán clásico", price: "2 viajeros: desde 1.350 € · 4 viajeros: desde 1.050 € p.p." },
        it: { duration: "9 giorni", title: "Uzbekistan classico", price: "2 ospiti: da €1.350 · 4 ospiti: da €1.050 p.p." }
      }
    },
    {
      id: "journey-desert", order: 1, offerVersion: 3, published: true, link: "#enquire",
      image: "assets/uz-kyzylkum-night.webp",
      duration: "11 Days",
      title: "Silk Road Cities & Desert Experience",
      summary: "An unhurried private journey through Uzbekistan's great Silk Road cities, extended with ancient Khorezm fortresses and a memorable night at Ayaz Kala Yurt Camp.",
      price: "2 guests: From €1,950 pp · 4 guests: From €1,650 pp",
      cities: ["Tashkent", "Samarkand", "Bukhara", "Khiva", "Ancient Khorezm Fortresses", "Ayaz Kala", "Tashkent"],
      highlights: [
        "Guided discovery and free time in Tashkent, Samarkand, Bukhara, and Khiva",
        "High-speed rail and domestic flights on the specified route",
        "Ancient Khorezm fortresses in the desert landscape",
        "Overnight at Ayaz Kala Yurt Camp with traditional dinner",
        "Optional camel ride and local folk entertainment"
      ],
      includes: ["3- to 4-star hotels in a double or twin room", "Daily breakfast", "Airport, railway station, and hotel transfers", "Private transportation", "English-speaking guide", "High-speed train tickets where specified", "Domestic flights where specified", "Entrance fees", "Ayaz Kala yurt stay and traditional dinner"],
      excludes: ["International flights", "Travel insurance", "Lunches and dinners unless specified", "Optional camel ride, folk entertainment, masterclasses, and activities", "Personal expenses"],
      days: [
        { day: 1, title: "Arrival in Tashkent", body: "Welcome to Uzbekistan! Upon arrival at Tashkent International Airport, you will be met by your guide and transferred to your hotel. Depending on your arrival time, begin with a guided introduction to the capital's modern avenues, Soviet architecture, bazaars, and historic quarters." },
        { day: 2, title: "Tashkent at Leisure → Samarkand", body: "Explore Tashkent independently at your own pace. Visit museums, stroll through parks, return to Chorsu Bazaar, or relax in one of the city's cafés. Optional excursions can be arranged. In the evening, transfer to the railway station for the high-speed train to Samarkand and transfer to your hotel on arrival." },
        { day: 3, title: "Samarkand", body: "Discover one of the great centers of the Silk Road with your guide, exploring magnificent architectural ensembles, vibrant squares, historic neighborhoods, and UNESCO World Heritage monuments while learning about the civilizations that shaped the city." },
        { day: 4, title: "Samarkand at Leisure", body: "Experience Samarkand at your own pace. Revisit favorite monuments, browse local markets, relax in traditional tea houses, or choose optional paper-making workshops, wine tasting, cooking masterclasses, village visits, or countryside excursions." },
        { day: 5, title: "Samarkand → Bukhara", body: "After breakfast, transfer to the railway station and travel by high-speed train to Bukhara. Check in to your hotel before a guided afternoon excursion through the historic center. In the evening, enjoy dinner in the atmospheric Old Town." },
        { day: 6, title: "Bukhara", body: "Continue exploring Bukhara during a half-day guided excursion through its monuments, trading domes, and historic quarters. The rest of the day is free for cafés, handicraft shops, a historic hammam, or independent exploration." },
        { day: 7, title: "Bukhara → Khiva", body: "Transfer to the airport for your domestic flight to Urgench. Continue to Khiva, check in, and begin a guided tour of UNESCO-listed Ichan-Kala, where preserved palaces, mosques, madrasas, and minarets evoke the golden age of the Silk Road." },
        { day: 8, title: "Khiva at Leisure", body: "Enjoy a shorter guided walk through some of Khiva's lesser-known corners before spending the rest of the day at leisure. Browse artisan workshops, discover hidden courtyards, climb the city walls, shop for handicrafts, or enjoy the peaceful old city." },
        { day: 9, title: "Khiva → Ancient Fortresses → Ayaz Kala Yurt Camp", body: "Journey into the landscapes of ancient Khorezm and explore the desert fortresses that once guarded the Silk Road. Continue to Ayaz Kala Yurt Camp for nomadic hospitality, with an optional camel ride, traditional dinner, optional local folk entertainment, and an evening beneath the desert sky." },
        { day: 10, title: "Ayaz Kala → Tashkent", body: "After a peaceful desert morning, transfer to Urgench Airport for your domestic flight to Tashkent. Transfer to your hotel and enjoy your final afternoon at leisure for shopping, independent sightseeing, or relaxation." },
        { day: 11, title: "Departure", body: "After breakfast, transfer to Tashkent International Airport for your onward flight, bringing your journey through the Silk Road cities and deserts of Uzbekistan to a close." }
      ],
      t: {
        ru: { duration: "11 дней", title: "Города Шёлкового пути и пустыня", price: "2 гостя: от €1 950 · 4 гостя: от €1 650 с человека" },
        de: { duration: "11 Tage", title: "Seidenstraßen-Städte & Wüstenerlebnis", price: "2 Gäste: ab €1.950 · 4 Gäste: ab €1.650 p.P." },
        fr: { duration: "11 jours", title: "Villes de la Route de la Soie & désert", price: "2 voyageurs : dès 1 950 € · 4 voyageurs : dès 1 650 € p.p." },
        es: { duration: "11 días", title: "Ciudades de la Ruta de la Seda y desierto", price: "2 viajeros: desde 1.950 € · 4 viajeros: desde 1.650 € p.p." },
        it: { duration: "11 giorni", title: "Città della Via della Seta e deserto", price: "2 ospiti: da €1.950 · 4 ospiti: da €1.650 p.p." }
      }
    },
    {
      id: "journey-complete", order: 2, offerVersion: 3, published: true, link: "#enquire",
      image: "assets/uz-chorminor.webp",
      duration: "14 Days",
      title: "Uzbekistan Grand Discovery",
      summary: "A comprehensive private journey combining Uzbekistan's Silk Road cities with the Fergana Valley, Shahrisabz, and an authentic village-life experience in Vobkent.",
      price: "2 guests: From €2,650 pp · 4 guests: From €2,250 pp",
      cities: ["Tashkent", "Kokand", "Fergana Valley", "Tashkent", "Samarkand", "Shahrisabz", "Samarkand", "Bukhara", "Vobkent", "Bukhara", "Khiva", "Tashkent"],
      highlights: [
        "Fergana Valley craft traditions, family workshops, and local markets",
        "Shahrisabz, birthplace of Amir Timur, as a day excursion from Samarkand",
        "Guided discovery and free time in Samarkand and Bukhara",
        "Village life, home-cooked cuisine, and an overnight stay in Vobkent",
        "UNESCO-listed Ichan-Kala in Khiva"
      ],
      includes: ["3- to 4-star hotels in a double or twin room", "Daily breakfast", "Airport, railway station, and hotel transfers", "Private transportation", "English-speaking guide", "Train tickets where specified", "Domestic flights where specified", "Entrance fees", "Vobkent village experience and overnight stay"],
      excludes: ["International flights", "Travel insurance", "Lunches and dinners unless specified", "Optional masterclasses and activities", "Personal expenses"],
      days: [
        { day: 1, title: "Arrival in Tashkent", body: "Welcome to Uzbekistan! Upon arrival at Tashkent International Airport, you will be met by your guide and transferred to your hotel. Depending on your arrival time, enjoy a guided introduction to the capital before settling in for the evening." },
        { day: 2, title: "Tashkent at Leisure", body: "Explore Tashkent at your own pace. Visit museums, browse local markets, relax in cafés, or choose from a selection of optional experiences. Overnight in Tashkent." },
        { day: 3, title: "Tashkent → Kokand → Fergana", body: "Transfer to the railway station and board the train to Kokand. Upon arrival, begin exploring the cultural heritage of the Fergana Valley before continuing by road through the valley's renowned craft centers to your hotel." },
        { day: 4, title: "Fergana Valley", body: "Spend the day discovering the traditions and craftsmanship of the Fergana Valley. Visit family-run workshops, bustling local markets, and artisan studios while experiencing one of Uzbekistan's most authentic regions." },
        { day: 5, title: "Fergana → Tashkent → Samarkand", body: "Return to Tashkent by train before boarding the high-speed train to Samarkand. Upon arrival, transfer to your hotel and enjoy the evening at leisure." },
        { day: 6, title: "Discover Samarkand", body: "Spend a full day exploring the legendary Silk Road city of Samarkand with its magnificent monuments, elegant squares, and remarkable architectural heritage." },
        { day: 7, title: "Shahrisabz Excursion", body: "Travel through scenic mountain landscapes to Shahrisabz, the birthplace of Amir Timur. Explore the city's historical treasures before returning to Samarkand for the evening." },
        { day: 8, title: "Samarkand at Leisure", body: "Enjoy a free day in Samarkand. Optional experiences such as traditional paper making, wine tasting, cooking classes, or countryside excursions can be arranged according to your interests." },
        { day: 9, title: "Samarkand → Bukhara", body: "Travel by high-speed train to Bukhara. Upon arrival, enjoy a guided afternoon tour through the UNESCO-listed Old Town before dinner in one of the city's traditional restaurants." },
        { day: 10, title: "Explore Bukhara", body: "Continue discovering Bukhara during a half-day guided excursion. The afternoon is free for independent exploration, shopping, or relaxing in one of the city's historic tea houses." },
        { day: 11, title: "Village Life Experience in Vobkent", body: "Leave the city behind and spend the day in the traditional village of Vobkent. Meet local families, discover everyday traditions, enjoy home-cooked Uzbek cuisine, and experience the warm hospitality that defines village life. Overnight in Vobkent." },
        { day: 12, title: "Bukhara → Khiva", body: "Transfer to the airport for your domestic flight to Urgench. Continue to Khiva and begin your guided exploration of remarkable UNESCO-listed Ichan-Kala." },
        { day: 13, title: "Khiva → Tashkent", body: "Enjoy a relaxed morning and a short guided walk through Khiva before transferring to Urgench Airport for your evening flight to Tashkent. Upon arrival, transfer to your hotel for your final overnight stay in Uzbekistan." },
        { day: 14, title: "Departure", body: "After breakfast, transfer to Tashkent International Airport for your onward flight, bringing your unforgettable journey through Uzbekistan to a close." }
      ],
      t: {
        ru: { duration: "14 дней", title: "Большое путешествие по Узбекистану", price: "2 гостя: от €2 650 · 4 гостя: от €2 250 с человека" },
        de: { duration: "14 Tage", title: "Die große Usbekistan-Entdeckungsreise", price: "2 Gäste: ab €2.650 · 4 Gäste: ab €2.250 p.P." },
        fr: { duration: "14 jours", title: "Grande découverte de l'Ouzbékistan", price: "2 voyageurs : dès 2 650 € · 4 voyageurs : dès 2 250 € p.p." },
        es: { duration: "14 días", title: "Gran descubrimiento de Uzbekistán", price: "2 viajeros: desde 2.650 € · 4 viajeros: desde 2.250 € p.p." },
        it: { duration: "14 giorni", title: "Grande scoperta dell'Uzbekistan", price: "2 ospiti: da €2.650 · 4 ospiti: da €2.250 p.p." }
      }
    }
  ];

  function journeyCard(o, lang) {
    var title = esc(pick(o, "title", lang));
    var summary = esc(pick(o, "summary", lang));
    var duration = esc(pick(o, "duration", lang));
    var price = esc(pick(o, "price", lang));
    var cta = esc(CTA[lang] || CTA.en);
    var href = "journey.html?id=" + encodeURIComponent(o.id || "");
    return '<a class="journey-itinerary" href="' + esc(href) + '" data-journey="' + title + '">' +
      '<img src="' + esc(o.image) + '" alt="' + title + '" loading="lazy" decoding="async">' +
      '<div class="journey-itinerary-body">' +
        '<span class="journey-duration">' + duration + '</span>' +
        '<h3>' + title + '</h3>' +
        '<p>' + summary + '</p>' +
        '<span class="journey-card-price">' + price + '</span>' +
        '<span class="journey-cta">' + cta + ' <em aria-hidden="true">→</em></span>' +
      '</div></a>';
  }

  var data = JOURNEYS.slice();

  var grid = document.querySelector(".journey-grid");
  if (!grid) {
    // On journey.html there is no grid. Seed cache with fallback so journey.js
    // can render without a prior homepage visit. Re-seed if existing cache is
    // missing days/highlights (stale data from before this feature shipped).
    try {
      var _c = JSON.parse(localStorage.getItem(CACHE_KEY));
      var _stale = !Array.isArray(_c) || !_c.length ||
        _c.some(function (j) { return !j.days || !j.days.length || !j.highlights || !j.highlights.length; });
      if (_stale) localStorage.setItem(CACHE_KEY, JSON.stringify(JOURNEYS));
    } catch (e) { try { localStorage.setItem(CACHE_KEY, JSON.stringify(JOURNEYS)); } catch (_) {} }
    return;
  }

  function render() {
    var lang = currentLang();
    grid.innerHTML = data.map(function (o) { return journeyCard(o, lang); }).join("");
  }

  // Instant paint from the last cached snapshot, then render.
  try {
    var cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (Array.isArray(cached) && cached.length) data = cached;
  } catch (e) {}
  render();

  // Live updates from Firestore (public read): the agency's own journeys.
  if (window.firebase && firebase.firestore) {
    try {
      var db = firebase.firestore();
      db.collection("journeys").orderBy("order").onSnapshot(function (snap) {
        var list = [];
        snap.forEach(function (d) { var j = d.data(); if (j && j.published) list.push(j); });
        var currentOffer = list.length === JOURNEYS.length &&
          list.every(function (j) { return Number(j.offerVersion || 0) >= 3; });
        if (currentOffer) {
          data = list;
          try { localStorage.setItem(CACHE_KEY, JSON.stringify(list)); } catch (e) {}
          render();
        }
      }, function () {});
    } catch (e) {}
  }

  // Re-render in the new language whenever the switcher changes it.
  document.addEventListener("mosaique:lang", render);

  // Clicking a journey stores the title in localStorage so the enquiry form
  // on the homepage can prefill when the user returns from the detail page.
  grid.addEventListener("click", function (e) {
    var card = e.target.closest(".journey-itinerary");
    if (!card) return;
    var journey = card.getAttribute("data-journey");
    if (journey) {
      try { localStorage.setItem("mosaique_enquiry_journey", journey); } catch (ex) {}
    }
  });
})();

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const filterButtons = document.querySelectorAll("[data-filter]");
const journeyCards = document.querySelectorAll("[data-type]");
const animatedItems = document.querySelectorAll("[data-animate]");
const hero = document.querySelector(".hero");
const heroVideo = document.querySelector(".hero-video");
const scrollCue = document.querySelector(".scroll-cue");
const feelingSection = document.querySelector("#feeling");
const uzbekistanMap = document.querySelector(".uzbekistan-map");
const mapPins = document.querySelectorAll("[data-map-place]");
const placeModal = document.querySelector("[data-place-modal]");
const placeCloseButtons = document.querySelectorAll("[data-place-close]");
const placeImage = document.querySelector("[data-place-image]");
const placeKicker = document.querySelector("[data-place-kicker]");
const placeTitle = document.querySelector("[data-place-title]");
const placeDescription = document.querySelector("[data-place-description]");
const placeWhy = document.querySelector("[data-place-why]");
const placeFeel = document.querySelector("[data-place-feel]");
const placeFit = document.querySelector("[data-place-fit]");
const placeSite = document.querySelector("[data-place-site]");
const placeRoute = document.querySelector("[data-place-route]");
const placeHighlights = document.querySelector("[data-place-highlights]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let lastFocusedPlacePin = null;
let heroSnapInProgress = false;
let heroTouchStartY = null;

const placeDetails = {
  tashkent: {
    title: "Tashkent",
    kicker: "Easy city start",
    image: "assets/chapter-samarkand.jpg",
    imageAlt: "Decorative Uzbekistan architecture used for Tashkent travel planning",
    description:
      "Tashkent is the easiest place to begin or end the journey. It gives guests a softer arrival day before the historic cities.",
    route: "Arrival city, final night, or easier city start.",
    highlights: ["Tashkent Metro", "Chorsu Bazaar", "Applied Arts Museum"],
    why: "Markets, metro stations, museums, restaurants, and practical airport access.",
    feel: "Modern, spacious, and flexible. Good when guests want fewer monuments on the first day.",
    fit: "Best for arrival night, final shopping, or a gentle first introduction to Uzbekistan.",
  },
  samarkand: {
    title: "Samarkand",
    kicker: "Classic Silk Road",
    image: "assets/chapter-samarkand.jpg",
    imageAlt: "Blue tilework and historic architecture in Samarkand",
    description:
      "Samarkand is the grand visual highlight for many first-time visitors, with monumental Timurid architecture and major Silk Road history.",
    route: "Core stop for almost every first Uzbekistan itinerary.",
    highlights: ["Registan Square", "Shah-i-Zinda", "Gur-e-Amir"],
    why: "Registan, Shah-i-Zinda, Gur-e-Amir, Bibi-Khanym, and the feeling of a true crossroads city.",
    feel: "Impressive and active, but easy to pace with private guiding and breaks between sites.",
    fit: "Essential for most 7-10 day Uzbekistan routes.",
  },
  bukhara: {
    title: "Bukhara",
    kicker: "Walkable old city",
    image: "assets/chapter-bukhara.jpg",
    imageAlt: "Historic domed architecture in Bukhara",
    description:
      "Bukhara feels slower and more intimate than Samarkand. The old city works well for guests who like atmosphere, courtyards, and craft.",
    route: "Walkable old-city stay between Samarkand and Khiva.",
    highlights: ["Minaret Kalon", "Trading Domes", "Chor Minor"],
    why: "Po-i-Kalon, trading domes, Lyabi-Hauz, madrasas, tea houses, and artisan workshops.",
    feel: "Comfortable, atmospheric, and good for shorter walks with cafe stops.",
    fit: "A core stop on classic Silk Road itineraries.",
  },
  khiva: {
    title: "Khiva",
    kicker: "Walled old city",
    image: "assets/chapter-khiva.jpg",
    imageAlt: "Ancient walls and narrow streets in Khiva",
    description:
      "Khiva is compact and memorable: a fortified old city where the main experience is walking through gates, lanes, minarets, and courtyards.",
    route: "Historic extension after Bukhara with short walks.",
    highlights: ["Itchan Kala", "Kalta Minor", "Juma Mosque"],
    why: "Itchan Kala, city walls, Kalta Minor, Juma Mosque, quiet rooftops, and golden-hour views.",
    feel: "Small-scale and photogenic, with short distances inside the old city.",
    fit: "Best as a 2-3 day extension after Bukhara.",
  },
  shahrisabz: {
    title: "Shahrisabz",
    kicker: "Timur heritage",
    image: "assets/chapter-samarkand.jpg",
    imageAlt: "Historic tile detail in Uzbekistan",
    description:
      "Shahrisabz is a useful cultural extension from Samarkand for travellers interested in Amir Timur and regional history.",
    route: "Day trip or extra history stop from Samarkand.",
    highlights: ["Ak-Saray Palace", "Dorut Tilavat", "Dorus Saodat"],
    why: "Ak-Saray Palace remains, Dorut Tilavat, Dorus Saodat, and a quieter town rhythm.",
    feel: "More local and less polished, with some driving and open-air sightseeing.",
    fit: "Good as a day trip from Samarkand for guests who want deeper history.",
  },
  fergana: {
    title: "Fergana Valley",
    kicker: "Craft extension",
    image: "assets/chapter-bukhara.jpg",
    imageAlt: "Uzbekistan architecture representing regional craft routes",
    description:
      "The Fergana Valley is for travellers who want living craft, silk, ceramics, markets, and a greener regional contrast.",
    route: "Craft-focused extension when guests have extra days.",
    highlights: ["Margilan Silk Workshops", "Rishtan Ceramics", "Kokand Palace"],
    why: "Margilan silk, Rishtan ceramics, Kokand heritage, local markets, and family workshops.",
    feel: "More local and craft-focused. It needs extra time and careful routing.",
    fit: "Best for a custom itinerary after the classic cities.",
  },
  nukus: {
    title: "Nukus & Aral Sea region",
    kicker: "Remote extension",
    image: "assets/chapter-desert.jpg",
    imageAlt: "Open desert landscape in Uzbekistan",
    description:
      "Nukus and the Aral Sea region add a very different side of Uzbekistan: desert landscapes, avant-garde art, and environmental history.",
    route: "Remote extension for art, desert, and Aral Sea context.",
    highlights: ["Savitsky Museum", "Desert Fortresses", "Aral Sea Region"],
    why: "Savitsky Museum, Karakalpak culture, desert fortresses, and optional Aral Sea routes.",
    feel: "Remote, spacious, and more driving-heavy than the classic route.",
    fit: "Best for curious travellers with extra days and interest in art or landscapes.",
  },
};

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

function getHeaderOffset() {
  return header?.getBoundingClientRect().height ?? 0;
}

function canSnapFromHero() {
  if (!hero || !feelingSection || heroSnapInProgress) return false;
  if (document.body.classList.contains("nav-open")) return false;
  if (placeModal && !placeModal.hidden) return false;

  const headerOffset = getHeaderOffset();
  const sectionTop = feelingSection.getBoundingClientRect().top;
  const heroBottom = hero.getBoundingClientRect().bottom;

  return sectionTop > headerOffset + 24 && heroBottom > window.innerHeight * 0.35;
}

function snapToFeelingSection() {
  if (!feelingSection || heroSnapInProgress) return;

  heroSnapInProgress = true;
  const top = feelingSection.getBoundingClientRect().top + window.scrollY - getHeaderOffset();

  window.scrollTo({
    top,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });

  window.setTimeout(() => {
    heroSnapInProgress = false;
  }, prefersReducedMotion ? 120 : 950);
}

window.addEventListener(
  "wheel",
  (event) => {
    if (event.deltaY <= 8 || !canSnapFromHero()) return;
    event.preventDefault();
    snapToFeelingSection();
  },
  { passive: false },
);

window.addEventListener(
  "touchstart",
  (event) => {
    heroTouchStartY = event.touches[0]?.clientY ?? null;
  },
  { passive: true },
);

window.addEventListener(
  "touchmove",
  (event) => {
    if (heroTouchStartY === null) return;

    const currentY = event.touches[0]?.clientY ?? heroTouchStartY;
    const swipeDistance = heroTouchStartY - currentY;
    if (swipeDistance <= 22 || !canSnapFromHero()) return;

    event.preventDefault();
    heroTouchStartY = null;
    snapToFeelingSection();
  },
  { passive: false },
);

window.addEventListener(
  "touchend",
  () => {
    heroTouchStartY = null;
  },
  { passive: true },
);

scrollCue?.addEventListener("click", (event) => {
  event.preventDefault();
  snapToFeelingSection();
});

// Premium word-by-word reveal: wrap each word of the philosophy heading
const philHeading = document.querySelector(".philosophy .intro-grid h2");
if (philHeading && !prefersReducedMotion) {
  const words = philHeading.textContent.trim().split(/\s+/);
  philHeading.innerHTML = words
    .map((w) => `<span class="word"><span class="word-inner">${w}</span></span>`)
    .join(" ");
}

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  document.body.classList.add("animations-ready");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -10% 0px",
    },
  );

  animatedItems.forEach((item) => revealObserver.observe(item));
} else {
  animatedItems.forEach((item) => item.classList.add("is-visible"));
  if (heroVideo) {
    heroVideo.pause();
  }
}

if (menuToggle && nav && header) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    header.classList.toggle("nav-open", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  nav.addEventListener("click", (e) => {
    // On mobile the mega-menu triggers open sub-panels; closing the whole nav on
    // any click made those sub-links unreachable. Only close when an actual link
    // is tapped, never when opening a category panel.
    if (e.target.closest("[data-mega-trigger]")) return;
    if (!e.target.closest("a")) return;
    nav.classList.remove("is-open");
    header.classList.remove("nav-open");
    document.body.classList.remove("nav-open");
    menuToggle.setAttribute("aria-label", "Open navigation");
  });
}

// (The destination filter tabs were removed when the homepage switched to the
// 3 itinerary "journeys"; the old filter handler and its .journey-card queries
// are no longer needed.)

function updatePlaceModal(place, selectedSite) {
  if (!placeModal || !place) return;
  placeKicker.textContent = place.kicker;
  placeTitle.textContent = place.title;
  placeDescription.textContent = place.description;
  placeWhy.textContent = place.why;
  placeFeel.textContent = place.feel;
  placeFit.textContent = place.fit;
  if (placeSite) {
    placeSite.textContent = selectedSite || place.highlights?.[0] || place.title;
  }
  if (placeRoute) {
    placeRoute.textContent = place.route || "Private route planning";
  }
  if (placeHighlights) {
    placeHighlights.replaceChildren();
    (place.highlights || []).forEach((highlight) => {
      const item = document.createElement("li");
      item.textContent = highlight;
      placeHighlights.append(item);
    });
  }
  placeImage.src = place.image;
  placeImage.alt = place.imageAlt;
}

function openPlaceModal(placeKey, trigger) {
  const place = placeDetails[placeKey];
  if (!placeModal || !place) return;

  lastFocusedPlacePin = trigger;
  updatePlaceModal(place, trigger?.dataset.siteName);
  mapPins.forEach((pin) => pin.classList.toggle("is-active", pin === trigger));
  placeModal.hidden = false;
  document.body.classList.add("modal-open");

  const closeButton = placeModal.querySelector(".place-close");
  closeButton?.focus();
}

function closePlaceModal() {
  if (!placeModal || placeModal.hidden) return;

  placeModal.hidden = true;
  document.body.classList.remove("modal-open");
  mapPins.forEach((pin) => pin.classList.remove("is-active"));
  lastFocusedPlacePin?.focus();
}

uzbekistanMap?.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-map-place]");
  if (!trigger || !uzbekistanMap.contains(trigger)) return;

  openPlaceModal(trigger.dataset.mapPlace, trigger);
});

placeCloseButtons.forEach((button) => {
  button.addEventListener("click", closePlaceModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closePlaceModal();
  }
});

// ── Mega-menu ────────────────────────────────────────────────────
const megaTriggers = document.querySelectorAll("[data-mega-trigger]");
function closeAllMega(except) {
  megaTriggers.forEach((btn) => {
    const key = btn.getAttribute("data-mega-trigger");
    const panel = document.querySelector(`[data-mega-panel="${key}"]`);
    if (btn === except) return;
    btn.setAttribute("aria-expanded", "false");
    if (panel) panel.hidden = true;
  });
}
megaTriggers.forEach((btn) => {
  const key = btn.getAttribute("data-mega-trigger");
  const panel = document.querySelector(`[data-mega-panel="${key}"]`);
  const open = () => { closeAllMega(btn); btn.setAttribute("aria-expanded", "true"); if (panel) panel.hidden = false; };
  const close = () => { btn.setAttribute("aria-expanded", "false"); if (panel) panel.hidden = true; };
  btn.addEventListener("click", () => (btn.getAttribute("aria-expanded") === "true" ? close() : open()));
  const item = btn.closest(".mega-item");
  let closeTimer = null;
  item?.addEventListener("mouseenter", () => { clearTimeout(closeTimer); open(); });
  item?.addEventListener("mouseleave", () => { clearTimeout(closeTimer); closeTimer = setTimeout(close, 180); });
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".mega-item")) closeAllMega(null);
});
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeAllMega(null); });

// Founders film: open the YouTube film in a lightbox
const filmTriggers = document.querySelectorAll("[data-video-play]");
if (filmTriggers.length) {
  let overlay = null;
  const closeFilm = () => {
    if (!overlay) return;
    overlay.remove();
    overlay = null;
    document.body.classList.remove("modal-open");
  };
  const openFilm = (id) => {
    closeFilm();
    overlay = document.createElement("div");
    overlay.className = "film-modal";
    overlay.innerHTML =
      '<div class="film-modal-inner">' +
      '<button class="film-close" type="button" aria-label="Close film">×</button>' +
      '<div class="film-frame"><iframe src="https://www.youtube-nocookie.com/embed/' +
      id +
      '?autoplay=1&rel=0" title="The Mosaique film" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>' +
      "</div>";
    document.body.appendChild(overlay);
    document.body.classList.add("modal-open");
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay || event.target.classList.contains("film-close")) closeFilm();
    });
  };
  filmTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openFilm(trigger.getAttribute("data-youtube") || "GEVpE2GJO5Y");
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeFilm();
  });
}

/* ── FAQ accordion: open one at a time ─────────────────────────── */
(function () {
  var faq = document.querySelector("[data-faq]");
  if (!faq) return;
  faq.addEventListener("toggle", function (event) {
    var item = event.target;
    if (item.tagName !== "DETAILS" || !item.open) return;
    faq.querySelectorAll("details[open]").forEach(function (other) {
      if (other !== item) other.open = false;
    });
  }, true);

  // Collapse to the 5 most popular questions with a "show all" toggle.
  // JS-gated so no-JS visitors always see the full list.
  var items = faq.querySelectorAll(".faq-item");
  if (items.length > 5) {
    faq.classList.add("faq-collapsed");
    var moreBtn = document.createElement("button");
    moreBtn.type = "button";
    moreBtn.className = "faq-more";
    var setLabel = function () {
      var collapsed = faq.classList.contains("faq-collapsed");
      var label = collapsed ? "Show all questions" : "Show fewer questions";
      moreBtn.setAttribute("data-i18n", collapsed ? "faq.more" : "faq.less");
      // Keep the i18n EN cache in sync or __retranslate restores the old label
      moreBtn.setAttribute("data-en", label);
      moreBtn.textContent = label;
      if (typeof window.__retranslate === "function") window.__retranslate();
    };
    moreBtn.addEventListener("click", function () {
      faq.classList.toggle("faq-collapsed");
      setLabel();
    });
    faq.after(moreBtn);
    setLabel();
  }
})();

/* ── Internationalisation (EN base + RU/DE/FR/ES/IT) ───────────── */
const I18N = {
  ru: {
    "gal.nav":"Галерея","gal.kicker":"В кадре","gal.title":"Узбекистан, каким мы его увидели","gal.more":"Показать ещё",
    "nav.destinations":"Направления","nav.cities":"Города и регионы","nav.experiences":"Впечатления","nav.who":"Для кого","nav.what":"Что","nav.inspiration":"Вдохновение","nav.plan":"Планирование","nav.about":"О нас","nav.mission":"Наша миссия","mission.heading":"Что нами движет","mission.story":"Наша история","mission.feeling":"В поисках чувства","mission.approach":"Наш подход","mission.why":"Почему Mosaique","nav.mosaique":"Mosaique",
    "exp.couples":"Для пар","exp.families":"Для семей","exp.groups":"Для групп","exp.honeymoons":"Медовый месяц","exp.solo":"В одиночку","exp.cultural":"Культура","exp.desert":"Пустыня","exp.slow":"Неспешные путешествия","exp.food":"Гастрономия","exp.craft":"Ремёсла","exp.adventure":"Приключения",
    "insp.bymonth":"По месяцам","insp.guides":"Гиды","insp.stories":"Истории","insp.itineraries":"Маршруты","insp.journal":"Журнал",
    "about.story":"Наша история","about.team":"Команда","about.why":"Почему Mosaique","about.journeys":"Путешествия","nav.pricing":"Цены","nav.faq":"Вопросы и ответы",
    "cta.enquire":"Оставить заявку",
    "hero.eyebrow":"Частные путешествия по Узбекистану","hero.title":"Где встречаются культуры","hero.copy":"Туры под ключ, местная экспертиза и безупречный сервис на всём Шёлковом пути.","hero.explore":"Смотреть туры",
    "news.signup":"Подпишитесь на истории и идеи путешествий по Шёлковому пути","news.button":"Подписаться","form.email":"Ваш email",
    "phil.kicker":"Путь Mosaique","phil.title":"Каждое путешествие начинается с чувства","phil.body":"Прежде чем забронировать первый рейс, мы прислушиваемся к чувству, которое вы ищете: тишине изразцового двора на рассвете, теплу общего плова, бескрайности Кызылкума на закате. Больше десяти лет мы превращаем эти чувства в частные путешествия с опытными гидами по Шёлковому пути.","phil.cta":"Начать планирование",
    "faq.more":"Показать все вопросы","faq.less":"Показать меньше",
    "faq.kicker":"Полезно знать","faq.title":"Часто задаваемые вопросы","faq.q1":"Безопасно ли в Узбекистане?","faq.a1":"Да. Узбекистан считается одним из самых безопасных направлений Центральной Азии и славится тёплым гостеприимством. Путешественники чувствуют себя комфортно как самостоятельно, так и с гидом. Как и везде, рекомендуем соблюдать обычные меры предосторожности и следить за личными вещами в людных местах.","faq.q2":"Нужна ли виза?","faq.a2":"Визовые требования зависят от вашего гражданства. Граждане многих стран могут въезжать в Узбекистан без визы на определённый срок, для других действует электронная виза. Мы подскажем требования для вашего паспорта и поможем с необходимой информацией перед поездкой.","faq.q3":"Когда лучше всего ехать в Узбекистан?","faq.a3":"Узбекистан прекрасен круглый год, и каждый сезон даёт свои впечатления. Весна (март–май): мягкая погода, цветущие пейзажи, идеальное время для экскурсий. Лето (июнь–август): жарко и солнечно, длинные дни. Осень (сентябрь–ноябрь): приятная температура, яркие краски, сезон урожая. Зима (декабрь–февраль): меньше туристов, праздничная атмосфера и горные курорты поблизости.","faq.q4":"Какая там погода?","faq.a4":"В Узбекистане континентальный климат: жаркое лето и прохладная зима. Весна: 15–30°C. Лето: 30–46°C. Осень: 15–30°C. Зима: от −5 до 10°C в зависимости от региона. Погода различается в пустыне, долинах и горах, поэтому перед поездкой мы даём персональные рекомендации по сборам.","faq.q5":"Что взять из одежды?","faq.a5":"Рекомендуем удобную одежду и обувь для ходьбы: многие исторические места осматриваются пешком. В тёплые месяцы подойдёт лёгкая дышащая одежда и лёгкая куртка на прохладные вечера весной и осенью; зимой: тёплые слои и пальто. Строгого дресс-кода для туристов нет, но в религиозных местах ценится скромная одежда: обычно достаточно прикрыть плечи и колени.","faq.q6":"Можно ли изменить любой маршрут?","faq.a6":"Конечно. Каждое наше путешествие создаётся индивидуально. Направления, темп, категория отелей, активности, транспорт и культурные впечатления настраиваются под ваши интересы, график и бюджет.","faq.q7":"Подходят ли поездки для соло-путешественников?","faq.a7":"Разумеется. Мы создаём персональные маршруты для одиночных путешественников, пар, семей и частных групп. Культура, фотография, гастрономия или приключения: маршрут будет соответствовать вашему стилю.","faq.q8":"Учитываются ли особенности питания?","faq.a8":"Да. Вегетарианское, веганское, безглютеновое, халяльное питание и аллергии, как правило, можно учесть. Сообщите нам о своих требованиях заранее, и мы всё организуем на протяжении всей поездки.","faq.q9":"На каких языках говорят ваши гиды?","faq.a9":"Наши гиды свободно говорят по-английски; по запросу и при наличии можно организовать гидов с французским, немецким, испанским, итальянским, русским, японским, корейским, китайским, турецким и другими языками.","faq.q10":"Какая валюта в Узбекистане?","faq.a10":"Официальная валюта: узбекский сум (UZS). Евро, доллары США и фунты легко обменять в банках, отелях и официальных обменных пунктах. Visa и Mastercard принимают многие отели, рестораны и крупные магазины, но для базаров и небольших заведений лучше иметь наличные.","faq.q11":"Можно ли расплачиваться картой?","faq.a11":"Да. Кредитные и дебетовые карты широко принимаются в крупных городах, отелях и многих ресторанах. При посещении небольших городов, базаров и сельской местности рекомендуем иметь немного наличных.","faq.q12":"Как мы будем перемещаться между городами?","faq.a12":"В Узбекистане отличная транспортная сеть. В зависимости от маршрута это может быть современный скоростной поезд, внутренние перелёты или комфортные частные автомобили с профессиональными водителями. Мы выбираем самый удобный вариант для каждого участка пути.","faq.q13":"Включён ли трансфер из аэропорта?","faq.a13":"Да. Во все наши путешествия включены трансферы из аэропорта, с вокзала и в отель: спокойное путешествие от прилёта до вылета.","faq.q14":"Почему индивидуальное путешествие, а не стандартный тур?","faq.a14":"В отличие от групповых туров, наши маршруты создаются исключительно для вас: с учётом интересов, темпа, расписания рейсов, стиля проживания и бюджета. Так вы увидите Узбекистан более личным, гибким и осмысленным образом, без жёсткого группового графика.",
    "jr.kicker":"Найдите своё путешествие","jr.title":"Начните свою историю Шёлкового пути","jr.tab.traveller":"По типу путешественника","jr.tab.popular":"Популярные","jr.tab.month":"По месяцам","jr.tab.spotlight":"В центре внимания","jr.for":"Путешествия для","jr.dest":"Направление","jr.tab.all":"Все","jr.tab.cities":"Города","jr.tab.nature":"Пустыня и долины","dest.samarkand":"Самарканд","dest.bukhara":"Бухара","dest.khiva":"Хива","dest.tashkent":"Ташкент","dest.shahrisabz":"Шахрисабз","dest.fergana":"Ферганская долина","dest.kyzylkum":"Кызылкум","card.couples":"Неспешные, личные путешествия по Шёлковому пути","card.families":"Чудеса для всех поколений","card.groups":"Частные туры с экспертом для немногих","card.honeymoons":"Только вы вдвоём, незабываемо","card.solo":"Путешествуйте в одиночку, но не в одиночестве",
    "trips.title":"Откройте наши путешествия","trips.lead":"Знаковые маршруты, чтобы вдохновить воображение.","trips.days10":"10 дней","trips.days5":"5 дней","trips.days4":"4 дня","trips.days3":"3 дня","trips.t1":"Дорога Регистана","trips.t2":"Бухара и ремёсла","trips.t3":"Стены Хивы","trips.t4":"Кызылкум под звёздами","trips.p1":"от €4 950 / чел.","trips.p2":"от €2 650 / чел.","trips.p3":"от €2 150 / чел.","trips.p4":"от €1 750 / чел.","trips.explore":"Подробнее",
    "press.kicker":"Признание","press.award":"Премия за ответственный туризм","press.bespoke":"Специалист по индивидуальным турам","press.expertise":"Экспертиза Шёлкового пути","press.rated":"Оценка путешественников 5 звёзд",
    "feature.kicker":"Знаковое путешествие","feature.title":"Ночи под звёздами Кызылкума","feature.body":"Флагманский побег в тишину пустыни: юрточные лагеря, верблюжьи тропы и небо, не затенённое городами.","feature.cta":"Узнать о путешествии",
    "founders.kicker":"Что мы делаем и почему","founders.title":"Создано, чтобы делиться любимым Шёлковым путём","founders.body":"Mosaique начался с двух друзей, которые снова и снова возвращались в Узбекистан и хотели показать его таким, каким узнали сами: через людей, ремёсла и тихие мгновения между памятниками.","founders.watch":"► Смотреть фильм",
    "pursuit.kicker":"В поисках чувства","pursuit.title":"Путешествие, которое трогает, а не просто перевозит","pursuit.body":"Доставить из точки А в точку Б может каждый. Мы создаём момент, когда расслабляются плечи и место завладевает вами: призыв к молитве над Бухарой, прохлада двора медресе, чай, налитый тем, кто уже знает ваше имя.","pursuit.cta":"Открыть коллекцию",
    "guide.kicker":"Наш гид по Шёлковому пути","guide.title":"Шёлковый путь, сделанный правильно","guide.body":"Роскошь здесь: это не мрамор и золото. Это личный гид, чувствующий ваш ритм, гостевой двор, забронированный целиком, стол, накрытый в историческом караван-сарае. Мы подстраиваем каждый день под ваш стиль путешествия и идём на шаг впереди, чтобы вы не чувствовали логистику.","guide.cta":"Читать далее",
    "why.kicker":"Почему Mosaique","why.title":"Спланировано экспертами, забота на каждом шаге","why.c1":"Признанные планировщики","why.c1d":"Специалисты, постоянно путешествующие по Узбекистану.","why.c2":"Предложение без обязательств","why.c2d":"Индивидуальное предложение до того, как вы решитесь.","why.c3":"Без платы за планирование","why.c3d":"Вы платите за путешествие, а не за бумаги.","why.c4":"Поддержка 24/7 на месте","why.c4d":"Местная команда на связи всю поездку.","why.c5":"Частные гиды-эксперты","why.c5d":"Тщательно отобранные гиды, открывающие настоящие двери.","why.reviews":"★★★★★ Высокая оценка путешественников по всему Шёлковому пути",
    "ctaSec.title":"Готовы начать своё путешествие?","ctaSec.body":"Расскажите, какое чувство вы ищете, а остальное мы спроектируем.","ctaSec.button":"Связаться с нами",
    "cert.iata":"Аккредитация IATA","cert.assoc":"Ассоциация индивидуального туризма","cert.carbon":"Путешествия с заботой об экологии",
    "foot.expert":"Поговорить с экспертом","foot.touch":"Связаться с нами","foot.story":"Наша история","foot.useful":"Полезная информация","foot.guide":"Путеводитель","foot.admin":"Админ","foot.privacy":"Политика конфиденциальности","foot.destinations":"Направления","foot.experiences":"Впечатления","foot.stay":"Оставайтесь на связи","foot.subscribe":"Подписаться","foot.tagline":"Mosaique Journeys · Частные путешествия по Шёлковому пути · mosaiquejourneys@gmail.com","foot.rights":"© 2026 Mosaique Journeys. Все права защищены.","fb.kicker":"Отзывы гостей","fb.title":"Поделитесь впечатлениями","fb.lead":"Путешествовали с нами? Расскажите будущим гостям, каким было ваше путешествие.","fb.name":"Ваше имя","fb.namePh":"например, Элиза из Парижа","fb.rating":"Ваша оценка","fb.message":"Ваш отзыв","fb.messagePh":"Что сделало ваше путешествие незабываемым?","fb.submit":"Отправить отзыв","fb.thanks":"Спасибо! Ваш отзыв опубликован.","fb.recent":"Недавние отзывы","price.kicker":"Прозрачные цены","price.title":"Индивидуальные путешествия от €1 320 на человека","price.lead":"Это стартовая цена пакета Standard. Поскольку каждое путешествие индивидуально, итоговая стоимость зависит от продолжительности поездки, числа путешественников, сезона, категории отелей, транспорта и выбранных впечатлений.","price.incTitle":"В стартовую цену входит","price.inc1":"Весь транспорт по Узбекистану, включая скоростной поезд и внутренние перелёты при необходимости","price.inc2":"Комфортные отели 3–5 звёзд с ежедневным завтраком","price.inc3":"Частные трансферы из аэропорта, вокзала и в отели","price.inc4":"Профессиональные гиды","price.inc5":"Входные билеты во все памятники и музеи по маршруту","price.inc6":"Планирование поездки и поддержка","price.exTitle":"Не включено","price.ex1":"Международные авиабилеты","price.ex2":"Туристическая страховка","price.ex3":"Визовые сборы (если применимо)","price.ex4":"Обеды и ужины, если не указано иное","price.ex5":"Личные расходы","price.consult":"Прежде чем вы примете решение, мы предлагаем бесплатную персональную консультацию: обсуждаем ваши интересы, стиль путешествия и ожидания, затем составляем индивидуальный маршрут и прозрачную смету без скрытых расходов.","price.cta":"Запросить бесплатную консультацию","enq.name":"Ваше имя *","enq.email":"Эл. почта *","enq.dates":"Когда и на сколько","enq.party":"Путешественники","enq.dest":"Куда и интересы","enq.msg":"Расскажите о вашей поездке *","enq.send":"Отправить запрос","enq.privacy":"Мы используем ваши данные только для планирования поездки. Никакого спама.","enq.datesPh":"напр., май 2027, 10 дней","enq.partyPh":"напр., 2 взрослых","enq.destPh":"Самарканд, Бухара, кухня, ремёсла…","jd.highlights":"Основные впечатления","jd.itinerary":"День за днём","jd.included":"Что входит","jd.excluded":"Что не входит","jd.route":"Ваш маршрут","jd.ctaTitle":"Готовы начать своё путешествие?","jd.ctaBody":"Расскажите, какое чувство вы ищете: и мы спроектируем остальное.","jd.back":"← Все путешествия"
  },
  de: {
    "gal.nav":"Galerie","gal.kicker":"Im Bild","gal.title":"Usbekistan, wie wir es vorfanden","gal.more":"Mehr anzeigen",
    "nav.destinations":"Reiseziele","nav.cities":"Städte & Regionen","nav.experiences":"Erlebnisse","nav.who":"Für wen","nav.what":"Was","nav.inspiration":"Inspiration","nav.plan":"Planen & entdecken","nav.about":"Über uns","nav.mission":"Unsere Mission","mission.heading":"Was uns antreibt","mission.story":"Unsere Geschichte","mission.feeling":"Das Streben nach Gefühl","mission.approach":"Unser Ansatz","mission.why":"Warum Mosaique","nav.mosaique":"Mosaique",
    "exp.couples":"Paare","exp.families":"Familien","exp.groups":"Gruppen","exp.honeymoons":"Flitterwochen","exp.solo":"Alleinreisende","exp.cultural":"Kultur","exp.desert":"Wüste","exp.slow":"Slow Travel","exp.food":"Kulinarik","exp.craft":"Handwerk & Kunsthandwerker","exp.adventure":"Abenteuer",
    "insp.bymonth":"Nach Monat","insp.guides":"Reiseführer","insp.stories":"Geschichten","insp.itineraries":"Reiserouten","insp.journal":"Journal",
    "about.story":"Unsere Geschichte","about.team":"Team","about.why":"Warum Mosaique","about.journeys":"Reisen","nav.pricing":"Preise","nav.faq":"Häufige Fragen",
    "cta.enquire":"Jetzt anfragen",
    "hero.eyebrow":"Private Reisen durch Usbekistan","hero.title":"Wo Kulturen sich begegnen","hero.copy":"Maßgeschneiderte Reisen, lokale Expertise und außergewöhnlicher Service entlang der Seidenstraße.","hero.explore":"Reisen entdecken",
    "news.signup":"Abonnieren Sie Geschichten & Reiseideen von der Seidenstraße","news.button":"Anmelden","form.email":"Ihre E-Mail",
    "phil.kicker":"Die Mosaique-Art","phil.title":"Jede Reise beginnt mit einem Gefühl","phil.body":"Bevor der erste Flug gebucht wird, hören wir auf das Gefühl, das Sie suchen: die Stille eines gefliesten Innenhofs im Morgengrauen, die Wärme eines geteilten Plov, die Weite der Kysylkum in der Abenddämmerung. Seit über einem Jahrzehnt verwandeln wir diese Gefühle in private, fachkundig geführte Reisen entlang der Seidenstraße.","phil.cta":"Planung beginnen",
    "faq.more":"Alle Fragen anzeigen","faq.less":"Weniger anzeigen",
    "faq.kicker":"Gut zu wissen","faq.title":"Häufig gestellte Fragen","faq.q1":"Ist Usbekistan sicher?","faq.a1":"Ja. Usbekistan gilt als eines der sichersten Reiseziele Zentralasiens und ist für seine herzliche Gastfreundschaft bekannt. Reisende fühlen sich allein wie mit Guide wohl. Wie überall empfehlen wir die üblichen Vorsichtsmaßnahmen und ein Auge auf persönliche Gegenstände in belebten Gegenden.","faq.q2":"Brauche ich ein Visum?","faq.a2":"Die Visabestimmungen hängen von Ihrer Staatsangehörigkeit ab. Viele Länder dürfen für einen bestimmten Zeitraum visumfrei einreisen, andere erhalten ein E-Visum. Wir beraten Sie gern zu den Einreisebestimmungen für Ihren Pass und helfen vor der Reise mit allen nötigen Informationen.","faq.q3":"Wann ist die beste Reisezeit für Usbekistan?","faq.a3":"Usbekistan ist ein Ganzjahresziel, jede Saison hat ihren Reiz. Frühling (März–Mai): milde Temperaturen, blühende Landschaften, ideal für Besichtigungen. Sommer (Juni–August): heiß und sonnig, lange Tage. Herbst (September–November): angenehme Temperaturen, bunte Landschaften, Erntezeit. Winter (Dezember–Februar): weniger Touristen, festliche Stimmung und nahe Bergresorts.","faq.q4":"Wie ist das Wetter?","faq.a4":"Usbekistan hat Kontinentalklima mit heißen Sommern und kühlen Wintern. Frühling: 15–30 °C. Sommer: 30–46 °C. Herbst: 15–30 °C. Winter: −5 bis 10 °C, je nach Region. Zwischen Wüste, Tälern und Bergen variiert das Wetter: vor der Abreise geben wir persönliche Packempfehlungen.","faq.q5":"Was soll ich anziehen?","faq.a5":"Bequeme Kleidung und gutes Schuhwerk sind ideal, da viele historische Stätten zu Fuß erkundet werden. In den warmen Monaten empfiehlt sich leichte, atmungsaktive Kleidung mit einer leichten Jacke für kühlere Abende; im Winter warme Schichten und ein Mantel. Es gibt keine strenge Kleiderordnung für Touristen, an religiösen Stätten wird dezente Kleidung geschätzt: bedeckte Schultern und Knie genügen in der Regel.","faq.q6":"Kann ich jede Reiseroute anpassen?","faq.a6":"Absolut. Jede unserer Reisen ist maßgeschneidert. Ziele, Reisetempo, Hotelkategorie, Aktivitäten, Transport und kulturelle Erlebnisse lassen sich an Ihre Interessen, Ihren Zeitplan und Ihr Budget anpassen.","faq.q7":"Sind Alleinreisende willkommen?","faq.a7":"Natürlich. Wir gestalten persönliche Reisen für Alleinreisende, Paare, Familien und private Gruppen. Ob Kultur, Fotografie, Gastronomie oder Abenteuer: die Route passt zu Ihrem Reisestil.","faq.q8":"Können Ernährungswünsche berücksichtigt werden?","faq.a8":"Ja. Vegetarisch, vegan, glutenfrei, halal sowie Allergien lassen sich in der Regel berücksichtigen. Teilen Sie uns Ihre Wünsche bitte im Voraus mit, damit wir alles auf der gesamten Reise arrangieren können.","faq.q9":"Welche Sprachen sprechen Ihre Guides?","faq.a9":"Unsere Guides sprechen fließend Englisch; Guides mit Französisch, Deutsch, Spanisch, Italienisch, Russisch, Japanisch, Koreanisch, Chinesisch, Türkisch und weiteren Sprachen können auf Anfrage und je nach Verfügbarkeit organisiert werden.","faq.q10":"Welche Währung gilt in Usbekistan?","faq.a10":"Die offizielle Währung ist der usbekische Sum (UZS). Euro, US-Dollar und Britische Pfund lassen sich in Banken, Hotels und offiziellen Wechselstuben leicht tauschen. Visa und Mastercard werden in vielen Hotels, Restaurants und größeren Geschäften akzeptiert; für Basare und kleinere Läden empfiehlt sich etwas Bargeld.","faq.q11":"Kann ich mit Kreditkarte zahlen?","faq.a11":"Ja. Kredit- und Debitkarten werden in größeren Städten, Hotels und vielen Restaurants weitgehend akzeptiert. Für kleinere Orte, Basare und ländliche Gegenden empfehlen wir dennoch etwas Bargeld.","faq.q12":"Wie reisen wir zwischen den Städten?","faq.a12":"Usbekistan hat ein ausgezeichnetes Verkehrsnetz. Je nach Route reisen Sie mit dem modernen Hochgeschwindigkeitszug, Inlandsflügen oder komfortablen Privatfahrzeugen mit professionellen Fahrern. Wir wählen für jede Etappe die effizienteste und bequemste Option.","faq.q13":"Ist der Flughafentransfer inbegriffen?","faq.a13":"Ja. Alle unsere maßgeschneiderten Reisen beinhalten Flughafen-, Bahnhofs- und Hoteltransfers: für ein entspanntes Erlebnis von der Ankunft bis zur Abreise.","faq.q14":"Warum eine maßgeschneiderte Reise statt einer Standardtour?","faq.a14":"Anders als feste Gruppentouren werden unsere Reisen exklusiv für Sie gestaltet: nach Ihren Interessen, Ihrem Tempo, Ihrem Flugplan, Unterkunftsstil und Budget. So erleben Sie Usbekistan persönlicher, flexibler und intensiver, ohne starren Gruppenplan.",
    "jr.kicker":"Finden Sie Ihre Reise","jr.title":"Beginnen Sie Ihre Seidenstraßen-Geschichte","jr.tab.traveller":"Nach Reisetyp","jr.tab.popular":"Beliebteste","jr.tab.month":"Nach Monat","jr.tab.spotlight":"Im Fokus","jr.for":"Reisen für","jr.dest":"Reiseziel","jr.tab.all":"Alle","jr.tab.cities":"Städte","jr.tab.nature":"Wüste & Täler","card.couples":"Ruhige, intime Seidenstraßen-Auszeiten","card.families":"Staunen für jede Generation","card.groups":"Privat, fachkundig geführt für wenige","card.honeymoons":"Nur Sie beide, unvergesslich","card.solo":"Allein reisen, nie einsam",
    "trips.title":"Entdecken Sie unsere Reisen","trips.lead":"Markante Reiserouten, die die Fantasie beflügeln.","trips.days10":"10 Tage","trips.days5":"5 Tage","trips.days4":"4 Tage","trips.days3":"3 Tage","trips.t1":"Die Registan-Route","trips.t2":"Buchara & die Kunsthandwerker","trips.t3":"Die Mauern von Chiwa","trips.t4":"Kysylkum unter Sternen","trips.p1":"ab 4.950 € p. P.","trips.p2":"ab 2.650 € p. P.","trips.p3":"ab 2.150 € p. P.","trips.p4":"ab 1.750 € p. P.","trips.explore":"Reise entdecken",
    "press.kicker":"Ausgezeichnet für","press.award":"Preis für verantwortungsvolles Reisen","press.bespoke":"Spezialist für maßgeschneiderte Reisen","press.expertise":"Seidenstraßen-Expertise","press.rated":"Mit 5 Sternen bewertet",
    "feature.kicker":"Signature-Reise","feature.title":"Nächte unter den Sternen der Kysylkum","feature.body":"Eine herausragende Auszeit in die Stille der Wüste: Jurtencamps, Kamelpfade und ein Himmel, ungetrübt von Städten.","feature.cta":"Reise entdecken",
    "founders.kicker":"Was wir tun und warum","founders.title":"Gegründet, um die geliebte Seidenstraße zu teilen","founders.body":"Mosaique begann mit zwei Freunden, die immer wieder nach Usbekistan zurückkehrten und es so teilen wollten, wie sie es kennengelernt hatten: durch die Menschen, das Handwerk und die stillen Momente zwischen den Monumenten.","founders.watch":"► Film ansehen",
    "pursuit.kicker":"Das Streben nach Gefühl","pursuit.title":"Reisen, die bewegen, nicht nur befördern","pursuit.body":"Von A nach B bringt Sie jeder. Wir gestalten den Moment, in dem die Schultern sinken und der Ort Sie ergreift: der Gebetsruf über Buchara, die Kühle eines Medresen-Hofs, Tee, eingeschenkt von jemandem, der nun Ihren Namen kennt.","pursuit.cta":"Kollektion entdecken",
    "guide.kicker":"Unser Leitfaden für Seidenstraßen-Reisen","guide.title":"Die Seidenstraße, richtig gemacht","guide.body":"Luxus bedeutet hier nicht Marmor und Gold. Es ist ein privater Guide, der Ihr Tempo liest, ein vollständig gebuchtes Hof-Gästehaus, eine Tafel in einer historischen Karawanserei. Wir gestalten jeden Tag nach Ihrem Reisestil und bleiben einen Schritt voraus, damit Sie die Logistik nie spüren.","guide.cta":"Weiterlesen",
    "why.kicker":"Warum Mosaique","why.title":"Von Experten geplant, von Anfang bis Ende betreut","why.c1":"Renommierte Reiseplaner","why.c1d":"Spezialisten, die ständig durch Usbekistan reisen.","why.c2":"Unverbindliche Angebote","why.c2d":"Ein maßgeschneidertes Angebot, bevor Sie sich festlegen.","why.c3":"Keine Planungsgebühren","why.c3d":"Sie zahlen für die Reise, nicht für den Papierkram.","why.c4":"Betreuung rund um die Uhr vor Ort","why.c4d":"Ein lokales Team, erreichbar während Ihrer ganzen Reise.","why.c5":"Private Experten-Guides","why.c5d":"Handverlesene Guides, die echte Türen öffnen.","why.reviews":"★★★★★ Von Reisenden entlang der Seidenstraße hervorragend bewertet",
    "ctaSec.title":"Bereit, Ihre Reise zu beginnen?","ctaSec.body":"Sagen Sie uns, welches Gefühl Sie suchen, den Rest gestalten wir.","ctaSec.button":"Kontakt aufnehmen",
    "cert.iata":"IATA-akkreditiert","cert.assoc":"Verband für maßgeschneidertes Reisen","cert.carbon":"Klimabewusstes Reisen",
    "foot.expert":"Mit einem Experten sprechen","foot.touch":"Kontakt aufnehmen","foot.story":"Unsere Geschichte","foot.useful":"Nützliche Informationen","foot.guide":"Reiseführer","foot.admin":"Admin","foot.privacy":"Datenschutz","foot.destinations":"Reiseziele","foot.experiences":"Erlebnisse","foot.stay":"In Kontakt bleiben","foot.subscribe":"Abonnieren","foot.tagline":"Mosaique Journeys · Private Reisen entlang der Seidenstraße · mosaiquejourneys@gmail.com","foot.rights":"© 2026 Mosaique Journeys. Alle Rechte vorbehalten.","fb.kicker":"Gästefeedback","fb.title":"Teilen Sie Ihr Erlebnis","fb.lead":"Mit uns gereist? Erzählen Sie künftigen Gästen, wie Ihre Reise war.","fb.name":"Ihr Name","fb.namePh":"z. B. Élise aus Paris","fb.rating":"Ihre Bewertung","fb.message":"Ihr Feedback","fb.messagePh":"Was machte Ihre Reise unvergesslich?","fb.submit":"Feedback senden","fb.thanks":"Vielen Dank! Ihr Feedback wurde geteilt.","fb.recent":"Aktuelles Feedback","price.kicker":"Transparente Preise","price.title":"Maßgeschneiderte Reisen ab €1.320 pro Person","price.lead":"Das ist unser Startpreis für das Standard-Paket. Da jede Reise individuell ist, hängt der Endpreis von der Reisedauer, der Anzahl der Reisenden, der Saison, Ihrer Hotelkategorie, dem Transport und den gewählten Erlebnissen ab.","price.incTitle":"Im Startpreis enthalten","price.inc1":"Alle Transporte innerhalb Usbekistans, inklusive Hochgeschwindigkeitszug und Inlandsflügen, sofern erforderlich","price.inc2":"Komfortable 3- bis 5-Sterne-Hotels mit täglichem Frühstück","price.inc3":"Private Transfers von Flughafen, Bahnhof und Hotel","price.inc4":"Professionelle Reiseleiter","price.inc5":"Eintrittsgelder für alle Denkmäler und Museen Ihrer Route","price.inc6":"Reiseplanung und Betreuung","price.exTitle":"Nicht enthalten","price.ex1":"Internationale Flüge","price.ex2":"Reiseversicherung","price.ex3":"Visagebühren (falls zutreffend)","price.ex4":"Mittag- und Abendessen, sofern nicht angegeben","price.ex5":"Persönliche Ausgaben","price.consult":"Bevor Sie sich entscheiden, bieten wir eine kostenlose persönliche Reiseberatung: wir besprechen Ihre Interessen, Ihren Reisestil und Ihre Erwartungen und erstellen dann eine individuelle Reiseroute und ein transparentes Angebot ohne versteckte Kosten.","price.cta":"Kostenlose Beratung anfragen","enq.name":"Ihr Name *","enq.email":"E-Mail *","enq.dates":"Wann & wie lange","enq.party":"Reisende","enq.dest":"Wohin & Interessen","enq.msg":"Erzählen Sie uns von Ihrer Reise *","enq.send":"Anfrage senden","enq.privacy":"Wir verwenden Ihre Daten nur zur Planung Ihrer Reise. Niemals Spam.","enq.datesPh":"z. B. Mai 2027, 10 Tage","enq.partyPh":"z. B. 2 Erwachsene","enq.destPh":"Samarkand, Buchara, Küche, Handwerk…","jd.highlights":"Highlights","jd.itinerary":"Tag für Tag","jd.included":"Was ist inbegriffen","jd.excluded":"Was ist nicht inbegriffen","jd.route":"Ihre Route","jd.ctaTitle":"Bereit, Ihre Reise zu beginnen?","jd.ctaBody":"Sagen Sie uns, welches Gefühl Sie suchen, und wir gestalten den Rest.","jd.back":"← Alle Reisen"
  },
  fr: {
    "gal.nav":"Galerie","gal.kicker":"En image","gal.title":"L'Ouzbékistan, tel que nous l'avons trouvé","gal.more":"Afficher plus",
    "nav.destinations":"Destinations","nav.cities":"Villes & régions","nav.experiences":"Expériences","nav.who":"Pour qui","nav.what":"Quoi","nav.inspiration":"Inspiration","nav.plan":"Planifier & explorer","nav.about":"À propos","nav.mission":"Notre mission","mission.heading":"Ce qui nous anime","mission.story":"Notre histoire","mission.feeling":"La quête de l'émotion","mission.approach":"Notre approche","mission.why":"Pourquoi Mosaique","nav.mosaique":"Mosaique",
    "exp.couples":"Couples","exp.families":"Familles","exp.groups":"Groupes","exp.honeymoons":"Lunes de miel","exp.solo":"En solo","exp.cultural":"Culture","exp.desert":"Désert","exp.slow":"Voyage lent","exp.food":"Gastronomie","exp.craft":"Artisanat","exp.adventure":"Aventure",
    "insp.bymonth":"Par mois","insp.guides":"Guides","insp.stories":"Récits","insp.itineraries":"Itinéraires","insp.journal":"Journal",
    "about.story":"Notre histoire","about.team":"Équipe","about.why":"Pourquoi Mosaique","about.journeys":"Voyages","nav.pricing":"Tarifs","nav.faq":"FAQ",
    "cta.enquire":"Demander un devis",
    "hero.eyebrow":"Voyages privés en Ouzbékistan","hero.title":"Là où les cultures se rencontrent","hero.copy":"Voyages sur mesure, expertise locale et service d'exception sur toute la Route de la Soie.","hero.explore":"Découvrir les voyages",
    "news.signup":"Recevez récits et idées de voyage sur la Route de la Soie","news.button":"S'inscrire","form.email":"Votre e-mail",
    "phil.kicker":"L'esprit Mosaique","phil.title":"Chaque voyage commence par une émotion","phil.body":"Avant même de réserver un vol, nous écoutons l'émotion que vous recherchez : le calme d'une cour carrelée à l'aube, la chaleur d'un plov partagé, l'immensité du Kyzylkoum au crépuscule. Depuis plus de dix ans, nous transformons ces émotions en voyages privés guidés par des experts sur la Route de la Soie.","phil.cta":"Commencer à planifier",
    "faq.more":"Voir toutes les questions","faq.less":"Voir moins",
    "faq.kicker":"Bon à savoir","faq.title":"Questions fréquentes","faq.q1":"L'Ouzbékistan est-il sûr ?","faq.a1":"Oui. L'Ouzbékistan est considéré comme l'une des destinations les plus sûres d'Asie centrale et est réputé pour sa chaleureuse hospitalité. Les voyageurs s'y sentent à l'aise, seuls comme accompagnés d'un guide. Comme partout, nous recommandons les précautions habituelles et de surveiller ses effets personnels dans les lieux fréquentés.","faq.q2":"Ai-je besoin d'un visa ?","faq.a2":"Les exigences de visa dépendent de votre nationalité. De nombreux pays bénéficient d'une entrée sans visa pour une durée déterminée, d'autres d'un e-visa. Nous vous conseillerons volontiers sur les conditions d'entrée selon votre passeport et vous aiderons avec les informations nécessaires avant le départ.","faq.q3":"Quelle est la meilleure période pour visiter l'Ouzbékistan ?","faq.a3":"L'Ouzbékistan se visite toute l'année, chaque saison offrant une expérience différente. Printemps (mars–mai) : températures douces, paysages en fleurs, idéal pour les visites. Été (juin–août) : chaud et ensoleillé, longues journées. Automne (septembre–novembre) : températures agréables, paysages colorés, saison des récoltes. Hiver (décembre–février) : moins de touristes, atmosphère festive et stations de montagne à proximité.","faq.q4":"Quel temps fait-il ?","faq.a4":"L'Ouzbékistan a un climat continental : étés chauds et hivers frais. Printemps : 15–30 °C. Été : 30–46 °C. Automne : 15–30 °C. Hiver : de −5 à 10 °C selon la région. Le temps varie entre désert, vallées et montagnes ; nous fournissons des conseils de bagages personnalisés avant le départ.","faq.q5":"Comment m'habiller ?","faq.a5":"Des vêtements confortables et de bonnes chaussures de marche sont recommandés, car de nombreux sites historiques se découvrent à pied. Aux mois chauds, privilégiez des vêtements légers et respirants, avec une veste légère pour les soirées fraîches de printemps et d'automne ; en hiver, des couches chaudes et un manteau. Pas de code vestimentaire strict pour les touristes, mais une tenue sobre est appréciée dans les lieux religieux: couvrir épaules et genoux suffit généralement.","faq.q6":"Puis-je personnaliser chaque itinéraire ?","faq.a6":"Absolument. Chaque voyage que nous créons est sur mesure. Destinations, rythme, catégorie d'hôtel, activités, transports et expériences culturelles s'ajustent à vos envies, votre calendrier et votre budget.","faq.q7":"Les voyageurs solo sont-ils les bienvenus ?","faq.a7":"Bien sûr. Nous concevons des voyages personnalisés pour les voyageurs solo, les couples, les familles et les groupes privés. Découverte culturelle, photographie, gastronomie ou aventure : l'itinéraire s'adapte à votre style de voyage.","faq.q8":"Les régimes alimentaires peuvent-ils être pris en compte ?","faq.a8":"Oui. Végétarien, végétalien, sans gluten, halal et allergies peuvent généralement être pris en compte. Merci de nous informer de vos besoins à l'avance afin que nous puissions tout organiser tout au long du voyage.","faq.q9":"Quelles langues parlent vos guides ?","faq.a9":"Nos guides parlent couramment l'anglais ; des guides parlant français, allemand, espagnol, italien, russe, japonais, coréen, chinois, turc et d'autres langues peuvent être organisés sur demande, selon disponibilité.","faq.q10":"Quelle monnaie utilise-t-on en Ouzbékistan ?","faq.a10":"La monnaie officielle est le soum ouzbek (UZS). Euros, dollars américains et livres sterling s'échangent facilement dans les banques, hôtels et bureaux de change officiels. Visa et Mastercard sont acceptées dans de nombreux hôtels, restaurants et grands magasins ; prévoyez un peu d'espèces pour les bazars et petits commerces.","faq.q11":"Puis-je utiliser ma carte bancaire ?","faq.a11":"Oui. Les cartes de crédit et de débit sont largement acceptées dans les grandes villes, les hôtels et de nombreux restaurants. Nous recommandons néanmoins d'avoir un peu d'espèces pour les petites villes, les bazars et les zones rurales.","faq.q12":"Comment voyage-t-on entre les villes ?","faq.a12":"L'Ouzbékistan dispose d'un excellent réseau de transport. Selon l'itinéraire : train à grande vitesse moderne, vols intérieurs ou véhicules privés confortables avec chauffeurs professionnels. Nous choisissons l'option la plus efficace et la plus confortable pour chaque étape.","faq.q13":"Le transfert aéroport est-il inclus ?","faq.a13":"Oui. Tous nos voyages sur mesure incluent les transferts aéroport, gare et hôtel, pour une expérience fluide et sans stress de l'arrivée au départ.","faq.q14":"Pourquoi un voyage sur mesure plutôt qu'un circuit classique ?","faq.a14":"Contrairement aux circuits de groupe figés, nos voyages sont conçus exclusivement pour vous: selon vos centres d'intérêt, votre rythme, vos horaires de vol, votre style d'hébergement et votre budget. Vous découvrez ainsi l'Ouzbékistan de façon plus personnelle, flexible et authentique, sans programme de groupe rigide.",
    "jr.kicker":"Trouvez votre voyage","jr.title":"Commencez votre récit de la Route de la Soie","jr.tab.traveller":"Par voyageur","jr.tab.popular":"Les plus populaires","jr.tab.month":"Par mois","jr.tab.spotlight":"À l'honneur","jr.for":"Voyages pour","jr.dest":"Destination","jr.tab.all":"Toutes","jr.tab.cities":"Villes","jr.tab.nature":"Désert & vallées","card.couples":"Escapades lentes et intimes sur la Route de la Soie","card.families":"L'émerveillement pour chaque génération","card.groups":"Privé, guidé par des experts pour quelques-uns","card.honeymoons":"Rien que vous deux, inoubliable","card.solo":"Voyagez seul, jamais solitaire",
    "trips.title":"Découvrez nos voyages","trips.lead":"Des itinéraires emblématiques pour éveiller l'imagination.","trips.days10":"10 jours","trips.days5":"5 jours","trips.days4":"4 jours","trips.days3":"3 jours","trips.t1":"La route du Registan","trips.t2":"Boukhara & les artisans","trips.t3":"Les remparts de Khiva","trips.t4":"Le Kyzylkoum sous les étoiles","trips.p1":"dès 4 950 € / pers.","trips.p2":"dès 2 650 € / pers.","trips.p3":"dès 2 150 € / pers.","trips.p4":"dès 1 750 € / pers.","trips.explore":"Découvrir le voyage",
    "press.kicker":"Reconnu pour","press.award":"Prix du tourisme responsable","press.bespoke":"Spécialiste du voyage sur mesure","press.expertise":"Expertise de la Route de la Soie","press.rated":"Noté 5 étoiles par les voyageurs",
    "feature.kicker":"Voyage signature","feature.title":"Nuits sous les étoiles du Kyzylkoum","feature.body":"Une évasion phare dans le silence du désert : campements de yourtes, pistes de chameaux et un ciel que nulle ville n'assombrit.","feature.cta":"Découvrir le voyage",
    "founders.kicker":"Ce que nous faisons, et pourquoi","founders.title":"Fondé pour partager la Route de la Soie que nous aimons","founders.body":"Mosaique est né de deux amis qui revenaient sans cesse en Ouzbékistan et voulaient le partager tel qu'ils l'avaient découvert: à travers les gens, l'artisanat et les instants paisibles entre les monuments.","founders.watch":"► Voir le film",
    "pursuit.kicker":"La quête de l'émotion","pursuit.title":"Un voyage qui vous émeut, pas seulement qui vous transporte","pursuit.body":"N'importe qui peut vous mener d'un point A à un point B. Nous concevons l'instant où vos épaules se détendent et où le lieu vous saisit : l'appel à la prière au-dessus de Boukhara, la fraîcheur d'une cour de médersa, le thé servi par quelqu'un qui connaît désormais votre nom.","pursuit.cta":"Explorer la collection",
    "guide.kicker":"Notre guide du voyage sur la Route de la Soie","guide.title":"La Route de la Soie, comme il se doit","guide.body":"Ici, le luxe n'est pas le marbre et l'or. C'est un guide privé qui épouse votre rythme, une maison d'hôtes à cour réservée entièrement, une table dressée dans un caravansérail historique. Nous façonnons chaque journée selon votre façon de voyager et gardons une longueur d'avance pour que vous ne ressentiez jamais la logistique.","guide.cta":"Continuer la lecture",
    "why.kicker":"Pourquoi Mosaique","why.title":"Conçu par des experts, accompagné de bout en bout","why.c1":"Concepteurs reconnus","why.c1d":"Des spécialistes qui parcourent l'Ouzbékistan en permanence.","why.c2":"Devis sans engagement","why.c2d":"Une proposition sur mesure avant de vous engager.","why.c3":"Sans frais de planification","why.c3d":"Vous payez le voyage, pas la paperasse.","why.c4":"Assistance sur place 24h/24","why.c4d":"Une équipe locale joignable pendant tout votre séjour.","why.c5":"Guides experts privés","why.c5d":"Des guides triés sur le volet qui ouvrent les vraies portes.","why.reviews":"★★★★★ Jugé excellent par les voyageurs sur toute la Route de la Soie",
    "ctaSec.title":"Prêt à commencer votre voyage ?","ctaSec.body":"Dites-nous l'émotion que vous recherchez et nous concevrons le reste.","ctaSec.button":"Nous contacter",
    "cert.iata":"Accrédité IATA","cert.assoc":"Association du voyage sur mesure","cert.carbon":"Voyage éco-responsable",
    "foot.expert":"Parler à un expert","foot.touch":"Nous contacter","foot.story":"Notre histoire","foot.useful":"Informations utiles","foot.guide":"Guide de voyage","foot.admin":"Admin","foot.privacy":"Politique de confidentialité","foot.destinations":"Destinations","foot.experiences":"Expériences","foot.stay":"Restons en contact","foot.subscribe":"S'abonner","foot.tagline":"Mosaique Journeys · Voyages privés sur la Route de la Soie · mosaiquejourneys@gmail.com","foot.rights":"© 2026 Mosaique Journeys. Tous droits réservés.","fb.kicker":"Avis des voyageurs","fb.title":"Partagez votre expérience","fb.lead":"Vous avez voyagé avec nous ? Dites aux futurs voyageurs comment s'est passé votre périple.","fb.name":"Votre nom","fb.namePh":"ex. Élise de Paris","fb.rating":"Votre note","fb.message":"Votre avis","fb.messagePh":"Qu'est-ce qui a rendu votre voyage mémorable ?","fb.submit":"Envoyer l'avis","fb.thanks":"Merci ! Votre avis a été partagé.","fb.recent":"Avis récents","price.kicker":"Tarifs transparents","price.title":"Voyages sur mesure à partir de €1 320 par personne","price.lead":"C'est notre prix de départ pour la formule Standard. Chaque voyage étant personnalisé, le prix final dépend de la durée du séjour, du nombre de voyageurs, de la saison, de votre catégorie d'hôtel, du transport et des expériences choisies.","price.incTitle":"Le prix de départ comprend","price.inc1":"Tous les transports en Ouzbékistan, y compris le train à grande vitesse et les vols intérieurs si nécessaire","price.inc2":"Hôtels confortables 3 à 5 étoiles avec petit-déjeuner quotidien","price.inc3":"Transferts privés aéroport, gare et hôtel","price.inc4":"Guides professionnels","price.inc5":"Droits d'entrée à tous les monuments et musées de votre itinéraire","price.inc6":"Organisation du voyage et assistance","price.exTitle":"Non inclus","price.ex1":"Vols internationaux","price.ex2":"Assurance voyage","price.ex3":"Frais de visa (le cas échéant)","price.ex4":"Déjeuners et dîners sauf indication contraire","price.ex5":"Dépenses personnelles","price.consult":"Avant de vous engager, nous offrons une consultation de voyage personnelle et gratuite: nous discutons de vos envies, de votre style de voyage et de vos attentes, puis créons un itinéraire sur mesure et un devis transparent, sans frais cachés.","price.cta":"Demander votre consultation gratuite","enq.name":"Votre nom *","enq.email":"E-mail *","enq.dates":"Quand & combien de temps","enq.party":"Voyageurs","enq.dest":"Où & centres d'intérêt","enq.msg":"Parlez-nous de votre voyage *","enq.send":"Envoyer la demande","enq.privacy":"Nous utilisons vos informations uniquement pour organiser votre voyage. Jamais de spam.","enq.datesPh":"ex. mai 2027, 10 jours","enq.partyPh":"ex. 2 adultes","enq.destPh":"Samarcande, Boukhara, gastronomie, artisanat…","jd.highlights":"Temps forts","jd.itinerary":"Jour après jour","jd.included":"Ce qui est inclus","jd.excluded":"Ce qui n'est pas inclus","jd.route":"Votre itinéraire","jd.ctaTitle":"Prêt à commencer votre voyage ?","jd.ctaBody":"Dites-nous le sentiment que vous cherchez et nous concevons le reste.","jd.back":"← Tous les voyages"
  },
  es: {
    "gal.nav":"Galería","gal.kicker":"En imagen","gal.title":"Uzbekistán, tal como lo encontramos","gal.more":"Ver más",
    "nav.destinations":"Destinos","nav.cities":"Ciudades y regiones","nav.experiences":"Experiencias","nav.who":"Para quién","nav.what":"Qué","nav.inspiration":"Inspiración","nav.plan":"Planificar y explorar","nav.about":"Nosotros","nav.mission":"Nuestra misión","mission.heading":"Lo que nos mueve","mission.story":"Nuestra historia","mission.feeling":"La búsqueda de la emoción","mission.approach":"Nuestro enfoque","mission.why":"Por qué Mosaique","nav.mosaique":"Mosaique",
    "exp.couples":"Parejas","exp.families":"Familias","exp.groups":"Grupos","exp.honeymoons":"Lunas de miel","exp.solo":"En solitario","exp.cultural":"Cultura","exp.desert":"Desierto","exp.slow":"Viaje pausado","exp.food":"Gastronomía","exp.craft":"Artesanía","exp.adventure":"Aventura",
    "insp.bymonth":"Por mes","insp.guides":"Guías","insp.stories":"Historias","insp.itineraries":"Itinerarios","insp.journal":"Diario",
    "about.story":"Nuestra historia","about.team":"Equipo","about.why":"Por qué Mosaique","about.journeys":"Viajes","nav.pricing":"Precios","nav.faq":"Preguntas frecuentes",
    "cta.enquire":"Solicitar información",
    "hero.eyebrow":"Viajes privados por Uzbekistán","hero.title":"Donde las culturas se encuentran","hero.copy":"Viajes a medida, experiencia local y un servicio excepcional por toda la Ruta de la Seda.","hero.explore":"Explorar viajes",
    "news.signup":"Reciba historias e ideas de viaje de la Ruta de la Seda","news.button":"Suscribirse","form.email":"Su correo electrónico",
    "phil.kicker":"El estilo Mosaique","phil.title":"Cada viaje comienza con una emoción","phil.body":"Antes de reservar un solo vuelo, escuchamos la emoción que persigue: el silencio de un patio alicatado al amanecer, el calor de un plov compartido, la inmensidad del Kyzylkum al atardecer. Durante más de una década hemos convertido esas emociones en viajes privados guiados por expertos por la Ruta de la Seda.","phil.cta":"Empezar a planificar",
    "faq.more":"Ver todas las preguntas","faq.less":"Ver menos",
    "faq.kicker":"Bueno saberlo","faq.title":"Preguntas frecuentes","faq.q1":"¿Es seguro Uzbekistán?","faq.a1":"Sí. Uzbekistán está considerado uno de los destinos más seguros de Asia Central y es conocido por su cálida hospitalidad. Los viajeros se sienten cómodos explorando tanto por su cuenta como con guía. Como en cualquier lugar, recomendamos precauciones normales y vigilar las pertenencias en zonas concurridas.","faq.q2":"¿Necesito visado?","faq.a2":"Los requisitos dependen de su nacionalidad. Muchos países pueden entrar sin visado durante un periodo determinado, mientras otros optan al visado electrónico. Con gusto le asesoraremos sobre los requisitos de entrada para su pasaporte y le ayudaremos con la información necesaria antes del viaje.","faq.q3":"¿Cuál es la mejor época para visitar Uzbekistán?","faq.a3":"Uzbekistán es un destino para todo el año y cada estación ofrece una experiencia distinta. Primavera (marzo–mayo): temperaturas suaves, paisajes en flor y visitas ideales. Verano (junio–agosto): caluroso y soleado, con días largos. Otoño (septiembre–noviembre): temperaturas agradables, paisajes coloridos y temporada de cosecha. Invierno (diciembre–febrero): menos turistas, ambiente festivo y estaciones de montaña cercanas.","faq.q4":"¿Qué tiempo hace?","faq.a4":"Uzbekistán tiene clima continental, con veranos calurosos e inviernos fríos. Primavera: 15–30 °C. Verano: 30–46 °C. Otoño: 15–30 °C. Invierno: de −5 a 10 °C según la región. El tiempo varía entre desierto, valles y montañas, por lo que damos recomendaciones de equipaje personalizadas antes de la salida.","faq.q5":"¿Qué ropa llevo?","faq.a5":"Se recomienda ropa cómoda y calzado para caminar, ya que muchos sitios históricos se exploran a pie. En los meses cálidos, ropa ligera y transpirable, con una chaqueta fina para las noches frescas de primavera y otoño; en invierno, capas de abrigo y un buen abrigo. No hay un código de vestimenta estricto para turistas, aunque en los lugares religiosos se aprecia la ropa discreta: cubrir hombros y rodillas suele ser suficiente.","faq.q6":"¿Puedo personalizar cada itinerario?","faq.a6":"Por supuesto. Cada viaje que creamos es a medida. Destinos, ritmo, categoría de hotel, actividades, transporte y experiencias culturales se ajustan a sus intereses, calendario y presupuesto.","faq.q7":"¿Son bienvenidos los viajeros solos?","faq.a7":"Claro. Diseñamos viajes personalizados para viajeros solos, parejas, familias y grupos privados. Ya busque descubrimiento cultural, fotografía, gastronomía o aventura, crearemos un itinerario acorde a su estilo.","faq.q8":"¿Pueden atender requisitos dietéticos?","faq.a8":"Sí. Normalmente podemos atender dietas vegetarianas, veganas, sin gluten, halal y alergias. Indíquenos sus necesidades con antelación para organizarlo todo durante el viaje.","faq.q9":"¿Qué idiomas hablan sus guías?","faq.a9":"Nuestros guías hablan inglés con fluidez; bajo petición y según disponibilidad, podemos organizar guías de francés, alemán, español, italiano, ruso, japonés, coreano, chino, turco y más.","faq.q10":"¿Qué moneda se usa en Uzbekistán?","faq.a10":"La moneda oficial es el sum uzbeko (UZS). Euros, dólares y libras se cambian fácilmente en bancos, hoteles y casas de cambio oficiales. Visa y Mastercard se aceptan en muchos hoteles, restaurantes y tiendas grandes; conviene llevar algo de efectivo para bazares y comercios pequeños.","faq.q11":"¿Puedo usar tarjeta de crédito?","faq.a11":"Sí. Las tarjetas se aceptan ampliamente en las principales ciudades, hoteles y muchos restaurantes. Aun así, recomendamos llevar algo de efectivo en pueblos pequeños, bazares o zonas rurales.","faq.q12":"¿Cómo nos desplazamos entre ciudades?","faq.a12":"Uzbekistán cuenta con una excelente red de transporte. Según el itinerario, viajará en el moderno tren de alta velocidad, en vuelos nacionales o en cómodos vehículos privados con conductores profesionales. Elegimos la opción más eficiente y cómoda para cada tramo.","faq.q13":"¿Está incluido el traslado al aeropuerto?","faq.a13":"Sí. Todos nuestros viajes a medida incluyen traslados de aeropuerto, estación de tren y hotel, para una experiencia fluida y sin estrés de principio a fin.","faq.q14":"¿Por qué un viaje a medida en lugar de un tour estándar?","faq.a14":"A diferencia de los tours en grupo, nuestros viajes se diseñan exclusivamente para usted: según sus intereses, ritmo, horarios de vuelo, estilo de alojamiento y presupuesto. Así vive Uzbekistán de una forma más personal, flexible y auténtica, sin horarios rígidos de grupo.",
    "jr.kicker":"Encuentre su viaje","jr.title":"Comience su historia de la Ruta de la Seda","jr.tab.traveller":"Por viajero","jr.tab.popular":"Más populares","jr.tab.month":"Por mes","jr.tab.spotlight":"Destacados","jr.for":"Viajes para","jr.dest":"Destino","jr.tab.all":"Todos","jr.tab.cities":"Ciudades","jr.tab.nature":"Desierto y valles","card.couples":"Escapadas pausadas e íntimas por la Ruta de la Seda","card.families":"Asombro para todas las generaciones","card.groups":"Privado, guiado por expertos para unos pocos","card.honeymoons":"Solo ustedes dos, inolvidable","card.solo":"Viaje solo, nunca en soledad",
    "trips.title":"Descubra nuestros viajes","trips.lead":"Itinerarios emblemáticos para despertar la imaginación.","trips.days10":"10 días","trips.days5":"5 días","trips.days4":"4 días","trips.days3":"3 días","trips.t1":"La ruta del Registán","trips.t2":"Bujará y los artesanos","trips.t3":"Las murallas de Jiva","trips.t4":"Kyzylkum bajo las estrellas","trips.p1":"desde 4.950 € / pers.","trips.p2":"desde 2.650 € / pers.","trips.p3":"desde 2.150 € / pers.","trips.p4":"desde 1.750 € / pers.","trips.explore":"Descubrir el viaje",
    "press.kicker":"Reconocidos por","press.award":"Premio al turismo responsable","press.bespoke":"Especialista en viajes a medida","press.expertise":"Experiencia en la Ruta de la Seda","press.rated":"Valorados con 5 estrellas por los viajeros",
    "feature.kicker":"Viaje exclusivo","feature.title":"Noches bajo las estrellas del Kyzylkum","feature.body":"Una escapada insignia al silencio del desierto: campamentos de yurtas, senderos de camellos y un cielo que ninguna ciudad oscurece.","feature.cta":"Descubrir el viaje",
    "founders.kicker":"Qué hacemos y por qué","founders.title":"Creado para compartir la Ruta de la Seda que amamos","founders.body":"Mosaique nació de dos amigos que volvían una y otra vez a Uzbekistán y querían compartirlo tal como lo habían conocido: a través de su gente, su artesanía y los momentos serenos entre los monumentos.","founders.watch":"► Ver la película",
    "pursuit.kicker":"La búsqueda de la emoción","pursuit.title":"Viajes que te conmueven, no solo que te trasladan","pursuit.body":"Cualquiera puede llevarle de A a B. Nosotros diseñamos el momento en que los hombros se relajan y el lugar se apodera de usted: la llamada a la oración sobre Bujará, el frescor del patio de una madrasa, el té servido por alguien que ya sabe su nombre.","pursuit.cta":"Explorar la colección",
    "guide.kicker":"Nuestra guía de viaje por la Ruta de la Seda","guide.title":"La Ruta de la Seda, bien hecha","guide.body":"Aquí el lujo no es mármol y oro. Es un guía privado que entiende su ritmo, una casa de huéspedes con patio reservada por completo, una mesa puesta en un caravasar histórico. Adaptamos cada día a su forma de viajar y vamos un paso por delante para que nunca sienta la logística.","guide.cta":"Seguir leyendo",
    "why.kicker":"Por qué Mosaique","why.title":"Planificado por expertos, atendido de principio a fin","why.c1":"Planificadores reconocidos","why.c1d":"Especialistas que recorren Uzbekistán constantemente.","why.c2":"Presupuestos sin compromiso","why.c2d":"Una propuesta a medida antes de comprometerse.","why.c3":"Sin gastos de planificación","why.c3d":"Paga por el viaje, no por el papeleo.","why.c4":"Asistencia local 24/7","why.c4d":"Un equipo local disponible durante todo el viaje.","why.c5":"Guías expertos privados","why.c5d":"Guías seleccionados que abren puertas de verdad.","why.reviews":"★★★★★ Excelente según los viajeros de toda la Ruta de la Seda",
    "ctaSec.title":"¿Listo para comenzar su viaje?","ctaSec.body":"Cuéntenos la emoción que busca y nosotros diseñaremos el resto.","ctaSec.button":"Póngase en contacto",
    "cert.iata":"Acreditado por la IATA","cert.assoc":"Asociación de viajes a medida","cert.carbon":"Viajes con conciencia ecológica",
    "foot.expert":"Hablar con un experto","foot.touch":"Póngase en contacto","foot.story":"Nuestra historia","foot.useful":"Información útil","foot.guide":"Guía de viaje","foot.admin":"Admin","foot.privacy":"Política de privacidad","foot.destinations":"Destinos","foot.experiences":"Experiencias","foot.stay":"Mantengámonos en contacto","foot.subscribe":"Suscribirse","foot.tagline":"Mosaique Journeys · Viajes privados por la Ruta de la Seda · mosaiquejourneys@gmail.com","foot.rights":"© 2026 Mosaique Journeys. Todos los derechos reservados.","fb.kicker":"Opiniones de viajeros","fb.title":"Comparta su experiencia","fb.lead":"¿Viajó con nosotros? Cuente a los próximos viajeros cómo fue su viaje.","fb.name":"Su nombre","fb.namePh":"p. ej. Élise de París","fb.rating":"Su valoración","fb.message":"Su opinión","fb.messagePh":"¿Qué hizo memorable su viaje?","fb.submit":"Enviar opinión","fb.thanks":"¡Gracias! Su opinión se ha compartido.","fb.recent":"Opiniones recientes","price.kicker":"Precios transparentes","price.title":"Viajes a medida desde €1.320 por persona","price.lead":"Ese es nuestro precio inicial para el paquete Standard. Como cada viaje es personalizado, el precio final depende de la duración del viaje, el número de viajeros, la temporada, la categoría de hotel, el transporte y las experiencias que elija.","price.incTitle":"El precio inicial incluye","price.inc1":"Todo el transporte dentro de Uzbekistán, incluido el tren de alta velocidad y vuelos nacionales cuando sea necesario","price.inc2":"Cómodos hoteles de 3 a 5 estrellas con desayuno diario","price.inc3":"Traslados privados de aeropuerto, estación de tren y hotel","price.inc4":"Guías profesionales","price.inc5":"Entradas a todos los monumentos y museos de su itinerario","price.inc6":"Planificación del viaje y asistencia","price.exTitle":"No incluido","price.ex1":"Vuelos internacionales","price.ex2":"Seguro de viaje","price.ex3":"Tasas de visado (si corresponde)","price.ex4":"Almuerzos y cenas salvo que se indique","price.ex5":"Gastos personales","price.consult":"Antes de decidir, ofrecemos una consulta de viaje personal y gratuita: hablamos de sus intereses, su estilo de viaje y sus expectativas, y luego creamos un itinerario personalizado y un presupuesto transparente, sin costes ocultos.","price.cta":"Solicite su consulta gratuita","enq.name":"Su nombre *","enq.email":"Correo electrónico *","enq.dates":"Cuándo y cuánto tiempo","enq.party":"Viajeros","enq.dest":"Adónde e intereses","enq.msg":"Cuéntenos sobre su viaje *","enq.send":"Enviar consulta","enq.privacy":"Usamos sus datos solo para planificar su viaje. Nunca spam.","enq.datesPh":"p. ej. mayo de 2027, 10 días","enq.partyPh":"p. ej. 2 adultos","enq.destPh":"Samarcanda, Bujará, gastronomía, artesanía…","jd.highlights":"Lo más destacado","jd.itinerary":"Día a día","jd.included":"Qué está incluido","jd.excluded":"Qué no está incluido","jd.route":"Su ruta","jd.ctaTitle":"¿Listo para comenzar su viaje?","jd.ctaBody":"Cuéntenos qué sensación busca y nosotros diseñamos el resto.","jd.back":"← Todos los viajes"
  },
  it: {
    "gal.nav":"Galleria","gal.kicker":"In quadro","gal.title":"L'Uzbekistan, come l'abbiamo trovato","gal.more":"Mostra altre",
    "nav.destinations":"Destinazioni","nav.cities":"Città e regioni","nav.experiences":"Esperienze","nav.who":"Per chi","nav.what":"Cosa","nav.inspiration":"Ispirazione","nav.plan":"Pianifica ed esplora","nav.about":"Chi siamo","nav.mission":"La nostra missione","mission.heading":"Ciò che ci muove","mission.story":"La nostra storia","mission.feeling":"La ricerca dell'emozione","mission.approach":"Il nostro approccio","mission.why":"Perché Mosaique","nav.mosaique":"Mosaique",
    "exp.couples":"Coppie","exp.families":"Famiglie","exp.groups":"Gruppi","exp.honeymoons":"Lune di miele","exp.solo":"In solitaria","exp.cultural":"Cultura","exp.desert":"Deserto","exp.slow":"Viaggio lento","exp.food":"Gastronomia","exp.craft":"Artigianato","exp.adventure":"Avventura",
    "insp.bymonth":"Per mese","insp.guides":"Guide","insp.stories":"Racconti","insp.itineraries":"Itinerari","insp.journal":"Diario",
    "about.story":"La nostra storia","about.team":"Team","about.why":"Perché Mosaique","about.journeys":"Viaggi","nav.pricing":"Prezzi","nav.faq":"Domande frequenti",
    "cta.enquire":"Richiedi informazioni",
    "hero.eyebrow":"Viaggi privati in Uzbekistan","hero.title":"Dove le culture si incontrano","hero.copy":"Viaggi su misura, competenza locale e un servizio eccezionale lungo tutta la Via della Seta.","hero.explore":"Scopri i viaggi",
    "news.signup":"Ricevi racconti e idee di viaggio dalla Via della Seta","news.button":"Iscriviti","form.email":"La tua email",
    "phil.kicker":"Lo stile Mosaique","phil.title":"Ogni viaggio inizia da un'emozione","phil.body":"Prima ancora di prenotare un volo, ascoltiamo l'emozione che cerchi: il silenzio di un cortile piastrellato all'alba, il calore di un plov condiviso, la vastità del Kyzylkum al tramonto. Da oltre dieci anni trasformiamo queste emozioni in viaggi privati guidati da esperti lungo la Via della Seta.","phil.cta":"Inizia a pianificare",
    "faq.more":"Mostra tutte le domande","faq.less":"Mostra meno",
    "faq.kicker":"Buono a sapersi","faq.title":"Domande frequenti","faq.q1":"L'Uzbekistan è sicuro?","faq.a1":"Sì. L'Uzbekistan è considerato una delle destinazioni più sicure dell'Asia centrale ed è noto per la calorosa ospitalità. I viaggiatori si sentono a proprio agio sia da soli sia con una guida. Come ovunque, consigliamo le normali precauzioni e attenzione agli effetti personali nelle zone affollate.","faq.q2":"Serve il visto?","faq.a2":"I requisiti dipendono dalla nazionalità. Molti Paesi possono entrare senza visto per un certo periodo, altri con e-visa. Saremo lieti di consigliarvi sui requisiti d'ingresso per il vostro passaporto e di aiutarvi con le informazioni necessarie prima della partenza.","faq.q3":"Qual è il periodo migliore per visitare l'Uzbekistan?","faq.a3":"L'Uzbekistan è una destinazione per tutto l'anno e ogni stagione regala un'esperienza diversa. Primavera (marzo–maggio): temperature miti, paesaggi in fiore, ideale per le visite. Estate (giugno–agosto): calda e soleggiata, con giornate lunghe. Autunno (settembre–novembre): temperature piacevoli, paesaggi colorati e stagione del raccolto. Inverno (dicembre–febbraio): meno turisti, atmosfera di festa e località di montagna vicine.","faq.q4":"Che tempo fa?","faq.a4":"L'Uzbekistan ha un clima continentale, con estati calde e inverni freschi. Primavera: 15–30 °C. Estate: 30–46 °C. Autunno: 15–30 °C. Inverno: da −5 a 10 °C a seconda della regione. Il clima varia tra deserto, valli e montagne: prima della partenza forniamo consigli personalizzati per i bagagli.","faq.q5":"Come mi vesto?","faq.a5":"Consigliamo abiti comodi e scarpe da camminata, perché molti siti storici si esplorano a piedi. Nei mesi caldi è ideale un abbigliamento leggero e traspirante, con una giacca leggera per le serate fresche di primavera e autunno; in inverno, strati caldi e un cappotto. Non c'è un dress code rigido per i turisti, ma nei luoghi religiosi è apprezzato un abbigliamento sobrio: coprire spalle e ginocchia in genere è sufficiente.","faq.q6":"Posso personalizzare ogni itinerario?","faq.a6":"Assolutamente sì. Ogni viaggio che creiamo è su misura. Destinazioni, ritmo, categoria degli hotel, attività, trasporti ed esperienze culturali si adattano ai vostri interessi, ai tempi e al budget.","faq.q7":"I viaggiatori solitari sono i benvenuti?","faq.a7":"Certo. Progettiamo viaggi personalizzati per chi viaggia da solo, coppie, famiglie e gruppi privati. Cultura, fotografia, gastronomia o avventura: creeremo un itinerario in linea con il vostro stile di viaggio.","faq.q8":"Potete gestire esigenze alimentari?","faq.a8":"Sì. Di norma possiamo gestire diete vegetariane, vegane, senza glutine, halal e allergie. Comunicateci le vostre esigenze in anticipo così da organizzare tutto durante il viaggio.","faq.q9":"Che lingue parlano le vostre guide?","faq.a9":"Le nostre guide parlano correntemente inglese; su richiesta e secondo disponibilità possiamo organizzare guide in francese, tedesco, spagnolo, italiano, russo, giapponese, coreano, cinese, turco e altre lingue.","faq.q10":"Qual è la valuta dell'Uzbekistan?","faq.a10":"La valuta ufficiale è il sum uzbeko (UZS). Euro, dollari e sterline si cambiano facilmente in banche, hotel e uffici di cambio ufficiali. Visa e Mastercard sono accettate in molti hotel, ristoranti e negozi più grandi; per bazar e piccole attività è consigliabile un po' di contante.","faq.q11":"Posso usare la carta di credito?","faq.a11":"Sì. Le carte di credito e di debito sono ampiamente accettate nelle città principali, negli hotel e in molti ristoranti. Consigliamo comunque un po' di contante per città più piccole, bazar e zone rurali.","faq.q12":"Come ci si sposta tra le città?","faq.a12":"L'Uzbekistan ha un'ottima rete di trasporti. A seconda dell'itinerario si viaggia con il moderno treno ad alta velocità, voli interni o comodi veicoli privati con autisti professionisti. Scegliamo l'opzione più efficiente e confortevole per ogni tratta.","faq.q13":"Il transfer aeroportuale è incluso?","faq.a13":"Sì. Tutti i nostri viaggi su misura includono i transfer da aeroporto, stazione e hotel, per un'esperienza serena dall'arrivo alla partenza.","faq.q14":"Perché un viaggio su misura invece di un tour standard?","faq.a14":"A differenza dei tour di gruppo, i nostri viaggi sono progettati esclusivamente per voi: interessi, ritmo, orari dei voli, stile di alloggio e budget. Così vivete l'Uzbekistan in modo più personale, flessibile e autentico, senza rigidi programmi di gruppo.",
    "jr.kicker":"Trova il tuo viaggio","jr.title":"Inizia il tuo racconto sulla Via della Seta","jr.tab.traveller":"Per viaggiatore","jr.tab.popular":"Più popolari","jr.tab.month":"Per mese","jr.tab.spotlight":"In evidenza","jr.for":"Viaggi per","jr.dest":"Destinazione","jr.tab.all":"Tutte","jr.tab.cities":"Città","jr.tab.nature":"Deserto e valli","card.couples":"Fughe lente e intime sulla Via della Seta","card.families":"Meraviglia per ogni generazione","card.groups":"Privato, guidato da esperti per pochi","card.honeymoons":"Solo voi due, indimenticabile","card.solo":"Viaggia da solo, mai in solitudine",
    "trips.title":"Scopri i nostri viaggi","trips.lead":"Itinerari iconici per accendere l'immaginazione.","trips.days10":"10 giorni","trips.days5":"5 giorni","trips.days4":"4 giorni","trips.days3":"3 giorni","trips.t1":"La via del Registan","trips.t2":"Bukhara e gli artigiani","trips.t3":"Le mura di Khiva","trips.t4":"Kyzylkum sotto le stelle","trips.p1":"da 4.950 € / pers.","trips.p2":"da 2.650 € / pers.","trips.p3":"da 2.150 € / pers.","trips.p4":"da 1.750 € / pers.","trips.explore":"Scopri il viaggio",
    "press.kicker":"Riconosciuti per","press.award":"Premio per il turismo responsabile","press.bespoke":"Specialista di viaggi su misura","press.expertise":"Competenza sulla Via della Seta","press.rated":"Valutati 5 stelle dai viaggiatori",
    "feature.kicker":"Viaggio signature","feature.title":"Notti sotto le stelle del Kyzylkum","feature.body":"Una fuga di punta nel silenzio del deserto: campi di yurte, piste di cammelli e un cielo che nessuna città offusca.","feature.cta":"Scopri il viaggio",
    "founders.kicker":"Cosa facciamo e perché","founders.title":"Nati per condividere la Via della Seta che amiamo","founders.body":"Mosaique è nato da due amici che tornavano di continuo in Uzbekistan e volevano condividerlo così come l'avevano conosciuto: attraverso le persone, l'artigianato e i momenti di quiete tra i monumenti.","founders.watch":"► Guarda il film",
    "pursuit.kicker":"La ricerca dell'emozione","pursuit.title":"Un viaggio che ti emoziona, non che ti sposta soltanto","pursuit.body":"Chiunque può portarti da A a B. Noi progettiamo l'istante in cui le spalle si rilassano e il luogo ti conquista: il richiamo alla preghiera su Bukhara, il fresco del cortile di una madrasa, il tè versato da chi ormai conosce il tuo nome.","pursuit.cta":"Esplora la collezione",
    "guide.kicker":"La nostra guida ai viaggi sulla Via della Seta","guide.title":"La Via della Seta, fatta come si deve","guide.body":"Qui il lusso non è marmo e oro. È una guida privata che coglie il tuo ritmo, una guesthouse con cortile prenotata per intero, una tavola apparecchiata in un caravanserraglio storico. Modelliamo ogni giornata sul tuo modo di viaggiare e restiamo un passo avanti perché tu non senta mai la logistica.","guide.cta":"Continua a leggere",
    "why.kicker":"Perché Mosaique","why.title":"Pianificato da esperti, seguito dall'inizio alla fine","why.c1":"Pianificatori affermati","why.c1d":"Specialisti che viaggiano costantemente in Uzbekistan.","why.c2":"Preventivi senza impegno","why.c2d":"Una proposta su misura prima di decidere.","why.c3":"Nessun costo di pianificazione","why.c3d":"Paghi il viaggio, non la burocrazia.","why.c4":"Assistenza sul posto 24/7","why.c4d":"Un team locale reperibile per tutto il viaggio.","why.c5":"Guide esperte private","why.c5d":"Guide selezionate che aprono porte autentiche.","why.reviews":"★★★★★ Giudicato eccellente dai viaggiatori lungo la Via della Seta",
    "ctaSec.title":"Pronto a iniziare il tuo viaggio?","ctaSec.body":"Raccontaci l'emozione che cerchi e progetteremo il resto.","ctaSec.button":"Contattaci",
    "cert.iata":"Accreditato IATA","cert.assoc":"Associazione viaggi su misura","cert.carbon":"Viaggi a basso impatto ambientale",
    "foot.expert":"Parla con un esperto","foot.touch":"Contattaci","foot.story":"La nostra storia","foot.useful":"Informazioni utili","foot.guide":"Guida di viaggio","foot.admin":"Admin","foot.privacy":"Informativa sulla privacy","foot.destinations":"Destinazioni","foot.experiences":"Esperienze","foot.stay":"Restiamo in contatto","foot.subscribe":"Iscriviti","foot.tagline":"Mosaique Journeys · Viaggi privati lungo la Via della Seta · mosaiquejourneys@gmail.com","foot.rights":"© 2026 Mosaique Journeys. Tutti i diritti riservati.","fb.kicker":"Recensioni dei viaggiatori","fb.title":"Condividi la tua esperienza","fb.lead":"Hai viaggiato con noi? Racconta ai futuri viaggiatori com'è stato il tuo viaggio.","fb.name":"Il tuo nome","fb.namePh":"es. Élise da Parigi","fb.rating":"La tua valutazione","fb.message":"La tua recensione","fb.messagePh":"Cosa ha reso memorabile il tuo viaggio?","fb.submit":"Invia recensione","fb.thanks":"Grazie! La tua recensione è stata condivisa.","fb.recent":"Recensioni recenti","price.kicker":"Prezzi trasparenti","price.title":"Viaggi su misura da €1.320 a persona","price.lead":"È il nostro prezzo di partenza per il pacchetto Standard. Poiché ogni viaggio è personalizzato, il prezzo finale dipende dalla durata del viaggio, dal numero di viaggiatori, dalla stagione, dalla categoria dell'hotel, dal trasporto e dalle esperienze scelte.","price.incTitle":"Il prezzo di partenza include","price.inc1":"Tutti i trasporti in Uzbekistan, compreso il treno ad alta velocità e i voli interni se necessari","price.inc2":"Comodi hotel da 3 a 5 stelle con colazione giornaliera","price.inc3":"Trasferimenti privati da aeroporto, stazione e hotel","price.inc4":"Guide professionali","price.inc5":"Biglietti d'ingresso a tutti i monumenti e musei del vostro itinerario","price.inc6":"Pianificazione del viaggio e assistenza","price.exTitle":"Non incluso","price.ex1":"Voli internazionali","price.ex2":"Assicurazione di viaggio","price.ex3":"Costi del visto (se applicabile)","price.ex4":"Pranzi e cene salvo dove specificato","price.ex5":"Spese personali","price.consult":"Prima di decidere, offriamo una consulenza di viaggio personale e gratuita: parliamo dei vostri interessi, del vostro stile di viaggio e delle vostre aspettative, poi creiamo un itinerario su misura e un preventivo trasparente, senza costi nascosti.","price.cta":"Richiedi la tua consulenza gratuita","enq.name":"Il tuo nome *","enq.email":"E-mail *","enq.dates":"Quando e per quanto","enq.party":"Viaggiatori","enq.dest":"Dove e interessi","enq.msg":"Raccontaci del tuo viaggio *","enq.send":"Invia richiesta","enq.privacy":"Usiamo i tuoi dati solo per pianificare il viaggio. Mai spam.","enq.datesPh":"es. maggio 2027, 10 giorni","enq.partyPh":"es. 2 adulti","enq.destPh":"Samarcanda, Bukhara, gastronomia, artigianato…","jd.highlights":"I punti salienti","jd.itinerary":"Giorno per giorno","jd.included":"Cosa è incluso","jd.excluded":"Cosa non è incluso","jd.route":"Il vostro itinerario","jd.ctaTitle":"Pronti a iniziare il vostro viaggio?","jd.ctaBody":"Diteci la sensazione che cercate e progettiamo il resto.","jd.back":"← Tutti i viaggi"
  }
};
(function () {
  var currentLang = "en";
  function apply(lang) {
    currentLang = lang;
    var dict = I18N[lang] || null;
    // Re-query each call so dynamically rendered nodes (e.g. Firestore-driven
    // landing cards) are translated too. data-en is captured lazily on first sight.
    document.querySelectorAll("[data-i18n]").forEach(function (n) {
      if (!n.hasAttribute("data-en")) n.setAttribute("data-en", n.textContent);
      var k = n.getAttribute("data-i18n");
      var en = n.getAttribute("data-en");
      n.textContent = !dict ? en : (dict[k] != null ? dict[k] : en);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (n) {
      if (!n.hasAttribute("data-en-ph")) n.setAttribute("data-en-ph", n.getAttribute("placeholder") || "");
      var k = n.getAttribute("data-i18n-placeholder");
      var en = n.getAttribute("data-en-ph");
      n.setAttribute("placeholder", !dict ? en : (dict[k] != null ? dict[k] : en));
    });
    document.documentElement.lang = lang;
    try { localStorage.setItem("mosaique_lang", lang); } catch (e) {}
    // Let language-aware modules (e.g. the journeys grid) re-render their content.
    document.dispatchEvent(new CustomEvent("mosaique:lang", { detail: lang }));
  }
  // Allow other modules to re-apply the current language after they inject DOM.
  window.__retranslate = function () { apply(currentLang); };
  var saved = "en";
  try { saved = localStorage.getItem("mosaique_lang") || "en"; } catch (e) {}
  var select = document.querySelector("[data-lang-select]");
  if (select) {
    select.value = saved;
    select.addEventListener("change", function () { apply(select.value); });
  }
  apply(saved);
})();

/* ── Runtime message translations (for JS-generated strings) ── */
var MSG = {
  enqErr: { en: "Please add your name, email, and a short message.", ru: "Пожалуйста, укажите имя, эл. почту и короткое сообщение.", de: "Bitte geben Sie Ihren Namen, Ihre E-Mail und eine kurze Nachricht an.", fr: "Veuillez indiquer votre nom, votre e-mail et un court message.", es: "Por favor, indique su nombre, correo electrónico y un breve mensaje.", it: "Inserisci il tuo nome, la tua e-mail e un breve messaggio." },
  enqSending: { en: "Sending…", ru: "Отправка…", de: "Wird gesendet…", fr: "Envoi…", es: "Enviando…", it: "Invio…" },
  enqSuccess: { en: "Thank you: we’ve received your enquiry and will reply within 24 hours.", ru: "Спасибо: мы получили ваш запрос и ответим в течение 24 часов.", de: "Vielen Dank: wir haben Ihre Anfrage erhalten und antworten innerhalb von 24 Stunden.", fr: "Merci: nous avons bien reçu votre demande et vous répondrons sous 24 heures.", es: "Gracias: hemos recibido su consulta y responderemos en un plazo de 24 horas.", it: "Grazie: abbiamo ricevuto la tua richiesta e risponderemo entro 24 ore." },
  enqError: { en: "Sorry, something went wrong. Please email mosaiquejourneys@gmail.com.", ru: "Извините, что-то пошло не так. Напишите нам на mosaiquejourneys@gmail.com.", de: "Entschuldigung, etwas ist schiefgelaufen. Bitte schreiben Sie an mosaiquejourneys@gmail.com.", fr: "Désolé, une erreur s’est produite. Écrivez-nous à mosaiquejourneys@gmail.com.", es: "Lo sentimos, algo salió mal. Escríbanos a mosaiquejourneys@gmail.com.", it: "Spiacenti, qualcosa è andato storto. Scrivi a mosaiquejourneys@gmail.com." },
  nlThanks: { en: "Thanks! You’re subscribed ✓", ru: "Спасибо! Вы подписаны ✓", de: "Danke! Sie sind angemeldet ✓", fr: "Merci ! Vous êtes abonné ✓", es: "¡Gracias! Está suscrito ✓", it: "Grazie! Sei iscritto ✓" },
  reviews: { en: "reviews", ru: "отзыв.", de: "Bewertungen", fr: "avis", es: "opiniones", it: "recensioni" }
};
function msg(key) {
  var lang = "en";
  try { lang = localStorage.getItem("mosaique_lang") || "en"; } catch (e) {}
  var m = MSG[key] || {};
  return m[lang] || m.en || "";
}

/* ── Guest feedback ── */
(function () {
  var form = document.querySelector("[data-feedback-form]");
  if (!form) return;
  var listEl = document.querySelector("[data-feedback-list]");
  var thanks = document.querySelector("[data-feedback-thanks]");
  var starWrap = document.querySelector("[data-star-input]");
  var stars = starWrap ? Array.prototype.slice.call(starWrap.querySelectorAll(".star")) : [];
  var nameInput = form.querySelector('[name="name"]');
  var msgInput = form.querySelector('[name="message"]');
  var rating = 5;
  var KEY = "mosaique_feedback";
  var seed = [
    { name: "Élise, Paris", rating: 5, message: "Standing under the Registan at sunrise is something I will never forget. Every detail was handled." },
    { name: "Marco, Milan", rating: 5, message: "Our guide opened doors we would never have found alone, a silk weaver's home, a baker's courtyard." },
    { name: "Sofia, Madrid", rating: 5, message: "Khiva at night, entirely to ourselves. Effortless and deeply personal from start to finish." }
  ];
  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (Array.isArray(s) && s.length) return s; } catch (e) {}
    return seed.slice();
  }
  function save(list) { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} }
  function starString(n) { var out = ""; for (var i = 0; i < 5; i++) out += i < n ? "★" : "☆"; return out; }
  function initials(name) {
    var parts = name.replace(/[^a-zA-ZÀ-ɏ ]/g, "").trim().split(/\s+/);
    var a = parts[0] ? parts[0][0] : "";
    var b = parts[1] ? parts[1][0] : "";
    return (a + b).toUpperCase() || "★";
  }
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function makeCard(item) {
    var wrap = document.createElement("article");
    wrap.className = "feedback-item";
    var st = document.createElement("div");
    st.className = "feedback-item-stars";
    st.textContent = starString(item.rating);
    var msg = document.createElement("blockquote");
    msg.className = "feedback-item-msg";
    msg.textContent = "“" + item.message + "”";
    var nm = document.createElement("p");
    nm.className = "feedback-item-name";
    nm.textContent = item.name;
    wrap.appendChild(st); wrap.appendChild(msg); wrap.appendChild(nm);
    return wrap;
  }
  function render(list) {
    listEl.innerHTML = "";
    // rating summary
    if (list.length) {
      var avg = list.reduce(function (s, i) { return s + (i.rating || 0); }, 0) / list.length;
      var sum = document.createElement("div");
      sum.className = "feedback-summary";
      var score = document.createElement("span");
      score.className = "feedback-summary-score";
      score.textContent = avg.toFixed(1);
      var sstars = document.createElement("span");
      sstars.className = "feedback-summary-stars";
      sstars.textContent = starString(Math.round(avg));
      var count = document.createElement("span");
      count.className = "feedback-summary-count";
      count.textContent = list.length + " " + msg("reviews");
      sum.appendChild(score); sum.appendChild(sstars); sum.appendChild(count);
      listEl.appendChild(sum);
    }
    // Static editorial pull-quotes: a curated few, no auto-scroll
    var wall = document.createElement("div");
    wall.className = "feedback-wall";
    list.slice(0, 3).forEach(function (item) {
      wall.appendChild(makeCard(item));
    });
    listEl.appendChild(wall);
  }
  function setRating(n) {
    rating = n;
    stars.forEach(function (s, i) { s.classList.toggle("is-on", i < n); });
  }
  stars.forEach(function (s) {
    s.addEventListener("click", function () { setRating(parseInt(s.getAttribute("data-value"), 10)); });
  });
  setRating(5);
  var data = load();
  render(data);
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = (nameInput.value || "").trim();
    var message = (msgInput.value || "").trim();
    if (!name || !message) return;
    // Send to the agency (Firestore, pending moderation). Matches firestore.rules
    // /reviews: name+message non-empty, rating is number, approved === false.
    if (window.firebase && firebase.firestore) {
      firebase.firestore().collection("reviews").add({
        name: name,
        rating: rating,
        message: message,
        approved: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      }).catch(function () {});
    }
    // Also show it immediately to this visitor.
    data.unshift({ name: name, rating: rating, message: message });
    save(data);
    render(data);
    form.reset();
    setRating(5);
    if (thanks) {
      thanks.hidden = false;
      setTimeout(function () { thanks.hidden = true; }, 4000);
    }
  });
})();

/* ── Philosophy spotlight reveal + click burst ── */
(function () {
  var sec = document.querySelector("[data-spotlight]");
  if (!sec) return;
  if (window.matchMedia("(hover: hover)").matches) {
    sec.addEventListener("pointermove", function (e) {
      var r = sec.getBoundingClientRect();
      sec.style.setProperty("--mx", (e.clientX - r.left) + "px");
      sec.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
    sec.addEventListener("pointerenter", function () { sec.classList.add("is-spotlight"); });
    sec.addEventListener("pointerleave", function () { sec.classList.remove("is-spotlight"); });
  }
  var burstTimer = null;
  sec.addEventListener("click", function (e) {
    if (e.target.closest("a, button, input, select, textarea")) return;
    var r = sec.getBoundingClientRect();
    sec.style.setProperty("--cx", (e.clientX - r.left) + "px");
    sec.style.setProperty("--cy", (e.clientY - r.top) + "px");
    sec.classList.remove("is-burst");
    void sec.offsetWidth;
    sec.classList.add("is-burst");
    clearTimeout(burstTimer);
    burstTimer = setTimeout(function () { sec.classList.remove("is-burst"); }, 2400);
  });
})();

/* ── 3D tilt + glare on journey & trip cards ── */
(function () {
  if (!window.matchMedia("(hover: hover)").matches) return;
  var cards = document.querySelectorAll(".journey-card, .trip-card");
  cards.forEach(function (card) {
    var glare = document.createElement("span");
    glare.className = "card-glare";
    card.appendChild(glare);
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      var rx = (0.5 - py) * 9;
      var ry = (px - 0.5) * 11;
      card.style.transform =
        "perspective(900px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg) translateY(-4px)";
      glare.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
      glare.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
      glare.style.opacity = "1";
    });
    card.addEventListener("pointerleave", function () {
      card.style.transform = "";
      glare.style.opacity = "0";
    });
  });
})();

/* ── Night-band random star field ── */
(function () {
  var band = document.querySelector(".feature-band");
  if (!band) return;
  var layer = document.createElement("div");
  layer.className = "band-stars";
  layer.setAttribute("aria-hidden", "true");
  var html = "";
  for (var i = 0; i < 40; i++) {
    var size = (Math.random() * 1.3 + 0.6).toFixed(2);
    var top = (Math.random() * 48).toFixed(2);
    var left = (Math.random() * 100).toFixed(2);
    var base = (Math.random() * 0.5 + 0.2).toFixed(2);
    var dur = (Math.random() * 4 + 2).toFixed(2);
    var delay = (Math.random() * 6).toFixed(2);
    html +=
      '<span class="star" style="width:' + size + "px;height:" + size +
      "px;top:" + top + "%;left:" + left + "%;--base:" + base +
      ";--dur:" + dur + "s;--delay:" + delay + 's"></span>';
  }
  layer.innerHTML = html;
  band.appendChild(layer);
})();

/* ── Magnetic CTA button ── */
(function () {
  if (!window.matchMedia("(hover: hover)").matches) return;
  var btn = document.querySelector("#enquire .button");
  if (!btn) return;
  btn.addEventListener("pointermove", function (e) {
    var r = btn.getBoundingClientRect();
    var x = e.clientX - (r.left + r.width / 2);
    var y = e.clientY - (r.top + r.height / 2);
    btn.style.transform = "translate(" + (x * 0.3).toFixed(1) + "px," + (y * 0.45).toFixed(1) + "px)";
  });
  btn.addEventListener("pointerleave", function () { btn.style.transform = ""; });
})();

// Pre-fill enquiry form if arriving from a journey detail page
(function () {
  try {
    var stored = localStorage.getItem("mosaique_enquiry_journey");
    if (!stored) return;
    localStorage.removeItem("mosaique_enquiry_journey");
    var destInput = document.querySelector('[data-enquiry-form] [name="destinations"]');
    if (destInput) destInput.value = stored;
  } catch (e) {}
})();

/* ── Trip enquiry form → Firestore "enquiries" (shows in the agency admin) ── */
(function () {
  var form = document.querySelector("[data-enquiry-form]");
  if (!form) return;
  var statusEl = form.querySelector("[data-enquiry-status]");
  var submit = form.querySelector('button[type="submit"]');

  function setStatus(msg, kind) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.hidden = false;
    statusEl.className = "enquiry-status" + (kind ? " is-" + kind : "");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = {
      name: (form.name.value || "").trim(),
      email: (form.email.value || "").trim(),
      dates: (form.dates.value || "").trim(),
      party: (form.party.value || "").trim(),
      destinations: (form.destinations.value || "").trim(),
      message: (form.message.value || "").trim(),
    };
    if (!data.name || !data.email || !data.message) {
      setStatus(msg("enqErr"), "error");
      return;
    }

    // No backend available → fall back to opening the user's email client.
    if (!(window.firebase && firebase.firestore)) {
      var body = encodeURIComponent(
        "Name: " + data.name + "\nEmail: " + data.email + "\nWhen: " + data.dates +
        "\nTravellers: " + data.party + "\nInterests: " + data.destinations +
        "\n\n" + data.message
      );
      window.location.href = "mailto:mosaiquejourneys@gmail.com?subject=" +
        encodeURIComponent("Trip enquiry from " + data.name) + "&body=" + body;
      return;
    }

    submit.disabled = true;
    var original = submit.textContent;
    submit.textContent = msg("enqSending");
    data.status = "new";
    data.source = "website";
    data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    firebase.firestore().collection("enquiries").add(data)
      .then(function () {
        form.reset();
        setStatus(msg("enqSuccess"), "ok");
      })
      .catch(function () {
        setStatus(msg("enqError"), "error");
      })
      .finally(function () {
        submit.disabled = false;
        submit.textContent = original;
      });
  });
})();

/* ── Newsletter signups → Firestore "subscribers" ── */
(function () {
  var forms = document.querySelectorAll(".newsletter-bar-form, .footer-form");
  if (!forms.length) return;
  forms.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"], input[type="text"]');
      var email = input ? (input.value || "").trim() : "";
      if (!email || email.indexOf("@") < 1) {
        if (input) { input.focus(); }
        return;
      }
      var done = function () {
        form.reset();
        if (input) {
          input.setAttribute("placeholder", msg("nlThanks"));
          input.blur();
        }
      };
      if (window.firebase && firebase.firestore) {
        firebase.firestore().collection("subscribers").add({
          email: email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        }).then(done, done);
      } else {
        done();
      }
    });
  });
})();

/* ── Gallery ───────────────────────────────────────────────────
   A curated journal of the latest journey photographs. The grid
   uses lightweight display copies; the lightbox opens the larger
   files and always preserves the photograph's original crop.
   ────────────────────────────────────────────────────────────── */
(function () {
  var GRID = "assets/gallery/2026/grid/";
  var FULL = "assets/gallery/2026/full/";

  // [file, story, caption, aspect ratio]. The order deliberately mixes
  // landmarks, people, craft, food and landscapes for an editorial rhythm.
  var PHOTOS = [
    ["journey-01.jpg", "landmarks", "Shah-i-Zinda, a passage of blue", 0.75],
    ["journey-41.jpg", "craft", "The potter at his wheel", 0.47],
    ["journey-12.jpg", "table", "Plov, shared at the table", 1.78],
    ["journey-34.jpg", "craft", "Suzani stitched in the open air", 0.75],
    ["journey-25.jpg", "landscapes", "A village cradled by mountains", 1.33],
    ["journey-55.jpg", "people", "Music in a tiled Khiva courtyard", 0.56],
    ["journey-23.jpg", "landmarks", "A sanctuary under open skies", 1.33],
    ["journey-42.jpg", "craft", "Natural dyes and silk thread", 0.75],
    ["journey-50.jpg", "table", "Golden pastries on painted ceramics", 0.75],
    ["journey-43.jpg", "landscapes", "Walking through the cotton fields", 2.14],
    ["journey-35.jpg", "people", "Traditional dance in the old city", 0.47],
    ["journey-60.jpg", "landmarks", "Bukhara framed at golden hour", 0.75],
    ["journey-18.jpg", "craft", "The potter at work", 0.75],
    ["journey-31.jpg", "landmarks", "Islam Khoja rising above Khiva", 0.75],
    ["journey-38.jpg", "table", "Pomegranate season at the bazaar", 1.33],
    ["journey-48.jpg", "craft", "Every stitch made by hand", 0.47],
    ["journey-02.jpg", "landmarks", "A turquoise dome between portals", 0.75],
    ["journey-46.jpg", "table", "Plov served from the kazan", 0.47],
    ["journey-59.jpg", "craft", "A bazaar of painted ceramics", 0.75],
    ["journey-33.jpg", "people", "A welcome in the family courtyard", 1.33],
    ["journey-21.jpg", "table", "Melons in afternoon light", 0.75],
    ["journey-63.jpg", "craft", "Suzani, a garden stitched in silk", 0.75],
    ["journey-64.jpg", "craft", "A modern mosaic in ceramic", 0.75],
    ["journey-13.jpg", "table", "Bread from the clay oven", 0.75],
    ["journey-29.jpg", "landmarks", "The blue courtyard of Tash Hauli", 0.75],
    ["journey-06.jpg", "landmarks", "Turquoise relief tilework", 0.75],
    ["journey-52.jpg", "craft", "The sound of the Silk Road", 0.75],
    ["journey-54.jpg", "table", "A feast of hand-folded dumplings", 0.56],
    ["journey-56.jpg", "landmarks", "Khiva unfolding below the minaret", 0.56],
    ["journey-09.jpg", "craft", "A miniature painted on handmade paper", 0.75],
    ["journey-24.jpg", "people", "A school morning beneath the minaret", 0.75],
    ["journey-40.jpg", "craft", "Suzani from wall to wall", 0.75],
    ["journey-26.jpg", "landscapes", "Mist over the mountain reservoir", 1.33],
    ["journey-44.jpg", "craft", "Handmade puppets of Uzbekistan", 0.75],
    ["journey-22.jpg", "landmarks", "A garden sanctuary beneath turquoise domes", 0.75],
    ["journey-58.jpg", "craft", "The loom room", 0.75],
    ["journey-10.jpg", "craft", "The elephant, drawn in a thousand details", 1.33],
    ["journey-03.jpg", "landmarks", "Timurid calligraphy in glazed tile", 0.75],
    ["journey-51.jpg", "people", "A ceramics lesson with local masters", 0.56],
    ["journey-61.jpg", "landmarks", "Tashkent's modernist icon", 0.75],
    ["journey-15.jpg", "craft", "The traditional oil mill", 0.75],
    ["journey-45.jpg", "craft", "The legendary stork scissors", 0.47],
    ["journey-32.jpg", "landmarks", "Kalta Minor at sunset", 0.75],
    ["journey-19.jpg", "craft", "Traditional embroidery, made by hand", 0.75],
    ["journey-27.jpg", "landmarks", "The tiled gates of Kokand", 0.75],
    ["journey-47.jpg", "landmarks", "An old door, burnished by time", 0.47],
    ["journey-11.jpg", "craft", "Handmade paper drying in the studio", 1.33],
    ["journey-57.jpg", "table", "Morning abundance at the market", 0.56],
    ["journey-04.jpg", "landmarks", "Ancient script caught in shadow", 0.75],
    ["journey-39.jpg", "craft", "Copper catching the morning light", 0.75],
    ["journey-62.jpg", "landmarks", "A turquoise dome in contemporary Tashkent", 0.75],
    ["journey-07.jpg", "craft", "Rolls of handmade mulberry paper", 0.75],
    ["journey-30.jpg", "landmarks", "A minaret in the evening light", 0.75],
    ["journey-53.jpg", "craft", "Hand-painted bowls from the workshop", 1.33],
    ["journey-36.jpg", "craft", "The blacksmith's vaulted workshop", 0.75],
    ["journey-16.jpg", "craft", "Inside the old mill", 0.75],
    ["journey-28.jpg", "landmarks", "Pomegranate blossom and turquoise domes", 0.75],
    ["journey-49.jpg", "craft", "Carved doorway in the old city", 0.47],
    ["journey-08.jpg", "craft", "Sheets of handmade mulberry paper", 0.75],
    ["journey-20.jpg", "craft", "Ikat in every colour", 0.75],
    ["journey-37.jpg", "craft", "Carving stories into wood", 0.47],
    ["journey-14.jpg", "people", "Guests at a village workshop", 0.75],
    ["journey-17.jpg", "craft", "Ceramics in a family workshop", 0.75],
    ["journey-05.jpg", "landmarks", "Shah-i-Zinda tilework", 0.75]
  ];

  var STORIES = [
    { key: "all", labels: { en: "All stories", ru: "Все истории", de: "Alle Geschichten", fr: "Toutes les histoires", es: "Todas las historias", it: "Tutte le storie" } },
    { key: "landmarks", labels: { en: "Landmarks", ru: "Памятники", de: "Bauwerke", fr: "Monuments", es: "Monumentos", it: "Monumenti" } },
    { key: "craft", labels: { en: "Craft & culture", ru: "Ремёсла и культура", de: "Handwerk & Kultur", fr: "Artisanat & culture", es: "Artesanía y cultura", it: "Artigianato e cultura" } },
    { key: "table", labels: { en: "At the table", ru: "За столом", de: "Zu Tisch", fr: "À table", es: "A la mesa", it: "A tavola" } },
    { key: "people", labels: { en: "People", ru: "Люди", de: "Menschen", fr: "Rencontres", es: "Personas", it: "Persone" } },
    { key: "landscapes", labels: { en: "Landscapes", ru: "Пейзажи", de: "Landschaften", fr: "Paysages", es: "Paisajes", it: "Paesaggi" } }
  ];

  var ARIA = {
    "gal.close": { en: "Close", ru: "Закрыть", de: "Schließen", fr: "Fermer", es: "Cerrar", it: "Chiudi" },
    "gal.prev": { en: "Previous photograph", ru: "Предыдущее фото", de: "Vorheriges Foto", fr: "Photo précédente", es: "Foto anterior", it: "Foto precedente" },
    "gal.next": { en: "Next photograph", ru: "Следующее фото", de: "Nächstes Foto", fr: "Photo suivante", es: "Foto siguiente", it: "Foto successiva" }
  };

  var STEP = 12;

  var grid = document.querySelector("[data-gallery-grid]");
  var filterBar = document.querySelector("[data-gallery-filters]");
  var moreBtn = document.querySelector("[data-gallery-more]");
  var box = document.querySelector("[data-lightbox]");
  if (!grid || !filterBar || !moreBtn || !box) return;

  var boxImg = box.querySelector("[data-lightbox-img]");
  var boxPlace = box.querySelector("[data-lightbox-place]");
  var boxTitle = box.querySelector("[data-lightbox-title]");
  var boxCount = box.querySelector("[data-lightbox-count]");

  var active = "all";
  var shown = STEP;
  var visible = [];
  var cursor = -1;
  var lastFocus = null;

  function currentLang() {
    return (document.documentElement.lang || "en").toLowerCase().split("-")[0];
  }

  function placeLabel(key) {
    var p = STORIES.filter(function (x) { return x.key === key; })[0];
    if (!p) return "";
    return p.labels[currentLang()] || p.labels.en;
  }

  function matching() {
    return active === "all" ? PHOTOS : PHOTOS.filter(function (p) { return p[1] === active; });
  }

  var reveal = "IntersectionObserver" in window
    ? new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-revealed");
          obs.unobserve(e.target);
        });
      }, { rootMargin: "80px" })
    : null;

  function buildFilters() {
    STORIES.forEach(function (p) {
      var n = p.key === "all" ? PHOTOS.length : PHOTOS.filter(function (x) { return x[1] === p.key; }).length;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gallery-filter" + (p.key === active ? " is-active" : "");
      btn.setAttribute("data-filter", p.key);
      btn.setAttribute("aria-pressed", p.key === active ? "true" : "false");
      btn.innerHTML = '<span class="gallery-filter-label">' + placeLabel(p.key) + "</span>" +
        '<span class="gallery-filter-count">' + n + "</span>";
      btn.addEventListener("click", function () {
        if (active === p.key) return;
        active = p.key;
        shown = STEP;
        filterBar.querySelectorAll(".gallery-filter").forEach(function (b) {
          var on = b.getAttribute("data-filter") === active;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-pressed", on ? "true" : "false");
        });
        render();
      });
      filterBar.appendChild(btn);
    });
  }

  function localiseFilters() {
    filterBar.querySelectorAll(".gallery-filter").forEach(function (btn) {
      var label = btn.querySelector(".gallery-filter-label");
      if (label) label.textContent = placeLabel(btn.getAttribute("data-filter"));
    });
  }

  function render() {
    visible = matching();
    var slice = visible.slice(0, shown);
    grid.innerHTML = "";

    slice.forEach(function (p, i) {
      var tile = document.createElement("button");
      tile.type = "button";
      tile.className = "gallery-tile";
      tile.setAttribute("data-index", i);
      tile.setAttribute("aria-label", "Open photograph: " + p[2]);

      var img = document.createElement("img");
      img.src = GRID + p[0];
      img.alt = p[2] + ", Uzbekistan";
      img.loading = i < 6 ? "eager" : "lazy";
      img.decoding = "async";
      img.sizes = "(max-width: 620px) 50vw, (max-width: 900px) 50vw, (max-width: 1280px) 33vw, 25vw";
      // Reserve the box so masonry does not reflow as photographs arrive.
      img.width = 1000;
      img.height = Math.round(1000 / p[3]);

      var cap = document.createElement("figcaption");
      cap.className = "gallery-caption";
      cap.innerHTML = '<span class="gallery-place"></span><span class="gallery-title"></span>';
      cap.querySelector(".gallery-place").textContent = placeLabel(p[1]);
      cap.querySelector(".gallery-title").textContent = p[2];

      tile.appendChild(img);
      tile.appendChild(cap);
      tile.addEventListener("click", function () { open(i); });
      grid.appendChild(tile);

      if (reveal) reveal.observe(tile); else tile.classList.add("is-revealed");
    });

    var left = visible.length - slice.length;
    moreBtn.hidden = left <= 0;
    if (!moreBtn.hidden) {
      // The label is translated; the count sits in its own node so the
      // i18n pass (which overwrites textContent) cannot swallow it.
      moreBtn.innerHTML = '<span data-i18n="gal.more">Show more photographs</span>' +
        '<span class="gallery-more-count">' + left + "</span>";
    }
    if (window.__retranslate) window.__retranslate();
  }

  moreBtn.addEventListener("click", function () {
    shown += STEP;
    render();
  });

  /* ── Lightbox ── */

  function show(i) {
    var p = visible[i];
    if (!p) return;
    cursor = i;
    boxImg.src = FULL + p[0];
    boxImg.alt = p[2] + ", Uzbekistan";
    boxPlace.textContent = placeLabel(p[1]);
    boxTitle.textContent = p[2];
    boxCount.textContent = (i + 1) + " / " + visible.length;
  }

  function open(i) {
    lastFocus = document.activeElement;
    box.hidden = false;
    document.body.classList.add("lightbox-open");
    show(i);
    requestAnimationFrame(function () { box.classList.add("is-open"); });
    box.querySelector("[data-lightbox-close]").focus();
  }

  function close() {
    box.classList.remove("is-open");
    document.body.classList.remove("lightbox-open");
    window.setTimeout(function () {
      box.hidden = true;
      boxImg.removeAttribute("src");
    }, 320);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function step(d) {
    if (!visible.length) return;
    show((cursor + d + visible.length) % visible.length);
  }

  box.querySelector("[data-lightbox-close]").addEventListener("click", close);
  box.querySelector("[data-lightbox-prev]").addEventListener("click", function () { step(-1); });
  box.querySelector("[data-lightbox-next]").addEventListener("click", function () { step(1); });
  box.addEventListener("click", function (e) { if (e.target === box) close(); });

  document.addEventListener("keydown", function (e) {
    if (box.hidden) return;
    if (e.key === "Escape") { close(); }
    else if (e.key === "ArrowLeft") { step(-1); }
    else if (e.key === "ArrowRight") { step(1); }
  });

  function localiseAria(lang) {
    Object.keys(ARIA).forEach(function (k) {
      var n = box.querySelector('[data-i18n-aria="' + k + '"]');
      if (n) n.setAttribute("aria-label", ARIA[k][lang] || ARIA[k].en);
    });
  }

  document.addEventListener("mosaique:lang", function (e) {
    localiseAria(e.detail);
    localiseFilters();
    // Captions and filter chips carry the language; redraw what is on screen.
    grid.querySelectorAll(".gallery-tile").forEach(function (tile, i) {
      var p = visible[i];
      if (!p) return;
      tile.querySelector(".gallery-place").textContent = placeLabel(p[1]);
    });
    if (!box.hidden && visible[cursor]) boxPlace.textContent = placeLabel(visible[cursor][1]);
  });

  buildFilters();
  render();
  localiseAria(document.documentElement.lang || "en");
})();
