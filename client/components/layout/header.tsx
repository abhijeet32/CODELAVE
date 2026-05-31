"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { MdArrowOutward } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/logo.png";
import { Bug } from "lucide-react";
import { motion } from "framer-motion";

const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#features" },
    { name: "Pricing", href: "/#pricing" },
    { name: "Github", href: "https://github.com/codelave" },
];


export const AnimatedButton = ({ children, href, className = "", onClick, hideLeftCorners = false, hideRightCorners = false }: { children: React.ReactNode, href: string, className?: string, onClick?: () => void, hideLeftCorners?: boolean, hideRightCorners?: boolean }) => {
    return (
        <Link href={href} onClick={onClick} className={`group relative inline-flex items-center justify-between gap-6 bg-[#0F0F0F] py-2 pr-2 pl-5 transition-all border border-dashed border-white/10 ${className}`}>
            {/* Corners */}
            {!hideLeftCorners && <div className="absolute top-[-1px] left-[-1px] w-1.5 h-1.5 border-t border-l border-white pointer-events-none" />}
            {!hideRightCorners && <div className="absolute top-[-1px] right-[-1px] w-1.5 h-1.5 border-t border-r border-white pointer-events-none" />}
            {!hideLeftCorners && <div className="absolute bottom-[-1px] left-[-1px] w-1.5 h-1.5 border-b border-l border-white pointer-events-none" />}
            {!hideRightCorners && <div className="absolute bottom-[-1px] right-[-1px] w-1.5 h-1.5 border-b border-r border-white pointer-events-none" />}

            <div className="relative overflow-hidden inline-flex">
                {/* Invisible spacer to maintain width and height */}
                <span className="text-[16px] font-medium text-transparent pointer-events-none">
                    {children}
                </span>
                {/* Original text that scrolls up */}
                <span className="absolute left-0 top-0 text-[16px] font-medium text-[#F2F2F2] transition-transform duration-300 group-hover:-translate-y-full">
                    {children}
                </span>
                {/* New text that slides in from below */}
                <span className="absolute left-0 top-0 text-[16px] font-medium text-[#F2F2F2] transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                    {children}
                </span>
            </div>
            <div className="relative flex w-8 h-8 items-center justify-center bg-white/[0.03] border border-dashed border-white/10">
                <div className="absolute w-[4px] h-[4px] bg-white transition-all duration-300" />
                <div className="absolute w-[4px] h-[4px] bg-white -translate-y-[7px] group-hover:-translate-y-[4px] transition-all duration-300" />
                <div className="absolute w-[4px] h-[4px] bg-white translate-y-[7px] group-hover:translate-y-[4px] transition-all duration-300" />
                <div className="absolute w-[4px] h-[4px] bg-white -translate-x-[7px] group-hover:-translate-x-[4px] transition-all duration-300" />
                <div className="absolute w-[4px] h-[4px] bg-white translate-x-[7px] group-hover:translate-x-[4px] transition-all duration-300" />
            </div>
        </Link>
    )
}

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <header className={`fixed top-0 inset-x-0 z-[100] w-full transition-all duration-300 px-6 lg:px-8 ${isScrolled
                ? "bg-black/60 backdrop-blur-xl shadow-sm py-1"
                : "bg-transparent py-1"
                }`}>
                <nav
                    aria-label="Global"
                    className="relative mx-auto flex max-w-[1400px] items-center justify-between p-2  border border-dashed border-white/10"
                >
                    {/* Corners */}
                    <div className="absolute top-[-1px] left-[-1px] w-1.5 h-1.5 border-t border-l border-white pointer-events-none" />
                    <div className="absolute top-[-1px] right-[-1px] w-1.5 h-1.5 border-t border-r border-white pointer-events-none" />
                    <div className="absolute bottom-[-1px] left-[-1px] w-1.5 h-1.5 border-b border-l border-white pointer-events-none" />
                    <div className="absolute bottom-[-1px] right-[-1px] w-1.5 h-1.5 border-b border-r border-white pointer-events-none" />
                    <div className="flex lg:flex-1">
                        <a href="#" className="">
                            <div className="flex items-center justify-center gap-2 group">
                                <Image src={logo} alt="Codelave" width={40} height={40} className="w-10 h-10 object-contain" />
                                <span className="text-[20px] font-semibold text-[#F2F2F2] font-navbar">Codelave</span>
                            </div>
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex lg:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="-m-2.5 p-2.5 text-gray-400 hover:text-white transition-colors"
                        >
                            <Bars3Icon
                                aria-hidden="true"
                                className="size-8 cursor-pointer"
                            />
                        </button>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex lg:gap-x-6 items-center px-2 py-1">
                        {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="text-[16px] leading-[22.41px] font-normal text-[#969696] hover:text-white transition-colors duration-200 font-navbar"
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>

                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        <AnimatedButton href="/login">
                            Get Started
                        </AnimatedButton>
                    </div>
                </nav>

                {/* Mobile Menu */}
                <Dialog
                    open={mobileMenuOpen}
                    onClose={setMobileMenuOpen}
                    className="lg:hidden"
                >
                    <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm" />
                    <DialogPanel className="fixed inset-y-0 right-0 z-[120] w-full max-w-sm bg-[#0a0a0c] border-l border-white/5 p-6 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center justify-center gap-2">
                                <Image src="/logo.png" alt="Codelave" width={36} height={36} className="w-9 h-9 object-contain" />
                                <span className="text-[20px] font-semibold text-[#F2F2F2] font-navbar">Codelave</span>
                            </div>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="-m-2.5 p-2.5 text-gray-400 hover:text-white transition-colors"
                            >
                                <XMarkIcon
                                    aria-hidden="true"
                                    className="size-8 cursor-pointer"
                                />
                            </button>
                        </div>

                        <div className="mt-8 divide-y divide-white/10">
                            <div className="space-y-2 py-6">
                                {navigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block rounded-lg px-4 py-3 text-[16px] leading-[22.41px] font-normal text-[#969696] hover:bg-white/5 hover:text-white transition-colors font-navbar"
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                            <div className="py-6 flex flex-col gap-3">
                                <AnimatedButton href="/login" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                                    Log In
                                </AnimatedButton>
                                <AnimatedButton href="/signup" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                                    Get Started
                                </AnimatedButton>
                            </div>
                        </div>
                    </DialogPanel>
                </Dialog>
            </header>
        </>
    );
}