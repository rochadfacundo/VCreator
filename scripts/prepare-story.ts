import { writeFile } from "node:fs/promises";
import path from "node:path";
import { StoryService } from "../src/services/storyService";

async function main(): Promise<void> {

  const storyPath = process.argv[2] ?? "src/stories/greetings.json";

  const storyService = new StoryService();

  const story = await storyService.prepareStory(storyPath);

  const outputPath = path.join(
    path.dirname(storyPath),
    `${story.id}.prepared.json`
  );

  await writeFile(outputPath,JSON.stringify(story, null, 2),"utf-8");

  console.log(`Story prepared: ${story.title}`);

  console.table(
    story.scenes.map((scene) => ({
      scene: scene.id,
      seconds: scene.durationInSeconds.toFixed(2),
      frames: scene.durationInFrames,
      startFrame: scene.startFrame,
    }))
  );

  console.log(`Total frames: ${story.totalDurationInFrames}`);

  console.log(`Saved to: ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});