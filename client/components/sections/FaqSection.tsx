"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

const faqs = [
    {
        question: "Is it safe to run AI-generated code?",
        answer: "Yes. Every sandbox runs in a completely isolated container with its own filesystem, network, and process space. Code inside a sandbox cannot access anything outside it."
    },
    {
        question: "Which programming languages are supported?",
        answer: "Python and Node.js are fully supported with pre-installed packages. The Research template adds web browsing and scraping tools. More templates are coming soon."
    },
    {
        question: "How fast do sandboxes start?",
        answer: "Sandboxes start in under 500 milliseconds. Your users will never notice the startup time."
    },
    {
        question: "What happens when a sandbox times out?",
        answer: "Sandboxes are automatically destroyed after their timeout period. All data inside is permanently deleted. You can also destroy sandboxes manually at any time."
    },
    {
        question: "Can I use Codelave with any LLM?",
        answer: "Yes. Codelave works with any LLM or AI framework. OpenAI, Anthropic, Mistral, LangChain, LlamaIndex — it does not matter. You just pass the generated code to our SDK."
    },
    {
        question: "Do you store the code that runs in sandboxes?",
        answer: "We store execution logs for debugging purposes. You can disable this in your account settings. We never use your code to train any model."
    },
    {
        question: "What is the difference between a sandbox and a server?",
        answer: "A server runs permanently and hosts your app. A sandbox is temporary — it exists only while your code is running, then disappears. You pay only for what you use."
    }
];

function FaqItem({ faq, isOpen, onClick, isLast }: { faq: typeof faqs[0], isOpen: boolean, onClick: () => void, isLast: boolean }) {
    return (
        <div className={`relative border-dashed border-white/10 bg-[#0F0F0F] transition-colors hover:bg-[#141414] cursor-pointer ${isLast ? "" : "border-b"}`} onClick={onClick}>
            <div className="p-2 md:p-4 flex justify-between items-center gap-1">
                <h3 className={`text-[17.6px] font-hero-heading tracking-tight ${isOpen ? "text-[#E8501E]" : "text-[#F2F2F2]"}`}>
                    {faq.question}
                </h3>

                {/* Plus/Minus Icon */}
                <div className="relative w-10 h-10 shrink-0 flex items-center justify-center border border-dashed border-white/10">
                    <CornerBrackets />
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="absolute w-4 h-[2px] bg-[#969696] rounded-full"
                    />
                    <motion.div
                        animate={{ rotate: isOpen ? 90 : 0, opacity: isOpen ? 0 : 1 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="absolute w-[2px] h-4 bg-[#969696] rounded-full"
                    />
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 md:px-8 pb-8 pt-0">
                            <p className="text-[16px] leading-[26px] text-[#969696] font-navbar max-w-3xl">
                                {faq.answer}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="relative w-full pt-24 pb-6 px-6 lg:px-8">
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
                            FAQ
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
                        Frequently Asked Questions
                    </motion.h2>

                    {/* Subheading */}
                    <motion.p
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
                        }}
                        className="mt-5 text-[16px] leading-[26px] text-[#969696] font-normal font-navbar text-center max-w-lg"
                    >
                        Everything you need to know about the product and billing.
                    </motion.p>
                </div>

                {/* FAQ List */}
                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2, ease: "easeOut" } },
                    }}
                    className="relative w-full mt-16 border-y border-dashed border-white/10 bg-[#0F0F0F] flex flex-col"
                >
                    <CornerBrackets />
                    {faqs.map((faq, index) => (
                        <FaqItem
                            key={index}
                            faq={faq}
                            isOpen={openIndex === index}
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            isLast={index === faqs.length - 1}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
}
