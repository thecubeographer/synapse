/* SYNAPSE question bank
 * Each question:
 *   q       - the prompt shown on screen
 *   accept  - keywords; ANY match = "correct" in Shout mode (lowercase, no punctuation)
 *   answer  - the real-world answer revealed when nobody gets it / after Explain mode
 *   key     - keywords the judge rewards in Explain mode (the meat of a good answer)
 */
const CATEGORIES = [
  {
    id: "survive",
    name: "Off The Grid",
    blurb: "Surviving without the thing in your pocket.",
    icon: "compass",
    questions: [
      {
        q: "Your phone is dead and you're lost in the woods. How do you find which way is roughly south? (Northern Hemisphere, daytime)",
        accept: ["shadow", "stick", "sun", "moss", "watch", "analog", "noon", "east west", "shadow tip", "sundial"],
        answer: "Stick-and-shadow method: push a stick in the ground, mark the shadow tip, wait ~15 min, mark it again. The first mark is west, the line points east-west — south is roughly perpendicular toward the sun. The sun is also due south at solar noon.",
        key: ["stick", "shadow", "tip", "mark", "wait", "sun", "noon", "west", "east", "perpendicular", "line", "south"]
      },
      {
        q: "No phone, no clock. How do you estimate how much daylight is left before sunset using just your hand?",
        accept: ["hand", "fingers", "horizon", "sun", "four", "finger width", "stack", "fifteen minutes", "15 minutes"],
        answer: "Stack your hand sideways between the sun and the horizon. Each finger width ≈ 15 minutes of daylight. Four fingers ≈ 1 hour. Count the fingers that fit to the horizon.",
        key: ["hand", "finger", "width", "horizon", "sun", "15", "fifteen", "minutes", "four", "hour", "stack", "count"]
      },
      {
        q: "You need to purify questionable water and all you have is a fire and a pot. What do you do, and for how long?",
        accept: ["boil", "rolling boil", "one minute", "minute", "boiling", "three minutes", "filter", "cloth", "sterilize"],
        answer: "Bring it to a rolling boil for at least 1 full minute (3 minutes above ~6,500 ft / 2,000 m). Let sediment settle and filter through cloth first if it's murky. Boiling kills bacteria, viruses, and parasites.",
        key: ["boil", "rolling", "one", "minute", "three", "filter", "cloth", "settle", "sediment", "altitude", "bacteria", "parasites"]
      },
      {
        q: "You're hiking and twist your ankle badly, hours from help, no phone. What's your first move?",
        accept: ["rest", "elevate", "ice", "compression", "rice", "wrap", "stop", "cold water", "elevation", "compress"],
        answer: "R.I.C.E. — Rest, Ice (or cold water), Compression (wrap snugly, not tight), Elevation above heart. Don't push through it; reassess whether you can bear weight before walking out.",
        key: ["rice", "rest", "ice", "cold", "compression", "wrap", "elevate", "elevation", "heart", "weight", "reassess"]
      },
      {
        q: "It's getting dangerously cold and you have to stay out overnight. What kills you first, and what do you prioritize?",
        accept: ["shelter", "insulation", "ground", "wind", "dry", "fire", "hypothermia", "exposure", "cold", "wet"],
        answer: "Exposure/hypothermia, sped up by wind and wet. Priority: get OFF the cold ground (leaves/branches as insulation), block the wind, stay dry. Shelter beats fire for staying alive — heat loss to the ground and wind is the real killer.",
        key: ["hypothermia", "exposure", "shelter", "ground", "insulation", "leaves", "wind", "block", "dry", "wet", "heat", "loss"]
      },
      {
        q: "You're driving somewhere new with no GPS. How do you actually not get lost?",
        accept: ["map", "directions", "landmarks", "write", "memorize", "ask", "signs", "route", "turns", "paper map"],
        answer: "Write down or memorize the route as a sequence of turns and landmarks before leaving, note your final road's direction (N/S/E/W), keep track of major cross-streets, and don't be afraid to stop and ask. Paper maps still work.",
        key: ["map", "route", "landmarks", "turns", "write", "memorize", "direction", "cross", "streets", "ask", "signs", "paper"]
      }
    ]
  },
  {
    id: "house",
    name: "Around The House",
    blurb: "The stuff your grandparents just knew.",
    icon: "wrench",
    questions: [
      {
        q: "Walk us through changing the oil in a car. What are the basic steps?",
        accept: ["drain", "filter", "plug", "fill", "dipstick", "pan", "oil filter", "drain plug", "jack", "gasket"],
        answer: "Warm the engine slightly, lift & secure the car, place a pan under the drain plug, remove the plug and drain old oil, swap the oil filter (lube the new gasket), reinstall the plug, fill with the correct new oil, run it briefly, then check the level on the dipstick.",
        key: ["warm", "engine", "jack", "lift", "pan", "drain", "plug", "oil", "filter", "gasket", "fill", "dipstick", "level"]
      },
      {
        q: "Your toilet is running constantly and won't stop. What's almost always the cause and the fix?",
        accept: ["flapper", "fill valve", "chain", "float", "tank", "rubber seal", "seal", "replace", "valve", "worn"],
        answer: "Usually the flapper — the rubber seal at the bottom of the tank — is worn or not sealing, so water leaks into the bowl and the tank keeps refilling. Replace the flapper (cheap), or adjust the chain/float. A bad fill valve is the next suspect.",
        key: ["flapper", "rubber", "seal", "tank", "worn", "leaks", "bowl", "refilling", "replace", "chain", "float", "fill", "valve"]
      },
      {
        q: "A breaker keeps tripping every time you use the microwave and toaster together. What's happening and what do you do?",
        accept: ["overload", "circuit", "amps", "unplug", "different outlet", "breaker", "overloading", "too many", "one at a time", "fire"],
        answer: "You're overloading that circuit — too many amps drawn at once. Don't just keep resetting it. Move one appliance to an outlet on a different circuit, or run them one at a time. Repeated tripping is the breaker doing its job (preventing a fire).",
        key: ["overload", "circuit", "amps", "drawn", "reset", "appliance", "different", "outlet", "tripping", "breaker", "fire", "load"]
      },
      {
        q: "Water is gushing from under your kitchen sink. What's the very first thing you do?",
        accept: ["shut off", "valve", "water", "turn off", "main", "shutoff", "clockwise", "righty tighty", "stop water", "shut"],
        answer: "Shut off the water — turn the small shutoff valve under the sink clockwise (righty-tighty). If there isn't one or it won't budge, shut off the home's main water valve. Stop the flow first, diagnose second.",
        key: ["shut", "off", "shutoff", "valve", "sink", "clockwise", "righty", "tighty", "main", "stop", "flow", "water"]
      },
      {
        q: "How do you hang a heavy mirror on drywall so it doesn't rip out of the wall?",
        accept: ["stud", "anchor", "stud finder", "toggle", "wall anchor", "toggle bolt", "drywall anchor", "screw", "knock", "bolt"],
        answer: "Screw into a wall stud if you can find one (knock for the solid spot or use a stud finder). If there's no stud where you need it, use proper drywall anchors (toggle bolts for heavy items) rated for the weight — a bare screw in drywall will pull out.",
        key: ["stud", "finder", "knock", "solid", "anchor", "drywall", "toggle", "bolt", "rated", "weight", "screw", "pull"]
      },
      {
        q: "Your drain is slow and clogged. What's a fix that doesn't involve harsh chemicals?",
        accept: ["plunger", "snake", "baking soda", "vinegar", "hot water", "auger", "plunge", "drain snake", "clog", "plumbing"],
        answer: "Try a plunger first, then a drain snake/auger to physically pull the clog. Baking soda + vinegar followed by hot (not boiling, for PVC) water can break up gunk. Chemical drain cleaners can damage pipes and rarely fix hair clogs.",
        key: ["plunger", "snake", "auger", "clog", "baking", "soda", "vinegar", "hot", "water", "pipes", "chemical", "hair"]
      }
    ]
  },
  {
    id: "money",
    name: "Real-World Money",
    blurb: "What school forgot to teach you.",
    icon: "coin",
    questions: [
      {
        q: "A credit card has 24% APR. If you only pay the minimum on a $1,000 balance, what's actually happening to you?",
        accept: ["interest", "compound", "minimum", "debt", "years", "more", "compounds", "balance", "pay more", "trapped"],
        answer: "Interest compounds on the unpaid balance, so you pay far more than $1,000 and it can take years to clear. Minimum payments are designed to keep you in debt — pay the full statement balance to owe zero interest.",
        key: ["interest", "compound", "unpaid", "balance", "minimum", "payments", "years", "debt", "full", "statement", "zero"]
      },
      {
        q: "What's an emergency fund, how big should it be, and where should it live?",
        accept: ["three months", "six months", "savings", "expenses", "cash", "liquid", "3 to 6", "rainy day", "high yield", "emergency"],
        answer: "Cash set aside for surprises (job loss, car, medical). Rule of thumb: 3–6 months of essential expenses. Keep it liquid and separate — a high-yield savings account, not invested in stocks and not in your checking account where you'll spend it.",
        key: ["cash", "surprises", "three", "six", "months", "essential", "expenses", "liquid", "separate", "high", "yield", "savings"]
      },
      {
        q: "Someone offers you a '0% interest, 6 easy payments' deal. What questions should you ask before saying yes?",
        accept: ["fees", "fine print", "deferred", "late", "catch", "total", "deferred interest", "penalty", "retroactive", "missed payment"],
        answer: "Ask: Is it truly 0% or deferred interest that hits retroactively if you're late or don't pay in full by the deadline? Any fees? What's the penalty for one missed payment? Read the fine print — 'easy payments' often hide a catch.",
        key: ["deferred", "interest", "retroactive", "fees", "late", "penalty", "missed", "payment", "deadline", "fine", "print", "catch"]
      },
      {
        q: "Explain the difference between gross pay and net pay, and where the rest goes.",
        accept: ["taxes", "deductions", "take home", "withholding", "gross", "net", "before deductions", "social security", "medicare", "paycheck"],
        answer: "Gross is what you earn before deductions; net (take-home) is what actually hits your account. The difference goes to income tax withholding, Social Security/Medicare, and things like health insurance or retirement contributions.",
        key: ["gross", "earn", "before", "deductions", "net", "take", "home", "taxes", "withholding", "social", "security", "medicare", "insurance", "retirement"]
      },
      {
        q: "Why is buying a brand-new car often a worse financial move than people think?",
        accept: ["depreciation", "value", "drive off", "used", "loses", "depreciate", "off the lot", "twenty percent", "loses value", "resale"],
        answer: "Depreciation — a new car can lose ~20% of its value the moment you drive it off the lot and ~half within a few years. A 2–3 year-old used car lets someone else eat that first drop while you get most of the life.",
        key: ["depreciation", "value", "lose", "20", "twenty", "percent", "drive", "lot", "half", "used", "first", "drop"]
      },
      {
        q: "What does it actually mean to 'pay yourself first'?",
        accept: ["save", "automatic", "before", "budget", "savings", "save first", "automate", "invest", "before spending", "set aside"],
        answer: "Move money to savings/investments automatically the moment you're paid — BEFORE spending on anything else — then live on what's left. It flips the usual order so saving isn't the leftover that never happens.",
        key: ["save", "savings", "investments", "automatic", "paid", "before", "spending", "live", "left", "leftover", "first", "invest"]
      }
    ]
  },
  {
    id: "body",
    name: "Body & First Aid",
    blurb: "When seconds matter and Siri can't help.",
    icon: "heart",
    questions: [
      {
        q: "Someone is choking and can't speak or breathe. What do you do?",
        accept: ["heimlich", "abdominal", "thrusts", "back blows", "thrust", "abdominal thrust", "behind", "navel", "choking", "shoulder blades"],
        answer: "Abdominal thrusts (Heimlich): stand behind them, fist above the navel, sharp inward-and-upward thrusts. Many guidelines also alternate 5 back blows between the shoulder blades. If they go unconscious, start CPR and call for help.",
        key: ["heimlich", "abdominal", "thrust", "behind", "fist", "navel", "inward", "upward", "back", "blows", "shoulder", "blades", "cpr"]
      },
      {
        q: "You find someone collapsed and not breathing. What are the first things you do?",
        accept: ["call", "911", "cpr", "compressions", "chest", "aed", "chest compressions", "nine one one", "hands only", "defibrillator"],
        answer: "Call 911 (or have someone else do it) and get an AED if available. Start CPR: hard, fast chest compressions in the center of the chest, ~100–120 per minute, about 2 inches deep. Hands-only CPR is fine if you're not trained in rescue breaths.",
        key: ["call", "911", "aed", "cpr", "chest", "compressions", "center", "100", "120", "minute", "two", "inches", "hands", "rescue", "breaths"]
      },
      {
        q: "A deep cut is bleeding heavily. What's the priority?",
        accept: ["pressure", "press", "elevate", "cloth", "tourniquet", "direct pressure", "firm pressure", "apply pressure", "bandage", "wound"],
        answer: "Apply firm, direct pressure with a clean cloth and keep it there — don't peek. Elevate the wound above the heart if you can. If bleeding is life-threatening and won't stop, a tourniquet above the wound is a last resort. Get help.",
        key: ["firm", "direct", "pressure", "clean", "cloth", "elevate", "wound", "heart", "tourniquet", "above", "last", "resort"]
      },
      {
        q: "How can you recognize a stroke happening in front of you, fast?",
        accept: ["fast", "face", "arms", "speech", "time", "droop", "drooping", "slurred", "weakness", "stroke"],
        answer: "F.A.S.T. — Face drooping, Arm weakness (one arm drifts down), Speech slurred or strange, Time to call 911 immediately. Note when symptoms started; treatment is time-critical.",
        key: ["fast", "face", "drooping", "arm", "weakness", "drifts", "speech", "slurred", "time", "call", "911", "symptoms"]
      },
      {
        q: "Someone gets a bad burn from a hot pan. What should and shouldn't you do?",
        accept: ["cool water", "running water", "cool", "no ice", "no butter", "cold water", "no blisters", "remove rings", "cover", "burn"],
        answer: "Cool it under cool (not ice-cold) running water for 10–20 minutes, remove rings/tight items before swelling, cover loosely with clean non-stick material. Do NOT use ice, butter, or pop blisters. Seek care for large or deep burns.",
        key: ["cool", "running", "water", "minutes", "remove", "rings", "swelling", "cover", "loosely", "ice", "butter", "blisters"]
      },
      {
        q: "What's a sign that a fever or illness in an adult is an emergency, not 'tough it out'?",
        accept: ["breathing", "confusion", "chest pain", "stiff neck", "blue", "911", "trouble breathing", "blue lips", "high fever", "emergency"],
        answer: "Red flags: trouble breathing, chest pain, confusion or trouble waking, stiff neck with fever, blue lips, or a fever that's very high or won't break. Those mean get emergency care — don't sleep it off.",
        key: ["breathing", "chest", "pain", "confusion", "waking", "stiff", "neck", "fever", "blue", "lips", "high", "emergency"]
      }
    ]
  },
  {
    id: "kitchen",
    name: "In The Kitchen",
    blurb: "Feed yourself like an adult.",
    icon: "flame",
    questions: [
      {
        q: "A grease fire starts in a pan on the stove. What do you do — and what must you NEVER do?",
        accept: ["lid", "smother", "no water", "baking soda", "cover", "metal lid", "turn off heat", "extinguisher", "never water", "smother flames"],
        answer: "Smother it: slide a metal lid over the pan and turn off the heat (or use baking soda / a Class K extinguisher). NEVER throw water on a grease fire — it explodes the flames. Don't move the burning pan.",
        key: ["smother", "metal", "lid", "cover", "pan", "turn", "off", "heat", "baking", "soda", "extinguisher", "water", "explodes"]
      },
      {
        q: "How do you know when chicken is safely cooked, without guessing?",
        accept: ["165", "thermometer", "temperature", "internal", "degrees", "one sixty five", "meat thermometer", "74", "internal temp", "thickest part"],
        answer: "Internal temperature of 165°F (74°C) measured with a meat thermometer at the thickest part. Color and 'clear juices' are unreliable — use the thermometer.",
        key: ["165", "internal", "temperature", "74", "meat", "thermometer", "thickest", "part", "color", "juices", "degrees"]
      },
      {
        q: "You left cooked food out on the counter. How long is too long before it's risky to eat?",
        accept: ["two hours", "2 hours", "danger zone", "one hour", "bacteria", "two", "throw it out", "spoil", "perishable", "room temp"],
        answer: "The 'danger zone' is 40–140°F. Don't leave perishable food out more than 2 hours (1 hour if it's above ~90°F outside). Bacteria multiply fast in that range — when in doubt, throw it out.",
        key: ["danger", "zone", "40", "140", "two", "hours", "one", "hour", "perishable", "bacteria", "multiply", "throw"]
      },
      {
        q: "What's the right way to defrost frozen meat safely?",
        accept: ["fridge", "refrigerator", "cold water", "microwave", "not counter", "in the fridge", "cold running water", "sealed bag", "thaw", "defrost"],
        answer: "In the refrigerator (safest, plan ahead), in a sealed bag under cold running/changed water, or in the microwave if cooking immediately. NOT on the counter at room temp — the outside hits the bacteria danger zone while the middle's still frozen.",
        key: ["refrigerator", "fridge", "safest", "sealed", "bag", "cold", "water", "microwave", "counter", "room", "bacteria", "danger", "zone"]
      },
      {
        q: "Knife skills 101: how should you hold the food and the knife to not lose a fingertip?",
        accept: ["claw", "curl", "knuckles", "fingers", "grip", "claw grip", "curl fingers", "tuck", "sharp knife", "pinch"],
        answer: "Use the 'claw' grip on the food — curl your fingertips under and let your knuckles guide the blade. Pinch the blade near the handle for control. Keep the knife sharp; dull knives slip and cause more cuts.",
        key: ["claw", "grip", "curl", "fingertips", "knuckles", "guide", "blade", "pinch", "handle", "control", "sharp", "dull"]
      },
      {
        q: "You want to cook rice and the package is gone. What's a simple method and ratio?",
        accept: ["two to one", "2:1", "two cups", "ratio", "simmer", "lid", "two to one ratio", "two parts", "cover", "boil"],
        answer: "Common method: ~2 parts water to 1 part white rice, bring to a boil, drop to low, cover with a lid, simmer ~15–18 min, then rest off heat 5 min without lifting the lid. Don't stir it constantly.",
        key: ["two", "parts", "water", "one", "rice", "ratio", "boil", "low", "cover", "lid", "simmer", "rest", "stir"]
      }
    ]
  },
  {
    id: "sense",
    name: "Common Sense",
    blurb: "Decisions, judgment, and not getting scammed.",
    icon: "bulb",
    questions: [
      {
        q: "You get a call: 'This is the IRS, pay now with gift cards or you'll be arrested.' What's the play?",
        accept: ["scam", "hang up", "gift cards", "never", "don't pay", "fraud", "hang up the phone", "fake", "call back", "official number"],
        answer: "It's a scam — hang up. Real agencies (IRS, police, utilities) never demand payment by gift cards, crypto, or wire, and don't threaten instant arrest by phone. Don't give info; if unsure, call the agency back on its official number.",
        key: ["scam", "hang", "up", "agencies", "irs", "never", "gift", "cards", "crypto", "wire", "arrest", "official", "number"]
      },
      {
        q: "How do you spot a phishing email before you click the link?",
        accept: ["sender", "url", "hover", "urgency", "spelling", "link", "sender address", "hover the link", "typos", "phishing"],
        answer: "Check the real sender address (not the display name), hover the link to see where it actually goes, watch for urgency/threats, odd spelling, and requests for passwords or payment. When in doubt, go to the site directly instead of clicking.",
        key: ["sender", "address", "display", "name", "hover", "link", "url", "urgency", "threats", "spelling", "passwords", "directly"]
      },
      {
        q: "A deal online is 70% off and 'only 2 left, buy now!' How do you not get burned?",
        accept: ["pressure", "research", "reviews", "too good", "scam", "slow down", "urgency", "compare prices", "return policy", "credit card"],
        answer: "Manufactured urgency is a red flag. Slow down: check the seller's reviews/reputation, compare the price elsewhere, look for a real return policy and contact info, and use a credit card for buyer protection. If it's too good to be true, it usually is.",
        key: ["urgency", "red", "flag", "slow", "seller", "reviews", "reputation", "compare", "price", "return", "policy", "credit", "card", "protection"]
      },
      {
        q: "You're in a heated argument and about to send a furious text. What's the smarter move?",
        accept: ["wait", "sleep on it", "draft", "calm", "don't send", "cool", "cool down", "step away", "wait to send", "pause"],
        answer: "Don't send it hot. Write the draft if you must, then wait — sleep on it or step away to cool down. You can't unsend words. Decide what outcome you actually want, then respond to that, not to the anger.",
        key: ["send", "draft", "wait", "sleep", "step", "away", "cool", "down", "unsend", "outcome", "respond", "anger"]
      },
      {
        q: "How do you make a hard decision when you're stuck between two options?",
        accept: ["pros and cons", "list", "worst case", "values", "future", "advice", "pros cons", "worst outcome", "set a deadline", "commit"],
        answer: "Write the real pros/cons, ask what the worst realistic outcome of each is and whether you can live with it, check which choice fits your actual values and future goals, set a deadline, and ask someone you trust. Then commit — indecision is also a choice.",
        key: ["pros", "cons", "worst", "case", "outcome", "live", "values", "future", "goals", "deadline", "trust", "commit", "indecision"]
      },
      {
        q: "A stranger's story doesn't add up and they want money 'just this once.' What's your gut check?",
        accept: ["scam", "verify", "walk away", "pressure", "trust", "say no", "trust your gut", "non cash", "pause", "don't give money"],
        answer: "Trust the gut that says it's off. Urgency + a sympathetic story + a money ask is a classic setup. You can be kind without being a mark: offer non-cash help, verify the story, or simply say no and walk away. Real emergencies survive a pause.",
        key: ["trust", "gut", "urgency", "sympathetic", "story", "money", "setup", "non", "cash", "verify", "say", "no", "walk", "away", "pause"]
      }
    ]
  },
  {
    id: "grownup",
    name: "Grown-Up Mode",
    blurb: "The hard stuff nobody actually taught you.",
    icon: "doc",
    questions: [
      {
        q: "You're writing a paper check for $1,042.50. How do you write the cents, and how do you stop someone from altering it?",
        accept: ["fraction", "100", "over 100", "line", "50/100", "fifty over", "draw a line", "over one hundred", "words", "no hundred"],
        answer: "Write the dollars in words, then the cents as a fraction over 100: 'One thousand forty-two and 50/100'. For whole dollars use 'and 00/100' (or 'and no/100'). Draw a line through any empty space after the words so no one can add to it, and make the numeric box ($1,042.50) match.",
        key: ["dollars", "words", "cents", "fraction", "100", "50/100", "00/100", "draw", "line", "empty", "space", "numeric", "box", "match"]
      },
      {
        q: "Explain the difference between a health plan's premium, deductible, copay, and out-of-pocket maximum.",
        accept: ["premium", "deductible", "copay", "out of pocket", "out-of-pocket", "monthly", "fixed fee", "maximum", "cap", "co-pay"],
        answer: "Premium = what you pay every month just to have the plan. Deductible = what you pay yourself before insurance starts covering things. Copay = a fixed fee per visit/prescription. Out-of-pocket maximum = the hard cap; once you hit it in a year, insurance pays 100% of covered costs.",
        key: ["premium", "monthly", "plan", "deductible", "before", "insurance", "covers", "copay", "fixed", "fee", "visit", "out", "pocket", "maximum", "cap", "100"]
      },
      {
        q: "What's the real difference between an HMO and a PPO health plan?",
        accept: ["network", "referral", "ppo", "hmo", "out of network", "primary", "in network", "specialist", "primary care", "flexibility"],
        answer: "HMO: cheaper, but you must stay in-network and usually need a primary-care doctor's referral to see specialists. PPO: more expensive, but you can see specialists without referrals and can go out-of-network (you just pay more). HMO trades flexibility for cost.",
        key: ["hmo", "cheaper", "network", "primary", "care", "referral", "specialists", "ppo", "expensive", "out", "flexibility", "cost"]
      },
      {
        q: "You're buying a $400,000 house. What's the 'standard' down payment, what does it come to in dollars, and what happens if you put down less?",
        accept: ["20", "twenty", "80000", "80,000", "pmi", "percent", "twenty percent", "eighty thousand", "mortgage insurance", "down payment"],
        answer: "The standard is 20% down = $80,000, which lets you avoid PMI. You can put down less (FHA loans go as low as 3.5%, ~$14,000), but under 20% you'll pay PMI (private mortgage insurance) every month until you reach ~20% equity, and you'll borrow — and pay interest on — more.",
        key: ["20", "twenty", "percent", "down", "80000", "avoid", "pmi", "private", "mortgage", "insurance", "equity", "3.5", "fha", "interest"]
      },
      {
        q: "Your job offers a '401(k) with a 4% match.' What does that actually mean, and what's the rookie mistake?",
        accept: ["match", "free money", "contribute", "4", "vesting", "percent", "employer match", "four percent", "full match", "leave money"],
        answer: "If you contribute, your employer adds money too — up to 4% of your salary. That's free money and an instant 100% return. The rookie mistake is not contributing at least enough to get the full match — you're leaving guaranteed money on the table. Watch the vesting schedule (how long until the match is fully yours).",
        key: ["contribute", "employer", "adds", "4", "four", "percent", "salary", "free", "money", "100", "return", "full", "match", "vesting", "table"]
      },
      {
        q: "A raise bumps you into a higher tax bracket. Does that mean you can actually take home LESS money? Explain.",
        accept: ["marginal", "myth", "above threshold", "not whole", "always more", "no you don't", "marginal rate", "only the income above", "false", "still more"],
        answer: "No — that's a myth. Brackets are marginal: only the income ABOVE each threshold is taxed at the higher rate, not your whole salary. A raise always leaves you with more take-home pay. (The rare exception is losing a specific income-tested benefit — a 'benefits cliff' — not the tax itself.)",
        key: ["no", "myth", "marginal", "income", "above", "threshold", "higher", "rate", "whole", "salary", "raise", "more", "take", "home", "cliff"]
      },
      {
        q: "What's the difference between APR and APY, and which one do you want to be lower vs higher?",
        accept: ["apr", "apy", "compound", "interest", "borrow", "earn", "compounding", "annual percentage", "low apr", "high apy"],
        answer: "APR is a yearly interest rate without compounding; APY includes the effect of compounding. When you're BORROWING (loans, cards) you want a low APR. When you're SAVING/INVESTING you want a high APY. For the same nominal rate, APY is always ≥ APR because of compounding.",
        key: ["apr", "yearly", "interest", "rate", "without", "compounding", "apy", "includes", "compound", "borrowing", "low", "saving", "high", "nominal"]
      },
      {
        q: "Term life vs whole life insurance — what's the difference, and which does most financial advice favor for a young family?",
        accept: ["term", "whole", "cash value", "cheaper", "permanent", "term life", "buy term", "invest the rest", "set period", "invest difference"],
        answer: "Term life covers you for a set period (e.g., 20 years), is cheap, and pays out only if you die during the term. Whole life is permanent and builds 'cash value' but costs many times more. Most advice: buy cheap term and invest the difference — 'buy term, invest the rest' — for a young family on a budget.",
        key: ["term", "set", "period", "cheap", "pays", "die", "whole", "permanent", "cash", "value", "costs", "more", "invest", "difference", "rest"]
      },
      {
        q: "What is escrow, and where will a normal person run into it twice when buying a home?",
        accept: ["escrow", "third party", "earnest", "taxes", "insurance", "holds", "neutral party", "earnest money", "held", "property taxes"],
        answer: "Escrow is money held by a neutral third party until conditions are met. You hit it twice: (1) at purchase, your earnest-money deposit sits in escrow until closing; (2) in your monthly mortgage payment, a portion goes into an escrow account the lender uses to pay your property taxes and homeowners insurance for you.",
        key: ["escrow", "money", "held", "neutral", "third", "party", "conditions", "earnest", "deposit", "closing", "monthly", "mortgage", "lender", "property", "taxes", "insurance"]
      },
      {
        q: "You owe $6,000 across three credit cards. What's the smartest order to pay them off and why?",
        accept: ["highest interest", "avalanche", "snowball", "smallest", "apr", "highest apr", "highest rate", "smallest balance", "pay extra", "minimums"],
        answer: "Mathematically best is the 'avalanche': pay minimums on all, then throw extra at the highest-APR card first — it costs you the least interest overall. The 'snowball' (smallest balance first) is worse on paper but gives quick wins for motivation. Either way: stop adding new charges and always pay more than the minimum.",
        key: ["avalanche", "minimums", "extra", "highest", "apr", "interest", "least", "snowball", "smallest", "balance", "motivation", "minimum", "charges"]
      }
    ]
  },
  {
    id: "geo",
    name: "Geography",
    blurb: "Maps, places, the planet.",
    icon: "globe",
    questions: [
      { q: "What is the largest country in the world by land area?", accept: ["russia", "russian", "russian federation"], answer: "Russia — by a wide margin, spanning 11 time zones across Europe and Asia.", key: ["russia", "land", "area", "11", "time", "zones", "europe", "asia", "largest"] },
      { q: "What is the capital of Australia? (Hint: it's not the famous one)", accept: ["canberra"], answer: "Canberra. Not Sydney or Melbourne — it was purpose-built as a compromise capital between the two rival cities.", key: ["canberra", "capital", "sydney", "melbourne", "compromise", "purpose", "built", "rival"] },
      { q: "Which country now has the largest population in the world?", accept: ["india", "indian"], answer: "India — it overtook China in 2023.", key: ["india", "population", "overtook", "china", "2023", "largest", "most", "people"] },
      { q: "What is the largest ocean on Earth?", accept: ["pacific", "pacific ocean"], answer: "The Pacific Ocean — larger than all the land on Earth combined.", key: ["pacific", "ocean", "largest", "land", "combined", "earth", "biggest", "water"] },
      { q: "Which imaginary line divides Earth into the Northern and Southern hemispheres?", accept: ["equator"], answer: "The Equator — at 0° latitude.", key: ["equator", "imaginary", "line", "northern", "southern", "hemispheres", "latitude", "zero"] },
      { q: "Which US state is the largest by area?", accept: ["alaska", "alaskan"], answer: "Alaska — more than twice the size of Texas.", key: ["alaska", "state", "largest", "area", "twice", "texas", "biggest", "size"] },
      { q: "What is the smallest country in the world?", accept: ["vatican", "vatican city", "holy see"], answer: "Vatican City — about 0.2 square miles, entirely within Rome.", key: ["vatican", "city", "smallest", "country", "square", "miles", "rome", "italy"] },
      { q: "On which continent is the Sahara Desert?", accept: ["africa", "african"], answer: "Africa — the Sahara stretches across most of North Africa.", key: ["africa", "continent", "sahara", "desert", "north", "northern", "stretches", "largest"] },
      { q: "What is the tallest mountain on Earth above sea level?", accept: ["everest", "mount everest", "mt everest"], answer: "Mount Everest, ~29,032 ft, on the Nepal–Tibet border.", key: ["everest", "mount", "tallest", "mountain", "29032", "feet", "nepal", "tibet", "border", "sea", "level"] },
      { q: "The Great Barrier Reef lies off the coast of which country?", accept: ["australia", "australian"], answer: "Australia — off the northeast coast of Queensland; it's the largest living structure on Earth.", key: ["australia", "great", "barrier", "reef", "northeast", "coast", "queensland", "largest", "living", "structure"] }
    ]
  },
  {
    id: "civics",
    name: "Politics & Civics",
    blurb: "How government actually works.",
    icon: "bank",
    questions: [
      { q: "How many U.S. senators does each state get, and how many are there in total?", accept: ["two", "2", "100", "hundred", "two each", "one hundred"], answer: "2 per state, regardless of population — 100 senators total.", key: ["two", "2", "per", "state", "population", "100", "hundred", "senators", "total"] },
      { q: "What are the three branches of the U.S. government?", accept: ["legislative", "executive", "judicial", "congress", "president", "courts"], answer: "Legislative (Congress — makes laws), Executive (President — enforces laws), and Judicial (the courts — interpret laws). They check and balance each other.", key: ["legislative", "congress", "makes", "laws", "executive", "president", "enforces", "judicial", "courts", "interpret", "check", "balance"] },
      { q: "How long is a U.S. presidential term, and how many terms can one person serve?", accept: ["four", "4", "two terms", "two", "eight", "8 years", "4 years"], answer: "4 years per term, with a maximum of 2 terms (8 years), set by the 22nd Amendment.", key: ["four", "4", "years", "term", "maximum", "two", "2", "terms", "eight", "8", "22nd", "amendment"] },
      { q: "What freedoms does the First Amendment protect?", accept: ["speech", "religion", "press", "assembly", "petition", "free speech"], answer: "Freedom of religion, speech, the press, peaceful assembly, and the right to petition the government.", key: ["freedom", "religion", "speech", "press", "peaceful", "assembly", "petition", "government", "first", "amendment"] },
      { q: "How many justices sit on the U.S. Supreme Court?", accept: ["nine", "9"], answer: "9 — one Chief Justice and eight Associate Justices. The number isn't fixed by the Constitution.", key: ["nine", "9", "justices", "chief", "justice", "eight", "associate", "supreme", "court", "constitution"] },
      { q: "What is the minimum age to be elected President of the United States?", accept: ["35", "thirty five", "thirty-five"], answer: "35 years old. You must also be a natural-born citizen and have lived in the U.S. for 14 years.", key: ["35", "thirty", "five", "years", "minimum", "age", "natural", "born", "citizen", "14"] },
      { q: "Which branch of government has the power to declare war?", accept: ["congress", "legislative"], answer: "Congress (the legislative branch). The President is Commander-in-Chief but can't formally declare war alone.", key: ["congress", "legislative", "branch", "declare", "war", "president", "commander", "chief", "power"] },
      { q: "What are the first ten amendments to the Constitution collectively called?", accept: ["bill of rights", "bill"], answer: "The Bill of Rights — the first 10 amendments, protecting core individual freedoms.", key: ["bill", "rights", "first", "ten", "10", "amendments", "constitution", "individual", "freedoms"] },
      { q: "How long is the term for a member of the U.S. House of Representatives?", accept: ["two", "2", "two years"], answer: "2 years — the entire House is up for election every two years.", key: ["two", "2", "years", "term", "house", "representatives", "election", "every"] },
      { q: "What does it mean to 'veto' a bill, and who can override it?", accept: ["reject", "president", "override", "two thirds", "congress", "veto"], answer: "A veto is the President rejecting a bill instead of signing it into law. Congress can override the veto with a two-thirds vote in both the House and Senate.", key: ["veto", "president", "reject", "bill", "signing", "law", "congress", "override", "two", "thirds", "vote", "house", "senate"] }
    ]
  },
  {
    id: "generaled",
    name: "General Ed",
    blurb: "School stuff you should still know.",
    icon: "atom",
    questions: [
      { q: "What is the chemical symbol for gold?", accept: ["au", "a u"], answer: "Au — from the Latin 'aurum'.", key: ["au", "gold", "chemical", "symbol", "latin", "aurum"] },
      { q: "Who wrote Romeo and Juliet?", accept: ["shakespeare", "william", "william shakespeare", "bard"], answer: "William Shakespeare, around 1595.", key: ["william", "shakespeare", "wrote", "romeo", "juliet", "1595"] },
      { q: "What is the powerhouse of the cell?", accept: ["mitochondria", "mitochondrion", "mighty mitochondria"], answer: "The mitochondria — they produce most of the cell's energy (ATP).", key: ["mitochondria", "powerhouse", "cell", "produce", "energy", "atp"] },
      { q: "What planet is known as the Red Planet?", accept: ["mars", "red planet"], answer: "Mars — its surface is rich in iron oxide (rust).", key: ["mars", "red", "planet", "surface", "iron", "oxide", "rust"] },
      { q: "What is the square root of 144?", accept: ["12", "twelve"], answer: "12 (because 12 × 12 = 144).", key: ["12", "twelve", "square", "root", "144"] },
      { q: "What gas do plants absorb from the air that humans breathe out?", accept: ["carbon dioxide", "co2", "carbon", "dioxide"], answer: "Carbon dioxide (CO₂). Plants take it in and release oxygen during photosynthesis.", key: ["carbon", "dioxide", "co2", "gas", "plants", "absorb", "release", "oxygen", "photosynthesis"] },
      { q: "Who painted the Mona Lisa?", accept: ["da vinci", "leonardo", "leonardo da vinci", "davinci"], answer: "Leonardo da Vinci, in the early 1500s.", key: ["leonardo", "da", "vinci", "painted", "mona", "lisa", "1500s"] },
      { q: "Roughly how many bones are in the adult human body?", accept: ["206", "two hundred", "two oh six", "two hundred six"], answer: "206 bones (babies are born with about 270, which fuse together over time).", key: ["206", "bones", "adult", "human", "body", "babies", "270", "fuse"] },
      { q: "What is the largest planet in our solar system?", accept: ["jupiter"], answer: "Jupiter — a gas giant more massive than all the other planets combined.", key: ["jupiter", "largest", "planet", "solar", "system", "gas", "giant", "massive", "combined"] },
      { q: "In what year did World War II end?", accept: ["1945", "forty five", "nineteen forty five"], answer: "1945 — Germany surrendered in May, Japan in August/September.", key: ["1945", "world", "war", "end", "germany", "surrendered", "may", "japan", "august", "september"] }
    ]
  }
];

const ROASTS = [
  "A toddler with a crayon would've gotten closer.",
  "Your ancestors survived ice ages so you could... not know that.",
  "Somewhere, a search engine just felt a great disturbance.",
  "That answer needs to be deleted for the good of humanity.",
  "Brave of you to say that out loud.",
  "The neurons tried. They really did.",
  "I'd explain it, but you'd probably forget by the next question.",
  "Confidently wrong is still wrong, champ.",
  "This is why the AI thinks it can take over.",
  "Even autocorrect wouldn't have suggested that.",
  "Put the phone down? Maybe pick it back up.",
  "That's a 'thank you for playing' if I've ever heard one.",
  "Your brain just buffered and gave up.",
  "Bold strategy. Did not pay off.",
  "Synapse status: not firing."
];

const PRAISE = [
  "Actual human intelligence detected.",
  "The neurons are PROUD.",
  "Look at you, not needing a robot.",
  "Certified grid-survivor.",
  "That's the brain working as intended.",
  "Knowledge unlocked. Phone stays in pocket.",
  "Sharp. Dangerously self-sufficient.",
  "Full marks from the meat computer."
];
