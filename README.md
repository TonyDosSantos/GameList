# 🎮 GameList

Petit site statique pour maintenir, avec Tony, la liste des jeux auxquels on
veut jouer (ou qu'on a déjà testés) lors de nos we / soirées gaming.

Pour chaque jeu on garde : genre, nombre de joueurs, plateforme(s), statut,
qui l'a proposé, une description, une bande-annonce, la note presse, nos avis
perso et la roadmap des mises à jour à venir.

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
js/data.js            → données des jeux (la "base de données")
js/app.js             → affichage, filtres, recherche, tri, modale de détail
.github/ISSUE_TEMPLATE → template pour proposer un jeu via une issue
```
