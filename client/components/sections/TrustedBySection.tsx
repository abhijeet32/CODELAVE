"use client";

import React from "react";

// Mock SVG wordmarks for the requested companies
const logos = [
    { 
        name: "OpenAI", 
        svg: (
            <svg viewBox="0 0 120 32" className="h-6 md:h-8 w-auto fill-current" preserveAspectRatio="xMidYMid meet">
                <text x="0" y="24" fontFamily="system-ui, sans-serif" fontSize="24" fontWeight="800" letterSpacing="-1">OpenAI</text>
            </svg>
        ) 
    },
    { 
        name: "Anthropic", 
        svg: (
            <svg viewBox="0 0 130 32" className="h-6 md:h-8 w-auto fill-current" preserveAspectRatio="xMidYMid meet">
                <text x="0" y="24" fontFamily="Georgia, serif" fontSize="24" fontStyle="italic" letterSpacing="0">Anthropic</text>
            </svg>
        ) 
    },
    { 
        name: "LangChain", 
        svg: (
            <svg viewBox="0 0 145 32" className="h-6 md:h-8 w-auto fill-current" preserveAspectRatio="xMidYMid meet">
                <text x="0" y="24" fontFamily="monospace" fontSize="24" fontWeight="bold">🦜🔗 LangChain</text>
            </svg>
        ) 
    },
    { 
        name: "Vercel", 
        svg: (
            <svg viewBox="0 0 115 32" className="h-6 md:h-8 w-auto fill-current" preserveAspectRatio="xMidYMid meet">
                <path d="M14 6L28 30H0L14 6Z" />
                <text x="36" y="26" fontFamily="system-ui, sans-serif" fontSize="24" fontWeight="700" letterSpacing="-1">Vercel</text>
            </svg>
        ) 
    },
    { 
        name: "Hugging Face", 
        svg: (
            <svg viewBox="0 0 170 32" className="h-6 md:h-8 w-auto fill-current" preserveAspectRatio="xMidYMid meet">
                <text x="0" y="24" fontFamily="system-ui, sans-serif" fontSize="24" fontWeight="800" letterSpacing="-0.5">🤗 Hugging Face</text>
            </svg>
        ) 
    },
    { 
        name: "Mistral", 
        svg: (
            <svg viewBox="0 0 110 32" className="h-6 md:h-8 w-auto fill-current" preserveAspectRatio="xMidYMid meet">
                <text x="0" y="24" fontFamily="Georgia, serif" fontSize="22" fontWeight="700" letterSpacing="2">MISTRAL</text>
            </svg>
        ) 
    },
    { 
        name: "Replicate", 
        svg: (
            <svg viewBox="0 0 120 32" className="h-6 md:h-8 w-auto fill-current" preserveAspectRatio="xMidYMid meet">
                <text x="0" y="24" fontFamily="system-ui, sans-serif" fontSize="24" fontWeight="800" letterSpacing="-1">replicate</text>
            </svg>
        ) 
    },
    { 
        name: "Together AI", 
        svg: (
            <svg viewBox="0 0 150 32" className="h-6 md:h-8 w-auto fill-current" preserveAspectRatio="xMidYMid meet">
                <text x="0" y="24" fontFamily="system-ui, sans-serif" fontSize="24" fontWeight="500" letterSpacing="-0.5">Together AI</text>
            </svg>
        ) 
    }
];

export default function TrustedBySection() {
    return (
        <section className="w-full pt-16 pb-24 bg-[#111111] overflow-hidden flex flex-col items-center">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#8e8e93] font-mono mb-12 text-center px-4">
                Powering AI applications at companies like
            </p>

            <div 
                className="relative w-full max-w-[1400px] mx-auto overflow-hidden group"
                aria-hidden="true"
                style={{
                    maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                    WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)"
                }}
            >
                <div className="flex w-max animate-[logo-scroll_35s_linear_infinite] group-hover:[animation-play-state:paused]">
                    <div className="flex items-center justify-around w-1/2">
                        {logos.map((logo, index) => (
                            <div key={`set1-${index}`} className="flex items-center justify-center mx-6 md:mx-8 lg:mx-10 text-[#a1a1aa] opacity-45 hover:opacity-80 transition-opacity duration-200 cursor-default">
                                {logo.svg}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-around w-1/2">
                        {logos.map((logo, index) => (
                            <div key={`set2-${index}`} className="flex items-center justify-center mx-6 md:mx-8 lg:mx-10 text-[#a1a1aa] opacity-45 hover:opacity-80 transition-opacity duration-200 cursor-default">
                                {logo.svg}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes logo-scroll {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
            `}</style>
        </section>
    );
}
