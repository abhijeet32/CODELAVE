import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/header";
import HeroSection from "@/components/sections/HeroSection";
import DashboardSection from "@/components/sections/DashboardSection";
import StatsSection from "@/components/sections/StatsSection";
import ProblemSection from "@/components/sections/ProblemSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import UseCasesSection from "@/components/sections/UseCasesSection";
import GetStartedSection from "@/components/sections/GetStartedSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import PricingSection from "@/components/sections/PricingSection";
import FaqSection from "@/components/sections/FaqSection";
import CtaSection from "@/components/sections/CtaSection";

export default function Page() {
  return (
    <>
      {/* <SplashScreen> */}
      <Navbar />
      <HeroSection />
      <DashboardSection />
      <StatsSection />
      <ProblemSection />
      <HowItWorksSection />
      <UseCasesSection />
      <GetStartedSection />
      <FeaturesSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <Footer />
      {/* </SplashScreen> */}
    </>
  )
}




















































































// import Link from 'next/link';
// // import Footer from '@/components/Footer';

// export const metadata = {
//   title: 'Codelave - Managed Code Execution',
//   description: 'The ultimate platform for secure, scalable, and instant code execution environments.',
// };

// /* ── Reusable sub-components ─────────────────────────── */

// /** Figma-style L-shaped corner brackets */
// function CornerBrackets() {
//   return (
//     <>
//       <span className="absolute -top-px -left-px w-1.5 h-1.5 border-white border-solid border-t border-l z-5 bg-transparent" />
//       <span className="absolute -top-px -right-px w-1.5 h-1.5 border-white border-solid border-t border-r z-5 bg-transparent" />
//       <span className="absolute -bottom-px -left-px w-1.5 h-1.5 border-white border-solid border-b border-l z-5 bg-transparent" />
//       <span className="absolute -bottom-px -right-px w-1.5 h-1.5 border-white border-solid border-b border-r z-5 bg-transparent" />
//     </>
//   );
// }

// /** 3×3 dot-grid SVG icon */
// function GridIcon() {
//   return (
//     <svg className="w-3.5 h-3.5 shrink-0 text-inherit" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
//       <rect x="2" y="2" width="3" height="3" rx="0.5" />
//       <rect x="6.5" y="2" width="3" height="3" rx="0.5" />
//       <rect x="11" y="2" width="3" height="3" rx="0.5" />
//       <rect x="2" y="6.5" width="3" height="3" rx="0.5" />
//       <rect x="6.5" y="6.5" width="3" height="3" rx="0.5" />
//       <rect x="11" y="6.5" width="3" height="3" rx="0.5" />
//       <rect x="2" y="11" width="3" height="3" rx="0.5" />
//       <rect x="6.5" y="11" width="3" height="3" rx="0.5" />
//       <rect x="11" y="11" width="3" height="3" rx="0.5" />
//     </svg>
//   );
// }

// /** CTA button used in navbar + hero */
// function CtaButton({
//   href,
//   label,
// }: {
//   href: string;
//   label: string;
// }) {
//   return (
//     <Link
//       href={href}
//       className="group inline-flex items-center gap-0 font-serif text-white p-0
//                  border border-dashed border-[#3e3e42] bg-[#141416]
//                  no-underline tracking-tight transition-all duration-200
//                  overflow-visible relative
//                  hover:border-[#636366] hover:bg-[#1c1c1e]
//                  md:w-auto w-full justify-center"
//     >
//       <CornerBrackets />
//       <span className="font-serif px-6 py-3 text-base font-normal text-white">{label}</span>
//       <span className="flex items-center justify-center px-4 py-3 border-l border-dashed border-[#3e3e42] text-[#8e8e93] transition-colors duration-200 bg-[#18181c] group-hover:text-white">
//         <GridIcon />
//       </span>
//     </Link>
//   );
// }

// /* ── Page ─────────────────────────────────────────────── */

// export default function LandingPage() {
//   return (
//     <SplashScreen>
//       {/* Centered website wrapper */}
//       <div
//         className="min-h-screen max-w-6xl mx-auto bg-[#111111] overflow-x-hidden"
//         style={{ maxWidth: '1152px', margin: '0 auto', width: '100%' }}
//       >

//         {/* ─── Navbar ───────────────────────────────────── */}
//         <header
//           className="relative border border-dashed border-[#3e3e42] bg-[#111111] z-10"
//           style={{ margin: '2rem 3rem 0' }}
//         >
//           <CornerBrackets />
//           <div className="flex justify-between items-center px-8 py-4 max-md:px-4 max-md:py-3">
//             <Link
//               href="/"
//               className="flex items-center gap-1.5 font-serif text-[1.4rem] font-normal text-[#d4d4d4] tracking-tight no-underline transition-colors duration-200 hover:text-white"
//             >
//               <svg className="w-4 h-3.5 text-[#d4d4d4] shrink-0" width="16" height="14" viewBox="0 0 16 14" fill="none">
//                 <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
//                 <path d="M8 1L14 7L8 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
//               </svg>
//               Codelave
//             </Link>

//             <div className="flex items-center gap-8 max-md:hidden">
//               <Link href="/" className="font-sans text-sm font-normal text-[#7a7a7a] no-underline tracking-wide transition-colors duration-200 hover:text-[#d4d4d4]">Home</Link>
//               <Link href="#about" className="font-sans text-sm font-normal text-[#7a7a7a] no-underline tracking-wide transition-colors duration-200 hover:text-[#d4d4d4]">About</Link>
//               <Link href="#pricing" className="font-sans text-sm font-normal text-[#7a7a7a] no-underline tracking-wide transition-colors duration-200 hover:text-[#d4d4d4]">Pricing</Link>
//               <Link href="#updates" className="font-sans text-sm font-normal text-[#7a7a7a] no-underline tracking-wide transition-colors duration-200 hover:text-[#d4d4d4]">Updates</Link>
//               <Link href="/blog" className="font-sans text-sm font-normal text-[#7a7a7a] no-underline tracking-wide transition-colors duration-200 hover:text-[#d4d4d4]">Blog</Link>
//             </div>

//             <CtaButton href="/signup" label="Get Started" />
//           </div>
//         </header>

//         {/* ─── Hero Section ─────────────────────────────── */}
//         <section className="flex flex-col items-center text-center px-10 pt-28 pb-20 relative max-md:px-6 max-md:pt-20 max-md:pb-14 flex-1 justify-center">

//           {/* Badge */}
//           <div className="inline-flex items-center gap-3.5 mb-12 px-5 py-2 border border-dashed border-[#3e3e42] rounded-sm bg-[#141416] relative animate-[lpSlideDown_0.6s_ease-out]">
//             <CornerBrackets />
//             <span className="inline-flex items-center gap-0.5" >
//               <span className="inline-block w-[3px] h-2.5 bg-[#E8501E] opacity-30" />
//               <span className="inline-block w-[3px] h-2.5 bg-[#E8501E] opacity-60" />
//               <span className="inline-block w-[3px] h-2.5 bg-[#E8501E] opacity-100" />
//               <span className="inline-block w-[3px] h-2.5 bg-[#E8501E] opacity-60" />
//               <span className="inline-block w-[3px] h-2.5 bg-[#E8501E] opacity-30" />
//             </span>
//             <span className="font-sans text-[0.7rem] font-medium text-[#8e8e93] tracking-[0.18em] uppercase">
//               CLOUD-POWERED SANDBOXES
//             </span>
//           </div>

//           {/* Title */}
//           <h1 className="font-serif text-[4.2rem] font-normal leading-[1.12] -tracking-tight text-[#f0f0f0] mb-8 animate-[lpFadeUp_0.7s_ease-out] max-md:text-4xl">
//             Secure Execution<br />
//             for Modern Teams
//           </h1>

//           {/* Subtitle */}
//           <p className="font-sans text-base font-normal text-[#666666] leading-relaxed max-w-lg mx-auto mb-14 tracking-tight animate-[lpFadeUp_0.85s_ease-out] max-md:text-sm">
//             Deploy instant sandboxes, run any code securely,<br />
//             and manage environments from one unified platform.
//           </p>

//           {/* Actions */}
//           <div className="flex items-center gap-5 animate-[lpFadeUp_1s_ease-out] max-md:flex-col max-md:w-full">
//             <CtaButton href="/signup" label="Get Started" />
//             <CtaButton href="/login" label="Sign In" />
//           </div>
//         </section>

//         {/* ─── Footer ───────────────────────────────────── */}
//         <Footer />
//       </div>
//     </SplashScreen>
//   );
// }
