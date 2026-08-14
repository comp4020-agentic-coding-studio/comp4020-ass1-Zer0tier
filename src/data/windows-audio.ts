export interface StartupSound {
  src?: string;
  label: string;
  note: string;
  sourceUrl: string;
}

const archiveSource = "https://www.winhistory.de/more/winstart/winstart_en.htm";

export const windowsStartupSounds: Record<string, StartupSound> = {
  win1: {
    label: "Silent startup",
    note: "Windows 1.0 predates Windows startup audio, so this transition is intentionally silent.",
    sourceUrl: archiveSource,
  },
  win2: {
    label: "Silent startup",
    note: "Windows 2.0 still had no dedicated startup sound, so this transition is intentionally silent.",
    sourceUrl: archiveSource,
  },
  win3: {
    src: "media/startup/windows-3.wav",
    label: "Tada.wav",
    note: "The brief system cue associated with Windows 3.1 startup.",
    sourceUrl: archiveSource,
  },
  win95: {
    src: "media/startup/windows-95.wav",
    label: "The Microsoft Sound",
    note: "Brian Eno's original startup composition for Windows 95.",
    sourceUrl: archiveSource,
  },
  win98: {
    src: "media/startup/windows-98.wav",
    label: "Windows 98 startup",
    note: "The longer, brighter reinterpretation of the Windows 95 sound.",
    sourceUrl: archiveSource,
  },
  win2000: {
    src: "media/startup/windows-2000.wav",
    label: "Windows 2000 logon",
    note: "The original Windows 2000 logon cue used as its startup identity.",
    sourceUrl: archiveSource,
  },
  winxp: {
    src: "media/startup/windows-xp.wav",
    label: "Windows XP startup",
    note: "The original four-second Windows XP startup cue.",
    sourceUrl: archiveSource,
  },
  vista: {
    src: "media/startup/windows-vista.wav",
    label: "Windows Vista startup",
    note: "The original cue created by Robert Fripp, Tucker Martine, and Steve Ball.",
    sourceUrl: archiveSource,
  },
  win7: {
    src: "media/startup/windows-vista.wav",
    label: "Windows 7 startup",
    note: "Windows 7 retained the startup cue introduced with Windows Vista.",
    sourceUrl: archiveSource,
  },
  win8: {
    src: "media/startup/windows-vista.wav",
    label: "Windows 8 startup",
    note: "Windows 8 retained the Vista-era cue in the system, although startup playback was disabled by default.",
    sourceUrl: archiveSource,
  },
  win10: {
    src: "media/startup/windows-vista.wav",
    label: "Windows 10 startup",
    note: "Windows 10 retained the Vista-era cue in the system, although startup playback was disabled by default.",
    sourceUrl: archiveSource,
  },
  win11: {
    src: "media/startup/windows-11.wav",
    label: "Windows 11 startup",
    note: "The softer new startup cue introduced and enabled with Windows 11.",
    sourceUrl: archiveSource,
  },
};

export function getStartupSound(releaseId: string) {
  return windowsStartupSounds[releaseId];
}
