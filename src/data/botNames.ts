// Expanded library of creative, distinct bot usernames for Challenge Mode
export const BOT_NAMES: string[] = [
  // AI & Cyber
  "RoboMatch", "PixelMind", "CyberBrain", "SpeedyAI", 
  "SynapseX", "BinaryBrain", "AlphaMemory", "Algorhythm",
  "NeuralLink", "SiliconSage", "DeepThink", "CortexBot",
  "AxiomMind", "QuantumFlip", "OmniLogic", "DataDrift",
  "CircuitSage", "ChronoMind", "ByteMaster", "HyperCognition",
  "MemoBot", "MatchMachine", "BrainyPixel", "LuckyCircuit",
  "NiftyNeuron", "QuickMemo", "SunnySynapse", "CoolCircuit",
  "NimbleNode", "BlinkBot", "HappyHasher", "AceAlgorithm",
  "WinkWire", "TapTactician", "FlashFlip",

  // High Tech & Sci-Fi
  "NeuroSpark", "VectorVanguard", "ZeroEntropy", "AuraBot",
  "NeonPulse", "TitanCore", "AetherMind", "ZenithAI",
  "NexusMind", "EchoChamber", "StarlightCore", "VortexBot",
  "AstralLogic", "ApexMind", "PulsarBrain", "NovaBrain",
  "TinyTitanAI", "EchoEmoji", "ZippyZap", "NovaNudge",
  "FlipFlare", "SparkMemo", "SparkShuffle", "PuzzlePulse",
  "DéjàBot", "SnapSage", "BuzzBrain",

  // Tactical & Master
  "GrandmasterBot", "TacticalMind", "MatrixMind", "AstroLogic",
  "OmegaThink", "KiloByte", "TeraMind", "ExaCognition",
  "CyberSamurai", "ShadowSynapse", "AuraMind", "InfinityCore",
  "FlipMaster", "CardShark", "ChipChampion", "CardNinja",
  "SmartShuffle", "HandyBot", "FastFetch", "QuizzyBot",
  "LuckyLoop",

  // Playful & Clever
  "EmojiWhisperer", "MemoryPhantom", "QuickSilverAI", "GigaBrain",
  "LogicLord", "CardWizardAI", "MindBenderX", "SparkyBot",
  "VoltMind", "GlitchFreeAI", "ProtonMind", "NebulaCognition",
  "PeekABot", "EmojiHunter", "MemoryMingo", "FlipFox",
  "LuckyLinker", "BrainyBeans", "MatchMuffin", "PixelPenguin",
  "TurboTurtle", "CleverKiwi", "JollyLogic", "BounceBot",
  "GiggleGear", "MemoMango", "CardCoyote", "BrainyBuddy",
  "MatchMole", "PixelPanda", "MindMuffin", "CardKoala",
  "FlipFinn", "MemoMite", "BrainyBiscuit", "ChipChick",
  "FlipFairy", "MemoryMoose", "PuzzlePup"
];

// Recent history buffer to prevent back-to-back or frequent name repeats
const RECENT_NAMES_KEY = "emoji_brainpop_recent_bot_names";
const MAX_RECENT_HISTORY = 40;

export function getNextBotUsername(): string {
  let recent: string[] = [];
  try {
    const stored = localStorage.getItem(RECENT_NAMES_KEY);
    if (stored) {
      recent = JSON.parse(stored);
    }
  } catch {
    recent = [];
  }

  // Candidates that haven't been used recently
  let candidates = BOT_NAMES.filter(name => !recent.includes(name));

  // Fallback if history exhausted candidate pool
  if (candidates.length === 0) {
    recent = [];
    candidates = [...BOT_NAMES];
  }

  // Random pick from available candidates
  const chosenIndex = Math.floor(Math.random() * candidates.length);
  const chosenName = candidates[chosenIndex];

  // Update recent history
  recent.push(chosenName);
  if (recent.length > MAX_RECENT_HISTORY) {
    recent.shift();
  }

  try {
    localStorage.setItem(RECENT_NAMES_KEY, JSON.stringify(recent));
  } catch {
    // Ignore storage quota errors
  }

  return chosenName;
}
