// The single source both modes read. The timeline renders from it at build
// time; the quiz builds its question pool from the data-* attributes that
// rendering emits — so the quiz can never ask about a regime the timeline
// doesn't ship.
//
// Dates for Xia, Shang and Western Zhou are the conventional figures from the
// Xia–Shang–Zhou Chronology Project and carry `approx: true`. Xia's historicity
// is itself contested; that caveat is stated on the page, not buried here.

export type TrackId = "court" | "north" | "south" | "steppe" | "rival";

// Only "regime" counts toward concurrency. "period" is an umbrella whose
// children are the real regimes, and "phase" is a named stretch of one
// continuous authority — counting either would double-count and make the
// headline concurrency figure a lie.
export type Kind = "period" | "regime" | "phase";

export interface Span {
  start: number;
  end: number;
}

export interface Regime extends Span {
  id: string;
  name: string;
  chinese: string;
  /** Signed years; negative is BC. Intervals are half-open: [start, end). */
  start: number;
  end: number;
  approx?: boolean;
  /** Overrides the computed span for century-precision entries. */
  displaySpan?: string;
  note?: string;
  period: string;
  kind: Kind;
  track: TrackId;
  capital?: string;
  // These four are deliberately NOT optional. spec/assignment-1.test.ts requires
  // a non-empty data-detail on every trigger, so making them required means
  // `tsc --noEmit` fails while I'm authoring rather than the spec failing after
  // a build. Let the type system enforce the test.
  summary: string;
  weapons: string[];
  inventions: string[];
  artefacts: string[];
}

export interface Period extends Span {
  id: string;
  name: string;
  chinese: string;
  blurb: string;
}

export const TRACK_NAMES: Record<TrackId, string> = {
  court: "The main line",
  north: "The north",
  south: "The south",
  steppe: "The steppe",
  rival: "Rivals and claimants",
};

// Ten reading bands. They are groupings, not a partition of the timeline —
// band spans overlap, because history does. A few genuine overlaps therefore
// fall across a band boundary (Northern Wei began while the Sixteen Kingdoms
// and Eastern Jin were still running) and are not visible as adjacent columns.
// That loss is contained: the concurrency strip at the top and every quiz
// question are computed from the raw spans, never from the banding, so the
// headline claim and the questions are unaffected.
export const periods: Period[] = [
  {
    id: "bronze",
    name: "The bronze age",
    chinese: "夏商",
    start: -2070,
    end: -1046,
    blurb: "One line, or as close to one as this timeline ever gets.",
  },
  {
    id: "zhou",
    name: "Zhou and the warring states",
    chinese: "周",
    start: -1046,
    end: -221,
    blurb: "A single dynasty on paper, splintering underneath for five centuries.",
  },
  {
    id: "qin-han",
    name: "Qin and Han",
    chinese: "秦汉",
    start: -221,
    end: 220,
    blurb: "The template everyone afterwards claimed to be restoring.",
  },
  {
    id: "three-kingdoms",
    name: "The Three Kingdoms",
    chinese: "三国",
    start: 220,
    end: 280,
    blurb: "Three courts, each calling itself the legitimate one.",
  },
  {
    id: "jin",
    name: "Jin and the Sixteen Kingdoms",
    chinese: "晋·十六国",
    start: 266,
    end: 439,
    blurb: "One court in the south, a churn of short-lived states in the north.",
  },
  {
    id: "northern-southern",
    name: "North against south",
    chinese: "南北朝",
    start: 386,
    end: 589,
    blurb: "Two hundred years with no single ruler of China at all.",
  },
  {
    id: "sui-tang",
    name: "Sui and Tang",
    chinese: "隋唐",
    start: 581,
    end: 907,
    blurb: "Reunification — and a fifteen-year interruption most tables leave out.",
  },
  {
    id: "song-liao",
    name: "Five Dynasties, Liao and Song",
    chinese: "五代·辽·宋",
    start: 907,
    end: 1279,
    blurb: "The crowded centuries. Six regimes at once, and the Song never held the north.",
  },
  {
    id: "mongol",
    name: "The Mongol century",
    chinese: "蒙元",
    start: 1206,
    end: 1368,
    blurb: "A steppe empire that swallowed the lot, then ruled as a Chinese dynasty.",
  },
  {
    id: "ming-qing",
    name: "Ming and Qing",
    chinese: "明清",
    start: 1368,
    end: 1912,
    blurb: "Two long dynasties, each shadowed by a rump state it could not finish off.",
  },
];

export const regimes: Regime[] = [
  // ---------- The bronze age ----------
  {
    id: "xia",
    name: "Xia",
    chinese: "夏",
    start: -2070,
    end: -1600,
    approx: true,
    displaySpan: "c. 21st–17th century BC",
    period: "bronze",
    kind: "regime",
    track: "court",
    note: "Known from later texts and from the Erlitou site; its historicity is still argued over.",
    summary:
      "The dynasty traditional histories put first, known to archaeology mainly through the Erlitou site — bronze workshops, palace foundations, and no writing yet to confirm the name.",
    weapons: ["Bronze-socketed ge dagger-axes", "Stone and bone arrowheads"],
    inventions: ["Piece-mould bronze casting", "The earliest Chinese state-scale palace architecture"],
    artefacts: [
      "The Erlitou turquoise-inlaid bronze plaques",
      "The Erlitou jue, the oldest known Chinese bronze vessel type",
    ],
  },
  {
    id: "shang",
    name: "Shang",
    chinese: "商",
    start: -1600,
    end: -1046,
    approx: true,
    displaySpan: "c. 17th–11th century BC",
    period: "bronze",
    kind: "regime",
    track: "court",
    capital: "Yin (Anyang)",
    summary:
      "The first dynasty we can read in its own words. Shang diviners cracked ox bones and turtle shells with heat and wrote the answers on them — the earliest attested Chinese writing.",
    weapons: [
      "The bronze ge dagger-axe",
      "The composite bow",
      "Horse-drawn war chariots, buried complete with their teams",
    ],
    inventions: ["Oracle bone script", "Industrial-scale piece-mould bronze casting"],
    artefacts: [
      "The Houmuwu ding, an 832 kg bronze cauldron — the heaviest ancient bronze ever found",
      "The oracle bone archive at Yinxu",
      "The tomb of Fu Hao, a queen buried with 130 weapons",
    ],
  },

  // ---------- Zhou and the warring states ----------
  {
    id: "zhou",
    name: "Zhou",
    chinese: "周",
    start: -1046,
    end: -256,
    approx: true,
    displaySpan: "c. 11th century – 256 BC",
    period: "zhou",
    kind: "period",
    track: "court",
    summary:
      "The longest-lasting dynasty in Chinese history, and for most of its length a fiction — the Zhou king reigned while his nominal vassals fought each other for five hundred years.",
    weapons: ["Bronze ge and ji halberds", "Massed chariot warfare, later abandoned for infantry"],
    inventions: [
      "The Mandate of Heaven — the doctrine that a dynasty rules only while it deserves to",
      "Cast iron, centuries before it appeared in Europe",
    ],
    artefacts: ["The Da Yu ding and its 291-character inscription", "The Book of Songs"],
  },
  {
    id: "western-zhou",
    name: "Western Zhou",
    chinese: "西周",
    start: -1046,
    end: -771,
    approx: true,
    displaySpan: "c. 11th century – 771 BC",
    period: "zhou",
    kind: "phase",
    track: "court",
    capital: "Haojing",
    summary:
      "The half of the Zhou that actually governed. Ritual bronzes were cast as legal documents — land grants and appointments recorded in metal because metal outlasts an argument.",
    weapons: ["Bronze ji halberds", "Chariot squadrons of the royal Six Armies"],
    inventions: ["The fengjian system of granted domains", "Inscribed ritual bronze as a legal record"],
    artefacts: ["The Li gui, which dates the Zhou conquest of Shang", "The Da Yu ding"],
  },
  {
    id: "eastern-zhou",
    name: "Eastern Zhou",
    chinese: "东周",
    start: -770,
    end: -256,
    period: "zhou",
    kind: "phase",
    track: "court",
    capital: "Luoyi",
    summary:
      "After the capital was sacked in 771 BC the Zhou king kept his title and lost his power. What follows is five centuries of nominal rule while the real fighting happened elsewhere.",
    weapons: ["The trigger-lock crossbow", "Iron swords replacing bronze"],
    inventions: ["Cast iron and the blast furnace", "The hundred schools of thought"],
    artefacts: [
      "The bianzhong of Marquis Yi of Zeng — 65 bronze bells, still playable, cast by 433 BC",
    ],
  },
  {
    id: "spring-autumn",
    name: "Spring and Autumn",
    chinese: "春秋",
    start: -770,
    end: -476,
    period: "zhou",
    kind: "phase",
    track: "rival",
    summary:
      "A named phase of the Eastern Zhou, when perhaps a hundred and fifty statelets contracted into a dozen through war, marriage and annexation. Confucius lived at its end.",
    weapons: ["Bronze swords of exceptional quality", "Chariot-led aristocratic warfare"],
    inventions: ["The iron ploughshare", "The ox-drawn plough"],
    artefacts: [
      "The Sword of Goujian — untarnished after 2,400 years in a wet tomb",
      "The Spring and Autumn Annals",
    ],
  },
  {
    id: "warring-states",
    name: "Warring States",
    chinese: "战国",
    start: -475,
    end: -221,
    period: "zhou",
    kind: "phase",
    track: "rival",
    summary:
      "Seven states, professional armies of hundreds of thousands, and warfare industrialised. It ends when Qin wins and everything on this timeline afterwards is measured against that.",
    weapons: [
      "The mass-produced crossbow with a bronze trigger mechanism",
      "Iron swords and massed conscript infantry",
    ],
    inventions: [
      "The sinan — a lodestone spoon that points south, the ancestor of the compass",
      "Standing conscript armies and the bureaucracy to feed them",
    ],
    artefacts: ["The Chu Silk Manuscript", "The Dujiangyan irrigation system, still in use"],
  },

  // ---------- Qin and Han ----------
  {
    id: "qin",
    name: "Qin",
    chinese: "秦",
    start: -221,
    end: -207,
    period: "qin-han",
    kind: "regime",
    track: "court",
    capital: "Xianyang",
    summary:
      "Fifteen years, and the mould for the next two thousand. Qin standardised the script, the coinage, the weights and even the axle width of carts — then collapsed almost immediately.",
    weapons: [
      "Crossbows with interchangeable trigger mechanisms — parts from one fit another",
      "The long bronze qin sword",
    ],
    inventions: [
      "One script, one currency, one set of weights and measures for the whole empire",
      "The commandery system that replaced hereditary lords with appointed officials",
    ],
    artefacts: [
      "The Terracotta Army — around 8,000 figures, no two faces alike",
      "The first linked walls along the northern frontier",
    ],
  },
  {
    id: "han",
    name: "Han",
    chinese: "汉",
    start: -202,
    end: 220,
    period: "qin-han",
    kind: "period",
    track: "court",
    summary:
      "Four centuries with two interruptions, and the dynasty the Chinese majority is still named after. It kept the Qin machinery and dropped the Qin cruelty.",
    weapons: ["The ring-pommel iron dao sabre", "Repeating and heavy-draw crossbows"],
    inventions: ["Paper", "The seismoscope", "State monopolies on salt and iron"],
    artefacts: ["The Silk Road", "The Mawangdui manuscripts", "The Records of the Grand Historian"],
  },
  {
    id: "western-chu",
    name: "Western Chu",
    chinese: "西楚",
    start: -206,
    end: -202,
    period: "qin-han",
    kind: "regime",
    track: "rival",
    summary:
      "Xiang Yu's four-year attempt to answer Qin by undoing it — carving the empire back into eighteen kingdoms. He lost to Liu Bang, and centralism won permanently.",
    weapons: ["The ji halberd", "Heavy cavalry, still a novelty in Chinese armies"],
    inventions: [
      "The Eighteen Kingdoms partition — a deliberate return to feudal division after Qin's centralism",
    ],
    artefacts: ["Chu-style lacquerware from the Hunan and Hubei tombs"],
  },
  {
    id: "western-han",
    name: "Western Han",
    chinese: "西汉",
    start: -202,
    end: 9,
    period: "qin-han",
    kind: "regime",
    track: "court",
    capital: "Chang'an",
    summary:
      "Zhang Qian was sent west to find allies against the Xiongnu, failed, and came back with a map of Central Asia. The Silk Road is the accidental result.",
    weapons: [
      "The ring-pommel iron dao, forged by repeated folding",
      "Crossbow volleys as the answer to steppe cavalry",
    ],
    inventions: [
      "Hemp paper, a century before Cai Lun refined it",
      "Chao steel — decarburised cast iron",
      "The state salt and iron monopolies",
    ],
    artefacts: [
      "The Mawangdui silk banners and medical manuscripts",
      "The jade burial suits of Liu Sheng and Dou Wan, sewn with gold wire",
    ],
  },
  {
    id: "xin",
    name: "Xin",
    chinese: "新",
    start: 9,
    end: 23,
    period: "qin-han",
    kind: "regime",
    track: "court",
    summary:
      "Wang Mang took the throne and tried to legislate an ancient golden age into existence — nationalising land, abolishing slavery, reissuing the currency five times in fourteen years.",
    weapons: ["Inherited Han crossbows and iron sabres"],
    inventions: [
      "A currency of 28 denominations, abandoned as unworkable",
      "Land nationalisation and the abolition of private slave sales",
    ],
    artefacts: [
      "The yidao pingwuqian knife-coin, its value inlaid in gold",
      "The bronze jialiang, a standard measure of five capacities in one vessel",
    ],
  },
  {
    id: "gengshi",
    name: "Gengshi",
    chinese: "更始",
    start: 23,
    end: 25,
    period: "qin-han",
    kind: "regime",
    track: "rival",
    summary:
      "Two years. A Han claimant raised by the rebel armies that destroyed Wang Mang, who held Chang'an just long enough to be killed by a different rebel army.",
    weapons: ["Inherited Han crossbows and halberds"],
    inventions: ["Restoration of the Han titles and offices as a claim to legitimacy"],
    artefacts: ["Gengshi-era wuzhu coinage"],
  },
  {
    id: "eastern-han",
    name: "Eastern Han",
    chinese: "东汉",
    start: 25,
    end: 220,
    period: "qin-han",
    kind: "regime",
    track: "court",
    capital: "Luoyang",
    summary:
      "The Han restored, and the most inventive stretch of the whole period: paper made to a repeatable recipe, water-powered bellows for iron, and an instrument that detected an earthquake 500 km away.",
    weapons: ["Heavy armoured cavalry", "The ring-pommel dao as the standard sidearm"],
    inventions: [
      "Cai Lun's paper-making process, 105",
      "Zhang Heng's seismoscope, 132, and his water-driven armillary sphere",
      "Du Shi's water-powered bellows for smelting iron",
      "The wheelbarrow",
    ],
    artefacts: [
      "The Xiping Stone Classics — the canon carved in stone to stop scribes altering it",
      "The Flying Horse of Gansu",
    ],
  },

  // ---------- The Three Kingdoms ----------
  {
    id: "three-kingdoms",
    name: "Three Kingdoms",
    chinese: "三国",
    start: 220,
    end: 280,
    period: "three-kingdoms",
    kind: "period",
    track: "court",
    summary:
      "Sixty years in which three courts each held part of China and each insisted it was the only legitimate one. The best-known period in Chinese history, largely because of a novel written 1,100 years later.",
    weapons: ["Repeating crossbows", "River fleets and siege towers"],
    inventions: ["The nine-rank civil service system", "The wooden ox transport cart"],
    artefacts: ["The Wuhou Shrine at Chengdu", "Romance of the Three Kingdoms, written in the Ming"],
  },
  {
    id: "cao-wei",
    name: "Cao Wei",
    chinese: "曹魏",
    start: 220,
    end: 266,
    period: "three-kingdoms",
    kind: "regime",
    track: "north",
    capital: "Luoyang",
    summary:
      "The northern claimant, holding the old Han heartland and the largest population. It took the Han throne by abdication rather than conquest — and lost its own the same way.",
    weapons: ["Siege engines and counterweight trebuchets", "Massed crossbow infantry"],
    inventions: [
      "Ma Jun's south-pointing chariot, which held a bearing by gearing alone",
      "The nine-rank system for appointing officials",
    ],
    artefacts: ["The Three-Script Stone Classics", "Ma Jun's redesigned silk loom"],
  },
  {
    id: "shu-han",
    name: "Shu Han",
    chinese: "蜀汉",
    start: 221,
    end: 263,
    period: "three-kingdoms",
    kind: "regime",
    track: "rival",
    capital: "Chengdu",
    summary:
      "The smallest of the three, sealed behind the Sichuan mountains, claiming the Han succession by blood. Zhuge Liang ran it, and his logistics are better remembered than his battles.",
    weapons: ["The Zhuge nu repeating crossbow, which fired ten bolts without reloading"],
    inventions: [
      "The wooden ox and gliding horse — single-wheeled transport carts for mountain supply lines",
    ],
    artefacts: ["The Chu Shi Biao memorial", "The Wuhou Shrine at Chengdu"],
  },
  {
    id: "eastern-wu",
    name: "Eastern Wu",
    chinese: "孙吴",
    start: 222,
    end: 280,
    period: "three-kingdoms",
    kind: "regime",
    track: "south",
    capital: "Jianye (Nanjing)",
    summary:
      "The southern kingdom, which held the Yangtze by out-sailing everyone. Wu ships reached Taiwan and mainland Southeast Asia, and its envoys got as far as Funan.",
    weapons: ["The louchuan tower ship, a floating fortress several decks high"],
    inventions: ["Ocean-going junk construction", "State-sponsored maritime exploration"],
    artefacts: ["Yue kiln celadon", "The record of Zhu Ying and Kang Tai's voyages"],
  },

  // ---------- Jin and the Sixteen Kingdoms ----------
  {
    id: "jin",
    name: "Jin",
    chinese: "晋",
    start: 266,
    end: 420,
    period: "jin",
    kind: "period",
    track: "court",
    summary:
      "Reunified China in 280 and lost the north within forty years. The rest of its span is a court in exile south of the Yangtze, calling itself the legitimate dynasty.",
    weapons: ["Armoured cavalry", "River defence fleets"],
    inventions: ["Pei Xiu's six principles of cartography"],
    artefacts: ["The Orchid Pavilion Preface", "The Admonitions Scroll"],
  },
  {
    id: "western-jin",
    name: "Western Jin",
    chinese: "西晋",
    start: 266,
    end: 316,
    period: "jin",
    kind: "regime",
    track: "court",
    capital: "Luoyang",
    summary:
      "The last unified rule for 270 years. It managed nine years of peace before its own princes tore it apart in the War of the Eight Princes, and the northern frontier came through the gap.",
    weapons: ["Heavy cavalry", "Crossbow infantry"],
    inventions: [
      "Pei Xiu's six principles of cartography — scale, orientation and elevation as map rules",
    ],
    artefacts: [
      "Pei Xiu's regional atlas",
      "Lu Ji's Pingfu Tie, the oldest surviving paper calligraphy by a named hand",
    ],
  },
  {
    id: "eastern-jin",
    name: "Eastern Jin",
    chinese: "东晋",
    start: 317,
    end: 420,
    period: "jin",
    kind: "regime",
    track: "south",
    capital: "Jiankang (Nanjing)",
    summary:
      "The court that fled south and stayed a century. Cut off from the old heartland, it produced the calligraphy and painting that later dynasties treated as the standard.",
    weapons: ["River fleets holding the Yangtze line", "The crossbow"],
    inventions: ["Ge Hong's alchemical and medical compendium", "Southern estate agriculture"],
    artefacts: [
      "Wang Xizhi's Orchid Pavilion Preface, 353 — the most copied text in Chinese calligraphy",
      "Gu Kaizhi's Admonitions Scroll",
    ],
  },
  {
    id: "sixteen-kingdoms",
    name: "Sixteen Kingdoms",
    chinese: "五胡十六国",
    start: 304,
    end: 439,
    period: "jin",
    kind: "regime",
    track: "north",
    summary:
      "Not sixteen and not really kingdoms — a churn of short-lived states across the north, founded mostly by frontier peoples. One of them left the single most consequential object on this page.",
    weapons: [
      "Cataphracts — horse and rider both fully armoured",
      "The composite bow shot from the saddle",
    ],
    inventions: [
      "The paired metal stirrup, which made a lance chargeable and a bow shootable at the gallop",
    ],
    artefacts: [
      "The gilt-bronze stirrups from Feng Sufu's tomb, c. 415 — among the earliest firmly dated anywhere",
      "The first cave shrines at Bingling and Maijishan",
    ],
  },

  // ---------- North against south ----------
  {
    id: "northern-southern",
    name: "Northern and Southern dynasties",
    chinese: "南北朝",
    start: 420,
    end: 589,
    period: "northern-southern",
    kind: "period",
    track: "court",
    summary:
      "A hundred and seventy years with no ruler of China at all — a northern line and a southern line, each with its own succession, each certain the other was illegitimate.",
    weapons: ["Cataphract cavalry in the north", "River fleets in the south"],
    inventions: ["The equal-field land system", "The fubing soldier-farmer militia"],
    artefacts: ["The Yungang and Longmen grottoes", "The Wenxuan anthology"],
  },
  {
    id: "northern-wei",
    name: "Northern Wei",
    chinese: "北魏",
    start: 386,
    end: 535,
    period: "northern-southern",
    kind: "regime",
    track: "north",
    capital: "Pingcheng, then Luoyang",
    summary:
      "Tuoba rulers from the steppe who took the whole north, then deliberately sinicised — moving the capital to Luoyang, banning their own language at court, and carving two of the greatest Buddhist cave complexes in the world.",
    weapons: ["Armoured cavalry", "The composite bow"],
    inventions: [
      "The equal-field system — land redistributed by household on a fixed schedule, copied by every dynasty down to the Tang",
    ],
    artefacts: [
      "The Yungang Grottoes at Datong — 51,000 carved figures",
      "The Longmen Grottoes at Luoyang",
    ],
  },
  {
    id: "liu-song",
    name: "Liu Song",
    chinese: "刘宋",
    start: 420,
    end: 479,
    period: "northern-southern",
    kind: "regime",
    track: "south",
    capital: "Jiankang (Nanjing)",
    summary:
      "The first of the four southern dynasties. Its court mathematician calculated π to seven decimal places — a precision nobody anywhere improved on for nearly a thousand years.",
    weapons: ["River warships", "The crossbow"],
    inventions: [
      "Zu Chongzhi's value of π, between 3.1415926 and 3.1415927",
      "The Daming calendar, which measured the year to within 50 seconds",
    ],
    artefacts: ["The Daming calendar", "A New Account of the Tales of the World"],
  },
  {
    id: "southern-qi",
    name: "Southern Qi",
    chinese: "南齐",
    start: 479,
    end: 502,
    period: "northern-southern",
    kind: "regime",
    track: "south",
    capital: "Jiankang (Nanjing)",
    summary:
      "Twenty-three years and seven emperors, most of whom killed their predecessor. Its lasting contribution is a set of rules for judging painting that Chinese critics used for the next 1,400 years.",
    weapons: ["River warships"],
    inventions: ["Xie He's Six Principles of Chinese painting"],
    artefacts: ["The stone qilin and bixie guarding the Qi tombs outside Nanjing"],
  },
  {
    id: "liang",
    name: "Liang",
    chinese: "南梁",
    start: 502,
    end: 557,
    period: "northern-southern",
    kind: "regime",
    track: "south",
    capital: "Jiankang (Nanjing)",
    summary:
      "The longest and richest of the southern courts. Emperor Wu reigned 47 years, converted to Buddhism, and gave himself to a monastery four times — his officials buying him back each time.",
    weapons: ["Armoured river fleets"],
    inventions: [
      "The Wenxuan — the anthology that fixed which literature counted",
      "State Buddhism as an instrument of rule",
    ],
    artefacts: ["The Wenxuan anthology", "The Xiao family tomb sculptures near Nanjing"],
  },
  {
    id: "eastern-wei",
    name: "Eastern Wei",
    chinese: "东魏",
    start: 534,
    end: 550,
    period: "northern-southern",
    kind: "regime",
    track: "north",
    capital: "Ye",
    summary:
      "One half of the Northern Wei after it split, run throughout by the general who installed its child emperor. Sixteen years, then his son dropped the pretence and took the throne.",
    weapons: ["Cataphract cavalry"],
    inventions: ["Continuation of the equal-field system under military governors"],
    artefacts: ["The first Xiangtangshan cave temples", "Eastern Wei Buddhist votive steles"],
  },
  {
    id: "western-wei",
    name: "Western Wei",
    chinese: "西魏",
    start: 535,
    end: 557,
    period: "northern-southern",
    kind: "regime",
    track: "north",
    capital: "Chang'an",
    summary:
      "The poorer half of the split, and the one that mattered. Short of manpower, it invented a militia of soldier-farmers — and that system, inherited by Sui and Tang, is what reunified China.",
    weapons: ["Armoured cavalry", "The fubing militia levy"],
    inventions: [
      "The fubing system — soldiers who farmed their own land and served in rotation, at almost no cost to the treasury",
    ],
    artefacts: ["The Western Wei niches at the Maijishan grottoes"],
  },
  {
    id: "northern-qi",
    name: "Northern Qi",
    chinese: "北齐",
    start: 550,
    end: 577,
    period: "northern-southern",
    kind: "regime",
    track: "north",
    capital: "Ye",
    summary:
      "Wealthy, militarily strong, and governed by a run of emperors so erratic that the histories struggle to describe them straight. Its legal code outlived it by a millennium.",
    weapons: ["Cataphract cavalry, the best in the north"],
    inventions: [
      "The Northern Qi code — the direct ancestor of the Tang code, and through it of Japanese, Korean and Vietnamese law",
    ],
    artefacts: [
      "The Xiangtangshan cave temples",
      "The tomb murals of Xu Xianxiu at Taiyuan",
    ],
  },
  {
    id: "northern-zhou",
    name: "Northern Zhou",
    chinese: "北周",
    start: 557,
    end: 581,
    period: "northern-southern",
    kind: "regime",
    track: "north",
    capital: "Chang'an",
    summary:
      "Took the Western Wei militia system, conquered Northern Qi with it, and united the whole north — then handed the throne to a regent whose new dynasty would take the south as well.",
    weapons: ["The fubing militia armies", "Heavy cavalry"],
    inventions: [
      "Expansion of the fubing system to Han as well as Xianbei households",
      "Mass secularisation of monastic land and labour",
    ],
    artefacts: ["The Northern Zhou caves at Dunhuang Mogao"],
  },
  {
    id: "chen",
    name: "Chen",
    chinese: "南陈",
    start: 557,
    end: 589,
    period: "northern-southern",
    kind: "regime",
    track: "south",
    capital: "Jiankang (Nanjing)",
    summary:
      "The last and weakest southern court, holding a Yangtze line it could no longer defend. Its fall in 589 ends the division — 273 years after it began.",
    weapons: ["River fleets on the Yangtze line"],
    inventions: ["A defensive river-chain and beacon system along the Yangtze"],
    artefacts: ["Chen-era Yue celadon", "The palace poetry of the Chen court"],
  },

  // ---------- Sui and Tang ----------
  {
    id: "sui",
    name: "Sui",
    chinese: "隋",
    start: 581,
    end: 619,
    period: "sui-tang",
    kind: "regime",
    track: "court",
    capital: "Daxing (Chang'an)",
    summary:
      "Thirty-eight years, and it reunified China, dug the Grand Canal, and invented the examination system. It also worked its population to exhaustion doing so, and fell to rebellion.",
    weapons: ["The fubing militia", "Enormous siege trains"],
    inventions: [
      "The keju imperial examinations — office by written exam rather than birth",
      "The Grand Canal, linking the Yellow and Yangtze river systems",
    ],
    artefacts: [
      "The Grand Canal, still navigable",
      "The Anji Bridge at Zhaozhou, c. 605 — the oldest open-spandrel segmental arch bridge in the world",
    ],
  },
  {
    id: "tang",
    name: "Tang",
    chinese: "唐",
    start: 618,
    end: 907,
    period: "sui-tang",
    kind: "regime",
    track: "court",
    capital: "Chang'an",
    summary:
      "The cosmopolitan peak — a capital of a million people with Sogdian merchants, Nestorian churches and Japanese students. It also produced the first written formula for gunpowder, in a text warning alchemists not to make it.",
    weapons: [
      "The modao, a two-handed sabre used by infantry against cavalry",
      "Lamellar armour and the repeating crossbow",
    ],
    inventions: [
      "Woodblock printing",
      "The first recorded gunpowder formula, in 9th-century alchemical texts",
      "Yi Xing's escapement-driven astronomical clock, 725",
    ],
    artefacts: [
      "The Diamond Sutra of 868 — the oldest dated printed book in existence",
      "The Mogao caves at Dunhuang",
      "Sancai three-colour glazed tomb figures",
    ],
  },
  {
    id: "wu-zhou",
    name: "Wu Zhou",
    chinese: "武周",
    start: 690,
    end: 705,
    period: "sui-tang",
    kind: "regime",
    track: "rival",
    capital: "Luoyang",
    summary:
      "Wu Zetian deposed her own son, declared a new dynasty, and ruled as the only woman to reign as emperor in her own right in Chinese history. Most timelines fold these fifteen years silently back into the Tang.",
    weapons: ["Tang-pattern militia armies"],
    inventions: [
      "The Zetian characters — around twenty new Chinese characters created by decree",
      "Examination recruitment widened to men without aristocratic backing",
    ],
    artefacts: [
      "The Vairocana Buddha at Longmen, commissioned by Wu Zetian and said to carry her face",
      "The Zetian characters, still found in inscriptions of the period",
    ],
  },

  // ---------- Five Dynasties, Liao and Song ----------
  {
    id: "five-dynasties",
    name: "Five Dynasties and Ten Kingdoms",
    chinese: "五代十国",
    start: 907,
    end: 960,
    period: "song-liao",
    kind: "regime",
    track: "court",
    summary:
      "Fifty-three years, five dynasties in the north and about ten kingdoms in the south, none lasting. The first picture of a gun anywhere in the world comes from this period.",
    weapons: [
      "The fire lance — a spear with a gunpowder tube lashed to it",
      "Gunpowder incendiaries",
    ],
    inventions: ["The fire lance", "Jiaozi — privately issued paper promissory notes in Sichuan"],
    artefacts: [
      "The Dunhuang silk banner of c. 950 showing a fire lance in use",
      "The Later Zhou printed Buddhist canon",
    ],
  },
  {
    id: "liao",
    name: "Liao",
    chinese: "辽",
    start: 916,
    end: 1125,
    period: "song-liao",
    kind: "regime",
    track: "steppe",
    capital: "Shangjing",
    summary:
      "The Khitan empire, holding the steppe and a slice of northern China for two centuries — longer than the Northern Song it is usually treated as a footnote to. It ran two governments at once, one for herders and one for farmers.",
    weapons: ["Mounted archery with the composite bow", "Lamellar cavalry armour"],
    inventions: [
      "The Khitan large and small scripts",
      "Dual administration — a steppe government and a Chinese one, under one emperor",
    ],
    artefacts: [
      "The Fogong Temple Pagoda at Yingxian, 1056 — the oldest and tallest fully wooden pagoda standing",
      "Khitan gold funerary masks",
    ],
  },
  {
    id: "western-liao",
    name: "Western Liao",
    chinese: "西辽",
    start: 1124,
    end: 1218,
    period: "song-liao",
    kind: "regime",
    track: "steppe",
    summary:
      "When the Liao fell, a prince rode west with his household and founded a second Khitan empire in Central Asia — known there as Qara Khitai. It outlived the original by ninety years.",
    weapons: ["Khitan mounted archery"],
    inventions: [
      "Religious tolerance as explicit state policy across a Buddhist, Muslim and Nestorian realm",
    ],
    artefacts: ["Qara Khitai coinage struck with both Chinese and Arabic legends"],
  },
  {
    id: "song",
    name: "Song",
    chinese: "宋",
    start: 960,
    end: 1279,
    period: "song-liao",
    kind: "period",
    track: "court",
    summary:
      "The most inventive dynasty on this page, and never once the sole ruler of China — it shared the map with the Liao, then the Jin, and with the Western Xia throughout.",
    weapons: ["Gunpowder bombs", "The fire lance", "Paddle-wheel warships"],
    inventions: ["Moveable type", "State paper money", "The navigational compass"],
    artefacts: ["Along the River During the Qingming Festival", "Ru and Longquan ware"],
  },
  {
    id: "northern-song",
    name: "Northern Song",
    chinese: "北宋",
    start: 960,
    end: 1127,
    period: "song-liao",
    kind: "regime",
    track: "court",
    capital: "Bianjing (Kaifeng)",
    summary:
      "Reunified the south, never took the north, and out-invented everyone. Moveable type, the first government paper currency, and a 10-metre astronomical clock driven by a water wheel with an escapement.",
    weapons: [
      "The bed crossbow, a siege weapon needing a crew to span it",
      "The zhentianlei thunder-crash bomb",
    ],
    inventions: [
      "Bi Sheng's moveable type, c. 1040 — four centuries before Gutenberg",
      "Jiaozi, the world's first government-issued paper money",
      "Su Song's astronomical clock tower, 1088",
      "Shen Kuo's description of magnetic declination — that the compass does not point true north",
    ],
    artefacts: [
      "Along the River During the Qingming Festival",
      "Su Song's Xinyi Xiangfayao, the clock tower's full technical treatise",
      "Ru ware — fewer than a hundred pieces survive",
    ],
  },
  {
    id: "western-xia",
    name: "Western Xia",
    chinese: "西夏",
    start: 1038,
    end: 1227,
    period: "song-liao",
    kind: "regime",
    track: "rival",
    capital: "Xingqing (Yinchuan)",
    summary:
      "The Tangut state that held the Silk Road corridor for two centuries. Its emperor commissioned an entire writing system from scratch — over 6,000 characters, designed to look Chinese and share nothing with it.",
    weapons: [
      "The Xia sword, traded and prized across Asia",
      "The 'Iron Sparrowhawk' heavy cavalry, riders chained to their saddles",
    ],
    inventions: [
      "The Tangut script, created by decree in 1036",
      "Wooden moveable type — the earliest surviving printed specimens anywhere",
    ],
    artefacts: [
      "The Tangut Tripitaka recovered from Khara-Khoto",
      "The Western Xia imperial tombs outside Yinchuan",
    ],
  },
  {
    id: "jin-jurchen",
    name: "Jin",
    chinese: "金",
    start: 1115,
    end: 1234,
    period: "song-liao",
    kind: "regime",
    track: "north",
    capital: "Zhongdu (Beijing)",
    summary:
      "The Jurchen state that destroyed the Liao, then took the Northern Song capital and half of China with it. For a century the Song paid it tribute to stay south of the Huai.",
    weapons: [
      "The guaizi ma — armoured cavalry riding in linked groups",
      "Gunpowder bombs and the flying-fire spear",
    ],
    inventions: [
      "The Jurchen script",
      "The meng'an-mouke system, organising households as permanent military units",
    ],
    artefacts: ["The walls of Jin Zhongdu, under modern Beijing", "Jurchen script steles"],
  },
  {
    id: "southern-song",
    name: "Southern Song",
    chinese: "南宋",
    start: 1127,
    end: 1279,
    period: "song-liao",
    kind: "regime",
    track: "court",
    capital: "Lin'an (Hangzhou)",
    summary:
      "The Song after it lost the north — smaller, richer, and the most maritime state China had yet produced. Its ships had watertight bulkheads and sternpost rudders, and its navy fought under sail with gunpowder.",
    weapons: [
      "Paddle-wheel warships worked by treadmill",
      "The thunder-crash bomb, an iron-cased explosive",
    ],
    inventions: [
      "Watertight bulkhead hull compartments",
      "The sternpost rudder",
      "Routine use of the magnetic compass at sea",
    ],
    artefacts: [
      "The Quanzhou ship — an ocean-going junk raised from the seabed in 1974",
      "Longquan celadon",
    ],
  },

  // ---------- The Mongol century ----------
  {
    id: "mongol-empire",
    name: "Mongol Empire",
    chinese: "统一大蒙古国",
    start: 1206,
    end: 1260,
    period: "mongol",
    kind: "regime",
    track: "steppe",
    summary:
      "From a confederation on the Mongolian plateau to the largest contiguous land empire ever assembled, in two generations. Its lasting administrative invention was a relay post system that could move a message 300 km a day.",
    weapons: [
      "The Mongol composite bow, outranging anything it met",
      "The counterweight trebuchet, adopted from Persian engineers",
      "Feigned retreat as doctrine rather than accident",
    ],
    inventions: [
      "The yam — a relay post network of stations across the whole empire",
      "The paiza, a metal tablet granting its bearer passage and supply",
    ],
    artefacts: ["Surviving paiza tablets of authority", "The Secret History of the Mongols"],
  },
  {
    id: "yuan",
    name: "Yuan",
    chinese: "元",
    start: 1271,
    end: 1368,
    period: "mongol",
    kind: "regime",
    track: "court",
    capital: "Dadu (Beijing)",
    summary:
      "Kublai Khan's Chinese dynasty. Its court astronomer calculated the year at 365.2425 days — the same figure the Gregorian calendar adopted three centuries later.",
    weapons: [
      "The bronze hand cannon — the Xanadu gun of 1298 is the oldest confirmed firearm anywhere",
      "The counterweight trebuchet",
    ],
    inventions: [
      "Guo Shoujing's Shoushi calendar, 1281, accurate to 26 seconds a year",
      "The 'Phags-pa script, designed to write every language in the empire",
    ],
    artefacts: [
      "The Xanadu gun",
      "Guo Shoujing's bronze astronomical instruments",
      "The first great blue-and-white porcelain",
    ],
  },

  // ---------- Ming and Qing ----------
  {
    id: "ming",
    name: "Ming",
    chinese: "明",
    start: 1368,
    end: 1644,
    period: "ming-qing",
    kind: "regime",
    track: "court",
    capital: "Nanjing, then Beijing",
    summary:
      "Drove the Mongols out, rebuilt the Great Wall in brick, and sent seven fleets into the Indian Ocean — then stopped, burned the records, and turned inward.",
    weapons: [
      "The fo-lang-ji breech-loading cannon, copied from the Portuguese",
      "Matchlock 'bird guns'",
      "The 'fire dragon out of the water' — a two-stage rocket",
    ],
    inventions: [
      "Multistage rocketry",
      "The Yongle Encyclopedia — 11,095 volumes, the largest before Wikipedia",
      "Zheng He's ocean navigation by star altitude and compass bearing",
    ],
    artefacts: [
      "The Forbidden City",
      "The brick Great Wall as it stands today",
      "Ming blue-and-white porcelain",
    ],
  },
  {
    id: "northern-yuan",
    name: "Northern Yuan",
    chinese: "北元",
    start: 1368,
    end: 1388,
    period: "ming-qing",
    kind: "regime",
    track: "steppe",
    summary:
      "The Yuan court did not fall in 1368 — it rode north and kept governing. For twenty years the Ming and a functioning Yuan chancellery existed at the same time, each denying the other.",
    weapons: ["Mongol mounted archery"],
    inventions: ["The Yuan chancellery and seal offices continued in exile"],
    artefacts: ["Northern Yuan imperial seals and 'Phags-pa documents"],
  },
  {
    id: "later-jin",
    name: "Later Jin",
    chinese: "后金",
    start: 1616,
    end: 1636,
    period: "ming-qing",
    kind: "regime",
    track: "north",
    capital: "Mukden (Shenyang)",
    summary:
      "Nurhaci unified the Jurchen tribes, named his state after the Jin that had beaten the Song, and organised every household into one of eight banners. Twenty years later it renamed itself Qing.",
    weapons: ["The Manchu composite bow", "The Eight Banners cavalry"],
    inventions: [
      "The Eight Banners — a system that was army, census and social order at once",
      "The Manchu script, adapted from Mongol",
    ],
    artefacts: ["The Mukden Palace at Shenyang", "The earliest Manchu-script state archives"],
  },
  {
    id: "southern-ming",
    name: "Southern Ming",
    chinese: "南明",
    start: 1644,
    end: 1662,
    period: "ming-qing",
    kind: "regime",
    track: "court",
    summary:
      "Beijing fell in 1644, but Ming claimants held out in the south for eighteen more years. Most timelines end the Ming at 1644 and skip this entirely.",
    weapons: ["Portuguese-cast bronze cannon", "Matchlock muskets"],
    inventions: [
      "A maritime resistance economy funded by the Zheng family's control of the China Sea trade",
    ],
    artefacts: [
      "Southern Ming reign-mark coinage",
      "The Yongli court's correspondence with the Jesuit mission",
    ],
  },
  {
    id: "qing",
    name: "Qing",
    chinese: "清",
    start: 1636,
    end: 1912,
    period: "ming-qing",
    kind: "regime",
    track: "north",
    capital: "Beijing",
    note: "Proclaimed at Mukden in 1636; took Beijing in 1644.",
    summary:
      "The last dynasty, and a Manchu one — a conquest elite ruling a Han majority for 276 years. It roughly doubled the territory of the Ming and ended with the empire itself abolished.",
    weapons: [
      "Eight Banners cavalry",
      "Cannon cast under Jesuit direction",
      "Imported Western rifles and steam warships in its final decades",
    ],
    inventions: [
      "The Kangxi Dictionary, 47,035 characters",
      "The Siku Quanshu — 36,000 volumes, and a censorship exercise as much as a library",
      "The Kangxi atlas, the first survey of China by triangulation",
    ],
    artefacts: ["The Summer Palace", "The Siku Quanshu", "Famille-rose porcelain"],
  },
];

// There is no year zero: 1 BC is followed by AD 1. This arithmetic treats 0 as
// a real year, so any duration crossing the epoch is one year long. On a
// deliberately compressed, non-proportional scale that is invisible — but it is
// a real inaccuracy and worth knowing about rather than discovering later.
export function formatYear(y: number, approx?: boolean): string {
  const prefix = approx ? "c. " : "";
  if (y < 0) return `${prefix}${-y} BC`;
  if (y < 1000) return `${prefix}AD ${y}`;
  return `${prefix}${y}`;
}

export function formatSpan(r: Regime): string {
  if (r.displaySpan) return r.displaySpan;
  const c = r.approx ? "c. " : "";
  if (r.start < 0 && r.end < 0) return `${c}${-r.start}–${-r.end} BC`;
  if (r.start < 0) return `${c}${-r.start} BC – AD ${r.end}`;
  if (r.start < 1000) return `${c}AD ${r.start}–${r.end}`;
  return `${c}${r.start}–${r.end}`;
}

export function periodOf(id: string): Period | undefined {
  return periods.find((p) => p.id === id);
}
