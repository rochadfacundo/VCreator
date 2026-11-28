import type {
    VisualConfig,
    VisualEffect,
    TransitionType,
  } from "../models/story";
  
  // ======================================
  // CONFIGURACIÓN VISUAL RESUELTA
  // ======================================
  
  export interface ResolvedVisualConfig {
    effect: VisualEffect;
    intensity: number;
    transition: {
      type: TransitionType;
      durationInSeconds: number;
    };
  }
  
  // ======================================
  // VALORES PREDETERMINADOS
  // ======================================
  
  const DEFAULT_VISUAL_CONFIG: ResolvedVisualConfig = {
    effect: "auto",
    intensity: 0.10,
    transition: {
      type: "fade",
      durationInSeconds: 0.5,
    },
  };
  
  // ======================================
  // RESOLVER CONFIGURACIÓN VISUAL
  // ======================================
  
  export function resolveVisualConfig(
    storyVisual?: VisualConfig,
    sceneVisual?: VisualConfig
  ): ResolvedVisualConfig {
  
    const effect =
      sceneVisual?.effect ??
      storyVisual?.effect ??
      DEFAULT_VISUAL_CONFIG.effect;
  
    const intensity =
      sceneVisual?.intensity ??
      storyVisual?.intensity ??
      DEFAULT_VISUAL_CONFIG.intensity;
  
    const transitionType =
      sceneVisual?.transition?.type ??
      storyVisual?.transition?.type ??
      DEFAULT_VISUAL_CONFIG.transition.type;
  
    const transitionDuration =
      sceneVisual?.transition?.durationInSeconds ??
      storyVisual?.transition?.durationInSeconds ??
      DEFAULT_VISUAL_CONFIG.transition.durationInSeconds;
  
    return {
      effect,
  
      intensity: Number.isFinite(intensity)
        ? Math.max(0, Math.min(0.30, intensity))
        : DEFAULT_VISUAL_CONFIG.intensity,
  
      transition: {
        type: transitionType,
  
        durationInSeconds: transitionType === "none"
          ? 0
          : Number.isFinite(transitionDuration)
            ? Math.max(0, Math.min(3, transitionDuration))
            : DEFAULT_VISUAL_CONFIG.transition.durationInSeconds,
      },
    };
  }