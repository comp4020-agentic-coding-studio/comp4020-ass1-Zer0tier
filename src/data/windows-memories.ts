export interface EraApplication {
  name: string;
  detail: string;
  kind: string;
  icon: string;
}

export interface EraMemory {
  handle: string;
  quote: string;
  context: string;
  sourceLabel: string;
  sourceUrl: string;
}

export interface EraDesignLanguage {
  palette: string[];
  typography: string;
  styling: string;
}

export interface WindowsMemoryScene {
  applications: EraApplication[];
  memories: EraMemory[];
  design: EraDesignLanguage;
}

export const windowsMemoryScenes: Record<string, WindowsMemoryScene> = {
  win1: {
    applications: [
      { name: "MS-DOS Executive", detail: "Browsed drives, opened files, and launched programs before File Manager existed.", kind: "File manager", icon: "media/app-icons/ms-dos-executive.png" },
      { name: "Paint", detail: "Created simple bitmap drawings with brushes, shapes, fills, and a mouse.", kind: "Drawing", icon: "media/app-icons/paint.png" },
      { name: "Write", detail: "A basic word processor for writing, formatting, and printing everyday documents.", kind: "Word processing", icon: "media/app-icons/write.png" },
      { name: "Reversi", detail: "A built-in strategy game that also helped new users practise using a mouse.", kind: "Game", icon: "media/app-icons/reversi.png" },
    ],
    memories: [
      { handle: "Bill Machrone · PC Magazine", quote: "Windows is an impressive product", context: "Overall first impression", sourceLabel: "PC Magazine · 20 Aug 1985", sourceUrl: "https://guidebookgallery.org/articles/drawingbackthecurtain" },
      { handle: "Bill Machrone · PC Magazine", quote: "It’s a sight to behold", context: "Seeing Windows in EGA colour", sourceLabel: "PC Magazine · 20 Aug 1985", sourceUrl: "https://guidebookgallery.org/articles/drawingbackthecurtain" },
      { handle: "Bill Machrone · PC Magazine", quote: "The applications are immature", context: "The review’s central caveat", sourceLabel: "PC Magazine · 20 Aug 1985", sourceUrl: "https://guidebookgallery.org/articles/drawingbackthecurtain" },
    ],
    design: { palette: ["#ffffff", "#000000", "#078a8e", "#c0c0c0"], typography: "System bitmap lettering and Courier-style monospace, compact and strictly functional.", styling: "Hard black rules, white panels, tiled geometry, one-pixel patterns, and absolutely no soft corners." },
  },
  win2: {
    applications: [
      { name: "Microsoft Excel 2.0", detail: "Built spreadsheets, calculated figures, and turned business data into charts.", kind: "Spreadsheet", icon: "media/app-icons/excel-2.png" },
      { name: "Microsoft Word 1.0", detail: "Produced formatted letters, reports, and documents in a graphical workspace.", kind: "Word processing", icon: "media/app-icons/word-1.png" },
      { name: "Aldus PageMaker", detail: "Laid out newsletters, brochures, and publications for desktop printing.", kind: "Desktop publishing", icon: "media/app-icons/aldus-pagemaker.svg" },
      { name: "Control Panel", detail: "Changed system colours, mouse behaviour, keyboard settings, and other preferences.", kind: "System utility", icon: "media/app-icons/control-panel.png" },
    ],
    memories: [
      { handle: "Namir Clement Shammas · BYTE", quote: "faster than the original Windows product", context: "Performance", sourceLabel: "BYTE · May 1988", sourceUrl: "https://www.worldradiohistory.com/Archive-Byte/80s/Byte-1988-05.pdf" },
      { handle: "Namir Clement Shammas · BYTE", quote: "easy and straightforward", context: "Installation", sourceLabel: "BYTE · May 1988", sourceUrl: "https://www.worldradiohistory.com/Archive-Byte/80s/Byte-1988-05.pdf" },
      { handle: "Namir Clement Shammas · BYTE", quote: "enhanced speed are the major points of interest", context: "Overall appeal", sourceLabel: "BYTE · May 1988", sourceUrl: "https://www.worldradiohistory.com/Archive-Byte/80s/Byte-1988-05.pdf" },
    ],
    design: { palette: ["#e7fbff", "#063f67", "#000000", "#ffffff"], typography: "Crisp bitmap system text with monospace file listings and underlined access keys.", styling: "Double rules, striped title bars, square controls, and visibly layered windows on a cool cyan desktop." },
  },
  win3: {
    applications: [
      { name: "Program Manager", detail: "Organised installed programs into icon groups and acted as the main launcher.", kind: "App launcher", icon: "media/app-icons/program-manager.png" },
      { name: "Microsoft Word 2.0", detail: "Created polished documents with scalable fonts and print-ready formatting.", kind: "Word processing", icon: "media/app-icons/word-2.png" },
      { name: "Microsoft Excel 4.0", detail: "Managed budgets, formulas, tables, and charts in a grid of cells.", kind: "Spreadsheet", icon: "media/app-icons/excel-4.png" },
      { name: "Solitaire", detail: "The bundled card game became a familiar break-time pastime—and mouse lesson.", kind: "Game", icon: "media/app-icons/solitaire.png" },
    ],
    memories: [
      { handle: "Clifton Karnes · COMPUTE!", quote: "Windows 3.1 is here, and it’s hot", context: "First impression", sourceLabel: "COMPUTE! · May 1992", sourceUrl: "https://www.atarimagazines.com/compute/issue140/6_Windows_31.php" },
      { handle: "Clifton Karnes · COMPUTE!", quote: "faster—a lot faster", context: "Performance", sourceLabel: "COMPUTE! · May 1992", sourceUrl: "https://www.atarimagazines.com/compute/issue140/6_Windows_31.php" },
      { handle: "Clifton Karnes · COMPUTE!", quote: "Get 3.1 as soon as you can", context: "Bottom line", sourceLabel: "COMPUTE! · May 1992", sourceUrl: "https://www.atarimagazines.com/compute/issue140/6_Windows_31.php" },
    ],
    design: { palette: ["#c0c0c0", "#000080", "#ffffff", "#3d6985"], typography: "MS Sans Serif-style bitmap text, with bold white captions on navy title bars.", styling: "Raised grey chrome, inset white work areas, navy active titles, tiny pixel icons, and dense program groups." },
  },
  win95: {
    applications: [
      { name: "Windows Explorer", detail: "Browsed files and folders through the new desktop-and-taskbar Windows shell.", kind: "File manager", icon: "media/app-icons/windows-explorer-95.png" },
      { name: "Microsoft Word 95", detail: "Handled schoolwork, letters, reports, and office documents with rich formatting.", kind: "Word processing", icon: "media/app-icons/word-95.png" },
      { name: "Netscape Navigator", detail: "Opened early websites, downloaded files, and introduced many homes to the web.", kind: "Web browser", icon: "media/app-icons/netscape-navigator.png" },
      { name: "DOOM", detail: "The landmark first-person shooter was a fixture of home PCs and office networks.", kind: "Game", icon: "media/app-icons/doom.png" },
    ],
    memories: [
      { handle: "Laurent Belsie · Christian Science Monitor", quote: "Windows 95 is a better and simpler operating system", context: "Overall verdict", sourceLabel: "Christian Science Monitor · 23 Aug 1995", sourceUrl: "https://www.csmonitor.com/1995/0823/23121.html" },
      { handle: "Laurent Belsie · Christian Science Monitor", quote: "it outperforms the Macintosh", context: "Contemporary comparison", sourceLabel: "Christian Science Monitor · 23 Aug 1995", sourceUrl: "https://www.csmonitor.com/1995/0823/23121.html" },
      { handle: "Laurent Belsie · Christian Science Monitor", quote: "I’ve run six programs including Paradox flawlessly", context: "Multitasking", sourceLabel: "Christian Science Monitor · 23 Aug 1995", sourceUrl: "https://www.csmonitor.com/1995/0823/23121.html" },
    ],
    design: { palette: ["#008080", "#c0c0c0", "#000080", "#ffffff"], typography: "MS Sans Serif and Arial, compact at system sizes with bold title-bar text.", styling: "Teal desktop, bevelled grey controls, navy active windows, pixel icons, and the taskbar as a permanent visual anchor." },
  },
  win98: {
    applications: [
      { name: "Internet Explorer 5", detail: "Browsed the growing web and tightly connected websites with Windows folders.", kind: "Web browser", icon: "media/app-icons/internet-explorer-5.png" },
      { name: "Winamp 2", detail: "Played MP3 collections, playlists, visualisations, and wildly customised player skins.", kind: "Music player", icon: "media/app-icons/winamp-2.png" },
      { name: "ICQ", detail: "Provided instant messaging, contact lists, status indicators, and the famous alert sound.", kind: "Instant messaging", icon: "media/app-icons/icq.png" },
      { name: "Adobe Photoshop 5.0", detail: "Edited photographs and graphics with layers, type, selections, and filters.", kind: "Image editing", icon: "media/app-icons/photoshop-5.png" },
    ],
    memories: [
      { handle: "Kristi Coale · WIRED", quote: "little more than a shrink-wrapped service pack", context: "Upgrade value", sourceLabel: "WIRED · 24 Jun 1998", sourceUrl: "https://www.wired.com/1998/06/win98-whats-the-fuss/" },
      { handle: "Chris LeTocq · Dataquest", quote: "Windows 98 equals Windows 95.1", context: "Analyst verdict reported by WIRED", sourceLabel: "WIRED · 24 Jun 1998", sourceUrl: "https://www.wired.com/1998/06/win98-whats-the-fuss/" },
      { handle: "Usenet users · reported by WIRED", quote: "worthy, but much less significant upgrade", context: "Early user reaction", sourceLabel: "WIRED · 24 Jun 1998", sourceUrl: "https://www.wired.com/1998/06/win98-whats-the-fuss/" },
    ],
    design: { palette: ["#d4d0c8", "#000080", "#008080", "#ffffff"], typography: "Tahoma and MS Sans Serif at tight sizes, with blue underlined web links everywhere.", styling: "Classic bevels meet browser toolbars, Quick Launch icons, busy status bars, and a desktop beginning to feel like the web." },
  },
  win2000: {
    applications: [
      { name: "Office 2000", detail: "Bundled Word, Excel, PowerPoint, and Outlook for everyday professional work.", kind: "Productivity suite", icon: "media/app-icons/office-2000.svg" },
      { name: "Visual Studio 6.0", detail: "Gave developers one environment for writing, building, and debugging Windows software.", kind: "Development", icon: "media/app-icons/visual-studio-6.png" },
      { name: "Winamp 2", detail: "Played local MP3 libraries in a compact, fast, and highly skinnable interface.", kind: "Music player", icon: "media/app-icons/winamp-2.png" },
      { name: "Napster", detail: "Searched for and shared MP3 files directly with other users over the internet.", kind: "File sharing", icon: "media/app-icons/napster.png" },
    ],
    memories: [
      { handle: "Pete Sherriff · The Register", quote: "not once has Win2K collapsed in a heap", context: "Stability", sourceLabel: "The Register · 24 Jan 2000", sourceUrl: "https://www.theregister.com/2000/01/24/win2k_pains_pete_sherriff/" },
      { handle: "Pete Sherriff · The Register", quote: "Win2K exudes that same industrial-strengthness", context: "Build quality", sourceLabel: "The Register · 24 Jan 2000", sourceUrl: "https://www.theregister.com/2000/01/24/win2k_pains_pete_sherriff/" },
      { handle: "Pete Sherriff · The Register", quote: "I really like Win2K", context: "Verdict", sourceLabel: "The Register · 24 Jan 2000", sourceUrl: "https://www.theregister.com/2000/01/24/win2k_pains_pete_sherriff/" },
    ],
    design: { palette: ["#d4d0c8", "#0a246a", "#a6caf0", "#ffffff"], typography: "Tahoma throughout: clearer and calmer than the bitmap-heavy consumer releases.", styling: "Restrained grey chrome, gradient blue captions, precise small icons, and tidy professional panes with minimal ornament." },
  },
  winxp: {
    applications: [
      { name: "MSN Messenger 6", detail: "Kept friends connected through chats, emoticons, display names, nudges, and status messages.", kind: "Instant messaging", icon: "media/app-icons/msn-messenger-6.png" },
      { name: "Internet Explorer 6", detail: "The default gateway to websites, webmail, downloads, and early online services.", kind: "Web browser", icon: "media/app-icons/internet-explorer-6.png" },
      { name: "Winamp 3", detail: "Organised and played digital music with playlists, visualisations, and downloadable skins.", kind: "Music player", icon: "media/app-icons/winamp-3.png" },
      { name: "Kazaa", detail: "Shared music, videos, and other files across a large peer-to-peer network.", kind: "File sharing", icon: "media/app-icons/kazaa.png" },
    ],
    memories: [
      { handle: "Finnie, Yegulalp, Randall & Methvin", quote: "Windows XP is the real deal", context: "Overall verdict", sourceLabel: "WIRED / Lycos · 11 May 2001", sourceUrl: "https://www.wired.com/2001/05/windows-xp-gets-high-marks/" },
      { handle: "Finnie, Yegulalp, Randall & Methvin", quote: "a lot less likely to crash", context: "Reliability", sourceLabel: "WIRED / Lycos · 11 May 2001", sourceUrl: "https://www.wired.com/2001/05/windows-xp-gets-high-marks/" },
      { handle: "Finnie, Yegulalp, Randall & Methvin", quote: "there’s a lot to sort out", context: "Complexity", sourceLabel: "WIRED / Lycos · 11 May 2001", sourceUrl: "https://www.wired.com/2001/05/windows-xp-gets-high-marks/" },
    ],
    design: { palette: ["#245edb", "#3c9d35", "#f4f0e6", "#ffffff"], typography: "Tahoma for controls and Franklin Gothic-like warmth in large friendly headings.", styling: "Glossy Luna blue title bars, rounded controls, saturated green Start button, cream surfaces, and soft drop shadows over Bliss." },
  },
  vista: {
    applications: [
      { name: "Windows Sidebar", detail: "Displayed always-visible clock, calendar, weather, photo, and news gadgets.", kind: "Desktop gadgets", icon: "media/app-icons/windows-sidebar.png" },
      { name: "Windows Media Player 11", detail: "Played and organised music and video in a glossy, library-focused interface.", kind: "Media player", icon: "media/app-icons/windows-media-player-11.png" },
      { name: "Microsoft Word 2007", detail: "Introduced the Ribbon while creating, formatting, reviewing, and printing documents.", kind: "Word processing", icon: "media/app-icons/word-2007.png" },
      { name: "Windows Live Messenger", detail: "Combined instant messaging with contacts, video calls, emoticons, and sharing.", kind: "Instant messaging", icon: "media/app-icons/windows-live-messenger.png" },
    ],
    memories: [
      { handle: "David Fearon · IT Pro", quote: "It’s by no means perfect", context: "Caveat", sourceLabel: "IT Pro · 18 Jan 2007", sourceUrl: "https://www.itpro.com/617155/microsoft-windows-vista-review" },
      { handle: "David Fearon · IT Pro", quote: "make Vista an obvious upgrade", context: "Overall verdict", sourceLabel: "IT Pro · 18 Jan 2007", sourceUrl: "https://www.itpro.com/617155/microsoft-windows-vista-review" },
      { handle: "David Fearon · IT Pro", quote: "currently a mixed bag", context: "Compatibility", sourceLabel: "IT Pro · 18 Jan 2007", sourceUrl: "https://www.itpro.com/617155/microsoft-windows-vista-review" },
    ],
    design: { palette: ["#102b46", "#6ec7e8", "#dff6ff", "#111820"], typography: "Segoe UI introduces more open spacing, softer forms, and clearer hierarchy.", styling: "Dark translucent Aero Glass, luminous cyan edges, glossy black media surfaces, live thumbnails, and layered depth." },
  },
  win7: {
    applications: [
      { name: "Google Chrome", detail: "Made tabbed web browsing feel fast, minimal, and closely connected to Google services.", kind: "Web browser", icon: "media/app-icons/google-chrome.png" },
      { name: "Skype", detail: "Handled free voice and video calls, chat, and screen sharing over the internet.", kind: "Calls and chat", icon: "media/app-icons/skype.png" },
      { name: "Spotify", detail: "Streamed a huge music catalogue and built playlists without managing MP3 files.", kind: "Music streaming", icon: "media/app-icons/spotify.svg" },
      { name: "Minecraft", detail: "Turned simple blocks into an enormous creative, survival, and multiplayer phenomenon.", kind: "Game", icon: "media/app-icons/minecraft.png" },
    ],
    memories: [
      { handle: "Harry McCracken · PCWorld", quote: "has a minimalist feel", context: "Interface", sourceLabel: "PCWorld · 19 Oct 2009", sourceUrl: "https://www.pcworld.com/article/519713/windows_7_review.html" },
      { handle: "Harry McCracken · PCWorld", quote: "attempts to fix annoyances old and new", context: "Refinement", sourceLabel: "PCWorld · 19 Oct 2009", sourceUrl: "https://www.pcworld.com/article/519713/windows_7_review.html" },
      { handle: "Harry McCracken · PCWorld", quote: "Windows 7 is hardly flawless", context: "Caveat", sourceLabel: "PCWorld · 19 Oct 2009", sourceUrl: "https://www.pcworld.com/article/519713/windows_7_review.html" },
    ],
    design: { palette: ["#dff5ff", "#4aa8d2", "#1c6c9f", "#ffffff"], typography: "Segoe UI in a clean, airy hierarchy with subtle text shadows on glass.", styling: "Bright Aero Glass, sky-blue highlights, soft white gradients, rounded seven-pixel corners, and a luminous Superbar." },
  },
  win8: {
    applications: [
      { name: "Windows Store", detail: "Downloaded touch-friendly apps and games through Microsoft’s central storefront.", kind: "App store", icon: "media/app-icons/windows-store.svg" },
      { name: "Skype for Windows 8", detail: "Brought video calls and messaging into a full-screen, touch-first interface.", kind: "Calls and chat", icon: "media/app-icons/skype.png" },
      { name: "Xbox Music", detail: "Streamed, purchased, and organised music through Microsoft’s entertainment service.", kind: "Music streaming", icon: "media/app-icons/xbox-music.png" },
      { name: "Netflix", detail: "Streamed television and films through a bold tile designed for touch screens.", kind: "Video streaming", icon: "media/app-icons/netflix.svg" },
    ],
    memories: [
      { handle: "Alexandra Chang · WIRED", quote: "most users won’t recognize it as Windows at all", context: "Radical redesign", sourceLabel: "WIRED · 25 Oct 2012", sourceUrl: "https://www.wired.com/2012/10/windows-8/" },
      { handle: "Alexandra Chang · WIRED", quote: "that’s a beautiful thing", context: "Verdict", sourceLabel: "WIRED · 25 Oct 2012", sourceUrl: "https://www.wired.com/2012/10/windows-8/" },
      { handle: "Alexandra Chang · WIRED", quote: "a colorful, touch-friendly suit of tiles", context: "Visual direction", sourceLabel: "WIRED · 25 Oct 2012", sourceUrl: "https://www.wired.com/2012/10/windows-8/" },
    ],
    design: { palette: ["#5c2d91", "#0078d7", "#00a3a3", "#ffffff"], typography: "Light Segoe UI at large scale, using type itself as navigation and structure.", styling: "Flat edge-to-edge colour, strict grids, oversized whitespace, crisp pictograms, and motion instead of dimensional chrome." },
  },
  win10: {
    applications: [
      { name: "Microsoft Edge", detail: "Replaced Internet Explorer with a modern browser integrated into Windows.", kind: "Web browser", icon: "media/app-icons/edge-2015.svg" },
      { name: "Office 365", detail: "Connected Word, Excel, PowerPoint, Outlook, and cloud documents through a subscription.", kind: "Productivity suite", icon: "media/app-icons/office-365.svg" },
      { name: "Spotify", detail: "Streamed music, podcasts, playlists, and recommendations in a dark desktop player.", kind: "Audio streaming", icon: "media/app-icons/spotify.svg" },
      { name: "Steam", detail: "Bought, downloaded, updated, and launched a large library of PC games.", kind: "Game library", icon: "media/app-icons/steam.png" },
    ],
    memories: [
      { handle: "David Pierce · WIRED", quote: "You should upgrade to Windows 10", context: "Recommendation", sourceLabel: "WIRED · 28 Jul 2015", sourceUrl: "https://www.wired.com/2015/07/windows-10-review/" },
      { handle: "David Pierce · WIRED", quote: "It’s a huge improvement", context: "Overall verdict", sourceLabel: "WIRED · 28 Jul 2015", sourceUrl: "https://www.wired.com/2015/07/windows-10-review/" },
      { handle: "David Pierce · WIRED", quote: "Not every bug is dead yet", context: "Caveat", sourceLabel: "WIRED · 28 Jul 2015", sourceUrl: "https://www.wired.com/2015/07/windows-10-review/" },
    ],
    design: { palette: ["#0e2438", "#0078d7", "#171f27", "#f2f2f2"], typography: "Segoe UI with flat, high-contrast labels and a compact information hierarchy.", styling: "Dark taskbar, sharp rectangular panes, blue accent blocks, restrained acrylic blur, and monochrome line icons." },
  },
  win11: {
    applications: [
      { name: "Microsoft Teams", detail: "Combines workplace chat, meetings, calls, channels, and collaborative files.", kind: "Work communication", icon: "media/app-icons/teams.svg" },
      { name: "Microsoft Edge", detail: "Browses the web with Chromium compatibility, profiles, collections, and Windows integration.", kind: "Web browser", icon: "media/app-icons/edge-2019.svg" },
      { name: "Xbox Game Pass", detail: "Downloads and launches a rotating subscription catalogue of PC games.", kind: "Game subscription", icon: "media/app-icons/xbox-game-pass.svg" },
      { name: "Adobe Creative Cloud", detail: "Installs and updates Photoshop, Illustrator, Premiere Pro, and other creative tools.", kind: "Creative suite", icon: "media/app-icons/creative-cloud.png" },
    ],
    memories: [
      { handle: "Mark Hachman · PCWorld", quote: "Windows 11 contains some good ideas", context: "Potential", sourceLabel: "PCWorld · 4 Oct 2021", sourceUrl: "https://www.pcworld.com/article/539183/windows-11-review-an-unnecessary-replacement-for-windows-10.html" },
      { handle: "Mark Hachman · PCWorld", quote: "Fresh new look", context: "Design", sourceLabel: "PCWorld · 4 Oct 2021", sourceUrl: "https://www.pcworld.com/article/539183/windows-11-review-an-unnecessary-replacement-for-windows-10.html" },
      { handle: "Mark Hachman · PCWorld", quote: "A decidedly mixed bag", context: "Verdict", sourceLabel: "PCWorld · 4 Oct 2021", sourceUrl: "https://www.pcworld.com/article/539183/windows-11-review-an-unnecessary-replacement-for-windows-10.html" },
    ],
    design: { palette: ["#eaf3fb", "#b9dffc", "#f3d9e8", "#086fc1"], typography: "Segoe UI Variable with relaxed spacing, clear weights, and comfortable modern proportions.", styling: "Soft Mica materials, generous rounded corners, centred composition, pastel wallpaper colour, and quiet layered shadows." },
  },
};

export function getWindowsMemoryScene(id: string) {
  return windowsMemoryScenes[id];
}
