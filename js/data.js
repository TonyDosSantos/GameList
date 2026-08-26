// Les deux personnes qui notent. Chaque jeu peut recevoir un avis de chacun.
const REVIEWERS = ["Maxime", "Tony"];

// Dépôt GitHub, utilisé pour pré-remplir la création de fichier depuis le
// formulaire d'avis.
const REPO = "TonyDosSantos/GameList";

// Branche technique où le formulaire dépose un fichier par avis en attente.
// Elle est traitée par .github/workflows/avis-en-attente-vers-pr.yml puis
// remise à zéro : ne jamais y committer autre chose à la main.
const STAGING_BRANCH = "avis-en-attente-branche";

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
//  trailerUrl   : lien YouTube de la bande-annonce (optionnel). Le site en
//                 extrait l'identifiant et intègre le lecteur dans la fiche.
//  scores       : [{ source, score, url }] — autant de notes que voulu, par
//                 exemple celle des joueurs (Steam) et celle de la presse
//                 (Metacritic, OpenCritic). L'écart entre les deux est
//                 souvent l'information la plus utile. `url` peut être vide.
//
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
//                                 signalée sur la carte du jeu.
//
// Les avis ne sont PAS ici : ils vivent dans js/reviews.js, rangés par
// identifiant de jeu, et sont écrits par un workflow. La séparation est
// volontaire — les données écrites à la main d'un côté, celles écrites par la
// machine de l'autre.
//
// Notes et roadmaps relevées le 26 août 2026 depuis Steam, Metacritic,
// OpenCritic et les annonces des développeurs. Elles vieillissent : les
// chiffres bougent, les dates aussi.

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
    trailerUrl: "https://www.youtube.com/watch?v=VLTrULBuk2E",
    scores: [
      {
        source: "Joueurs Steam",
        score: "88 % positifs (117 560 avis) — « Très positives »",
        url: "https://store.steampowered.com/app/1326470/Sons_Of_The_Forest/",
      },
      {
        source: "Presse",
        score: "Metacritic 86/100",
        url: "https://www.metacritic.com/game/sons-of-the-forest/",
      },
    ],
    roadmap: [
      {
        date: "22 février 2024",
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
    trailerUrl: "https://www.youtube.com/watch?v=meeMCa6UadY",
    scores: [
      {
        source: "Joueurs Steam",
        score: "94 % positifs (23 441 avis) — « Très positives »",
        url: "https://store.steampowered.com/app/1621690/Core_Keeper/",
      },
      {
        source: "Presse",
        score: "Metacritic 86/100",
        url: "https://www.metacritic.com/game/core-keeper/",
      },
    ],
    roadmap: [
      {
        date: "28 janvier 2026",
        dateISO: "2026-01-28",
        major: true,
        title: "Void & Voltage",
        description:
          "Déjà sortie : nouveau biome Breaker's Reach avec son boss, lance-flammes et minigun, bras robotisé de ferme, extracteur de graines.",
      },
      {
        date: "Date non annoncée",
        major: true,
        title: "« Road to the Maw » — 3 gros contenus",
        description:
          "La roadmap 2026 annoncée par les développeurs, découpée en trois mises à jour. La prochaine s'appelle « Riders of the Underground » (1.3.0), suivie d'une 1.3.1 mineure fin 2026. Aucune date : à surveiller, mais ça ne bloque pas une partie maintenant.",
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
    trailerUrl: "https://www.youtube.com/watch?v=vne2zKe4bM8",
    scores: [
      {
        source: "Joueurs Steam",
        score: "79 % positifs (39 571 avis) — « Plutôt positives »",
        url: "https://store.steampowered.com/app/440900/Conan_Exiles/",
      },
      {
        source: "Presse",
        score: "OpenCritic 68/100 — « Fair »",
        url: "https://opencritic.com/game/6050/conan-exiles/",
      },
    ],
    roadmap: [
      {
        date: "Mai 2026",
        dateISO: "2026-05-05",
        major: true,
        title: "Enhanced Update",
        description:
          "Déjà sortie : refonte technique du jeu, qui est désormais vendu sous le nom « Conan Exiles Enhanced ».",
      },
    ],
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
    trailerUrl: "https://www.youtube.com/watch?v=lXIGwJ7wBRI",
    scores: [
      {
        source: "Joueurs Steam",
        score: "90 % positifs (54 923 avis) — « Très positives »",
        url: "https://store.steampowered.com/app/1604030/V_Rising/",
      },
      {
        source: "Presse",
        score: "Metacritic 83/100",
        url: "https://www.metacritic.com/game/v-rising/",
      },
    ],
    roadmap: [
      {
        date: "Avril 2025",
        dateISO: "2025-04-01",
        major: true,
        title: "Extension « Invaders of Oakveil »",
        description:
          "Déjà sortie. Contenu payant qui prolonge la progression au-delà du jeu de base.",
      },
    ],
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
    trailerUrl: "https://www.youtube.com/watch?v=hV-QS6lWLjw",
    scores: [
      {
        source: "Joueurs Steam",
        score: "94 % positifs (plus de 462 000 avis) — « Très positives »",
        url: "https://store.steampowered.com/app/108600/Project_Zomboid/",
      },
      {
        source: "Presse",
        score: "Pas de note d'agrégateur : le jeu est resté en accès anticipé treize ans.",
        url: "",
      },
    ],
    roadmap: [
      {
        date: "29 juillet 2026",
        dateISO: "2026-07-29",
        major: true,
        title: "Build 42 stable (42.20)",
        description:
          "Déjà sortie, et record de joueurs simultanés du jeu. ⚠️ Les sauvegardes Build 41 ne s'ouvrent PAS en Build 42 : formats incompatibles, aucun outil de conversion. Une partie commencée maintenant part forcément de zéro.",
      },
      {
        date: "Date non annoncée",
        major: true,
        title: "Build 43 — les PNJ humains",
        description:
          "Le grand chantier suivant, promis de longue date. Aucune date, et aucune garantie sur la compatibilité des sauvegardes Build 42.",
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
    trailerUrl: "https://www.youtube.com/watch?v=kikTJaVBank",
    scores: [
      {
        source: "Joueurs Steam",
        score: "85 % positifs (123 960 avis) — « Très positives »",
        url: "https://store.steampowered.com/app/251570/7_Days_to_Die/",
      },
      {
        source: "Presse",
        score: "OpenCritic 39/100 — « Weak ». L'écart avec les joueurs est le plus large de la liste.",
        url: "https://opencritic.com/game/2809/7-days-to-die",
      },
    ],
    roadmap: [
      {
        date: "Juillet 2024",
        dateISO: "2024-07-25",
        major: true,
        title: "Sortie 1.0 — fin de l'accès anticipé",
        description:
          "Après onze ans d'alpha. Le jeu continue de recevoir des mises à jour de contenu.",
      },
    ],
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
    trailerUrl: "https://www.youtube.com/watch?v=1fpGg9wNM9A",
    scores: [
      {
        source: "Joueurs Steam",
        score: "95 % positifs (179 003 avis) — « Extrêmement positives »",
        url: "https://store.steampowered.com/app/1623730/Palworld/",
      },
      {
        source: "Presse",
        score: "Metacritic 83/100",
        url: "https://www.metacritic.com/game/palworld/",
      },
    ],
    roadmap: [
      {
        date: "10 juillet 2026",
        dateISO: "2026-07-10",
        major: true,
        title: "Sortie 1.0 — fin de l'accès anticipé",
        description:
          "Déjà sortie : 72 nouveaux Pals (287 au total), deux régions inédites, mécaniques de Mutation et d'Éveil, niveau maximum porté à 80, et une vraie trame principale.",
      },
      {
        date: "En continu",
        major: false,
        title: "Mises à jour gratuites après la 1.0",
        description:
          "Pocketpair annonce ses ajouts au fil de l'eau par « Producer Letters » plutôt que par une roadmap datée.",
      },
    ],
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
    trailerUrl: "https://www.youtube.com/watch?v=sG4d1XX_D8c",
    scores: [
      {
        source: "Joueurs Steam",
        score: "96 % positifs (28 431 avis) — « Extrêmement positives », le meilleur score de la liste",
        url: "https://store.steampowered.com/app/427410/Abiotic_Factor/",
      },
      {
        source: "Presse",
        score: "Metacritic 80/100 (note provisoire d'accès anticipé)",
        url: "https://www.metacritic.com/game/abiotic-factor/",
      },
    ],
    roadmap: [
      {
        date: "Septembre 2025",
        dateISO: "2025-09-04",
        major: true,
        title: "Sortie 1.0 « Cold Fusion »",
        description:
          "Déjà sortie : fin de l'accès anticipé, avec la fin de l'histoire.",
      },
      {
        date: "Automne 2026",
        major: true,
        title: "DLC « Entropic Break »",
        description:
          "Annoncé au PC Gaming Show de juin 2026 pour l'automne, sans date précise. Premier DLC scénarisé.",
      },
    ],
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
      "La 1.0 sort le 9 septembre et les développeurs conseillent une carte neuve. Vérification faite, c'est moins radical qu'annoncé : un ancien monde reste jouable et reçoit le nouveau contenu, mais seulement dans les zones qu'on n'a pas encore explorées. Commencer maintenant, c'est donc surtout se priver du Deep North là où on aura déjà mis les pieds.",
    trailerUrl: "https://www.youtube.com/watch?v=9DGRIBjgqHQ",
    scores: [
      {
        source: "Joueurs Steam",
        score: "94 % positifs (540 670 avis) — « Très positives »",
        url: "https://store.steampowered.com/app/892970/Valheim/",
      },
      {
        source: "Presse",
        score: "OpenCritic 85/100 — « Mighty »",
        url: "https://opencritic.com/game/12081/valheim",
      },
    ],
    roadmap: [
      {
        date: "9 septembre 2026",
        dateISO: "2026-09-09",
        major: true,
        title: "Sortie 1.0 + biome Deep North",
        description:
          "Fin de l'accès anticipé, avec le biome Deep North, la sortie PS5 et le crossplay complet. Nuance utile : les anciens mondes restent jouables et reçoivent le nouveau contenu, mais uniquement dans les zones jamais explorées — d'où le conseil de repartir sur une carte neuve.",
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
    trailerUrl: "https://www.youtube.com/watch?v=Bdqubvcm8YI",
    scores: [
      {
        source: "Joueurs Steam",
        score: "66 % positifs sur la durée de vie — après un départ à 97 % le jour du lancement",
        url: "https://store.steampowered.com/app/2868840/",
      },
      {
        source: "Presse",
        score: "Pas encore de note définitive : le jeu est en accès anticipé.",
        url: "",
      },
    ],
    roadmap: [
      {
        date: "5 mars 2026",
        dateISO: "2026-03-05",
        major: true,
        title: "Lancement en accès anticipé",
        description:
          "Démarrage record : 97 % d'avis positifs et 132 000 joueurs simultanés.",
      },
      {
        date: "Avril 2026",
        dateISO: "2026-04-17",
        major: true,
        title: "Grosse mise à jour d'équilibrage — accueil hostile",
        description:
          "⚠️ Les avis se sont effondrés à 66 % : les joueurs reprochent des restrictions sur la construction de deck, la difficulté et un boss jugé injuste. Le jeu reste en développement, ça peut rebasculer.",
      },
    ],
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
    trailerUrl: "https://www.youtube.com/watch?v=0bMgsLF6iiU",
    scores: [
      {
        source: "Joueurs Steam",
        score: "96 % positifs (134 377 avis) — « Extrêmement positives »",
        url: "https://store.steampowered.com/app/1167630/Teardown/",
      },
      {
        source: "Presse",
        score: "Metacritic 80/100",
        url: "https://www.metacritic.com/game/teardown/",
      },
    ],
    roadmap: [
      {
        date: "12 mars 2026",
        dateISO: "2026-03-12",
        major: true,
        title: "Mise à jour multijoueur",
        description:
          "Déjà sortie : jusqu'à 12 joueurs ensemble dans le monde destructible. C'est elle qui rend le jeu intéressant pour nous.",
      },
    ],
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
    trailerUrl: "https://www.youtube.com/watch?v=jrlUVhLBjG0",
    scores: [
      {
        source: "Joueurs Steam",
        score: "95 % positifs (140 608 avis) — « Extrêmement positives »",
        url: "https://store.steampowered.com/app/3527290/PEAK/",
      },
      {
        source: "Presse",
        score: "Pas de note d'agrégateur ; la presse salue « des mécaniques serrées et un vrai sens du coop ».",
        url: "",
      },
    ],
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
    trailerUrl: "https://www.youtube.com/watch?v=I4fjqbYIFIg",
    scores: [
      {
        source: "Joueurs Steam",
        score: "95 % positifs (162 990 avis) — « Extrêmement positives »",
        url: "https://store.steampowered.com/app/632360/Risk_of_Rain_2/",
      },
      {
        source: "Presse",
        score: "Metacritic 85/100",
        url: "https://www.metacritic.com/game/risk-of-rain-2/",
      },
    ],
    roadmap: [
      {
        date: "18 novembre 2025",
        dateISO: "2025-11-18",
        major: true,
        title: "Extension « Alloyed Collective »",
        description:
          "Déjà sortie : deux nouveaux survivants, six niveaux et de nouveaux objets.",
      },
    ],
  },
];
