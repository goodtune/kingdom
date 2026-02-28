// Animal data for the Animal Ranking Game
// Each animal has: name, emoji, category, fact, and tags for preference tracking

const ANIMALS = [
  // Large Mammals
  { id: 1, name: "Lion", emoji: "\u{1F981}", category: "large-mammal", fact: "Lions are the only cats that live in groups called prides!", tags: ["big", "cat", "africa", "predator"] },
  { id: 2, name: "Elephant", emoji: "\u{1F418}", category: "large-mammal", fact: "Elephants can remember things for many, many years!", tags: ["big", "africa", "asia", "herbivore"] },
  { id: 3, name: "Giraffe", emoji: "\u{1F992}", category: "large-mammal", fact: "A giraffe's tongue is about 20 inches long and is purple!", tags: ["big", "africa", "herbivore", "tall"] },
  { id: 4, name: "Hippo", emoji: "\u{1F99B}", category: "large-mammal", fact: "Hippos can hold their breath underwater for up to 5 minutes!", tags: ["big", "africa", "water"] },
  { id: 5, name: "Rhino", emoji: "\u{1F98F}", category: "large-mammal", fact: "A group of rhinos is called a crash!", tags: ["big", "africa", "asia", "herbivore"] },
  { id: 6, name: "Bear", emoji: "\u{1F43B}", category: "large-mammal", fact: "Bears can run almost as fast as a horse!", tags: ["big", "predator", "forest"] },
  { id: 7, name: "Gorilla", emoji: "\u{1F98D}", category: "large-mammal", fact: "Gorillas can learn sign language to talk to people!", tags: ["big", "africa", "primate"] },
  { id: 8, name: "Tiger", emoji: "\u{1F405}", category: "large-mammal", fact: "Every tiger has a unique pattern of stripes, like fingerprints!", tags: ["big", "cat", "asia", "predator"] },
  { id: 9, name: "Zebra", emoji: "\u{1F993}", category: "large-mammal", fact: "No two zebras have exactly the same stripe pattern!", tags: ["big", "africa", "herbivore"] },
  { id: 10, name: "Camel", emoji: "\u{1F42A}", category: "large-mammal", fact: "Camels can drink 30 gallons of water in just 13 minutes!", tags: ["big", "desert", "herbivore"] },
  { id: 11, name: "Moose", emoji: "\u{1F98C}", category: "large-mammal", fact: "A moose's antlers can grow up to 6 feet wide!", tags: ["big", "forest", "herbivore"] },
  { id: 12, name: "Wolf", emoji: "\u{1F43A}", category: "large-mammal", fact: "Wolves can hear sounds from up to 10 miles away!", tags: ["predator", "forest", "pack"] },

  // Small Mammals
  { id: 13, name: "Rabbit", emoji: "\u{1F430}", category: "small-mammal", fact: "Rabbits can jump up to 3 feet high!", tags: ["small", "herbivore", "fluffy"] },
  { id: 14, name: "Hamster", emoji: "\u{1F439}", category: "small-mammal", fact: "Hamsters can store food in their cheeks to eat later!", tags: ["small", "herbivore", "fluffy", "pet"] },
  { id: 15, name: "Mouse", emoji: "\u{1F42D}", category: "small-mammal", fact: "Mice can squeeze through spaces as small as a pencil!", tags: ["small", "tiny"] },
  { id: 16, name: "Koala", emoji: "\u{1F428}", category: "small-mammal", fact: "Koalas sleep up to 22 hours a day!", tags: ["small", "australia", "herbivore", "fluffy"] },
  { id: 17, name: "Panda", emoji: "\u{1F43C}", category: "small-mammal", fact: "Pandas spend about 12 hours a day eating bamboo!", tags: ["big", "asia", "herbivore", "fluffy"] },
  { id: 18, name: "Fox", emoji: "\u{1F98A}", category: "small-mammal", fact: "Foxes can make over 40 different sounds!", tags: ["small", "predator", "forest"] },
  { id: 19, name: "Raccoon", emoji: "\u{1F99D}", category: "small-mammal", fact: "Raccoons wash their food in water before eating it!", tags: ["small", "forest", "nocturnal"] },
  { id: 20, name: "Hedgehog", emoji: "\u{1F994}", category: "small-mammal", fact: "Hedgehogs have about 5,000 spines on their back!", tags: ["small", "spiky", "nocturnal"] },
  { id: 21, name: "Squirrel", emoji: "\u{1F43F}\uFE0F", category: "small-mammal", fact: "Squirrels can find food buried under a foot of snow!", tags: ["small", "forest", "herbivore"] },
  { id: 22, name: "Bat", emoji: "\u{1F987}", category: "small-mammal", fact: "Bats are the only mammals that can truly fly!", tags: ["small", "nocturnal", "flying"] },
  { id: 23, name: "Otter", emoji: "\u{1F9A6}", category: "small-mammal", fact: "Otters hold hands while they sleep so they don't float apart!", tags: ["small", "water", "playful"] },
  { id: 24, name: "Sloth", emoji: "\u{1F9A5}", category: "small-mammal", fact: "Sloths are such good swimmers — 3 times faster than they walk!", tags: ["small", "forest", "slow"] },

  // Birds
  { id: 25, name: "Eagle", emoji: "\u{1F985}", category: "bird", fact: "Eagles can spot a rabbit from over 2 miles away!", tags: ["bird", "predator", "flying", "big"] },
  { id: 26, name: "Penguin", emoji: "\u{1F427}", category: "bird", fact: "Penguins can drink salt water because they have a special gland!", tags: ["bird", "water", "cold", "flightless"] },
  { id: 27, name: "Owl", emoji: "\u{1F989}", category: "bird", fact: "Owls can rotate their heads almost all the way around!", tags: ["bird", "predator", "nocturnal", "flying"] },
  { id: 28, name: "Flamingo", emoji: "\u{1F9A9}", category: "bird", fact: "Flamingos are pink because of the shrimp they eat!", tags: ["bird", "water", "pink"] },
  { id: 29, name: "Parrot", emoji: "\u{1F99C}", category: "bird", fact: "Parrots can learn to say over 100 words!", tags: ["bird", "flying", "colorful", "smart"] },
  { id: 30, name: "Peacock", emoji: "\u{1F99A}", category: "bird", fact: "A peacock's tail feathers can be 5 feet long!", tags: ["bird", "colorful", "big"] },
  { id: 31, name: "Duck", emoji: "\u{1F986}", category: "bird", fact: "Ducks' feathers are so waterproof they stay dry underwater!", tags: ["bird", "water", "flying"] },
  { id: 32, name: "Swan", emoji: "\u{1F9A2}", category: "bird", fact: "Swans can fly at speeds up to 60 miles per hour!", tags: ["bird", "water", "flying", "big"] },
  { id: 33, name: "Rooster", emoji: "\u{1F413}", category: "bird", fact: "Roosters crow to tell everyone that the morning has arrived!", tags: ["bird", "farm"] },
  { id: 34, name: "Dove", emoji: "\u{1F54A}\uFE0F", category: "bird", fact: "Doves can find their way home from hundreds of miles away!", tags: ["bird", "flying", "peaceful"] },

  // Reptiles & Amphibians
  { id: 35, name: "Turtle", emoji: "\u{1F422}", category: "reptile", fact: "Some turtles can live for over 100 years!", tags: ["reptile", "slow", "water", "shell"] },
  { id: 36, name: "Crocodile", emoji: "\u{1F40A}", category: "reptile", fact: "Crocodiles can't stick out their tongues!", tags: ["reptile", "predator", "water", "big"] },
  { id: 37, name: "Lizard", emoji: "\u{1F98E}", category: "reptile", fact: "Some lizards can drop their tails to escape predators!", tags: ["reptile", "small"] },
  { id: 38, name: "Snake", emoji: "\u{1F40D}", category: "reptile", fact: "Snakes smell with their tongues!", tags: ["reptile", "predator", "long"] },
  { id: 39, name: "Frog", emoji: "\u{1F438}", category: "amphibian", fact: "Some frogs can jump 20 times their body length!", tags: ["amphibian", "water", "jumping", "small"] },
  { id: 40, name: "Dinosaur", emoji: "\u{1F995}", category: "reptile", fact: "Some dinosaurs were as small as chickens!", tags: ["reptile", "big", "extinct", "ancient"] },
  { id: 41, name: "Dragon", emoji: "\u{1F409}", category: "reptile", fact: "Komodo dragons are the biggest lizards alive today!", tags: ["reptile", "big", "predator", "mythical"] },

  // Sea Creatures
  { id: 42, name: "Dolphin", emoji: "\u{1F42C}", category: "sea", fact: "Dolphins sleep with one eye open!", tags: ["sea", "water", "smart", "playful"] },
  { id: 43, name: "Whale", emoji: "\u{1F433}", category: "sea", fact: "Blue whales are the biggest animals that ever lived!", tags: ["sea", "water", "big"] },
  { id: 44, name: "Shark", emoji: "\u{1F988}", category: "sea", fact: "Sharks have been around longer than dinosaurs!", tags: ["sea", "water", "predator", "big"] },
  { id: 45, name: "Octopus", emoji: "\u{1F419}", category: "sea", fact: "Octopuses have three hearts and blue blood!", tags: ["sea", "water", "smart"] },
  { id: 46, name: "Fish", emoji: "\u{1F41F}", category: "sea", fact: "Fish can feel things with their whole body!", tags: ["sea", "water", "small"] },
  { id: 47, name: "Blowfish", emoji: "\u{1F421}", category: "sea", fact: "Pufferfish can puff up to twice their size when scared!", tags: ["sea", "water", "small", "spiky"] },
  { id: 48, name: "Seal", emoji: "\u{1F9AD}", category: "sea", fact: "Seals can sleep underwater and come up to breathe without waking!", tags: ["sea", "water", "playful"] },
  { id: 49, name: "Crab", emoji: "\u{1F980}", category: "sea", fact: "Crabs can walk in all directions, but mostly walk sideways!", tags: ["sea", "water", "small", "shell"] },
  { id: 50, name: "Lobster", emoji: "\u{1F99E}", category: "sea", fact: "Lobsters taste food with their feet!", tags: ["sea", "water", "shell"] },

  // Insects & Bugs
  { id: 51, name: "Butterfly", emoji: "\u{1F98B}", category: "insect", fact: "Butterflies taste with their feet!", tags: ["insect", "flying", "colorful", "small"] },
  { id: 52, name: "Ladybug", emoji: "\u{1F41E}", category: "insect", fact: "Ladybugs can eat up to 5,000 insects in their lifetime!", tags: ["insect", "flying", "small", "colorful"] },
  { id: 53, name: "Bee", emoji: "\u{1F41D}", category: "insect", fact: "Bees can fly about 15 miles per hour!", tags: ["insect", "flying", "small"] },
  { id: 54, name: "Ant", emoji: "\u{1F41C}", category: "insect", fact: "Ants can carry 50 times their own body weight!", tags: ["insect", "small", "strong"] },
  { id: 55, name: "Caterpillar", emoji: "\u{1F41B}", category: "insect", fact: "Caterpillars have 12 eyes but still can't see very well!", tags: ["insect", "small"] },
  { id: 56, name: "Cricket", emoji: "\u{1F997}", category: "insect", fact: "Crickets hear through tiny ears on their front legs!", tags: ["insect", "small", "jumping"] },
  { id: 57, name: "Scorpion", emoji: "\u{1F982}", category: "insect", fact: "Scorpions glow bright blue under ultraviolet light!", tags: ["insect", "small", "desert"] },

  // Pets & Farm
  { id: 58, name: "Dog", emoji: "\u{1F436}", category: "pet", fact: "Dogs can learn over 200 words and signals!", tags: ["pet", "smart", "fluffy", "loyal"] },
  { id: 59, name: "Cat", emoji: "\u{1F431}", category: "pet", fact: "Cats spend 70% of their lives sleeping!", tags: ["pet", "cat", "fluffy", "independent"] },
  { id: 60, name: "Horse", emoji: "\u{1F434}", category: "farm", fact: "Horses can sleep standing up!", tags: ["farm", "big", "fast", "herbivore"] },
  { id: 61, name: "Cow", emoji: "\u{1F42E}", category: "farm", fact: "Cows have best friends and get stressed when separated!", tags: ["farm", "big", "herbivore"] },
  { id: 62, name: "Pig", emoji: "\u{1F437}", category: "farm", fact: "Pigs are one of the smartest animals — smarter than dogs!", tags: ["farm", "smart"] },
  { id: 63, name: "Sheep", emoji: "\u{1F411}", category: "farm", fact: "Sheep can remember the faces of 50 other sheep!", tags: ["farm", "herbivore", "fluffy"] },
  { id: 64, name: "Goat", emoji: "\u{1F410}", category: "farm", fact: "Goats have rectangular pupils so they can see almost 360 degrees!", tags: ["farm", "herbivore"] },

  // Exotic / Unique
  { id: 65, name: "Unicorn", emoji: "\u{1F984}", category: "mythical", fact: "The national animal of Scotland is the unicorn!", tags: ["mythical", "magical", "horse"] },
  { id: 66, name: "Kangaroo", emoji: "\u{1F998}", category: "large-mammal", fact: "Baby kangaroos are only about 1 inch long when born!", tags: ["big", "australia", "jumping"] },
  { id: 67, name: "Llama", emoji: "\u{1F999}", category: "large-mammal", fact: "Llamas hum to communicate with each other!", tags: ["big", "herbivore", "fluffy"] },
  { id: 68, name: "Monkey", emoji: "\u{1F435}", category: "small-mammal", fact: "Monkeys can count and understand numbers!", tags: ["primate", "smart", "playful"] },
  { id: 69, name: "Snail", emoji: "\u{1F40C}", category: "other", fact: "Snails can sleep for up to 3 years!", tags: ["small", "slow", "shell"] },
  { id: 70, name: "Worm", emoji: "\u{1FAB1}", category: "other", fact: "Worms have 5 hearts!", tags: ["small", "underground"] },
];

// Category display names and colors
const CATEGORIES = {
  "large-mammal": { name: "Big Animals", color: "#FF8C42" },
  "small-mammal": { name: "Small & Fuzzy", color: "#A8D8EA" },
  "bird": { name: "Birds", color: "#87CEEB" },
  "reptile": { name: "Reptiles", color: "#77DD77" },
  "amphibian": { name: "Frogs & Friends", color: "#90EE90" },
  "sea": { name: "Ocean Friends", color: "#4FC3F7" },
  "insect": { name: "Tiny Crawlers", color: "#FFD93D" },
  "pet": { name: "Pets", color: "#FFB6C1" },
  "farm": { name: "Farm Animals", color: "#DEB887" },
  "mythical": { name: "Magical", color: "#E8A0FF" },
  "other": { name: "Other", color: "#C8C8C8" },
};
