"use client";

import { motion } from "framer-motion";
import Link from "next/link";

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

export default function CtaSection() {
    return (
        <section className="relative w-full pt-24 pb-[120px] px-6 lg:px-8">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                            duration: 0.6,
                            ease: "easeOut",
                        },
                    },
                }}
                className="relative mx-auto max-w-[1400px] flex flex-col items-center w-full"
            >
                {/* Side border lines extending past top/bottom padding to connect sections */}
                <div className="absolute -top-24 -bottom-[120px] left-0 w-[1px] border-l border-dashed border-white/10 pointer-events-none hidden md:block" />
                <div className="absolute -top-24 -bottom-[120px] right-0 w-[1px] border-r border-dashed border-white/10 pointer-events-none hidden md:block" />

                {/* CTA Container with wavy background */}
                <div className="relative w-full border-y border-dashed border-white/10 bg-[#0F0F0F] px-6 py-16 md:px-16 md:py-20 flex flex-col items-center text-center">
                    <CornerBrackets />
                    {/* Background image & overlay wrapped in overflow-hidden wrapper to prevent corner bracket clipping */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[inherit]">
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-85"
                            style={{ backgroundImage: "url('/pricing-bg.png')" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                        {/* Headline */}
                        <h2 className="font-hero-heading text-4xl sm:text-[56px] font-bold text-[#F2F2F2] tracking-tight leading-tight mb-6">
                            Give Your AI Agent<br />
                            A Place To Work
                        </h2>

                        {/* Subheadline */}
                        <p className="font-navbar text-[16px] leading-[26px] text-[#969696] max-w-xl mb-10">
                            Join developers building the next generation of AI applications with Codelave. Start for free. No credit card required.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                            <Link
                                href="/signup"
                                className="relative inline-flex items-center justify-center gap-3 px-6 py-3 bg-[#E8501E] text-white font-navbar text-sm font-medium transition-all hover:bg-[#ff622e] border border-dashed border-[#E8501E] w-full sm:w-auto"
                            >
                                <CornerBrackets />
                                <span>Start Building Free</span>
                            </Link>
                            <Link
                                href="/dashboard/sdk"
                                className="relative inline-flex items-center justify-center gap-3 px-6 py-3 border border-dashed border-white/10 text-[#969696] hover:text-[#d4d4d4] font-navbar text-sm font-medium transition-all w-full sm:w-auto"
                            >
                                <CornerBrackets />
                                <span>Read The Docs</span>
                            </Link>
                        </div>

                        {/* Below Buttons Footer */}
                        <div className="text-xs tracking-[0.15em] uppercase text-[#525252] font-mono mt-8 flex items-center gap-2">
                            <span>Free tier</span>
                            <span className="text-[#E8501E]">·</span>
                            <span>No credit card</span>
                            <span className="text-[#E8501E]">·</span>
                            <span>Open source</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
