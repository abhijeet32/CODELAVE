"use client";

import { motion } from "framer-motion";
import { AnimatedButton } from "../layout/header";

function CornerBrackets() {
    return (
        <>
            <div className="absolute top-[-1px] left-[-1px] w-1.5 h-1.5 border-t border-l border-white pointer-events-none z-10" />
            <div className="absolute top-[-1px] right-[-1px] w-1.5 h-1.5 border-t border-r border-white pointer-events-none z-10" />
            <div className="absolute bottom-[-1px] left-[-1px] w-1.5 h-1.5 border-b border-l border-white pointer-events-none z-10" />
            <div className="absolute bottom-[-1px] right-[-1px] w-1.5 h-1.5 border-b border-r border-white pointer-events-none z-10" />
        </>
    );
}

function IndicatorBars() {
    return (
        <div className="flex items-center gap-[2px]">
            <span className="inline-block w-[3px] h-[10px] bg-[#E8501E] opacity-30" />
            <span className="inline-block w-[3px] h-[10px] bg-[#E8501E] opacity-60" />
            <span className="inline-block w-[3px] h-[10px] bg-[#E8501E] opacity-100" />
            <span className="inline-block w-[3px] h-[10px] bg-[#E8501E] opacity-60" />
            <span className="inline-block w-[3px] h-[10px] bg-[#E8501E] opacity-30" />
        </div>
    );
}

export default function HeroSection() {
    return (
        <div className="relative overflow-hidden w-full pt-2 md:pt-2 bg-[#070707]">
            {/* Connecting lines for Hero Section */}
            <div className="absolute inset-y-0 left-6 right-6 lg:left-8 lg:right-8 mx-auto w-full max-w-[1400px] pointer-events-none hidden md:block">
                <div className="absolute inset-y-0 left-0 w-[1px] border-l border-dashed border-white/10" />
                <div className="absolute inset-y-0 right-0 w-[1px] border-r border-dashed border-white/10" />
            </div>

            {/* Hero Section */}
            <div className="relative isolate px-6 pt-10 lg:px-8">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.2,
                                delayChildren: 0.1,
                            },
                        },
                    }}
                    className="mx-auto max-w-2xl py-15 sm:py-23 lg:py-30 text-center"
                >
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
                        }}
                        className="relative inline-flex items-center gap-3 px-5 py-2 border border-dashed border-white/10 mb-8 mx-auto"
                    >
                        <CornerBrackets />
                        <IndicatorBars />
                        <span className="text-[13px] tracking-[0.15em] uppercase text-[#969696] font-navbar font-medium">
                            Cloud-Powered Sandboxes
                        </span>
                    </motion.div>

                    <motion.h1
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
                        }}
                        className="text-4xl tracking-tight text-[#F2F2F2] sm:text-7xl font-bold font-hero-heading"
                    >
                        Run AI-Generated Code
                        Safely in the Cloud
                    </motion.h1>
                    <motion.p
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
                        }}
                        className="mt-8 text-[16px] leading-[26px] text-[#969696] font-normal font-navbar max-w-3xl mx-auto"
                    >
                        Codelave gives your AI agent a secure,
                        isolated environment to execute code,
                        analyze data, and build projects —
                        with a single SDK call.
                    </motion.p>
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
                        }}
                        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <AnimatedButton href="/#pricing">
                            View Pricing
                        </AnimatedButton>
                        <AnimatedButton href="/signup">
                            Get Started
                        </AnimatedButton>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
