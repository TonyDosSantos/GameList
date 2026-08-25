const STATUS_LABELS = {
  "a-essayer": "À essayer",
  "en-cours": "En cours",
  termine: "Terminé",
  "coup-de-coeur": "Coup de cœur",
  ecarte: "Écarté",
};

const els = {
  sections: document.getElementById("game-sections"),
  empty: document.getElementById("empty-state"),
  count: document.getElementById("results-count"),
  search: document.getElementById("search-input"),
  category: document.getElementById("filter-category"),
  genre: document.getElementById("filter-genre"),
  platform: document.getElementById("filter-platform"),
  status: document.getElementById("filter-status"),
  proposedBy: document.getElementById("filter-proposedBy"),
  missingReview: document.getElementById("filter-missing-review"),
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

// --- Avis ------------------------------------------------------------------

// Chacun peut laisser autant de commentaires qu'il veut sur un jeu : les avis
// forment un fil, dans l'ordre du fichier. La note retenue pour une personne
// est celle de son commentaire noté le plus récent — on peut donc revoir son
// jugement sans effacer ce qu'on avait écrit avant.

function reviewsBy(game, author) {
  return (game.reviews || []).filter((r) => r.author === author);
}

function hasReviewed(game, author) {
  return reviewsBy(game, author).length > 0;
}

function latestRating(game, author) {
  const rated = reviewsBy(game, author).filter(
    (r) => typeof r.rating === "number"
  );
  return rated.length ? rated[rated.length - 1].rating : null;
}

// Moyenne des notes courantes de chacun (et non de tous les commentaires,
// pour qu'une personne bavarde ne pèse pas plus lourd dans la moyenne).
function averageRating(game) {
  const ratings = REVIEWERS.map((author) => latestRating(game, author)).filter(
    (r) => r !== null
  );
  if (ratings.length === 0) return null;
  const sum = ratings.reduce((acc, r) => acc + r, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
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
  const missingReview = els.missingReview.value;
  const sortBy = els.sort.value;

  const result = GAMES_DATA.filter((game) => {
    if (search && !game.name.toLowerCase().includes(search)) return false;
    if (category && game.category !== category) return false;
    if (genre && !(game.genre || []).includes(genre)) return false;
    if (platform && !(game.platforms || []).includes(platform)) return false;
    if (status && game.status !== status) return false;
    if (proposedBy && game.proposedBy !== proposedBy) return false;
    if (missingReview && hasReviewed(game, missingReview)) return false;
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

  const isImminent = nextMajor && nextMajor.days <= IMMINENT_DAYS;
  const majorBanner = nextMajor
    ? `<div class="card-update ${isImminent ? "imminent" : ""}">
         <strong>${isImminent ? "⚠️ " : ""}MAJ majeure · ${formatCountdown(
        nextMajor.days
      )}</strong>
         <span>${escapeHtml(nextMajor.entry.title)} — ${escapeHtml(
        nextMajor.entry.date
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
      <span class="reviewer-pills">
        ${REVIEWERS.map((author) => {
          const count = reviewsBy(game, author).length;
          const rating = latestRating(game, author);
          const value = count === 0 ? "–" : rating !== null ? rating : "✓";
          const title =
            count === 0
              ? `${author} n'a pas encore donné son avis`
              : `${author} · ${count} commentaire${count > 1 ? "s" : ""}${
                  rating !== null ? ` · ${rating}/10` : ""
                }`;
          return `<span class="reviewer-pill ${
            count ? "has-review" : ""
          }" title="${escapeHtml(title)}">${escapeHtml(
            author[0]
          )} ${value}${count > 1 ? `<sup>${count}</sup>` : ""}</span>`;
        }).join("")}
      </span>
    </div>
  `;
  return card;
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

  // Récapitulatif : la note courante de chacun, et qui n'a pas encore parlé.
  const summaryHtml = `
    <div class="review-summary">
      ${REVIEWERS.map((author) => {
        const count = reviewsBy(game, author).length;
        const rating = latestRating(game, author);
        return `<span class="summary-chip ${count ? "has-review" : ""}">
          <strong>${escapeHtml(author)}</strong>
          ${
            rating !== null
              ? `${rating}/10`
              : count
              ? "sans note"
              : "pas encore d'avis"
          }
        </span>`;
      }).join("")}
    </div>`;

  const thread = game.reviews || [];
  const threadHtml = thread.length
    ? thread
        .map(
          (r) => `
      <div class="review-item">
        <div class="review-head">
          <span class="review-author">${escapeHtml(r.author)}</span>
          <span class="review-meta">
            ${
              typeof r.rating === "number"
                ? `<span class="review-score">${r.rating}/10</span>`
                : `<span class="review-score no-score">sans note</span>`
            }
            ${
              r.date
                ? `<span class="review-date">${escapeHtml(r.date)}</span>`
                : ""
            }
          </span>
        </div>
        <p>${escapeHtml(r.comment || "")}</p>
      </div>`
        )
        .join("")
    : `<p class="muted">Aucun commentaire pour l'instant.</p>`;

  const reviewsHtml = summaryHtml + threadHtml;

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
      <button type="button" class="btn-primary" id="open-review-form">
        ✍️ Ajouter un commentaire
      </button>
      <div id="review-form-slot"></div>
    </div>

    <div class="modal-section">
      <h4>Roadmap des versions</h4>
      ${roadmapHtml}
    </div>
  `;

  els.modalOverlay.classList.remove("hidden");

  document
    .getElementById("open-review-form")
    .addEventListener("click", (e) => {
      e.currentTarget.classList.add("hidden");
      renderReviewForm(game);
    });
}

// --- Formulaire d'avis -----------------------------------------------------
//
// Le site est statique : il n'y a pas de serveur pour enregistrer un avis.
// Le formulaire produit donc les deux choses qui permettent de le publier
// quand même — le bloc de code prêt à coller dans data.js, et une issue
// GitHub pré-remplie pour ceux qui préfèrent ne pas toucher au code.
// Le brouillon est gardé dans le navigateur pour ne rien perdre en cours de
// route.

const DRAFT_KEY = "gamelist:draft";
const WHOAMI_KEY = "gamelist:whoami";

function storageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* navigation privée, cookies bloqués… : on continue sans brouillon */
  }
}

function reviewSnippet({ author, rating, comment }) {
  const date = new Date().toISOString().slice(0, 10);
  const ratingValue = rating === "" ? "null" : rating;
  return `{ author: ${JSON.stringify(author)}, rating: ${ratingValue}, comment: ${JSON.stringify(
    comment
  )}, date: ${JSON.stringify(date)} },`;
}

function issueUrl(game, { author, rating, comment }) {
  const title = `[Avis] ${game.name} — ${author}`;
  const body = [
    `**Jeu :** ${game.name} (\`${game.id}\`)`,
    `**Par :** ${author}`,
    `**Note :** ${rating === "" ? "pas de note" : rating + "/10"}`,
    "",
    comment,
  ].join("\n");
  return `https://github.com/${REPO}/issues/new?labels=avis&title=${encodeURIComponent(
    title
  )}&body=${encodeURIComponent(body)}`;
}

function renderReviewForm(game) {
  const slot = document.getElementById("review-form-slot");
  const existingAuthor = storageGet(WHOAMI_KEY) || REVIEWERS[0];
  const draft = JSON.parse(storageGet(DRAFT_KEY) || "{}");
  const savedComment = draft.gameId === game.id ? draft.comment || "" : "";
  const savedRating = draft.gameId === game.id ? draft.rating ?? "" : "";

  slot.innerHTML = `
    <form class="review-form" id="review-form">
      <div class="form-row">
        <label>
          Qui commente ?
          <select id="review-author">
            ${REVIEWERS.map(
              (a) =>
                `<option value="${escapeHtml(a)}" ${
                  a === existingAuthor ? "selected" : ""
                }>${escapeHtml(a)}</option>`
            ).join("")}
          </select>
        </label>
        <label>
          Note
          <select id="review-rating">
            <option value="">Sans note</option>
            ${Array.from({ length: 11 }, (_, i) => 10 - i)
              .map(
                (n) =>
                  `<option value="${n}" ${
                    String(n) === String(savedRating) ? "selected" : ""
                  }>${n}/10</option>`
              )
              .join("")}
          </select>
        </label>
      </div>
      <label>
        Commentaire
        <textarea id="review-comment" rows="3"
          placeholder="Ce que tu en as pensé, ce qui marche ou pas pour nous deux…">${escapeHtml(
            savedComment
          )}</textarea>
      </label>
      <p class="muted form-help">
        Le site est statique : ton commentaire n'est pas publié en ligne
        automatiquement. Choisis une des deux options ci-dessous pour qu'il
        arrive jusqu'à l'autre.
      </p>
      <div class="form-actions">
        <button type="submit" class="btn-primary">Générer mon commentaire</button>
      </div>
      <div id="review-output"></div>
    </form>
  `;

  const form = document.getElementById("review-form");
  const authorEl = document.getElementById("review-author");
  const ratingEl = document.getElementById("review-rating");
  const commentEl = document.getElementById("review-comment");

  const saveDraft = () =>
    storageSet(
      DRAFT_KEY,
      JSON.stringify({
        gameId: game.id,
        rating: ratingEl.value,
        comment: commentEl.value,
      })
    );

  commentEl.addEventListener("input", saveDraft);
  ratingEl.addEventListener("change", saveDraft);
  authorEl.addEventListener("change", () =>
    storageSet(WHOAMI_KEY, authorEl.value)
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const values = {
      author: authorEl.value,
      rating: ratingEl.value,
      comment: commentEl.value.trim(),
    };
    if (!values.comment) {
      commentEl.focus();
      return;
    }
    storageSet(WHOAMI_KEY, values.author);

    const snippet = reviewSnippet(values);
    const output = document.getElementById("review-output");
    output.innerHTML = `
      <div class="review-output">
        <p><strong>Option 1 — commiter directement.</strong> Ajoute cette ligne
        à la fin du tableau <code>reviews</code> de <code>${escapeHtml(
          game.id
        )}</code>, dans <code>js/data.js</code> — sans rien supprimer, les
        commentaires s'empilent :</p>
        <pre id="review-snippet">${escapeHtml(snippet)}</pre>
        <button type="button" class="btn-secondary" id="copy-snippet">
          📋 Copier
        </button>
        <p><strong>Option 2 — passer par GitHub.</strong> Ouvre une issue
        pré-remplie. L'autre la voit tout de suite et l'intègre ensuite :</p>
        <a class="btn-secondary" target="_blank" rel="noopener"
           href="${escapeHtml(issueUrl(game, values))}">
          🔗 Ouvrir l'issue pré-remplie
        </a>
      </div>
    `;

    document.getElementById("copy-snippet").addEventListener("click", (ev) => {
      // currentTarget est remis à null une fois l'événement traité : on garde
      // la référence avant d'entrer dans les callbacks du presse-papier.
      const button = ev.currentTarget;
      navigator.clipboard
        .writeText(snippet)
        .then(() => {
          button.textContent = "✅ Copié";
        })
        .catch(() => {
          // Presse-papier refusé (http, permission) : on sélectionne le texte
          // pour que la copie manuelle reste possible.
          const range = document.createRange();
          range.selectNodeContents(document.getElementById("review-snippet"));
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          button.textContent = "Sélectionné, Ctrl+C";
        });
    });
  });

  commentEl.focus();
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
  els.missingReview,
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
populateSelect(
  els.missingReview,
  REVIEWERS,
  (author) => `Sans avis de ${author}`
);

render();
