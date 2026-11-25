import {
  AbsoluteFill,
  Sequence,
  staticFile,
} from "remotion";

import { Audio } from "@remotion/media";

import type { PreparedStory } from "./models/story";

import { Subtitles } from "./components/Subtitles";
import { AnimatedImage } from "./components/AnimatedImage";
import { SceneTransition } from "./components/SceneTransition";
import { BackgroundMusic } from "./components/BackgroundMusic";

export type StoryCompositionProps = {
  story: PreparedStory;
};

export const MyComposition = ({
  story,
}: StoryCompositionProps) => {

  const transitionFrames = Math.round(
    story.video.fps * 0.5
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>

      {/* ====================================== */}
      {/* CAPA 1: IMÁGENES Y TRANSICIONES        */}
      {/* ====================================== */}

      {story.scenes.map((scene, index) => {

        const isFirstScene = index === 0;

        const isLastScene =
          index === story.scenes.length - 1;

        return (
          <Sequence
            key={`image-${scene.id}`}
            name={`Image ${scene.id}`}
            from={scene.startFrame}
            durationInFrames={
              scene.durationInFrames +
              (isLastScene ? 0 : transitionFrames)
            }
          >
            <SceneTransition
              transitionFrames={transitionFrames}
              isFirstScene={isFirstScene}
            >
              <AnimatedImage
                image={scene.image}
                durationInFrames={scene.durationInFrames}
                sceneId={scene.id}
              />
            </SceneTransition>
          </Sequence>
        );
      })}

      {/* ====================================== */}
      {/* CAPA 2: NARRACIÓN                      */}
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
      {/* CAPA 3: SUBTÍTULOS                     */}
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
      {/* CAPA 4: MÚSICA DE FONDO                */}
      {/* ====================================== */}

      {story.music && (
        <BackgroundMusic music={story.music} />
      )}

    </AbsoluteFill>
  );
};