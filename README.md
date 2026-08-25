# 🎮 GameList

Petit site statique pour maintenir, avec Tony, la liste des jeux auxquels on
veut jouer (ou qu'on a déjà testés) lors de nos we / soirées gaming.

Les jeux sont rangés par **catégorie** (« On découvre ensemble », « Maxime
connaît déjà, Tony part de zéro », « Petits jeux »). Pour chaque jeu on garde :
genre, nombre de joueurs, plateforme(s), statut, qui l'a proposé, une
description, **le bémol** (ce qui pourrait coincer), une bande-annonce, la note
presse, nos avis perso et la roadmap des mises à jour à venir.

Recherche, filtres (catégorie, genre, plateforme, statut, qui a proposé) et tri
sont dispos en haut de page. Un clic sur une carte ouvre la fiche complète.

**Avis et notes** : chaque jeu a un fil de commentaires où chacun peut
s'exprimer autant de fois qu'il veut, avec une note sur 10 s'il en a une. Les
cartes montrent d'un coup d'œil qui a déjà donné son avis, et un filtre
« Sans avis de … » liste ce qu'il vous reste à commenter.

**Publier un commentaire ne demande pas de toucher au code.** Dans la fiche
d'un jeu, « Ajouter un commentaire » puis « Publier via GitHub » ouvre GitHub
avec un fichier déjà rempli ; il suffit de le valider. Une GitHub Action le
lit, ajoute le commentaire à `js/reviews.js` et **ouvre une Pull Request
qu'elle fusionne toute seule**. Rien d'autre à faire. Voir
[CONTRIBUTING.md](CONTRIBUTING.md).

**Mises à jour importantes** : une MAJ majeure à venir (une 1.0, un wipe, un
gros DLC — bref, ce qui peut nous obliger à jeter une partie en cours) est
signalée directement sur la carte du jeu concerné, avec un compte à rebours.
Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour en déclarer une.

## Voir le site

### En ligne (GitHub Pages)

1. Aller dans **Settings → Pages** du repo.
2. Source : **Deploy from a branch**, branche `main` (ou celle par défaut),
   dossier `/ (root)`.
3. Le site sera dispo sur `https://<utilisateur>.github.io/<repo>/`.

### En local

Aucune installation nécessaire, tout est en HTML/CSS/JS pur :

```bash
# depuis la racine du repo
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

(Double-cliquer sur `index.html` fonctionne aussi dans la plupart des
navigateurs.)

## Ajouter / modifier un jeu

Voir [CONTRIBUTING.md](CONTRIBUTING.md).

## Structure du projet

```
index.html               → page principale
css/style.css             → styles
js/data.js                 → catégories + jeux (écrit à la main)
js/reviews.js              → avis et commentaires (réécrit par un workflow)
js/version.js              → commit et date du déploiement (réécrit par un workflow)
js/app.js                  → affichage, filtres, recherche, tri, fiche détaillée
.github/ISSUE_TEMPLATE/    → template d'issue (nouveau jeu)
.github/workflows/         → l'Action « avis en attente → PR » et l'estampille de version
.github/scripts/           → le script appelé par ces Actions
```

## Savoir quand le site a été mis à jour

Une pastille **en haut à droite** de la page affiche la date du dernier
déploiement et le commit correspondant, cliquable :
*« Mis à jour le 25 août 2026 à 12:54 · b4e6f97 »*. Sur petit écran elle
repasse au-dessus du titre pour ne pas le chevaucher.

C'est le script
[`estampiller-version.sh`](.github/scripts/estampiller-version.sh) qui l'écrit :
il inscrit dans `js/version.js` le commit et l'heure UTC, puis committe.
GitHub Pages redéploie derrière, et la date s'affiche ensuite dans le fuseau
horaire de celui qui consulte.

**Deux workflows l'appellent, et ce n'est pas une redondance inutile :**

- [`version.yml`](.github/workflows/version.yml) pour un push ou une fusion
  faits à la main ;
- [`auto-merge.yml`](.github/workflows/auto-merge.yml) juste après avoir
  fusionné une PR.

La raison tient à une règle de GitHub facile à oublier : **un push effectué
avec `GITHUB_TOKEN` ne déclenche aucun workflow.** Une fusion faite par le bot
d'auto-merge ne réveille donc jamais `version.yml`. Sans ce second appel, le
site serait bien redéployé (Pages, lui, se relance) mais l'estampille resterait
figée sur un ancien commit — un affichage faux, plus trompeur qu'une absence
d'affichage.

Sur une copie locale, `js/version.js` est vide et le site affiche « Version
locale — pas encore déployée » : impossible de confondre ce qu'on a sous les
yeux avec ce qui est en ligne.

## Configuration requise côté GitHub

Deux cases à cocher une fois pour toutes (droits admin nécessaires) :

1. **Settings → Actions → General → Workflow permissions** →
   **« Allow GitHub Actions to create and approve pull requests »**.
   Sans ça, l'Action lit bien le fichier déposé mais échoue au moment
   d'ouvrir la PR.

2. **Settings → General → Pull Requests** → **« Allow auto-merge »**.
   Avec cette option, la PR d'avis se fusionne toute seule : le commentaire
   arrive en ligne sans aucune intervention. Sans elle, tout fonctionne
   quand même, mais la PR reste à fusionner à la main — le workflow ouvre
   alors une issue pour le signaler.

## Toutes les PR se fusionnent toutes seules

Le workflow [`auto-merge.yml`](.github/workflows/auto-merge.yml) fusionne
**toute Pull Request** ouverte par quelqu'un ayant accès au dépôt, sans
attendre de relecture. On est deux : une PR sert à voir le diff et à
déclencher le redéploiement, pas à s'attendre l'un l'autre.

**Pour garder une PR ouverte malgré tout, ouvrez-la en brouillon (« Draft »).**
Le workflow les ignore ; passer la PR en « Ready for review » déclenche alors
la fusion.

Deux garde-fous : les brouillons sont exclus, et l'auteur doit réellement avoir
accès au dépôt — celui-ci étant public, sans ce test la première PR venue se
fusionnerait dans `main`.

À noter : un workflow déclenché par un `push` s'exécute avec la version du
fichier de workflow présente **sur la branche poussée** (`avis/en-attente`),
pas celle de la branche par défaut. Le nettoyage de fin de traitement réaligne
cette branche sur `main` à chaque passage réussi, ce qui la maintient à jour
automatiquement — sauf si un traitement échoue en boucle, auquel cas il faut
la resynchroniser à la main (`git push --force-with-lease origin main:avis/en-attente`).
