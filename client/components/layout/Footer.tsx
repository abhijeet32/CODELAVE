import Link from 'next/link';
import Image from 'next/image';
import logo from "../../public/logo.png";


/** Figma-style L-shaped corner brackets */
function CornerBrackets({ tl = true, tr = true, bl = true, br = true }: { tl?: boolean, tr?: boolean, bl?: boolean, br?: boolean }) {
  return (
    <>
      {tl && <span className="absolute -top-px -left-px w-1.5 h-1.5 border-white border-solid border-t border-l z-10 bg-transparent pointer-events-none" />}
      {tr && <span className="absolute -top-px -right-px w-1.5 h-1.5 border-white border-solid border-t border-r z-10 bg-transparent pointer-events-none" />}
      {bl && <span className="absolute -bottom-px -left-px w-1.5 h-1.5 border-white border-solid border-b border-l z-10 bg-transparent pointer-events-none" />}
      {br && <span className="absolute -bottom-px -right-px w-1.5 h-1.5 border-white border-solid border-b border-r z-10 bg-transparent pointer-events-none" />}
    </>
  );
}

export default function Footer() {
  return (
    <footer className="relative bg-[#070707] z-10 w-full px-6 lg:px-8">
      <div className="relative mx-auto max-w-[1400px] border-x border-t border-dashed border-white/10 flex flex-col">
        <CornerBrackets bl={false} br={false} />

        <div className="grid grid-cols-1 md:grid-cols-11 w-full">
          {/* Brand Section */}
          <div className="md:col-span-5 p-10 max-md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Image src={logo} alt="Codelave" width={44} height={44} className="w-11 h-auto object-contain" />
              <h2 className="font-hero-heading text-[#F2F2F2] text-[24px] font-normal tracking-tight">
                Codelave
              </h2>
            </div>
            <p className="font-navbar text-[16px] text-[#969696] max-w-sm leading-relaxed">
              Managed Code Execution Infrastructure for AI Agents
            </p>
          </div>

          {/* Product Links */}
          <div className="md:col-span-2 p-10 max-md:p-8 md:border-l border-t md:border-t-0 border-dashed border-white/10">
            <h3 className="font-hero-heading text-[#F2F2F2] text-[17.6px] font-normal tracking-tight mb-6">Product</h3>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/#pricing" className="font-navbar text-[16px] font-normal text-[#969696] hover:text-[#d4d4d4] transition-colors">Pricing</Link></li>
              <li><Link href="/changelog" className="font-navbar text-[16px] font-normal text-[#969696] hover:text-[#d4d4d4] transition-colors">Changelog</Link></li>
              <li><Link href="/roadmap" className="font-navbar text-[16px] font-normal text-[#969696] hover:text-[#d4d4d4] transition-colors">Roadmap</Link></li>
              <li><Link href="/status" className="font-navbar text-[16px] font-normal text-[#969696] hover:text-[#d4d4d4] transition-colors">Status</Link></li>
            </ul>
          </div>

          {/* Developers Links */}
          <div className="md:col-span-2 p-10 max-md:p-8 md:border-l border-t md:border-t-0 border-dashed border-white/10">
            <h3 className="font-hero-heading text-[#F2F2F2] text-[17.6px] font-normal tracking-tight mb-6">Developers</h3>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="https://github.com/codelave/node" className="font-navbar text-[16px] font-normal text-[#969696] hover:text-[#d4d4d4] transition-colors">SDK - Node.js</Link></li>
              <li><Link href="https://github.com/codelave/python" className="font-navbar text-[16px] font-normal text-[#969696] hover:text-[#d4d4d4] transition-colors">SDK - Python</Link></li>
              <li><Link href="https://github.com/codelave" className="font-navbar text-[16px] font-normal text-[#969696] hover:text-[#d4d4d4] transition-colors">GitHub</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="md:col-span-2 p-10 max-md:p-8 md:border-l border-t md:border-t-0 border-dashed border-white/10">
            <h3 className="font-hero-heading text-[#F2F2F2] text-[17.6px] font-normal tracking-tight mb-6">Company</h3>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/#features" className="font-navbar text-[16px] font-normal text-[#969696] hover:text-[#d4d4d4] transition-colors">About</Link></li>
              <li><Link href="/blog" className="font-navbar text-[16px] font-normal text-[#969696] hover:text-[#d4d4d4] transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="font-navbar text-[16px] font-normal text-[#969696] hover:text-[#d4d4d4] transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="font-navbar text-[16px] font-normal text-[#969696] hover:text-[#d4d4d4] transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="font-navbar text-[16px] font-normal text-[#969696] hover:text-[#d4d4d4] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="font-navbar text-[16px] font-normal text-[#969696] hover:text-[#d4d4d4] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dashed border-white/10 px-10 py-6 max-md:px-8 max-md:py-8 flex justify-between items-center max-md:flex-col max-md:gap-6 max-md:items-start w-full">
          <div className="flex flex-col gap-1">
            <span className="font-navbar text-[13px] font-normal text-[#969696]">
              © 2026 Codelave. All rights reserved.
            </span>
            <span className="font-navbar text-[13px] font-normal text-[#666666]">
              Built for developers, by developers.
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="https://github.com/codelave" className="font-navbar text-[13px] font-normal text-[#969696] hover:text-[#d4d4d4] transition-colors">GitHub</Link>
            <Link href="https://twitter.com/codelave" className="font-navbar text-[13px] font-normal text-[#969696] hover:text-[#d4d4d4] transition-colors">Twitter/X</Link>
            <Link href="https://discord.gg/codelave" className="font-navbar text-[13px] font-normal text-[#969696] hover:text-[#d4d4d4] transition-colors">Discord</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
