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
  category: "decouverte-commune", // voir les catégories en haut du fichier
  genre: ["Coop", "Party"],
  players: "2-4",
  platforms: ["PC", "Switch"],
  status: "a-essayer", // a-essayer | en-cours | termine | coup-de-coeur | ecarte
  proposedBy: "Tony",  // Maxime | Tony | Les deux
  description: "Ce que le jeu propose.",
  cons: "Le bémol : ce qui pourrait coincer pour nous.",
  trailerUrl: "https://www.youtube.com/watch?v=XXXXXXXXXXX",
  criticScore: { source: "Steam", score: "88 % (117 000 avis)", url: "https://..." },
  reviews: [
    { author: "Tony", rating: 8, comment: "Bien fun en soirée." }
  ],
  roadmap: [
    { date: "2026-10", title: "Nouveau DLC", description: "..." }
  ],
},
```

Le champ `rating` d'un avis est **optionnel** : mettez `null` pour donner un
ressenti avant d'avoir joué, sans mettre de note.

3. Enregistrer, vérifier que le site s'affiche bien en local (voir README),
   puis commit + push (directement sur `main` si vous êtes juste tous les
   deux, ou via une Pull Request si vous préférez relire avant de merger).

Champs optionnels : `cons`, `trailerUrl`, `criticScore`, `reviews`, `roadmap`
peuvent rester vides (`""`, `null` ou `[]`) si vous n'avez pas encore l'info —
le site affiche un message adapté ("pas encore renseigné").

## Ajouter une catégorie

Les catégories sont définies en haut de `js/data.js`, dans le tableau
`CATEGORIES`, et affichées **dans cet ordre** sur le site :

```js
{
  id: "un-id-unique",
  label: "Nom affiché de la catégorie",
  description: "À quoi sert cette catégorie (affiché sous le titre).",
},
```

Ensuite, mettez cet `id` dans le champ `category` des jeux concernés. Un jeu
dont la `category` ne correspond à aucune catégorie connue est regroupé sous
« Sans catégorie » plutôt que d'être masqué — pratique pour repérer les
fautes de frappe.

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
