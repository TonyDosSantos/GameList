const STATUS_LABELS = {
  "a-essayer": "À essayer",
  "en-cours": "En cours",
  termine: "Terminé",
  "coup-de-coeur": "Coup de cœur",
};

const els = {
  grid: document.getElementById("game-grid"),
  empty: document.getElementById("empty-state"),
  count: document.getElementById("results-count"),
  search: document.getElementById("search-input"),
  genre: document.getElementById("filter-genre"),
  platform: document.getElementById("filter-platform"),
  status: document.getElementById("filter-status"),
  proposedBy: document.getElementById("filter-proposedBy"),
  sort: document.getElementById("sort-by"),
  modalOverlay: document.getElementById("modal-overlay"),
  modalContent: document.getElementById("modal-content"),
  modalClose: document.getElementById("modal-close"),
};

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

function populateSelect(select, values) {
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function averageRating(game) {
  if (!game.reviews || game.reviews.length === 0) return null;
  const sum = game.reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
  return Math.round((sum / game.reviews.length) * 10) / 10;
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
  const genre = els.genre.value;
  const platform = els.platform.value;
  const status = els.status.value;
  const proposedBy = els.proposedBy.value;
  const sortBy = els.sort.value;

  let result = GAMES_DATA.filter((game) => {
    if (search && !game.name.toLowerCase().includes(search)) return false;
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

function renderCard(game) {
  const card = document.createElement("article");
  card.className = "game-card";
  card.tabIndex = 0;
  card.addEventListener("click", () => openModal(game));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") openModal(game);
  });

  const rating = averageRating(game);

  card.innerHTML = `
    <h3>${escapeHtml(game.name)}</h3>
    <div class="badge-row">
      <span class="badge status-${game.status}">${
    STATUS_LABELS[game.status] || game.status
  }</span>
      ${(game.genre || [])
        .map((g) => `<span class="badge">${escapeHtml(g)}</span>`)
        .join("")}
    </div>
    <div class="card-meta">
      <span>👥 ${escapeHtml(game.players || "?")}</span>
      <span>🖥️ ${(game.platforms || []).map(escapeHtml).join(", ")}</span>
    </div>
    <div class="card-footer">
      <span>Proposé par ${escapeHtml(game.proposedBy || "?")}</span>
      ${rating !== null ? `<span class="rating-pill">★ ${rating}/10</span>` : ""}
    </div>
  `;
  return card;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}

function render() {
  const games = getFilteredSortedGames();
  els.grid.innerHTML = "";
  games.forEach((game) => els.grid.appendChild(renderCard(game)));

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
    ? `<p><strong>${escapeHtml(game.criticScore.source)}</strong> : ${
        game.criticScore.score
      }${
        game.criticScore.url
          ? ` — <a href="${game.criticScore.url}" target="_blank" rel="noopener">voir la source</a>`
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
            <span>${r.rating}/10</span>
          </div>
          <p>${escapeHtml(r.comment || "")}</p>
        </div>`
          )
          .join("")
      : `<p class="muted">Aucun avis pour l'instant.</p>`;

  const roadmapHtml =
    game.roadmap && game.roadmap.length
      ? game.roadmap
          .map(
            (r) => `
        <div class="roadmap-item">
          <div class="roadmap-date">${escapeHtml(r.date || "")}</div>
          <div>
            <strong>${escapeHtml(r.title || "")}</strong>
            <p class="muted">${escapeHtml(r.description || "")}</p>
          </div>
        </div>`
          )
          .join("")
      : `<p class="muted">Aucune roadmap renseignée.</p>`;

  els.modalContent.innerHTML = `
    <h2>${escapeHtml(game.name)}</h2>
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
    <p class="muted">👥 ${escapeHtml(
      game.players || "?"
    )} · 🖥️ ${(game.platforms || []).map(escapeHtml).join(", ")} · Proposé par ${escapeHtml(
    game.proposedBy || "?"
  )}</p>

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
      <h4>Roadmap</h4>
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

[els.search, els.genre, els.platform, els.status, els.proposedBy, els.sort].forEach(
  (el) => el.addEventListener("input", render)
);

populateSelect(els.genre, uniqueValues(GAMES_DATA, (g) => g.genre));
populateSelect(els.platform, uniqueValues(GAMES_DATA, (g) => g.platforms));
populateSelect(els.proposedBy, uniqueValues(GAMES_DATA, (g) => g.proposedBy));

render();
