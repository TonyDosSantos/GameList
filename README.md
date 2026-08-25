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
d'un jeu, « Ajouter un commentaire » puis « Publier via GitHub » ouvre une
issue pré-remplie ; une GitHub Action la lit, ajoute le commentaire à
`js/reviews.js` et **ouvre la Pull Request toute seule**. Il ne reste qu'à la
fusionner, et l'issue se ferme à ce moment-là. Voir
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
js/reviews.js              → avis et commentaires (réécrit par le workflow)
js/app.js                  → affichage, filtres, recherche, tri, fiche détaillée
.github/ISSUE_TEMPLATE/    → templates d'issue (nouveau jeu, avis)
.github/workflows/         → l'Action qui transforme un avis en Pull Request
.github/scripts/           → le script appelé par cette Action
```

## Configuration requise côté GitHub

Pour que la création automatique de PR fonctionne, une case doit être cochée
une fois pour toutes (droits admin nécessaires) :

**Settings → Actions → General → Workflow permissions** → cocher
**« Allow GitHub Actions to create and approve pull requests »**.

Sans ça, l'Action lira bien l'issue mais échouera au moment d'ouvrir la PR.
