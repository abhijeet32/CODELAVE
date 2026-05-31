"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function SplashScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#111111] overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* Main content */}
            <div className="flex flex-col items-center gap-0 z-[1]">
              {/* Brand name: Codelave. */}
              <motion.h1
                className="font-serif text-[4.5rem] font-normal -tracking-tight text-white block overflow-visible mb-8 leading-[1.1] max-md:text-5xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.3,
                }}
              >
                Codelave<span className="text-[#E8501E]">.</span>
              </motion.h1>

              {/* Loading bar */}
              <motion.div
                className="w-70 h-1 bg-[#2a2a2a] rounded-none overflow-hidden relative max-md:w-[200px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.4 }}
              >
                <motion.div
                  className="h-full bg-[#C74A1A] rounded-none shadow-none"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 1.6,
                    delay: 1.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Landing page content fades in after splash */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showSplash ? 0 : 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ visibility: showSplash ? "hidden" : "visible" }}
      >
        {children}
      </motion.div>
    </>
  );
}
