import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const execFileAsync = promisify(execFile);

export interface VoiceConfig {
  voice: string;
  rate: string;
  pitch: string;
}

export class TextToSpeechService {

  private readonly executable = path.resolve(
    ".venv/bin/edge-tts"
  );

  constructor(
    private readonly config: VoiceConfig = {
      voice: "en-US-ChristopherNeural",
      rate: "-10%",
      pitch: "-10Hz",
    }
  ) {}

  public async generateAudio(
    text: string,
    outputPath: string
  ): Promise<void> {

    const absolutePath = path.resolve(outputPath);

    const subtitlePath = path.join(
      path.dirname(absolutePath),
      `${path.parse(absolutePath).name}.srt`
    );

    await mkdir(
      path.dirname(absolutePath),
      { recursive: true }
    );

    await execFileAsync(this.executable, [
      "--voice", this.config.voice,
      `--rate=${this.config.rate}`,
      `--pitch=${this.config.pitch}`,
      "--text", text,
      "--write-media", absolutePath,
      "--write-subtitles", subtitlePath,
    ]);

    console.log(`Audio generated: ${outputPath}`);
    console.log(`Subtitles generated: ${subtitlePath}`);
  }
}