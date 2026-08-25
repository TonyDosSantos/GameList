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

- la **carte du jeu** affiche un encart en rouge avec un compte à rebours
  (« MAJ majeure · dans 15 jours ») quand l'échéance tombe dans les 60 jours ;
- dans la fiche, la **roadmap** met l'entrée en avant, classe les MAJ à venir
  avant les anciennes, et grise celles déjà sorties.

L'alerte reste dans le bloc du jeu concerné : pas de bandeau global en haut de
page.

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

## Donner son avis sur un jeu

Les avis forment un **fil de discussion** : chacun peut laisser autant de
commentaires qu'il veut sur un même jeu, avant et après y avoir joué. On ajoute
à la suite, on n'écrase jamais ce que l'autre a écrit.

### Le plus simple : le formulaire du site

Ouvrir le jeu sur le site → **« ✍️ Ajouter un commentaire »**. On choisit qui on
est, une note sur 10 (ou « sans note ») et un commentaire, puis
**« 🚀 Publier via GitHub »**.

Ce qui se passe ensuite est automatique :

1. GitHub ouvre une issue déjà remplie — il ne reste qu'à valider ;
2. le workflow [`avis-vers-pr.yml`](.github/workflows/avis-vers-pr.yml) lit
   l'issue, ajoute le commentaire à `js/reviews.js` et **ouvre une Pull
   Request** ;
3. un commentaire dans l'issue donne le lien de la PR ;
4. il ne reste qu'à fusionner. L'issue se ferme toute seule à la fusion.

Compter une minute entre la création de l'issue et l'apparition de la PR. Si
quelque chose échoue, le workflow commente l'issue avec le lien vers les logs
plutôt que d'échouer en silence.

Le brouillon est gardé dans le navigateur au fur et à mesure de la frappe :
fermer la page par erreur ne fait pas perdre le commentaire. Le site retient
aussi qui vous êtes pour ne pas le redemander à chaque fois.

### Ce que le workflow refuse

Le corps d'une issue est du texte libre : le script valide tout avant
d'écrire. Il s'arrête, en expliquant pourquoi, si l'identifiant de jeu
n'existe pas dans `js/data.js`, si l'auteur n'est pas dans `REVIEWERS`, si la
note n'est pas un entier de 0 à 10, si le commentaire est vide ou dépasse
2000 caractères, ou si le même commentaire est déjà présent (relance du
workflow, issue rouverte).

Deux garde-fous côté déclenchement : le label `avis` **et** un auteur d'issue
qui a réellement accès au dépôt. Le dépôt étant public, sans ce second test
n'importe qui pourrait faire ouvrir des PR en série.

### À la main

Les avis vivent dans **`js/reviews.js`**, rangés par identifiant de jeu — pas
dans `js/data.js`. Cette séparation est volontaire : `reviews.js` est réécrit
par la machine, `data.js` reste écrit à la main.

```js
const REVIEWS = {
  "core-keeper": [
    { "author": "Tony", "rating": null, "comment": "Pas encore joué, mais l'ambiance me tente." },
    { "author": "Maxime", "rating": 7, "comment": "Sympa mais un peu répétitif.", "date": "2026-08-25" },
    { "author": "Tony", "rating": 9, "comment": "Revu à la hausse après quelques heures.", "date": "2026-08-28" }
  ]
};
```

⚠️ **L'objet doit rester du JSON strict** : guillemets doubles sur les clés
comme sur les valeurs, pas de virgule en trop, aucun commentaire à l'intérieur
de l'objet. C'est ce qui permet au script de le relire et de le réécrire sans
risque de casser le fichier. L'en-tête de commentaires au-dessus, lui, est
conservé tel quel.

`rating` accepte `null` pour commenter sans mettre de note, `date` est
optionnelle.

**Changer d'avis** : ajoutez un nouveau commentaire à la fin plutôt que de
modifier l'ancien. La note retenue pour une personne est celle de son dernier
commentaire noté — dans l'exemple ci-dessus, Tony compte pour 9/10 — et
l'historique reste lisible.

### Voir qui n'a pas encore donné son avis

Sur chaque carte, deux pastilles résument l'état des avis : `M 7` (dernière
note de Maxime), `T 9²` (Tony a mis 9, sur 2 commentaires), `M –` (pas encore
d'avis). Le filtre **« Sans avis de … »** en haut de page ne garde que les jeux
qu'il vous reste à commenter.

### Changer les personnes qui notent

La liste est en haut de `js/data.js` :

```js
const REVIEWERS = ["Maxime", "Tony"];
```

Ajouter un nom suffit : pastilles, filtre et formulaire se mettent à jour tout
seuls. Un avis signé d'un nom absent de cette liste reste affiché dans la
fiche, il n'est jamais perdu.

## Mettre à jour le statut

Changer simplement la valeur `status` du jeu :
- `"a-essayer"` — pas encore testé
- `"en-cours"` — en cours de découverte
- `"termine"` — fini / plus au programme
- `"coup-de-coeur"` — validé par l'équipe, à remettre régulièrement
