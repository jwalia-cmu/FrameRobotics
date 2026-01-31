export const SITE = {
  brand: "Dextral Robotics",
  email: "karanwalia@cmu.edu",
};

export const DOMAINS = [
  "Drones",
  "Construction",
  "Autonomous Driving",
  "Humanoids",
  "Healthcare",
  "Warehouses",
  "Inspection",
  "Underwater ROVs",
];

export const FOUNDERS = [
  {
    name: "Jaskaran (Karan) Walia",
    line: "Machine Learning@CMU, Ex-Microsoft, Ex-MIT, 20+ papers, 80+ Citations, published in CVPR, CHI, Springer, ASE",
    linkedin: "https://www.linkedin.com/in/jaskaranwalia",
    photo: "jaskaran_pic.png",
  },
  {
    name: "Shreenabh Agrawal",
    line: "Robotics@CMU, worked across quadrupeds, arms, humanoids, drones, published in (ICRA/IROS/RA-L)",
    linkedin: "https://www.linkedin.com/in/shreenabh",
    photo: "shreenabh_pic.png",
  },
] as const;

export const HERO = {
  typingPauseMs: 900,
  typingSpeedMs: 55,
  backspaceSpeedMs: 34,
};

export const VIDEO = {
  manifestUrl: "videos/manifest.json",
  // Cross-fade cadence. Keep this shorter than your typical clip length.
  swapEveryMs: 9000,
  fadeMs: 1100,
};
