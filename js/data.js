// Les deux personnes qui notent. Chaque jeu peut recevoir un avis de chacun.
const REVIEWERS = ["Maxime", "Tony"];

// Dépôt GitHub, utilisé pour pré-remplir les issues depuis le formulaire d'avis.
const REPO = "TonyDosSantos/GameList";

// Catégories, dans l'ordre d'affichage sur le site.
// Pour en ajouter une : une nouvelle entrée ici, puis utilisez son `id`
// dans le champ `category` des jeux concernés.
const CATEGORIES = [
  {
    id: "decouverte-commune",
    label: "On découvre ensemble",
    description:
      "Personne n'y a joué. On part de zéro tous les deux, pas d'écart de niveau.",
  },
  {
    id: "maxime-connait",
    label: "Maxime connaît déjà, Tony part de zéro",
    description:
      "Des valeurs sûres, mais avec un déséquilibre à assumer : Maxime aura de l'avance.",
  },
  {
    id: "petits-jeux",
    label: "Petits jeux (30 à 60 minutes)",
    description:
      "Parties courtes, aucune sauvegarde à entretenir. Parfait pour une fin de soirée ou un soir de semaine.",
  },
];

// Base de données des jeux.
// Pour ajouter un jeu : copiez un bloc ci-dessous, remplissez les champs,
// et commitez (voir CONTRIBUTING.md).
//
// Champs :
//  id           : identifiant unique (slug, sans espace)
//  name         : nom du jeu
//  category     : id d'une catégorie ci-dessus
//  genre        : tableau de genres (ex: ["Coop", "Survie"])
//  players      : nombre de joueurs (ex: "1-4")
//  platforms    : tableau de plateformes (ex: ["PC", "Switch"])
//  status       : "a-essayer" | "en-cours" | "termine" | "coup-de-coeur" | "ecarte"
//  proposedBy   : qui a proposé le jeu ("Maxime", "Tony", "Les deux")
//  description  : ce que le jeu propose
//  cons         : le bémol, ce qui pourrait coincer (optionnel)
//  trailerUrl   : lien YouTube de la bande-annonce (optionnel)
//  criticScore  : { source, score, url } note presse/agrégateur (optionnel)
//
// Les avis ne sont PAS ici : ils vivent dans js/reviews.js, rangés par
// identifiant de jeu. Ce fichier-là est réécrit automatiquement par le
// workflow qui transforme une issue « avis » en Pull Request, d'où la
// séparation — les données écrites à la main d'un côté, celles écrites par
// la machine de l'autre.
//  roadmap      : suivi des versions du jeu (optionnel). Chaque entrée :
//                   date        : texte affiché (ex: "9 septembre 2026")
//                   dateISO     : "AAAA-MM-JJ" si la date est connue. C'est ce
//                                 qui permet au site de calculer "dans X jours"
//                                 et de mettre la MAJ en évidence. Omettre si
//                                 la date n'est pas annoncée.
//                   title       : nom de la mise à jour
//                   description : ce que ça change pour nous
//                   major       : true si c'est une MAJ importante (1.0, wipe,
//                                 gros DLC). Une MAJ majeure encore à venir est
//                                 signalée en haut du site et sur la carte.

const GAMES_DATA = [
  // ---------------------------------------------------------------
  // On découvre ensemble
  // ---------------------------------------------------------------
  {
    id: "sons-of-the-forest",
    name: "Sons of the Forest",
    category: "decouverte-commune",
    genre: ["Survie", "Coop", "Construction", "Horreur"],
    players: "1-8",
    platforms: ["PC"],
    status: "a-essayer",
    proposedBy: "Tony",
    description:
      "Survie sur une île : construction de base, cannibales qui attaquent les structures, compagnons PNJ. C'est bien la suite de The Forest (2018). Terminé depuis février 2024, plus que des correctifs — aucune mise à jour ne cassera notre partie entre deux week-ends.",
    cons:
      "L'histoire est justement la partie la plus critiquée, fragmentée en notes éparses. Optimisation moyenne, chutes de framerate surtout en multi.",
    trailerUrl: "",
    criticScore: {
      source: "Steam",
      score: "88 % (117 000 avis) · 90 % sur le dernier mois",
      url: "",
    },
    roadmap: [
      {
        date: "Février 2024",
        dateISO: "2024-02-22",
        major: true,
        title: "Sortie 1.0 — développement terminé",
        description:
          "Plus que des correctifs depuis. Aucune MAJ ne viendra casser notre partie entre deux week-ends.",
      },
    ],
  },
  {
    id: "core-keeper",
    name: "Core Keeper",
    category: "decouverte-commune",
    genre: ["Survie", "Coop", "Exploration", "Automatisation"],
    players: "1-8",
    platforms: ["PC", "Switch", "PS5", "Xbox"],
    status: "a-essayer",
    proposedBy: "Tony",
    description:
      "Creuser, automatiser avec foreuses et convoyeurs, boss à invoquer, base commune, personnage qui monte en compétences. Serveur dédié possible : la partie n'est pas coincée sur une machine.",
    cons:
      "L'automatisation reste un système parmi d'autres, pas une vraie chaîne de production. Si ça ne prend pas, Necesse est le repli sur la même case.",
    trailerUrl: "",
    criticScore: {
      source: "Steam",
      score: "94 % (23 433 avis) · 90 % sur le dernier mois",
      url: "",
    },
    roadmap: [
      {
        date: "Date non annoncée",
        major: true,
        title: "Roadmap en trois gros contenus",
        description:
          "Publiée il y a deux semaines par les développeurs. Pas de date connue : à surveiller, mais ça ne bloque pas une partie maintenant.",
      },
    ],
  },
  {
    id: "conan-exiles",
    name: "Conan Exiles",
    category: "decouverte-commune",
    genre: ["Survie", "Coop", "Construction", "Action"],
    players: "Coop et serveurs privés",
    platforms: ["PC", "PS5", "Xbox"],
    status: "a-essayer",
    proposedBy: "Les deux",
    description:
      "Construction massive, esclaves qui fabriquent à ta place, sorcellerie, et les purges : des vagues d'ennemis qui viennent casser la base. Toujours mis à jour, plein de mods.",
    cons:
      "En coop simple le jeu nous garde en laisse, impossible de s'éloigner l'un de l'autre. Il faut passer par un serveur privé.",
    trailerUrl: "",
    criticScore: null,
    roadmap: [],
  },
  {
    id: "v-rising",
    name: "V Rising",
    category: "decouverte-commune",
    genre: ["Survie", "Coop", "Action", "Construction"],
    players: "Coop et serveurs privés",
    platforms: ["PC", "PS5"],
    status: "a-essayer",
    proposedBy: "Les deux",
    description:
      "Vampire, progression par boss très lisible, stuff et stratégie partagés.",
    cons: "Jeu d'action avant tout, peu de construction longue.",
    trailerUrl: "",
    criticScore: null,
    roadmap: [],
  },

  // ---------------------------------------------------------------
  // Maxime connaît déjà, Tony part de zéro
  // ---------------------------------------------------------------
  {
    id: "project-zomboid",
    name: "Project Zomboid",
    category: "maxime-connait",
    genre: ["Survie", "Coop", "Zombies", "Bac à sable"],
    players: "Coop et serveurs privés",
    platforms: ["PC"],
    status: "a-essayer",
    proposedBy: "Maxime",
    description:
      "Zombies, loot, construction, base à tenir, aucune fin. L'intérêt : le bac à sable règle densité et vitesse des zombies, loot, progression, conséquences de la mort, et les mods vont plus loin encore. On peut en faire quelque chose de bien plus détendu que sa réputation. Stable récente qui a corrigé le multi, record de joueurs à sa sortie.",
    cons:
      "Build 42 toute fraîche, une partie des mods n'est pas republiée. Même liste et même ordre de chargement sur les deux machines, à figer AVANT de créer le monde.",
    trailerUrl: "",
    criticScore: null,
    roadmap: [
      {
        date: "Récemment",
        major: true,
        title: "Build 42 (stable) — multi corrigé",
        description:
          "Déjà sortie. Conséquence pour nous : une partie des mods n'a pas encore été republiée pour cette build.",
      },
    ],
  },
  {
    id: "7-days-to-die",
    name: "7 Days to Die",
    category: "maxime-connait",
    genre: ["Survie", "Coop", "Zombies", "Construction"],
    players: "1-8",
    platforms: ["PC", "PS5", "Xbox"],
    status: "a-essayer",
    proposedBy: "Maxime",
    description:
      "Survie zombie, base à fortifier, horde tous les 7 jours à date connue. Aucune fin, des centaines d'heures possibles, saves qui passent d'un week-end sur l'autre.",
    cons:
      "Maxime a 370 h dessus : c'est le plus gros écart de connaissance de la liste.",
    trailerUrl: "",
    criticScore: null,
    roadmap: [],
  },
  {
    id: "palworld",
    name: "Palworld",
    category: "maxime-connait",
    genre: ["Survie", "Coop", "Créatures", "Automatisation"],
    players: "Coop et serveurs privés",
    platforms: ["PC", "Xbox / Game Pass"],
    status: "a-essayer",
    proposedBy: "Maxime",
    description:
      "Des créatures qui bossent à ta place : elles minent, fabriquent, gardent la base pendant que tu explores. Monde persistant.",
    cons:
      "Il te faut un Game Pass, c'est une question d'accès. Maxime a 182 h dessus.",
    trailerUrl: "",
    criticScore: null,
    roadmap: [],
  },
  {
    id: "abiotic-factor",
    name: "Abiotic Factor",
    category: "maxime-connait",
    genre: ["Survie", "Coop", "Science-fiction"],
    players: "1-6",
    platforms: ["PC"],
    status: "a-essayer",
    proposedBy: "Maxime",
    description:
      "Survie entre scientifiques dans un complexe secret. Le mieux écrit de la liste pour la coop : on n'est jamais chacun dans son coin.",
    cons: "Maxime l'a essayé 6 h et n'y est jamais revenu.",
    trailerUrl: "",
    criticScore: null,
    roadmap: [],
  },
  {
    id: "valheim",
    name: "Valheim",
    category: "maxime-connait",
    genre: ["Survie", "Coop", "Exploration", "Construction"],
    players: "1-10",
    platforms: ["PC", "Xbox"],
    status: "a-essayer",
    proposedBy: "Maxime",
    description:
      "Exploration viking, boss à enchaîner, base commune, danger partagé.",
    cons:
      "La 1.0 sort le 9 septembre et les développeurs conseillent une carte neuve. Commencer maintenant, c'est accepter de jeter la partie.",
    trailerUrl: "",
    criticScore: null,
    roadmap: [
      {
        date: "9 septembre 2026",
        dateISO: "2026-09-09",
        major: true,
        title: "Sortie de la 1.0",
        description:
          "Les développeurs conseillent de repartir sur une carte neuve. Toute partie lancée avant est à considérer comme jetable.",
      },
    ],
  },

  // ---------------------------------------------------------------
  // Petits jeux (30 à 60 minutes)
  // ---------------------------------------------------------------
  {
    id: "slay-the-spire-2",
    name: "Slay the Spire 2",
    category: "petits-jeux",
    genre: ["Roguelike", "Cartes", "Coop"],
    players: "1-4",
    platforms: ["PC"],
    status: "a-essayer",
    proposedBy: "Maxime",
    description:
      "Jeu de cartes roguelike, mode coop jusqu'à 4. Parties courtes, aucune save à entretenir.",
    cons:
      "Les jeux de cartes à deck, ça te parle ou pas ? C'est la seule chose qui décide. Si non, on le raye.",
    trailerUrl: "",
    criticScore: null,
    roadmap: [],
  },
  {
    id: "teardown",
    name: "Teardown",
    category: "petits-jeux",
    genre: ["Bac à sable", "Destruction", "Coop", "Compétitif"],
    players: "Coop et modes compétitifs",
    platforms: ["PC", "PS5", "Xbox"],
    status: "a-essayer",
    proposedBy: "Maxime",
    description:
      "Destruction totale des décors, campagne coop et modes compétitifs.",
    cons: "",
    trailerUrl: "",
    criticScore: null,
    roadmap: [],
  },
  {
    id: "peak",
    name: "PEAK",
    category: "petits-jeux",
    genre: ["Coop", "Escalade", "Party"],
    players: "1-4",
    platforms: ["PC"],
    status: "a-essayer",
    proposedBy: "Maxime",
    description:
      "Ascensions courtes à plusieurs, la montagne change tous les jours.",
    cons: "",
    trailerUrl: "",
    criticScore: null,
    roadmap: [],
  },
  {
    id: "risk-of-rain-2",
    name: "Risk of Rain 2",
    category: "petits-jeux",
    genre: ["Roguelike", "Coop", "Action"],
    players: "1-4",
    platforms: ["PC", "PS5", "Xbox", "Switch"],
    status: "a-essayer",
    proposedBy: "Maxime",
    description:
      "Parties de 30 à 45 minutes, excellent à deux exactement.",
    cons: "",
    trailerUrl: "",
    criticScore: null,
    roadmap: [],
  },
];
