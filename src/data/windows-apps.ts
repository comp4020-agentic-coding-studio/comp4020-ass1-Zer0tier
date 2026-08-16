// Why each app in "The apps everyone knew" spread on Windows in its period.
//
// The point of these pages is not app trivia. Every one of them answers the
// same question the rest of the site asks: what had the public learned by the
// time the next redesign arrived? An app that millions of people learned is a
// habit the next interface either kept or broke, which is why each entry ends
// with `relearn` rather than a feature list.
//
// Rule from CLAUDE.md: real information about real products is cited, never
// invented to look right. Each entry carries one reference a reader can check,
// and the mechanism of adoption is described rather than dressed up with
// numbers I cannot stand behind.

export interface AppStory {
  /** WindowsRelease.id this story belongs to. */
  release: string;
  /** Slug of the application name, matching MemoryScene's appSlug(). */
  slug: string;
  /** How it reached people on Windows in this period. */
  why: string;
  /** The habit it left behind — what a later redesign had to keep or break. */
  relearn: string;
  source: { label: string; url: string };
}

const wiki = (title: string) => `https://en.wikipedia.org/wiki/${title}`;

export const appStories: AppStory[] = [
  // Windows 1.0 — 1985
  {
    release: "win1",
    slug: "ms-dos-executive",
    why: "It was the only way in. Windows 1.0 shipped with no program list and no launcher, so MS-DOS Executive — a plain listing of the files on a disk — was where every session began. Its reach was total because it had no competition on the system.",
    relearn: "It taught a generation that starting a program meant knowing its filename. Program Manager and then the Start menu spent the next decade undoing that.",
    source: { label: "MS-DOS Executive", url: wiki("MS-DOS_Executive") },
  },
  {
    release: "win1",
    slug: "paint",
    why: "Bundled, free, and the first drawing program most PC owners ever opened. Its real job was to justify the mouse: a machine that had only ever been driven by keys needed something that made pointing feel obviously better than typing.",
    relearn: "Click, drag, release. Paint is where a huge number of people first learned the gesture every later Windows depends on.",
    source: { label: "Microsoft Paint", url: wiki("Microsoft_Paint") },
  },
  {
    release: "win1",
    slug: "write",
    why: "A word processor in the box at a time when word processors were the reason to buy a computer and cost real money. Being adequate and free put it in front of people who would not have bought WordStar or WordPerfect.",
    relearn: "It established that formatted text on screen should resemble the printed page — the expectation Word inherited and never gave back.",
    source: { label: "Windows Write", url: wiki("Windows_Write") },
  },
  {
    release: "win1",
    slug: "reversi",
    why: "The bundled game, and a deliberate one. Reversi is played entirely by pointing at squares, which made it a mouse tutorial disguised as entertainment for buyers who had never used one.",
    relearn: "Microsoft learned here that a game teaches an input device better than a manual does — the tactic it repeated with Solitaire and Minesweeper.",
    source: { label: "Microsoft Reversi", url: wiki("Microsoft_Reversi") },
  },

  // Windows 2.0 — 1987
  {
    release: "win2",
    slug: "microsoft-excel-2-0",
    why: "Excel 2.0 was the first version for Windows, and it arrived bundled with a runtime copy of Windows itself — buying the spreadsheet got you the operating environment. For many businesses Excel was the reason Windows was installed at all.",
    relearn: "The grid, the formula bar and the cell reference became office literacy. Every later Windows had to keep them exactly where they were.",
    source: { label: "Microsoft Excel", url: wiki("Microsoft_Excel") },
  },
  {
    release: "win2",
    slug: "microsoft-word-1-0",
    why: "Word for Windows put Microsoft's word processor into a graphical window while its rivals were still character-mode DOS applications. It spread on the strength of showing fonts and layout on screen rather than describing them in codes.",
    relearn: "It made the toolbar and the menu bar the standard furniture of a document, which is why every application since has felt obliged to have both.",
    source: { label: "Microsoft Word", url: wiki("Microsoft_Word") },
  },
  {
    release: "win2",
    slug: "aldus-pagemaker",
    why: "PageMaker created desktop publishing on the Mac and its Windows version brought that work to far cheaper hardware. Small businesses could set a newsletter without a typesetter, which was a genuinely new capability rather than a faster old one.",
    relearn: "Overlapping windows stopped being a novelty here: laying out a page needs several things visible at once, which is precisely what Windows 2.0 had just added.",
    source: { label: "Adobe PageMaker", url: wiki("Adobe_PageMaker") },
  },
  {
    release: "win2",
    slug: "control-panel",
    why: "The first single place where the machine's own settings lived. Before it, changing the mouse, the colours or the keyboard meant editing configuration files, and putting them behind icons made the system adjustable by people who would never open a text editor.",
    relearn: "It set the expectation that settings are a place you go to, not a file you edit — an idea Windows has since rebuilt three times and still has not finished.",
    source: { label: "Control Panel (Windows)", url: wiki("Control_Panel_(Windows)") },
  },

  // Windows 3.1 — 1992
  {
    release: "win3",
    slug: "program-manager",
    why: "Program Manager replaced the file list with groups of icons, and because every installer added its own group, it became the map of what the machine could do. It spread by being unavoidable: it was the shell itself.",
    relearn: "Programs live in named groups you open first. Windows 95 threw the whole model away three years later, and the muscle memory with it.",
    source: { label: "Program Manager", url: wiki("Program_Manager") },
  },
  {
    release: "win3",
    slug: "microsoft-word-2-0",
    why: "Windows 3.1 added TrueType, which meant scalable fonts that printed as they appeared. Word 2.0 arrived to use them, and the combination made a PC a credible replacement for a typewriter and a print shop at once.",
    relearn: "What you see is what you get stopped being a slogan and became an expectation people would complain about when it was not met.",
    source: { label: "Microsoft Word", url: wiki("Microsoft_Word") },
  },
  {
    release: "win3",
    slug: "microsoft-excel-4-0",
    why: "By this point Excel had overtaken Lotus 1-2-3, the DOS spreadsheet that had defined business computing. Running natively in Windows while its rival was still adapting is a large part of why.",
    relearn: "Copying a chart out of a spreadsheet and into a document taught the clipboard to millions — a system-wide habit rather than an application one.",
    source: { label: "Microsoft Excel", url: wiki("Microsoft_Excel") },
  },
  {
    release: "win3",
    slug: "solitaire",
    why: "Bundled since Windows 3.0 and, by most accounts, the most-used program Microsoft ever shipped. It was included to teach the mouse: dragging a card onto a stack is drag-and-drop with a reward attached.",
    relearn: "Drag-and-drop went from an unfamiliar idea to something people did without thinking, which every later Windows quietly relies on.",
    source: { label: "Microsoft Solitaire", url: wiki("Microsoft_Solitaire") },
  },

  // Windows 95 — 1995
  {
    release: "win95",
    slug: "windows-explorer",
    why: "Explorer replaced both Program Manager and File Manager with one idea: everything is a file in a folder, including your programs. It reached everyone because it was the desktop, the taskbar and the file browser at the same time.",
    relearn: "Folders, the tree on the left, and the right-click menu — this is the single largest relearning event in the whole story, and the layout still survives.",
    source: { label: "File Explorer", url: wiki("File_Explorer") },
  },
  {
    release: "win95",
    slug: "microsoft-word-95",
    why: "Word arrived as part of Office rather than as a product you chose, and corporate site licences put the same application on every desk in a building. Its file format then became the way documents were exchanged, which made not having it expensive.",
    relearn: "The .doc file turned a preference into an obligation: you learned Word because everyone you worked with already had.",
    source: { label: "Microsoft Word", url: wiki("Microsoft_Word") },
  },
  {
    release: "win95",
    slug: "netscape-navigator",
    why: "Windows 95 shipped as the web was becoming a consumer thing, and Navigator was how most people saw it. It spread by being free for personal use and by being the browser the early web was built and tested against.",
    relearn: "Back, forward, reload and the address bar became universal controls, learned once and expected everywhere afterwards.",
    source: { label: "Netscape Navigator", url: wiki("Netscape_Navigator") },
  },
  {
    release: "win95",
    slug: "doom",
    why: "Doom was a DOS game, and that was the problem: serious games bypassed Windows entirely because it was too slow for them. Microsoft's answer was DirectX and a Windows 95 port of Doom, demonstrated by Bill Gates himself, to prove that games belonged on Windows rather than under it.",
    relearn: "It moved gaming from booting into DOS to running inside Windows, which is why the PC is a games machine at all today.",
    source: { label: "Doom (1993 video game)", url: wiki("Doom_(1993_video_game)") },
  },

  // Windows 98 — 1998
  {
    release: "win98",
    slug: "internet-explorer-5",
    why: "Internet Explorer was integrated into Windows rather than installed onto it, and the browser and the file manager became the same program. That bundling took the browser market from Netscape and became the centre of the United States antitrust case against Microsoft.",
    relearn: "The web stopped being a place you launched an application to visit and became part of the operating system's own furniture.",
    source: { label: "Internet Explorer 5", url: wiki("Internet_Explorer_5") },
  },
  {
    release: "win98",
    slug: "winamp-2",
    why: "MP3 files were suddenly everywhere and Windows had no good way to play them. Winamp was small, fast, free and endlessly skinnable, and it spread the way software spread before app stores: by being passed around.",
    relearn: "The playlist. Managing your own library of files, rather than a shelf of discs, is a habit that outlived every player that taught it.",
    source: { label: "Winamp", url: wiki("Winamp") },
  },
  {
    release: "win98",
    slug: "icq",
    why: "ICQ made real-time messaging between strangers ordinary, and its growth was pure network effect: the numbered user ID was something you gave out, so every user recruited the next. Home internet on Windows 98 gave it the audience.",
    relearn: "The contact list, the online-status dot and the notification sound — an entire grammar of presence that every messenger since has copied.",
    source: { label: "ICQ", url: wiki("ICQ") },
  },
  {
    release: "win98",
    slug: "adobe-photoshop-5-0",
    why: "Photoshop was the professional standard, and its Windows version meant studios no longer had to buy Macs to do serious image work. Cheaper PC hardware, not the software, is what widened its reach.",
    relearn: "Layers, the history palette and the toolbox became a vocabulary so entrenched that the product's name is now a verb.",
    source: { label: "Adobe Photoshop", url: wiki("Adobe_Photoshop") },
  },

  // Windows 2000 — 2000
  {
    release: "win2000",
    slug: "office-2000",
    why: "Office 2000 was bought in bulk by organisations rather than by people, and Windows 2000 was the desktop it was deployed onto. Its reach came from procurement decisions, which is a very effective distribution channel.",
    relearn: "It introduced menus that hid the commands you rarely used — an attempt to reduce what people had to learn that mostly taught them their software was hiding things.",
    source: { label: "Microsoft Office 2000", url: wiki("Microsoft_Office_2000") },
  },
  {
    release: "win2000",
    slug: "visual-studio-6-0",
    why: "The software everyone else's software was made with. Visual Basic 6 in particular let people who were not professional programmers produce Windows applications, and a great deal of the business software of the era was built in it.",
    relearn: "It standardised what a Windows application looks like, because the default controls were the fastest thing to reach for.",
    source: { label: "Microsoft Visual Studio", url: wiki("Microsoft_Visual_Studio") },
  },
  {
    release: "win2000",
    slug: "winamp-2",
    why: "Still Winamp 2, years after release, because version 3 had not landed well and version 2 was already exactly what people wanted. It survived on reputation and on the enormous ecosystem of skins and plug-ins around it.",
    relearn: "That a small, fast, replaceable tool can beat the bundled one — a lesson Windows Media Player spent years failing to overturn.",
    source: { label: "Winamp", url: wiki("Winamp") },
  },
  {
    release: "win2000",
    slug: "napster",
    why: "Napster turned the MP3 collection into a shared one, and its growth on Windows was explosive enough to become a legal emergency. It was shut down by court order in 2001, having permanently changed what people expected access to music to cost.",
    relearn: "Search, then have it immediately. Every legal service that followed had to match a convenience that an illegal one had established.",
    source: { label: "Napster", url: wiki("Napster") },
  },

  // Windows XP — 2001
  {
    release: "winxp",
    slug: "msn-messenger-6",
    why: "MSN Messenger came with the Microsoft account people already had for Hotmail, so signing up was something most Windows users had accidentally already done. Emoticons, nudges and custom display names made it feel like a place rather than a tool.",
    relearn: "Status messages taught people to broadcast a mood to a list of contacts — the habit that social networks were built on next.",
    source: { label: "MSN Messenger", url: wiki("MSN_Messenger") },
  },
  {
    release: "winxp",
    slug: "internet-explorer-6",
    why: "IE6 shipped inside Windows XP, and because XP stayed on desks for over a decade, so did IE6 long after it was obsolete. Its dominance became a problem for the web itself, with sites built to its quirks rather than to standards.",
    relearn: "It is the clearest case in the story of the cost of not relearning: a browser people kept using because it was already there.",
    source: { label: "Internet Explorer 6", url: wiki("Internet_Explorer_6") },
  },
  {
    release: "winxp",
    slug: "winamp-3",
    why: "A rewrite that arrived slower and less compatible than the version it replaced, and users largely refused it — Winamp 5 was in effect an apology that merged the two. It is here because its failure is instructive, not because it won.",
    relearn: "People will decline a redesign if the old one still works. Windows itself ran the same experiment with Windows 8 ten years later.",
    source: { label: "Winamp", url: wiki("Winamp") },
  },
  {
    release: "winxp",
    slug: "kazaa",
    why: "After Napster was closed, Kazaa took its audience with a decentralised network that was much harder to shut down. It spread on XP at the moment home broadband made large downloads practical, and it was notorious for the adware bundled with it.",
    relearn: "It taught a generation to be careful what an installer includes — arguably the first widespread lesson in consumer software security.",
    source: { label: "Kazaa", url: wiki("Kazaa") },
  },

  // Windows Vista — 2007
  {
    release: "vista",
    slug: "windows-sidebar",
    why: "Vista put a permanent strip of small widgets — clock, calendar, weather, photos — down the side of the desktop. It reached everyone because it was on by default, which is the only distribution a bundled feature needs.",
    relearn: "The glanceable widget, later removed for security reasons and then reintroduced in Windows 11 as a panel you open instead.",
    source: { label: "Windows Desktop Gadgets", url: wiki("Windows_Desktop_Gadgets") },
  },
  {
    release: "vista",
    slug: "windows-media-player-11",
    why: "The bundled player rebuilt around a library rather than a file list, arriving as people had far more music on disk than they could browse. Being pre-installed made it the default for anyone who did not go looking for an alternative.",
    relearn: "Media as a searchable library with artwork, which is the model every streaming service inherited.",
    source: { label: "Windows Media Player", url: wiki("Windows_Media_Player") },
  },
  {
    release: "vista",
    slug: "microsoft-word-2007",
    why: "Office 2007 replaced menus and toolbars with the Ribbon — the largest deliberate relearning Microsoft has ever asked of office workers. It spread because Office was not optional, so the relearning was not optional either.",
    relearn: "This is the whole argument of this site in one product: a redesign that was probably right, imposed on an audience that had no way to decline it.",
    source: { label: "Microsoft Office 2007", url: wiki("Microsoft_Office_2007") },
  },
  {
    release: "vista",
    slug: "windows-live-messenger",
    why: "The rebranded MSN Messenger, tied into the Windows Live services Microsoft was pushing at the time. Its reach was inherited rather than earned: the contact lists already existed.",
    relearn: "That your contacts, not the software, are what you are actually attached to — which is why the eventual move to Skype was so unpopular.",
    source: { label: "Windows Live Messenger", url: wiki("Windows_Live_Messenger") },
  },

  // Windows 7 — 2009
  {
    release: "win7",
    slug: "google-chrome",
    why: "Chrome was faster than what people had and, crucially, was advertised on the most-visited page on the web. It also updated itself silently, which removed the step where users decide whether to accept a new version.",
    relearn: "One box for both search and addresses collapsed two things people had learned separately into one — and made the browser, not Windows, the thing most people actually use.",
    source: { label: "Google Chrome", url: wiki("Google_Chrome") },
  },
  {
    release: "win7",
    slug: "skype",
    why: "Skype made long-distance calls effectively free at a time when they were not, which is a strong enough reason that people installed it for one specific relative. Microsoft bought it in 2011 and later put it in Windows itself.",
    relearn: "The video call went from a novelty to something you would ask a parent to learn.",
    source: { label: "Skype", url: wiki("Skype") },
  },
  {
    release: "win7",
    slug: "spotify",
    why: "Spotify offered a free, legal, instant catalogue — the thing Napster and Kazaa had proved people wanted, arriving with the licences to do it. On Windows it was a desktop application first, before the web and phone became the usual way in.",
    relearn: "Owning files stopped being the point. The library people had spent a decade organising quietly became irrelevant.",
    source: { label: "Spotify", url: wiki("Spotify") },
  },
  {
    release: "win7",
    slug: "minecraft",
    why: "Sold directly from a website, in an unfinished state, to players who told each other about it — no publisher and no retail. It ran on the Java that was already on most Windows machines, so almost any PC could play it.",
    relearn: "It taught a very young audience that a computer is something you build things with, on Windows, without anyone's permission.",
    source: { label: "Minecraft", url: wiki("Minecraft") },
  },

  // Windows 8 — 2012
  {
    release: "win8",
    slug: "windows-store",
    why: "Windows 8 introduced a single official place to get applications, following the model phones had already normalised. Its reach was structural: for the new full-screen apps, it was the only way to install anything.",
    relearn: "Installing software stopped meaning downloading an .exe from a website — a thirty-year habit that Windows tried to end in one release.",
    source: { label: "Microsoft Store", url: wiki("Microsoft_Store_(digital)") },
  },
  {
    release: "win8",
    slug: "skype-for-windows-8",
    why: "Microsoft had bought Skype the year before and rebuilt it as a full-screen touch application to populate the new Start screen. It arrived by corporate decision rather than by demand.",
    relearn: "The same product in two incompatible shapes at once taught people that the name on the icon no longer told you what you would get.",
    source: { label: "Skype", url: wiki("Skype") },
  },
  {
    release: "win8",
    slug: "xbox-music",
    why: "The rebranded Zune music service, bundled with Windows 8 and attached to the Xbox name in an attempt to borrow its recognition. It was later renamed again to Groove, then largely folded into Spotify.",
    relearn: "Three names for one service in five years — the clearest small example of change that asked for relearning and offered nothing back.",
    source: { label: "Groove Music", url: wiki("Groove_Music") },
  },
  {
    release: "win8",
    slug: "netflix",
    why: "One of the few genuinely popular applications in the new Store, because full-screen and touch-first actually suited watching video. Netflix's own shift from posting discs to streaming is what put it on the desktop at all.",
    relearn: "It normalised the idea that a Windows application could be a thin window onto a service that lives somewhere else.",
    source: { label: "Netflix", url: wiki("Netflix") },
  },

  // Windows 10 — 2015
  {
    release: "win10",
    slug: "microsoft-edge",
    why: "The replacement for Internet Explorer, made the default in Windows 10 and pushed hard. It struggled anyway: by 2015 people had already chosen a browser, and defaults are much weaker than they were in the IE6 era.",
    relearn: "Being pre-installed had stopped being enough — the lesson Microsoft learned expensively and then acted on in 2020.",
    source: { label: "Microsoft Edge", url: wiki("Microsoft_Edge") },
  },
  {
    release: "win10",
    slug: "office-365",
    why: "Office stopped being a box you bought once and became a subscription that updated itself. That removed the moment where an organisation decides whether to upgrade, which is also the moment it decides whether to retrain anyone.",
    relearn: "Continuous change with no version number: the interface can now move underneath you without any release to blame.",
    source: { label: "Microsoft 365", url: wiki("Microsoft_365") },
  },
  {
    release: "win10",
    slug: "spotify",
    why: "By Windows 10 Spotify was the default way most people listened to anything, and it arrived in the Store as well as from its own site. Its Windows presence was by then a companion to the phone rather than the main event.",
    relearn: "The desktop had become the second screen for something a phone started — a reversal of every era before it.",
    source: { label: "Spotify", url: wiki("Spotify") },
  },
  {
    release: "win10",
    slug: "steam",
    why: "Steam had spent a decade becoming the place PC games are bought, and Windows 10's DirectX 12 kept the platform the one games target. Its hold is a network effect: your library, your friends and your saves are already there.",
    relearn: "It quietly took over the job Windows used to do — installing, updating and launching programs — for an entire category of software.",
    source: { label: "Steam (service)", url: wiki("Steam_(service)") },
  },

  // Windows 11 — 2021
  {
    release: "win11",
    slug: "microsoft-teams",
    why: "Windows 11 shipped with Teams Chat built into the taskbar, arriving in the middle of a pandemic that had already made video meetings compulsory for office work. Reach came from employers, not from users choosing it.",
    relearn: "Where the meeting lives moved again — and this time the software was chosen by someone other than the person who had to learn it.",
    source: { label: "Microsoft Teams", url: wiki("Microsoft_Teams") },
  },
  {
    release: "win11",
    slug: "microsoft-edge",
    why: "The same name, an entirely different browser: Edge was rebuilt on Chromium in 2020, meaning Microsoft gave up on its own web engine and adopted its competitor's. It runs the sites people already used, which the first Edge often did not.",
    relearn: "Two products, one name, six years apart — the icon stayed put while everything behind it was replaced.",
    source: { label: "Microsoft Edge", url: wiki("Microsoft_Edge") },
  },
  {
    release: "win11",
    slug: "xbox-game-pass",
    why: "A subscription that puts a rotating library of games on a Windows PC for a monthly fee, bundled into the Xbox app that ships with Windows 11. It is Microsoft using Windows to distribute a service rather than selling Windows itself.",
    relearn: "Games became something you have access to rather than something you own, matching what had already happened to music and film.",
    source: { label: "Xbox Game Pass", url: wiki("Xbox_Game_Pass") },
  },
  {
    release: "win11",
    slug: "adobe-creative-cloud",
    why: "Adobe moved its entire professional range to subscription in 2013, and by Windows 11 there was no way to buy Photoshop outright. Creative work on Windows now arrives through a manager application that keeps everything current.",
    relearn: "The tools update themselves on Adobe's schedule, so professionals relearn their own software continuously rather than at a version they chose.",
    source: { label: "Adobe Creative Cloud", url: wiki("Adobe_Creative_Cloud") },
  },
];

export function getAppStory(release: string, slug: string) {
  const story = appStories.find((item) => item.release === release && item.slug === slug);
  if (!story) throw new Error(`no app story for ${release}/${slug}`);
  return story;
}

export function getAppStoriesFor(release: string) {
  return appStories.filter((item) => item.release === release);
}
