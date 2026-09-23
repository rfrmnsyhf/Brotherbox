"use client";

/* Scroll reveal — spring physics via `motion`, directional by index so a grid
 * doesn't look like a single block sliding up.
 *
 * `prefers-reduced-motion` is respected at the source (motion reads it
 * natively); the variant simply resolves to a no-op transition there.
 * Content is rendered regardless, only the animation is skipped. */

import { type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "motion/react";

type Direction = "up" | "left" | "right";

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  left: { x: -28, y: 0 },
  right: { x: 28, y: 0 },
};

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Stagger direction. Defaults to "up". */
  direction?: Direction;
} & Omit<HTMLMotionProps<"div">, "children" | "className">;

export const Reveal = ({
  children,
  delay = 0,
  className = "",
  direction = "up",
  ...rest
}: RevealProps) => {
  const offset = OFFSET[direction];

  return (
    <motion.div
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 18,
        mass: 0.9,
        delay: delay / 1000,
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
