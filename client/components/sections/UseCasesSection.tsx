/* eslint-disable react/no-unescaped-entities, react/jsx-no-comment-textnodes */
"use client";

import { useState, useEffect } from "react";

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

interface UseCaseData {
    id: string;
    headline: string;
    description: string;
    bullets: string[];
    rawCode: string;
    codeElement: React.ReactNode;
    usedBy: string;
    icon: React.ReactNode;
    lineCount: number;
    telemetry: {
        cpu: string;
        ram: string;
        network: string;
        rtt: string;
    };
}

export default function UseCasesSection() {
    const [selectedId, setSelectedId] = useState<string>("coding");
    const [copied, setCopied] = useState<boolean>(false);
    const [scanActive, setScanActive] = useState<boolean>(true);

    // Toggle scanline for premium interaction
    useEffect(() => {
        setScanActive(false);
        const timer = setTimeout(() => setScanActive(true), 50);
        return () => clearTimeout(timer);
    }, [selectedId]);

    // SVG Icons (geometric, minimal, matching rest of design)
    const codingIcon = (
        <svg className="w-5 h-5 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
        </svg>
    );

    const dataIcon = (
        <svg className="w-5 h-5 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
    );

    const researchIcon = (
        <svg className="w-5 h-5 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="22" y1="12" x2="18" y2="12" />
            <line x1="6" y1="12" x2="2" y2="12" />
            <line x1="12" y1="6" x2="12" y2="2" />
            <line x1="12" y1="22" x2="12" y2="18" />
        </svg>
    );

    const appIcon = (
        <svg className="w-5 h-5 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
            <line x1="3" y1="9" x2="21" y2="9" />
        </svg>
    );

    const useCases: UseCaseData[] = [
        {
            id: "coding",
            headline: "AI Coding Agents",
            description: "Let your AI agent write code, test it, fix bugs, and iterate in a real environment without ever touching your production servers. Every execution is completely isolated.",
            bullets: [
                "Write and run code in any language",
                "Install packages and dependencies",
                "Test outputs and fix errors automatically",
                "Run multiple iterations safely"
            ],
            usedBy: "AI IDEs, coding assistants, debugging agents",
            icon: codingIcon,
            lineCount: 14,
            telemetry: { cpu: "14%", ram: "184MB", network: "firewalled", rtt: "12ms" },
            rawCode: `// AI agent writes and tests code
const sandbox = await Sandbox.create({
  template: "python"
})

// Agent runs its generated code
const result = await sandbox.runCode(
  aiGeneratedCode
)

// Agent sees the error and fixes it
if (result.error) {
  const fixed = await llm.fix(result.error)
  await sandbox.runCode(fixed)
}`,
            codeElement: (
                <div className="space-y-[3px]">
                    <div><span className="text-[#8b949e] italic">// AI agent writes and tests code</span></div>
                    <div><span className="text-[#ff7b72] font-semibold">const</span> <span className="text-[#79c0ff]">sandbox</span> = <span className="text-[#ff7b72] font-semibold">await</span> <span className="text-[#ffa657]">Sandbox</span>.<span className="text-[#d2a8ff]">create</span>({`{`}</div>
                    <div>  <span className="text-[#79c0ff]">template</span>: <span className="text-[#a5d6ff]">"python"</span></div>
                    <div>{`})`}</div>
                    <div className="h-3"></div>
                    <div><span className="text-[#8b949e] italic">// Agent runs its generated code</span></div>
                    <div><span className="text-[#ff7b72] font-semibold">const</span> <span className="text-[#79c0ff]">result</span> = <span className="text-[#ff7b72] font-semibold">await</span> <span className="text-[#79c0ff]">sandbox</span>.<span className="text-[#d2a8ff]">runCode</span>(</div>
                    <div>  <span className="text-[#79c0ff]">aiGeneratedCode</span></div>
                    <div>)</div>
                    <div className="h-3"></div>
                    <div><span className="text-[#8b949e] italic">// Agent sees the error and fixes it</span></div>
                    <div><span className="text-[#ff7b72] font-semibold">if</span> (result.<span className="text-[#79c0ff]">error</span>) {`{`}</div>
                    <div>  <span className="text-[#ff7b72] font-semibold">const</span> <span className="text-[#79c0ff]">fixed</span> = <span className="text-[#ff7b72] font-semibold">await</span> <span className="text-[#79c0ff]">llm</span>.<span className="text-[#d2a8ff]">fix</span>(result.<span className="text-[#79c0ff]">error</span>)</div>
                    <div>  <span className="text-[#ff7b72] font-semibold">await</span> <span className="text-[#79c0ff]">sandbox</span>.<span className="text-[#d2a8ff]">runCode</span>(fixed)</div>
                    <div>{`}`}</div>
                </div>
            )
        },
        {
            id: "data",
            headline: "Data Analysis Agents",
            description: "Upload datasets, let your AI write analysis code, execute it inside a sandbox, and return charts and insights directly to your users. No data ever touches your servers.",
            bullets: [
                "Read CSV, Excel, JSON files",
                "Run pandas, numpy, matplotlib code",
                "Generate charts and visualizations",
                "Return structured insights"
            ],
            usedBy: "Analytics platforms, BI tools, data apps",
            icon: dataIcon,
            lineCount: 19,
            telemetry: { cpu: "72%", ram: "412MB", network: "isolated", rtt: "35ms" },
            rawCode: `// Upload user's dataset
await sandbox.uploadFile(
  "./sales_data.csv",
  "data.csv"
)

// AI writes and runs analysis
const result = await sandbox.runCode(\`
  import pandas as pd
  import matplotlib.pyplot as plt
  
  df = pd.read_csv('data.csv')
  print(df.describe())
  plt.savefig('chart.png')
\`)

// Download the generated chart
await sandbox.downloadFile(
  "chart.png",
  "./output/chart.png"
)`,
            codeElement: (
                <div className="space-y-[3px]">
                    <div><span className="text-[#8b949e] italic">// Upload user's dataset</span></div>
                    <div><span className="text-[#ff7b72] font-semibold">await</span> <span className="text-[#79c0ff]">sandbox</span>.<span className="text-[#d2a8ff]">uploadFile</span>(</div>
                    <div>  <span className="text-[#a5d6ff]">"./sales_data.csv"</span>,</div>
                    <div>  <span className="text-[#a5d6ff]">"data.csv"</span></div>
                    <div>)</div>
                    <div className="h-3"></div>
                    <div><span className="text-[#8b949e] italic">// AI writes and runs analysis</span></div>
                    <div><span className="text-[#ff7b72] font-semibold">const</span> <span className="text-[#79c0ff]">result</span> = <span className="text-[#ff7b72] font-semibold">await</span> <span className="text-[#79c0ff]">sandbox</span>.<span className="text-[#d2a8ff]">runCode</span>(<span className="text-[#a5d6ff]">`</span></div>
                    <div><span className="text-[#a5d6ff]">  import pandas as pd</span></div>
                    <div><span className="text-[#a5d6ff]">  import matplotlib.pyplot as plt</span></div>
                    <div><span className="text-[#a5d6ff]">  </span></div>
                    <div><span className="text-[#a5d6ff]">  df = pd.read_csv('data.csv')</span></div>
                    <div><span className="text-[#a5d6ff]">  print(df.describe())</span></div>
                    <div><span className="text-[#a5d6ff]">  plt.savefig('chart.png')</span></div>
                    <div><span className="text-[#a5d6ff]">`</span>)</div>
                    <div className="h-3"></div>
                    <div><span className="text-[#8b949e] italic">// Download the generated chart</span></div>
                    <div><span className="text-[#ff7b72] font-semibold">await</span> <span className="text-[#79c0ff]">sandbox</span>.<span className="text-[#d2a8ff]">downloadFile</span>(</div>
                    <div>  <span className="text-[#a5d6ff]">"chart.png"</span>,</div>
                    <div>  <span className="text-[#a5d6ff]">"./output/chart.png"</span></div>
                    <div>)</div>
                </div>
            )
        },
        {
            id: "research",
            headline: "Research Agents",
            description: "Give your AI agent a browser, scraping tools, and data processing capabilities to conduct deep research across the web and return structured, actionable reports.",
            bullets: [
                "Search and browse the web",
                "Scrape and parse web pages",
                "Extract and summarize content",
                "Return structured research reports"
            ],
            usedBy: "Research tools, AI assistants, news agents",
            icon: researchIcon,
            lineCount: 15,
            telemetry: { cpu: "38%", ram: "256MB", network: "proxied-web", rtt: "58ms" },
            rawCode: `// Research template has internet access
const sandbox = await Sandbox.create({
  template: "research"
})

// Agent searches and scrapes
const result = await sandbox.runCode(\`
  import requests
  from bs4 import BeautifulSoup

  response = requests.get(url)
  soup = BeautifulSoup(response.text)
  data = soup.find_all('article')
  print([a.text for a in data[:5]])
\`)`,
            codeElement: (
                <div className="space-y-[3px]">
                    <div><span className="text-[#8b949e] italic">// Research template has internet access</span></div>
                    <div><span className="text-[#ff7b72] font-semibold">const</span> <span className="text-[#79c0ff]">sandbox</span> = <span className="text-[#ff7b72] font-semibold">await</span> <span className="text-[#ffa657]">Sandbox</span>.<span className="text-[#d2a8ff]">create</span>({`{`}</div>
                    <div>  <span className="text-[#79c0ff]">template</span>: <span className="text-[#a5d6ff]">"research"</span></div>
                    <div>{`})`}</div>
                    <div className="h-3"></div>
                    <div><span className="text-[#8b949e] italic">// Agent searches and scrapes</span></div>
                    <div><span className="text-[#ff7b72] font-semibold">const</span> <span className="text-[#79c0ff]">result</span> = <span className="text-[#79c0ff]">await</span> <span className="text-[#79c0ff]">sandbox</span>.<span className="text-[#d2a8ff]">runCode</span>(<span className="text-[#a5d6ff]">`</span></div>
                    <div><span className="text-[#a5d6ff]">  import requests</span></div>
                    <div><span className="text-[#a5d6ff]">  from bs4 import BeautifulSoup</span></div>
                    <div><span className="text-[#a5d6ff]"></span></div>
                    <div><span className="text-[#a5d6ff]">  response = requests.get(url)</span></div>
                    <div><span className="text-[#a5d6ff]">  soup = BeautifulSoup(response.text)</span></div>
                    <div><span className="text-[#a5d6ff]">  data = soup.find_all('article')</span></div>
                    <div><span className="text-[#a5d6ff]">  print([a.text for a in data[:5]])</span></div>
                    <div><span className="text-[#a5d6ff]">`</span>)</div>
                </div>
            )
        },
        {
            id: "app",
            headline: "App Builder Agents",
            description: "Generate full project files with AI, write them into a sandbox, build and run the project, and return a live preview URL to your users instantly.",
            bullets: [
                "Write multiple project files at once",
                "Install dependencies automatically",
                "Build and serve the project",
                "Return live preview URL"
            ],
            usedBy: "App builders, no-code tools, vibe coding",
            icon: appIcon,
            lineCount: 14,
            telemetry: { cpu: "89%", ram: "512MB", network: "port-3000", rtt: "84ms" },
            rawCode: `// Write all generated files
await sandbox.writeFile(
  "App.jsx", aiGeneratedComponent
)
await sandbox.writeFile(
  "package.json", packageConfig
)

// Install and build
await sandbox.runCommand("npm install")
await sandbox.runCommand("npm run build")

// Get the live preview URL
const url = await sandbox.getPreviewUrl()
// → https://sb-abc123.codelave.dev`,
            codeElement: (
                <div className="space-y-[3px]">
                    <div><span className="text-[#8b949e] italic">// Write all generated files</span></div>
                    <div><span className="text-[#ff7b72] font-semibold">await</span> <span className="text-[#79c0ff]">sandbox</span>.<span className="text-[#d2a8ff]">writeFile</span>(</div>
                    <div>  <span className="text-[#a5d6ff]">"App.jsx"</span>, <span className="text-[#79c0ff]">aiGeneratedComponent</span></div>
                    <div>)</div>
                    <div><span className="text-[#ff7b72] font-semibold">await</span> <span className="text-[#79c0ff]">sandbox</span>.<span className="text-[#d2a8ff]">writeFile</span>(</div>
                    <div>  <span className="text-[#a5d6ff]">"package.json"</span>, <span className="text-[#79c0ff]">packageConfig</span></div>
                    <div>)</div>
                    <div className="h-3"></div>
                    <div><span className="text-[#8b949e] italic">// Install and build</span></div>
                    <div><span className="text-[#ff7b72] font-semibold">await</span> <span className="text-[#79c0ff]">sandbox</span>.<span className="text-[#d2a8ff]">runCommand</span>(<span className="text-[#a5d6ff]">"npm install"</span>)</div>
                    <div><span className="text-[#ff7b72] font-semibold">await</span> <span className="text-[#79c0ff]">sandbox</span>.<span className="text-[#d2a8ff]">runCommand</span>(<span className="text-[#a5d6ff]">"npm run build"</span>)</div>
                    <div className="h-3"></div>
                    <div><span className="text-[#8b949e] italic">// Get the live preview URL</span></div>
                    <div><span className="text-[#ff7b72] font-semibold">const</span> <span className="text-[#79c0ff]">url</span> = <span className="text-[#ff7b72] font-semibold">await</span> <span className="text-[#79c0ff]">sandbox</span>.<span className="text-[#d2a8ff]">getPreviewUrl</span>()</div>
                    <div><span className="text-[#8b949e] italic">// → https://sb-abc123.codelave.dev</span></div>
                </div>
            )
        }
    ];

    const currentUseCase = useCases.find((u) => u.id === selectedId) || useCases[0];

    const handleCopy = () => {
        navigator.clipboard.writeText(currentUseCase.rawCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="relative w-full pt-24 pb-6 px-6 lg:px-8 bg-[#070707]">
            {/* Blueprint Grid Layout Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />
            
            <div className="relative mx-auto max-w-[1400px] w-full z-10 flex flex-col items-center">
                {/* Continuous side vertical lines to keep layout alignment intact */}
                <div className="absolute -top-24 -bottom-6 left-0 w-[1px] border-l border-dashed border-white/10 pointer-events-none hidden md:block" />
                <div className="absolute -top-24 -bottom-6 right-0 w-[1px] border-r border-dashed border-white/10 pointer-events-none hidden md:block" />

                {/* Section Header */}
                <div className="flex flex-col items-center w-full relative pt-12 text-center mb-16 max-w-2xl">
                    {/* Badge */}
                    <div className="relative inline-flex items-center gap-3 px-5 py-2 border border-dashed border-white/10 mb-6 bg-[#0D0D0E]">
                        <CornerBrackets />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E8501E]" />
                        <span className="font-navbar text-xs tracking-[0.2em] uppercase text-[#b5b5b5] font-medium">
                            Use Cases
                        </span>
                    </div>

                    {/* Headline */}
                    <h2 className="font-hero-heading text-4xl sm:text-5xl font-bold text-[#F2F2F2] tracking-tight leading-tight mb-4">
                        Built For Every AI Use Case
                    </h2>

                    {/* Subheadline */}
                    <p className="font-navbar text-sm text-[#969696] leading-relaxed">
                        From data analysis to full coding agents, Codelave powers any workflow where AI needs to execute code safely.
                    </p>
                </div>

                {/* Outer Border Wrapper containing the entire Use Case grid with Corner Brackets on all four sides */}
                <div className="relative w-full border border-dashed border-white/10 p-6 md:p-8 rounded-xl bg-[#09090A]/20">
                    <CornerBrackets />

                    {/* Grid Split Content Layout */}
                    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                        {/* Left Pane: 2x2 Cyber-Mesh Cards Grid */}
                        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {useCases.map((useCase, idx) => {
                                const isSelected = selectedId === useCase.id;
                                return (
                                    <button
                                        key={useCase.id}
                                        onClick={() => setSelectedId(useCase.id)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault();
                                                setSelectedId(useCase.id);
                                            }
                                        }}
                                        aria-selected={isSelected}
                                        role="tab"
                                        className={`text-left p-6 border rounded-lg transition-all duration-300 flex flex-col justify-between h-[360px] relative select-none cursor-pointer overflow-hidden focus:outline-none ${
                                            isSelected
                                                ? "border-[#E8501E] bg-[#101012] shadow-[0_0_45px_rgba(232,80,30,0.15)]"
                                                : "border-white/10 bg-[#080809]/80 hover:bg-[#0E0E10] hover:border-white/20"
                                        } group`}
                                    >
                                        <CornerBrackets />

                                        {/* Left Accent Laser Line when selected */}
                                        <div className={`absolute top-0 bottom-0 left-0 w-[2px] bg-[#E8501E] transition-transform duration-300 origin-bottom ${
                                            isSelected ? "scale-y-100" : "scale-y-0"
                                        }`} />

                                        {/* Subtle hover background radial highlight */}
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(232,80,30,0.025)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                        {/* Card Header System Label */}
                                        <div className="flex items-center justify-between w-full mb-4 select-none">
                                            <span className="font-mono text-[9.5px] text-[#525252] tracking-wider uppercase">
                                                // USE_CASE_NODE_0{idx + 1}
                                            </span>
                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                isSelected ? "bg-[#E8501E] animate-pulse" : "bg-[#2d2d2d]"
                                            }`} />
                                        </div>

                                        {/* Card Content */}
                                        <div>
                                            {/* Icon (colored with active color on selection) */}
                                            <div className={`mb-4 transition-colors duration-300 ${isSelected ? "text-[#E8501E]" : "text-[#8e8e93]"}`}>
                                                {useCase.icon}
                                            </div>

                                            <h3 className="font-hero-heading text-lg font-bold text-white tracking-wide mb-2.5">
                                                {useCase.headline}
                                            </h3>

                                            <p className="font-navbar text-[12.5px] leading-relaxed text-[#969696] mb-5">
                                                {useCase.description}
                                            </p>
                                        </div>

                                        {/* Bullet point features */}
                                        <div className="flex-1 flex flex-col justify-end">
                                            <ul className="space-y-2 mb-6" aria-label={`Features for ${useCase.headline}`}>
                                                {useCase.bullets.map((bullet, index) => (
                                                    <li key={index} className="flex items-start gap-2.5 text-xs text-white/90 font-navbar">
                                                        <span className="text-[#E8501E] font-bold text-[13px] shrink-0" aria-hidden="true">✓</span>
                                                        <span>{bullet}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            {/* Used By Label at bottom */}
                                            <div className="pt-3.5 border-t border-white/[0.04] text-[10.5px] font-mono tracking-wide text-[#7a7a7a]">
                                                <span className="uppercase text-[9px] text-[#525252] mr-1.5">Used by:</span>
                                                <span className="text-white/70">{useCase.usedBy}</span>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Right Pane: Code Snippet Panel - sets to h-full to fit the space of the 2x2 left grid perfectly */}
                        <div className="lg:col-span-5 w-full bg-[#0C0F14] border border-white/10 rounded-lg overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.65)] relative flex flex-col justify-between h-full min-h-[500px]">
                            <CornerBrackets />

                            {/* Scanline gradient effect */}
                            {scanActive && (
                                <div className="absolute inset-0 pointer-events-none z-20 w-full h-full bg-[linear-gradient(to_bottom,transparent_50%,rgba(232,80,30,0.025)_50%)] bg-[size:100%_4px] opacity-60 animate-scanline" />
                            )}

                            <div className="flex-1 flex flex-col">
                                {/* Top Terminal Header Bar */}
                                <div className="flex items-center justify-between px-4 py-3 bg-[#13171e] border-b border-white/10 select-none text-[11px] font-mono text-[#8b949e]">
                                    {/* Three Mac Dots */}
                                    <div className="flex items-center gap-1.5" aria-hidden="true">
                                        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                                        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                                        <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {/* Status Light */}
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[9px] uppercase tracking-wider text-[#525252] font-semibold">ONLINE</span>
                                        </div>

                                        {/* Language label */}
                                        <span className="uppercase text-[10px] tracking-wider font-semibold text-[#8b949e] bg-[#1f242c] px-2 py-0.5 rounded-sm">
                                            JavaScript
                                        </span>

                                        {/* Copy Button */}
                                        <button
                                            onClick={handleCopy}
                                            className="text-[#8b949e] hover:text-white transition-colors duration-200 uppercase text-[10px] font-bold tracking-wider"
                                            aria-label="Copy code to clipboard"
                                        >
                                            {copied ? "✓ Copied" : "Copy"}
                                        </button>
                                    </div>
                                </div>

                                {/* Editor Space with Line Numbers & code */}
                                <div className="flex-1 flex p-5 font-mono text-[12.5px] leading-relaxed relative bg-[#0C0F14] overflow-y-auto">
                                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(232,80,30,0.03),transparent_60%)] pointer-events-none" />
                                    
                                    {/* Static Line Numbers Column */}
                                    <div className="text-right text-[#50565d] select-none pr-5 border-r border-white/5 mr-5 w-5" aria-hidden="true">
                                        {Array.from({ length: currentUseCase.lineCount }).map((_, i) => (
                                            <div key={i}>{i + 1}</div>
                                        ))}
                                    </div>

                                    {/* Highlighted Code block with CSS transitions */}
                                    <div className="flex-1 overflow-x-auto text-[#c9d1d9] transition-all duration-300 ease-in-out">
                                        <div className="animate-fade-in duration-300">
                                            {currentUseCase.codeElement}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Real-Time Telemetry Bar */}
                            <div className="border-t border-white/10 bg-[#13171e] px-4 py-3.5 select-none text-[10px] font-mono text-[#525252] flex items-center justify-between z-10">
                                <div className="flex items-center gap-3">
                                    <span>CPU: <span className="text-[#E8501E] font-semibold">{currentUseCase.telemetry.cpu}</span></span>
                                    <span>MEM: <span className="text-white/80">{currentUseCase.telemetry.ram}</span></span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="hidden sm:inline">NET: <span className="text-[#8b949e]">{currentUseCase.telemetry.network}</span></span>
                                    <span>RTT: <span className="text-emerald-500">{currentUseCase.telemetry.rtt}</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Embedded styles to animate code transitions and scanning lines */}
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scanline {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-scanline {
                    animation: scanline 8s linear infinite;
                }
            `}</style>
        </section>
    );
}
