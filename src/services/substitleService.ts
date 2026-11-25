import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Subtitle } from "../models/story";

export class SubtitleService {

  public async getSubtitles(
    audioPath: string
  ): Promise<Subtitle[]> {

    const subtitlePath = path.join(
      path.dirname(audioPath),
      `${path.parse(audioPath).name}.srt`
    );

    const content = await readFile(
      subtitlePath,
      "utf-8"
    );

    const subtitles = this.parseSrt(content);

    return this.fixOverlaps(subtitles);
  }

  private parseSrt(content: string): Subtitle[] {

    const blocks = content
      .replace(/^\uFEFF/, "")
      .replace(/\r\n/g, "\n")
      .trim()
      .split(/\n\s*\n/);

    return blocks.map(block => {

      const lines = block.split("\n");

      const [start, end] = lines[1].split(" --> ");

      return {
        startMs: this.timestampToMs(start),
        endMs: this.timestampToMs(end),
        text: lines.slice(2).join(" ").trim(),
      };
    });
  }

  private timestampToMs(timestamp: string): number {

    const [hours, minutes, seconds, milliseconds] =
      timestamp.trim().split(/[:,]/).map(Number);

    return (
      hours * 3600000 +
      minutes * 60000 +
      seconds * 1000 +
      milliseconds
    );
  }

  private fixOverlaps(
    subtitles: Subtitle[]
  ): Subtitle[] {

    return subtitles.map((subtitle, index) => {

      const next = subtitles[index + 1];

      return {
        ...subtitle,
        endMs: next
          ? Math.min(subtitle.endMs, next.startMs)
          : subtitle.endMs,
      };
    });
  }
}