import {
    staticFile,
    interpolate,
    useCurrentFrame,
    useVideoConfig,
  } from "remotion";
  
  import { Audio } from "@remotion/media";
  
  import type { MusicConfig } from "../models/story";
  
  type BackgroundMusicProps = {
    music: MusicConfig;
  };
  
  export const BackgroundMusic = ({
    music,
  }: BackgroundMusicProps) => {
  
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();
  
    if (!music.enabled) {
      return null;
    }
  
    // Duración de los desvanecimientos
    const fadeInFrames = Math.round(
      music.fadeInSeconds * fps
    );
  
    const fadeOutFrames = Math.round(
      music.fadeOutSeconds * fps
    );
  
    // Entrada gradual de la música
    const fadeIn = fadeInFrames > 0
      ? interpolate(
          frame,
          [0, fadeInFrames],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        )
      : 1;
  
    // Salida gradual de la música
    const fadeOut = fadeOutFrames > 0
      ? interpolate(
          frame,
          [
            durationInFrames - 1 - fadeOutFrames,
            durationInFrames - 1,
          ],
          [1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        )
      : 1;
  
    // Volumen final
    const volume = music.volume * fadeIn * fadeOut;
  
    return (
      <Audio
        src={staticFile(music.file)}
        volume={volume}
        loop={music.loop}
      />
    );
  };