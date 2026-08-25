// Base de données des jeux.
// Pour ajouter un jeu : copiez un bloc ci-dessous, remplissez les champs,
// et ouvrez une Pull Request (voir CONTRIBUTING.md).
//
// Champs :
//  id           : identifiant unique (slug, sans espace)
//  name         : nom du jeu
//  genre        : tableau de genres (ex: ["Coop", "Party"])
//  players      : nombre de joueurs (ex: "2-4")
//  platforms    : tableau de plateformes (ex: ["PC", "Switch"])
//  status       : "a-essayer" | "en-cours" | "termine" | "coup-de-coeur"
//  proposedBy   : qui a proposé le jeu (ex: "Moi", "Tony", "Les deux")
//  description  : courte description
//  trailerUrl   : lien YouTube de la bande-annonce (optionnel)
//  criticScore  : { source, score, url } note presse/agrégateur (optionnel)
//  reviews      : [{ author, rating (0-10), comment }] avis perso (optionnel)
//  roadmap      : [{ date, title, description, status }] suivi des mises à jour (optionnel)

const GAMES_DATA = [
  {
    id: "exemple-it-takes-two",
    name: "It Takes Two",
    genre: ["Coop", "Aventure", "Plateforme"],
    players: "2",
    platforms: ["PC", "PS5", "Xbox", "Switch"],
    status: "coup-de-coeur",
    proposedBy: "Moi",
    description:
      "Jeu 100% coop en écran splitté, chaque niveau apporte une nouvelle mécanique. Parfait pour une soirée à deux.",
    trailerUrl: "",
    criticScore: null,
    reviews: [
      {
        author: "Exemple",
        rating: 9,
        comment: "Remplacez cet avis par le vôtre après avoir joué !",
      },
    ],
    roadmap: [],
  },
  {
    id: "exemple-mario-kart-8-deluxe",
    name: "Mario Kart 8 Deluxe",
    genre: ["Party", "Course"],
    players: "1-4 (jusqu'à 12 en ligne)",
    platforms: ["Switch"],
    status: "a-essayer",
    proposedBy: "Tony",
    description:
      "Le classique incontournable des soirées entre potes, facile à prendre en main.",
    trailerUrl: "",
    criticScore: null,
    reviews: [],
    roadmap: [],
  },
  {
    id: "exemple-lethal-company",
    name: "Lethal Company",
    genre: ["Coop", "Horreur", "Survie"],
    players: "1-4",
    platforms: ["PC"],
    status: "en-cours",
    proposedBy: "Les deux",
    description:
      "Jeu coop où l'on collecte de la ferraille dans des lieux hostiles. Ambiance stressante garantie en groupe.",
    trailerUrl: "",
    criticScore: null,
    reviews: [],
    roadmap: [
      {
        date: "À définir",
        title: "Exemple d'entrée de roadmap",
        description:
          "Remplacez par les prochaines mises à jour / DLC prévus du jeu.",
        status: "a-venir",
      },
    ],
  },
];
