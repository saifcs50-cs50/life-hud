import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { clsx } from "clsx";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  /** Set false for cards hosting a Viewport3D. They use solid-panel, which must never get a backdrop-filter: it would smear the WebGL content behind it. */
  blur?: boolean;
}

export function GlassCard({
  children,
  className,
  blur = true,
  ...rest
}: GlassCardProps) {
  return (
    <motion.div
      className={clsx(
        "rounded-lg",
        blur ? "glass-panel" : "solid-panel",
        className,
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
