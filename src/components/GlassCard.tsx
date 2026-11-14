import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { clsx } from "clsx";

type Glow = "telemetry" | "throttle" | "streak" | "none";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  glow?: Glow;
  /** Set false for cards hosting a Viewport3D — backdrop-blur would smear the WebGL content behind it. */
  blur?: boolean;
}

export function GlassCard({
  children,
  className,
  glow = "none",
  blur = true,
  ...rest
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={clsx(
        "rounded-2xl transition-shadow duration-300",
        blur ? "glass-panel" : "solid-panel",
        glow === "telemetry" && "glow-telemetry",
        glow === "throttle" && "glow-throttle",
        glow === "streak" && "glow-streak",
        className,
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
