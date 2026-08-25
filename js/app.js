const STATUS_LABELS = {
  "a-essayer": "À essayer",
  "en-cours": "En cours",
  termine: "Terminé",
  "coup-de-coeur": "Coup de cœur",
  ecarte: "Écarté",
};

const els = {
  alert: document.getElementById("update-alert"),
  sections: document.getElementById("game-sections"),
  empty: document.getElementById("empty-state"),
  count: document.getElementById("results-count"),
  search: document.getElementById("search-input"),
  category: document.getElementById("filter-category"),
  genre: document.getElementById("filter-genre"),
  platform: document.getElementById("filter-platform"),
  status: document.getElementById("filter-status"),
  proposedBy: document.getElementById("filter-proposedBy"),
  sort: document.getElementById("sort-by"),
  modalOverlay: document.getElementById("modal-overlay"),
  modalContent: document.getElementById("modal-content"),
  modalClose: document.getElementById("modal-close"),
};

function categoryLabel(id) {
  const category = CATEGORIES.find((c) => c.id === id);
  return category ? category.label : id;
}

function uniqueValues(items, getter) {
  const set = new Set();
  items.forEach((item) => {
    const value = getter(item);
    if (Array.isArray(value)) {
      value.forEach((v) => v && set.add(v));
    } else if (value) {
      set.add(value);
    }
  });
  return [...set].sort((a, b) => a.localeCompare(b));
}

function populateSelect(select, values, labelFn) {
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = labelFn ? labelFn(value) : value;
    select.appendChild(option);
  });
}

function averageRating(game) {
  const rated = (game.reviews || []).filter((r) => typeof r.rating === "number");
  if (rated.length === 0) return null;
  const sum = rated.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / rated.length) * 10) / 10;
}

// --- Mises à jour à venir -------------------------------------------------

// Seuil (en jours) en dessous duquel une MAJ majeure est considérée imminente
// et signalée en rouge plutôt qu'en simple "à venir".
const IMMINENT_DAYS = 60;

function today() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// Nombre de jours entre aujourd'hui et une date ISO. null si pas de date.
function daysUntil(dateISO) {
  if (!dateISO) return null;
  const target = new Date(dateISO + "T00:00:00");
  if (Number.isNaN(target.getTime())) return null;
  return Math.round((target - today()) / 86400000);
}

function formatCountdown(days) {
  if (days === 0) return "aujourd'hui";
  if (days === 1) return "demain";
  if (days > 0) return `dans ${days} jours`;
  return "déjà sortie";
}

// La MAJ majeure à venir la plus proche pour un jeu, ou null.
function nextMajorUpdate(game) {
  const upcoming = (game.roadmap || [])
    .map((entry) => ({ entry, days: daysUntil(entry.dateISO) }))
    .filter((r) => r.entry.major && r.days !== null && r.days >= 0)
    .sort((a, b) => a.days - b.days);
  return upcoming.length ? upcoming[0] : null;
}

function extractYoutubeId(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/
  );
  return match ? match[1] : null;
}

function getFilteredSortedGames() {
  const search = els.search.value.trim().toLowerCase();
  const category = els.category.value;
  const genre = els.genre.value;
  const platform = els.platform.value;
  const status = els.status.value;
  const proposedBy = els.proposedBy.value;
  const sortBy = els.sort.value;

  const result = GAMES_DATA.filter((game) => {
    if (search && !game.name.toLowerCase().includes(search)) return false;
    if (category && game.category !== category) return false;
    if (genre && !(game.genre || []).includes(genre)) return false;
    if (platform && !(game.platforms || []).includes(platform)) return false;
    if (status && game.status !== status) return false;
    if (proposedBy && game.proposedBy !== proposedBy) return false;
    return true;
  });

  result.sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "status") return (a.status || "").localeCompare(b.status || "");
    if (sortBy === "rating") {
      const ra = averageRating(a) ?? -1;
      const rb = averageRating(b) ?? -1;
      return rb - ra;
    }
    return 0;
  });

  return result;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}

function renderCard(game) {
  const card = document.createElement("article");
  card.className = "game-card";
  card.tabIndex = 0;
  card.addEventListener("click", () => openModal(game));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal(game);
    }
  });

  const rating = averageRating(game);
  const nextMajor = nextMajorUpdate(game);

  if (nextMajor) card.classList.add("has-major-update");

  const majorBanner = nextMajor
    ? `<div class="card-update ${
        nextMajor.days <= IMMINENT_DAYS ? "imminent" : ""
      }">
         <strong>${escapeHtml(nextMajor.entry.title)}</strong>
         <span>${escapeHtml(nextMajor.entry.date)} · ${formatCountdown(
        nextMajor.days
      )}</span>
       </div>`
    : "";

  card.innerHTML = `
    ${majorBanner}
    <h3>${escapeHtml(game.name)}</h3>
    <div class="badge-row">
      <span class="badge status-${game.status}">${
    STATUS_LABELS[game.status] || game.status
  }</span>
      ${(game.genre || [])
        .map((g) => `<span class="badge">${escapeHtml(g)}</span>`)
        .join("")}
    </div>
    <p class="card-desc">${escapeHtml(game.description || "")}</p>
    <div class="card-meta">
      <span>👥 ${escapeHtml(game.players || "?")}</span>
      <span>🖥️ ${(game.platforms || []).map(escapeHtml).join(", ")}</span>
      ${
        game.cons
          ? `<span class="card-cons">⚠️ ${escapeHtml(game.cons)}</span>`
          : ""
      }
    </div>
    <div class="card-footer">
      <span>Proposé par ${escapeHtml(game.proposedBy || "?")}</span>
      ${rating !== null ? `<span class="rating-pill">★ ${rating}/10</span>` : ""}
    </div>
  `;
  return card;
}

// Bandeau en haut de page : les MAJ majeures imminentes, tous jeux confondus.
// Indépendant des filtres — c'est une info qui ne doit pas pouvoir être ratée.
function renderUpdateAlert() {
  const upcoming = GAMES_DATA.map((game) => ({
    game,
    next: nextMajorUpdate(game),
  }))
    .filter((r) => r.next && r.next.days <= IMMINENT_DAYS)
    .sort((a, b) => a.next.days - b.next.days);

  if (upcoming.length === 0) {
    els.alert.innerHTML = "";
    els.alert.classList.add("hidden");
    return;
  }

  els.alert.classList.remove("hidden");
  els.alert.innerHTML = `
    <h2>⚠️ ${upcoming.length} mise${upcoming.length > 1 ? "s" : ""} à jour
      majeure${upcoming.length > 1 ? "s" : ""} à venir</h2>
    <ul>
      ${upcoming
        .map(
          ({ game, next }) => `
        <li>
          <button type="button" class="alert-game" data-game-id="${escapeHtml(
            game.id
          )}">${escapeHtml(game.name)}</button>
          — ${escapeHtml(next.entry.title)},
          <strong>${escapeHtml(next.entry.date)}</strong>
          (${formatCountdown(next.days)}).
          ${escapeHtml(next.entry.description || "")}
        </li>`
        )
        .join("")}
    </ul>
  `;

  els.alert.querySelectorAll(".alert-game").forEach((btn) => {
    btn.addEventListener("click", () => {
      const game = GAMES_DATA.find((g) => g.id === btn.dataset.gameId);
      if (game) openModal(game);
    });
  });
}

function render() {
  const games = getFilteredSortedGames();
  els.sections.innerHTML = "";

  CATEGORIES.forEach((category) => {
    const inCategory = games.filter((g) => g.category === category.id);
    if (inCategory.length === 0) return;

    const section = document.createElement("section");
    section.className = "category-section";

    const header = document.createElement("div");
    header.className = "category-header";
    header.innerHTML = `
      <h2>${escapeHtml(category.label)}
        <span class="category-count">${inCategory.length}</span>
      </h2>
      ${
        category.description
          ? `<p class="muted">${escapeHtml(category.description)}</p>`
          : ""
      }
    `;
    section.appendChild(header);

    const grid = document.createElement("div");
    grid.className = "game-grid";
    inCategory.forEach((game) => grid.appendChild(renderCard(game)));
    section.appendChild(grid);

    els.sections.appendChild(section);
  });

  // Jeux dont la catégorie n'existe pas (ou pas renseignée).
  const uncategorized = games.filter(
    (g) => !CATEGORIES.some((c) => c.id === g.category)
  );
  if (uncategorized.length > 0) {
    const section = document.createElement("section");
    section.className = "category-section";
    section.innerHTML = `<div class="category-header"><h2>Sans catégorie
      <span class="category-count">${uncategorized.length}</span></h2></div>`;
    const grid = document.createElement("div");
    grid.className = "game-grid";
    uncategorized.forEach((game) => grid.appendChild(renderCard(game)));
    section.appendChild(grid);
    els.sections.appendChild(section);
  }

  els.empty.classList.toggle("hidden", games.length > 0);
  els.count.textContent = `${games.length} jeu${games.length > 1 ? "x" : ""}`;
}

function openModal(game) {
  const rating = averageRating(game);
  const youtubeId = extractYoutubeId(game.trailerUrl);

  const videoHtml = youtubeId
    ? `<div class="video-frame"><iframe src="https://www.youtube.com/embed/${youtubeId}" title="Bande-annonce ${escapeHtml(
        game.name
      )}" allowfullscreen></iframe></div>`
    : `<p class="muted">Pas de bande-annonce renseignée pour l'instant.</p>`;

  const criticHtml = game.criticScore
    ? `<p><strong>${escapeHtml(game.criticScore.source)}</strong> : ${escapeHtml(
        game.criticScore.score
      )}${
        game.criticScore.url
          ? ` — <a href="${escapeHtml(
              game.criticScore.url
            )}" target="_blank" rel="noopener">voir la source</a>`
          : ""
      }</p>`
    : `<p class="muted">Pas de note presse renseignée.</p>`;

  const reviewsHtml =
    game.reviews && game.reviews.length
      ? game.reviews
          .map(
            (r) => `
        <div class="review-item">
          <div class="review-head">
            <span>${escapeHtml(r.author)}</span>
            ${typeof r.rating === "number" ? `<span>${r.rating}/10</span>` : ""}
          </div>
          <p>${escapeHtml(r.comment || "")}</p>
        </div>`
          )
          .join("")
      : `<p class="muted">Aucun avis pour l'instant.</p>`;

  const roadmapHtml =
    game.roadmap && game.roadmap.length
      ? [...game.roadmap]
          // Les MAJ à venir d'abord (la plus proche en tête), le passé ensuite.
          .sort((a, b) => {
            const da = daysUntil(a.dateISO);
            const db = daysUntil(b.dateISO);
            const rank = (d) => (d === null ? 1 : d >= 0 ? 0 : 2);
            if (rank(da) !== rank(db)) return rank(da) - rank(db);
            if (da === null || db === null) return 0;
            return da >= 0 ? da - db : db - da;
          })
          .map((r) => {
            const days = daysUntil(r.dateISO);
            const isUpcoming = days !== null && days >= 0;
            const isImminent = isUpcoming && days <= IMMINENT_DAYS;
            const classes = [
              "roadmap-item",
              r.major ? "major" : "",
              isImminent ? "imminent" : "",
              days !== null && days < 0 ? "past" : "",
            ]
              .filter(Boolean)
              .join(" ");

            const pill = isUpcoming
              ? `<span class="roadmap-pill ${
                  isImminent ? "imminent" : ""
                }">${formatCountdown(days)}</span>`
              : days !== null
              ? `<span class="roadmap-pill past">déjà sortie</span>`
              : `<span class="roadmap-pill">date inconnue</span>`;

            return `
        <div class="${classes}">
          <div class="roadmap-date">${escapeHtml(r.date || "")}</div>
          <div>
            <strong>${escapeHtml(r.title || "")}</strong>
            ${r.major ? `<span class="roadmap-major">majeure</span>` : ""}
            ${pill}
            <p class="muted">${escapeHtml(r.description || "")}</p>
          </div>
        </div>`;
          })
          .join("")
      : `<p class="muted">Aucune roadmap renseignée.</p>`;

  els.modalContent.innerHTML = `
    <h2>${escapeHtml(game.name)}</h2>
    <p class="modal-category">${escapeHtml(categoryLabel(game.category))}</p>
    <div class="badge-row">
      <span class="badge status-${game.status}">${
    STATUS_LABELS[game.status] || game.status
  }</span>
      ${(game.genre || [])
        .map((g) => `<span class="badge">${escapeHtml(g)}</span>`)
        .join("")}
      ${rating !== null ? `<span class="badge">★ ${rating}/10</span>` : ""}
    </div>
    <p>${escapeHtml(game.description || "")}</p>
    <p class="muted">👥 ${escapeHtml(game.players || "?")} · 🖥️ ${(
    game.platforms || []
  )
    .map(escapeHtml)
    .join(", ")} · Proposé par ${escapeHtml(game.proposedBy || "?")}</p>

    ${
      game.cons
        ? `<div class="modal-section cons-block">
             <h4>Le bémol</h4>
             <p>${escapeHtml(game.cons)}</p>
           </div>`
        : ""
    }

    <div class="modal-section">
      <h4>Bande-annonce</h4>
      ${videoHtml}
    </div>

    <div class="modal-section">
      <h4>Note presse</h4>
      ${criticHtml}
    </div>

    <div class="modal-section">
      <h4>Nos avis</h4>
      ${reviewsHtml}
    </div>

    <div class="modal-section">
      <h4>Roadmap des versions</h4>
      ${roadmapHtml}
    </div>
  `;

  els.modalOverlay.classList.remove("hidden");
}

function closeModal() {
  els.modalOverlay.classList.add("hidden");
}

els.modalClose.addEventListener("click", closeModal);
els.modalOverlay.addEventListener("click", (e) => {
  if (e.target === els.modalOverlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

[
  els.search,
  els.category,
  els.genre,
  els.platform,
  els.status,
  els.proposedBy,
  els.sort,
].forEach((el) => el.addEventListener("input", render));

populateSelect(
  els.category,
  CATEGORIES.map((c) => c.id),
  categoryLabel
);
populateSelect(els.genre, uniqueValues(GAMES_DATA, (g) => g.genre));
populateSelect(els.platform, uniqueValues(GAMES_DATA, (g) => g.platforms));
populateSelect(els.proposedBy, uniqueValues(GAMES_DATA, (g) => g.proposedBy));

renderUpdateAlert();
render();
