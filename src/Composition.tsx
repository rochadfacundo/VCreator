import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";

import type { PreparedStory } from "./models/story";

import { Subtitles } from "./components/Subtitles";
import { AnimatedImage } from "./components/AnimatedImage";
import { SceneTransition } from "./components/SceneTransition";
import { BackgroundMusic } from "./components/BackgroundMusic";

import { resolveVisualConfig } from "./utils/visualConfig";

// ======================================
// PROPIEDADES
// ======================================

export type StoryCompositionProps = {
  story: PreparedStory;
};

// ======================================
// COMPOSICIÓN PRINCIPAL
// ======================================

export const MyComposition = ({
  story,
}: StoryCompositionProps) => {

  // ======================================
  // CONFIGURACIÓN VISUAL DE LAS ESCENAS
  // ======================================

  const visualScenes = story.scenes.map((scene, index) => {

    const visual = resolveVisualConfig(
      story.visual,
      scene.visual
    );

    const requestedTransitionFrames = Math.round(
      visual.transition.durationInSeconds * story.video.fps
    );

    const transitionFrames =
      index === 0 || visual.transition.type === "none"
        ? 0
        : Math.max(
            0,
            Math.min(
              requestedTransitionFrames,
              scene.durationInFrames - 1
            )
          );

    return {
      scene,
      visual,
      transitionFrames,
    };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>

      {/* ====================================== */}
      {/* CAPA 1: IMÁGENES Y TRANSICIONES */}
      {/* ====================================== */}

      {visualScenes.map((item, index) => {

        const {
          scene,
          visual,
          transitionFrames,
        } = item;

        const nextTransitionFrames =
          visualScenes[index + 1]?.transitionFrames ?? 0;

        return (
          <Sequence
            key={`image-${scene.id}`}
            name={`Image ${scene.id}`}
            from={scene.startFrame}
            durationInFrames={
              scene.durationInFrames + nextTransitionFrames
            }
          >
            <SceneTransition
              transitionFrames={transitionFrames}
              isFirstScene={index === 0}
              type={visual.transition.type}
            >
              <AnimatedImage
                image={scene.image}
                durationInFrames={scene.durationInFrames}
                sceneId={scene.id}
                visual={visual}
              />
            </SceneTransition>
          </Sequence>
        );
      })}

      {/* ====================================== */}
      {/* CAPA 2: NARRACIÓN */}
      {/* ====================================== */}

      {story.scenes.map((scene) => (
        <Sequence
          key={`audio-${scene.id}`}
          name={`Audio ${scene.id}`}
          from={scene.startFrame}
          durationInFrames={scene.durationInFrames}
        >
          <Audio src={staticFile(scene.audio)} />
        </Sequence>
      ))}

      {/* ====================================== */}
      {/* CAPA 3: SUBTÍTULOS */}
      {/* ====================================== */}

      {story.scenes.map((scene) => (
        <Sequence
          key={`subtitles-${scene.id}`}
          name={`Subtitles ${scene.id}`}
          from={scene.startFrame}
          durationInFrames={scene.durationInFrames}
        >
          <Subtitles subtitles={scene.subtitles} />
        </Sequence>
      ))}

      {/* ====================================== */}
      {/* CAPA 4: MÚSICA DE FONDO */}
      {/* ====================================== */}

      {story.music && (
        <BackgroundMusic music={story.music} />
      )}

    </AbsoluteFill>
  );
};