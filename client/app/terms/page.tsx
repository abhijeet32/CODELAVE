import Navbar from "@/components/layout/header";
import Footer from "@/components/layout/Footer";

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
            <span className="inline-block w-[3px] h-[10px] bg-[#E8501E] opacity-100" />
            <span className="inline-block w-[3px] h-[10px] bg-[#E8501E] opacity-60" />
            <span className="inline-block w-[3px] h-[10px] bg-[#E8501E] opacity-30" />
        </div>
    );
}

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#070707] flex flex-col items-center">
            <Navbar />
            <main className="flex-grow w-full max-w-[1400px] border-x border-dashed border-white/10 pt-40 pb-32 px-6 lg:px-8 relative flex flex-col items-center">
                
                {/* Badge */}
                <div className="relative inline-flex items-center gap-3 px-5 py-2 border border-dashed border-white/10 mb-8">
                    <CornerBrackets />
                    <IndicatorBars />
                    <span className="text-[11px] tracking-[0.15em] uppercase text-[#969696] font-navbar font-medium">
                        LEGALS
                    </span>
                </div>

                {/* Headline */}
                <h1 className="text-5xl sm:text-[64px] font-normal text-[#F2F2F2] font-hero-heading mb-16 text-center tracking-tight leading-tight">
                    Terms of Service
                </h1>

                {/* Content */}
                <div className="max-w-3xl w-full text-[#969696] font-navbar leading-[1.7] text-[16px]">
                    <p className="mb-6 italic">This is a sample legal document provided for template demonstration purposes only. It does not constitute legal advice.</p>
                    <p className="mb-14 italic text-[#666666]">Last updated: January 1, 2026</p>
                    
                    <h2 className="text-[24px] font-normal text-[#e5e5e5] font-hero-heading mt-12 mb-5 tracking-tight">1. Acceptance of Terms</h2>
                    <p className="mb-6">By accessing or using Codelave, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services.</p>

                    <h2 className="text-[24px] font-normal text-[#e5e5e5] font-hero-heading mt-12 mb-5 tracking-tight">2. Use of the Service</h2>
                    <p className="mb-6">You agree to use the service only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account credentials.</p>
                    <ul className="list-disc pl-5 mb-6 space-y-2">
                        <li>You must not use the Service to execute malicious code, malware, or viruses.</li>
                        <li>You must not attempt to breach or circumvent our security or isolation mechanisms.</li>
                        <li>You are responsible for the security of your API keys and authentication credentials.</li>
                    </ul>

                    <h2 className="text-[24px] font-normal text-[#e5e5e5] font-hero-heading mt-12 mb-5 tracking-tight">3. Subscription & Payments</h2>
                    <p className="mb-6">Certain features may require a paid subscription. Fees are billed in advance and are non-refundable unless otherwise stated. We reserve the right to modify our pricing with reasonable notice.</p>

                    <h2 className="text-[24px] font-normal text-[#e5e5e5] font-hero-heading mt-12 mb-5 tracking-tight">4. Intellectual Property</h2>
                    <p className="mb-6">All content, software, and materials provided through the service are owned by Codelave and are protected by intellectual property laws. You retain ownership of any code you execute or data you process through our sandboxes.</p>

                    <h2 className="text-[24px] font-normal text-[#e5e5e5] font-hero-heading mt-12 mb-5 tracking-tight">5. Limitation of Liability</h2>
                    <p className="mb-6">In no event shall Codelave, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

                    <h2 className="text-[24px] font-normal text-[#e5e5e5] font-hero-heading mt-12 mb-5 tracking-tight">6. Termination</h2>
                    <p className="mb-6">We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
