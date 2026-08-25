// Lit l'avis contenu dans le corps d'une issue « avis » et l'ajoute à
// js/reviews.js. Appelé par .github/workflows/avis-vers-pr.yml.
//
// Le corps de l'issue est du texte écrit par un humain : on ne fait confiance
// à rien. Le seul morceau exploité est le bloc <!-- gamelist:avis … --> généré
// par le formulaire du site, et chaque champ est validé avant écriture.

import { readFileSync, writeFileSync, appendFileSync } from "node:fs";

const FICHIER_AVIS = "js/reviews.js";
const FICHIER_JEUX = "js/data.js";
const LONGUEUR_MAX_COMMENTAIRE = 2000;

function echec(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

// --- 1. Extraire le bloc machine de l'issue --------------------------------

const corps = process.env.ISSUE_BODY || "";
const bloc = corps.match(/<!--\s*gamelist:avis\s*([\s\S]*?)-->/);

if (!bloc) {
  echec(
    "Aucun bloc « gamelist:avis » dans cette issue. Utilisez le bouton " +
      "« Publier via GitHub » depuis le site pour la générer."
  );
}

let avis;
try {
  avis = JSON.parse(bloc[1].trim());
} catch (erreur) {
  echec(`Le bloc « gamelist:avis » n'est pas du JSON valide : ${erreur.message}`);
}

// --- 2. Valider chaque champ ------------------------------------------------

const { gameId, author, comment } = avis;
let { rating, date } = avis;

if (typeof gameId !== "string" || !/^[a-z0-9-]+$/.test(gameId)) {
  echec(`Identifiant de jeu invalide : ${JSON.stringify(gameId)}`);
}

if (typeof author !== "string" || !author.trim()) {
  echec("L'auteur est absent.");
}

if (typeof comment !== "string" || !comment.trim()) {
  echec("Le commentaire est vide.");
}

if (comment.length > LONGUEUR_MAX_COMMENTAIRE) {
  echec(
    `Commentaire trop long (${comment.length} caractères, maximum ${LONGUEUR_MAX_COMMENTAIRE}).`
  );
}

if (rating === undefined || rating === null || rating === "") {
  rating = null;
} else if (!Number.isInteger(rating) || rating < 0 || rating > 10) {
  echec(`Note invalide : ${JSON.stringify(rating)} (attendu : un entier de 0 à 10, ou null).`);
}

if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  date = new Date().toISOString().slice(0, 10);
}

// L'auteur doit faire partie des personnes déclarées dans data.js, sinon il
// n'apparaîtrait ni dans les pastilles ni dans le récapitulatif du site.
const jeux = readFileSync(FICHIER_JEUX, "utf8");
const declarationReviewers = jeux.match(/const REVIEWERS = (\[[^\]]*\])/);
if (!declarationReviewers) {
  echec(`Impossible de lire REVIEWERS dans ${FICHIER_JEUX}.`);
}
const reviewers = JSON.parse(declarationReviewers[1].replace(/'/g, '"'));
if (!reviewers.includes(author)) {
  echec(
    `Auteur inconnu : « ${author} ». Attendu l'un de : ${reviewers.join(", ")}.`
  );
}

if (!jeux.includes(`id: "${gameId}"`)) {
  echec(`Aucun jeu ne porte l'identifiant « ${gameId} » dans ${FICHIER_JEUX}.`);
}

// --- 3. Ajouter l'avis ------------------------------------------------------

const fichier = readFileSync(FICHIER_AVIS, "utf8");
const declaration = fichier.match(/const REVIEWS = ([\s\S]*);\s*$/);
if (!declaration) {
  echec(
    `${FICHIER_AVIS} ne se termine pas par « const REVIEWS = {…}; » — format inattendu.`
  );
}

// Tout ce qui précède la déclaration (l'en-tête de commentaires) est conservé.
const entete = fichier.slice(0, declaration.index);

let avisParJeu;
try {
  avisParJeu = JSON.parse(declaration[1]);
} catch (erreur) {
  echec(
    `L'objet REVIEWS de ${FICHIER_AVIS} n'est pas du JSON strict : ${erreur.message}`
  );
}

if (!Array.isArray(avisParJeu[gameId])) {
  avisParJeu[gameId] = [];
}

// Un même commentaire relancé deux fois (issue rouverte, workflow relancé) ne
// doit pas créer de doublon.
const doublon = avisParJeu[gameId].some(
  (existant) => existant.author === author && existant.comment === comment
);
if (doublon) {
  echec(`Ce commentaire de ${author} est déjà présent sur « ${gameId} ».`);
}

avisParJeu[gameId].push({ author, rating, comment, date });

writeFileSync(
  FICHIER_AVIS,
  `${entete}const REVIEWS = ${JSON.stringify(avisParJeu, null, 2)};\n`
);

console.log(`✅ Avis de ${author} ajouté sur « ${gameId} ».`);

// --- 4. Transmettre les infos au workflow -----------------------------------

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(
    process.env.GITHUB_OUTPUT,
    [
      `game_id=${gameId}`,
      `author=${author}`,
      `rating=${rating === null ? "sans note" : `${rating}/10`}`,
      "",
    ].join("\n")
  );
}
