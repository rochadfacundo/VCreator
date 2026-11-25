import { SubtitleService } from "../src/services/substitleService";


async function main(): Promise<void> {

  const subtitleService = new SubtitleService();

  const subtitles = await subtitleService.getSubtitles(
    "public/audio/greetings/scene-6.mp3"
  );

  console.table(subtitles);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});