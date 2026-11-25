import { TextToSpeechService } from "../src/services/textToSpeechService";

async function main(): Promise<void> {

  const tts = new TextToSpeechService();

  await tts.generateAudio(
    "It was Monday morning. Nick, Tin, and Fax walked into their classroom.",
    "public/audio/scene-1.mp3"
  );

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});