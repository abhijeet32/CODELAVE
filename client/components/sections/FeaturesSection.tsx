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

function CheckIcon() {
    return (
        <div className="w-5 h-5 shrink-0 flex items-center justify-center text-[#E8501E]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    );
}

/* ── Mock UI Illustrations for each feature ── */

function SecureIllustration() {
    return (
        <div className="relative w-full max-w-[320px] mx-auto">
            <div className="relative border border-dashed border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm p-1">
                <div className="absolute top-[-1px] left-[-1px] w-1.5 h-1.5 border-t border-l border-white pointer-events-none z-10" />
                {[
                    { icon: "🔒", label: "Container isolated", status: "active" },
                    { icon: "🛡️", label: "Network sandboxed", status: "active" },
                    { icon: "📂", label: "Filesystem locked", status: "active" },
                    { icon: "⚙️", label: "Process space sealed", status: "active" },
                    { icon: "🚫", label: "No external access", status: "blocked" },
                ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-dashed border-white/5 last:border-b-0">
                        <div className="flex items-center gap-3">
                            <span className="text-sm">{item.icon}</span>
                            <span className="text-[13px] text-[#b5b5b5] font-navbar">{item.label}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.status === "blocked" ? "text-red-400" : "text-[#E8501E]"}`}>
                            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                                <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function FastStartupIllustration() {
    return (
        <div className="relative w-full max-w-[320px] mx-auto font-mono text-[12px]">
            <div className="relative border border-dashed border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm p-5 space-y-2">
                <CornerBrackets />
                <div className="flex gap-2"><span className="text-[#525252]">&gt;</span><span className="text-[#969696]">Starting sandbox execution...</span></div>
                <div className="flex gap-2"><span className="text-[#525252]">→</span><span className="text-[#969696]">Container provisioned</span></div>
                <div className="flex gap-2"><span className="text-[#525252]">→</span><span className="text-[#969696]">Runtime loaded</span></div>
                <div className="flex gap-2"><span className="text-[#525252]">→</span><span className="text-[#E8501E]">Executing code...</span></div>
                <div className="flex gap-2"><span className="text-[#525252]">→</span><span className="text-[#4ade80]">✓ Complete in 487ms</span></div>
                <div className="mt-3 h-[3px] w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#E8501E] rounded-full" style={{ width: "100%" }} />
                </div>
            </div>
        </div>
    );
}

function StreamingIllustration() {
    return (
        <div className="relative w-full max-w-[320px] mx-auto font-mono text-[12px]">
            <div className="relative border border-dashed border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm p-5 space-y-2">
                <CornerBrackets />
                <div className="text-[#525252] text-[11px] mb-3 uppercase tracking-wider">Live Output Stream</div>
                <div className="flex gap-2"><span className="text-[#E8501E]">│</span><span className="text-[#969696]">Processing row 1...done</span></div>
                <div className="flex gap-2"><span className="text-[#E8501E]">│</span><span className="text-[#969696]">Processing row 2...done</span></div>
                <div className="flex gap-2"><span className="text-[#E8501E]">│</span><span className="text-[#969696]">Processing row 3...done</span></div>
                <div className="flex gap-2"><span className="text-[#E8501E]">│</span><span className="text-[#b5b5b5]">Generating report...</span></div>
                <div className="flex gap-2"><span className="text-[#E8501E]">│</span><span className="text-[#4ade80]">Stream complete ✓</span></div>
                <div className="flex gap-2 animate-pulse"><span className="text-[#E8501E]">▊</span></div>
            </div>
        </div>
    );
}

function FileIllustration() {
    return (
        <div className="relative w-full max-w-[320px] mx-auto">
            <div className="relative border border-dashed border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm p-1">
                <CornerBrackets />
                {[
                    { icon: "📊", name: "dataset.csv", size: "2.4 MB", action: "↑" },
                    { icon: "🐍", name: "analysis.py", size: "1.2 KB", action: "→" },
                    { icon: "📈", name: "results.json", size: "856 B", action: "↓" },
                    { icon: "📋", name: "report.pdf", size: "3.1 MB", action: "↓" },
                ].map((file, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-dashed border-white/5 last:border-b-0">
                        <div className="flex items-center gap-3">
                            <span className="text-sm">{file.icon}</span>
                            <span className="text-[13px] text-[#b5b5b5] font-navbar">{file.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[11px] text-[#525252] font-mono">{file.size}</span>
                            <span className="text-[#E8501E] text-xs">{file.action}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TemplatesIllustration() {
    return (
        <div className="relative w-full max-w-[320px] mx-auto">
            <div className="relative border border-dashed border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm p-1">
                <CornerBrackets />
                {[
                    { icon: "🐍", name: "Python", ver: "3.12", status: "Ready" },
                    { icon: "📗", name: "Node.js", ver: "20 LTS", status: "Ready" },
                    { icon: "🔬", name: "Research", ver: "latest", status: "Ready" },
                ].map((tmpl, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3.5 border-b border-dashed border-white/5 last:border-b-0">
                        <div className="flex items-center gap-3">
                            <span className="text-sm">{tmpl.icon}</span>
                            <div className="flex flex-col">
                                <span className="text-[13px] text-[#b5b5b5] font-navbar">{tmpl.name}</span>
                                <span className="text-[11px] text-[#525252] font-mono">{tmpl.ver}</span>
                            </div>
                        </div>
                        <span className="text-[11px] text-[#4ade80] font-mono">{tmpl.status}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function StatefulIllustration() {
    return (
        <div className="relative w-full max-w-[320px] mx-auto font-mono text-[12px]">
            <div className="relative border border-dashed border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm p-5 space-y-2">
                <CornerBrackets />
                <div className="text-[#525252] text-[11px] mb-3 uppercase tracking-wider">Sandbox State</div>
                <div className="flex gap-2"><span className="text-[#E8501E]">$</span><span className="text-[#969696]">x = analyze(data)</span></div>
                <div className="flex gap-2"><span className="text-[#525252]"> </span><span className="text-[#4ade80]">→ x persists</span></div>
                <div className="flex gap-2 mt-1"><span className="text-[#E8501E]">$</span><span className="text-[#969696]">y = transform(x)</span></div>
                <div className="flex gap-2"><span className="text-[#525252]"> </span><span className="text-[#4ade80]">→ y persists</span></div>
                <div className="flex gap-2 mt-1"><span className="text-[#E8501E]">$</span><span className="text-[#969696]">result = export(x, y)</span></div>
                <div className="flex gap-2"><span className="text-[#525252]"> </span><span className="text-[#4ade80]">✓ Multi-step complete</span></div>
            </div>
        </div>
    );
}

const illustrations = [
    SecureIllustration,
    FastStartupIllustration,
    StreamingIllustration,
    FileIllustration,
    TemplatesIllustration,
    StatefulIllustration,
];

const features = [
    {
        title: "Secure By Default",
        body: "Every sandbox runs in complete isolation. Separate filesystem, network, and process space. Malicious code cannot affect anything outside its container.",
        bullets: [
            "Complete container isolation",
            "Separate filesystem and network",
            "Zero trust architecture",
        ],
    },
    {
        title: "Fast Startup",
        body: "Sandboxes spin up in under 500ms. Your users never wait for infrastructure. Every execution feels instant.",
        bullets: [
            "Sub-500ms cold start",
            "Pre-warmed execution pools",
            "Zero-latency developer experience",
        ],
    },
    {
        title: "Real Time Streaming",
        body: "Output streams back line by line as your code runs. No waiting for execution to complete. Build terminal-like experiences.",
        bullets: [
            "Line-by-line output delivery",
            "WebSocket-based streaming",
            "Terminal-like live feedback",
        ],
    },
    {
        title: "File Support",
        body: "Upload datasets, download results, read and write files inside sandboxes. Perfect for data analysis agents.",
        bullets: [
            "Upload and download files",
            "Read/write filesystem access",
            "Perfect for data pipelines",
        ],
    },
    {
        title: "Multiple Templates",
        body: "Python, Node.js, and Research templates pre-installed with the packages your AI agents need most.",
        bullets: [
            "Python, Node.js, Research",
            "Pre-installed dependencies",
            "Custom template support",
        ],
    },
    {
        title: "Stateful Execution",
        body: "Variables and state persist across multiple code executions within the same sandbox. Build multi-step AI workflows.",
        bullets: [
            "Persistent variables across runs",
            "Multi-step workflow support",
            "Session-based state management",
        ],
    },
];

function FeatureRow({
    feature,
    Illustration,
    index,
    reversed,
}: {
    feature: (typeof features)[0];
    Illustration: React.ComponentType;
    index: number;
    reversed: boolean;
}) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
            }}
            className="grid grid-cols-1 md:grid-cols-2 -mt-px"
        >
            {/* Visual side */}
            <div
                className={`relative border border-dashed border-white/10 min-h-[340px] flex items-center justify-center p-8 md:p-12 ${
                    reversed ? "md:order-2" : "md:order-1"
                }`}
            >
                <CornerBrackets />
                {/* Background image & overlay wrapped in overflow-hidden wrapper to prevent corner bracket clipping */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[inherit]">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-80"
                        style={{ backgroundImage: "url('/pricing-bg.png')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/30" />
                </div>
                {/* Illustration */}
                <div className="relative z-10 w-full">
                    <Illustration />
                </div>
            </div>

            {/* Content side */}
            <div
                className={`relative border border-dashed border-white/10 bg-[#0F0F0F] p-8 md:p-12 flex flex-col justify-center ${
                    reversed ? "md:order-1 md:border-r-0" : "md:order-2 md:border-l-0"
                }`}
            >
                <CornerBrackets />

                <h3 className="text-[28px] md:text-[32px] font-hero-heading text-[#F2F2F2] mb-4 tracking-tight leading-tight">
                    {feature.title}
                </h3>

                <p className="text-[15px] leading-[26px] text-[#969696] font-navbar font-normal mb-8 max-w-md">
                    {feature.body}
                </p>

                <ul className="flex flex-col gap-3">
                    {feature.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-center gap-3">
                            <CheckIcon />
                            <span className="text-[14px] text-[#b5b5b5] font-navbar">
                                {bullet}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
}

export default function FeaturesSection() {
    return (
        <section id="features" className="relative w-full pt-24 pb-6 px-6 lg:px-8">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.05 }}
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.15,
                            delayChildren: 0.1,
                        },
                    },
                }}
                className="relative mx-auto max-w-[1400px] flex flex-col items-center w-full"
            >
                {/* Side border lines extending past top/bottom padding to connect sections */}
                <div className="absolute -top-24 -bottom-6 left-0 w-[1px] border-l border-dashed border-white/10 pointer-events-none hidden md:block" />
                <div className="absolute -top-24 -bottom-6 right-0 w-[1px] border-r border-dashed border-white/10 pointer-events-none hidden md:block" />
                {/* Header Content */}
                <div className="flex flex-col items-center w-full relative pt-12">
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
                            Features
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
                        Everything Your AI Agent Needs
                    </motion.h2>

                    {/* Subheadline */}
                    <motion.p
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
                        }}
                        className="mt-5 text-[16px] leading-[26px] text-[#969696] font-normal font-navbar text-center max-w-lg"
                    >
                        Powerful primitives for secure code execution, built for developer experience.
                    </motion.p>
                </div>

                {/* Feature Rows */}
                <div className="relative w-full mt-16 mb-12">
                    {features.map((feature, index) => (
                        <FeatureRow
                            key={index}
                            feature={feature}
                            Illustration={illustrations[index]}
                            index={index}
                            reversed={index % 2 !== 0}
                        />
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
