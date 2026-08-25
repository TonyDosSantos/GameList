// Lit les fichiers JSON déposés dans avis-en-attente/ (un par avis, créés
// par le formulaire du site via l'URL GitHub "new file") et les ajoute à
// js/reviews.js. Appelé par .github/workflows/avis-en-attente-vers-pr.yml.
//
// Chaque fichier vient d'un dépôt de fichier via l'éditeur web GitHub : ce
// n'est pas exécuté, mais reste du contenu externe, donc on valide tout
// avant d'écrire quoi que ce soit.
//
// Deux checkouts sont en jeu :
//  - le répertoire courant (STAGING_DIR) : la branche avis-en-attente-branche, qui
//    contient les fichiers en attente sous avis-en-attente/ ;
//  - BASE_DIR : la branche par défaut, dont on lit js/data.js et qu'on
//    réécrit js/reviews.js dedans.

import { readFileSync, writeFileSync, readdirSync, appendFileSync } from "node:fs";
import { join } from "node:path";

const DOSSIER_EN_ATTENTE = "avis-en-attente";
const LONGUEUR_MAX_COMMENTAIRE = 2000;
const BASE_DIR = process.env.BASE_DIR;

if (!BASE_DIR) {
  console.error("❌ BASE_DIR n'est pas défini.");
  process.exit(1);
}

const FICHIER_AVIS = join(BASE_DIR, "js/reviews.js");
const FICHIER_JEUX = join(BASE_DIR, "js/data.js");

function ecrireSortie(nom, valeur) {
  if (!process.env.GITHUB_OUTPUT) return;
  const texte = String(valeur).includes("\n")
    ? `${nom}<<EOF_${nom}\n${valeur}\nEOF_${nom}\n`
    : `${nom}=${valeur}\n`;
  appendFileSync(process.env.GITHUB_OUTPUT, texte);
}

// --- 1. Repérer les fichiers en attente --------------------------------

let noms;
try {
  noms = readdirSync(DOSSIER_EN_ATTENTE)
    .filter((n) => n.endsWith(".json"))
    .sort();
} catch {
  noms = [];
}

if (noms.length === 0) {
  console.log("Rien à traiter dans avis-en-attente/.");
  ecrireSortie("has_changes", "false");
  ecrireSortie("all_ok", "true");
  ecrireSortie("ok_files", "");
  process.exit(0);
}

// --- 2. Charger les données de référence --------------------------------

const jeux = readFileSync(FICHIER_JEUX, "utf8");
const declarationReviewers = jeux.match(/const REVIEWERS = (\[[^\]]*\])/);
const reviewers = declarationReviewers
  ? JSON.parse(declarationReviewers[1].replace(/'/g, '"'))
  : [];

const fichierAvis = readFileSync(FICHIER_AVIS, "utf8");
const declarationReviews = fichierAvis.match(/const REVIEWS = ([\s\S]*);\s*$/);
if (!declarationReviews) {
  console.error(
    `❌ ${FICHIER_AVIS} ne se termine pas par « const REVIEWS = {…}; » — format inattendu.`
  );
  process.exit(1);
}
const entete = fichierAvis.slice(0, declarationReviews.index);
const avisParJeu = JSON.parse(declarationReviews[1]);

// --- 3. Valider chaque fichier -------------------------------------------

function valider(brut) {
  let avis;
  try {
    avis = JSON.parse(brut);
  } catch (erreur) {
    return { erreur: `JSON invalide : ${erreur.message}` };
  }

  const { gameId, author, comment } = avis;
  let { rating, date } = avis;

  if (typeof gameId !== "string" || !/^[a-z0-9-]+$/.test(gameId)) {
    return { erreur: `Identifiant de jeu invalide : ${JSON.stringify(gameId)}` };
  }
  if (!jeux.includes(`id: "${gameId}"`)) {
    return { erreur: `Aucun jeu ne porte l'identifiant « ${gameId} ».` };
  }
  if (typeof author !== "string" || !author.trim()) {
    return { erreur: "L'auteur est absent." };
  }
  if (!reviewers.includes(author)) {
    return {
      erreur: `Auteur inconnu : « ${author} ». Attendu l'un de : ${reviewers.join(", ")}.`,
    };
  }
  if (typeof comment !== "string" || !comment.trim()) {
    return { erreur: "Le commentaire est vide." };
  }
  if (comment.length > LONGUEUR_MAX_COMMENTAIRE) {
    return {
      erreur: `Commentaire trop long (${comment.length} caractères, maximum ${LONGUEUR_MAX_COMMENTAIRE}).`,
    };
  }
  if (rating === undefined || rating === null || rating === "") {
    rating = null;
  } else if (!Number.isInteger(rating) || rating < 0 || rating > 10) {
    return {
      erreur: `Note invalide : ${JSON.stringify(rating)} (attendu : un entier de 0 à 10, ou null).`,
    };
  }
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    date = new Date().toISOString().slice(0, 10);
  }

  if (!Array.isArray(avisParJeu[gameId])) {
    avisParJeu[gameId] = [];
  }
  const doublon = avisParJeu[gameId].some(
    (existant) => existant.author === author && existant.comment === comment
  );
  if (doublon) {
    return { erreur: `Ce commentaire de ${author} est déjà présent sur « ${gameId} ».` };
  }

  return { entree: { gameId, author, rating, comment, date } };
}

const resultats = [];
for (const nom of noms) {
  const chemin = join(DOSSIER_EN_ATTENTE, nom);
  const brut = readFileSync(chemin, "utf8");
  const { entree, erreur } = valider(brut);
  if (erreur) {
    console.error(`❌ ${nom} : ${erreur}`);
    resultats.push({ nom, ok: false, erreur });
    continue;
  }
  avisParJeu[entree.gameId].push({
    author: entree.author,
    rating: entree.rating,
    comment: entree.comment,
    date: entree.date,
  });
  console.log(`✅ ${nom} : avis de ${entree.author} ajouté sur « ${entree.gameId} ».`);
  resultats.push({ nom, ok: true, entree });
}

// --- 4. Écrire js/reviews.js si au moins un avis est valide ---------------

const valides = resultats.filter((r) => r.ok);
const echecs = resultats.filter((r) => !r.ok);

if (valides.length > 0) {
  writeFileSync(
    FICHIER_AVIS,
    `${entete}const REVIEWS = ${JSON.stringify(avisParJeu, null, 2)};\n`
  );
}

ecrireSortie("has_changes", valides.length > 0 ? "true" : "false");
ecrireSortie("all_ok", echecs.length === 0 ? "true" : "false");
ecrireSortie("ok_files", valides.map((r) => r.nom).join("\n"));
ecrireSortie(
  "summary",
  valides.map((r) => `- Avis de ${r.entree.author} sur \`${r.entree.gameId}\``).join("\n")
);
ecrireSortie(
  "failures",
  echecs.map((r) => `- \`${r.nom}\` : ${r.erreur}`).join("\n")
);
