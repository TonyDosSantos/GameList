// Avis et commentaires, rangés par identifiant de jeu.
//
// ⚠️ Ce fichier est réécrit automatiquement par le workflow
// .github/workflows/avis-en-attente-vers-pr.yml : quand le formulaire du site
// dépose un avis sur la branche avis-en-attente-branche, un script y ajoute le
// commentaire et ouvre une Pull Request.
//
// Vous pouvez tout à fait l'éditer à la main, mais respectez le format :
// l'objet ci-dessous doit rester du JSON strict (guillemets doubles partout,
// pas de virgule en trop, aucun commentaire à l'intérieur de l'objet). C'est
// ce qui permet au script de le relire sans risque de casser le fichier.
//
// Un avis : { "author": "Maxime", "rating": 8, "comment": "…", "date": "2026-08-25" }
// `rating` accepte null pour commenter sans mettre de note.

const REVIEWS = {
  "sons-of-the-forest": [
    {
      "author": "Tony",
      "rating": null,
      "comment": "Le 2 est sorti, c'est une vraie histoire avec une fin, environnement un peu stressant, je pense que ça peut être pas mal du tout."
    },
    {
      "author": "Maxime",
      "rating": 10,
      "comment": "Test Comm",
      "date": "2026-08-26"
    },
    {
      "author": "Maxime",
      "rating": 9,
      "comment": "Test Comm 2 - changement de note",
      "date": "2026-08-26"
    },
    {
      "author": "Maxime",
      "rating": 10,
      "comment": "Ma vrai note",
      "date": "2026-08-26"
    }
  ],
  "core-keeper": [
    {
      "author": "Tony",
      "rating": null,
      "comment": "Mix entre un mode histoire de Minecraft en 2D, un Zelda, un personnage qui devient plus puissant, un peu artistique. Why not."
    },
    {
      "author": "Maxime",
      "rating": 7,
      "comment": "a l'air sympa",
      "date": "2026-08-26"
    }
  ],
  "conan-exiles": [],
  "v-rising": [],
  "project-zomboid": [],
  "7-days-to-die": [],
  "palworld": [
    {
      "author": "Tony",
      "rating": 5,
      "comment": "test com",
      "date": "2026-08-25"
    }
  ],
  "abiotic-factor": [],
  "valheim": [],
  "slay-the-spire-2": [],
  "teardown": [],
  "peak": [],
  "risk-of-rain-2": []
};
