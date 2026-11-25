import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { Subtitle } from "../models/story";

type SubtitlesProps = {
  subtitles: Subtitle[];
};

export const Subtitles = ({ subtitles }: SubtitlesProps) => {

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentMs = (frame / fps) * 1000;

  const activeSubtitle = subtitles.find(
    subtitle =>
      currentMs >= subtitle.startMs &&
      currentMs < subtitle.endMs
  );

  if (!activeSubtitle) {
    return null;
  }

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 65,
      }}
    >
      <div
        style={{
            fontFamily: "Nunito, sans-serif",
            fontSize: 54,
            fontWeight: 600,
            color: "#FFFFFF",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            padding: "16px 30px",
            borderRadius: 12,
            maxWidth: "85%",
            textAlign: "center",
            lineHeight: 1.3,
        }}
        >
        {activeSubtitle.text}
      </div>
    </AbsoluteFill>
  );
};