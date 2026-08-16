// The long form of the four "What this interface changed" cards.
//
// The cards on the page are one line each, which is the right length to scan
// twelve releases. These are what you get when you ask one of them a question:
// the dates, the names, and the specific consequence the one-liner compresses.
//
// Rule from CLAUDE.md: real information about real products is cited, never
// invented to look right. Each note carries a reference, and dates and version
// facts are stated only where I can point at something.

export type DetailFacet = "signature" | "changed" | "tradeoff" | "legacy";

export const detailFacets: { facet: DetailFacet; number: string; heading: string }[] = [
  { facet: "signature", number: "01", heading: "Signature interface" },
  { facet: "changed", number: "02", heading: "The shift" },
  { facet: "tradeoff", number: "03", heading: "The trade-off" },
  { facet: "legacy", number: "04", heading: "What remained" },
];

export interface DetailNote {
  /** WindowsRelease.id */
  release: string;
  facet: DetailFacet;
  long: string;
  source: { label: string; url: string };
}

const wiki = (title: string, label: string) => ({ label, url: `https://en.wikipedia.org/wiki/${title}` });

const REL = {
  win1: wiki("Windows_1.0", "Windows 1.0"),
  win2: wiki("Windows_2.0", "Windows 2.0"),
  win3: wiki("Windows_3.1x", "Windows 3.1x"),
  win95: wiki("Windows_95", "Windows 95"),
  win98: wiki("Windows_98", "Windows 98"),
  win2000: wiki("Windows_2000", "Windows 2000"),
  winxp: wiki("Windows_XP", "Windows XP"),
  vista: wiki("Windows_Vista", "Windows Vista"),
  win7: wiki("Windows_7", "Windows 7"),
  win8: wiki("Windows_8", "Windows 8"),
  win10: wiki("Windows_10", "Windows 10"),
  win11: wiki("Windows_11", "Windows 11"),
};

export const detailNotes: DetailNote[] = [
  // Windows 1.0 — 1985
  { release: "win1", facet: "signature", source: REL.win1,
    long: "Released on 20 November 1985, two years after it was announced. The shell was MS-DOS Executive, a list of the files on a disk rather than a list of programs, and application windows were tiled: they divided the screen between them and could not be stacked. Only dialog boxes were allowed to overlap." },
  { release: "win1", facet: "changed", source: wiki("Graphical_user_interface", "Graphical user interface"),
    long: "It made the machine's options visible. Commands you previously had to know and type became menus you could read, and a set of controls arrived together — scroll bars, dialog boxes, check boxes, a mouse pointer — that no PC user had needed before. The bundled Paint, Write, Notepad, Calculator and Reversi existed largely to give people a reason to practise." },
  { release: "win1", facet: "tradeoff", source: REL.win1,
    long: "Tiling meant the machine, not the user, decided where things went. Reviewers found it slow on the hardware of the day, the software library was nearly empty, and MS-DOS was still underneath — Windows was a program you ran, not the system you ran on." },
  { release: "win1", facet: "legacy", source: wiki("WIMP_(computing)", "WIMP (computing)"),
    long: "Windows, icons, menus, pointer — the vocabulary every later release extends rather than replaces. The clipboard arrived here too, and with it the idea that content moves between unrelated programs, which is now so ordinary it is invisible." },

  // Windows 2.0 — 1987
  { release: "win2", facet: "signature", source: REL.win2,
    long: "Released 9 December 1987. Windows could finally overlap and be minimised and maximised, so the screen became a stack you arranged rather than a grid you accepted. Apple sued Microsoft in 1988 over the resemblance; the case ran for six years and Microsoft largely won." },
  { release: "win2", facet: "changed", source: wiki("Apple_Computer,_Inc._v._Microsoft_Corp.", "Apple Computer, Inc. v. Microsoft Corp."),
    long: "Depth arrived. With windows layered, the one in front is the one you are working in, and everything else waits — the mental model of every desktop since. Keyboard conventions were standardised at the same time, so the same key combinations began to mean the same thing across unrelated programs." },
  { release: "win2", facet: "tradeoff", source: REL.win2,
    long: "It was still a program running on MS-DOS inside 640K of conventional memory, so ambition ran into the hardware quickly. The interface was dense, and getting more memory meant expanded-memory boards or a 386, which most buyers did not have." },
  { release: "win2", facet: "legacy", source: REL.win2,
    long: "Overlapping windows became the defining interaction of the desktop PC, and are the reason the thing is called Windows in the plural. This is also where Excel and Word for Windows arrived, which is what actually put the environment on business desks." },

  // Windows 3.1 — 1992
  { release: "win3", facet: "signature", source: REL.win3,
    long: "Released 6 April 1992. Program Manager held your software as icons inside named groups — Main, Accessories, Startup — and File Manager handled the disk, splitting jobs that Windows 95 would put back together three years later." },
  { release: "win3", facet: "changed", source: wiki("TrueType", "TrueType"),
    long: "TrueType arrived, and with it scalable fonts that looked on screen the way they printed. That single change is most of why the PC replaced the typewriter and the print shop for small organisations, because you could now see what you were about to pay to print." },
  { release: "win3", facet: "tradeoff", source: wiki("Cooperative_multitasking", "Cooperative multitasking"),
    long: "Multitasking was cooperative: each program had to hand control back voluntarily, so one badly behaved application could freeze the entire machine. Program groups also filled up — every installer added its own — and the tidy grid of icons became a drawer nobody sorted." },
  { release: "win3", facet: "legacy", source: REL.win3,
    long: "This is the Windows a whole generation pictures when the word is said, and the release where Solitaire quietly taught drag-and-drop to millions. Its habits lasted exactly until the Start button replaced them." },

  // Windows 95 — 1995
  { release: "win95", facet: "signature", source: wiki("Start_menu", "Start menu"),
    long: "Released 24 August 1995 with a launch campaign built around one control. The Start button, the taskbar, the Recycle Bin, right-click context menus and Windows Explorer all arrived together, and Program Manager and File Manager were both retired into them." },
  { release: "win95", facet: "changed", source: REL.win95,
    long: "Everything became a file in a folder, including your programs, and the taskbar made running applications visible instead of hidden. Long file names replaced the eight-character limit, and Plug and Play meant adding hardware no longer began with a manual and a set of jumper settings." },
  { release: "win95", facet: "tradeoff", source: wiki("Windows_Registry", "Windows Registry"),
    long: "It was still a 32-bit shell over 16-bit code and MS-DOS, so it inherited the old stability problems while adding new ones. The registry replaced scattered .INI files with one central database — tidier in principle, and a single point of failure that could take the installation with it." },
  { release: "win95", facet: "legacy", source: wiki("Taskbar", "Taskbar"),
    long: "The Start button and taskbar have survived thirty years and every redesign since, including the one that deleted them. It is also the largest single relearning event in this story: everything people had learned about Program Manager stopped applying at once." },

  // Windows 98 — 1998
  { release: "win98", facet: "signature", source: REL.win98,
    long: "Released 25 June 1998. Internet Explorer was built into the shell rather than installed onto it, so the file manager and the browser became the same program, and Active Desktop let web content sit on the desktop itself. Quick Launch put one-click icons beside the Start button." },
  { release: "win98", facet: "changed", source: REL.win98,
    long: "The web stopped being somewhere you went and became part of the system's own furniture — the same window, the same Back button, the same address bar for a folder and a site. USB support finally worked well enough to use, which is what eventually killed the serial and parallel ports." },
  { release: "win98", facet: "tradeoff", source: wiki("United_States_v._Microsoft_Corp.", "United States v. Microsoft Corp."),
    long: "Tying the browser to the operating system was the centre of the United States antitrust case, which found Microsoft had maintained a monopoly unlawfully. Stability suffered from the integration too: Windows 98 crashed on stage at Comdex in April 1998 while a USB scanner was being demonstrated." },
  { release: "win98", facet: "legacy", source: REL.win98,
    long: "Quick Launch became pinning, which became the Windows 7 taskbar, which is still how most people start the programs they use daily. The deeper inheritance is the assumption that an operating system ships with a browser at all." },

  // Windows 2000 — 2000
  { release: "win2000", facet: "signature", source: REL.win2000,
    long: "Released 17 February 2000. It looks like Windows 98 and is nothing like it underneath: this is Windows NT, with a protected-memory kernel, preemptive multitasking, NTFS and Active Directory for managing thousands of machines centrally." },
  { release: "win2000", facet: "changed", source: wiki("Windows_NT", "Windows NT"),
    long: "A crashing program stopped being able to take the computer down with it. Applications were separated from each other and from the kernel, which turned the blue screen from a routine event into an unusual one and made the PC credible for work that mattered." },
  { release: "win2000", facet: "tradeoff", source: REL.win2000,
    long: "The strictness that made it stable also made it fussy about drivers and older software, so it was sold to businesses while home users were given Windows ME — widely regarded as the worst release Microsoft shipped. For two years the two audiences were on genuinely different systems." },
  { release: "win2000", facet: "legacy", source: wiki("Architecture_of_Windows_NT", "Architecture of Windows NT"),
    long: "Every version of Windows since XP is built on this line. The consumer releases that came after it are, underneath the theme, this system with a different face — which is the clearest evidence in the story that what people relearn is the surface." },

  // Windows XP — 2001
  { release: "winxp", facet: "signature", source: REL.winxp,
    long: "Released 25 October 2001. The Luna theme put rounded corners, saturated blue and green, and a two-column Start menu over the NT kernel, and ClearType made text on the flat panels people were starting to buy look deliberate rather than blurry." },
  { release: "winxp", facet: "changed", source: REL.winxp,
    long: "The consumer and business lines finally merged: home users got the stability of Windows 2000 and businesses got the friendlier face, from one release. Programs was renamed All Programs, which is a relabelling rather than a move, and the start button carried a lowercase word for the only time." },
  { release: "winxp", facet: "tradeoff", source: wiki("Blaster_(computer_worm)", "Blaster worm"),
    long: "It shipped with the firewall off and every user an administrator, and the internet it met was not the one it was designed for. Blaster and Sasser spread across it in 2003 and 2004, and Service Pack 2 in 2004 was effectively a security re-release of the whole system." },
  { release: "winxp", facet: "legacy", source: REL.winxp,
    long: "People stayed on it for over twelve years — support ended on 8 April 2014 — and a great deal of the web was built against the browser it carried. Staying put has a cost, and Internet Explorer 6 is what it looks like." },

  // Windows Vista — 2007
  { release: "vista", facet: "signature", source: wiki("Windows_Aero", "Windows Aero"),
    long: "Released to consumers on 30 January 2007. Aero Glass made window frames translucent and blurred what was behind them, the Start button became an unlabelled orb with a search box under it, and Sidebar gadgets ran down the side of the desktop." },
  { release: "vista", facet: "changed", source: wiki("User_Account_Control", "User Account Control"),
    long: "Two things changed how the machine felt. Searching replaced browsing as the fastest way to start a program, and User Account Control began asking permission before anything could change the system — the first time Windows treated its own user as untrusted by default." },
  { release: "vista", facet: "tradeoff", source: REL.vista,
    long: "It demanded hardware most people did not have, and machines sold as \"Windows Vista Capable\" often were not, which became a class action. UAC asked so often that people learned to click through it or switch it off, which is the opposite of what a security prompt is for." },
  { release: "vista", facet: "legacy", source: REL.vista,
    long: "The search box and UAC both survived and are still how Windows works; Aero's glass did not, and was stripped out in Windows 8. Vista is where the modern security model starts, which is not what it is remembered for." },

  // Windows 7 — 2009
  { release: "win7", facet: "signature", source: REL.win7,
    long: "Released 22 October 2009. The Superbar replaced small text buttons with large icons that are the pinned launcher and the task switcher at once, with jump lists on right-click, live previews on hover, and Aero Snap for dragging a window to an edge to fill half the screen." },
  { release: "win7", facet: "changed", source: REL.win7,
    long: "Arranging windows stopped being manual. Snapping to halves and maximising by dragging to the top turned a fiddly mouse job into a gesture, and pinning meant the programs you actually use sit in the same place whether or not they are running." },
  { release: "win7", facet: "tradeoff", source: REL.win7,
    long: "It is Vista repaired rather than a new idea, and merging the launcher with the switcher meant one icon could mean two different things — is that program running, or just pinned? Users had to learn to read the subtle outline that distinguishes them." },
  { release: "win7", facet: "legacy", source: REL.win7,
    long: "Snapping and pinning are untouched fifteen years later, and Windows 7 became the release people refused to leave — the benchmark Windows 8 was measured against and failed." },

  // Windows 8 — 2012
  { release: "win8", facet: "signature", source: wiki("Metro_(design_language)", "Metro design language"),
    long: "Released 26 October 2012. The Start button was removed from the desktop and Start became the whole screen: a grid of live tiles updating with mail, weather and photos, with a Charms bar sliding in from the right edge for search, share and settings." },
  { release: "win8", facet: "changed", source: REL.win8,
    long: "One system was meant to run on tablets and PCs alike, so the interface was designed for a finger first. Flat, brightly coloured surfaces replaced Aero's glass and gradients — a design language that the rest of the industry then adopted." },
  { release: "win8", facet: "tradeoff", source: REL.win8,
    long: "On a desktop with a mouse it was hostile: hot corners instead of buttons, full-screen apps over a hidden desktop, and no visible way to find anything. Windows 8.1 put the Start button back in October 2013, a year later, and Windows 10 restored the menu behind it." },
  { release: "win8", facet: "legacy", source: REL.win8,
    long: "The flat visual language stayed and the interaction model did not. This is the release that proves the point of this whole page: a public that has already learned something can refuse to learn it again, and be listened to." },

  // Windows 10 — 2015
  { release: "win10", facet: "signature", source: REL.win10,
    long: "Released 29 July 2015, skipping the number 9. The Start menu returned with Windows 8's tiles folded into its right half, Task View added a button for virtual desktops, and a new Settings app appeared beside the old Control Panel rather than replacing it." },
  { release: "win10", facet: "changed", source: REL.win10,
    long: "Windows became a service. It was a free upgrade for existing users, and instead of numbered releases every few years it took feature updates continuously — so the version you are running is a date rather than a name, and Microsoft called it the last version of Windows." },
  { release: "win10", facet: "tradeoff", source: REL.win10,
    long: "Two settings systems ran side by side for a decade, so where a control lives depended on how old it was. Updates installed themselves on Microsoft's schedule, and the telemetry the service model depends on drew sustained privacy criticism." },
  { release: "win10", facet: "legacy", source: REL.win10,
    long: "The continuous update model is now how Windows works, which means the interface can move without any release to point at. It is also the apology for Windows 8, and it worked: this is the version most people were still using when the next one arrived." },

  // Windows 11 — 2021
  { release: "win11", facet: "signature", source: wiki("Fluent_Design_System", "Fluent Design System"),
    long: "Released 5 October 2021. Start and the taskbar icons moved to the centre of the screen, corners were rounded everywhere, and the Fluent material Mica tints windows with the colour of the wallpaper behind them. Widgets returned as a panel rather than a permanent sidebar." },
  { release: "win11", facet: "changed", source: REL.win11,
    long: "The launcher moved for the first time since 1995 — not renamed or restyled, but relocated to a different part of the screen. Snap Layouts formalised Windows 7's snapping into a menu of arrangements that appears when you hover the maximise button." },
  { release: "win11", facet: "tradeoff", source: REL.win11,
    long: "It requires TPM 2.0 and Secure Boot, which ruled out working computers that ran Windows 10 perfectly well — the first time a Windows upgrade was withheld from functioning hardware at this scale. The taskbar also lost customisation it had carried for years, including the ability to move it to another edge." },
  { release: "win11", facet: "legacy", source: REL.win11,
    long: "Too early to say, which is itself the point: the release everyone is currently relearning is the one nobody can yet assess. What can be said is that Fluent's softer geometry and layered materials have held across the whole system rather than being confined to a few new surfaces, which is more than Aero managed before Windows 8 stripped it out. Ask again when whatever replaces this moves the Start button somewhere else." },
];

export function getDetailNote(release: string, facet: DetailFacet) {
  const note = detailNotes.find((item) => item.release === release && item.facet === facet);
  if (!note) throw new Error(`no detail note for ${release}/${facet}`);
  return note;
}
