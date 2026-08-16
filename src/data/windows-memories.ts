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
      { handle: "office-pc · 1985", quote: "I keep reaching for commands, then remember I can point at the menu with the mouse.", context: "Learning a graphical layer above DOS" },
      { handle: "home-user · 1986", quote: "The windows cannot overlap, but at least I can see Write and the clock at the same time.", context: "Discovering tiled multitasking" },
      { handle: "new-mouse-owner · 1986", quote: "Reversi is honestly the best practice I have found for getting used to this mouse thing.", context: "A game doubling as mouse training" },
      { handle: "8088-owner · 1985", quote: "It feels futuristic right up until the floppy drive starts grinding again.", context: "Life on early PC hardware" },
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
      { handle: "spreadsheet-user · 1988", quote: "Overlapping Excel and Word finally makes the screen feel like a real desk instead of a set of boxes.", context: "The arrival of overlapping windows" },
      { handle: "desktop-publisher · 1988", quote: "PageMaker on a PC still feels like having a print shop squeezed into the corner of my office.", context: "Early desktop publishing" },
      { handle: "keyboard-loyalist · 1989", quote: "The mouse is useful, but I still know every menu shortcut faster than I can point to it.", context: "Old habits meeting graphical controls" },
      { handle: "286-owner · 1988", quote: "Moving one window over another is impressive. Waiting for it to redraw is less impressive.", context: "Graphics meeting modest hardware" },
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
      { handle: "family-386 · 1992", quote: "Program Manager groups make sense until everyone in the family installs their own collection of icons.", context: "A shared family PC" },
      { handle: "student · 1993", quote: "TrueType fonts mean my essay finally looks on paper the way it looked in Word.", context: "Desktop publishing reaches home" },
      { handle: "office-worker · 1992", quote: "I opened Solitaire during lunch and somehow the cards have become the most familiar part of Windows.", context: "The universal break-time game" },
      { handle: "modem-owner · 1994", quote: "Getting online took an evening of settings, but seeing a page arrive from somewhere else was magic.", context: "The pre-web setup ritual" },
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
      { handle: "midnight-launch · 1995", quote: "The Start button sounds obvious now, but the first time I saw it I finally knew where everything was supposed to begin.", context: "Meeting the Start menu" },
      { handle: "plug-and-pray · 1996", quote: "Windows found my new sound card automatically—then asked for a driver disk I definitely cannot find.", context: "The reality of Plug and Play" },
      { handle: "doom-player · 1995", quote: "My homework is in Word and DOOM is one taskbar button away. This feels dangerously efficient.", context: "The taskbar changes multitasking" },
      { handle: "first-time-online · 1996", quote: "The modem screeches, Netscape opens, and suddenly the computer is connected to more than our printer.", context: "The consumer internet arrives" },
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
      { handle: "dialup-kid · 1998", quote: "Mum picked up the phone again and my download stopped at ninety-seven percent.", context: "One phone line, one connection" },
      { handle: "mp3-collector · 1999", quote: "Winamp really does whip the llama’s ass—and every skin makes it look like a different machine.", context: "Customising the new MP3 player" },
      { handle: "icq-10482931 · 1999", quote: "That ‘uh-oh’ sound means somebody from school is online, even if the computer is across the house.", context: "Instant messaging becomes ambient" },
      { handle: "usb-optimist · 1999", quote: "I plugged in the scanner and Windows asked for the CD, restarted twice, then somehow it worked.", context: "Early USB optimism" },
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
      { handle: "helpdesk-tech · 2000", quote: "It looks familiar, but it can stay running for days without somebody reaching for the reset button.", context: "NT reliability reaches the desk" },
      { handle: "office-admin · 2001", quote: "Joining the domain and mapping everyone’s drives is almost boring now, which is exactly what I wanted.", context: "A professional network workhorse" },
      { handle: "lan-party-host · 2000", quote: "Great for work, less great when the game expects Windows 98 and refuses to cooperate.", context: "Reliability versus game compatibility" },
      { handle: "music-trader · 2000", quote: "Napster says the song will finish in twelve minutes. I am not touching anything until it does.", context: "The peer-to-peer music rush" },
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
      { handle: "family-pc · 2002", quote: "Fast User Switching means my sister can stop closing all my Messenger chats just to check her email.", context: "One PC, several accounts" },
      { handle: "msn-display-name · 2004", quote: "If I add enough song lyrics and symbols to my Messenger name, everyone will know exactly how I feel.", context: "The art of the MSN display name" },
      { handle: "broadband-newbie · 2003", quote: "The internet is just… always there now. No dial tone, no busy phone, no asking permission first.", context: "Broadband changes the household" },
      { handle: "theme-sceptic · 2001", quote: "The blue Start button looked like a toy for a week. Now the old grey menus look ancient.", context: "Getting used to Luna" },
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
      { handle: "new-laptop · 2007", quote: "The glass windows are gorgeous, but the hard-drive light has not stopped blinking since I turned it on.", context: "Aero meets first-generation hardware" },
      { handle: "uac-fatigue · 2007", quote: "I said yes, Vista. I really do want the program I just clicked to run.", context: "Adjusting to User Account Control" },
      { handle: "search-convert · 2008", quote: "I stopped hunting through All Programs—typing three letters into Start is faster every time.", context: "Instant Start search" },
      { handle: "gadget-fan · 2007", quote: "The Sidebar clock uses a ridiculous amount of space, and I am keeping it because it looks fantastic.", context: "The desktop gadget moment" },
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
      { handle: "vista-upgrader · 2009", quote: "It is everything I wanted Vista to be: the pretty glass, without feeling like the laptop is fighting me.", context: "A calmer Aero experience" },
      { handle: "two-monitor-desk · 2010", quote: "Dragging a window to the side and watching it snap into half the screen never gets old.", context: "Aero Snap becomes muscle memory" },
      { handle: "taskbar-convert · 2010", quote: "I hated the giant unlabeled icons for two days. Now I pin everything and barely touch the desktop.", context: "Learning the Superbar" },
      { handle: "student-gamer · 2011", quote: "Skype on one side, Minecraft on the other, and the fan sounding like a tiny aircraft.", context: "The early 2010s laptop desk" },
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
      { handle: "mouse-user · 2012", quote: "The Start screen looks incredible, but why did my entire desktop disappear when I only wanted Calculator?", context: "A touch-first shell on a mouse PC" },
      { handle: "tablet-owner · 2013", quote: "On a touchscreen the big tiles suddenly make sense; on my desk they still feel a metre apart.", context: "Two very different hardware experiences" },
      { handle: "corner-hunter · 2012", quote: "Apparently the power button lives behind a charm hidden in a corner. I had to look that up.", context: "Discovering edge gestures" },
      { handle: "live-tile-fan · 2013", quote: "Weather, mail, and calendar updating before I open them feels like the future.", context: "The appeal of Live Tiles" },
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
      { handle: "free-upgrader · 2015", quote: "The Start menu is back, the tiles can stay, and I finally feel like the desktop and tablet parts have met properly.", context: "The hybrid Start menu" },
      { handle: "virtual-desker · 2016", quote: "One desktop for work and another for everything I am pretending is not open—Task View is brilliant.", context: "Virtual desktops go mainstream" },
      { handle: "update-watcher · 2017", quote: "Windows has chosen tonight, five minutes before bed, to explain that updates are underway.", context: "Windows as a service" },
      { handle: "settings-searcher · 2018", quote: "Half the option is in Settings, the other half is in Control Panel, and search is mediating the peace treaty.", context: "Two generations of configuration" },
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
      { handle: "fresh-install · 2021", quote: "The centred taskbar felt wrong for an hour. Now my mouse travels less and I barely notice it.", context: "Relearning the taskbar" },
      { handle: "window-organiser · 2022", quote: "Snap Layouts turned my ultrawide from a pile of windows into something I can actually manage.", context: "Window management becomes visible" },
      { handle: "context-menu-user · 2021", quote: "The new menu is beautifully clean, right until I need the command hiding under ‘Show more options.’", context: "Polish meets legacy depth" },
      { handle: "hybrid-worker · 2022", quote: "Teams, Edge, and three documents open, but the softer colours make the whole desk feel oddly calm.", context: "The hybrid-work desktop" },
    ],
    design: { palette: ["#eaf3fb", "#b9dffc", "#f3d9e8", "#086fc1"], typography: "Segoe UI Variable with relaxed spacing, clear weights, and comfortable modern proportions.", styling: "Soft Mica materials, generous rounded corners, centred composition, pastel wallpaper colour, and quiet layered shadows." },
  },
};

export function getWindowsMemoryScene(id: string) {
  return windowsMemoryScenes[id];
}
