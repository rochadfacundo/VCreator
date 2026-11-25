import {
    AbsoluteFill,
    interpolate,
    useCurrentFrame,
    Easing,
  } from "remotion";
  
  import type { ReactNode } from "react";
  
  type SceneTransitionProps = {
    children: ReactNode;
    transitionFrames: number;
    isFirstScene: boolean;
  };
  
  export const SceneTransition = ({
    children,
    transitionFrames,
    isFirstScene,
  }: SceneTransitionProps) => {
    const frame = useCurrentFrame();
  
    const opacity = isFirstScene
      ? 1
      : interpolate(
          frame,
          [0, Math.max(1, transitionFrames)],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.sin),
          }
        );
  
    return (
      <AbsoluteFill style={{ opacity }}>
        {children}
      </AbsoluteFill>
    );
  };