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
    {
      date: "9 septembre 2026",   // texte affiché
      dateISO: "2026-09-09",       // date machine, pour le compte à rebours
      major: true,                  // MAJ importante (1.0, wipe, gros DLC)
      title: "Sortie de la 1.0",
      description: "Ce que ça change pour nous."
    }
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

## Signaler une mise à jour importante

Une MAJ qui peut nous obliger à repartir de zéro (une 1.0, un wipe, un gros
DLC) doit se voir **avant** qu'on lance une partie. Pour ça, dans la `roadmap`
du jeu :

1. `major: true`
2. `dateISO: "AAAA-MM-JJ"` si la date est annoncée

Le site s'occupe du reste, sans rien à mettre à jour à la main :

- un **bandeau rouge en haut de page** liste les MAJ majeures qui tombent dans
  les 60 jours, avec un compte à rebours ("dans 15 jours") ;
- la **carte du jeu** affiche un encart avec la date ;
- dans la fiche, la **roadmap** met l'entrée en avant, classe les MAJ à venir
  avant les anciennes, et grise celles déjà sorties.

Le compte à rebours est recalculé à chaque ouverture de la page : une fois la
date passée, l'alerte disparaît toute seule. Sans `dateISO`, la MAJ est
affichée comme « date inconnue » et ne déclenche pas d'alerte — c'est le bon
choix quand les développeurs ont annoncé du contenu sans calendrier.

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
