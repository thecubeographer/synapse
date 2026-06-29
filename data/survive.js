/* Extra question pool for Off The Grid */
(function () {
  if (typeof CATEGORIES === "undefined") return;
  var c = CATEGORIES.find(function (x) { return x.id === "survive"; });
  if (!c) return;
  var moreExplain = [
    {
      q: "Why is finding or making clean water usually a higher survival priority than finding food?",
      answer: "A person can survive weeks without food but only about three days without water, and dehydration quickly impairs judgment and physical ability. Securing water early prevents a fast decline.",
      accept: ["water", "dehydration", "three days", "weeks without food", "rule of threes", "thirst", "kidneys", "judgment"],
      key: ["water", "three", "days", "weeks", "food", "dehydration", "judgment", "priority", "thirst", "survive"]
    },
    {
      q: "How can you find true north using an analog watch in the Northern Hemisphere?",
      answer: "Point the hour hand at the sun, then bisect the angle between the hour hand and the 12 o'clock mark; that midpoint line points roughly south, so the opposite direction is north.",
      accept: ["hour hand", "sun", "bisect", "12 o'clock", "halfway", "midpoint", "south", "north"],
      key: ["hour", "hand", "sun", "bisect", "angle", "twelve", "midpoint", "south", "north", "watch"]
    },
    {
      q: "Why should you boil water for at least one minute to make it safe to drink?",
      answer: "Bringing water to a rolling boil kills bacteria, viruses, and parasites that cause illness. One minute (three at high altitude) reliably makes biologically contaminated water safe.",
      accept: ["boil", "kill", "bacteria", "viruses", "parasites", "rolling boil", "one minute", "pathogens", "germs"],
      key: ["boil", "rolling", "minute", "bacteria", "viruses", "parasites", "pathogens", "safe", "kill", "altitude"]
    },
    {
      q: "How does the STOP acronym help when you realize you are lost?",
      answer: "STOP stands for Stop, Think, Observe, and Plan. It tells you to stop moving and panicking, assess your situation calmly, observe your surroundings and resources, then make a deliberate plan before acting.",
      accept: ["stop", "think", "observe", "plan", "panic", "calm", "assess", "stay put"],
      key: ["stop", "think", "observe", "plan", "panic", "calm", "assess", "lost", "deliberate", "surroundings"]
    },
    {
      q: "Why is staying put often the best choice if you are lost and people know your route?",
      answer: "If you remain in one place you conserve energy and are far easier for searchers to find, especially if you filed a plan. Wandering can take you farther from help and rescuers.",
      accept: ["stay put", "conserve energy", "easier to find", "searchers", "rescuers", "trip plan", "wandering", "one place"],
      key: ["stay", "put", "conserve", "energy", "searchers", "rescue", "plan", "wander", "find", "place"]
    },
    {
      q: "How can moss growth help with direction in the wilderness, and why is it unreliable?",
      answer: "Moss often grows thicker on the shadier, damper side of trees, which in the Northern Hemisphere tends to be north. But moisture and shade depend on local terrain, so moss is only a weak hint, not a reliable compass.",
      accept: ["moss", "shady side", "damp", "north", "unreliable", "moisture", "weak hint", "terrain"],
      key: ["moss", "shade", "damp", "north", "moisture", "unreliable", "terrain", "trees", "hint", "direction"]
    },
    {
      q: "Why is hypothermia a danger even in temperatures well above freezing?",
      answer: "Wet clothing and wind strip body heat far faster than cold air alone, so hypothermia can set in at 40 to 50 degrees Fahrenheit, especially if you are damp, tired, or hungry.",
      accept: ["hypothermia", "wet", "wind", "above freezing", "body heat", "damp clothes", "40 degrees", "wind chill"],
      key: ["hypothermia", "wet", "wind", "freezing", "heat", "damp", "clothing", "chill", "cold", "danger"]
    },
    {
      q: "How does the fire triangle explain what you need to start and keep a fire going?",
      answer: "Fire requires three things: heat (an ignition source), fuel (tinder, kindling, and wood), and oxygen (air flow). Remove any one and the fire goes out.",
      accept: ["heat", "fuel", "oxygen", "fire triangle", "ignition", "air", "tinder", "three elements"],
      key: ["heat", "fuel", "oxygen", "fire", "triangle", "ignition", "air", "tinder", "wood", "three"]
    },
    {
      q: "Why do you build a fire by starting with tinder, then kindling, then larger wood?",
      answer: "Small, dry tinder catches a spark easily and burns hot enough to ignite slightly larger kindling, which in turn heats and lights the bigger fuel logs. Skipping stages smothers the flame.",
      accept: ["tinder", "kindling", "fuel wood", "small to large", "catches spark", "gradual", "ignite", "build up"],
      key: ["tinder", "kindling", "wood", "spark", "small", "large", "ignite", "gradual", "fuel", "flame"]
    },
    {
      q: "How can you signal an aircraft for rescue without any electronics?",
      answer: "Use three of anything as a distress sign, such as three fires in a triangle, large ground symbols like an X, or a signal mirror flashed at the aircraft. Movement and contrast attract attention.",
      accept: ["three fires", "signal mirror", "ground symbol", "x", "rule of three", "contrast", "wave", "smoke"],
      key: ["three", "fires", "mirror", "ground", "symbol", "distress", "contrast", "smoke", "signal", "aircraft"]
    },
    {
      q: "Why are three of anything (three whistle blasts, three fires) a recognized distress signal?",
      answer: "Sets of three are an internationally understood call for help; the pattern is unlikely to occur naturally, so it clearly communicates an emergency to anyone who sees or hears it.",
      accept: ["three", "distress", "international", "help", "unnatural pattern", "whistle", "rule of threes", "emergency"],
      key: ["three", "distress", "signal", "international", "help", "pattern", "whistle", "emergency", "recognized", "rule"]
    },
    {
      q: "How does a magnetic compass help you navigate, and what is declination?",
      answer: "A compass needle aligns with Earth's magnetic field to show magnetic north. Declination is the angle between magnetic north and true north, which you must add or subtract for accurate bearings.",
      accept: ["compass", "magnetic north", "true north", "declination", "bearing", "needle", "angle", "adjust"],
      key: ["compass", "magnetic", "north", "true", "declination", "bearing", "needle", "angle", "navigate", "field"]
    },
    {
      q: "Why is shelter often more urgent than fire or water in cold or wet conditions?",
      answer: "Exposure to wind, rain, and cold can cause fatal hypothermia within hours, so getting out of the elements protects your core temperature faster than anything else in harsh weather.",
      accept: ["shelter", "exposure", "hypothermia", "wind", "rain", "core temperature", "elements", "cold"],
      key: ["shelter", "exposure", "hypothermia", "wind", "rain", "core", "temperature", "elements", "cold", "urgent"]
    },
    {
      q: "How do you insulate yourself from the ground when sleeping outdoors, and why does it matter?",
      answer: "Pile dry leaves, pine boughs, or a sleeping pad beneath you because the cold ground draws heat from your body through conduction much faster than air does.",
      accept: ["insulate ground", "leaves", "pine boughs", "sleeping pad", "conduction", "ground draws heat", "barrier", "dry debris"],
      key: ["insulate", "ground", "leaves", "boughs", "pad", "conduction", "heat", "barrier", "cold", "body"]
    },
    {
      q: "Why should you avoid eating unknown wild mushrooms in a survival situation?",
      answer: "Many wild mushrooms are deadly poisonous and can be nearly identical to edible species, with no reliable field test. The risk of liver failure or death far outweighs their low calorie value.",
      accept: ["mushrooms", "poisonous", "deadly", "lookalikes", "no field test", "liver failure", "low calories", "risk"],
      key: ["mushrooms", "poisonous", "deadly", "lookalike", "edible", "liver", "calories", "risk", "death", "wild"]
    },
    {
      q: "How can the position of the sun help you keep a steady direction during the day?",
      answer: "The sun rises in the east and sets in the west, and at solar noon it sits due south in the Northern Hemisphere. Tracking its arc lets you hold a consistent heading without a compass.",
      accept: ["sun rises east", "sets west", "south at noon", "arc", "heading", "solar noon", "track sun", "direction"],
      key: ["sun", "east", "west", "south", "noon", "arc", "heading", "rises", "sets", "direction"]
    },
    {
      q: "How do you find Polaris, the North Star, using the Big Dipper?",
      answer: "Find the two pointer stars at the end of the Big Dipper's bowl and follow the line they make about five times that distance to reach Polaris, which marks true north.",
      accept: ["polaris", "north star", "big dipper", "pointer stars", "five times", "true north", "bowl", "follow line"],
      key: ["polaris", "north", "star", "dipper", "pointer", "stars", "five", "true", "bowl", "follow"]
    },
    {
      q: "Why is it dangerous to drink seawater when stranded, even though you are surrounded by it?",
      answer: "Seawater is so salty that your kidneys must use more water to excrete the salt than the seawater provides, accelerating dehydration and harming the body.",
      accept: ["seawater", "salt", "kidneys", "dehydration", "too salty", "excrete", "worse", "thirst"],
      key: ["seawater", "salt", "kidneys", "dehydration", "excrete", "salty", "worse", "thirst", "harm", "ocean"]
    },
    {
      q: "How can you collect drinkable water from plants using a transpiration bag?",
      answer: "Tie a clear plastic bag over a leafy living branch in sunlight; the plant releases moisture through transpiration, which condenses inside the bag and collects as drinkable water.",
      accept: ["transpiration bag", "plastic bag", "leafy branch", "sunlight", "condenses", "moisture", "collect water", "plant"],
      key: ["transpiration", "bag", "plastic", "branch", "sunlight", "condense", "moisture", "water", "leafy", "collect"]
    },
    {
      q: "Why is a whistle a better long-distance signaling tool than shouting?",
      answer: "A whistle carries much farther than the human voice and takes far less energy to use, so you can signal repeatedly for help without exhausting yourself or losing your voice.",
      accept: ["whistle", "carries farther", "less energy", "voice tires", "loud", "signal", "conserve energy", "heard"],
      key: ["whistle", "farther", "energy", "voice", "loud", "signal", "conserve", "shout", "heard", "distance"]
    },
    {
      q: "How does a basic lean-to shelter protect you, and how is it oriented?",
      answer: "A lean-to is a sloped roof of branches and debris set against a support, blocking wind and rain. You orient the open side away from the wind and ideally toward a fire.",
      accept: ["lean-to", "sloped roof", "branches", "debris", "blocks wind", "open side away from wind", "shelter", "support"],
      key: ["lean", "sloped", "roof", "branches", "debris", "wind", "rain", "shelter", "orient", "fire"]
    },
    {
      q: "Why should you ration sweat rather than water when stranded in heat?",
      answer: "Rest in shade during the hottest hours and limit exertion so you sweat less and lose less water; sipping a fixed water ration while overheating just dehydrates you faster.",
      accept: ["ration sweat", "rest in shade", "limit exertion", "sweat less", "avoid heat", "stay cool", "conserve water", "midday"],
      key: ["ration", "sweat", "shade", "exertion", "heat", "cool", "water", "dehydrate", "rest", "midday"]
    },
    {
      q: "How can you tell a storm may be approaching by reading the clouds?",
      answer: "Tall, dark, anvil-shaped cumulonimbus clouds and a rapidly lowering, darkening sky signal thunderstorms. Thickening, lowering clouds and rising wind often mean rain is coming.",
      accept: ["dark clouds", "cumulonimbus", "anvil", "lowering sky", "thunderstorm", "thickening", "rising wind", "rain coming"],
      key: ["dark", "clouds", "cumulonimbus", "anvil", "lowering", "thunderstorm", "wind", "rain", "storm", "sky"]
    },
    {
      q: "Why is the bowline knot valued in survival situations?",
      answer: "The bowline forms a fixed loop that will not slip or tighten under load yet unties easily afterward, making it reliable for rescue, securing loads, and anchoring lines.",
      accept: ["bowline", "fixed loop", "won't slip", "unties easily", "secure", "load", "rescue", "reliable knot"],
      key: ["bowline", "fixed", "loop", "slip", "unties", "load", "rescue", "secure", "anchor", "knot"]
    },
    {
      q: "How does layering clothing keep you warmer than one thick garment?",
      answer: "Layers trap insulating air between them and let you add or remove pieces to manage heat and sweat. A base, insulating, and outer shell layer together regulate temperature better than one bulky coat.",
      accept: ["layers", "trapped air", "insulation", "base layer", "shell", "adjust", "manage sweat", "regulate heat"],
      key: ["layers", "air", "insulation", "base", "shell", "adjust", "sweat", "regulate", "heat", "trap"]
    },
    {
      q: "Why should you avoid sheltering under a lone tall tree during a thunderstorm?",
      answer: "A tall isolated tree is a likely lightning target, and a strike can jump to anyone beneath it or travel through the ground nearby. Crouch low in the open or in a low spot instead.",
      accept: ["lightning", "tall tree", "lone tree", "strike", "ground current", "crouch low", "thunderstorm", "danger"],
      key: ["lightning", "tree", "lone", "strike", "ground", "crouch", "low", "storm", "target", "danger"]
    },
    {
      q: "How can you purify water without boiling if you have no fire?",
      answer: "Use a portable filter, water purification tablets (iodine or chlorine dioxide), or solar disinfection by leaving clear bottles of water in full sun for hours to kill pathogens.",
      accept: ["filter", "purification tablets", "iodine", "chlorine", "solar disinfection", "sodis", "uv", "chemical treatment"],
      key: ["filter", "tablets", "iodine", "chlorine", "solar", "disinfection", "sun", "pathogens", "purify", "chemical"]
    },
    {
      q: "Why does following a stream downhill often lead you toward people?",
      answer: "Water flows downhill and small streams join larger rivers, and human settlements historically grow along waterways. Following water downstream frequently leads to roads, trails, or towns.",
      accept: ["follow stream", "downhill", "rivers", "settlements", "downstream", "waterways", "towns", "roads"],
      key: ["stream", "downhill", "river", "settlement", "downstream", "waterway", "town", "road", "follow", "people"]
    },
    {
      q: "How does a debris hut keep you warm without a fire?",
      answer: "You pile a thick layer of dry leaves and debris over a small framed space and crawl inside; the insulation traps your own body heat in the tight pocket, much like a sleeping bag.",
      accept: ["debris hut", "dry leaves", "insulation", "body heat", "small space", "no fire", "thick layer", "trap heat"],
      key: ["debris", "hut", "leaves", "insulation", "body", "heat", "small", "trap", "warm", "pocket"]
    },
    {
      q: "Why is keeping a positive mental attitude considered a real survival skill?",
      answer: "Panic and despair lead to poor decisions and giving up, while a calm, determined mindset keeps you problem-solving and conserving energy. The will to live measurably improves survival odds.",
      accept: ["mental attitude", "will to live", "panic", "calm", "mindset", "morale", "determination", "decisions"],
      key: ["mental", "attitude", "will", "live", "panic", "calm", "mindset", "morale", "decisions", "survival"]
    },
    {
      q: "How can a signal mirror be aimed at distant rescuers even far away?",
      answer: "Hold the mirror up, extend your other hand toward the target, and flash the reflected sunlight across your fingers onto the aircraft or searcher; the flash can be seen for miles.",
      accept: ["signal mirror", "reflect sunlight", "aim", "flash", "aircraft", "miles", "extend hand", "target"],
      key: ["mirror", "reflect", "sunlight", "aim", "flash", "aircraft", "miles", "hand", "target", "signal"]
    },
    {
      q: "Why should you treat any cut or blister seriously in the wilderness?",
      answer: "Without medical help, even a small wound can become infected and disable you. Cleaning it, covering it, and watching for infection prevents a minor injury from becoming life-threatening.",
      accept: ["cut", "blister", "infection", "clean wound", "cover", "disable", "minor injury", "serious"],
      key: ["cut", "blister", "infection", "clean", "cover", "wound", "disable", "injury", "serious", "medical"]
    },
    {
      q: "How does dead reckoning let you navigate without a map or GPS?",
      answer: "You track your direction of travel and estimate distance covered over time from a known starting point, plotting your approximate position by combining heading and pace.",
      accept: ["dead reckoning", "direction", "distance", "starting point", "heading", "pace count", "estimate", "track"],
      key: ["dead", "reckoning", "direction", "distance", "starting", "heading", "pace", "estimate", "track", "position"]
    },
    {
      q: "Why is wood from standing dead branches better tinder and fuel than wood off the ground?",
      answer: "Branches still off the ground stay drier because they are not soaking up ground moisture, so they catch and burn far more readily than damp deadfall lying in wet soil.",
      accept: ["standing dead wood", "off the ground", "drier", "ground moisture", "damp deadfall", "burns better", "catches", "dry"],
      key: ["standing", "dead", "ground", "drier", "moisture", "deadfall", "burn", "catch", "damp", "wood"]
    },
    {
      q: "How can you find direction at night without Polaris in the Southern Hemisphere?",
      answer: "Use the Southern Cross constellation: extend its long axis about four and a half times its length to a point in the sky, then drop straight down to the horizon to find roughly due south.",
      accept: ["southern cross", "long axis", "four and a half", "south", "horizon", "constellation", "southern hemisphere", "drop down"],
      key: ["southern", "cross", "axis", "south", "horizon", "constellation", "drop", "night", "hemisphere", "stars"]
    },
    {
      q: "Why is hyperthermia or heat stroke a medical emergency, and what are early signs?",
      answer: "When the body can no longer cool itself, core temperature climbs dangerously and organs can fail. Early warning signs include heavy sweating that stops, confusion, dizziness, and hot dry skin.",
      accept: ["heat stroke", "hyperthermia", "overheating", "confusion", "dizziness", "stops sweating", "hot skin", "emergency"],
      key: ["heat", "stroke", "hyperthermia", "core", "temperature", "confusion", "dizziness", "sweating", "skin", "emergency"]
    },
    {
      q: "How can you make a simple water filter from natural and found materials?",
      answer: "Layer cloth, charcoal from your fire, sand, and gravel inside a container so water passes through each layer. This removes sediment and some impurities, but you must still boil or treat the water.",
      accept: ["charcoal", "sand", "gravel", "cloth", "layers", "filter", "sediment", "still boil"],
      key: ["charcoal", "sand", "gravel", "cloth", "layers", "filter", "sediment", "boil", "treat", "water"]
    },
    {
      q: "Why is it important to file a trip plan with someone before going off-grid?",
      answer: "A trip plan tells someone your route, destination, and expected return so they can alert rescuers and tell them where to search if you do not come back on time.",
      accept: ["trip plan", "tell someone", "route", "return time", "rescuers know where", "search area", "expected back", "notify"],
      key: ["trip", "plan", "route", "return", "rescuers", "search", "tell", "someone", "destination", "notify"]
    },
    {
      q: "How does the rule of threes summarize human survival priorities?",
      answer: "It states you can generally survive about three minutes without air, three hours without shelter in harsh conditions, three days without water, and three weeks without food, ranking what to address first.",
      accept: ["rule of threes", "three minutes air", "three hours shelter", "three days water", "three weeks food", "priorities", "order", "survival"],
      key: ["rule", "threes", "minutes", "air", "hours", "shelter", "days", "water", "weeks", "food"]
    },
    {
      q: "Why should you make a shelter small and snug rather than large?",
      answer: "A smaller enclosed space holds your body heat far more efficiently, so a snug shelter stays warmer with less insulation and effort than a roomy one that lets heat escape.",
      accept: ["small shelter", "snug", "body heat", "efficient", "less insulation", "warmer", "compact", "traps heat"],
      key: ["small", "shelter", "snug", "body", "heat", "efficient", "insulation", "warmer", "compact", "trap"]
    },
    {
      q: "How can you create smoke for a daytime signal fire to attract attention?",
      answer: "Add green vegetation, damp leaves, or evergreen boughs onto a hot fire to produce thick white or dark smoke that contrasts against the sky and is visible from a distance.",
      accept: ["green vegetation", "damp leaves", "boughs", "thick smoke", "contrast", "signal fire", "daytime", "visible"],
      key: ["green", "vegetation", "damp", "leaves", "boughs", "smoke", "contrast", "signal", "fire", "visible"]
    },
    {
      q: "Why is overconfidence about your route a common cause of getting lost?",
      answer: "People stop checking landmarks and bearings when they assume they know the way, so small drifts off course add up unnoticed until they are far from where they think they are.",
      accept: ["overconfidence", "stop checking", "landmarks", "drift off course", "assume", "no bearings", "lost", "complacency"],
      key: ["overconfidence", "checking", "landmarks", "drift", "course", "assume", "bearings", "lost", "complacent", "route"]
    },
    {
      q: "How do you treat a snakebite in the backcountry while waiting for help?",
      answer: "Keep the victim calm and still with the bitten limb below heart level, remove rings or tight items, and get to medical care fast. Do not cut, suck, or apply ice or a tourniquet.",
      accept: ["snakebite", "stay calm", "immobilize", "below heart", "remove rings", "no tourniquet", "no cutting", "get help"],
      key: ["snakebite", "calm", "immobilize", "heart", "rings", "tourniquet", "cut", "medical", "still", "limb"]
    },
    {
      q: "Why are contour lines on a topographic map essential for off-grid navigation?",
      answer: "Contour lines connect points of equal elevation, so their spacing shows steepness and their shapes reveal ridges, valleys, and peaks, letting you read the terrain before you travel it.",
      accept: ["contour lines", "elevation", "steepness", "ridges", "valleys", "spacing", "terrain", "topographic"],
      key: ["contour", "lines", "elevation", "steepness", "ridges", "valleys", "spacing", "terrain", "map", "topographic"]
    },
    {
      q: "How can you protect food and yourself from bears in bear country?",
      answer: "Store food, trash, and scented items in a bear canister or hung well away from camp, cook away from where you sleep, and keep a clean site so bears are not drawn to you.",
      accept: ["bear canister", "hang food", "away from camp", "scented items", "clean camp", "cook away", "store food", "bears"],
      key: ["bear", "canister", "hang", "food", "camp", "scented", "clean", "cook", "store", "away"]
    }
  ];
  var moreShout = [
    { q: "How many days can a person typically survive without water?", answer: "Three", accept: ["three", "3", "3 days", "three days", "about three"] },
    { q: "What is the magnetic instrument with a needle used to find direction?", answer: "Compass", accept: ["compass", "a compass", "magnetic compass"] },
    { q: "What star marks true north in the Northern Hemisphere?", answer: "Polaris", accept: ["polaris", "north star", "the north star", "pole star"] },
    { q: "In which direction does the sun rise?", answer: "East", accept: ["east", "the east", "easterly"] },
    { q: "What is the smallest, most flammable material used to start a fire?", answer: "Tinder", accept: ["tinder", "tinder bundle"] },
    { q: "How many minutes can a person generally survive without air?", answer: "Three", accept: ["three", "3", "3 minutes", "three minutes", "about three"] },
    { q: "What constellation points to south in the Southern Hemisphere?", answer: "Southern Cross", accept: ["southern cross", "the southern cross", "crux"] },
    { q: "What dangerous condition is caused by the body losing too much heat?", answer: "Hypothermia", accept: ["hypothermia", "hypothermic"] },
    { q: "What knot makes a fixed loop that won't slip under load?", answer: "Bowline", accept: ["bowline", "bowline knot", "a bowline"] },
    { q: "What method kills pathogens in water using heat?", answer: "Boiling", accept: ["boiling", "boil", "boil it", "rolling boil"] },
    { q: "How many of a signal (fires, whistles) mean distress internationally?", answer: "Three", accept: ["three", "3", "three of them", "sets of three"] },
    { q: "What simple device flashes sunlight to signal rescuers?", answer: "Signal mirror", accept: ["signal mirror", "mirror", "a mirror"] },
    { q: "What seven-star pattern helps you locate the North Star?", answer: "Big Dipper", accept: ["big dipper", "the big dipper", "plough", "the plough"] },
    { q: "What dangerously high body temperature condition is the opposite of hypothermia?", answer: "Hyperthermia", accept: ["hyperthermia", "heat stroke", "heatstroke", "heat exhaustion"] },
    { q: "What lines on a topographic map connect equal elevations?", answer: "Contour lines", accept: ["contour lines", "contours", "contour line", "contour"] },
    { q: "What tall, anvil-shaped cloud signals a thunderstorm?", answer: "Cumulonimbus", accept: ["cumulonimbus", "cumulonimbus cloud", "thunderhead", "anvil cloud"] },
    { q: "What sloped one-sided shelter is built against a support?", answer: "Lean-to", accept: ["lean-to", "lean to", "leanto"] },
    { q: "What loud handheld device carries farther than your voice for signaling?", answer: "Whistle", accept: ["whistle", "a whistle"] },
    { q: "In which direction does the sun set?", answer: "West", accept: ["west", "the west", "westerly"] },
    { q: "What does the S in the survival acronym STOP stand for?", answer: "Stop", accept: ["stop", "s for stop"] },
    { q: "Black charcoal used in a homemade filter comes from what process?", answer: "Burning wood", accept: ["burning wood", "burnt wood", "fire", "charring wood", "burning"] },
    { q: "About how many weeks can a person survive without food?", answer: "Three", accept: ["three", "3", "3 weeks", "three weeks", "about three"] },
    { q: "What is the angle difference between magnetic north and true north called?", answer: "Declination", accept: ["declination", "magnetic declination"] },
    { q: "What kind of water should you never drink because its salt dehydrates you?", answer: "Seawater", accept: ["seawater", "sea water", "salt water", "saltwater", "ocean water"] },
    { q: "What process releases water vapor from plant leaves you can collect in a bag?", answer: "Transpiration", accept: ["transpiration", "transpire"] },
    { q: "What plant often grows on the shadier north side of trees as a weak direction hint?", answer: "Moss", accept: ["moss", "mosses"] },
    { q: "What navigation method tracks heading and distance from a known point?", answer: "Dead reckoning", accept: ["dead reckoning", "dead-reckoning", "reckoning"] },
    { q: "What white-or-dark column do you create to make a daytime signal fire visible?", answer: "Smoke", accept: ["smoke", "smoke signal", "smoke signals"] },
    { q: "What handheld tool with a blade is the most versatile survival cutting tool?", answer: "Knife", accept: ["knife", "a knife", "survival knife"] },
    { q: "What weather hazard makes sheltering under a lone tall tree dangerous?", answer: "Lightning", accept: ["lightning", "lightning strike", "a lightning strike"] },
    { q: "What is the body's loss of too much water and fluids called?", answer: "Dehydration", accept: ["dehydration", "dehydrated", "being dehydrated"] },
    { q: "What thick natural-debris-covered shelter traps your own body heat?", answer: "Debris hut", accept: ["debris hut", "debris shelter", "leaf hut"] },
    { q: "What should you put between yourself and cold ground to stop heat loss?", answer: "Insulation", accept: ["insulation", "insulating layer", "leaves", "sleeping pad", "padding"] },
    { q: "What ferro tool throws sparks to start a fire without matches?", answer: "Ferro rod", accept: ["ferro rod", "ferrocerium rod", "fire steel", "firesteel", "flint"] },
    { q: "Following a stream in which direction usually leads toward people?", answer: "Downstream", accept: ["downstream", "down stream", "downhill", "down"] },
    { q: "What clear-bottle, sun-based method disinfects water without fire?", answer: "Solar disinfection", accept: ["solar disinfection", "sodis", "solar", "sun method"] },
    { q: "What internationally recognized Morse distress signal is three short, three long, three short?", answer: "SOS", accept: ["sos", "s o s", "save our souls"] },
    { q: "What tablets containing iodine or chlorine can treat water chemically?", answer: "Purification tablets", accept: ["purification tablets", "water tablets", "iodine tablets", "chlorine tablets", "water purification tablets"] },
    { q: "What is the open-side direction a shelter should face away from?", answer: "Wind", accept: ["wind", "the wind", "windward"] },
    { q: "What document filed before a trip tells rescuers your route?", answer: "Trip plan", accept: ["trip plan", "trip itinerary", "itinerary", "travel plan"] },
    { q: "What wind-driven effect makes it feel colder than the actual temperature?", answer: "Wind chill", accept: ["wind chill", "windchill", "wind-chill"] },
    { q: "What is the term for wood that is dead and lying on the ground?", answer: "Deadfall", accept: ["deadfall", "dead fall", "dead wood", "deadwood"] },
    { q: "What sets of how many fires arranged in a triangle signal distress to aircraft?", answer: "Three", accept: ["three", "3", "three fires", "3 fires"] },
    { q: "What should you NOT apply to a snakebite despite old myths?", answer: "Tourniquet", accept: ["tourniquet", "a tourniquet", "ice", "cutting"] },
    { q: "What animal in bear country requires hanging or canister food storage?", answer: "Bear", accept: ["bear", "bears", "a bear"] }
  ];
  c.questions = c.questions.concat(moreExplain);
  c.shout = c.shout.concat(moreShout);
})();
