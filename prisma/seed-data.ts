// Seed content for Serendib. Coordinates are real; "bestMonths" follow
// Sri Lanka's two-monsoon pattern (south-west coast best Dec–Apr,
// east coast best May–Sep, hill country best Jan–Apr).

export type SeedDestination = {
  slug: string;
  name: string;
  region: string;
  tagline: string;
  description: string;
  lat: number;
  lng: number;
  coast: "west" | "east" | "inland";
  bestMonths: number[];
  heroImage: string;
  gallery: string[];
  highlights: string[];
};

export const destinations: SeedDestination[] = [
  {
    slug: "sigiriya",
    name: "Sigiriya & Dambulla",
    region: "Ancient Kingdoms",
    tagline: "A fifth-century palace on top of a 200-metre rock.",
    description:
      "In the dry heart of the island, King Kashyapa built a palace on top of a granite rock and guarded its stairway with a lion. The forest around it is full of reservoirs, cave temples and villages where dinner still comes on a lotus leaf.",
    lat: 7.957,
    lng: 80.7603,
    coast: "inland",
    bestMonths: [2, 3, 4, 5, 6, 7, 8, 9],
    heroImage: "/img/sigiriya-aerial.jpg",
    gallery: ["/img/sigiriya-lush.jpg", "/img/sigiriya-mist.jpg", "/img/sigiriya-couple.jpg"],
    highlights: ["Lion Rock at sunrise", "Dambulla cave temples", "Pidurangala summit", "Village cookery"],
  },
  {
    slug: "kandy",
    name: "Kandy",
    region: "Ancient Kingdoms",
    tagline: "The last royal capital, set around a lake in the hills.",
    description:
      "Kandy keeps the Temple of the Sacred Tooth Relic, drumming at dusk and the Esala Perahera, a ten-night procession of torches and elephants every July and August. It is also the gateway to the misty hill country.",
    lat: 7.2906,
    lng: 80.6337,
    coast: "inland",
    bestMonths: [1, 2, 3, 4, 7, 8],
    heroImage: "/img/kandy-temple-wide.jpg",
    gallery: ["/img/kandy-temple.jpg", "/img/kandy-fire.jpg", "/img/kandy-buddha.jpg", "/img/kandy-golden.jpg"],
    highlights: ["Temple of the Tooth", "Esala Perahera (Jul–Aug)", "Royal Botanic Gardens", "Kandyan dance"],
  },
  {
    slug: "ella",
    name: "Ella",
    region: "Tea Country",
    tagline: "A blue train, a nine-arched bridge and a ridge of tea above the clouds.",
    description:
      "Ella is a small village in a mountain gap, reached by one of the world's most beautiful train rides. Mornings start at Little Adam's Peak, and afternoons are for waiting at the Nine Arches Bridge for the train to come round the bend.",
    lat: 6.8667,
    lng: 81.0466,
    coast: "inland",
    bestMonths: [1, 2, 3, 4, 8, 9],
    heroImage: "/img/ella-nine-arches.jpg",
    gallery: ["/img/ella-train-door.jpg", "/img/ella-peak-view.jpg", "/img/ella-waterfall.jpg", "/img/ella-curve.jpg"],
    highlights: ["Nine Arches Bridge", "Kandy–Ella train", "Little Adam's Peak", "Ravana Falls"],
  },
  {
    slug: "nuwara-eliya",
    name: "Nuwara Eliya",
    region: "Tea Country",
    tagline: "Colonial bungalows, cold mornings and endless rows of tea.",
    description:
      "At 1,868 metres, 'Little England' is wrapped in hillsides of Ceylon tea. Stay in a planter's bungalow, watch the leaf being plucked at dawn, and walk Horton Plains to World's End before the mist rolls in.",
    lat: 6.9497,
    lng: 80.7891,
    coast: "inland",
    bestMonths: [1, 2, 3, 4],
    heroImage: "/img/tea-pluckers.jpg",
    gallery: ["/img/tea-ribbon.jpg", "/img/tea-mist.jpg", "/img/tea-lake.jpg"],
    highlights: ["Tea factory mornings", "Horton Plains & World's End", "Gregory Lake", "Planter's bungalows"],
  },
  {
    slug: "galle",
    name: "Galle Fort",
    region: "The Coast",
    tagline: "A 17th-century walled town where the Indian Ocean breaks on the ramparts.",
    description:
      "Inside the Dutch walls of Galle are lanes of courtyard houses, galleries and cafés. Walk the ramparts to the lighthouse at golden hour, then eat dinner in a 300-year-old house.",
    lat: 6.0329,
    lng: 80.2168,
    coast: "west",
    bestMonths: [11, 12, 1, 2, 3, 4],
    heroImage: "/img/galle-ramparts.jpg",
    gallery: ["/img/galle-aerial.jpg", "/img/galle-dusk.jpg", "/img/galle-lighthouse.jpg"],
    highlights: ["Rampart walk", "Lighthouse at dusk", "Courtyard cafés", "Koggala lagoon"],
  },
  {
    slug: "mirissa",
    name: "Mirissa & Weligama",
    region: "The Coast",
    tagline: "Stilt fishermen, crescent bays and blue whales offshore.",
    description:
      "The south coast curves through sheltered surf breaks and palm-backed coves. From December to April the water is calm enough to go out at dawn in search of blue whales, the largest animals that have ever lived.",
    lat: 5.9483,
    lng: 80.4716,
    coast: "west",
    bestMonths: [11, 12, 1, 2, 3, 4],
    heroImage: "/img/mirissa-stilt.jpg",
    gallery: ["/img/mirissa-bay.jpg", "/img/mirissa-palms.jpg", "/img/mirissa-surf-dusk.jpg"],
    highlights: ["Blue whale season", "Coconut Tree Hill", "Weligama surf", "Stilt fishermen"],
  },
  {
    slug: "yala",
    name: "Yala",
    region: "The Wild",
    tagline: "The highest density of leopards anywhere on Earth.",
    description:
      "Yala is a park of scrub jungle, rock outcrops and lagoons in the dry south-east. Sloth bears, crocodiles and elephants live here, and above all leopards, often seen lazing on the warm granite.",
    lat: 6.3725,
    lng: 81.5185,
    coast: "inland",
    bestMonths: [2, 3, 4, 5, 6, 7],
    heroImage: "/img/yala-leopard.jpg",
    gallery: ["/img/yala-leopard-drink.jpg", "/img/yala-leopard-yawn.jpg"],
    highlights: ["Leopard safaris", "Sloth bears", "Lagoon birdlife", "Bush dinners"],
  },
  {
    slug: "minneriya",
    name: "Minneriya",
    region: "The Wild",
    tagline: "The Gathering: hundreds of wild elephants at one ancient reservoir.",
    description:
      "Each dry season, as the water recedes, elephants from across the north-central plains converge on the grassy shores of a 3rd-century reservoir. It is one of the largest gatherings of Asian elephants in the world.",
    lat: 8.0333,
    lng: 80.8167,
    coast: "inland",
    bestMonths: [7, 8, 9],
    heroImage: "/img/elephants-lake.jpg",
    gallery: ["/img/elephant-tusker.jpg", "/img/elephants-shore.jpg"],
    highlights: ["The Gathering (Jul–Sep)", "Kaudulla park", "Ancient tanks", "Polonnaruwa ruins"],
  },
  {
    slug: "arugam-bay",
    name: "Arugam Bay",
    region: "The Coast",
    tagline: "A long right-hand point break and a slow east-coast village.",
    description:
      "When the south-west monsoon soaks the other side of the island, the east coast is at its best. Arugam Bay is a fishing village with world-class waves, lagoons full of birds, and painted boats pulled up on the sand.",
    lat: 6.8405,
    lng: 81.8368,
    coast: "east",
    bestMonths: [5, 6, 7, 8, 9],
    heroImage: "/img/arugam-boats.jpg",
    gallery: ["/img/arugam-surfer.jpg", "/img/arugam-wave.jpg"],
    highlights: ["Main Point surf", "Kumana birdlife", "Lagoon safaris", "Elephant Rock"],
  },
  {
    slug: "trincomalee",
    name: "Trincomalee",
    region: "The Coast",
    tagline: "One of the world's deepest natural harbours, with coral just offshore.",
    description:
      "On the north-east coast, Trincomalee pairs a clifftop Hindu temple with the white sands of Nilaveli. From May to September the sea turns glassy, so you can snorkel with reef sharks around Pigeon Island.",
    lat: 8.5874,
    lng: 81.2152,
    coast: "east",
    bestMonths: [4, 5, 6, 7, 8, 9],
    heroImage: "/img/trinco-sunset.jpg",
    gallery: ["/img/trinco-cliff.jpg", "/img/trinco-reef.jpg"],
    highlights: ["Pigeon Island snorkel", "Koneswaram temple", "Nilaveli beach", "Dolphin pods"],
  },
];

type SeedRoom = { name: string; description: string; image: string; sleeps: number; bed: string; sizeSqm: number; factor: number; units: number };

export type SeedStay = {
  slug: string;
  name: string;
  destination: string;
  category: string;
  summary: string;
  description: string;
  images: string[];
  amenities: string[];
  rating: number;
  reviewCount: number;
  priceFrom: number;
  featured: boolean;
  rooms: SeedRoom[];
};

const room = (name: string, description: string, image: string, sleeps: number, bed: string, sizeSqm: number, factor: number, units = 3): SeedRoom => ({ name, description, image, sleeps, bed, sizeSqm, factor, units });

export const stays: SeedStay[] = [
  {
    slug: "lions-breath-lodge",
    name: "Lion's Breath Lodge",
    destination: "sigiriya",
    category: "Eco Lodge",
    summary: "Jungle suites with a framed view of Lion Rock from your plunge pool.",
    description:
      "Twelve suites on stilts sit in old-growth forest, each angled so you see Lion Rock from bed. Mornings start with a lantern-lit climb and finish with hoppers on the deck. The kitchen cooks from its own village garden, and the pool looks over a reservoir where elephants come to drink at dusk.",
    images: ["/img/villa-jungle.jpg", "/img/sigiriya-lush.jpg", "/img/room-heritage.jpg", "/img/villa-shadow.jpg"],
    amenities: ["Plunge pool", "Rock-view deck", "Farm-to-table kitchen", "Guided sunrise climbs", "Ayurveda spa", "Free Wi-Fi"],
    rating: 4.9,
    reviewCount: 318,
    priceFrom: 240,
    featured: true,
    rooms: [
      room("Canopy Suite", "Raised among the treetops, with an outdoor rain shower.", "/img/room-heritage.jpg", 2, "King", 48, 1),
      room("Rock-View Pool Suite", "A private plunge pool facing Lion Rock.", "/img/villa-jungle.jpg", 2, "King", 64, 1.45, 2),
      room("Family Treehouse", "Two bedrooms joined by a rope bridge.", "/img/villa-shadow.jpg", 4, "King + Twin", 82, 1.8, 2),
    ],
  },
  {
    slug: "habarana-lake-pavilions",
    name: "Habarana Lake Pavilions",
    destination: "sigiriya",
    category: "Boutique Hotel",
    summary: "Open-sided pavilions on an ancient reservoir, halfway between three parks.",
    description:
      "Low pavilions with clay-tile roofs sit along the bank of a thousand-year-old tank. It is the best base for Minneriya, Kaudulla and Sigiriya. At night the lake fills with the sound of frogs and owls.",
    images: ["/img/villa-pavilion.jpg", "/img/room-lounge.jpg", "/img/villa-garden.jpg"],
    amenities: ["Lakefront pool", "Bicycles", "Safari desk", "Sunset boat", "Free Wi-Fi"],
    rating: 4.7,
    reviewCount: 204,
    priceFrom: 185,
    featured: false,
    rooms: [
      room("Garden Pavilion", "A cool, high-ceilinged room opening onto frangipani trees.", "/img/room-lounge.jpg", 2, "Queen", 40, 1, 4),
      room("Lake Pavilion", "A daybed on the water's edge.", "/img/villa-pavilion.jpg", 3, "King", 52, 1.35),
    ],
  },
  {
    slug: "hanthana-mist-residence",
    name: "Hanthana Mist Residence",
    destination: "kandy",
    category: "Heritage Hotel",
    summary: "A restored 1920s walauwa above Kandy, with high tea on the verandah.",
    description:
      "This former manor house of a Kandyan chieftain has been restored room by room, with teak floors, four-poster beds and a verandah over the mist-filled valley. The temple drums carry up the hill at dusk.",
    images: ["/img/room-colonial.jpg", "/img/kandy-buddha.jpg", "/img/kandy-temple.jpg"],
    amenities: ["Verandah high tea", "Library", "Valley-view pool", "Temple transfers", "Free Wi-Fi"],
    rating: 4.8,
    reviewCount: 156,
    priceFrom: 160,
    featured: false,
    rooms: [
      room("Chieftain Room", "Four-poster bed, clawfoot tub, garden view.", "/img/room-colonial.jpg", 2, "Four-poster", 38, 1),
      room("Valley Suite", "A private verandah over the Hanthana range.", "/img/room-heritage.jpg", 3, "King", 55, 1.5, 2),
    ],
  },
  {
    slug: "nine-arches-hideaway",
    name: "Nine Arches Hideaway",
    destination: "ella",
    category: "Boutique Villa",
    summary: "Six cliff-edge rooms where you can hear the train before you see it.",
    description:
      "This small hideaway hangs over the Ella gap, a ten-minute walk through tea to the Nine Arches Bridge. Breakfast is served on a swing deck facing Ella Rock. The rooms are built from local stone, and the infinity pool seems to pour straight into the valley.",
    images: ["/img/villa-swing.jpg", "/img/ella-peak-view.jpg", "/img/room-stone.jpg"],
    amenities: ["Infinity pool", "Swing deck", "Walk to Nine Arches", "Train-ticket concierge", "Free Wi-Fi"],
    rating: 4.9,
    reviewCount: 412,
    priceFrom: 140,
    featured: true,
    rooms: [
      room("Stone Room", "Hand-laid stone walls and a valley window.", "/img/room-stone.jpg", 2, "Queen", 30, 1),
      room("Gap-View Suite", "A deep bath facing Ella Rock.", "/img/villa-swing.jpg", 2, "King", 46, 1.5, 2),
    ],
  },
  {
    slug: "ravana-ridge-cabins",
    name: "Ravana Ridge Cabins",
    destination: "ella",
    category: "Eco Lodge",
    summary: "Solar-powered timber cabins on a ridge, with a firepit and stars.",
    description:
      "These simple, beautiful cabins sit among cardamom and pepper. There are hammocks on every porch and a shared firepit where the owner's family cooks kottu on Saturday nights.",
    images: ["/img/ella-curve.jpg", "/img/room-moody.jpg", "/img/ella-waterfall.jpg"],
    amenities: ["Firepit", "Hammocks", "Solar powered", "Hiking guides", "Free Wi-Fi"],
    rating: 4.6,
    reviewCount: 189,
    priceFrom: 95,
    featured: false,
    rooms: [
      room("Ridge Cabin", "Timber cabin with porch hammock.", "/img/room-moody.jpg", 2, "Double", 26, 1, 5),
      room("Loft Cabin", "Sleeping loft under a skylight.", "/img/ella-curve.jpg", 4, "Double + Twin", 38, 1.4, 2),
    ],
  },
  {
    slug: "lindula-tea-bungalow",
    name: "Lindula Tea Bungalow",
    destination: "nuwara-eliya",
    category: "Tea Estate Bungalow",
    summary: "An 1890s planter's bungalow with a butler, a fireplace and 400 acres of tea.",
    description:
      "Five bedrooms, a butler and a log fire every evening. Walk out at dawn with the pluckers, learn to cup tea in the estate's factory, and come back to a roast dinner served on old Ceylon china.",
    images: ["/img/tea-mist.jpg", "/img/room-heritage.jpg", "/img/tea-lake.jpg", "/img/tea-ribbon.jpg"],
    amenities: ["Butler service", "Log fireplace", "Factory tours", "Croquet lawn", "All meals included"],
    rating: 5.0,
    reviewCount: 97,
    priceFrom: 310,
    featured: true,
    rooms: [
      room("Planter's Room", "A bay window over the tea terraces.", "/img/room-heritage.jpg", 2, "King", 42, 1),
      room("Superintendent's Suite", "A sitting room with its own fireplace.", "/img/room-colonial.jpg", 3, "Four-poster", 60, 1.4, 1),
    ],
  },
  {
    slug: "rampart-house",
    name: "Rampart House",
    destination: "galle",
    category: "Heritage Hotel",
    summary: "A 17th-century merchant's house inside the fort walls.",
    description:
      "Behind a carved door on Pedlar Street there are three courtyards, a lap pool under a frangipani tree and eleven rooms with polished cement floors. The ramparts and the lighthouse are a two-minute walk away.",
    images: ["/img/galle-dusk.jpg", "/img/room-colonial.jpg", "/img/room-lounge.jpg", "/img/galle-aerial.jpg"],
    amenities: ["Courtyard pool", "Rooftop bar", "Bicycles", "In-fort location", "Free Wi-Fi"],
    rating: 4.8,
    reviewCount: 276,
    priceFrom: 275,
    featured: true,
    rooms: [
      room("Courtyard Room", "Opens onto the frangipani courtyard.", "/img/room-lounge.jpg", 2, "King", 36, 1),
      room("Rampart Suite", "Ocean glimpses over the fort walls.", "/img/room-colonial.jpg", 3, "King", 58, 1.6, 2),
    ],
  },
  {
    slug: "koggala-lagoon-villa",
    name: "Koggala Lagoon Villa",
    destination: "galle",
    category: "Private Villa",
    summary: "A whole villa for your party, with a lap pool and a private lagoon jetty.",
    description:
      "A four-bedroom villa between the lagoon and the sea, with a chef, a housekeeper and a lap pool as long as the lawn. Paddle out at sunrise to the cinnamon island.",
    images: ["/img/villa-lap-pool.jpg", "/img/villa-aerial.jpg", "/img/villa-garden.jpg"],
    amenities: ["Private chef", "Lap pool", "Lagoon jetty", "Kayaks", "Whole-villa exclusive"],
    rating: 4.9,
    reviewCount: 64,
    priceFrom: 520,
    featured: false,
    rooms: [room("Entire Villa (4 bedrooms)", "Sleeps eight, fully staffed.", "/img/villa-lap-pool.jpg", 8, "4 × King", 420, 1, 1)],
  },
  {
    slug: "coconut-hill-villa",
    name: "Coconut Hill Villa",
    destination: "mirissa",
    category: "Beach Resort",
    summary: "Twilight pools, a palm grove and a short walk to the whale boats.",
    description:
      "Pavilions are scattered through a coconut grove above Mirissa's bay, each with a private pool that glows at dusk. Breakfast comes to your deck, and the whale boats leave from the harbour just below.",
    images: ["/img/villa-twilight.jpg", "/img/villa-modern.jpg", "/img/mirissa-palms.jpg"],
    amenities: ["Private pools", "Beach club", "Whale-boat transfers", "Spa", "Free Wi-Fi"],
    rating: 4.8,
    reviewCount: 341,
    priceFrom: 210,
    featured: true,
    rooms: [
      room("Grove Pavilion", "Under the palms, with an outdoor bath.", "/img/villa-modern.jpg", 2, "King", 50, 1, 4),
      room("Twilight Pool Villa", "A private pool facing the bay.", "/img/villa-twilight.jpg", 3, "King", 75, 1.6, 2),
    ],
  },
  {
    slug: "weligama-surf-house",
    name: "Weligama Surf House",
    destination: "mirissa",
    category: "Boutique Hotel",
    summary: "Board racks, a courtyard pool and the best beginner waves on the island.",
    description:
      "A sociable little house built around a courtyard pool, steps from Weligama's soft beach break. You can take a lesson in the morning, eat curry at noon and watch sunset with the surf crew.",
    images: ["/img/villa-courtyard.jpg", "/img/mirissa-surf-dusk.jpg", "/img/room-stone.jpg"],
    amenities: ["Surf school", "Courtyard pool", "Yoga deck", "Board storage", "Free Wi-Fi"],
    rating: 4.7,
    reviewCount: 523,
    priceFrom: 85,
    featured: false,
    rooms: [
      room("Surfer Double", "Bright, simple, steps from the waves.", "/img/room-stone.jpg", 2, "Double", 24, 1, 6),
      room("Pool Loft", "Mezzanine bed over the courtyard pool.", "/img/villa-courtyard.jpg", 3, "King", 36, 1.5, 2),
    ],
  },
  {
    slug: "leopard-trails-camp",
    name: "Leopard Trails Camp",
    destination: "yala",
    category: "Safari Camp",
    summary: "Canvas suites on the edge of Block 1, with dawn game drives included.",
    description:
      "Twelve canvas suites are spread through the scrub on the park boundary, with lanterns, copper bathtubs and dinners under a tamarind tree. Two game drives a day are included, with the naturalists who know each leopard by name.",
    images: ["/img/yala-leopard-drink.jpg", "/img/villa-garden.jpg", "/img/room-moody.jpg"],
    amenities: ["Game drives included", "Naturalist guides", "Bush dinners", "Copper tubs", "All meals included"],
    rating: 4.9,
    reviewCount: 142,
    priceFrom: 390,
    featured: true,
    rooms: [
      room("Canvas Suite", "Under canvas, with an outdoor bath.", "/img/room-moody.jpg", 2, "King", 55, 1, 4),
      room("Family Tent", "Two connected tents.", "/img/villa-garden.jpg", 4, "King + Twin", 80, 1.7, 2),
    ],
  },
  {
    slug: "elephant-corridor-retreat",
    name: "Elephant Corridor Retreat",
    destination: "minneriya",
    category: "Eco Lodge",
    summary: "A low-impact lodge on a wild elephant corridor, a ten-minute drive from the park.",
    description:
      "The retreat was built to let the herds pass through, so elephants sometimes walk by the pool. Suites have earth walls, wide eaves and outdoor showers open to the sky.",
    images: ["/img/villa-loungers.jpg", "/img/elephants-shore.jpg", "/img/room-heritage.jpg"],
    amenities: ["Wildlife hide", "Pool", "Jeep safaris", "Ayurveda", "Free Wi-Fi"],
    rating: 4.7,
    reviewCount: 118,
    priceFrom: 170,
    featured: false,
    rooms: [
      room("Earth Suite", "Rammed-earth walls, open-sky shower.", "/img/room-heritage.jpg", 2, "King", 44, 1),
      room("Hide Suite", "A private deck overlooking the corridor.", "/img/villa-loungers.jpg", 3, "King", 58, 1.4, 2),
    ],
  },
  {
    slug: "pottuvil-point-beach-house",
    name: "Pottuvil Point Beach House",
    destination: "arugam-bay",
    category: "Beach Resort",
    summary: "Cabanas on an empty beach, with a short paddle to the point.",
    description:
      "Thatched cabanas sit on a quiet stretch of sand north of the main bay. There are board rentals and a lagoon outside your door, and in season the sea is glassy enough to see turtles.",
    images: ["/img/villa-shadow.jpg", "/img/arugam-surfer.jpg", "/img/room-moody.jpg"],
    amenities: ["Beachfront", "Board rental", "Lagoon tours", "Hammocks", "Free Wi-Fi"],
    rating: 4.6,
    reviewCount: 231,
    priceFrom: 120,
    featured: false,
    rooms: [
      room("Beach Cabana", "Thatched, open, ten steps to the sand.", "/img/room-moody.jpg", 2, "Queen", 28, 1, 6),
      room("Point Suite", "A sea-view deck with an outdoor shower.", "/img/villa-shadow.jpg", 3, "King", 42, 1.5, 2),
    ],
  },
  {
    slug: "nilaveli-coral-house",
    name: "Nilaveli Coral House",
    destination: "trincomalee",
    category: "Beach Resort",
    summary: "White sand, slow mornings and a boat to Pigeon Island at nine.",
    description:
      "A long, low house on Nilaveli's powder-white beach, with a pool among the casuarinas. The boat to the reef leaves after breakfast, and the dolphins usually come in the afternoon.",
    images: ["/img/trinco-cliff.jpg", "/img/villa-modern.jpg", "/img/trinco-reef.jpg"],
    amenities: ["Beachfront pool", "Snorkel boat", "Dive centre", "Seafood grill", "Free Wi-Fi"],
    rating: 4.8,
    reviewCount: 167,
    priceFrom: 230,
    featured: true,
    rooms: [
      room("Casuarina Room", "Garden room shaded by casuarina trees.", "/img/villa-modern.jpg", 2, "King", 38, 1, 5),
      room("Ocean Suite", "A wall of glass facing the bay.", "/img/trinco-cliff.jpg", 3, "King", 56, 1.5, 2),
    ],
  },
];

export type SeedExperience = {
  slug: string;
  title: string;
  destination: string;
  category: string;
  summary: string;
  description: string;
  image: string;
  duration: string;
  startTime: string;
  price: number;
  maxGuests: number;
  rating: number;
  highlights: string[];
  featured: boolean;
};

export const experiences: SeedExperience[] = [
  {
    slug: "lion-rock-sunrise",
    title: "Sunrise ascent of Lion Rock",
    destination: "sigiriya",
    category: "Culture",
    summary: "Climb past the frescoes and lion's paws before the crowds arrive.",
    description:
      "Meet your archaeologist guide at the gate as it opens. Climb through the water gardens, past the cloud maidens and the giant lion's paws, to the palace ruins on the summit as the sun lights up the forest below.",
    image: "/img/sigiriya-couple.jpg",
    duration: "4 hours",
    startTime: "06:30",
    price: 65,
    maxGuests: 8,
    rating: 4.9,
    highlights: ["Archaeologist guide", "Entry tickets included", "Fresh king coconut at the top"],
    featured: true,
  },
  {
    slug: "village-cookery-class",
    title: "Rice & curry on a lotus leaf",
    destination: "sigiriya",
    category: "Food & Tea",
    summary: "Cook seven curries over firewood with a village family.",
    description:
      "Paddle across a lotus pond to a farm, help pick vegetables from the garden, grate coconut the traditional way and cook seven curries over a wood fire. Then eat everything together, off the leaf.",
    image: "/img/food-leaf.jpg",
    duration: "3 hours",
    startTime: "10:00",
    price: 38,
    maxGuests: 10,
    rating: 5.0,
    highlights: ["Catamaran ride across the pond", "Seven-curry feast", "Recipe cards to take home"],
    featured: true,
  },
  {
    slug: "kandy-fire-dance",
    title: "Kandy fire dance & temple at dusk",
    destination: "kandy",
    category: "Culture",
    summary: "Drummers, fire-walkers, then the evening puja at the Temple of the Tooth.",
    description:
      "Front-row seats for Kandyan dancers and fire-walkers, then a walk around the lake to the Temple of the Tooth as the evening drums begin.",
    image: "/img/kandy-fire.jpg",
    duration: "3 hours",
    startTime: "17:00",
    price: 45,
    maxGuests: 12,
    rating: 4.7,
    highlights: ["Reserved seats", "Temple guide", "Lakeside walk"],
    featured: false,
  },
  {
    slug: "blue-train-kandy-ella",
    title: "The blue train: Kandy to Ella",
    destination: "ella",
    category: "Rail & Hike",
    summary: "Reserved observation seats on one of the world's great train rides.",
    description:
      "Seven hours through tea estates, tunnels and cloud forest, with reserved seats in the observation carriage. We meet you at Kandy station, and a driver collects your bags so you travel light.",
    image: "/img/ella-train-door.jpg",
    duration: "7 hours",
    startTime: "08:47",
    price: 55,
    maxGuests: 6,
    rating: 4.9,
    highlights: ["Observation-car seats", "Luggage transferred by road", "Station-side breakfast"],
    featured: true,
  },
  {
    slug: "little-adams-nine-arches",
    title: "Little Adam's Peak & Nine Arches walk",
    destination: "ella",
    category: "Rail & Hike",
    summary: "Ridge-top sunrise, then down through tea to meet the train on the bridge.",
    description:
      "An easy, beautiful hike: watch the sunrise from Little Adam's Peak, walk down through tea gardens and time your arrival at the Nine Arches Bridge for the 9:30 train.",
    image: "/img/ella-nine-arches.jpg",
    duration: "3.5 hours",
    startTime: "05:45",
    price: 30,
    maxGuests: 10,
    rating: 4.8,
    highlights: ["Local guide", "Train timetable sync", "Tea stop at a family estate"],
    featured: false,
  },
  {
    slug: "tea-factory-morning",
    title: "Pluck, wither, roll: a tea factory morning",
    destination: "nuwara-eliya",
    category: "Food & Tea",
    summary: "Pick leaf with the pluckers, then follow it through a working factory.",
    description:
      "Start in the field with a plucking basket, follow your leaf through withering, rolling and firing, then cup six grades of tea with the estate's taster.",
    image: "/img/tea-ribbon.jpg",
    duration: "4 hours",
    startTime: "07:30",
    price: 40,
    maxGuests: 8,
    rating: 4.9,
    highlights: ["Hands-on plucking", "Factory tour", "Professional tea cupping"],
    featured: true,
  },
  {
    slug: "galle-golden-hour",
    title: "Galle Fort ramparts at golden hour",
    destination: "galle",
    category: "Culture",
    summary: "Stories of traders, forts and families along the walls at sunset.",
    description:
      "A historian leads you through 400 years of Portuguese, Dutch and British rule, ending at the lighthouse with a cold ginger beer as the sun drops into the sea.",
    image: "/img/galle-lighthouse.jpg",
    duration: "2 hours",
    startTime: "16:30",
    price: 25,
    maxGuests: 12,
    rating: 4.7,
    highlights: ["Historian guide", "Hidden courtyards", "Sunset at the lighthouse"],
    featured: false,
  },
  {
    slug: "tuktuk-street-food",
    title: "Tuk-tuk street food crawl",
    destination: "galle",
    category: "Food & Tea",
    summary: "Kottu, hoppers and wood-apple juice from roadside stalls only locals know.",
    description:
      "Hop between six stalls in a vintage tuk-tuk, tasting egg hoppers, devilled cuttlefish and kottu chopped to the beat of steel blades.",
    image: "/img/tuktuk.jpg",
    duration: "3 hours",
    startTime: "18:00",
    price: 32,
    maxGuests: 6,
    rating: 4.8,
    highlights: ["Six tastings", "Vintage tuk-tuk", "Vegetarian friendly"],
    featured: false,
  },
  {
    slug: "blue-whale-mirissa",
    title: "Blue whales off Mirissa",
    destination: "mirissa",
    category: "Ocean",
    summary: "A responsible small boat out to the deep shelf where blue whales feed.",
    description:
      "Mirissa is one of the best places on Earth to see blue whales. Our small, licensed boat keeps its distance and its engine low, with a marine biologist aboard.",
    image: "/img/mirissa-bay.jpg",
    duration: "5 hours",
    startTime: "06:30",
    price: 70,
    maxGuests: 20,
    rating: 4.8,
    highlights: ["Marine biologist aboard", "Responsible-watching code", "Breakfast on deck"],
    featured: true,
  },
  {
    slug: "weligama-surf-lesson",
    title: "Learn to surf in Weligama",
    destination: "mirissa",
    category: "Adventure",
    summary: "Two hours on the gentlest, warmest beginner waves you'll ever find.",
    description:
      "A certified instructor teaches you the pop-up on the sand. By the end of the lesson, most guests are standing on the board.",
    image: "/img/mirissa-surf-dusk.jpg",
    duration: "2 hours",
    startTime: "07:00",
    price: 35,
    maxGuests: 6,
    rating: 4.9,
    highlights: ["Board & rash vest", "1:3 instructor ratio", "Photos included"],
    featured: false,
  },
  {
    slug: "yala-leopard-safari",
    title: "Leopard safari, Yala Block 1",
    destination: "yala",
    category: "Wildlife",
    summary: "First jeep through the gate, with a tracker who reads the paw prints.",
    description:
      "Enter at 06:00 with a naturalist and tracker in an open jeep. We go slowly, keep a respectful distance and stop for a bush breakfast near the lagoons.",
    image: "/img/yala-leopard.jpg",
    duration: "6 hours",
    startTime: "05:00",
    price: 120,
    maxGuests: 6,
    rating: 4.9,
    highlights: ["Naturalist + tracker", "Park fees included", "Bush breakfast"],
    featured: true,
  },
  {
    slug: "minneriya-gathering",
    title: "The Gathering at Minneriya",
    destination: "minneriya",
    category: "Wildlife",
    summary: "Hundreds of wild elephants on the shores of an ancient reservoir.",
    description:
      "In the late afternoon the herds come out of the forest to graze. We park quietly, switch off the engine and let them come to us.",
    image: "/img/elephants-lake.jpg",
    duration: "4 hours",
    startTime: "14:30",
    price: 85,
    maxGuests: 6,
    rating: 4.9,
    highlights: ["Open jeep", "Park fees included", "Engine-off viewing"],
    featured: true,
  },
  {
    slug: "arugam-point-session",
    title: "Arugam Bay point-break session",
    destination: "arugam-bay",
    category: "Adventure",
    summary: "Guided sessions at the right breaks for your level, by tuk-tuk.",
    description:
      "Your surf guide reads the swell and takes you to Main Point, Whiskey Point or Peanut Farm, whichever is working best.",
    image: "/img/arugam-surfer.jpg",
    duration: "3 hours",
    startTime: "06:00",
    price: 45,
    maxGuests: 4,
    rating: 4.8,
    highlights: ["Surf guide", "Tuk-tuk transfers", "Board included"],
    featured: false,
  },
  {
    slug: "pigeon-island-snorkel",
    title: "Snorkel Pigeon Island",
    destination: "trincomalee",
    category: "Ocean",
    summary: "Swim with blacktip reef sharks and turtles over a living coral garden.",
    description:
      "A short boat ride from Nilaveli to a protected marine park. The water is shallow and clear, with parrotfish, turtles and the occasional reef shark.",
    image: "/img/trinco-reef.jpg",
    duration: "4 hours",
    startTime: "08:30",
    price: 55,
    maxGuests: 10,
    rating: 4.7,
    highlights: ["Park permits", "Snorkel gear", "Fresh fruit on board"],
    featured: false,
  },
];
