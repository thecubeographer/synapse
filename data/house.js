/* Extra question pool for Around The House */
(function () {
  if (typeof CATEGORIES === "undefined") return;
  var c = CATEGORIES.find(function (x) { return x.id === "house"; });
  if (!c) return;
  var moreExplain = [
    {
      q: "Why should you turn off the water supply before fixing a leaky faucet?",
      answer: "Shutting off the supply valve stops water flow so you can disassemble the faucet without flooding the area. It prevents water damage and lets you work safely on the internal parts.",
      accept: ["shut off water", "stop flow", "prevent flooding", "supply valve", "water damage", "shutoff", "stop water", "no flooding"],
      key: ["supply", "valve", "stops", "water", "flow", "disassemble", "flooding", "damage", "safely", "parts"]
    },
    {
      q: "How does a plunger clear a clogged drain?",
      answer: "A plunger uses suction and pressure to dislodge the blockage. Pushing and pulling forces water and air against the clog, breaking it loose so it can move through the pipe.",
      accept: ["suction", "pressure", "dislodge clog", "push pull", "force water", "air", "blockage", "vacuum"],
      key: ["plunger", "suction", "pressure", "dislodge", "blockage", "push", "pull", "water", "air", "clog"]
    },
    {
      q: "Why is it important to test a smoke detector regularly?",
      answer: "Testing confirms the alarm and battery still work so it will warn you of a fire. A dead or faulty detector gives no early warning, which is when most fire deaths occur.",
      accept: ["test button", "battery works", "early warning", "fire alarm", "working", "save lives", "functioning", "check battery"],
      key: ["testing", "alarm", "battery", "work", "warn", "fire", "early", "warning", "dead", "faulty"]
    },
    {
      q: "What is the purpose of a circuit breaker in your electrical panel?",
      answer: "A circuit breaker automatically cuts power when a circuit draws too much current. This prevents overheated wires and reduces the risk of electrical fires.",
      accept: ["cuts power", "overload", "too much current", "prevent fire", "trips", "safety", "stops electricity", "overcurrent"],
      key: ["breaker", "cuts", "power", "circuit", "current", "overload", "overheated", "wires", "fires", "trips"]
    },
    {
      q: "Why do you sand a wall before painting it?",
      answer: "Sanding smooths out bumps and roughens glossy surfaces so paint adheres better. The result is a smoother, longer-lasting finish without flaking.",
      accept: ["smooth surface", "adhesion", "roughen", "remove bumps", "paint sticks", "even finish", "grip", "prep"],
      key: ["sanding", "smooths", "bumps", "roughens", "glossy", "paint", "adheres", "finish", "flaking", "surface"]
    },
    {
      q: "How does a thermostat control your home's temperature?",
      answer: "A thermostat senses the room temperature and switches the heating or cooling on or off to reach your set point. When the room hits the target, it signals the system to stop.",
      accept: ["senses temperature", "set point", "turns on off", "heating cooling", "target", "controls hvac", "thermometer", "switches"],
      key: ["thermostat", "senses", "temperature", "switches", "heating", "cooling", "set", "point", "target", "signals"]
    },
    {
      q: "Why should you not pour grease down the kitchen drain?",
      answer: "Grease cools and hardens inside the pipes, sticking to the walls and trapping debris. Over time this builds into a clog that blocks the drain.",
      accept: ["hardens", "clogs pipes", "sticks", "blockage", "solidifies", "builds up", "grease clog", "cools"],
      key: ["grease", "cools", "hardens", "pipes", "sticks", "walls", "traps", "debris", "clog", "blocks"]
    },
    {
      q: "What does a level tool do and why use one?",
      answer: "A level uses a bubble in liquid to show whether a surface is perfectly horizontal or vertical. It ensures shelves, pictures, and structures are straight and not crooked.",
      accept: ["bubble", "horizontal", "vertical", "straight", "even", "not crooked", "plumb", "flat"],
      key: ["level", "bubble", "liquid", "horizontal", "vertical", "surface", "straight", "shelves", "crooked", "plumb"]
    },
    {
      q: "Why do you use a stud finder before hanging something heavy?",
      answer: "A stud finder locates the wood framing behind drywall so you can screw into solid support. Anchoring to a stud holds far more weight than drywall alone.",
      accept: ["locate stud", "framing", "solid support", "hold weight", "behind drywall", "wood", "anchor", "secure"],
      key: ["stud", "finder", "locates", "framing", "drywall", "screw", "solid", "support", "weight", "anchor"]
    },
    {
      q: "How does a P-trap under a sink prevent sewer gas from entering your home?",
      answer: "The P-trap holds a small amount of water in its curved bend. That water seal blocks sewer gases from rising up through the drain into the room.",
      accept: ["water seal", "sewer gas", "curved bend", "blocks odor", "trap water", "u shape", "barrier", "smell"],
      key: ["trap", "water", "curved", "bend", "seal", "blocks", "sewer", "gases", "drain", "room"]
    },
    {
      q: "Why should you replace your HVAC air filter regularly?",
      answer: "A clogged filter restricts airflow, making the system work harder and use more energy. A clean filter improves efficiency and keeps dust out of the air you breathe.",
      accept: ["airflow", "efficiency", "dust", "system works harder", "clean air", "energy", "clogged", "breathe"],
      key: ["filter", "clogged", "restricts", "airflow", "system", "harder", "energy", "efficiency", "dust", "clean"]
    },
    {
      q: "What is the difference between a Phillips and a flathead screwdriver?",
      answer: "A flathead has a single flat blade for slotted screws, while a Phillips has a cross-shaped tip for screws with a plus-shaped recess. Using the matching driver prevents stripping the screw head.",
      accept: ["cross shaped", "flat blade", "slotted", "plus shape", "tip", "screw head", "matching", "x shape"],
      key: ["flathead", "flat", "blade", "slotted", "phillips", "cross", "tip", "screw", "recess", "stripping"]
    },
    {
      q: "Why do you caulk around a bathtub or shower?",
      answer: "Caulk seals the gap between the tub and the wall to keep water from seeping behind it. This prevents mold, rot, and hidden water damage.",
      accept: ["seal gap", "waterproof", "prevent leak", "mold", "rot", "water damage", "seal joint", "stop water"],
      key: ["caulk", "seals", "gap", "tub", "wall", "water", "seeping", "mold", "rot", "damage"]
    },
    {
      q: "How does a GFCI outlet protect you in a bathroom or kitchen?",
      answer: "A GFCI monitors the current flowing out and back, and trips instantly if it detects a leak to ground, such as through a person. This fast shutoff helps prevent electrocution near water.",
      accept: ["detects leak", "trips fast", "ground fault", "prevent shock", "cuts power", "near water", "electrocution", "monitors current"],
      key: ["gfci", "monitors", "current", "trips", "detects", "leak", "ground", "shutoff", "prevent", "shock"]
    },
    {
      q: "Why should you let paint dry between coats?",
      answer: "Applying a second coat too soon lifts and smears the wet first coat, ruining the finish. Waiting lets each layer cure so it bonds properly and looks even.",
      accept: ["dry first", "smears", "even finish", "bonds", "cure", "ruins finish", "lifts paint", "wait"],
      key: ["coat", "dry", "lifts", "smears", "finish", "cure", "layer", "bonds", "properly", "even"]
    },
    {
      q: "What is the purpose of a drywall anchor?",
      answer: "A drywall anchor spreads the load behind the wall so a screw can hold weight where there is no stud. It keeps fixtures from tearing out of the soft drywall.",
      accept: ["spread load", "no stud", "hold weight", "screw grip", "expands", "support", "hollow wall", "anchor"],
      key: ["anchor", "spreads", "load", "behind", "wall", "screw", "weight", "stud", "fixtures", "drywall"]
    },
    {
      q: "How do you stop a running toilet that won't stop filling?",
      answer: "Usually the flapper is not sealing or the float is set too high, so water keeps draining or overflowing into the tube. Adjusting the float or replacing the flapper stops the constant flow.",
      accept: ["flapper", "float", "fill valve", "overflow tube", "replace flapper", "adjust float", "seal", "tank"],
      key: ["flapper", "sealing", "float", "high", "water", "draining", "overflow", "tube", "adjust", "replace"]
    },
    {
      q: "Why do you pre-drill a pilot hole before driving a screw into hardwood?",
      answer: "A pilot hole removes some material so the screw can enter without splitting the wood. It also reduces the effort needed and keeps the screw straight.",
      accept: ["prevent splitting", "easier", "guide screw", "remove material", "no crack", "straight", "hardwood", "pilot"],
      key: ["pilot", "hole", "removes", "material", "screw", "splitting", "wood", "effort", "straight", "guide"]
    },
    {
      q: "What does turning off the main water valve accomplish during a burst pipe?",
      answer: "It shuts off all incoming water to the entire house, stopping the flow at the source. This limits flooding and water damage until repairs can be made.",
      accept: ["stop all water", "main shutoff", "limit flooding", "whole house", "source", "stop flow", "prevent damage", "shut off"],
      key: ["main", "valve", "shuts", "incoming", "water", "house", "source", "flooding", "damage", "repairs"]
    },
    {
      q: "Why should you unplug a small appliance before cleaning it?",
      answer: "Unplugging removes the electrical power so you cannot get a shock or accidentally turn it on. It is the basic safety step before touching internal or moving parts.",
      accept: ["no power", "prevent shock", "safety", "avoid electrocution", "cut electricity", "disconnect", "unplug", "no current"],
      key: ["unplugging", "removes", "electrical", "power", "shock", "accidentally", "safety", "internal", "moving", "parts"]
    },
    {
      q: "How does insulation help keep your home comfortable?",
      answer: "Insulation slows the transfer of heat through walls, ceilings, and floors. It keeps warm air in during winter and out during summer, lowering energy bills.",
      accept: ["slows heat", "keeps warmth", "energy bills", "barrier", "traps heat", "reduces transfer", "r value", "saves energy"],
      key: ["insulation", "slows", "transfer", "heat", "walls", "warm", "winter", "summer", "energy", "bills"]
    },
    {
      q: "What is the purpose of weatherstripping around a door?",
      answer: "Weatherstripping seals the gaps around a door to block drafts, moisture, and insects. It improves energy efficiency by keeping conditioned air inside.",
      accept: ["seal gaps", "block drafts", "stop air leak", "energy efficiency", "keep heat", "draft proof", "seal door", "weatherstrip"],
      key: ["weatherstripping", "seals", "gaps", "door", "drafts", "moisture", "insects", "energy", "efficiency", "air"]
    },
    {
      q: "Why do you use sandpaper with different grit numbers?",
      answer: "Lower grit numbers are coarse and remove material fast, while higher grit numbers are fine and create a smooth finish. You start coarse and work up to fine for the best result.",
      accept: ["coarse fine", "grit number", "smooth finish", "remove material", "low high", "progression", "rough", "polish"],
      key: ["grit", "numbers", "coarse", "remove", "material", "fine", "smooth", "finish", "start", "progression"]
    },
    {
      q: "How does a wrench differ from pliers for working on plumbing?",
      answer: "A wrench grips and turns nuts and bolts with a fixed or adjustable jaw, giving strong leverage. Pliers are mainly for gripping, bending, and holding rather than tightening fasteners with torque.",
      accept: ["wrench turns", "leverage", "grip nuts", "pliers hold", "torque", "tighten bolts", "jaw", "fastener"],
      key: ["wrench", "grips", "turns", "nuts", "bolts", "leverage", "pliers", "gripping", "bending", "holding"]
    },
    {
      q: "Why should you keep a fire extinguisher in the kitchen?",
      answer: "The kitchen is where most home fires start, from cooking grease and appliances. A nearby extinguisher lets you put out a small fire before it spreads.",
      accept: ["cooking fires", "grease fire", "put out flames", "spread", "most fires", "quick response", "safety", "stop fire"],
      key: ["kitchen", "fires", "cooking", "grease", "appliances", "extinguisher", "small", "fire", "spreads", "nearby"]
    },
    {
      q: "What does priming a wall do before you paint?",
      answer: "Primer seals porous surfaces and creates a uniform base so the topcoat adheres and covers evenly. It can also block stains and reduce the number of color coats needed.",
      accept: ["seals surface", "base coat", "adhesion", "even coverage", "block stains", "uniform", "primer", "fewer coats"],
      key: ["primer", "seals", "porous", "uniform", "base", "topcoat", "adheres", "evenly", "stains", "coats"]
    },
    {
      q: "How do you safely reset a tripped circuit breaker?",
      answer: "First unplug or reduce the load on that circuit, then flip the breaker fully to off and back to on. If it trips again immediately, there is a fault that needs a professional.",
      accept: ["flip off on", "reduce load", "unplug", "reset switch", "off then on", "find fault", "panel", "breaker"],
      key: ["unplug", "reduce", "load", "circuit", "flip", "breaker", "off", "fault", "trips", "professional"]
    },
    {
      q: "Why is a wire nut used when connecting two electrical wires?",
      answer: "A wire nut twists over the stripped ends to hold them together and provide a secure electrical connection. Its plastic cap also insulates the joint to prevent shorts and shocks.",
      accept: ["connect wires", "insulate", "secure connection", "twist on", "plastic cap", "prevent short", "splice", "cover"],
      key: ["wire", "nut", "twists", "stripped", "ends", "secure", "connection", "insulates", "joint", "shorts"]
    },
    {
      q: "How does a snake or auger clear a drain that a plunger can't?",
      answer: "A drain snake is a flexible cable you feed into the pipe to physically reach and break up or pull out a deep clog. It works on blockages too far down for a plunger's suction.",
      accept: ["flexible cable", "reach clog", "break up", "deep blockage", "pull out", "feed into pipe", "auger", "hook"],
      key: ["snake", "flexible", "cable", "feed", "pipe", "reach", "break", "deep", "clog", "blockage"]
    },
    {
      q: "Why should gutters be cleaned of leaves and debris?",
      answer: "Clogged gutters overflow and let water spill against the house, damaging the foundation, siding, and roof. Clear gutters channel rainwater safely away from the home.",
      accept: ["prevent overflow", "channel water", "protect foundation", "avoid damage", "clear debris", "drain rain", "downspout", "leaves"],
      key: ["gutters", "clogged", "overflow", "water", "foundation", "siding", "roof", "channel", "rainwater", "away"]
    },
    {
      q: "What is the purpose of a vapor barrier in a wall or crawlspace?",
      answer: "A vapor barrier blocks moisture from passing through and condensing inside walls or insulation. This helps prevent mold, rot, and reduced insulation performance.",
      accept: ["block moisture", "prevent mold", "stop condensation", "protect insulation", "rot", "plastic sheet", "humidity", "barrier"],
      key: ["vapor", "barrier", "blocks", "moisture", "condensing", "walls", "insulation", "mold", "rot", "performance"]
    },
    {
      q: "How does a deadbolt make a door more secure than a spring latch?",
      answer: "A deadbolt throws a solid metal bolt deep into the door frame and cannot be pushed back without turning the key or thumbturn. A spring latch can be forced or slipped open more easily.",
      accept: ["solid bolt", "into frame", "key turn", "cannot slip", "stronger", "thumbturn", "secure", "no spring"],
      key: ["deadbolt", "solid", "bolt", "frame", "pushed", "key", "thumbturn", "spring", "latch", "forced"]
    },
    {
      q: "Why do you shut off the gas before working on a gas appliance?",
      answer: "Cutting the gas supply prevents leaks and the risk of fire or explosion while you work. It also stops fumes that could cause poisoning in an enclosed space.",
      accept: ["prevent leak", "no explosion", "fire risk", "shut gas", "safety", "fumes", "avoid poisoning", "cut supply"],
      key: ["gas", "supply", "prevents", "leaks", "fire", "explosion", "fumes", "poisoning", "shut", "safety"]
    },
    {
      q: "What does sealing or staining a wood deck protect against?",
      answer: "A sealer or stain repels water and blocks UV rays that cause wood to rot, warp, and gray. Reapplying it periodically extends the life of the deck.",
      accept: ["water repel", "uv protection", "prevent rot", "stop warping", "weatherproof", "preserve wood", "fade", "moisture"],
      key: ["sealer", "stain", "repels", "water", "uv", "rays", "rot", "warp", "gray", "deck"]
    },
    {
      q: "How does a tape measure with markings help in home projects?",
      answer: "A tape measure gives precise length readings in inches and feet so cuts and placements are accurate. Measuring twice before cutting once avoids wasted material and mistakes.",
      accept: ["measure length", "inches feet", "accurate cuts", "measure twice", "precise", "mark distance", "ruler", "dimensions"],
      key: ["tape", "measure", "precise", "length", "inches", "feet", "accurate", "cuts", "twice", "material"]
    },
    {
      q: "Why should you not overload an electrical outlet with too many plugs?",
      answer: "Drawing more current than the circuit is rated for overheats the wiring and can start a fire. Spreading the load across circuits or using fewer high-draw devices prevents this.",
      accept: ["overheat wiring", "fire hazard", "too much current", "overload", "trip breaker", "spread load", "danger", "melt"],
      key: ["overload", "current", "circuit", "rated", "overheats", "wiring", "fire", "load", "devices", "prevents"]
    },
    {
      q: "How do you stop a squeaky door hinge?",
      answer: "Apply a lubricant such as oil or silicone spray to the hinge pin and joint. The lubricant reduces metal-on-metal friction that causes the squeak.",
      accept: ["lubricant", "oil hinge", "silicone spray", "reduce friction", "grease pin", "wd40", "lube", "metal friction"],
      key: ["lubricant", "oil", "silicone", "hinge", "pin", "joint", "reduces", "metal", "friction", "squeak"]
    },
    {
      q: "What is the role of a sump pump in a basement?",
      answer: "A sump pump sits in a pit and automatically pumps out water that collects there, sending it away from the house. It keeps the basement from flooding during heavy rain or high groundwater.",
      accept: ["pump water out", "prevent flooding", "basement", "pit", "groundwater", "automatic", "drain", "remove water"],
      key: ["sump", "pump", "pit", "pumps", "water", "away", "house", "basement", "flooding", "groundwater"]
    },
    {
      q: "Why do you wear safety glasses when drilling or cutting?",
      answer: "Drilling and cutting throw off debris, dust, and sparks that can fly into your eyes. Safety glasses shield them from injury that could cause permanent damage.",
      accept: ["protect eyes", "debris", "flying particles", "prevent injury", "dust sparks", "eye safety", "shield", "chips"],
      key: ["drilling", "cutting", "debris", "dust", "sparks", "eyes", "glasses", "shield", "injury", "damage"]
    },
    {
      q: "How does mortar or grout differ in their use around tile?",
      answer: "Mortar, or thinset, is the adhesive that bonds the tile to the surface beneath it. Grout fills the spaces between the tiles to seal the joints and lock them in place.",
      accept: ["mortar bonds", "grout fills", "thinset", "between tiles", "adhesive", "seal joints", "stick tile", "gaps"],
      key: ["mortar", "thinset", "adhesive", "bonds", "tile", "grout", "fills", "spaces", "joints", "seal"]
    },
    {
      q: "Why should you check the date and replace smoke detectors after about ten years?",
      answer: "The sensors inside smoke detectors degrade over time and become less reliable. Manufacturers recommend replacing the whole unit around ten years to ensure it still detects fires.",
      accept: ["sensors degrade", "ten years", "less reliable", "replace unit", "expire", "manufacturer", "old detector", "10 years"],
      key: ["sensors", "degrade", "reliable", "manufacturers", "replacing", "unit", "ten", "years", "detects", "fires"]
    },
    {
      q: "What does a hammer's claw end do?",
      answer: "The curved claw on the back of a hammer is used to pull nails out of wood. You slip the claw under the nail head and lever it out.",
      accept: ["pull nails", "remove nails", "pry", "lever out", "claw end", "extract nail", "back of hammer", "nail puller"],
      key: ["claw", "hammer", "pull", "nails", "wood", "slip", "head", "lever", "remove", "curved"]
    },
    {
      q: "How does bleeding a radiator improve heating?",
      answer: "Trapped air in a radiator stops hot water from filling the top, leaving it cold. Opening the bleed valve releases that air so the radiator fills and heats fully.",
      accept: ["release air", "trapped air", "bleed valve", "heat evenly", "fill radiator", "cold top", "let out air", "vent"],
      key: ["trapped", "air", "radiator", "hot", "water", "top", "cold", "bleed", "valve", "releases"]
    },
    {
      q: "Why do you use the right size washer with a bolt?",
      answer: "A washer spreads the clamping force over a wider area so the bolt head or nut does not dig into or crush the material. It also helps keep the fastener from loosening.",
      accept: ["spread force", "distribute load", "prevent crush", "wider area", "protect surface", "stop loosening", "even pressure", "washer"],
      key: ["washer", "spreads", "clamping", "force", "wider", "area", "bolt", "crush", "material", "loosening"]
    },
    {
      q: "How does shutting a water heater's power and supply help before draining it?",
      answer: "Turning off the power or gas prevents the burner or element from running dry and being damaged. Closing the cold supply and opening a drain lets you safely flush sediment from the tank.",
      accept: ["turn off power", "no dry firing", "flush sediment", "drain tank", "shut supply", "prevent damage", "cool down", "safety"],
      key: ["power", "gas", "burner", "element", "dry", "supply", "drain", "flush", "sediment", "tank"]
    }
  ];
  var moreShout = [
    { q: "What tool drives and pulls nails?", answer: "Hammer", accept: ["hammer", "claw hammer", "a hammer"] },
    { q: "What gas do carbon monoxide detectors sense?", answer: "Carbon monoxide", accept: ["carbon monoxide", "co", "monoxide", "carbon-monoxide"] },
    { q: "Roughly how many years before you replace a smoke detector?", answer: "Ten", accept: ["ten", "10", "10 years", "ten years"] },
    { q: "What do you call the pipe trap shaped like the letter P under a sink?", answer: "P-trap", accept: ["p-trap", "p trap", "ptrap", "the p trap"] },
    { q: "What hand tool tightens and loosens bolts with an adjustable jaw?", answer: "Wrench", accept: ["wrench", "a wrench", "spanner", "adjustable wrench"] },
    { q: "What sticky sealant goes around a bathtub edge?", answer: "Caulk", accept: ["caulk", "caulking", "silicone caulk", "sealant"] },
    { q: "What tool shows if a surface is perfectly horizontal using a bubble?", answer: "Level", accept: ["level", "a level", "spirit level", "bubble level"] },
    { q: "What outlet type protects against shock near water?", answer: "GFCI", accept: ["gfci", "g f c i", "gfi", "ground fault outlet"] },
    { q: "What flexible cable clears deep drain clogs?", answer: "Drain snake", accept: ["snake", "drain snake", "auger", "plumber's snake", "drain auger"] },
    { q: "What flat material forms most interior walls?", answer: "Drywall", accept: ["drywall", "sheetrock", "gypsum board", "plasterboard"] },
    { q: "What device in the panel trips to cut power on overload?", answer: "Circuit breaker", accept: ["circuit breaker", "breaker", "the breaker", "circuit-breaker"] },
    { q: "What rubber part seals the bottom of a toilet tank?", answer: "Flapper", accept: ["flapper", "the flapper", "flapper valve", "tank flapper"] },
    { q: "What screwdriver tip is cross-shaped?", answer: "Phillips", accept: ["phillips", "phillips head", "cross head", "philips"] },
    { q: "What coating do you apply before the final paint?", answer: "Primer", accept: ["primer", "prime", "priming coat", "primer coat"] },
    { q: "What tool finds wood framing behind drywall?", answer: "Stud finder", accept: ["stud finder", "studfinder", "stud detector", "stud sensor"] },
    { q: "What pump keeps a basement from flooding?", answer: "Sump pump", accept: ["sump pump", "sump", "sumppump", "the sump pump"] },
    { q: "What abrasive sheet smooths wood?", answer: "Sandpaper", accept: ["sandpaper", "sand paper", "abrasive paper", "glasspaper"] },
    { q: "What twist-on cap connects electrical wires?", answer: "Wire nut", accept: ["wire nut", "wirenut", "wire connector", "twist cap"] },
    { q: "What lock has a solid bolt thrown into the frame?", answer: "Deadbolt", accept: ["deadbolt", "dead bolt", "deadlock", "dead-bolt"] },
    { q: "What controls your home's temperature settings?", answer: "Thermostat", accept: ["thermostat", "the thermostat", "temp control", "thermometer control"] },
    { q: "What cup-shaped tool clears a clogged toilet by suction?", answer: "Plunger", accept: ["plunger", "a plunger", "the plunger", "toilet plunger"] },
    { q: "What fills the gaps between tiles?", answer: "Grout", accept: ["grout", "tile grout", "grouting", "the grout"] },
    { q: "What part of an HVAC system traps dust and should be changed often?", answer: "Air filter", accept: ["air filter", "filter", "furnace filter", "hvac filter"] },
    { q: "What channels rainwater off the edge of a roof?", answer: "Gutter", accept: ["gutter", "gutters", "rain gutter", "eaves gutter"] },
    { q: "What strip seals the gap around a door against drafts?", answer: "Weatherstripping", accept: ["weatherstripping", "weather stripping", "weatherstrip", "draft strip"] },
    { q: "What seals porous wood from water and UV on a deck?", answer: "Sealer", accept: ["sealer", "deck sealer", "wood sealer", "stain"] },
    { q: "What disc spreads a bolt's pressure on the surface?", answer: "Washer", accept: ["washer", "a washer", "flat washer", "the washer"] },
    { q: "What appliance heats water for the whole house?", answer: "Water heater", accept: ["water heater", "hot water heater", "boiler", "water-heater"] },
    { q: "What spinning tool bores holes and drives screws?", answer: "Drill", accept: ["drill", "a drill", "power drill", "cordless drill"] },
    { q: "What small hole do you make before driving a screw into hardwood?", answer: "Pilot hole", accept: ["pilot hole", "pilothole", "pilot", "guide hole"] },
    { q: "What gripping tool bends wire and holds small parts?", answer: "Pliers", accept: ["pliers", "plyers", "a pair of pliers", "needle nose pliers"] },
    { q: "What barrier in a wall blocks moisture?", answer: "Vapor barrier", accept: ["vapor barrier", "vapour barrier", "moisture barrier", "vapor-barrier"] },
    { q: "What material in your attic slows heat loss?", answer: "Insulation", accept: ["insulation", "batt insulation", "fiberglass insulation", "loft insulation"] },
    { q: "What handheld extinguisher type is recommended for a home kitchen?", answer: "Fire extinguisher", accept: ["fire extinguisher", "extinguisher", "fire-extinguisher", "abc extinguisher"] },
    { q: "What do you call the wood beam framing a wall?", answer: "Stud", accept: ["stud", "wall stud", "the stud", "wooden stud"] },
    { q: "What valve do you turn to stop water to the whole house?", answer: "Main shutoff", accept: ["main shutoff", "main valve", "main shut off", "main water valve"] },
    { q: "What thin adhesive bonds tile to a surface?", answer: "Thinset", accept: ["thinset", "thin set", "mortar", "tile mortar"] },
    { q: "What tool with a curved jaw grips and turns pipes?", answer: "Pipe wrench", accept: ["pipe wrench", "pipewrench", "monkey wrench", "stillson wrench"] },
    { q: "What protective eyewear shields against debris?", answer: "Safety glasses", accept: ["safety glasses", "safety goggles", "goggles", "eye protection"] },
    { q: "What spray loosens a rusty or squeaky bolt?", answer: "WD-40", accept: ["wd-40", "wd40", "wd 40", "penetrating oil"] },
    { q: "What measuring tool rolls out in inches and feet?", answer: "Tape measure", accept: ["tape measure", "tapemeasure", "measuring tape", "tape"] },
    { q: "What do you release from a radiator to fix cold spots?", answer: "Air", accept: ["air", "trapped air", "the air", "bleed air"] },
    { q: "What greasy substance should never go down the drain?", answer: "Grease", accept: ["grease", "fat", "oil", "cooking grease"] },
    { q: "What end of a hammer pulls nails?", answer: "Claw", accept: ["claw", "the claw", "claw end", "hammer claw"] },
    { q: "What flat-bladed screwdriver fits a single straight slot?", answer: "Flathead", accept: ["flathead", "flat head", "slotted", "flat-head"] }
  ];
  c.questions = c.questions.concat(moreExplain);
  c.shout = c.shout.concat(moreShout);
})();
