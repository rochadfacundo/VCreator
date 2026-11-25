import { createHash } from "node:crypto";

import {
  readFile,
  writeFile,
  stat,
} from "node:fs/promises";

import path from "node:path";

import type {
  Scene,
  NarratorConfig,
} from "../models/story";

export class AudioCacheService {

  private readonly cacheVersion = 1;

  public generateHash(
    scene: Scene,
    narrator: NarratorConfig
  ): string {

    const content = JSON.stringify({
      version: this.cacheVersion,
      provider: "edge-tts",
      text: scene.text,
      voice: narrator.voice,
      rate: narrator.rate,
      pitch: narrator.pitch,
    });

    return createHash("sha256")
      .update(content)
      .digest("hex");
  }

  private getCachePath(audioPath: string): string {

    const parsed = path.parse(audioPath);

    return path.join(
      parsed.dir,
      `${parsed.name}.cache.json`
    );
  }

  private getSubtitlePath(audioPath: string): string {

    const parsed = path.parse(audioPath);

    return path.join(
      parsed.dir,
      `${parsed.name}.srt`
    );
  }

  public async isValid(
    audioPath: string,
    expectedHash: string
  ): Promise<boolean> {

    try {

      const audio = await stat(audioPath);

      const subtitle = await stat(
        this.getSubtitlePath(audioPath)
      );

      if (
        !audio.isFile() ||
        !subtitle.isFile() ||
        audio.size === 0 ||
        subtitle.size === 0
      ) {
        return false;
      }

      const content = await readFile(
        this.getCachePath(audioPath),
        "utf-8"
      );

      const cache = JSON.parse(content);

      return cache.hash === expectedHash;

    } catch {

      return false;

    }
  }

  public async save(
    audioPath: string,
    hash: string
  ): Promise<void> {

    const cache = {
      hash,
      generatedAt: new Date().toISOString(),
    };

    await writeFile(
      this.getCachePath(audioPath),
      JSON.stringify(cache, null, 2),
      "utf-8"
    );
  }
}