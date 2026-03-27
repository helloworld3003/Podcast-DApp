"use client";

import { useState, useEffect, useCallback } from "react";
import { NETWORK } from "@/hooks/contract";
import { Badge } from "@/components/ui/badge";

function WalletIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function CheckSmallIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function PowerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
      <line x1="12" y1="2" x2="12" y2="12" />
    </svg>
  );
}

interface NavbarProps {
  walletAddress: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  isConnecting: boolean;
}

export default function Navbar({
  walletAddress,
  onConnect,
  onDisconnect,
  isConnecting,
}: NavbarProps) {
  const [copied, setCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showDropdown) return;
    const close = () => setShowDropdown(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [showDropdown]);

  const handleCopy = useCallback(async () => {
    if (!walletAddress) return;
    await navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [walletAddress]);

  const truncate = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 animate-fade-in-down ${
        scrolled
          ? "border-white/[0.08] bg-[#050510]/90 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "border-white/[0.04] bg-transparent backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c6cf0] to-[#4fc3f7] shadow-[0_0_20px_rgba(124,108,240,0.3)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
              <path d="M15 18H9" />
              <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
              <circle cx="17" cy="18" r="2" />
              <circle cx="7" cy="18" r="2" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold tracking-tight text-white">
              SupplyTrack
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono text-white/20 border border-white/[0.06] rounded px-1.5 py-0.5">
              v1.0
            </span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Badge variant="success">
            <span className="h-1.5 w-1.5 rounded-full bg-[#34d399] animate-pulse" />
            {NETWORK}
          </Badge>

          {walletAddress ? (
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
                className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm transition-all hover:border-white/[0.15] hover:bg-white/[0.06]"
              >
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#7c6cf0] to-[#4fc3f7] p-[1.5px]">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0a0a1a] text-[8px] font-bold text-white/80">
                    {walletAddress.slice(0, 2)}
                  </div>
                </div>
                <span className="font-mono text-xs text-white/70">
                  {truncate(walletAddress)}
                </span>
                <svg
                  width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className={`text-white/30 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <div
                  className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0c0c1d]/95 backdrop-blur-2xl shadow-2xl animate-fade-in-up"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-3 border-b border-white/[0.06]">
                    <p className="text-[10px] uppercase tracking-wider text-white/25 mb-2">
                      Connected Wallet
                    </p>
                    <p className="font-mono text-xs text-white/60 break-all leading-relaxed">
                      {walletAddress}
                    </p>
                  </div>
                  <div className="p-1.5">
                    <button
                      onClick={() => { handleCopy(); setShowDropdown(false); }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/[0.06] hover:text-white/90 transition-colors"
                    >
                      {copied ? <CheckSmallIcon /> : <CopyIcon />}
                      {copied ? "Copied!" : "Copy Address"}
                    </button>
                    <button
                      onClick={() => { onDisconnect(); setShowDropdown(false); }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[#f87171]/70 hover:bg-[#f87171]/[0.08] hover:text-[#f87171] transition-colors"
                    >
                      <PowerIcon />
                      Disconnect
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onConnect}
              disabled={isConnecting}
              className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#7c6cf0] to-[#5b8cf0] p-[1px] transition-all hover:shadow-[0_0_25px_rgba(124,108,240,0.25)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-2 rounded-[11px] bg-[#0c0c1d]/90 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                {isConnecting ? (
                  <>
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <WalletIcon size={14} />
                    Connect
                  </>
                )}
              </div>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
