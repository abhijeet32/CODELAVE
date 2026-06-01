/* eslint-disable react/no-unescaped-entities, react/jsx-no-comment-textnodes, react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

interface TabData {
    id: string;
    label: string;
    language: string;
    fileName: string;
    icon: React.ReactNode;
    description: string;
    command: string;
    rawCode: string;
    code: React.ReactNode;
    output: string[];
}

export default function GetStartedSection() {
    const [activeTab, setActiveTab] = useState<string>("node");
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [terminalLines, setTerminalLines] = useState<string[]>([]);
    const [copied, setCopied] = useState<boolean>(false);

    // SVGs matching reference design icons
    const nodeIcon = (
        <svg className="w-5 h-5 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
        </svg>
    );

    const pythonIcon = (
        <svg className="w-5 h-5 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            <path d="M2 12h20" />
        </svg>
    );

    const openaiIcon = (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 16.5c-1.5-2.5-1-6 1.5-7.5l4-2.5C12.5 5 16 5.5 17.5 8c1.5 2.5 1 6-1.5 7.5l-4 2.5C9.5 19 6 18.5 4.5 16.5z" />
            <path d="M12 8v8" />
            <path d="M8.5 10l7 4" />
            <path d="M8.5 14l7-4" />
        </svg>
    );

    const anthropicIcon = (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20l6-16h4l6 16" />
            <path d="M8 12h8" />
        </svg>
    );

    const langchainIcon = (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
    );

    const researchIcon = (
        <svg className="w-5 h-5 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );

    const tabs: TabData[] = [
        {
            id: "node",
            label: "Node.js",
            language: "javascript",
            fileName: "index.js",
            icon: nodeIcon,
            description: "Build scalable Node.js applications and agents with automatic runtime sandboxing and full lifecycle protection.",
            command: "node index.js",
            rawCode: `import { Sandbox } from 'codelave-sdk'

// Create a sandbox
const sandbox = await Sandbox.create({
  apiKey: process.env.CODELAVE_API_KEY,
  template: "python"
})

// Run AI generated code
const result = await sandbox.runCode(
  "print('Hello from Codelave!')"
)

// Output: Hello from Codelave!
console.log(result.output)

// Auto destroy when done
await sandbox.destroy()`,
            code: (
                <div className="font-mono text-[13px] leading-[22px] text-[#c9d1d9] space-y-[2px]">
                    <div><span className="text-[#ff7b72] font-semibold">import</span> <span className="text-[#e1e4e6]">{"{"}</span> <span className="text-[#ffa657]">Sandbox</span> <span className="text-[#e1e4e6]">{"}"}</span> <span className="text-[#ff7b72] font-semibold">from</span> <span className="text-[#a5d6ff]">'codelave-sdk'</span></div>
                    <div className="text-[#8b949e] italic pt-2">// Create a sandbox</div>
                    <div><span className="text-[#ff7b72] font-semibold">const</span> <span className="text-[#79c0ff]">sandbox</span> = <span className="text-[#ff7b72] font-semibold">await</span> <span className="text-[#ffa657]">Sandbox</span>.<span className="text-[#d2a8ff]">create</span><span className="text-[#e1e4e6]">({"{"}</span></div>
                    <div>  <span className="text-[#79c0ff]">apiKey</span><span className="text-[#e1e4e6]">:</span> <span className="text-[#79c0ff]">process</span>.<span className="text-[#79c0ff]">env</span>.<span className="text-[#79c0ff]">CODELAVE_API_KEY</span><span className="text-[#e1e4e6]">,</span></div>
                    <div>  <span className="text-[#79c0ff]">template</span><span className="text-[#e1e4e6]">:</span> <span className="text-[#a5d6ff]">"python"</span></div>
                    <div><span className="text-[#e1e4e6]">{"})"}</span></div>
                    <div className="text-[#8b949e] italic pt-2">// Run AI generated code</div>
                    <div><span className="text-[#ff7b72] font-semibold">const</span> <span className="text-[#79c0ff]">result</span> = <span className="text-[#ff7b72] font-semibold">await</span> <span className="text-[#79c0ff]">sandbox</span>.<span className="text-[#d2a8ff]">runCode</span><span className="text-[#e1e4e6]">(</span></div>
                    <div>  <span className="text-[#a5d6ff]">"print('Hello from Codelave!')"</span></div>
                    <div><span className="text-[#e1e4e6]">)</span></div>
                    <div className="text-[#8b949e] italic pt-2">// Output: Hello from Codelave!</div>
                    <div><span className="text-[#79c0ff]">console</span>.<span className="text-[#d2a8ff]">log</span><span className="text-[#e1e4e6]">(</span><span className="text-[#79c0ff]">result</span>.<span className="text-[#79c0ff]">output</span><span className="text-[#e1e4e6]">)</span></div>
                    <div className="text-[#8b949e] italic pt-2">// Auto destroy when done</div>
                    <div><span className="text-[#ff7b72] font-semibold">await</span> <span className="text-[#79c0ff]">sandbox</span>.<span className="text-[#d2a8ff]">destroy</span><span className="text-[#e1e4e6] font-semibold">()</span></div>
                </div>
            ),
            output: [
                "✔ Provisioned secure microVM container (214ms)",
                "✔ Mounted ephemeral filesystem space",
                "✔ Mounted network isolation sandbox wrapper",
                "✔ Executed index.js successfully",
                "",
                "Hello from Codelave!",
                "",
                "✔ Ephemeral sandbox space auto-destroyed safely."
            ]
        },
        {
            id: "python",
            label: "Python",
            language: "python",
            fileName: "index.py",
            icon: pythonIcon,
            description: "Pip install our python runtime tool to seamlessly secure remote code execution with context managers.",
            command: "python index.py",
            rawCode: `from codelave import Sandbox

# Create and auto destroy via context manager
async with Sandbox.create(
  api_key=os.environ["CODELAVE_API_KEY"],
  template="python"
) as sandbox:

  # Run AI generated code
  result = await sandbox.run_code(
    "print('Hello from Codelave!')"
  )

  # Output: Hello from Codelave!
  print(result.output)`,
            code: (
                <div className="font-mono text-[13px] leading-[22px] text-[#c9d1d9] space-y-[2px]">
                    <div><span className="text-[#ff7b72] font-semibold">from</span> <span className="text-[#e1e4e6]">codelave</span> <span className="text-[#ff7b72] font-semibold">import</span> <span className="text-[#ffa657]">Sandbox</span></div>
                    <div className="text-[#8b949e] italic pt-2"># Create and auto destroy via context manager</div>
                    <div><span className="text-[#ff7b72] font-semibold">async with</span> <span className="text-[#ffa657]">Sandbox</span>.<span className="text-[#d2a8ff]">create</span><span className="text-[#e1e4e6]">(</span></div>
                    <div>  <span className="text-[#79c0ff]">api_key</span><span className="text-[#e1e4e6]">=</span><span className="text-[#79c0ff]">os</span>.<span className="text-[#79c0ff]">environ</span><span className="text-[#e1e4e6]">[</span><span className="text-[#a5d6ff]">"CODELAVE_API_KEY"</span><span className="text-[#e1e4e6]">],</span></div>
                    <div>  <span className="text-[#79c0ff]">template</span><span className="text-[#e1e4e6]">=</span><span className="text-[#a5d6ff]">"python"</span></div>
                    <div><span className="text-[#e1e4e6]">)</span> <span className="text-[#ff7b72] font-semibold">as</span> <span className="text-[#79c0ff]">sandbox</span><span className="text-[#e1e4e6]">:</span></div>
                    <div className="text-[#8b949e] italic pt-2">  # Run AI generated code</div>
                    <div>  <span className="text-[#79c0ff]">result</span> <span className="text-[#e1e4e6]">=</span> <span className="text-[#ff7b72] font-semibold">await</span> <span className="text-[#79c0ff]">sandbox</span>.<span className="text-[#d2a8ff]">run_code</span><span className="text-[#e1e4e6]">(</span></div>
                    <div>    <span className="text-[#a5d6ff]">"print('Hello from Codelave!')"</span></div>
                    <div>  <span className="text-[#e1e4e6]">)</span></div>
                    <div className="text-[#8b949e] italic pt-2">  # Output: Hello from Codelave!</div>
                    <div>  <span className="text-[#d2a8ff]">print</span><span className="text-[#e1e4e6]">(</span><span className="text-[#79c0ff]">result</span>.<span className="text-[#79c0ff]">output</span><span className="text-[#e1e4e6]">)</span></div>
                </div>
            ),
            output: [
                "✔ Initialized Python environment context (194ms)",
                "✔ Isolated process space successfully bounded",
                "✔ Running sandboxed python runtime index.py...",
                "",
                "Hello from Codelave!",
                "",
                "✔ Safely exited async context manager, microVM destroyed."
            ]
        },
        {
            id: "research",
            label: "Research Agent",
            language: "javascript",
            fileName: "research_agent.js",
            icon: researchIcon,
            description: "Research template includes integrated network tunnels, pip package presets, and dynamic search APIs.",
            command: "node research_agent.js",
            rawCode: `// Research agent with internet access
const sandbox = await Sandbox.create({
  apiKey: process.env.CODELAVE_API_KEY,
  template: "research"
})

// Agent can search and scrape the web
const result = await sandbox.runCode(\`
  import requests
  from bs4 import BeautifulSoup

  response = requests.get('https://news.ycombinator.com')
  soup = BeautifulSoup(response.text, 'html.parser')
  titles = [a.text for a in soup.select('.titleline a')]
  print(titles[:3])
\`)

console.log(result.output)`,
            code: (
                <div className="font-mono text-[13px] leading-[22px] text-[#c9d1d9] space-y-[2px]">
                    <div className="text-[#8b949e] italic">// Research agent with internet access</div>
                    <div><span className="text-[#ff7b72] font-semibold">const</span> <span className="text-[#79c0ff]">sandbox</span> = <span className="text-[#ff7b72] font-semibold">await</span> <span className="text-[#ffa657]">Sandbox</span>.<span className="text-[#d2a8ff]">create</span><span className="text-[#e1e4e6]">({"{"}</span></div>
                    <div>  <span className="text-[#79c0ff]">apiKey</span><span className="text-[#e1e4e6]">:</span> <span className="text-[#79c0ff]">process</span>.<span className="text-[#79c0ff]">env</span>.<span className="text-[#79c0ff]">CODELAVE_API_KEY</span><span className="text-[#e1e4e6]">,</span></div>
                    <div>  <span className="text-[#79c0ff]">template</span><span className="text-[#e1e4e6]">:</span> <span className="text-[#a5d6ff]">"research"</span></div>
                    <div><span className="text-[#e1e4e6]">{"})"}</span></div>
                    <div className="text-[#8b949e] italic pt-2">// Agent can search and scrape the web</div>
                    <div><span className="text-[#ff7b72] font-semibold">const</span> <span className="text-[#79c0ff]">result</span> = <span className="text-[#ff7b72] font-semibold">await</span> <span className="text-[#79c0ff]">sandbox</span>.<span className="text-[#d2a8ff]">runCode</span><span className="text-[#e1e4e6]">(</span><span className="text-[#a5d6ff]">`</span></div>
                    <div><span className="text-[#a5d6ff]">  import requests</span></div>
                    <div><span className="text-[#a5d6ff]">  from bs4 import BeautifulSoup</span></div>
                    <div>&nbsp;</div>
                    <div><span className="text-[#a5d6ff]">  response = requests.get('https://news.ycombinator.com')</span></div>
                    <div><span className="text-[#a5d6ff]">  soup = BeautifulSoup(response.text, 'html.parser')</span></div>
                    <div><span className="text-[#a5d6ff]">  titles = [a.text for a in soup.select('.titleline a')]</span></div>
                    <div><span className="text-[#a5d6ff]">  print(titles[:3])</span></div>
                    <div><span className="text-[#a5d6ff]">`</span><span className="text-[#e1e4e6]">)</span></div>
                    <div className="text-[#8b949e] italic pt-2">// Output parsed results</div>
                    <div><span className="text-[#79c0ff]">console</span>.<span className="text-[#d2a8ff]">log</span><span className="text-[#e1e4e6]">(</span><span className="text-[#79c0ff]">result</span>.<span className="text-[#79c0ff]">output</span><span className="text-[#e1e4e6]">)</span></div>
                </div>
            ),
            output: [
                "✔ Spun up full research template microVM (385ms)",
                "✔ Pre-installed packages loaded: requests, bs4",
                "✔ Network tunnel active (whitelisted domain access allowed)",
                "✔ Running scraper pipeline...",
                "",
                "[",
                "  'Show HN: Codelave – Secure sandboxes for AI agents',",
                "  'Why I still use Vim in 2026',",
                "  'Show HN: Llama.cpp in pure WebGPU'",
                "]",
                "",
                "✔ Sandbox context safely destroyed."
            ]
        }
    ];

    // Integration tabs that are showcases (just like Vercel, OpenAI etc. in reference image)
    const showcaseTabs = [
        { id: "vercel", label: "VERCEL", icon: openaiIcon },
        { id: "openai", label: "OPEN AI", icon: openaiIcon },
        { id: "anthropic", label: "ANTHROPIC", icon: anthropicIcon },
        { id: "langchain", label: "LANGCHAIN", icon: langchainIcon },
    ];

    const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

    useEffect(() => {
        setTerminalLines([`$ ${currentTab.command}`, 'Click "Run Code" above to execute...']);
        setIsRunning(false);
    }, [activeTab]);

    const handleCopy = () => {
        navigator.clipboard.writeText(currentTab.rawCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleRunCode = () => {
        if (isRunning) return;
        setIsRunning(true);
        setTerminalLines([]);

        const cmd = `$ ${currentTab.command}`;
        let currentChars = "";
        let charIndex = 0;

        const typingInterval = setInterval(() => {
            if (charIndex < cmd.length) {
                currentChars += cmd[charIndex];
                setTerminalLines([currentChars]);
                charIndex++;
            } else {
                clearInterval(typingInterval);
                runSimulationSteps();
            }
        }, 20);
    };

    const runSimulationSteps = () => {
        const steps = [
            "⠋ Provisioning secure sandbox VM container...",
            "✔ Provisioned secure microVM container (214ms)",
            "⠋ Setting up isolated process and firewall layers...",
            "✔ Isolated network interface and filesystem active",
            "⠋ Executing agent sandbox run pipeline...",
            "Output:"
        ];

        let stepIdx = 0;
        const baseLines = [`$ ${currentTab.command}`];

        const runNextStep = () => {
            if (stepIdx < steps.length) {
                const currentLines = [...baseLines, ...steps.slice(0, stepIdx + 1)];
                setTerminalLines(currentLines);
                stepIdx++;
                setTimeout(runNextStep, 300);
            } else {
                setTerminalLines([
                    ...baseLines,
                    ...steps.filter((s) => !s.startsWith("⠋")),
                    "",
                    ...currentTab.output,
                    ""
                ]);
                setIsRunning(false);
            }
        };
        setTimeout(runNextStep, 100);
    };

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
                            staggerChildren: 0.1,
                        },
                    },
                }}
                className="relative mx-auto max-w-[1400px] flex flex-col items-center w-full"
            >
                {/* Side border lines extending past top/bottom padding to connect sections */}
                <div className="absolute -top-24 -bottom-6 left-0 w-[1px] border-l border-dashed border-white/10 pointer-events-none hidden md:block" />
                <div className="absolute -top-24 -bottom-6 right-0 w-[1px] border-r border-dashed border-white/10 pointer-events-none hidden md:block" />

                {/* Section Header */}
                <div className="flex flex-col items-center w-full relative pt-12 text-center mb-12">
                    {/* Badge */}
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 15 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                        }}
                        className="relative inline-flex items-center gap-3 px-5 py-2 border border-dashed border-white/10 mb-6"
                    >
                        <CornerBrackets />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E8501E]" />
                        <span className="font-navbar text-xs tracking-[0.2em] uppercase text-[#b5b5b5] font-medium">
                            Simple By Design
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h2
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                        }}
                        className="font-hero-heading text-4xl sm:text-5xl font-bold text-[#F2F2F2] tracking-tight leading-tight"
                    >
                        Three Lines To Get Started
                    </motion.h2>
                </div>

                {/* Center Content Wrapper */}
                <div className="w-full flex flex-col items-center">
                    {/* Active Tab Description */}
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={activeTab}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                            className="text-[#969696] text-sm text-center max-w-lg mb-10 font-navbar leading-relaxed min-h-[44px]"
                        >
                            {currentTab.description}
                        </motion.p>
                    </AnimatePresence>

                    {/* Vim-Styled Code Editor & Console Wrapper (Without overflow-hidden to allow unclipped CornerBrackets) */}
                    <div className="w-full flex flex-col justify-between border border-white/10 bg-[#070707] rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">
                        <CornerBrackets />
                        
                        {/* 1. TOP HEADER SELECTOR NAVBAR */}
                        <div className="flex items-center justify-between border-b border-white/10 bg-[#0A0A0A] select-none text-[11px] font-mono font-semibold tracking-wider text-[#828282] overflow-x-auto rounded-t-lg">
                            {/* Left Plus Sign */}
                            <div className="px-4 py-4.5 border-r border-white/10 text-white/40 select-none">+</div>
                            
                            {/* Tabs Center Row */}
                            <div className="flex-1 flex items-stretch">
                                {/* Interactive Active Tabs */}
                                {tabs.map((tab) => {
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`px-6 py-4.5 flex flex-col items-center justify-center gap-1.5 border-r border-white/10 transition-all min-w-[110px] relative ${
                                                isActive
                                                    ? "text-white font-bold bg-[#070707]"
                                                    : "hover:text-white hover:bg-white/[0.02]"
                                            }`}
                                        >
                                            <span className={`transition-colors duration-300 ${isActive ? "text-[#E8501E]" : "text-white/40"}`}>
                                                {tab.icon}
                                            </span>
                                            <span className="uppercase text-[10px]">{tab.label}</span>
                                            
                                            {/* Reference Design Underline with spring transition */}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeTabUnderline"
                                                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E8501E] shadow-[0_0_8px_#E8501E]"
                                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                />
                                            )}
                                        </button>
                                    );
                                })}

                                {/* Showcase/Inactive Tabs */}
                                {showcaseTabs.map((tab) => (
                                    <div
                                        key={tab.id}
                                        className="px-6 py-4.5 flex flex-col items-center justify-center gap-1.5 border-r border-white/10 text-[#444] opacity-50 select-none min-w-[110px]"
                                    >
                                        <span className="text-[#333]">{tab.icon}</span>
                                        <span className="uppercase text-[10px]">{tab.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Right Plus Sign */}
                            <div className="px-4 py-4.5 border-l border-white/10 text-white/40 select-none">+</div>
                        </div>

                        {/* Editor Main Content Area (Vim-themed with line numbers & tildes) */}
                        <div className="relative p-6 pt-8 flex-1 overflow-x-auto min-h-[320px] bg-[#070707]">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(232,80,30,0.02),transparent_60%)] pointer-events-none" />
                            
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.2 }}
                                    className="relative z-10 flex gap-5"
                                >
                                    {/* Vim Line Numbers & Tildes Column */}
                                    <div className="font-mono text-right text-[#2d2d2d] select-none text-[13px] leading-[22px] hidden sm:block w-4">
                                        {/* Line numbers for the content */}
                                        {Array.from({ length: 11 }).map((_, idx) => (
                                            <div key={idx}>{idx + 1}</div>
                                        ))}
                                        {/* Vim Empty Line Tildes */}
                                        {Array.from({ length: 4 }).map((_, idx) => (
                                            <div key={idx} className="text-[#1a1a1a] text-left">~</div>
                                        ))}
                                    </div>
                                    
                                    {/* Code Content */}
                                    <div className="flex-1 overflow-x-auto pb-4">
                                        {currentTab.code}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Vim-style Status Line */}
                        <div className="flex items-center justify-between px-5 py-2 bg-[#0A0A0A] border-t border-white/10 font-mono text-[11px] text-[#525252] select-none">
                            <span>"{`~/${currentTab.fileName}`}"</span>
                            <div className="flex items-center gap-4">
                                <span>utf-8</span>
                                <span>{currentTab.language}</span>
                                <span>1,1 100%</span>
                            </div>
                        </div>

                        {/* Interactive Console Console */}
                        <div className="border-t border-white/10 bg-[#030303] p-5 font-mono text-[12px] min-h-[165px] flex flex-col justify-start relative rounded-b-lg">
                            {/* Execution & Copy Action Buttons in Terminal Bar */}
                            <div className="flex items-center justify-between mb-3 text-[#444444] border-b border-white/5 pb-3.5 select-none">
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="tracking-wider uppercase text-[10px] font-bold">TERMINAL CONSOLE</span>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    {/* Copy Button */}
                                    <button
                                        onClick={handleCopy}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold tracking-wide uppercase border border-white/10 hover:border-white/20 text-[#828282] hover:text-white transition-all rounded"
                                    >
                                        <span>{copied ? "✓ COPIED" : "COPY CODE"}</span>
                                    </button>

                                    {/* Run Code Button */}
                                    <button
                                        onClick={handleRunCode}
                                        disabled={isRunning}
                                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[10px] font-semibold tracking-wide uppercase transition-all rounded ${
                                            isRunning
                                                ? "bg-white/5 text-[#525252] cursor-not-allowed"
                                                : "bg-[#E8501E] text-white hover:bg-[#ff622e] shadow-[0_0_10px_rgba(232,80,30,0.2)]"
                                        }`}
                                    >
                                        <span>{isRunning ? "RUNNING..." : "RUN CODE"}</span>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Terminal text lines */}
                            <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[120px]">
                                {terminalLines.map((line, idx) => {
                                    const isCommand = line.startsWith("$");
                                    const isError = line.startsWith("✖");
                                    const isSuccess = line.startsWith("✔");
                                    const isStatus = line.startsWith("⠋");
                                    
                                    let textColor = "text-[#6c737c]";
                                    if (isCommand) textColor = "text-[#E8501E] font-semibold";
                                    else if (isSuccess) textColor = "text-emerald-400/90";
                                    else if (isError) textColor = "text-red-400";
                                    else if (isStatus) textColor = "text-amber-400/80";
                                    else if (line === "Hello from Codelave!" || line.startsWith("  '") || line.startsWith("[")) {
                                        textColor = "text-[#F2F2F2] font-semibold bg-[#24292e]/40 px-2 py-0.5 rounded-[3px] border border-white/[0.03]";
                                    }

                                    return (
                                        <div key={idx} className={`${textColor} leading-relaxed flex items-center gap-2`}>
                                            {isStatus && (
                                                <span className="inline-block animate-spin mr-1">⠋</span>
                                            )}
                                            <span>{isStatus ? line.slice(2) : line}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
