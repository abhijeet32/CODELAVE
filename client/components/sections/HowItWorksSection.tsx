/* eslint-disable react/jsx-no-comment-textnodes */
"use client";

import { motion } from "framer-motion";

function CornerBrackets({ tl = true, tr = true, bl = true, br = true }: { tl?: boolean; tr?: boolean; bl?: boolean; br?: boolean }) {
    return (
        <>
            {tl && <div className="absolute top-[-1px] left-[-1px] w-1.5 h-1.5 border-t border-l border-white pointer-events-none z-10" />}
            {tr && <div className="absolute top-[-1px] right-[-1px] w-1.5 h-1.5 border-t border-r border-white pointer-events-none z-10" />}
            {bl && <div className="absolute bottom-[-1px] left-[-1px] w-1.5 h-1.5 border-b border-l border-white pointer-events-none z-10" />}
            {br && <div className="absolute bottom-[-1px] right-[-1px] w-1.5 h-1.5 border-b border-r border-white pointer-events-none z-10" />}
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

const steps = [
    {
        number: "01",
        title: "Your AI Generates Code",
        body: "Your LLM (GPT-4, Claude, or any model) generates code based on the user's request. This happens entirely on your side.",
        visual: "code",
    },
    {
        number: "02",
        title: "You Call The SDK",
        body: "Pass the generated code to Codelave via our Node.js or Python SDK. One function call is all it takes.",
        visual: "sdk",
    },
    {
        number: "03",
        title: "We Spin Up A Sandbox",
        body: "Codelave instantly creates a fresh, isolated container in the cloud. Completely separate from every other user.",
        visual: "sandbox",
    },
    {
        number: "04",
        title: "Code Runs Safely",
        body: "The code executes inside the sandbox with strict resource limits and network isolation. Nothing can escape.",
        visual: "execute",
    },
    {
        number: "05",
        title: "Output Returns To You",
        body: "Execution output streams back to your application in real time. You decide what to show your users.",
        visual: "output",
    },
];

function StepVisual({ type }: { type: string }) {
    switch (type) {
        case "code":
            return (
                <div className="space-y-2 font-mono text-[13px]">
                    <div><span className="text-[#525252]">const</span> <span className="text-[#E8501E]">code</span> <span className="text-[#525252]">=</span> <span className="text-[#696969]">await</span> <span className="text-[#969696]">llm</span><span className="text-[#525252]">.</span><span className="text-[#969696]">generate</span><span className="text-[#525252]">(</span><span className="text-[#4ade80]">&quot;prompt&quot;</span><span className="text-[#525252]">)</span></div>
                    <div><span className="text-[#525252]">const</span> <span className="text-[#E8501E]">result</span> <span className="text-[#525252]">=</span> <span className="text-[#969696]">parse</span><span className="text-[#525252]">(</span><span className="text-[#969696]">code</span><span className="text-[#525252]">)</span></div>
                    <div className="text-[#525252]">// Ready to execute →</div>
                </div>
            );
        case "sdk":
            return (
                <div className="space-y-2 font-mono text-[13px]">
                    <div><span className="text-[#525252]">import</span> <span className="text-[#969696]">{'{ Codelave }'}</span> <span className="text-[#525252]">from</span> <span className="text-[#4ade80]">&quot;codelave&quot;</span></div>
                    <div className="mt-2"><span className="text-[#696969]">await</span> <span className="text-[#969696]">codelave</span><span className="text-[#525252]">.</span><span className="text-[#E8501E]">run</span><span className="text-[#525252]">(</span><span className="text-[#969696]">code</span><span className="text-[#525252]">)</span></div>
                </div>
            );
        case "sandbox":
            return (
                <div className="flex items-end justify-between gap-[3px] h-[80px]">
                    {[2, 4, 3, 6, 5, 7, 4, 8, 6, 9, 7, 5, 8, 6, 10, 7, 9, 11].map((h, i) => (
                        <div
                            key={i}
                            className="flex-1 bg-[#F2F2F2] transition-all"
                            style={{
                                height: `${h * 6}px`,
                                opacity: 0.1 + (i / 18) * 0.9,
                            }}
                        />
                    ))}
                </div>
            );
        case "execute":
            return (
                <div className="space-y-3">
                    {[
                        { label: "CPU", value: "2 cores", w: "60%" },
                        { label: "Memory", value: "512 MB", w: "45%" },
                        { label: "Network", value: "Isolated", w: "30%" },
                    ].map((item) => (
                        <div key={item.label} className="space-y-1.5">
                            <div className="flex justify-between text-[13px]">
                                <span className="text-[#525252] font-navbar">{item.label}</span>
                                <span className="text-[#696969] font-mono">{item.value}</span>
                            </div>
                            <div className="h-[4px] w-full bg-white/[0.04] overflow-hidden">
                                <div className="h-full bg-[#E8501E]" style={{ width: item.w, opacity: 0.7 }} />
                            </div>
                        </div>
                    ))}
                </div>
            );
        case "output":
            return (
                <div className="space-y-2 font-mono text-[12px]">
                    <div className="flex gap-2"><span className="text-[#525252]">→</span><span className="text-[#696969]">Container ready</span></div>
                    <div className="flex gap-2"><span className="text-[#525252]">→</span><span className="text-[#E8501E]">Running...</span></div>
                    <div className="flex gap-2"><span className="text-[#525252]">→</span><span className="text-[#969696]">{`{ "result": "ok" }`}</span></div>
                    <div className="flex gap-2"><span className="text-[#525252]">→</span><span className="text-[#4ade80]">✓ Complete</span></div>
                </div>
            );
        default:
            return null;
    }
}

export default function HowItWorksSection() {
    return (
        <section className="relative w-full pt-24 pb-6 px-6 lg:px-8">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.1,
                            delayChildren: 0.1,
                        },
                    },
                }}
                className="relative mx-auto max-w-[1400px] flex flex-col items-center w-full"
            >
                {/* Header Content & Top Connectors */}
                <div className="flex flex-col items-center w-full relative">
                    {/* Connectors up to previous section */}
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
                            How It Works
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
                        From Prompt to Execution in Seconds
                    </motion.h2>

                    <motion.p
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
                        }}
                        className="mt-5 text-[16px] leading-[26px] text-[#969696] font-normal font-navbar text-center max-w-lg"
                    >
                        Five simple steps from code generation to secure execution.
                        No infrastructure to manage, no security to worry about.
                    </motion.p>
                </div>

                {/* Grid Wrapper */}
                <div className="relative w-full mt-16 border-l border-r border-dashed border-white/10">
                    <CornerBrackets />

                    {/* Row 1: Steps 01-03 */}
                    <motion.div
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.1, delayChildren: 0.1 },
                            },
                        }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-0 w-full"
                    >
                        {steps.slice(0, 3).map((step, i) => (
                            <motion.div
                                key={step.number}
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
                                }}
                                className={`group relative border-dashed border-white/10 bg-[#0F0F0F] flex flex-col transition-colors hover:bg-[#141414] ${i === 0 ? "border-y border-r" : i === 1 ? "border-y border-r" : "border-y"
                                    }`}
                            >
                                <CornerBrackets tl={false} tr={i !== 2} bl={i === 0} br={true} />

                                {/* Header */}
                                <div className="p-5 pb-0 flex items-start justify-between">
                                    <span className="text-[19.2px] font-normal text-[#F2F2F2] font-hero-heading">{step.number}</span>
                                    <IndicatorBars />
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1">
                                    <h3 className="text-[24px] font-normal text-[#F2F2F2] font-hero-heading mb-3 tracking-tight leading-snug">
                                        {step.title}
                                    </h3>
                                    <p className="text-[16px] leading-[26px] text-[#969696] font-normal font-navbar">
                                        {step.body}
                                    </p>
                                </div>

                                {/* Visual Panel */}
                                <div className="relative p-5 bg-[#0F0F0F]">
                                    <StepVisual type={step.visual} />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Row 2: Steps 04-05 (50/50) */}
                    <motion.div
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.08, delayChildren: 0.15 },
                            },
                        }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-0 w-full"
                    >
                        {steps.slice(3).map((step, i) => (
                            <motion.div
                                key={step.number}
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
                                }}
                                className={`group relative border-dashed border-white/10 bg-[#0F0F0F] flex flex-col transition-colors hover:bg-[#141414] ${i === 0 ? "border-b border-r" : "border-b"
                                    }`}
                            >
                                <CornerBrackets tl={false} tr={i === 0} bl={false} br={i === 0} />

                                {/* Header */}
                                <div className="p-5 pb-0 flex items-start justify-between">
                                    <span className="text-[19.2px] font-normal text-[#F2F2F2] font-hero-heading">{step.number}</span>
                                    <IndicatorBars />
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1">
                                    <h3 className="text-[24px] font-normal text-[#F2F2F2] font-hero-heading mb-3 tracking-tight leading-snug">
                                        {step.title}
                                    </h3>
                                    <p className="text-[16px] leading-[26px] text-[#969696] font-normal font-navbar">
                                        {step.body}
                                    </p>
                                </div>

                                {/* Visual Panel */}
                                <div className="relative p-5 bg-[#0F0F0F]">
                                    <StepVisual type={step.visual} />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                    {/* Connectors down to next section */}
                    <div className="absolute top-full left-0 w-[1px] h-24 border-l border-dashed border-white/10 pointer-events-none hidden md:block" />
                    <div className="absolute top-full right-0 w-[1px] h-24 border-r border-dashed border-white/10 pointer-events-none hidden md:block" />
                </div>
            </motion.div>
        </section>
    );
}
