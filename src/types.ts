export interface VosvosConfig {
  bodyColor: string;
  colorName: string;
  presetName: string;
  yearModel: number;
  modelStyle: 'classic' | 'oval' | 'split' | '1303s' | 'cabrio';
  decals: 'none' | 'herbie' | 'flower-power' | 'two-tone' | 'rally';
  roofRack: 'none' | 'luggage' | 'surfboard' | 'skis' | 'flowers';
  tireStyle: 'whitewall' | 'classic-chrome' | 'empi-rally' | 'moon-caps';
  headlightsOn: boolean;
  headlightEyelashes: boolean;
  licensePlate: string;
  bumperStyle: 'classic-chrome' | 'double-tube' | 't-bar';
}

export interface PresetVosvos {
  id: string;
  name: string;
  tagline: string;
  config: VosvosConfig;
  description: string;
}

export interface ModelTimelineItem {
  yearRange: string;
  title: string;
  shortName: string;
  engine: string;
  horsepower: string;
  features: string[];
  historicalNote: string;
  badge: string;
}

export interface VosvosGlobalName {
  country: string;
  name: string;
  flag: string;
  meaning: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  subtitle: string;
  options: {
    text: string;
    icon: string;
    archetype: 'boho' | 'herbie' | 'purist' | 'coastal';
  }[];
}

export interface QuizResult {
  id: string;
  title: string;
  tagline: string;
  description: string;
  suggestedColor: string;
  suggestedPreset: string;
  badgeIcon: string;
}
