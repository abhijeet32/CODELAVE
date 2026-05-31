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

export default function PrivacyPolicyPage() {
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
                    Privacy Policy
                </h1>

                {/* Content */}
                <div className="max-w-3xl w-full text-[#969696] font-navbar leading-[1.7] text-[16px]">
                    <p className="mb-6 italic">This is a sample legal document provided for template demonstration purposes only. It does not constitute legal advice.</p>
                    <p className="mb-14 italic text-[#666666]">Last updated: January 1, 2026</p>
                    
                    <h2 className="text-[24px] font-normal text-[#e5e5e5] font-hero-heading mt-12 mb-5 tracking-tight">1. Information We Collect</h2>
                    <p className="mb-6">We collect information you provide directly to us when you create an account, use our services, or communicate with us. This includes your name, email address, billing information, and any code or data you execute within our sandboxes.</p>

                    <h2 className="text-[24px] font-normal text-[#e5e5e5] font-hero-heading mt-12 mb-5 tracking-tight">2. How We Use Your Information</h2>
                    <p className="mb-6">We use the information we collect to provide, maintain, and improve our services, process transactions, send technical notices, and protect the security of our platform. We do not use your executed code to train our AI models without explicit consent.</p>

                    <h2 className="text-[24px] font-normal text-[#e5e5e5] font-hero-heading mt-12 mb-5 tracking-tight">3. Data Security and Sandboxing</h2>
                    <p className="mb-6">All user code is executed in isolated, ephemeral environments. We employ strict network boundaries, containerization, and microVM isolation to ensure that data does not leak between sessions or tenants. Executed artifacts are automatically destroyed after the session ends.</p>

                    <h2 className="text-[24px] font-normal text-[#e5e5e5] font-hero-heading mt-12 mb-5 tracking-tight">4. Third-Party Services</h2>
                    <p className="mb-6">We may share information with third-party vendors and service providers that perform services on our behalf, such as payment processors and cloud infrastructure providers. These third parties are bound by strict confidentiality obligations.</p>

                    <h2 className="text-[24px] font-normal text-[#e5e5e5] font-hero-heading mt-12 mb-5 tracking-tight">5. User Rights</h2>
                    <p className="mb-6">Depending on your location, you may have certain rights regarding your personal data, including the right to access, correct, delete, or restrict the processing of your information. You can exercise these rights by contacting us directly.</p>

                    <h2 className="text-[24px] font-normal text-[#e5e5e5] font-hero-heading mt-12 mb-5 tracking-tight">6. Contact Us</h2>
                    <p className="mb-6">If you have any questions about this Privacy Policy, please contact us at privacy@codelave.dev.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
