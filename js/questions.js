// ============================================================
//  BANQUE DE QUESTIONS
// ------------------------------------------------------------
//  QCM :   { id, cat, diff (1 facile, 2 moyen, 3 difficile), q,
//            a: [BONNE RÉPONSE, mauvaise, mauvaise],   ← la bonne réponse en 1er
//            explain?, fun?, duration?, points?, image? }
//          (l'ordre des réponses est mélangé automatiquement en jeu)
//
//  Cite-moi X :
//          { id, type: 'free', cat, diff, q, count,
//            accepted: ['Réponse|Variante|Autre orthographe', ...],
//            duration? }
//          `accepted` sert à pré-cocher les bonnes réponses ;
//          l'hôte valide toujours à la main.
//
//  Catégories : series, musique, cinema, jeux, pubs, tech, culture
// ============================================================

export const QUESTIONS = [
  // ---------------------------------------------------- SÉRIES & TV
  { id: 's01', cat: 'series', diff: 1, q: 'Dans Friends, comment s’appelle le singe de Ross ?', a: ['Marcel', 'Maurice', 'Monty'], fun: '🐒' },
  { id: 's02', cat: 'series', diff: 1, q: 'Dans Friends, comment s’appelle le café où se retrouve la bande ?', a: ['Central Perk', 'Central Park', 'Coffee Perk'] },
  { id: 's03', cat: 'series', diff: 1, q: 'Combien de saisons compte la série Friends ?', a: ['10', '8', '12'] },
  { id: 's04', cat: 'series', diff: 1, q: 'Quel est le nom de famille de Buffy, la tueuse de vampires ?', a: ['Summers', 'Sanders', 'Simmons'] },
  { id: 's05', cat: 'series', diff: 1, q: 'Comment s’appelle l’Observateur de Buffy ?', a: ['Rupert Giles', 'Angel', 'Spike'] },
  { id: 's06', cat: 'series', diff: 2, q: 'Dans quelle ville se déroule la série Dawson ?', a: ['Capeside', 'Sunnydale', 'Smallville'] },
  { id: 's07', cat: 'series', diff: 1, q: 'Quel est le nom de famille des sœurs de Charmed ?', a: ['Halliwell', 'Hollister', 'Hallowell'] },
  { id: 's08', cat: 'series', diff: 2, q: 'Dans Beverly Hills 90210, comment s’appelle le snack où traîne la bande ?', a: ['Le Peach Pit', 'Le Pizza Pit', 'Le Peach Pie'] },
  { id: 's09', cat: 'series', diff: 1, q: 'Dans Malcolm, comment s’appelle le père de famille ?', a: ['Hal', 'Hank', 'Harold'] },
  { id: 's10', cat: 'series', diff: 1, q: 'Le Prince de Bel-Air : de quelle ville Will est-il originaire ?', a: ['Philadelphie', 'Chicago', 'Détroit'] },
  { id: 's11', cat: 'series', diff: 1, q: 'Dans X-Files, quel est le prénom de l’agent Mulder ?', a: ['Fox', 'Walter', 'Dana'] },
  { id: 's12', cat: 'series', diff: 1, q: 'Dans Sex and the City, quel est le nom de famille de Carrie ?', a: ['Bradshaw', 'Bradley', 'Brandon'] },
  { id: 's13', cat: 'series', diff: 2, q: 'Dans Urgences, comment s’appelle l’hôpital de Chicago ?', a: ['County General', 'Seattle Grace', 'Sacred Heart'] },
  { id: 's14', cat: 'series', diff: 1, q: 'Qui joue le roi Arthur dans Kaamelott ?', a: ['Alexandre Astier', 'Franck Pitiot', 'Jean-Christophe Hembert'] },
  { id: 's15', cat: 'series', diff: 2, q: 'Qui a remporté la toute première saison de Loft Story en 2001 ?', a: ['Loana et Christophe', 'Loana et Jean-Édouard', 'Kenza et Steevy'] },
  { id: 's16', cat: 'series', diff: 1, q: 'Qui a remporté la première saison de la Star Academy en 2001 ?', a: ['Jenifer', 'Nolwenn Leroy', 'Grégory Lemarchal'] },
  { id: 's17', cat: 'series', diff: 1, q: 'Qui présentait « Qui veut gagner des millions ? » en France ?', a: ['Jean-Pierre Foucault', 'Nagui', 'Arthur'] },
  { id: 's18', cat: 'series', diff: 1, q: 'Sur quelle chaîne passait le Club Dorothée ?', a: ['TF1', 'France 2', 'M6'] },
  { id: 's19', cat: 'series', diff: 1, q: 'Dans Fort Boyard, qui pose les énigmes du haut de sa vigie ?', a: ['Le Père Fouras', 'Passe-Partout', 'La Boule'] },
  { id: 's20', cat: 'series', diff: 2, q: 'Dans quelle ville se déroule la série Les Frères Scott ?', a: ['Tree Hill', 'Capeside', 'Newport Beach'] },
  { id: 's21', cat: 'series', diff: 2, q: 'Dans Newport Beach (The O.C.), quel est le nom de famille de Ryan ?', a: ['Atwood', 'Cohen', 'Cooper'] },
  { id: 's22', cat: 'series', diff: 3, q: 'Dans Lost, quel est le numéro du vol Oceanic qui s’écrase sur l’île ?', a: ['815', '316', '747'] },
  { id: 's23', cat: 'series', diff: 2, q: 'Dans Prison Break, qui se fait volontairement incarcérer pour faire évader son frère ?', a: ['Michael Scofield', 'Lincoln Burrows', 'Fernando Sucre'] },
  { id: 's24', cat: 'series', diff: 1, q: 'Dans quelle rue vivent les Desperate Housewives ?', a: ['Wisteria Lane', 'Elm Street', 'Melrose Place'] },
  { id: 's25', cat: 'series', diff: 1, q: 'Comment s’appelle le héros de Dragon Ball ?', a: ['Son Goku', 'Végéta', 'Krilin'] },
  { id: 's26', cat: 'series', diff: 2, q: 'Dans la VF de Sailor Moon, comment s’appelle l’héroïne Usagi ?', a: ['Bunny', 'Sakura', 'Molly'] },
  { id: 's27', cat: 'series', diff: 1, q: 'Dans quelle ville sous-marine vit Bob l’éponge ?', a: ['Bikini Bottom', 'Atlantide', 'Corail City'] },
  { id: 's28', cat: 'series', diff: 2, q: 'Dans Friends, quel est le métier de Ross ?', a: ['Paléontologue', 'Archéologue', 'Géologue'] },

  // ---------------------------------------------------- MUSIQUE
  { id: 'm01', cat: 'musique', diff: 1, q: 'Qui chantait « Moi… Lolita » ?', a: ['Alizée', 'Lorie', 'Jenifer'] },
  { id: 'm02', cat: 'musique', diff: 1, q: 'Combien de membres comptaient les Spice Girls ?', a: ['5', '4', '6'] },
  { id: 'm03', cat: 'musique', diff: 2, q: 'En quelle année sort « …Baby One More Time » de Britney Spears ?', a: ['1998', '1996', '2001'] },
  { id: 'm04', cat: 'musique', diff: 1, q: 'Combien de membres comptait le boys band 2Be3 ?', a: ['3', '4', '5'] },
  { id: 'm05', cat: 'musique', diff: 1, q: 'Quel groupe chantait « Aserejé » en 2002 ?', a: ['Las Ketchup', 'Los del Río', 'Las Chicas'] },
  { id: 'm06', cat: 'musique', diff: 1, q: 'Qui chantait « Mambo No. 5 » en 1999 ?', a: ['Lou Bega', 'Ricky Martin', 'Enrique Iglesias'] },
  { id: 'm07', cat: 'musique', diff: 2, q: 'Quel groupe chantait « Hey oh » en 2003 ?', a: ['Tragédie', 'Alliance Ethnik', 'Native'] },
  { id: 'm08', cat: 'musique', diff: 2, q: 'Qui chantait « Tu m’oublieras » en 1998 ?', a: ['Larusso', 'Ophélie Winter', 'Lââm'] },
  { id: 'm09', cat: 'musique', diff: 2, q: 'Quel groupe chantait « La Tribu de Dana » ?', a: ['Manau', 'Matmatah', 'Tryo'] },
  { id: 'm10', cat: 'musique', diff: 2, q: 'Qui chantait « Bouge de là » en 1990 ?', a: ['MC Solaar', 'IAM', 'NTM'] },
  { id: 'm11', cat: 'musique', diff: 1, q: 'Quel duo français sort « One More Time » en 2000 ?', a: ['Daft Punk', 'Air', 'Cassius'] },
  { id: 'm12', cat: 'musique', diff: 1, q: 'Quel groupe chantait « Blue (Da Ba Dee) » ?', a: ['Eiffel 65', 'Aqua', 'Vengaboys'] },
  { id: 'm13', cat: 'musique', diff: 1, q: 'Quel groupe chantait « Barbie Girl » en 1997 ?', a: ['Aqua', 'Scooter', 'Vengaboys'] },
  { id: 'm14', cat: 'musique', diff: 1, q: 'Quel était le chanteur de Nirvana ?', a: ['Kurt Cobain', 'Eddie Vedder', 'Chris Cornell'] },
  { id: 'm15', cat: 'musique', diff: 1, q: 'Dans quel boys band a débuté Justin Timberlake ?', a: ['*NSYNC', 'Backstreet Boys', 'Boyzone'] },
  { id: 'm16', cat: 'musique', diff: 2, q: 'Quel groupe de frères chantait « MMMBop » en 1997 ?', a: ['Hanson', 'Jonas Brothers', 'Take That'] },
  { id: 'm17', cat: 'musique', diff: 1, q: 'Qui chantait « Désenchantée » en 1991 ?', a: ['Mylène Farmer', 'Patricia Kaas', 'Vanessa Paradis'] },
  { id: 'm18', cat: 'musique', diff: 2, q: 'Quel est le vrai nom d’Eminem ?', a: ['Marshall Mathers', 'Curtis Jackson', 'Calvin Broadus'] },
  { id: 'm19', cat: 'musique', diff: 1, q: 'Quelle chanteuse a débuté avec les Destiny’s Child ?', a: ['Beyoncé', 'Rihanna', 'Alicia Keys'] },
  { id: 'm20', cat: 'musique', diff: 2, q: 'Qui chantait « Freed from Desire » en 1996 ?', a: ['Gala', 'Corona', 'Alexia'] },
  { id: 'm21', cat: 'musique', diff: 3, q: 'Quel groupe chantait « Coco Jamboo » en 1996 ?', a: ['Mr. President', 'Ace of Base', 'Culture Beat'] },
  { id: 'm22', cat: 'musique', diff: 1, q: 'Pour quel film Céline Dion chante-t-elle « My Heart Will Go On » ?', a: ['Titanic', 'Bodyguard', 'Armageddon'] },
  { id: 'm23', cat: 'musique', diff: 2, q: 'Qui chantait « Dieu m’a donné la foi » en 1995 ?', a: ['Ophélie Winter', 'Larusso', 'Native'] },

  // ---------------------------------------------------- CINÉMA
  { id: 'c01', cat: 'cinema', diff: 1, q: 'En quelle année sort le film Titanic ?', a: ['1997', '1995', '1999'] },
  { id: 'c02', cat: 'cinema', diff: 1, q: 'Dans Matrix, quelle pilule Neo choisit-il ?', a: ['La rouge', 'La bleue', 'La verte'] },
  { id: 'c03', cat: 'cinema', diff: 2, q: 'Qui joue François Pignon dans Le Dîner de cons ?', a: ['Jacques Villeret', 'Thierry Lhermitte', 'Daniel Prévost'] },
  { id: 'c04', cat: 'cinema', diff: 1, q: 'Qui joue Jacquouille la Fripouille dans Les Visiteurs ?', a: ['Christian Clavier', 'Jean Reno', 'Gérard Depardieu'] },
  { id: 'c05', cat: 'cinema', diff: 1, q: 'Dans Le Roi Lion, comment s’appelle le père de Simba ?', a: ['Mufasa', 'Scar', 'Rafiki'] },
  { id: 'c06', cat: 'cinema', diff: 1, q: 'Comment s’appelle le cowboy de Toy Story ?', a: ['Woody', 'Buzz', 'Jessie'] },
  { id: 'c07', cat: 'cinema', diff: 3, q: 'Dans Le Fabuleux Destin d’Amélie Poulain, dans quel café travaille Amélie ?', a: ['Les Deux Moulins', 'Le Moulin Rouge', 'Le Chat Noir'] },
  { id: 'c08', cat: 'cinema', diff: 1, q: 'Dans quelle ville se déroule le film Taxi (1998) ?', a: ['Marseille', 'Nice', 'Lyon'] },
  { id: 'c09', cat: 'cinema', diff: 1, q: 'Qui a réalisé Jurassic Park ?', a: ['Steven Spielberg', 'James Cameron', 'George Lucas'] },
  { id: 'c10', cat: 'cinema', diff: 1, q: 'Forrest Gump : « La vie, c’est comme une boîte de… »', a: ['Chocolats', 'Biscuits', 'Bonbons'] },
  { id: 'c11', cat: 'cinema', diff: 1, q: 'Qui a réalisé Pulp Fiction ?', a: ['Quentin Tarantino', 'Martin Scorsese', 'David Fincher'] },
  { id: 'c12', cat: 'cinema', diff: 1, q: 'Comment s’appelle l’école de sorcellerie de Harry Potter ?', a: ['Poudlard', 'Beauxbâtons', 'Durmstrang'] },
  { id: 'c13', cat: 'cinema', diff: 1, q: 'Dans Le Seigneur des anneaux, qui porte l’Anneau jusqu’au Mordor ?', a: ['Frodon', 'Aragorn', 'Legolas'] },
  { id: 'c14', cat: 'cinema', diff: 2, q: 'Comment surnomme-t-on le tueur masqué de Scream ?', a: ['Ghostface', 'Jason', 'Freddy'] },
  { id: 'c15', cat: 'cinema', diff: 2, q: 'Qui a réalisé La Haine (1995) ?', a: ['Mathieu Kassovitz', 'Luc Besson', 'Jean-Pierre Jeunet'] },
  { id: 'c16', cat: 'cinema', diff: 2, q: 'Qui joue Leeloo dans Le Cinquième Élément ?', a: ['Milla Jovovich', 'Natalie Portman', 'Uma Thurman'] },
  { id: 'c17', cat: 'cinema', diff: 1, q: 'Comment s’appelle la princesse épouse de Shrek ?', a: ['Fiona', 'Aurore', 'Ariel'] },
  { id: 'c18', cat: 'cinema', diff: 1, q: 'Qui a réalisé Astérix & Obélix : Mission Cléopâtre ?', a: ['Alain Chabat', 'Claude Zidi', 'Gérard Jugnot'] },
  { id: 'c19', cat: 'cinema', diff: 2, q: 'Qui joue le partenaire de Will Smith dans Men in Black ?', a: ['Tommy Lee Jones', 'Harrison Ford', 'Bruce Willis'] },
  { id: 'c20', cat: 'cinema', diff: 1, q: 'Qui joue Kevin dans Maman, j’ai raté l’avion ?', a: ['Macaulay Culkin', 'Elijah Wood', 'Haley Joel Osment'] },
  { id: 'c21', cat: 'cinema', diff: 2, q: 'Dans Bienvenue chez les Ch’tis, dans quelle ville est muté Philippe ?', a: ['Bergues', 'Dunkerque', 'Lille'] },

  // ---------------------------------------------------- JEUX VIDÉO
  { id: 'j01', cat: 'jeux', diff: 1, q: 'Quel Pokémon accompagne Sacha dans le dessin animé ?', a: ['Pikachu', 'Évoli', 'Rondoudou'] },
  { id: 'j02', cat: 'jeux', diff: 2, q: 'Dans quelle région se déroulent Pokémon Rouge et Bleu ?', a: ['Kanto', 'Johto', 'Hoenn'] },
  { id: 'j03', cat: 'jeux', diff: 1, q: 'Dans quelle série de jeux incarne-t-on Lara Croft ?', a: ['Tomb Raider', 'Resident Evil', 'Metal Gear'] },
  { id: 'j04', cat: 'jeux', diff: 1, q: 'Quelle est la mascotte de Sega ?', a: ['Sonic', 'Mario', 'Crash'] },
  { id: 'j05', cat: 'jeux', diff: 2, q: 'En quelle année la première PlayStation sort-elle en Europe ?', a: ['1995', '1993', '1998'] },
  { id: 'j06', cat: 'jeux', diff: 1, q: 'Comment s’appelle le héros de la série Zelda ?', a: ['Link', 'Zelda', 'Ganon'] },
  { id: 'j07', cat: 'jeux', diff: 3, q: 'Comment s’appelle la langue imaginaire parlée dans Les Sims ?', a: ['Le simlish', 'Le simlais', 'Le sims-speak'] },
  { id: 'j08', cat: 'jeux', diff: 2, q: 'Crash Bandicoot est un…', a: ['Marsupial', 'Renard', 'Raton laveur'] },
  { id: 'j09', cat: 'jeux', diff: 1, q: 'Spyro est un petit…', a: ['Dragon', 'Dinosaure', 'Lézard'] },
  { id: 'j10', cat: 'jeux', diff: 2, q: 'Quel est le héros de Final Fantasy VII ?', a: ['Cloud', 'Squall', 'Zidane'] },
  { id: 'j11', cat: 'jeux', diff: 2, q: 'Quel constructeur a lancé la Dreamcast ?', a: ['Sega', 'Sony', 'Nintendo'] },
  { id: 'j12', cat: 'jeux', diff: 1, q: 'Comment s’appelle le frère de Mario ?', a: ['Luigi', 'Wario', 'Toad'] },

  // ---------------------------------------------------- PUBLICITÉS
  { id: 'p01', cat: 'pubs', diff: 1, q: '« C’est beau la vie, pour les grands et les petits » : quelle marque ?', a: ['Haribo', 'Kinder', 'Carambar'] },
  { id: 'p02', cat: 'pubs', diff: 1, q: '« Parce que je le vaux bien » : quelle marque ?', a: ['L’Oréal', 'Garnier', 'Nivea'] },
  { id: 'p03', cat: 'pubs', diff: 2, q: '« Pourquoi est-il si méchant ? Parce que ! » : c’était la pub de…', a: ['Orangina Rouge', 'Pepsi Max', 'Oasis'] },
  { id: 'p04', cat: 'pubs', diff: 2, q: 'Le fameux « Wassup ?! » de 1999, c’était une pub pour…', a: ['Budweiser', 'Heineken', 'Pepsi'] },
  { id: 'p05', cat: 'pubs', diff: 1, q: 'Quel animal est la mascotte des Frosties ?', a: ['Un tigre', 'Un lion', 'Un ours'] },
  { id: 'p06', cat: 'pubs', diff: 1, q: 'Quel animal est la mascotte des piles Duracell ?', a: ['Un lapin', 'Un chien', 'Un écureuil'] },
  { id: 'p07', cat: 'pubs', diff: 2, q: 'Comment s’appelle le lapin de Nesquik ?', a: ['Quicky', 'Bugsy', 'Groquick'] },
  { id: 'p08', cat: 'pubs', diff: 1, q: '« Qui c’est qui l’a inventé ? » : quels bonbons suisses ?', a: ['Ricola', 'Vicks', 'Halls'] },
  { id: 'p09', cat: 'pubs', diff: 2, q: '« Be fruit » était le slogan de…', a: ['Oasis', 'Tropico', 'Banga'] },

  // ---------------------------------------------------- TECHNOLOGIE & INTERNET
  { id: 't01', cat: 'tech', diff: 1, q: 'Sur MSN Messenger, quelle fonction faisait trembler la fenêtre de ton contact ?', a: ['Le Wizz', 'Le Buzz', 'Le Shake'] },
  { id: 't02', cat: 'tech', diff: 1, q: 'Quelle radio a lancé les Skyblogs ?', a: ['Skyrock', 'NRJ', 'Fun Radio'] },
  { id: 't03', cat: 'tech', diff: 2, q: 'En quelle année sort le Nokia 3310 ?', a: ['2000', '1997', '2004'] },
  { id: 't04', cat: 'tech', diff: 1, q: 'Sur quelle marque de téléphones joue-t-on au célèbre Snake ?', a: ['Nokia', 'Motorola', 'Alcatel'] },
  { id: 't05', cat: 'tech', diff: 2, q: 'En quelle année Google est-il fondé ?', a: ['1998', '1995', '2001'] },
  { id: 't06', cat: 'tech', diff: 1, q: 'Quel service français utilisait les codes 3615 ?', a: ['Le Minitel', 'Le Tatoo', 'Le Bi-Bop'] },
  { id: 't07', cat: 'tech', diff: 2, q: 'Le Tatoo, c’était…', a: ['Un bipeur', 'Un baladeur', 'Un animal virtuel'] },
  { id: 't08', cat: 'tech', diff: 2, q: 'En quelle année Apple lance-t-il le premier iPod ?', a: ['2001', '1999', '2004'] },
  { id: 't09', cat: 'tech', diff: 1, q: 'Quel logiciel de partage de musique est lancé en 1999 ?', a: ['Napster', 'Spotify', 'Deezer'] },
  { id: 't10', cat: 'tech', diff: 2, q: 'Wanadoo était le fournisseur d’accès Internet de…', a: ['France Télécom', 'SFR', 'Free'] },
  { id: 't11', cat: 'tech', diff: 1, q: 'Quel objet était l’assistant animé de Microsoft Office ?', a: ['Un trombone', 'Une agrafeuse', 'Un crayon'] },
  { id: 't12', cat: 'tech', diff: 2, q: 'Comment surnommait-on le bug de l’an 2000 ?', a: ['Y2K', 'Z2K', 'Millenium Crash'] },
  { id: 't13', cat: 'tech', diff: 2, q: 'Quelle marque a créé le Tamagotchi ?', a: ['Bandai', 'Nintendo', 'Sega'] },
  { id: 't14', cat: 'tech', diff: 1, q: 'En quelle année est lancé Facebook ?', a: ['2004', '2001', '2007'] },
  { id: 't15', cat: 'tech', diff: 3, q: 'Quel musicien a composé le son de démarrage de Windows 95 ?', a: ['Brian Eno', 'Jean-Michel Jarre', 'Moby'] },

  // ---------------------------------------------------- CULTURE POP / SPORT / OBJETS
  { id: 'g01', cat: 'culture', diff: 1, q: 'Score de la finale de la Coupe du monde 1998, France – Brésil ?', a: ['3 – 0', '2 – 0', '3 – 1'] },
  { id: 'g02', cat: 'culture', diff: 2, q: 'Combien de buts Zidane marque-t-il en finale de la Coupe du monde 1998 ?', a: ['2', '1', '3'] },
  { id: 'g03', cat: 'culture', diff: 2, q: 'En quelle année les pièces et billets en euros arrivent-ils dans nos poches ?', a: ['2002', '1999', '2000'] },
  { id: 'g04', cat: 'culture', diff: 2, q: 'Comment s’appelaient les disques en carton à collectionner qu’on retournait avec un « slammer » ?', a: ['Les Pogs', 'Les Crazy Bones', 'Les Scoubidous'] },
  { id: 'g05', cat: 'culture', diff: 2, q: 'Qui remporte le Ballon d’Or 1998 ?', a: ['Zinédine Zidane', 'Ronaldo', 'Thierry Henry'] },
  { id: 'g06', cat: 'culture', diff: 1, q: 'Finale 2006 : sur quel joueur Zidane donne-t-il son célèbre coup de tête ?', a: ['Materazzi', 'Cannavaro', 'Buffon'] },
  { id: 'g07', cat: 'culture', diff: 2, q: 'Quelle équipe est au cœur du scandale de dopage du Tour de France 1998 ?', a: ['Festina', 'Cofidis', 'US Postal'] },
  { id: 'g08', cat: 'culture', diff: 2, q: 'Quelle marque de chaussures à semelles géantes était culte chez les Spice Girls ?', a: ['Buffalo', 'Converse', 'Vans'] },
  { id: 'g09', cat: 'culture', diff: 1, q: 'Que fallait-il faire avec un Tamagotchi ?', a: ['S’occuper d’un animal virtuel', 'Écouter de la musique', 'Envoyer des SMS'] },

  // ---------------------------------------------------- CITE-MOI X (réponses libres)
  {
    id: 'f01', type: 'free', cat: 'series', diff: 1, count: 5,
    q: 'Cite-moi 5 personnages de Friends',
    accepted: ['Rachel', 'Monica', 'Phoebe', 'Joey', 'Chandler', 'Ross', 'Gunther', 'Janice', 'Ben', 'Emma', 'Mike', 'Richard', 'Carol', 'Susan', 'Ursula', 'Marcel', 'Jack|Jack Geller', 'Judy|Judy Geller', 'Mr Heckles|Heckles', 'Paolo', 'Tag', 'Frank|Frank Jr', 'Erica'],
  },
  {
    id: 'f02', type: 'free', cat: 'series', diff: 2, count: 5,
    q: 'Cite-moi 5 personnages de Buffy contre les vampires',
    accepted: ['Buffy', 'Willow', 'Alex|Xander', 'Giles|Rupert', 'Cordelia', 'Angel', 'Spike', 'Oz', 'Anya', 'Tara', 'Dawn', 'Faith', 'Joyce', 'Drusilla', 'Riley', 'Le Maitre|Maitre|Master', 'Gloria|Glory', 'Harmony', 'Jonathan', 'Andrew', 'Wesley', 'Kendra', 'Darla', 'Principal Snyder|Snyder', 'Jenny Calendar|Jenny'],
  },
  {
    id: 'f03', type: 'free', cat: 'musique', diff: 1, count: 5,
    q: 'Cite-moi les 5 Spice Girls (surnom ou prénom)',
    accepted: ['Baby|Emma|Emma Bunton', 'Scary|Mel B|Melanie Brown', 'Sporty|Mel C|Melanie Chisholm', 'Ginger|Geri|Geri Halliwell', 'Posh|Victoria|Victoria Beckham|Victoria Adams'],
  },
  {
    id: 'f04', type: 'free', cat: 'musique', diff: 2, count: 3, duration: 30,
    q: 'Cite-moi les 3 membres de 2Be3',
    accepted: ['Filip|Filip Nikolic|Philip', 'Adel|Adel Kachermi', 'Frank|Frank Delay|Franck'],
  },
  {
    id: 'f05', type: 'free', cat: 'jeux', diff: 1, count: 5,
    q: 'Cite-moi 5 Pokémon de la 1re génération',
    accepted: ['Pikachu', 'Raichu', 'Bulbizarre', 'Herbizarre', 'Florizarre', 'Salameche', 'Reptincel', 'Dracaufeu', 'Carapuce', 'Carabaffe', 'Tortank', 'Chenipan', 'Aspicot', 'Roucool', 'Rattata', 'Piafabec', 'Abo', 'Arbok', 'Sabelette', 'Nidoran', 'Melofee', 'Goupix', 'Feunard', 'Rondoudou', 'Nosferapti', 'Mystherbe', 'Paras', 'Mimitoss', 'Taupiqueur', 'Miaouss', 'Psykokwak', 'Ferosinge', 'Caninos', 'Arcanin', 'Ptitard', 'Abra', 'Kadabra', 'Alakazam', 'Machoc', 'Mackogneur', 'Chetiflor', 'Tentacool', 'Racaillou', 'Grolem', 'Ponyta', 'Galopa', 'Ramoloss', 'Magneti', 'Canarticho', 'Doduo', 'Otaria', 'Tadmorv', 'Kokiyas', 'Fantominus', 'Spectrum', 'Ectoplasma', 'Onix', 'Soporifik', 'Krabby', 'Voltorbe', 'Noeunoeuf', 'Osselait', 'Kicklee', 'Tygnon', 'Excelangue', 'Smogo', 'Rhinocorne', 'Leveinard', 'Saquedeneu', 'Kangourex', 'Hypotrempe', 'Poissirene', 'Stari', 'M. Mime|Mr Mime', 'Insecateur', 'Lippoutou', 'Elektek', 'Magmar', 'Scarabrute', 'Tauros', 'Magicarpe', 'Leviator', 'Lokhlass', 'Metamorph', 'Evoli', 'Aquali', 'Voltali', 'Pyroli', 'Porygon', 'Amonita', 'Kabuto', 'Ptera', 'Ronflex', 'Artikodin', 'Electhor', 'Sulfura', 'Minidraco', 'Draco', 'Dracolosse', 'Mewtwo', 'Mew'],
  },
  {
    id: 'f06', type: 'free', cat: 'series', diff: 1, count: 4, duration: 30,
    q: 'Cite-moi les 4 Tortues Ninja',
    accepted: ['Leonardo|Leonard', 'Donatello', 'Raphael', 'Michelangelo|Michelange'],
  },
  {
    id: 'f07', type: 'free', cat: 'cinema', diff: 1, count: 5,
    q: 'Cite-moi 5 personnages de Harry Potter',
    accepted: ['Harry', 'Ron', 'Hermione', 'Dumbledore', 'Rogue|Snape', 'Voldemort|Tom Jedusor', 'Hagrid', 'Drago|Malefoy', 'Neville', 'Luna', 'Ginny', 'Sirius|Black', 'Lupin', 'McGonagall', 'Dobby', 'Fred', 'George', 'Cho', 'Cedric', 'Bellatrix', 'Dudley', 'Vernon', 'Petunia', 'Hedwige', 'Rusard', 'Lockhart', 'Maugrey|Fol Oeil', 'Quirrell', 'Pettigrow|Queudver', 'Ombrage', 'Slughorn', 'Kreattur', 'Mimi Geignarde'],
  },
  {
    id: 'f08', type: 'free', cat: 'musique', diff: 2, count: 5,
    q: 'Cite-moi 5 boys bands des années 90-2000',
    accepted: ['Backstreet Boys', 'NSYNC|N Sync', '2Be3', 'Worlds Apart', 'Alliage', 'G Squad|G-Squad', 'Take That', 'Boyzone', 'Westlife', 'Five|5ive', 'Linkup', 'New Kids on the Block', 'Boyz II Men', 'East 17', 'Blue', 'Busted', 'Hanson', 'Poetic Lover', 'Natural', 'O-Town|O Town', '98 Degrees'],
  },
  {
    id: 'f09', type: 'free', cat: 'series', diff: 2, count: 3, duration: 30,
    q: 'Cite-moi 3 sœurs Halliwell de Charmed',
    accepted: ['Prue|Prudence', 'Piper', 'Phoebe', 'Paige'],
  },
  {
    id: 'f10', type: 'free', cat: 'jeux', diff: 2, count: 5,
    q: 'Cite-moi 5 jeux sortis sur la première PlayStation',
    accepted: ['Crash Bandicoot', 'Spyro', 'Tomb Raider', 'Final Fantasy VII|FF7|Final Fantasy 7', 'Final Fantasy VIII|FF8', 'Final Fantasy IX|FF9', 'Metal Gear Solid', 'Gran Turismo', 'Resident Evil', 'Silent Hill', 'Tekken', 'Tony Hawk', 'Ridge Racer', 'Medievil', 'Rayman', 'Abe|Oddworld', 'Wipeout', 'Driver', 'Fifa', 'ISS', 'Castlevania', 'Parappa', 'Destruction Derby', 'Syphon Filter', 'Dino Crisis', 'Colin McRae', 'V-Rally|V Rally', 'Worms', 'Croc', 'Ape Escape', 'Twisted Metal', 'Soul Reaver', 'Legend of Dragoon', 'Chrono Cross', 'Street Fighter', 'Coolboarders|Cool Boarders', 'Need for Speed', 'Harry Potter', 'Pandemonium', 'Tekken 3'],
  },
];
