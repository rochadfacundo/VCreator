import {
    AbsoluteFill,
    interpolate,
    useCurrentFrame,
    Easing,
  } from "remotion";
  
  import type { ReactNode } from "react";
  import type { TransitionType } from "../models/story";
  
  // ======================================
  // PROPIEDADES
  // ======================================
  
  type SceneTransitionProps = {
    children: ReactNode;
    transitionFrames: number;
    isFirstScene: boolean;
    type?: TransitionType;
  };
  
  // ======================================
  // TRANSICIÓN ENTRE ESCENAS
  // ======================================
  
  export const SceneTransition = ({
    children,
    transitionFrames,
    isFirstScene,
    type = "fade",
  }: SceneTransitionProps) => {
  
    const frame = useCurrentFrame();
  
    const shouldAnimate =
      !isFirstScene &&
      type === "fade" &&
      transitionFrames > 0;
  
    const opacity = shouldAnimate
      ? interpolate(
          frame,
          [0, transitionFrames],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.sin),
          }
        )
      : 1;
  
    return (
      <AbsoluteFill style={{ opacity }}>
        {children}
      </AbsoluteFill>
    );
  };