"use client";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconChartPie2,
  IconFolder,
  IconReport,
  IconAlertHexagon,
  IconUsb,
  IconBugFilled,
  IconKey,
  IconBox,
  IconPlayerPlay,
  IconCreditCard,
  IconSettings,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface Links {
  icon: string;
  label: string;
  href: string;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined,
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (
  props: React.ComponentProps<typeof motion.div> & {
    children?: React.ReactNode;
  },
) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar>
        {props.children}
      </MobileSidebar>
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div> & {
  children?: React.ReactNode;
}) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-full px-4 py-4 hidden md:flex md:flex-col w-[200px] shrink-0",
          className,
          "hidden md:flex"
        )}
        animate={{
          width: animate ? (open ? "200px" : "60px") : "200px",
        }}
        onClick={() => setOpen(true)}
        {...props}
      >
        <div
          className={cn(
            "mb-6 flex",
            open ? "flex-row items-center justify-between" : "flex-col items-center justify-center gap-4",
          )}
        >
          <div className="flex items-center gap-2">
            {open && (
              <div className="codelave-sidebar-brand-icon">
                <Image src="/logo.png" alt="Codelave Logo" width={26} height={26} className="w-auto h-auto object-contain dark:brightness-0 dark:invert" priority />
              </div>
            )}
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="codelave-sidebar-brand-text"
                >
                  Codelave
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div style={{ display: "flex" }}>
            <IconMenu2
              className="codelave-sidebar-toggle-icon"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
              }}
            />
          </div>
        </div>
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "codelave-mobile-sidebar-header md:hidden",
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          <div className="codelave-sidebar-brand-icon">
            <Image src="/logo.png" alt="Codelave Logo" width={26} height={26} className="w-auto h-auto object-contain dark:brightness-0 dark:invert" priority />
          </div>
          <span className="codelave-sidebar-brand-text-mobile">Codelave</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', zIndex: 20, cursor: 'pointer' }}>
          <IconMenu2
            className="codelave-sidebar-menu-icon"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="codelave-mobile-backdrop"
                onClick={() => setOpen(false)}
              />
              {/* Sidebar */}
              <motion.div
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className={cn(
                  "codelave-mobile-sidebar-panel",
                )}
              >
                <div
                  className="codelave-mobile-close"
                  onClick={() => setOpen(!open)}
                >
                  <IconX />
                </div>
                {children}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
}) => {
  const { open, animate } = useSidebar();
  const pathname = usePathname();
  const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));

  const icon = {
    IconArrowLeft,
    IconChartPie2,
    IconFolder,
    IconReport,
    IconAlertHexagon,
    IconUsb,
    IconBugFilled,
    IconKey,
    IconBox,
    IconPlayerPlay,
    IconCreditCard,
    IconSettings,
  };
  type IconName = keyof typeof icon;

  const iconname = link.icon as IconName;
  const Iconcomp = icon[iconname];
  return (
    <Link
      href={link.href}
      className={cn(
        "codelave-sidebar-link group relative",
        isActive && "codelave-sidebar-link-active",
        className,
      )}
      {...props}
    >
      <Iconcomp className={cn("codelave-sidebar-link-icon", isActive && "codelave-sidebar-link-icon-active")} />

      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="codelave-sidebar-link-text"
      >
        {link.label}
      </motion.span>
      {!open && (
        <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#0F0F0F] border border-white/10 shadow-lg text-white text-xs font-semibold rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
          {link.label}
        </div>
      )}
    </Link>
  );
};
