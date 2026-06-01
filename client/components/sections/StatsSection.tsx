/* eslint-disable react/jsx-no-comment-textnodes */
"use client";

import { motion } from "framer-motion";

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

export default function StatsSection() {
    const stats = [
        {
            value: "< 500ms",
            label: "Sandbox startup time",
            desc: "Rapid VM provisioning on-demand"
        },
        {
            value: "99.9%",
            label: "Uptime guaranteed",
            desc: "Highly available server architecture"
        },
        {
            value: "3",
            label: "Lines of SDK code to start",
            desc: "Minimal developer configuration needed"
        },
        {
            value: "100%",
            label: "Isolated per user",
            desc: "Dedicated secure virtualization wrappers"
        }
    ];

    return (
        <section className="relative w-full pt-24 pb-6 px-6 lg:px-8 bg-[#070707] overflow-hidden">
            {/* Subtle grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />
            
            {/* Background radial highlight glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,80,30,0.03)_0%,transparent_75%)] pointer-events-none z-0" />
            
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.1,
                        },
                    },
                }}
                className="relative mx-auto max-w-[1400px] w-full z-10"
            >
                {/* Continuous side vertical lines to keep layout alignment intact */}
                <div className="absolute -top-24 -bottom-6 left-0 w-[1px] border-l border-dashed border-white/10 pointer-events-none hidden md:block" />
                <div className="absolute -top-24 -bottom-6 right-0 w-[1px] border-r border-dashed border-white/10 pointer-events-none hidden md:block" />

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            variants={{
                                hidden: { opacity: 0, y: 25 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                            }}
                            className="relative flex flex-col justify-between p-8 bg-[#090909]/90 border border-dashed border-white/10 rounded-lg hover:border-white/20 transition-all duration-300 group"
                        >
                            <CornerBrackets />
                            
                            {/* Inner soft glow on hover */}
                            <div className="absolute inset-0 bg-gradient-to-b from-[#E8501E]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" />

                            <div>
                                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#525252] block mb-5 select-none">
                                    // METRIC_0{idx + 1}
                                </span>
                                
                                <div className="font-hero-heading text-4xl lg:text-5xl font-bold text-white tracking-tight leading-none mb-3 group-hover:text-[#E8501E] transition-colors duration-300">
                                    {stat.value}
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="font-navbar text-sm font-semibold text-[#F2F2F2] tracking-wide mb-1">
                                    {stat.label}
                                </h3>
                                <p className="font-navbar text-xs text-[#828282] leading-relaxed">
                                    {stat.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
