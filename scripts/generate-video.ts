import { spawn } from "node:child_process";

import {
  readFile,
  writeFile,
  access,
  mkdir,
} from "node:fs/promises";

import path from "node:path";

import type {
  Story,
  PreparedStory,
} from "../src/models/story";

async function runCommand(
  command: string,
  args: string[]
): Promise<void> {

  return new Promise((resolve, reject) => {

    const child = spawn(command, args, {
      stdio: "inherit",
    });

    child.on("error", reject);

    child.on("close", (code) => {

      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(
            `Command failed: ${command} (${code})`
          )
        );
      }

    });

  });
}

async function validateResources(
  story: Story
): Promise<void> {

  console.log("Validating resources...");

  if (story.scenes.length === 0) {
    throw new Error("The story has no scenes");
  }

  for (const scene of story.scenes) {

    const imagePath = path.join(
      "public",
      scene.image
    );

    await access(imagePath);

    console.log(`Image OK: ${scene.image}`);
  }

  if (story.music?.enabled) {

    const musicPath = path.join(
      "public",
      story.music.file
    );

    await access(musicPath);

    console.log(`Music OK: ${story.music.file}`);
  }
}

async function main(): Promise<void> {

  const startTime = Date.now();

  const storyId = process.argv[2];

  if (!storyId || !/^[a-zA-Z0-9_-]+$/.test(storyId)) {
    throw new Error(
      "Usage: npm run generate-video -- greetings"
    );
  }

  const storyPath = path.join(
    "src",
    "stories",
    `${storyId}.json`
  );

  const content = await readFile(
    storyPath,
    "utf-8"
  );

  const story: Story = JSON.parse(content);

  if (story.id !== storyId) {
    throw new Error(
      "Story ID does not match the filename"
    );
  }

  console.log("\n==================================");
  console.log("VIDEO CREATOR");
  console.log("==================================");
  console.log(`Story: ${story.title}`);
  console.log(`Scenes: ${story.scenes.length}`);

  // STEP 1: Validate resources

  console.log("\n[1/4] Validating resources");

  await validateResources(story);

  // STEP 2: Generate audios and subtitles

  console.log("\n[2/4] Generating audios");

  await runCommand("npx", [
    "tsx",
    "scripts/generate-audios.ts",
    storyPath,
  ]);

  // STEP 3: Prepare story

  console.log("\n[3/4] Preparing story");

  await runCommand("npx", [
    "tsx",
    "scripts/prepare-story.ts",
    storyPath,
  ]);

  const preparedPath = path.join(
    "src",
    "stories",
    `${story.id}.prepared.json`
  );

  const preparedContent = await readFile(
    preparedPath,
    "utf-8"
  );

  const preparedStory: PreparedStory =
    JSON.parse(preparedContent);

  await mkdir("output", {
    recursive: true,
  });

  const propsPath = path.join(
    "output",
    `${story.id}.props.json`
  );

  await writeFile(
    propsPath,
    JSON.stringify(
      { story: preparedStory },
      null,
      2
    ),
    "utf-8"
  );

  // STEP 4: Render video

  console.log("\n[4/4] Rendering video");

  const outputPath = path.join(
    "output",
    `${story.id}.mp4`
  );

  await runCommand("npx", [
    "remotion",
    "render",
    "StoryVideo",
    outputPath,
    `--props=${propsPath}`,
  ]);

  const elapsedSeconds =
    (Date.now() - startTime) / 1000;

  console.log("\n==================================");
  console.log("VIDEO GENERATED SUCCESSFULLY");
  console.log("==================================");
  console.log(`Title: ${story.title}`);
  console.log(`Output: ${outputPath}`);
  console.log(`Time: ${elapsedSeconds.toFixed(2)}s`);
}

main().catch((error) => {

  console.error("\nVIDEO GENERATION FAILED");

  console.error(error);

  process.exitCode = 1;

});