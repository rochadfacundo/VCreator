import { Composition } from "remotion";

import { MyComposition } from "./Composition";

import type { PreparedStory } from "./models/story";

import "./styles/fonts.css";

const defaultStory: PreparedStory = {
  id: "default",
  title: "VideoCreator",
  language: "en-US",

  video: {
    width: 1920,
    height: 1080,
    fps: 30,
  },

  narrator: {
    voice: "en-US-ChristopherNeural",
    rate: "-10%",
    pitch: "-10Hz",
  },

  scenes: [],

  totalDurationInFrames: 30,
};

export const RemotionRoot = () => {

  return (
    <Composition
      id="StoryVideo"
      component={MyComposition}
      durationInFrames={defaultStory.totalDurationInFrames}
      fps={defaultStory.video.fps}
      width={defaultStory.video.width}
      height={defaultStory.video.height}
      defaultProps={{
        story: defaultStory,
      }}
      calculateMetadata={({ props }) => {

        const currentStory = props.story;

        return {
          durationInFrames:
            currentStory.totalDurationInFrames,

          fps: currentStory.video.fps,

          width: currentStory.video.width,

          height: currentStory.video.height,
        };
      }}
    />
  );
};