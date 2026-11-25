import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  Easing,
} from "remotion";

import type {
  VisualConfig,
  VisualEffect,
} from "../models/story";

type AnimatedImageProps = {
  image: string;
  durationInFrames: number;
  sceneId: number;
  visual?: VisualConfig;
};

export const AnimatedImage = ({
  image,
  durationInFrames,
  sceneId,
  visual,
}: AnimatedImageProps) => {

  const frame = useCurrentFrame();

  // ======================================
  // 1. CONFIGURACIÓN DEL EFECTO
  // ======================================

  const configuredEffect = visual?.effect ?? "auto";

  const configuredIntensity = visual?.intensity ?? 0.10;

  const intensity = Number.isFinite(configuredIntensity)
    ? Math.max(0, Math.min(0.30, configuredIntensity))
    : 0.10;

  const effect: VisualEffect =
    configuredEffect === "auto"
      ? sceneId % 2 !== 0
        ? "zoom-in"
        : "zoom-out"
      : configuredEffect;

  // ======================================
  // 2. PROGRESO DE LA ANIMACIÓN
  // ======================================

  const progress = interpolate(
    frame,
    [0, Math.max(1, durationInFrames - 1)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.sin),
    }
  );

  // ======================================
  // 3. VALORES INICIALES
  // ======================================

  let scale = 1;
  let translateX = 0;
  let translateY = 0;

  const maxOffset = (intensity / 2) * 100;

  // ======================================
  // 4. APLICAR EFECTO VISUAL
  // ======================================

  switch (effect) {

    case "zoom-in":

      scale = 1 + intensity * progress;

      break;

    case "zoom-out":

      scale = 1 + intensity * (1 - progress);

      break;

    case "pan-left":

      scale = 1 + intensity;

      translateX = maxOffset * (1 - 2 * progress);

      break;

    case "pan-right":

      scale = 1 + intensity;

      translateX = maxOffset * (2 * progress - 1);

      break;

    case "pan-up":

      scale = 1 + intensity;

      translateY = maxOffset * (1 - 2 * progress);

      break;

    case "pan-down":

      scale = 1 + intensity;

      translateY = maxOffset * (2 * progress - 1);

      break;

    case "none":

      break;
  }

  // ======================================
  // 5. RENDERIZAR IMAGEN
  // ======================================

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
      }}
    >
      <Img
        src={staticFile(image)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          transform: `
            translate(${translateX}%, ${translateY}%)
            scale(${scale})
          `,
          transformOrigin: "center center",
        }}
      />
    </AbsoluteFill>
  );
};