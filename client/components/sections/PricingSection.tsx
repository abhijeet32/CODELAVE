"use client";

import { motion } from "framer-motion";
import { AnimatedButton } from "@/components/layout/header";

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

function CheckIcon() {
    return (
        <div className="w-4 h-4 shrink-0 flex items-center justify-center text-[#E8501E]">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    );
}

const plans = [
    {
        name: "Free Plan",
        badge: null,
        description: "Perfect for getting started",
        price: "$0",
        period: "/month",
        buttonText: "Get Started Free",
        features: [
            "50 sandboxes per month",
            "1 hour compute per month",
            "3 concurrent sandboxes",
            "30 min max sandbox duration",
            "Python and Node.js templates",
            "Community support"
        ]
    },
    {
        name: "Pro Plan",
        badge: "Most Popular ⭐",
        description: "For production AI applications",
        price: "$29",
        period: "/month",
        buttonText: "Start Pro Trial",
        features: [
            "Unlimited sandboxes",
            "100 hours compute per month",
            "20 concurrent sandboxes",
            "24 hour max sandbox duration",
            "All templates including Research",
            "Real time streaming",
            "File upload and download",
            "Priority email support"
        ]
    },
    {
        name: "Enterprise",
        badge: null,
        description: "For teams at scale",
        price: "Custom",
        period: "",
        buttonText: "Contact Us",
        features: [
            "Everything in Pro",
            "Unlimited compute",
            "Unlimited concurrent sandboxes",
            "Custom sandbox templates",
            "Bring your own cloud (BYOC)",
            "SLA guarantee",
            "Dedicated support",
            "Custom contracts"
        ]
    }
];

export default function PricingSection() {
    return (
        <section id="pricing" className="relative w-full pt-24 pb-6 px-6 lg:px-8">
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
                {/* Side border lines extending past top/bottom padding to connect sections */}
                <div className="absolute -top-24 -bottom-6 left-0 w-[1px] border-l border-dashed border-white/10 pointer-events-none hidden md:block" />
                <div className="absolute -top-24 -bottom-6 right-0 w-[1px] border-r border-dashed border-white/10 pointer-events-none hidden md:block" />
                {/* Header Content */}
                <div className="flex flex-col items-center w-full relative pt-12">
                    {/* Badge */}
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
                        }}
                        className="relative inline-flex items-center gap-3 px-5 py-2 border border-dashed border-white/10 mb-6"
                    >
                        <CornerBrackets />
                        <IndicatorBars />
                        <span className="text-[13px] tracking-[0.15em] uppercase text-[#969696] font-navbar font-medium">
                            Pricing
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h2
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
                        }}
                        className="text-4xl sm:text-[56px] font-bold text-[#F2F2F2] font-hero-heading text-center tracking-tight leading-tight"
                    >
                        Start Free. Scale When Ready.
                    </motion.h2>

                    {/* Subheadline */}
                    <motion.p
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
                        }}
                        className="mt-5 text-[16px] leading-[26px] text-[#969696] font-normal font-navbar text-center max-w-lg"
                    >
                        No credit card required to get started.
                    </motion.p>
                </div>

                {/* Pricing Container */}
                <motion.div 
                    variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2, ease: "easeOut" } },
                    }}
                    className="relative w-full mt-24 mb-12 border-y border-dashed border-white/10 p-6 py-16 md:p-16 lg:px-20 lg:py-24 overflow-hidden flex justify-center"
                >
                    <CornerBrackets />
                    
                    {/* Background Image */}
                    <div 
                        className="absolute inset-0 pointer-events-none bg-cover bg-center"
                        style={{ backgroundImage: "url('/pricing-bg.png')" }}
                    />
                    
                    {/* Subtle edge vignette to blend with page */}
                    <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: `
                                linear-gradient(to right, rgba(7,7,7,0.4) 0%, transparent 10%, transparent 90%, rgba(7,7,7,0.4) 100%),
                                linear-gradient(to bottom, rgba(7,7,7,0.3) 0%, transparent 15%, transparent 85%, rgba(7,7,7,0.4) 100%)
                            `
                        }}
                    />

                    {/* Pricing Cards Wrapper */}
                    <div className="relative w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-3 border border-dashed border-white/10 bg-[#0F0F0F] shadow-[0_0_80px_rgba(0,0,0,0.8)] z-10">
                        <CornerBrackets />
                        
                        {plans.map((plan, index) => (
                            <div 
                                key={index} 
                                className={`p-8 md:p-10 relative flex flex-col ${
                                    index !== plans.length - 1 ? 'border-b md:border-b-0 md:border-r border-dashed border-white/10' : ''
                                }`}
                            >
                            {/* Popular Badge */}
                            {plan.badge && (
                                <div className="absolute top-8 right-8 border border-dashed border-[#E8501E]/30 bg-[#E8501E]/10 px-3 py-1 text-[11px] font-bold tracking-widest uppercase text-[#E8501E] font-navbar">
                                    <CornerBrackets tl tr bl br />
                                    {plan.badge}
                                </div>
                            )}

                            <h3 className="text-[24px] font-hero-heading text-[#F2F2F2] mb-2">{plan.name}</h3>
                            <p className="text-[15px] text-[#969696] font-navbar mb-8 h-[40px]">{plan.description}</p>
                            
                            <div className="flex items-baseline gap-2">
                                <span className="text-[48px] md:text-[56px] font-hero-heading font-bold text-[#F2F2F2] leading-none tracking-tight">
                                    {plan.price}
                                </span>
                                {plan.period && (
                                    <span className="text-[16px] text-[#969696] font-navbar font-normal">
                                        {plan.period}
                                    </span>
                                )}
                            </div>

                            <AnimatedButton href="#" className="w-full mt-8 mb-8">
                                {plan.buttonText}
                            </AnimatedButton>

                            <ul className="flex flex-col gap-2 flex-1">
                                {plan.features.map((feature, fIndex) => (
                                    <li key={fIndex} className="flex items-start gap-3">
                                        <CheckIcon />
                                        <span className="text-[15px] leading-snug text-[#b5b5b5] font-navbar">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
