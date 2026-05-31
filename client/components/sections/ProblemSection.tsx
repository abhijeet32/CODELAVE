"use client";

import { motion } from "framer-motion";

const riskItems = [
    { icon: "⚡", label: "Arbitrary code execution" },
    { icon: "🔓", label: "Privilege escalation" },
    { icon: "🌐", label: "Network exfiltration" },
    { icon: "💾", label: "File system access" },
    { icon: "🔄", label: "Resource exhaustion" },
];

function CornerBrackets({ size = "w-1.5 h-1.5", tl = true, tr = true, bl = true, br = true }: { size?: string; tl?: boolean; tr?: boolean; bl?: boolean; br?: boolean }) {
    return (
        <>
            {tl && <div className={`absolute top-[-1px] left-[-1px] ${size} border-t border-l border-white pointer-events-none z-10`} />}
            {tr && <div className={`absolute top-[-1px] right-[-1px] ${size} border-t border-r border-white pointer-events-none z-10`} />}
            {bl && <div className={`absolute bottom-[-1px] left-[-1px] ${size} border-b border-l border-white pointer-events-none z-10`} />}
            {br && <div className={`absolute bottom-[-1px] right-[-1px] ${size} border-b border-r border-white pointer-events-none z-10`} />}
        </>
    );
}

function IndicatorBars() {
    return (
        <div className="flex items-center gap-[2px]">
            <span className="inline-block w-[3px] h-[10px] bg-[#E8501E] opacity-30" />
            <span className="inline-block w-[3px] h-[10px] bg-[#E8501E] opacity-60" />
            <span className="inline-block w-[3px] h-[10px] bg-[#E8501E]" />
            <span className="inline-block w-[3px] h-[10px] bg-[#E8501E] opacity-60" />
        </div>
    );
}

function SideCard({
    icon,
    title,
    body,
    borderClass = "border",
    tl = true,
    tr = true,
    bl = true,
    br = true,
}: {
    icon: string;
    title: string;
    body: string;
    borderClass?: string;
    tl?: boolean;
    tr?: boolean;
    bl?: boolean;
    br?: boolean;
}) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
            }}
            className={`relative border-dashed border-white/10 bg-[#0F0F0F] p-6 flex flex-col justify-between flex-1 ${borderClass}`}
        >
            <CornerBrackets tl={tl} tr={tr} bl={bl} br={br} />

            <div className="flex items-start justify-between mb-6">
                <span className="text-[19.2px] font-normal text-[#F2F2F2]">{icon}</span>
                <IndicatorBars />
            </div>

            <div>
                <h3 className="text-[24px] font-normal text-[#F2F2F2] font-hero-heading mb-3 tracking-tight leading-snug">
                    {title}
                </h3>
                <p className="text-[16px] leading-[26px] text-[#969696] font-normal font-navbar">
                    {body}
                </p>
            </div>
        </motion.div>
    );
}

export default function ProblemSection() {
    return (
        <section className="relative w-full pt-24 pb-6 px-6 lg:px-8">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.12,
                            delayChildren: 0.1,
                        },
                    },
                }}
                className="relative mx-auto max-w-[1400px] flex flex-col items-center w-full"
            >
                {/* Header Content & Top Connectors */}
                <div className="flex flex-col items-center w-full relative">
                    {/* Connectors up to Navbar */}
                    <div className="absolute -top-24 -bottom-6 left-0 w-[1px] border-l border-dashed border-white/10 pointer-events-none hidden md:block" />
                    <div className="absolute -top-24 -bottom-6 right-0 w-[1px] border-r border-dashed border-white/10 pointer-events-none hidden md:block" />

                    {/* Badge */}
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
                        }}
                        className="relative inline-flex items-center gap-3 px-5 py-2 border border-dashed border-white/10 mb-6"
                    >
                        <CornerBrackets />
                        <IndicatorBars />
                        <span className="text-[13px] tracking-[0.15em] uppercase text-[#969696] font-navbar font-medium">
                            The Problem
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h2
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
                        }}
                        className="text-4xl sm:text-[56px] font-bold text-[#F2F2F2] font-hero-heading text-center tracking-tight leading-tight"
                    >
                        AI Agents Need Somewhere To Run
                    </motion.h2>

                    {/* Subheadline */}
                    <motion.p
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
                        }}
                        className="mt-5 text-[16px] leading-[26px] text-[#969696] font-normal font-navbar text-center max-w-lg"
                    >
                        When your LLM generates code, that code needs to actually execute somewhere.
                        Running it on your own server is dangerous, slow to build, and expensive to maintain.
                    </motion.p>
                </div>

                {/* Bento Grid Wrapper */}
                <div className="relative w-full mt-16 border-l border-r border-dashed border-white/10">
                    <CornerBrackets />
                    <motion.div
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.1,
                                    delayChildren: 0.15,
                                },
                            },
                        }}
                        className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr_1fr] gap-0 w-full"
                    >
                        {/* Left Column */}
                        <div className="flex flex-col gap-0">
                            <SideCard
                                icon="⚠️"
                                title="Security Risk"
                                body="AI-generated code is untrusted. Running it directly on your server can destroy your entire infrastructure in a single execution."
                                borderClass="border-y border-r"
                                tl={false} tr={true} bl={true} br={true}
                            />
                            <SideCard
                                icon="🔧"
                                title="Months To Build"
                                body="Building a secure execution environment from scratch takes months of engineering time that should be spent on your product."
                                borderClass="border-b border-r"
                                tl={false} tr={false} bl={false} br={true}
                            />
                        </div>

                        {/* Center Card */}
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
                            }}
                            className="relative border-y border-r border-dashed border-white/10 bg-[#0F0F0F] overflow-hidden flex flex-col"
                        >
                            <CornerBrackets tl={false} tr={true} bl={false} br={true} />

                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-[15px] font-medium text-[#969696] font-navbar mb-5">
                                    Risk assessment
                                </h3>

                                <div className="flex flex-col gap-0">
                                    {riskItems.map((item, i) => (
                                        <div
                                            key={item.label}
                                            className={`flex items-center justify-between py-3.5 px-4 ${i !== riskItems.length - 1 ? "border-b border-dashed border-white/[0.06]" : ""
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm">{item.icon}</span>
                                                <span className="text-[14px] text-[#969696] font-navbar font-normal">
                                                    {item.label}
                                                </span>
                                            </div>
                                            <div className="w-3.5 h-3.5 bg-[#E8501E]" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Atmospheric gradient at bottom */}
                        </motion.div>

                        {/* Right Column */}
                        <div className="flex flex-col gap-0">
                            <SideCard
                                icon="💸"
                                title="Expensive At Scale"
                                body="Managing infrastructure for thousands of concurrent code executions requires deep cloud and DevOps expertise most teams do not have."
                                borderClass="border-y"
                                tl={false} tr={false} bl={true} br={true}
                            />
                            <SideCard
                                icon="🧩"
                                title="No Standardization"
                                body="Every team reinvents the wheel — different runtimes, different isolation methods, different APIs — with no unified approach to sandboxed execution."
                                borderClass="border-b"
                                tl={false} tr={false} bl={false} br={false}
                            />
                        </div>
                    </motion.div>
                    {/* Connectors down to next section */}
                    <div className="absolute top-full left-0 w-[1px] h-24 border-l border-dashed border-white/10 pointer-events-none hidden md:block" />
                    <div className="absolute top-full right-0 w-[1px] h-24 border-r border-dashed border-white/10 pointer-events-none hidden md:block" />
                </div>
            </motion.div>
        </section>
    );
}
