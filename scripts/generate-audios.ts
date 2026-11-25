import { readFile, rm } from "node:fs/promises";
import path from "node:path";

import { TextToSpeechService } from "../src/services/textToSpeechService";
import { AudioCacheService } from "../src/services/audioCacheService";

import type { Story } from "../src/models/story";

async function main(): Promise<void> {

  const storyPath =
    process.argv[2] ?? "src/stories/greetings.json";

  const sceneId = process.argv[3] !== undefined
    ? Number(process.argv[3])
    : undefined;

  const content = await readFile(storyPath, "utf-8");

  const story: Story = JSON.parse(content);

  const tts = new TextToSpeechService(story.narrator);

  const cacheService = new AudioCacheService();

  const scenes = sceneId === undefined
    ? story.scenes
    : story.scenes.filter((scene) => scene.id === sceneId);

  if (scenes.length === 0) {
    throw new Error(`Scene not found: ${sceneId}`);
  }

  let generated = 0;
  let reused = 0;

  console.log(`Generating audios: ${story.title}`);

  for (const scene of scenes) {

    const audioPath = path.join(
      "public",
      scene.audio
    );

    // Generar hash de la configuración actual
    const hash = cacheService.generateHash(
      scene,
      story.narrator
    );

    // Verificar si podemos reutilizar los archivos
    const isCached = await cacheService.isValid(
      audioPath,
      hash
    );

    if (isCached) {

      console.log(
        `[CACHE HIT] Scene ${scene.id}: reusing audio and subtitles`
      );

      reused++;

      continue;
    }

    console.log(
      `[CACHE MISS] Scene ${scene.id}: generating audio and subtitles`
    );

    // Invalidar el caché anterior antes de regenerar
    const parsed = path.parse(audioPath);

    const cachePath = path.join(
      parsed.dir,
      `${parsed.name}.cache.json`
    );

    await rm(cachePath, { force: true });

    // Generar narración y subtítulos
    await tts.generateAudio(
      scene.text,
      audioPath
    );

    // Guardar el nuevo hash
    await cacheService.save(
      audioPath,
      hash
    );

    generated++;
  }

  console.log("\n==================================");
  console.log("AUDIO GENERATION SUMMARY");
  console.log("==================================");

  console.log(`Total scenes: ${scenes.length}`);
  console.log(`Generated: ${generated}`);
  console.log(`Reused from cache: ${reused}`);

  console.log("Audios ready!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});