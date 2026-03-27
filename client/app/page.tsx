"use client";

import { useState, useEffect, useCallback } from "react";
import { Meteors } from "@/components/ui/meteors";
import Navbar from "@/components/Navbar";
import ContractUI from "@/components/Contract";
import {
  connectWallet,
  getWalletAddress,
  checkConnection,
} from "@/hooks/contract";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if (await checkConnection()) {
          const addr = await getWalletAddress();
          if (addr) setWalletAddress(addr);
        }
      } catch {
        /* Freighter not installed */
      }
    })();
  }, []);

  const handleConnect = useCallback(async () => {
    setIsConnecting(true);
    try {
      setWalletAddress(await connectWallet());
    } catch {
      // handled in Contract component
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const handleDisconnect = useCallback(() => {
    setWalletAddress(null);
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen bg-[#050510] overflow-hidden">
      {/* Meteors */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <Meteors number={12} />
      </div>

      {/* Ambient orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-[#7c6cf0]/20 blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-[#4fc3f7]/15 blur-[120px] animate-float-delayed" />
      </div>

      {/* Navbar */}
      <Navbar
        walletAddress={walletAddress}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        isConnecting={isConnecting}
      />

      {/* Hero + Content */}
      <main className="relative z-10 flex flex-1 w-full max-w-5xl mx-auto flex-col items-center px-6 pt-10 pb-16">
        {/* Hero — compact */}
        <div className="mb-10 text-center animate-fade-in-up">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-sm text-white/50 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7c6cf0] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#7c6cf0]" />
            </span>
            Powered by Soroban on Stellar
          </div>

          <h1 className="mb-3">
            <span className="block text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1]">
              <span className="text-white">Supply Chain </span>
              <span className="bg-gradient-to-r from-[#7c6cf0] via-[#4fc3f7] to-[#7c6cf0] bg-[length:200%_auto] animate-gradient-shift bg-clip-text text-transparent">
                on the Blockchain
              </span>
            </span>
          </h1>

          <p className="mx-auto max-w-lg text-sm sm:text-base leading-relaxed text-white/40">
            Register products, track shipments, and verify authenticity — immutably on Stellar.
          </p>

          {/* Inline stats */}
          <div className="mt-6 flex items-center justify-center gap-6 sm:gap-10 animate-fade-in-up-delayed">
            {[
              { label: "Finality", value: "~5s" },
              { label: "Cost", value: "<$0.01" },
              { label: "Network", value: "Testnet" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-lg sm:text-xl font-bold text-white/90 font-mono">{stat.value}</p>
                <p className="text-[10px] text-white/30 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contract UI */}
        <ContractUI
          walletAddress={walletAddress}
          onConnect={handleConnect}
          isConnecting={isConnecting}
        />

        {/* Footer */}
        <div className="mt-10 flex flex-col items-center gap-4 animate-fade-in">
          {/* Supply chain flow */}
          <div className="flex items-center gap-3 text-xs text-white/20">
            {["Created", "Shipped", "Delivered"].map((step, i) => (
              <span key={step} className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      i === 0
                        ? "bg-[#fbbf24]/50"
                        : i === 1
                          ? "bg-[#4fc3f7]/50"
                          : "bg-[#34d399]/50"
                    }`}
                  />
                  <span className="font-mono">{step}</span>
                </span>
                {i < 2 && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/10">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 text-[10px] text-white/15">
            <span>Stellar Network</span>
            <span className="h-2.5 w-px bg-white/10" />
            <span>Freighter Wallet</span>
            <span className="h-2.5 w-px bg-white/10" />
            <span>Soroban Smart Contracts</span>
          </div>
        </div>
      </main>
    </div>
  );
}
