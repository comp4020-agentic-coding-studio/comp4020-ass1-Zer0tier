// Six pages of history per release, read as a book.
//
// Every book follows the same six beats, so twelve releases can be compared
// rather than just read: what it arrived into, how it was built, what shipped,
// how it landed, what went wrong, and what survived. Keeping the spine fixed is
// also what stops the later releases turning into a features list.
//
// Rule from CLAUDE.md: real information about real products is cited, never
// invented to look right. Each book carries one reference for the whole
// history rather than a footnote per page.

export interface HistoryPage {
  title: string;
  body: string;
}

export interface HistoryBook {
  /** WindowsRelease.id */
  release: string;
  pages: HistoryPage[];
  source: { label: string; url: string };
}

const wiki = (title: string, label: string) => ({ label, url: `https://en.wikipedia.org/wiki/${title}` });

export const historyBooks: HistoryBook[] = [
  {
    release: "win1",
    source: wiki("Windows_1.0", "Windows 1.0"),
    pages: [
      { title: "Announced, then late", body: "Microsoft showed Interface Manager in November 1983 and promised it for the following year. It arrived on 20 November 1985, two years behind, by which time the trade press had started using the word vapourware about it." },
      { title: "What it had to sit on", body: "It was not an operating system. It was a program you started from MS-DOS, on machines with 640K of memory and often no hard disk, and everything it could do had to fit inside what DOS left behind." },
      { title: "Tiled, not stacked", body: "Application windows divided the screen and could not overlap; only dialog boxes were allowed on top. Microsoft argued that tiling stopped people losing windows behind one another, and it also kept a visible distance from the Macintosh." },
      { title: "What came in the box", body: "Paint, Write, Notepad, Calculator, Clock, a card file, a terminal and Reversi. Most of them existed to give buyers a reason to touch the mouse, which was still an unfamiliar and separately purchased device." },
      { title: "How it landed", body: "Reviewers liked the idea and not the execution: impressive to look at, slow to use on the hardware of the day, and with almost nothing to run on it. It sold modestly and changed very few minds." },
      { title: "What it started", body: "Windows, icons, menus and a pointer entered the PC vocabulary, and so did the clipboard. Nothing here was commercially decisive, but every later release is an argument with the terms this one set." },
    ],
  },
  {
    release: "win2",
    source: wiki("Windows_2.0", "Windows 2.0"),
    pages: [
      { title: "Windows learn to stack", body: "Released on 9 December 1987, and the single change that mattered was that windows could now overlap. The screen stopped being a grid the system divided for you and became a desk you arranged yourself." },
      { title: "Apple sues", body: "In 1988 Apple sued, claiming the overlapping windows and the icons copied the Macintosh. The case ran for six years. Microsoft largely won, on the ground that a 1985 licence covered most of what Apple was pointing at." },
      { title: "Two versions, one name", body: "Memory was still the binding constraint, so it shipped as Windows/286 and Windows/386 — the first using expanded memory boards, the second using the 386's protected mode to run DOS programs alongside each other." },
      { title: "The applications arrive", body: "Excel 2.0 came to Windows here, bundled with a runtime copy of Windows itself, and Word for Windows followed. For a great many businesses the spreadsheet was the reason Windows was installed at all." },
      { title: "Desktop publishing", body: "Aldus PageMaker brought page layout to hardware far cheaper than a Macintosh. Overlapping windows stopped being a novelty the moment people needed to see a page, a toolbox and a text file at the same time." },
      { title: "The runway", body: "It sold better than 1.0 and still not well. What it did was assemble the pieces — layered windows, real applications, capable hardware — that made Windows 3.0 the first version anyone bought on purpose." },
    ],
  },
  {
    release: "win3",
    source: wiki("Windows_3.1x", "Windows 3.1x"),
    pages: [
      { title: "The one that sold", body: "Windows 3.0 arrived in 1990 and became the first commercial success of the line, selling in the millions where its predecessors had sold in the thousands. Windows 3.1 followed on 6 April 1992 as the version that made it dependable." },
      { title: "Program Manager", body: "Software lived as icons inside named groups — Main, Accessories, Startup — and every installer added its own. File Manager handled the disk separately, so launching a program and finding a file were two different jobs in two different windows." },
      { title: "TrueType", body: "Scalable fonts that matched what came out of the printer arrived with 3.1. It is most of the reason small organisations stopped buying typesetting and started buying laser printers, because you could finally see what you were about to pay for." },
      { title: "Learning by playing", body: "Solitaire had shipped with 3.0 to teach dragging; Minesweeper arrived with 3.1 and taught the two mouse buttons. Both are among the most-used programs Microsoft has ever written, and neither was really a game to the people who commissioned them." },
      { title: "Cooperative, and fragile", body: "Programs had to hand control back to the system voluntarily. One that did not could freeze everything, and the General Protection Fault became a familiar sight. Windows for Workgroups 3.11 added networking and a little more stability in 1993." },
      { title: "The default", body: "By the end of its run Windows was simply what a PC ran. That is the position Windows 95 inherited, and the reason replacing Program Manager was such a large thing to ask." },
    ],
  },
  {
    release: "win95",
    source: wiki("Windows_95", "Windows 95"),
    pages: [
      { title: "Chicago", body: "Development ran under the codename Chicago for close to three years, with a stated goal of making the PC usable by people who had never wanted to learn one. Usability testing shaped the result to an extent unusual for the time." },
      { title: "The launch", body: "It went on sale on 24 August 1995 behind a campaign no software release had matched: the Rolling Stones' Start Me Up licensed for the advertising, the Empire State Building lit in the Windows colours, and queues outside shops at midnight." },
      { title: "Start here", body: "The Start button, the taskbar, the Recycle Bin and right-click context menus all arrived together. Testers kept failing to find where to begin, so the button was labelled with the instruction — the word Start is a usability fix that became furniture." },
      { title: "Underneath", body: "Long file names replaced the eight-character limit, Plug and Play meant hardware could announce itself, and the registry replaced scattered configuration files. It was still 32-bit code sharing a machine with 16-bit code and MS-DOS." },
      { title: "The internet, arriving late", body: "The web became a consumer phenomenon during development. Internet Explorer 1.0 was not in the box; it came in the separately sold Plus! pack, which is how close Microsoft came to missing it entirely." },
      { title: "The shape that stayed", body: "Program Manager and File Manager were both retired into it, so everything people knew stopped applying at once. Thirty years later the button and the bar are still there, including through the release that deleted them." },
    ],
  },
  {
    release: "win98",
    source: wiki("Windows_98", "Windows 98"),
    pages: [
      { title: "Ninety-five, finished", body: "Released on 25 June 1998, it is best understood as the version of Windows 95 that worked properly: the same shape, with three years of hardware and driver reality folded in." },
      { title: "The browser moves in", body: "Netscape had taken the web while Microsoft was looking elsewhere. The answer, decided in 1996, was to stop selling a browser as a product and start shipping it as part of the system — a strategy that arrived fully formed here and took the market inside three years." },
      { title: "The Comdex crash", body: "In April 1998, demonstrating how easy new hardware had become, a USB scanner was plugged in on stage and the machine produced a blue screen in front of the audience. Bill Gates, standing beside it, observed that this was why it was not shipping yet." },
      { title: "United States v. Microsoft", body: "The Department of Justice and twenty states filed in May 1998, a month before this release went on sale. Judge Jackson ordered the company split in two in 2000; an appeals court reversed that remedy in 2001, and the matter settled with the bundling intact and the conduct restrained." },
      { title: "Quietly important", body: "USB support finally worked, multiple monitors became possible, and FAT32 removed the disk size limits. The Second Edition in 1999 added internet connection sharing, which is how a great many homes got their first network." },
      { title: "The end of the line", body: "This was the last consumer Windows built on MS-DOS that anyone remembers fondly. Windows ME followed and is remembered otherwise; the future was already being built on the NT kernel next door." },
    ],
  },
  {
    release: "win2000",
    source: wiki("Windows_2000", "Windows 2000"),
    pages: [
      { title: "NT 5.0, renamed", body: "It was developed as Windows NT 5.0 and renamed late. Released on 17 February 2000, it looks almost exactly like Windows 98 and shares nearly nothing with it below the surface." },
      { title: "A real kernel", body: "Preemptive multitasking, protected memory and NTFS meant a crashing program could no longer take the machine with it. The blue screen went from a routine part of the day to something that suggested a hardware fault." },
      { title: "Active Directory", body: "Thousands of machines could be managed from one place: accounts, policies and permissions defined centrally and applied on login. It is the reason Windows kept the corporate desktop for the next twenty-five years." },
      { title: "Two audiences, two systems", body: "It was sold to business. Home users were offered Windows ME in September 2000 — a last attempt to extend the DOS line, and widely held to be the weakest release Microsoft ever shipped." },
      { title: "The cost of strictness", body: "The same discipline that made it stable made it fussy. Drivers had to be written properly, older software sometimes refused to run, and games in particular ran better on the consumer line for another year." },
      { title: "The foundation", body: "Every version of Windows since is built on this line. What people relearn each time is the surface; underneath, the system that arrived quietly in February 2000 is still doing the work." },
    ],
  },
  {
    release: "winxp",
    source: wiki("Windows_XP", "Windows XP"),
    pages: [
      { title: "Whistler", body: "The codename for the project that finally merged the consumer and business lines. Home users would get the NT kernel's stability and businesses would get an interface people did not hate, from a single release." },
      { title: "A quiet launch", body: "It went on sale on 25 October 2001, six weeks after the September 11 attacks. The planned celebration in New York was cut back sharply, and the biggest technical release of the year arrived without much noise." },
      { title: "Luna", body: "The new look was bright enough that a great many people switched straight back to the Windows Classic theme, which shipped alongside it for exactly that reason. Product activation arrived in the same box and was received worse: a copy of Windows now had to ask permission to keep working." },
      { title: "The worms", body: "Blaster arrived in August 2003 and made machines restart every sixty seconds. Sasser followed in May 2004 and took out hospitals, a rail network and a coastguard. Neither needed anyone to open anything; being switched on and connected was the whole vulnerability." },
      { title: "Service Pack 2", body: "Released in August 2004, it turned the firewall on by default, added a security centre and blocked a class of attack outright. It is a security rewrite delivered as an update, and it is why XP became safe enough to keep." },
      { title: "Twelve years", body: "Support ended on 8 April 2014 and machines kept running it long after. A generation of web pages was built against the browser it carried, and Internet Explorer 6 is what the cost of not relearning looks like." },
    ],
  },
  {
    release: "vista",
    source: wiki("Windows_Vista", "Windows Vista"),
    pages: [
      { title: "Longhorn", body: "It was meant to be a short release between XP and something larger, and grew for five years instead. In 2004 the project was restarted from the Windows Server codebase, and the most ambitious plan — WinFS, a searchable database in place of the file system — was cut." },
      { title: "Aero", body: "Window frames became translucent and blurred what sat behind them, the Start button became an unlabelled orb, and a search box replaced browsing as the fastest way to start anything. It was the largest visual change since Windows 95." },
      { title: "User Account Control", body: "Apple's Get a Mac advertising gave the consent prompt an entire spot, and the joke worked because the prompt really did appear that often. Microsoft cut the frequency sharply in Windows 7 rather than abandoning the idea, and that calmer version is what still runs today." },
      { title: "Vista Capable", body: "Machines were sold with stickers saying they would run it when they could only run the version without Aero. The resulting class action produced internal emails in which Microsoft's own executives complained about their new computers." },
      { title: "Drivers", body: "The driver model changed, and at launch a great deal of hardware had nothing written for it. Printers, sound cards and graphics chips that worked under XP simply did not, and the blame landed on the operating system rather than the vendors." },
      { title: "Rehabilitated by its successor", body: "Service Packs 1 and 2 fixed much of it, but the reputation held. Windows 7 is Vista with the driver ecosystem caught up and the prompts calmed down, which is why it was received as a triumph." },
    ],
  },
  {
    release: "win7",
    source: wiki("Windows_7", "Windows 7"),
    pages: [
      { title: "Built on the unloved one", body: "Released on 22 October 2009, it shares Vista's foundations deliberately: the driver model had settled, so the hardware that failed in 2007 worked in 2009 without anyone having to rewrite it." },
      { title: "The Superbar", body: "Large pinned icons replaced small text buttons, and the taskbar became the launcher and the switcher at once. Jump lists put recent documents on a right-click, and hovering showed a live preview of the window itself." },
      { title: "Snap", body: "Dragging a window to an edge filled half the screen and dragging to the top maximised it. Arranging windows stopped being a mouse job measured in pixels and became a gesture, which is the last genuinely new idea the desktop had for a decade." },
      { title: "Received well", body: "Reviews were strong and adoption was fast, helped by a large population still on XP who had refused Vista. Within two years it was the most used desktop operating system in the world." },
      { title: "The one nobody would leave", body: "It became the corporate standard and stayed. Windows 8 was measured against it and lost; Windows 10 spent its first years persuading people to move off it. Support finally ended on 14 January 2020." },
      { title: "Still there", body: "Pinning and snapping survive untouched fifteen years on. Windows 11's Snap Layouts are this idea with a menu attached, which is the strongest thing that can be said about a design." },
    ],
  },
  {
    release: "win8",
    source: wiki("Windows_8", "Windows 8"),
    pages: [
      { title: "The iPad problem", body: "The iPad arrived in 2010 and PC sales began falling. Microsoft's answer was one operating system for tablets and desktops alike, designed for a finger first, on the reasoning that the touch machine was the machine people would buy next." },
      { title: "Metro", body: "Flat, brightly coloured surfaces replaced Aero's glass, with typography doing the work that gradients and shadows had done. The design language was genuinely influential — the rest of the industry went flat within two years." },
      { title: "The button goes", body: "It went on sale on 26 October 2012 beside the first Surface, the first computer Microsoft had built itself. Steven Sinofsky, who had run the division through Windows 7's success, left three weeks later. The bet was that touch would arrive before the objections did." },
      { title: "The corner", body: "On a desktop there was nothing to click. The controls were hot corners you had to know about, full-screen applications covered a desktop that still existed underneath, and no part of the screen told you where to begin." },
      { title: "8.1", body: "In October 2013, a year later, the Start button came back — leading to the Start screen rather than a menu — along with the option to boot straight to the desktop. It is a public correction, delivered fast, in a numbered release." },
      { title: "Refused", body: "Adoption stayed low and Windows 7 kept its lead throughout. Windows 10 restored the menu and folded the tiles into it. The flat design stayed; the interaction did not. A public that has already learned something can decline to learn it again." },
    ],
  },
  {
    release: "win10",
    source: wiki("Windows_10", "Windows 10"),
    pages: [
      { title: "Skipping nine", body: "Announced in 2014 as Windows 10, with the missing number never properly explained. The distance from 8 was the point: this was to be understood as a correction rather than a continuation." },
      { title: "Free", body: "Released on 29 July 2015 and given away for a year to anyone on Windows 7 or 8. The upgrade prompts became notorious in their own right, at one point scheduling installations that people had not agreed to." },
      { title: "The menu returns", body: "Microsoft designed this one in public. The Windows Insider Programme put unfinished builds in front of volunteers from October 2014, and by launch several million people had argued over the menu for nine months. It is the most direct institutional answer to the release before it." },
      { title: "Windows as a service", body: "Feature updates arrived twice a year instead of a numbered release every few years. Microsoft described it as the last version of Windows, which was true for six years and is the clearest thing anyone has said about continuous delivery." },
      { title: "Two of everything", body: "The new Settings app arrived beside the old Control Panel rather than replacing it, and both were still there a decade later. Where a control lived depended on how old it was, which is a strange thing to ask people to learn." },
      { title: "The long tail", body: "It stayed the most used version for most of its life and support ended on 14 October 2025. A great deal of the migration to Windows 11 happened not because people wanted it but because that date arrived." },
    ],
  },
  {
    release: "win11",
    source: wiki("Windows_11", "Windows 11"),
    pages: [
      { title: "The last version, superseded", body: "Announced in June 2021 and released on 5 October 2021, six years after Microsoft had described Windows 10 as the last one. The name returned because the requirements changed enough to need a line drawn." },
      { title: "The middle of the bar", body: "Objections to the centred taskbar were loud enough that a setting to push it back to the left shipped almost immediately. Nearly nothing else about the bar was left adjustable, which is why this one detail became the argument that stood in for the whole release." },
      { title: "TPM 2.0", body: "It requires a security chip and Secure Boot, which ruled out working computers running Windows 10 perfectly well. It is the first time a Windows upgrade was withheld at this scale from hardware that was not broken, and the reasoning was security rather than capability." },
      { title: "Snap Layouts", body: "Hovering the maximise button offers a menu of window arrangements, which is Windows 7's snapping made explicit. It is the clearest case in this release of a good idea that people had to be told about, because nothing about the button suggests it." },
      { title: "What was taken away", body: "The taskbar lost the ability to move to another edge, and ungrouping labelled windows went with it. Small removals, but they landed on people who had arranged their screen the same way for fifteen years and had no way to put it back." },
      { title: "Being relearned now", body: "Copilot and generative features arrived through the release rather than at it, so the interface has kept moving without a version number to point at. This is the one nobody can assess yet — which is exactly what the last eleven pages of this book looked like at the time." },
    ],
  },
];

export function getHistoryBook(release: string) {
  const book = historyBooks.find((item) => item.release === release);
  if (!book) throw new Error(`no history book for release ${release}`);
  return book;
}
