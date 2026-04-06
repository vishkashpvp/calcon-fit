"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const routeOrder = ["/dashboard", "/meals", "/squads", "/trends", "/settings", "/profile"];

function getRouteIndex(path: string) {
  const idx = routeOrder.findIndex((r) => path.startsWith(r));
  return idx === -1 ? 0 : idx;
}

const variants = {
  enter: (d: number) => ({ x: d * 80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d * -80, opacity: 0 }),
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentIndex = getRouteIndex(pathname);
  const prevIndex = useRef(currentIndex);
  const directionRef = useRef(0);

  if (currentIndex !== prevIndex.current) {
    directionRef.current = currentIndex > prevIndex.current ? 1 : -1;
    prevIndex.current = currentIndex;
  }

  return (
    <AnimatePresence mode="wait" custom={directionRef.current} initial={false}>
      <motion.div
        key={pathname}
        custom={directionRef.current}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
