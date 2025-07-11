// Core types for the Fighting Fantasy game system

export interface Character {
  id: string;
  name: string;
  skill: number;
  stamina: number;
  luck: number;
  maxSkill: number;
  maxStamina: number;
  maxLuck: number;
  provisions: number;
  gold: number;
  inventory: InventoryItem[];
  equipment: Equipment;
  notes: string[];
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  type: 'weapon' | 'armor' | 'shield' | 'item' | 'treasure' | 'provision';
  bonuses?: StatModifier[];
  value?: number;
}

export interface Equipment {
  weapon?: InventoryItem;
  armor?: InventoryItem;
  shield?: InventoryItem;
}

export interface StatModifier {
  stat: 'skill' | 'stamina' | 'luck';
  value: number;
  type: 'add' | 'multiply';
}

export interface GameSection {
  id: string;
  title?: string;
  text: string;
  illustration?: string;
  choices: Choice[];
  events: GameEvent[];
  requirements?: Requirement[];
}

export interface Choice {
  id: string;
  text: string;
  targetSectionId: string;
  requirements?: Requirement[];
  consequences?: Consequence[];
}

export interface GameEvent {
  id: string;
  type: 'test' | 'combat' | 'treasure' | 'damage' | 'heal' | 'status';
  description: string;
  parameters: EventParameters;
  trigger: 'immediate' | 'choice' | 'conditional';
}

export interface EventParameters {
  // Test parameters
  testType?: 'skill' | 'stamina' | 'luck';
  difficulty?: number;
  successSection?: string;
  failureSection?: string;
  
  // Combat parameters
  enemyName?: string;
  enemySkill?: number;
  enemyStamina?: number;
  specialRules?: string[];
  
  // Treasure parameters
  items?: InventoryItem[];
  gold?: number;
  
  // Damage/Heal parameters
  amount?: number;
  targetStat?: 'skill' | 'stamina' | 'luck';
  
  // Status parameters
  statusEffect?: string;
  duration?: number;
}

export interface Requirement {
  type: 'stat' | 'item' | 'flag' | 'roll';
  stat?: 'skill' | 'stamina' | 'luck';
  value?: number;
  operator?: '>' | '<' | '>=' | '<=' | '==' | '!=';
  itemId?: string;
  flagId?: string;
  flagValue?: boolean;
}

export interface Consequence {
  type: 'stat' | 'item' | 'flag' | 'gold';
  stat?: 'skill' | 'stamina' | 'luck';
  value?: number;
  itemId?: string;
  flagId?: string;
  flagValue?: boolean;
}

export interface Adventure {
  id: string;
  title: string;
  author: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedPlayTime: number;
  sections: GameSection[];
  startingSectionId: string;
  initialCharacter: Partial<Character>;
  illustrations?: { [sectionId: string]: string };
}

export interface GameState {
  character: Character;
  currentSectionId: string;
  visitedSections: string[];
  gameFlags: { [key: string]: boolean };
  combatState?: CombatState;
  saveTimestamp: number;
}

export interface CombatState {
  enemy: {
    name: string;
    skill: number;
    stamina: number;
    maxStamina: number;
  };
  round: number;
  playerAttackRoll?: number;
  enemyAttackRoll?: number;
  damage?: number;
  isPlayerTurn: boolean;
  specialRules: string[];
}

export interface DiceRoll {
  id: string;
  dice: number[];
  total: number;
  timestamp: number;
  type: 'stat' | 'combat' | 'test' | 'damage';
  context?: string;
}

// AI Creator types
export interface AICreatorRequest {
  type: 'adventure' | 'section' | 'character' | 'expand';
  prompt: string;
  theme?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  length?: 'short' | 'medium' | 'long';
  existingAdventure?: Adventure;
  targetSectionId?: string;
}

export interface AICreatorResponse {
  success: boolean;
  data?: Adventure | GameSection | Character;
  error?: string;
  suggestions?: string[];
}

// UI Component Props
export interface DiceComponentProps {
  numDice: number;
  numSides: number;
  onRoll: (roll: DiceRoll) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  autoRoll?: boolean;
}

export interface CharacterSheetProps {
  character: Character;
  onCharacterChange: (character: Character) => void;
  onRollDice: (type: 'skill' | 'stamina' | 'luck') => void;
  readOnly?: boolean;
}

export interface GameSectionProps {
  section: GameSection;
  character: Character;
  onChoiceSelect: (choice: Choice) => void;
  onEventTrigger: (event: GameEvent) => void;
  textSpeed?: number;
  enableTTS?: boolean;
}

export interface AdventureGameProps {
  adventure: Adventure;
  onSave: (gameState: GameState) => void;
  onLoad: (gameState: GameState) => void;
  debugMode?: boolean;
}

// Utility types
export type StatType = 'skill' | 'stamina' | 'luck';
export type GameMode = 'play' | 'create' | 'edit';
export type SaveSlot = 1 | 2 | 3 | 4 | 5;

export interface GameSettings {
  textSpeed: number;
  enableTTS: boolean;
  enableAnimations: boolean;
  enableSound: boolean;
  theme: 'light' | 'dark' | 'parchment';
  debugMode: boolean;
}