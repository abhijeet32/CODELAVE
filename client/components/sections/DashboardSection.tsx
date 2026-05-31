"use client";

import { motion } from "framer-motion";
import Image from "next/image";

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

export default function DashboardSection() {
    return (
        <section className="relative w-full px-6 lg:px-8">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
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
                {/* Connecting border lines on the sides */}
                <div className="absolute inset-y-0 left-0 w-[1px] border-l border-dashed border-white/10 pointer-events-none hidden md:block" />
                <div className="absolute inset-y-0 right-0 w-[1px] border-r border-dashed border-white/10 pointer-events-none hidden md:block" />

                {/* Dashboard Outer Container with Dotted/Wave Background */}
                <div className="relative w-full border-y border-dashed border-white/10 px-6 py-6 md:px-16 md:py-10 lg:px-20 lg:py-12 overflow-hidden flex justify-center mt-2 mb-6">
                    <CornerBrackets />

                    {/* Background Image (same as Pricing) */}
                    <div 
                        className="absolute inset-0 pointer-events-none bg-cover bg-center"
                        style={{ backgroundImage: "url('/pricing-bg.png')" }}
                    />
                    
                    {/* Vignette */}
                    <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: `
                                linear-gradient(to right, rgba(7,7,7,0.4) 0%, transparent 10%, transparent 90%, rgba(7,7,7,0.4) 100%),
                                linear-gradient(to bottom, rgba(7,7,7,0.3) 0%, transparent 15%, transparent 85%, rgba(7,7,7,0.4) 100%)
                            `
                        }}
                    />

                    {/* Image Wrapper */}
                    <div className="relative w-full max-w-[1250px] border border-dashed border-white/10 bg-[#0F0F0F] shadow-[0_0_80px_rgba(0,0,0,0.8)] z-10 p-2 md:p-4">
                        <CornerBrackets />
                        <div className="relative w-full overflow-hidden">
                            <Image 
                                src="/dashboard.png" 
                                alt="Codelave Dashboard Preview" 
                                width={1300} 
                                height={750}
                                className="w-full h-auto object-cover"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
