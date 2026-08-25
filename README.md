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

**Mises à jour importantes** : une MAJ majeure à venir (une 1.0, un wipe, un
gros DLC — bref, ce qui peut nous obliger à jeter une partie en cours) est
signalée par un bandeau en haut de page avec un compte à rebours, et sur la
carte du jeu concerné. Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour en
déclarer une.

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
index.html          → page principale
css/style.css        → styles
js/data.js            → catégories + données des jeux (la "base de données")
js/app.js             → affichage, filtres, recherche, tri, modale de détail
.github/ISSUE_TEMPLATE → template pour proposer un jeu via une issue
```
