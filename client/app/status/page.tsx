import Navbar from "@/components/layout/header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function ComingSoonPage() {
    return (
        <div className="min-h-screen bg-[#070707] flex flex-col">
            <Navbar />
            <main className="flex-grow flex flex-col items-center justify-center px-6 lg:px-8">
                <div className="text-center max-w-lg mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-white/10 bg-[#161B22]/50 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E8501E]" />
                        <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-[#F2F2F2] font-medium">
                            Coming Soon
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold text-white font-hero-heading mb-6 tracking-tight">
                        Under Construction
                    </h1>
                    <p className="text-[#969696] font-navbar leading-relaxed mb-8">
                        We're currently working hard to bring you this page. Please check back later or return to the home page to explore what we have today.
                    </p>
                    <Link 
                        href="/" 
                        className="inline-flex items-center justify-center px-6 py-3 bg-white text-black font-semibold rounded hover:bg-[#E8501E] hover:text-white transition-colors duration-200 font-navbar"
                    >
                        Return to Home
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}
