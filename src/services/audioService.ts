import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

const execFileAsync = promisify(execFile);

export class AudioService {

  public async getDuration(
    audioPath: string
  ): Promise<number> {

    const absolutePath = path.resolve(audioPath);

    const { stdout } = await execFileAsync("ffprobe", [
      "-v", "error",
      "-show_entries", "format=duration",
      "-of", "default=noprint_wrappers=1:nokey=1",
      absolutePath,
    ]);

    const duration = Number(stdout.trim());

    if (!Number.isFinite(duration) || duration <= 0) {
      throw new Error(
        `Invalid audio duration: ${audioPath}`
      );
    }

    return duration;
  }
}