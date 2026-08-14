export interface QuizQuestion {
  prompt: string;
  choices: string[];
  answer: number;
  explanation: string;
}

export const windowsQuiz: Record<string, QuizQuestion[]> = {
  win1: [
    { prompt: "How did Windows 1.0 arrange its application windows?", choices: ["In fixed tiles", "In overlapping layers", "As full-screen apps"], answer: 0, explanation: "Windows 1.0 tiled its main application windows; overlapping windows arrived with Windows 2.0." },
    { prompt: "Which program acted as Windows 1.0's file launcher?", choices: ["File Manager", "Windows Explorer", "MS-DOS Executive"], answer: 2, explanation: "MS-DOS Executive displayed files and launched programs before Program Manager and File Manager existed." },
  ],
  win2: [
    { prompt: "What major window-management change arrived in Windows 2.0?", choices: ["Live Tiles", "Overlapping windows", "Virtual desktops"], answer: 1, explanation: "Windows 2.0 let users overlap and freely position application windows." },
    { prompt: "Which familiar caption controls became part of Windows 2.0?", choices: ["Minimise and maximise", "Snap and shake", "Back and forward"], answer: 0, explanation: "Minimise and maximise controls helped make layered window management practical." },
  ],
  win3: [
    { prompt: "What replaced MS-DOS Executive as the main launcher in Windows 3.0?", choices: ["Program Manager", "Start", "Active Desktop"], answer: 0, explanation: "Program Manager organised applications into visual groups of icons." },
    { prompt: "Where did users browse files in Windows 3.0?", choices: ["Internet Explorer", "File Manager", "Libraries"], answer: 1, explanation: "File Manager supplied a tree-and-directory interface separate from Program Manager." },
  ],
  win95: [
    { prompt: "Which navigation feature debuted with Windows 95?", choices: ["Charms", "The Start menu", "Task View"], answer: 1, explanation: "Windows 95 introduced the Start button and Start menu as a consistent application launcher." },
    { prompt: "What did the Windows 95 taskbar make continuously visible?", choices: ["Open programs", "Desktop widgets", "Live notifications"], answer: 0, explanation: "Taskbar buttons exposed running programs and made switching between them direct." },
  ],
  win98: [
    { prompt: "Which toolbar offered one-click shortcuts in Windows 98?", choices: ["Quick Launch", "Charms", "Superbar"], answer: 0, explanation: "Quick Launch sat beside Start and commonly included Show Desktop and Internet Explorer." },
    { prompt: "What brought web-like navigation into folders?", choices: ["Aero Glass", "Active Desktop and Explorer integration", "Snap Layouts"], answer: 1, explanation: "Windows 98 deepened Internet Explorer and Explorer integration, including browser-style folder navigation." },
  ],
  win2000: [
    { prompt: "Which technical foundation distinguished Windows 2000?", choices: ["The NT architecture", "The Windows 9x kernel", "A DOS-only core"], answer: 0, explanation: "Windows 2000 was built on the NT line, prioritising reliability, security, and professional networking." },
    { prompt: "Who was Windows 2000 primarily designed for?", choices: ["Touch-first tablet users", "Professional and business users", "Home game-console users"], answer: 1, explanation: "Its interface and tools focused on managed professional desktops and networks." },
  ],
  winxp: [
    { prompt: "What was the default visual style in Windows XP called?", choices: ["Aero", "Luna", "Metro"], answer: 1, explanation: "Luna introduced XP's blue title bars, rounded controls, and colourful two-column Start menu." },
    { prompt: "What did Windows XP bring to mainstream home PCs?", choices: ["The NT kernel", "The Charms bar", "Live Tiles"], answer: 0, explanation: "XP unified the consumer and professional lines around the more dependable NT architecture." },
  ],
  vista: [
    { prompt: "What was Windows Vista's translucent interface called?", choices: ["Fluent", "Luna", "Aero Glass"], answer: 2, explanation: "Aero Glass used desktop composition for translucent window frames and live previews." },
    { prompt: "Which desktop feature hosted clocks, calendars, and other gadgets?", choices: ["Windows Sidebar", "Quick Launch", "Action Center"], answer: 0, explanation: "Windows Sidebar kept desktop gadgets in a dedicated strip along the screen edge." },
  ],
  win7: [
    { prompt: "What was the redesigned Windows 7 taskbar commonly called?", choices: ["Superbar", "Start screen", "Sidebar"], answer: 0, explanation: "The Superbar combined launching and switching through large pinned application buttons." },
    { prompt: "Which feature arranges a window when it reaches a screen edge?", choices: ["Aero Snap", "Active Desktop", "Fast User Switching"], answer: 0, explanation: "Aero Snap maximised or tiled windows when they were dragged to screen edges." },
  ],
  win8: [
    { prompt: "What replaced the traditional Start menu in Windows 8?", choices: ["A full-screen Start screen", "Program Manager", "A desktop Sidebar"], answer: 0, explanation: "Windows 8 used an immersive Start screen built from colourful Live Tiles." },
    { prompt: "Which edge interface contained Search, Share, Start, Devices, and Settings?", choices: ["Quick Launch", "Charms", "Task View"], answer: 1, explanation: "The Charms bar appeared from the right edge and exposed five system-wide commands." },
  ],
  win10: [
    { prompt: "How did Windows 10 redesign Start?", choices: ["It combined an app list with Live Tiles", "It returned to Program Manager", "It removed apps entirely"], answer: 0, explanation: "Windows 10 brought back a menu while retaining a resizable area of Live Tiles." },
    { prompt: "Which Windows 10 feature exposed virtual desktops?", choices: ["Task View", "Active Desktop", "Windows Sidebar"], answer: 0, explanation: "Task View displayed open windows and provided controls for multiple virtual desktops." },
  ],
  win11: [
    { prompt: "Where are pinned taskbar icons placed by default in Windows 11?", choices: ["At the centre", "At the right edge", "In a vertical sidebar"], answer: 0, explanation: "Windows 11 centres Start and pinned taskbar icons by default." },
    { prompt: "What appears when users hover over the maximise button?", choices: ["Charms", "Snap Layouts", "Program groups"], answer: 1, explanation: "Snap Layouts surface common window arrangements directly from the maximise control." },
  ],
};
