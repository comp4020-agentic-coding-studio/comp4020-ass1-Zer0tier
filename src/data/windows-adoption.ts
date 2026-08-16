export interface WindowsAdoptionMilestone {
  valueMillions: number;
  display: string;
  period: string;
  detail: string;
  sourceLabel: string;
  sourceUrl: string;
}

const milestones: Record<string, WindowsAdoptionMilestone> = {
  win1: {
    valueMillions: 0.5,
    display: "500K",
    period: "by April 1987",
    detail: "copies sold after the first Windows release",
    sourceLabel: "Computerworld estimate",
    sourceUrl: "https://en.wikipedia.org/wiki/Windows_1.0#Reception",
  },
  win2: {
    valueMillions: 1,
    display: "1M",
    period: "during 1988",
    detail: "cumulative Windows sales after Windows 2.0 shipped",
    sourceLabel: "InfoWorld figure compiled by TIME",
    sourceUrl: "https://time.com/archive/7231814/a-brief-history-of-windows-sales-figures-1985-present/",
  },
  win3: {
    valueMillions: 3,
    display: "3M",
    period: "first six weeks",
    detail: "Windows 3.1 copies shipped after launch",
    sourceLabel: "Microsoft announcement reported by UPI",
    sourceUrl: "https://www.upi.com/Archives/1992/05/20/Microsoft-ships-3-million-copies-of-Windows-31/9902706334400/",
  },
  win95: {
    valueMillions: 40,
    display: "40M",
    period: "first year",
    detail: "Windows 95 units shipped worldwide",
    sourceLabel: "Microsoft anniversary milestone",
    sourceUrl: "https://www.tomshardware.com/software/windows/microsofts-windows-95-release-was-30-years-ago-today-the-first-time-software-was-a-pop-culture-smash",
  },
  win98: {
    valueMillions: 25,
    display: "25M",
    period: "by February 1999",
    detail: "Windows 98 licences sold worldwide",
    sourceLabel: "Microsoft Source",
    sourceUrl: "https://news.microsoft.com/source/1999/02/09/strong-holiday-sales-make-windows-98-best-selling-software-of-1998/",
  },
  win2000: {
    valueMillions: 1,
    display: "1M",
    period: "first month",
    detail: "Windows 2000 copies acquired worldwide",
    sourceLabel: "Microsoft Source",
    sourceUrl: "https://news.microsoft.com/source/2000/03/14/over-1-million-units-of-windows-2000-acquired-by-customers-worldwide/",
  },
  winxp: {
    valueMillions: 485,
    display: "485M",
    period: "by mid-2006",
    detail: "estimated legitimate Windows XP installations",
    sourceLabel: "IDC estimate reported by The Washington Post",
    sourceUrl: "https://www.washingtonpost.com/archive/business/2006/09/24/if-only-we-knew-then-what-we-know-now-about-windows-xp/01701350-cf02-4b14-9d72-411d042e4aa8/",
  },
  vista: {
    valueMillions: 180,
    display: "180M",
    period: "through fiscal 2008",
    detail: "Windows Vista licences sold",
    sourceLabel: "Microsoft 2008 Annual Report",
    sourceUrl: "https://www.microsoft.com/Investor/reports/ar08/10k_sl_eng.html",
  },
  win7: {
    valueMillions: 670,
    display: "670M",
    period: "by October 2012",
    detail: "Windows 7 licences sold to businesses and consumers",
    sourceLabel: "Microsoft Windows 8 launch address",
    sourceUrl: "https://news.microsoft.com/speeches/steven-sinofsky-steve-ballmer-julie-larson-green-and-michael-angiulo-windows-8-launch/",
  },
  win8: {
    valueMillions: 200,
    display: "200M",
    period: "by February 2014",
    detail: "Windows 8 and 8.1 OEM and retail licences sold",
    sourceLabel: "Microsoft milestone reported by Ars Technica",
    sourceUrl: "https://arstechnica.com/information-technology/2014/02/windows-8-x-reaches-200-million-licenses-sold/",
  },
  win10: {
    valueMillions: 1000,
    display: "1B",
    period: "by March 2020",
    detail: "monthly active Windows 10 devices",
    sourceLabel: "Windows Experience Blog",
    sourceUrl: "https://blogs.windows.com/windowsexperience/2020/03/16/windows-10-powering-the-world-with-1-billion-monthly-active-devices/",
  },
  win11: {
    valueMillions: 1000,
    display: "1B+",
    period: "reported February 2026",
    detail: "devices powered by Windows 11",
    sourceLabel: "Windows Experience Blog",
    sourceUrl: "https://blogs.windows.com/windowsexperience/2026/02/09/strengthening-windows-trust-and-security-through-user-transparency-and-consent/",
  },
};

export function getWindowsAdoptionMilestone(id: string) {
  return milestones[id];
}

export function getWindowsAdoptionScale(valueMillions: number) {
  return Math.log10(valueMillions + 1) / Math.log10(1001);
}
