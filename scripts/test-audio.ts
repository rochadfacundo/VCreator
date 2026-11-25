import { AudioService } from "../src/services/audioService";

async function main(): Promise<void> {

  const audioService = new AudioService();

  let totalDuration = 0;

  for (let i = 1; i <= 7; i++) {

    const duration = await audioService.getDuration(
      `public/audio/greetings/scene-${i}.mp3`
    );

    totalDuration += duration;

    console.log(
      `Scene ${i}: ${duration.toFixed(2)} seconds`
    );

  }

  console.log(
    `Total duration: ${totalDuration.toFixed(2)} seconds`
  );

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});