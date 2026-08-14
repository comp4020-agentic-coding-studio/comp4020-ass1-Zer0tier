export interface Contributor {
  name: string;
  contribution: string;
  photo: string;
  profileUrl: string;
  photoCredit: string;
}

export interface ReleaseStory {
  title: string;
  story: string;
  sourceLabel: string;
  sourceUrl: string;
}

export interface WindowsHistory {
  story: ReleaseStory;
  contributors: Contributor[];
}

const people = {
  billGates: {
    name: "Bill Gates",
    contribution: "Microsoft co-founder and executive sponsor who pushed Windows from an interface project into a long-term platform.",
    photo: "media/contributors/bill-gates.jpg",
    profileUrl: "https://en.wikipedia.org/wiki/Bill_Gates",
    photoCredit: "Wikimedia Commons",
  },
  tandyTrower: {
    name: "Tandy Trower",
    contribution: "The product manager who carried Windows 1.0 to release and specified many of its bundled desktop applications.",
    photo: "media/contributors/tandy-trower.jpg",
    profileUrl: "https://www.stayforever.de/artikel/windows-interview-with-tandy-trower",
    photoCredit: "Stay Forever",
  },
  steveBallmer: {
    name: "Steve Ballmer",
    contribution: "Microsoft's early business manager, whose sales and systems-software leadership helped turn Windows into a commercial product line.",
    photo: "media/contributors/steve-ballmer.jpg",
    profileUrl: "https://en.wikipedia.org/wiki/Steve_Ballmer",
    photoCredit: "Wikimedia Commons",
  },
  davidWeise: {
    name: "David Weise",
    contribution: "His protected-mode memory work revived Windows engineering and opened the path from the 2.x line to Windows 3.x.",
    photo: "media/contributors/david-weise.jpg",
    profileUrl: "https://hardcoresoftware.learningbyshipping.com/p/003-klunder-college",
    photoCredit: "Hardcore Software",
  },
  bradSilverberg: {
    name: "Brad Silverberg",
    contribution: "He led Microsoft's Windows effort through Windows 3.1 and the much larger Windows 95 project.",
    photo: "media/contributors/brad-silverberg.jpg",
    profileUrl: "https://computerhistory.org/profile/brad-silverberg/",
    photoCredit: "GeekWire",
  },
  brianEno: {
    name: "Brian Eno",
    contribution: "The composer behind The Microsoft Sound, the compact musical identity heard when Windows 95 started.",
    photo: "media/contributors/brian-eno.png",
    profileUrl: "https://devblogs.microsoft.com/oldnewthing/20030908-00/?p=42623",
    photoCredit: "Wikimedia Commons",
  },
  jimAllchin: {
    name: "Jim Allchin",
    contribution: "The Windows platform leader who oversaw the NT-based releases from Windows 2000 through Windows Vista.",
    photo: "media/contributors/jim-allchin.jpg",
    profileUrl: "https://news.microsoft.com/tag/jim-allchin/",
    photoCredit: "Wikimedia Commons",
  },
  daveCutler: {
    name: "Dave Cutler",
    contribution: "Chief architect of Windows NT, the engineering foundation refined for Windows 2000 and every modern Windows release.",
    photo: "media/contributors/dave-cutler.jpg",
    profileUrl: "https://computerhistory.org/profile/david-cutler/?alias=bio&person=david-cutler",
    photoCredit: "Wikimedia Commons",
  },
  charlesORear: {
    name: "Charles O'Rear",
    contribution: "The photographer of Bliss, the California landscape that became Windows XP's defining desktop image.",
    photo: "media/contributors/charles-orear.jpg",
    profileUrl: "https://en.wikipedia.org/wiki/Charles_O%27Rear",
    photoCredit: "Wikimedia Commons",
  },
  robertFripp: {
    name: "Robert Fripp",
    contribution: "The musician who created Vista's startup melody and soundscape with Tucker Martine and Steve Ball.",
    photo: "media/contributors/robert-fripp.jpg",
    profileUrl: "https://en.wikipedia.org/wiki/Robert_Fripp",
    photoCredit: "Wikimedia Commons",
  },
  stevenSinofsky: {
    name: "Steven Sinofsky",
    contribution: "President of the Windows division for Windows 7 and Windows 8, responsible for both releases' overall delivery.",
    photo: "media/contributors/steven-sinofsky.jpg",
    profileUrl: "https://news.microsoft.com/speeches/steven-sinofsky-tami-reller-julie-larson-green-antoine-leblond-and-michael-angiulo-windows-8-consumer-preview/",
    photoCredit: "Wikimedia Commons",
  },
  julieLarsonGreen: {
    name: "Julie Larson-Green",
    contribution: "Windows program-management leader responsible for design, feature selection, user experience, and the Windows 8 vision.",
    photo: "media/contributors/julie-larson-green.jpg",
    profileUrl: "https://news.microsoft.com/speeches/steven-sinofsky-tami-reller-julie-larson-green-antoine-leblond-and-michael-angiulo-windows-8-consumer-preview/",
    photoCredit: "Wikimedia Commons",
  },
  terryMyerson: {
    name: "Terry Myerson",
    contribution: "He led Microsoft's unified operating-systems group and presented Windows 10 as one platform across device categories.",
    photo: "media/contributors/terry-myerson.jpg",
    profileUrl: "https://news.microsoft.com/windows10story/",
    photoCredit: "Ars Technica",
  },
  joeBelfiore: {
    name: "Joe Belfiore",
    contribution: "The Windows experience leader who demonstrated and shaped the familiar Start-led interface of Windows 10.",
    photo: "media/contributors/joe-belfiore.jpg",
    profileUrl: "https://news.microsoft.com/speeches/satya-nadella-terry-myerson-joe-belfiore-and-phil-spencer-windows-10-briefing/",
    photoCredit: "Wikimedia Commons",
  },
  panosPanay: {
    name: "Panos Panay",
    contribution: "Microsoft's chief product officer who led the Windows and Devices team that introduced Windows 11.",
    photo: "media/contributors/panos-panay.jpg",
    profileUrl: "https://news.microsoft.com/june-24-2021/",
    photoCredit: "Leadership 100",
  },
  satyaNadella: {
    name: "Satya Nadella",
    contribution: "Microsoft's CEO and executive sponsor for the security, productivity, and hybrid-work direction behind Windows 11.",
    photo: "media/contributors/satya-nadella.jpg",
    profileUrl: "https://news.microsoft.com/june-24-2021/",
    photoCredit: "Wikimedia Commons",
  },
} satisfies Record<string, Contributor>;

export const windowsHistory: Record<string, WindowsHistory> = {
  win1: {
    story: {
      title: "The release people called vaporware",
      story: "Microsoft announced Windows in 1983, then needed two more years to ship it. The long delay helped popularise the industry insult ‘vaporware’, while early reviews criticised the finished system for moving slowly on typical PCs. The modest debut still established the platform Microsoft refused to abandon.",
      sourceLabel: "TIME's history of Windows 1.0",
      sourceUrl: "https://time.com/3592071/windows-1-history/",
    },
    contributors: [people.billGates, people.tandyTrower],
  },
  win2: {
    story: {
      title: "Overlapping windows led straight to court",
      story: "Windows 2.03 let windows overlap, a visible break from Windows 1.0's tiled layout. Apple argued that the change copied the Macintosh's look and feel and filed suit in 1988. After years of litigation, courts found that most disputed displays were licensed or not protectable by copyright.",
      sourceLabel: "Apple v. Microsoft court record",
      sourceUrl: "https://law.justia.com/cases/federal/appellate-courts/F3/35/1435/605245/",
    },
    contributors: [people.billGates, people.steveBallmer],
  },
  win3: {
    story: {
      title: "A font war changed everyday documents",
      story: "Windows 3.1 built TrueType directly into the system, giving ordinary users scalable screen and printer fonts without buying Adobe Type Manager. The move made Windows far more credible for publishing and office documents, turning a technical format rivalry into a change millions of people could see on every page.",
      sourceLabel: "The history of TrueType",
      sourceUrl: "https://www.truetype-typography.com/tthist.htm",
    },
    contributors: [people.davidWeise, people.bradSilverberg],
  },
  win95: {
    story: {
      title: "Why the button literally said Start",
      story: "The new launcher was so unfamiliar that Windows 95 taught people what to do with a label and an on-screen arrow. Years later, Microsoft's Windows team recalled that computing was still new enough for this explicit invitation to be necessary. The training aid became one of software's most durable landmarks.",
      sourceLabel: "Microsoft's Windows interface retrospective",
      sourceUrl: "https://news.microsoft.com/speeches/steven-sinofsky-tami-reller-julie-larson-green-antoine-leblond-and-michael-angiulo-windows-8-consumer-preview/",
    },
    contributors: [people.bradSilverberg, people.brianEno],
  },
  win98: {
    story: {
      title: "The blue screen that upstaged Bill Gates",
      story: "At COMDEX in 1998, a scanner was connected during a Windows 98 Plug and Play demonstration. The presentation PC immediately crashed to a blue screen in front of the crowd. Gates recovered with a joke that the failure must be why Windows 98 had not shipped yet, making the bug one of computing's most replayed demos.",
      sourceLabel: "Microsoft's later account of the COMDEX crash",
      sourceUrl: "https://news.microsoft.com/source/1998/11/15/gates-delivers-comdex-keynote-speaks-of-the-promise-and-pitfalls-of-the-information-age/",
    },
    contributors: [people.billGates, people.jimAllchin],
  },
  win2000: {
    story: {
      title: "Code Red found the web servers",
      story: "In 2001, the Code Red worm automatically attacked vulnerable Microsoft IIS web servers, including systems running Windows 2000. A patch already existed, but unpatched machines let the worm spread rapidly. Microsoft's emergency guidance became an early lesson in the speed gap between publishing a fix and actually deploying it.",
      sourceLabel: "Microsoft Security Bulletin MS01-044",
      sourceUrl: "https://learn.microsoft.com/en-us/security-updates/securitybulletins/2001/ms01-044",
    },
    contributors: [people.daveCutler, people.jimAllchin],
  },
  winxp: {
    story: {
      title: "Blaster turned crashes into a countdown",
      story: "The 2003 Blaster worm exploited an RPC flaw and spread between networked Windows 2000 and XP computers without requiring a user to open a file. Many people remember a system dialog counting down to an unavoidable restart. The outbreak helped drive the security-focused work that arrived with XP Service Pack 2.",
      sourceLabel: "Microsoft's Blaster worm alert",
      sourceUrl: "https://learn.microsoft.com/en-us/troubleshoot/windows-server/security-and-malware/blaster-worm-virus-alert",
    },
    contributors: [people.jimAllchin, people.charlesORear],
  },
  vista: {
    story: {
      title: "Security arrived as a stream of questions",
      story: "Vista's User Account Control tried to stop every application from silently inheriting administrator power. The original design showed prompts even for many built-in tools and routine settings, provoking an immediate backlash. It still pushed software developers toward safer standard-user behaviour and changed Windows' security model for good.",
      sourceLabel: "Microsoft's retrospective on Vista UAC",
      sourceUrl: "https://techcommunity.microsoft.com/blog/microsoft-security-blog/evolving-the-windows-user-model-%E2%80%93-a-look-to-the-past/4369642",
    },
    contributors: [people.jimAllchin, people.robertFripp],
  },
  win7: {
    story: {
      title: "The update designed to ask less often",
      story: "Windows 7 directly answered Vista's most visible complaint by reducing unnecessary UAC prompts, adding notification levels, and allowing trusted Windows tools to elevate more quietly. The calmer experience helped repair the reputation of the security system, although researchers later found new ways to abuse those auto-elevation paths.",
      sourceLabel: "Microsoft's account of the Windows 7 UAC changes",
      sourceUrl: "https://techcommunity.microsoft.com/blog/microsoft-security-blog/evolving-the-windows-user-model-%E2%80%93-a-look-to-the-past/4369642",
    },
    contributors: [people.stevenSinofsky, people.julieLarsonGreen],
  },
  win8: {
    story: {
      title: "The Start button disappeared, then returned",
      story: "Windows 8 replaced the familiar Start menu with a full-screen, touch-first Start experience and removed its desktop button. The change became the release's defining controversy. One year later, Microsoft's own Windows 8.1 announcement called the restored Start button ‘an old friend’—a small control carrying an enormous amount of user expectation.",
      sourceLabel: "Microsoft's Windows 8.1 announcement",
      sourceUrl: "https://blogs.windows.com/windowsexperience/2013/10/23/8-1-reasons-to-love-windows-8-1/",
    },
    contributors: [people.stevenSinofsky, people.julieLarsonGreen],
  },
  win10: {
    story: {
      title: "An update that made files disappear",
      story: "Microsoft paused the October 2018 Update after a small number of users reported missing personal files. The investigation traced the problem to interactions with Known Folder Redirection, and the company changed its testing and feedback processes before re-releasing version 1809. It became a cautionary tale for Windows as a continuously updated service.",
      sourceLabel: "Microsoft's Windows 10 version 1809 update",
      sourceUrl: "https://blogs.windows.com/windowsexperience/2018/10/09/updated-version-of-windows-10-october-2018-update-released-to-windows-insiders/",
    },
    contributors: [people.terryMyerson, people.joeBelfiore],
  },
  win11: {
    story: {
      title: "The tiny chip that blocked an upgrade",
      story: "Windows 11 made TPM 2.0 part of its minimum hardware baseline, surprising owners of otherwise capable PCs. Microsoft argued that the requirement enabled stronger cryptography, passwordless sign-in, disk encryption, and protection against pre-boot attacks. The controversial cutoff made security hardware part of the mainstream upgrade conversation.",
      sourceLabel: "Microsoft's Windows 11 requirements rationale",
      sourceUrl: "https://blogs.windows.com/windows-insider/2021/08/27/update-on-windows-11-minimum-system-requirements-and-the-pc-health-check-app/",
    },
    contributors: [people.panosPanay, people.satyaNadella],
  },
};

export function getWindowsHistory(releaseId: string) {
  return windowsHistory[releaseId];
}
