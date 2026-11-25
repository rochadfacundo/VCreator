export interface NarratorConfig {
  voice: string;
  rate: string;
  pitch: string;
}

export interface VideoConfig {
  width: number;
  height: number;
  fps: number;
}

// ======================================
// CONFIGURACIÓN VISUAL
// ======================================

export type VisualEffect =
  | "auto"
  | "none"
  | "zoom-in"
  | "zoom-out"
  | "pan-left"
  | "pan-right"
  | "pan-up"
  | "pan-down";

export type TransitionType =
  | "none"
  | "fade";

export interface TransitionConfig {
  type?: TransitionType;
  durationInSeconds?: number;
}

export interface VisualConfig {
  effect?: VisualEffect;
  intensity?: number;
  transition?: TransitionConfig;
}

// ======================================
// CONFIGURACIÓN MUSICAL
// ======================================

export interface MusicConfig {
  enabled: boolean;
  file: string;
  volume: number;
  loop: boolean;
  fadeInSeconds: number;
  fadeOutSeconds: number;
}

// ======================================
// ESCENAS E HISTORIAS
// ======================================

export interface Scene {
  id: number;
  image: string;
  audio: string;
  text: string;
  visual?: VisualConfig;
}

export interface Story {
  id: string;
  title: string;
  language: string;
  video: VideoConfig;
  narrator: NarratorConfig;
  music?: MusicConfig;
  visual?: VisualConfig;
  scenes: Scene[];
}

// ======================================
// SUBTÍTULOS
// ======================================

export interface Subtitle {
  startMs: number;
  endMs: number;
  text: string;
}

// ======================================
// HISTORIA PROCESADA
// ======================================

export interface PreparedScene extends Scene {
  durationInSeconds: number;
  durationInFrames: number;
  startFrame: number;
  subtitles: Subtitle[];
}

export interface PreparedStory extends Story {
  scenes: PreparedScene[];
  totalDurationInFrames: number;
}