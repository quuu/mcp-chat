"use client";

import { motion } from "framer-motion";
import { Markdown } from "./markdown";
import { cn } from "@/lib/utils";

interface AnimatedMarkdownProps {
  content: string;
  animation?: "dropIn" | "fadeIn" | "slideIn";
  animationDuration?: string;
  animationTimingFunction?: string;
  className?: string;
}

const animations = {
  dropIn: {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  slideIn: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
  },
};

export function AnimatedMarkdown({
  content,
  animation = "dropIn",
  animationDuration = "0.5s",
  animationTimingFunction = "ease-in-out",
  className,
}: AnimatedMarkdownProps) {
  const selectedAnimation = animations[animation];

  return (
    <motion.div
      initial={selectedAnimation.initial}
      animate={selectedAnimation.animate}
      transition={{
        duration: parseFloat(animationDuration),
        ease: animationTimingFunction,
      }}
      className={cn("w-full", className)}
    >
      <Markdown>{content}</Markdown>
    </motion.div>
  );
}
