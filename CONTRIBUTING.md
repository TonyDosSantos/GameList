# Contribuer à GameList

Deux façons d'ajouter ou de modifier un jeu, selon si tu es à l'aise avec git
ou non.

## Option A — Modifier directement le fichier (rapide)

1. Ouvrir `js/data.js`.
2. Copier un bloc existant dans le tableau `GAMES_DATA` et l'adapter :

```js
{
  id: "un-slug-unique-sans-espace",
  name: "Nom du jeu",
  genre: ["Coop", "Party"],
  players: "2-4",
  platforms: ["PC", "Switch"],
  status: "a-essayer", // a-essayer | en-cours | termine | coup-de-coeur
  proposedBy: "Tony",  // Moi | Tony | Les deux
  description: "Une phrase pour présenter le jeu.",
  trailerUrl: "https://www.youtube.com/watch?v=XXXXXXXXXXX",
  criticScore: { source: "Metacritic", score: 88, url: "https://..." },
  reviews: [
    { author: "Tony", rating: 8, comment: "Bien fun en soirée." }
  ],
  roadmap: [
    { date: "2026-10", title: "Nouveau DLC", description: "...", status: "a-venir" }
  ],
},
```

3. Enregistrer, vérifier que le site s'affiche bien en local (voir README),
   puis commit + push (directement sur `main` si vous êtes juste tous les
   deux, ou via une Pull Request si vous préférez relire avant de merger).

Champs optionnels : `trailerUrl`, `criticScore`, `reviews`, `roadmap` peuvent
rester vides (`""`, `null` ou `[]`) si vous n'avez pas encore l'info — le
site affiche un message adapté ("pas encore renseigné").

## Option B — Proposer un jeu via une issue (pas besoin de toucher au code)

Créer une nouvelle issue avec le template **"Nouveau jeu"**
(`.github/ISSUE_TEMPLATE/nouveau-jeu.md`). Un de nous deux (ou Claude) se
charge ensuite de l'ajouter dans `js/data.js`.

## Ajouter un avis sur un jeu existant

Ouvrir `js/data.js`, trouver le jeu, ajouter une entrée dans son tableau
`reviews` :

```js
reviews: [
  { author: "Moi", rating: 7, comment: "Sympa mais un peu répétitif." }
]
```

## Mettre à jour le statut

Changer simplement la valeur `status` du jeu :
- `"a-essayer"` — pas encore testé
- `"en-cours"` — en cours de découverte
- `"termine"` — fini / plus au programme
- `"coup-de-coeur"` — validé par l'équipe, à remettre régulièrement
