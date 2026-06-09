/**
 * Demo dataset — clearly labeled sample data (is_demo = true everywhere).
 * Used by the public /demo and /explore pages (so they work with no database)
 * and by scripts/seed.ts to populate Supabase. NEVER mixed with real user data.
 */

export interface DemoServiceEvent {
  date: string;
  mileage: number;
  vendor: string;
  category: string;
  summary: string;
  cost: number;
}

export interface DemoModification {
  name: string;
  category: string;
  brand: string;
  reversible: "reversible" | "permanent" | "unknown";
  oemRetained: "yes" | "no" | "unknown";
}

export interface DemoVehicle {
  slug: string;
  year: number;
  make: "Porsche";
  model: string;
  trim?: string;
  generation?: string;
  bodyStyle: string;
  exteriorColor: string;
  interiorColor: string;
  mileage: number;
  transmission: string;
  engine: string;
  drivetrain: string;
  vinPublicMode: "hidden" | "partial" | "full";
  titleStatus: string;
  ownershipStatus: string;
  saleStatus: string;
  askingPrice?: number;
  options: string[];
  knownFlaws: string;
  ownershipStory: string;
  personalSignificance: string;
  archiveNotes: string;
  provenanceHighlights: string[];
  privacyStatus: "private" | "draft_public" | "public";
  sellerReadiness: number;
  auctionReadiness: number;
  completeness: number;
  service: DemoServiceEvent[];
  modifications: DemoModification[];
  documents: { type: string; name: string; isPrivate: boolean }[];
  photos: { category: string; caption: string }[];
  instagram: { hook: string; caption: string }[];
  ad: { headline: string; primaryText: string };
  tasks: { title: string; priority: "low" | "medium" | "high" }[];
  buyerQuestions: { question: string }[];
  listingDraft: string;
}

export const DEMO_VEHICLES: DemoVehicle[] = [
  {
    slug: "2018-911-carrera-s",
    year: 2018, make: "Porsche", model: "911 Carrera S", trim: "Carrera S", generation: "991.2",
    bodyStyle: "Coupe", exteriorColor: "GT Silver Metallic", interiorColor: "Black/Bordeaux Red",
    mileage: 18450, transmission: "7-speed PDK", engine: "3.0L twin-turbo flat-six", drivetrain: "RWD",
    vinPublicMode: "hidden", titleStatus: "Clean", ownershipStatus: "Own", saleStatus: "Not for sale",
    options: ["Sport Chrono Package", "PASM Sport Suspension", "Sport Exhaust", "BOSE Surround"],
    knownFlaws: "Minor stone chips on the front bumper; small curb scuff on right rear wheel (documented in photos).",
    ownershipStory: "Purchased from the original owner in 2021 with complete service history. Garage-kept and used on weekend drives only.",
    personalSignificance: "First modern 911 after years of admiring them — a milestone car.",
    archiveNotes: "A clean 991.2 Carrera S with PDK and the desirable Sport Chrono package, documented from new.",
    provenanceHighlights: ["Two owners from new", "Complete dealer service records", "Original window sticker on file"],
    privacyStatus: "public", sellerReadiness: 82, auctionReadiness: 74, completeness: 88,
    service: [
      { date: "2018-09-12", mileage: 1200, vendor: "Authorized dealer", category: "break-in service", summary: "First service, oil and inspection", cost: 420 },
      { date: "2020-10-03", mileage: 9800, vendor: "Authorized dealer", category: "major service", summary: "Oil service, brake fluid, filters", cost: 980 },
      { date: "2022-11-20", mileage: 15200, vendor: "Independent specialist", category: "oil change", summary: "Oil and filter, multipoint inspection", cost: 350 },
    ],
    modifications: [{ name: "Sport exhaust valve controller", category: "exhaust", brand: "Aftermarket", reversible: "reversible", oemRetained: "yes" }],
    documents: [
      { type: "Window sticker", name: "window-sticker.pdf", isPrivate: false },
      { type: "Service record", name: "dealer-service-2020.pdf", isPrivate: false },
      { type: "Title document", name: "title.pdf", isPrivate: true },
    ],
    photos: [
      { category: "front 3/4", caption: "Front three-quarter, GT Silver" },
      { category: "rear 3/4", caption: "Rear three-quarter with sport exhaust" },
      { category: "interior", caption: "Bordeaux Red interior" },
      { category: "engine", caption: "3.0L twin-turbo flat-six" },
    ],
    instagram: [{ hook: "What 18k careful miles looks like", caption: "A documented 991.2 Carrera S. Every service on file. #porsche #911" }],
    ad: { headline: "2018 911 Carrera S, fully documented", primaryText: "Two owners, complete records, honest condition notes. Review the full archive." },
    tasks: [{ title: "Add undercarriage photos", priority: "medium" }, { title: "Scan latest service invoice", priority: "low" }],
    buyerQuestions: [{ question: "Is the Sport Chrono package functioning fully?" }],
    listingDraft: "2018 Porsche 911 Carrera S (991.2) in GT Silver over Bordeaux Red. 18,450 miles, PDK, Sport Chrono, sport exhaust. Two owners, documented service history.",
  },
  {
    slug: "2021-cayman-gt4",
    year: 2021, make: "Porsche", model: "718 Cayman GT4", trim: "GT4", generation: "982",
    bodyStyle: "Coupe", exteriorColor: "Racing Yellow", interiorColor: "Black",
    mileage: 6900, transmission: "6-speed manual", engine: "4.0L naturally aspirated flat-six", drivetrain: "RWD",
    vinPublicMode: "partial", titleStatus: "Clean", ownershipStatus: "Own", saleStatus: "Not for sale",
    options: ["Clubsport Package", "Carbon bucket seats", "Front axle lift", "PCCB delete (steel brakes)"],
    knownFlaws: "Track day rock chips on the front splitter (disclosed).",
    ownershipStory: "Ordered new and specified for spirited road and occasional track use. Track days logged and disclosed.",
    personalSignificance: "The last great naturally-aspirated manual Cayman — bought to keep.",
    archiveNotes: "A Clubsport-equipped GT4 with documented track use and honest disclosure.",
    provenanceHighlights: ["Original owner", "Track days logged", "Clubsport package"],
    privacyStatus: "public", sellerReadiness: 70, auctionReadiness: 68, completeness: 80,
    service: [
      { date: "2021-06-01", mileage: 500, vendor: "Authorized dealer", category: "delivery", summary: "PDI and delivery inspection", cost: 0 },
      { date: "2022-08-15", mileage: 4200, vendor: "Independent specialist", category: "oil change", summary: "Track-interval oil service", cost: 410 },
    ],
    modifications: [{ name: "Track alignment", category: "suspension", brand: "Specialist", reversible: "reversible", oemRetained: "yes" }],
    documents: [{ type: "Build sheet", name: "build-sheet.pdf", isPrivate: false }, { type: "Track log", name: "track-days.csv", isPrivate: false }],
    photos: [{ category: "front 3/4", caption: "Racing Yellow GT4" }, { category: "interior", caption: "Carbon buckets" }, { category: "wheels", caption: "Wheel and tire detail" }],
    instagram: [{ hook: "The last NA manual Cayman", caption: "Racing Yellow GT4, Clubsport package, honestly tracked. #gt4 #porsche" }],
    ad: { headline: "718 Cayman GT4, Clubsport", primaryText: "Documented, honestly disclosed track use. Full archive available." },
    tasks: [{ title: "Photograph splitter chips for disclosure", priority: "high" }],
    buyerQuestions: [{ question: "How many track days and what tire wear?" }],
    listingDraft: "2021 Porsche 718 Cayman GT4 in Racing Yellow. 6,900 miles, 6-speed manual, Clubsport package, carbon buckets. Track use logged and disclosed.",
  },
  {
    slug: "1997-911-carrera-coupe",
    year: 1997, make: "Porsche", model: "911 Carrera", trim: "Carrera", generation: "993",
    bodyStyle: "Coupe", exteriorColor: "Arena Red Metallic", interiorColor: "Cashmere",
    mileage: 74200, transmission: "6-speed manual", engine: "3.6L air-cooled flat-six", drivetrain: "RWD",
    vinPublicMode: "hidden", titleStatus: "Clean", ownershipStatus: "Own", saleStatus: "Not for sale",
    options: ["Sunroof delete", "Litronic headlights", "Factory aero kit"],
    knownFlaws: "Typical age-related interior wear; driver seat bolster softening (photographed).",
    ownershipStory: "Third owner since 2015. The last air-cooled 911, maintained by an air-cooled specialist with records back to the 1990s.",
    personalSignificance: "A lifelong dream car; the end of the air-cooled era.",
    archiveNotes: "A 993 Carrera — the final air-cooled 911 — with long-term specialist care and deep documentation.",
    provenanceHighlights: ["Records since the 1990s", "Air-cooled specialist maintained", "Last of the air-cooled 911s"],
    privacyStatus: "draft_public", sellerReadiness: 76, auctionReadiness: 79, completeness: 84,
    service: [
      { date: "2016-04-10", mileage: 61000, vendor: "Air-cooled specialist", category: "major service", summary: "Valve adjustment, fluids, belts", cost: 2100 },
      { date: "2019-05-22", mileage: 68000, vendor: "Air-cooled specialist", category: "major service", summary: "Top end inspection, oil service", cost: 1850 },
      { date: "2023-03-14", mileage: 73000, vendor: "Air-cooled specialist", category: "service", summary: "Annual service, new tires", cost: 2400 },
    ],
    modifications: [{ name: "Period-correct stereo upgrade", category: "interior", brand: "Specialist", reversible: "reversible", oemRetained: "yes" }],
    documents: [{ type: "Service records", name: "service-history-1990s.pdf", isPrivate: false }, { type: "Inspection report", name: "ppi-2015.pdf", isPrivate: false }],
    photos: [{ category: "front 3/4", caption: "Arena Red 993" }, { category: "engine", caption: "Air-cooled 3.6" }, { category: "undercarriage", caption: "Clean undercarriage" }],
    instagram: [{ hook: "The last air-cooled 911", caption: "1997 993 Carrera, Arena Red over Cashmere. Specialist-maintained. #aircooled #993" }],
    ad: { headline: "1997 993 Carrera, specialist-maintained", primaryText: "Deep documentation on the last air-cooled 911. Review the archive." },
    tasks: [{ title: "Finalize public page disclosures", priority: "medium" }],
    buyerQuestions: [{ question: "Any history of engine work or oil leaks?" }],
    listingDraft: "1997 Porsche 911 Carrera (993) in Arena Red Metallic over Cashmere. 74,200 miles, 6-speed. Specialist-maintained, documented since the 1990s.",
  },
  {
    slug: "2020-taycan-turbo",
    year: 2020, make: "Porsche", model: "Taycan Turbo", trim: "Turbo", generation: "J1",
    bodyStyle: "Sedan", exteriorColor: "Carrara White Metallic", interiorColor: "Black/Limestone Beige",
    mileage: 21300, transmission: "2-speed automatic", engine: "Dual electric motors", drivetrain: "AWD",
    vinPublicMode: "hidden", titleStatus: "Clean", ownershipStatus: "Own", saleStatus: "Not for sale",
    options: ["Performance Battery Plus", "Adaptive air suspension", "Premium Package", "21-inch wheels"],
    knownFlaws: "Light wheel rash on one front wheel (photographed).",
    ownershipStory: "Daily-driven EV grand tourer, dealer-serviced with software updates documented.",
    personalSignificance: "Proof that the marque's future is as compelling as its past.",
    archiveNotes: "An early Taycan Turbo with documented dealer service and software history.",
    provenanceHighlights: ["Single owner", "Dealer-serviced", "Software updates logged"],
    privacyStatus: "private", sellerReadiness: 64, auctionReadiness: 55, completeness: 72,
    service: [
      { date: "2021-02-18", mileage: 9000, vendor: "Authorized dealer", category: "service", summary: "Annual inspection, software update", cost: 300 },
      { date: "2023-02-02", mileage: 19000, vendor: "Authorized dealer", category: "service", summary: "Brake fluid, cabin filter, software", cost: 540 },
    ],
    modifications: [],
    documents: [{ type: "Service record", name: "ev-service-2023.pdf", isPrivate: false }],
    photos: [{ category: "front 3/4", caption: "Carrara White Taycan" }, { category: "interior", caption: "Limestone Beige interior" }],
    instagram: [{ hook: "The marque, electrified", caption: "2020 Taycan Turbo, dealer-serviced, documented. #taycan #porsche" }],
    ad: { headline: "2020 Taycan Turbo, documented", primaryText: "Single-owner EV grand tourer with service and software history." },
    tasks: [{ title: "Add charging/battery health notes", priority: "medium" }],
    buyerQuestions: [{ question: "What is the current battery health/range?" }],
    listingDraft: "2020 Porsche Taycan Turbo in Carrara White. 21,300 miles, Performance Battery Plus, air suspension. Single owner, dealer-serviced.",
  },
  {
    slug: "2016-boxster-spyder",
    year: 2016, make: "Porsche", model: "Boxster Spyder", trim: "Spyder", generation: "981",
    bodyStyle: "Convertible", exteriorColor: "GT Silver Metallic", interiorColor: "Black",
    mileage: 28900, transmission: "6-speed manual", engine: "3.8L naturally aspirated flat-six", drivetrain: "RWD",
    vinPublicMode: "partial", titleStatus: "Clean", ownershipStatus: "For sale", saleStatus: "For sale",
    askingPrice: 0,
    options: ["Manual top", "Sport Chrono", "Sport seats", "20-inch wheels"],
    knownFlaws: "Stone chips on hood; top requires manual operation by design (not a fault).",
    ownershipStory: "Enthusiast-owned, summers only, stored in a climate-controlled space each winter.",
    personalSignificance: "The purest open-top driver's car — selling only to fund the next project.",
    archiveNotes: "A 981 Boxster Spyder — manual, NA, and lightweight — documented and honestly presented.",
    provenanceHighlights: ["Two owners", "Garage-stored winters", "Manual gearbox"],
    privacyStatus: "draft_public", sellerReadiness: 86, auctionReadiness: 81, completeness: 90,
    service: [
      { date: "2017-07-08", mileage: 8000, vendor: "Authorized dealer", category: "service", summary: "Oil service, inspection", cost: 460 },
      { date: "2020-06-19", mileage: 18000, vendor: "Independent specialist", category: "major service", summary: "Oil, brakes, tires", cost: 1650 },
      { date: "2023-07-01", mileage: 27000, vendor: "Independent specialist", category: "service", summary: "Oil service, fluids", cost: 520 },
    ],
    modifications: [{ name: "Short shifter", category: "drivetrain", brand: "Specialist", reversible: "reversible", oemRetained: "yes" }],
    documents: [{ type: "Service records", name: "spyder-service.pdf", isPrivate: false }, { type: "Bill of sale", name: "purchase-2018.pdf", isPrivate: true }],
    photos: [{ category: "front 3/4", caption: "Top-down profile" }, { category: "interior", caption: "Sport seats" }, { category: "engine", caption: "3.8L flat-six" }, { category: "undercarriage", caption: "Undercarriage" }],
    instagram: [{ hook: "Top down, revs up", caption: "2016 Boxster Spyder, manual, 3.8 NA. Documented and honest. #boxster #spyder" }],
    ad: { headline: "2016 Boxster Spyder, manual", primaryText: "Two owners, garage-stored, documented service. Seller packet available." },
    tasks: [{ title: "Generate seller packet", priority: "high" }, { title: "Record cold-start and walkaround video", priority: "medium" }],
    buyerQuestions: [{ question: "Any clutch or top mechanism issues?" }],
    listingDraft: "2016 Porsche Boxster Spyder (981) in GT Silver. 28,900 miles, 6-speed manual, 3.8L. Two owners, garage-stored winters, documented service.",
  },
  {
    slug: "2007-911-turbo",
    year: 2007, make: "Porsche", model: "911 Turbo", trim: "Turbo", generation: "997.1",
    bodyStyle: "Coupe", exteriorColor: "Basalt Black Metallic", interiorColor: "Sea Blue",
    mileage: 49800, transmission: "6-speed manual", engine: "3.6L twin-turbo flat-six", drivetrain: "AWD",
    vinPublicMode: "hidden", titleStatus: "Clean", ownershipStatus: "Auction prep", saleStatus: "Auction prep",
    options: ["Sport Chrono Turbo", "PCCB ceramic brakes", "Sport seats", "Bose audio"],
    knownFlaws: "Minor coil-over weep noted at last inspection (disclosed); cosmetic wheel refinishing history.",
    ownershipStory: "Sought-after manual 997.1 Turbo, maintained regardless of cost with major services up to date.",
    personalSignificance: "A benchmark all-weather supercar; prepared now for an auction-style sale.",
    archiveNotes: "A manual 997.1 Turbo with ceramic brakes, prepared to auction-grade documentation standards.",
    provenanceHighlights: ["Manual gearbox (desirable)", "PCCB equipped", "Major services current"],
    privacyStatus: "draft_public", sellerReadiness: 88, auctionReadiness: 86, completeness: 92,
    service: [
      { date: "2018-09-01", mileage: 38000, vendor: "Authorized dealer", category: "major service", summary: "Major service, plugs, fluids", cost: 2600 },
      { date: "2021-10-12", mileage: 45000, vendor: "Independent specialist", category: "service", summary: "Oil, brakes, suspension inspection", cost: 1900 },
      { date: "2024-01-20", mileage: 49000, vendor: "Independent specialist", category: "inspection", summary: "Pre-sale inspection, fluids", cost: 1200 },
    ],
    modifications: [{ name: "Sport exhaust", category: "exhaust", brand: "Aftermarket", reversible: "reversible", oemRetained: "yes" }],
    documents: [
      { type: "Service records", name: "turbo-service-history.pdf", isPrivate: false },
      { type: "Inspection report", name: "pre-sale-ppi-2024.pdf", isPrivate: false },
      { type: "Window sticker", name: "window-sticker.pdf", isPrivate: false },
    ],
    photos: [
      { category: "front 3/4", caption: "Basalt Black 997 Turbo" },
      { category: "rear 3/4", caption: "Rear with sport exhaust" },
      { category: "interior", caption: "Sea Blue interior" },
      { category: "engine", caption: "3.6L twin-turbo" },
      { category: "undercarriage", caption: "Undercarriage" },
      { category: "wheels", caption: "PCCB and wheels" },
    ],
    instagram: [{ hook: "Manual. Turbo. Ceramic brakes.", caption: "2007 997.1 Turbo, Basalt Black over Sea Blue. Auction-prepped. #997turbo #porsche" }],
    ad: { headline: "2007 911 Turbo, manual, PCCB", primaryText: "Auction-grade documentation, honest disclosures, ready to review." },
    tasks: [{ title: "Finalize auction Q&A prep", priority: "high" }, { title: "Shoot paint meter readings", priority: "medium" }],
    buyerQuestions: [{ question: "Are the PCCB brakes within wear limits?" }, { question: "Any details on the coil-over weep?" }],
    listingDraft: "2007 Porsche 911 Turbo (997.1) in Basalt Black over Sea Blue. 49,800 miles, 6-speed manual, PCCB. Major services current, pre-sale PPI on file.",
  },
];

export function getDemoVehicle(slug: string) {
  return DEMO_VEHICLES.find((v) => v.slug === slug);
}
