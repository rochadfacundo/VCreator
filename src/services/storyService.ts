import { readFile } from "node:fs/promises";
import path from "node:path";

import { AudioService } from "./audioService";


import type {
  Story,
  PreparedStory,
  PreparedScene,
} from "../models/story";
import { SubtitleService } from "./substitleService";

export class StoryService {

  private readonly audioService = new AudioService();
  private readonly subtitleService = new SubtitleService();

  public async prepareStory(
    storyPath: string
  ): Promise<PreparedStory> {

    const content = await readFile(storyPath, "utf-8");

    const story: Story = JSON.parse(content);

    const scenes: PreparedScene[] = [];

    let currentFrame = 0;

    for (const scene of story.scenes) {

      const audioPath = path.join("public", scene.audio);

      const durationInSeconds =
        await this.audioService.getDuration(audioPath);

      const durationInFrames = Math.ceil(
        durationInSeconds * story.video.fps
      );

      const subtitles =
        await this.subtitleService.getSubtitles(audioPath);

      scenes.push({
        ...scene,
        durationInSeconds,
        durationInFrames,
        startFrame: currentFrame,
        subtitles,
      });

      currentFrame += durationInFrames;
    }

    return {
      ...story,
      scenes,
      totalDurationInFrames: currentFrame,
    };
  }
}