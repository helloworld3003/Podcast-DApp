"use client";

import { useState, useCallback } from "react";
import {
  addProduct,
  updateProductStatus,
  getProduct,
  CONTRACT_ADDRESS,
} from "@/hooks/contract";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Spotlight } from "@/components/ui/spotlight";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ── Icons ────────────────────────────────────────────────────

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.5 9.4 7.55 4.24" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" y1="22" x2="12" y2="12" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

// ── Styled Input ─────────────────────────────────────────────

function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-medium uppercase tracking-wider text-white/30">
        {label}
      </label>
      <div className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-px transition-all focus-within:border-[#7c6cf0]/30 focus-within:shadow-[0_0_20px_rgba(124,108,240,0.08)]">
        <input
          {...props}
          className="w-full rounded-[11px] bg-transparent px-4 py-3 font-mono text-sm text-white/90 placeholder:text-white/15 outline-none"
        />
      </div>
    </div>
  );
}

// ── Method Signature ─────────────────────────────────────────

function MethodSignature({
  name,
  params,
  returns,
  color,
}: {
  name: string;
  params: string;
  returns?: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3 font-mono text-sm">
      <span style={{ color }} className="font-semibold">fn</span>
      <span className="text-white/70">{name}</span>
      <span className="text-white/20 text-xs">{params}</span>
      {returns && (
        <span className="ml-auto text-white/15 text-[10px]">{returns}</span>
      )}
    </div>
  );
}

// ── Status Config ────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string; dot: string; variant: "success" | "warning" | "info" }> = {
  Created: { color: "text-[#fbbf24]", bg: "bg-[#fbbf24]/10", border: "border-[#fbbf24]/20", dot: "bg-[#fbbf24]", variant: "warning" },
  Shipped: { color: "text-[#4fc3f7]", bg: "bg-[#4fc3f7]/10", border: "border-[#4fc3f7]/20", dot: "bg-[#4fc3f7]", variant: "info" },
  Delivered: { color: "text-[#34d399]", bg: "bg-[#34d399]/10", border: "border-[#34d399]/20", dot: "bg-[#34d399]", variant: "success" },
};

// ── Main Component ───────────────────────────────────────────

type Tab = "track" | "add" | "update";

interface ContractUIProps {
  walletAddress: string | null;
  onConnect: () => void;
  isConnecting: boolean;
}

export default function ContractUI({ walletAddress, onConnect, isConnecting }: ContractUIProps) {
  const [activeTab, setActiveTab] = useState<Tab>("track");
  const [error, setError] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  const [addId, setAddId] = useState("");
  const [addOrigin, setAddOrigin] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const [updateId, setUpdateId] = useState("");
  const [updateStatusVal, setUpdateStatusVal] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const [trackId, setTrackId] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [productData, setProductData] = useState<Record<string, string> | null>(null);

  const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const handleAddProduct = useCallback(async () => {
    if (!walletAddress) return setError("Connect wallet first");
    if (!addId.trim() || !addOrigin.trim()) return setError("Fill in all fields");
    setError(null);
    setIsAdding(true);
    setTxStatus("Awaiting signature...");
    try {
      await addProduct(walletAddress, addId.trim(), addOrigin.trim());
      setTxStatus("Product registered on-chain!");
      setAddId("");
      setAddOrigin("");
      setTimeout(() => setTxStatus(null), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Transaction failed");
      setTxStatus(null);
    } finally {
      setIsAdding(false);
    }
  }, [walletAddress, addId, addOrigin]);

  const handleUpdateStatus = useCallback(async () => {
    if (!walletAddress) return setError("Connect wallet first");
    if (!updateId.trim() || !updateStatusVal.trim()) return setError("Fill in all fields");
    setError(null);
    setIsUpdating(true);
    setTxStatus("Awaiting signature...");
    try {
      await updateProductStatus(walletAddress, updateId.trim(), updateStatusVal.trim());
      setTxStatus("Status updated on-chain!");
      setUpdateId("");
      setUpdateStatusVal("");
      setTimeout(() => setTxStatus(null), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Transaction failed");
      setTxStatus(null);
    } finally {
      setIsUpdating(false);
    }
  }, [walletAddress, updateId, updateStatusVal]);

  const handleTrackProduct = useCallback(async () => {
    if (!trackId.trim()) return setError("Enter a product ID");
    setError(null);
    setIsTracking(true);
    setProductData(null);
    try {
      const result = await getProduct(trackId.trim(), walletAddress || undefined);
      if (result && typeof result === "object") {
        const mapped: Record<string, string> = {};
        for (const [k, v] of Object.entries(result)) {
          mapped[String(k)] = String(v);
        }
        setProductData(mapped);
      } else {
        setError("Product not found");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Query failed");
    } finally {
      setIsTracking(false);
    }
  }, [trackId, walletAddress]);

  const tabs: { key: Tab; label: string; icon: React.ReactNode; color: string }[] = [
    { key: "track", label: "Track", icon: <SearchIcon />, color: "#4fc3f7" },
    { key: "add", label: "Register", icon: <PackageIcon />, color: "#7c6cf0" },
    { key: "update", label: "Update", icon: <RefreshIcon />, color: "#fbbf24" },
  ];

  return (
    <div className="w-full max-w-2xl animate-fade-in-up-delayed">
      {/* Toasts */}
      {error && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-[#f87171]/15 bg-[#f87171]/[0.05] px-4 py-3 backdrop-blur-sm animate-slide-down">
          <span className="mt-0.5 text-[#f87171]"><AlertIcon /></span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#f87171]/90">Error</p>
            <p className="text-xs text-[#f87171]/50 mt-0.5 break-all">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="shrink-0 text-[#f87171]/30 hover:text-[#f87171]/70 text-lg leading-none">&times;</button>
        </div>
      )}

      {txStatus && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#34d399]/15 bg-[#34d399]/[0.05] px-4 py-3 backdrop-blur-sm shadow-[0_0_30px_rgba(52,211,153,0.05)] animate-slide-down">
          <span className="text-[#34d399]">
            {txStatus.includes("on-chain") || txStatus.includes("updated") ? <CheckIcon /> : <SpinnerIcon />}
          </span>
          <span className="text-sm text-[#34d399]/90">{txStatus}</span>
        </div>
      )}

      {/* Main Card */}
      <Spotlight className="rounded-2xl">
        <AnimatedCard className="p-0" containerClassName="rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c6cf0]/20 to-[#4fc3f7]/20 border border-white/[0.06]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#7c6cf0]">
                  <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                  <path d="M15 18H9" />
                  <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                  <circle cx="17" cy="18" r="2" />
                  <circle cx="7" cy="18" r="2" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white/90">Supply Chain Tracker</h3>
                <p className="text-[10px] text-white/25 font-mono mt-0.5">{truncate(CONTRACT_ADDRESS)}</p>
              </div>
            </div>
            <Badge variant="info" className="text-[10px]">Soroban</Badge>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/[0.06] px-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => { setActiveTab(t.key); setError(null); setProductData(null); }}
                className={cn(
                  "relative flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all",
                  activeTab === t.key ? "text-white/90" : "text-white/35 hover:text-white/55"
                )}
              >
                <span style={activeTab === t.key ? { color: t.color } : undefined}>{t.icon}</span>
                {t.label}
                {activeTab === t.key && (
                  <span
                    className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full transition-all"
                    style={{ background: `linear-gradient(to right, ${t.color}, ${t.color}66)` }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Track */}
            {activeTab === "track" && (
              <div className="space-y-5">
                <MethodSignature name="get_product" params="(product_id: String)" returns="-> Map<Symbol, String>" color="#4fc3f7" />
                <Input label="Product ID" value={trackId} onChange={(e) => setTrackId(e.target.value)} placeholder="e.g. PROD-001" />
                <ShimmerButton onClick={handleTrackProduct} disabled={isTracking} shimmerColor="#4fc3f7" className="w-full">
                  {isTracking ? <><SpinnerIcon /> Querying...</> : <><SearchIcon /> Track Product</>}
                </ShimmerButton>

                {productData && (
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden animate-fade-in-up">
                    <div className="border-b border-white/[0.06] px-4 py-3 flex items-center justify-between">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-white/25">Product Details</span>
                      {(() => {
                        const status = productData.status || "Unknown";
                        const cfg = STATUS_CONFIG[status];
                        return cfg ? (
                          <Badge variant={cfg.variant}>
                            <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
                            {status}
                          </Badge>
                        ) : (
                          <Badge>{status}</Badge>
                        );
                      })()}
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/35">Product ID</span>
                        <span className="font-mono text-sm text-white/80">{trackId}</span>
                      </div>
                      {Object.entries(productData).map(([key, val]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-xs text-white/35 capitalize">{key}</span>
                          <span className="font-mono text-sm text-white/80">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Add */}
            {activeTab === "add" && (
              <div className="space-y-5">
                <MethodSignature name="add_product" params="(product_id: String, origin: String)" color="#7c6cf0" />
                <Input label="Product ID" value={addId} onChange={(e) => setAddId(e.target.value)} placeholder="e.g. PROD-001" />
                <Input label="Origin" value={addOrigin} onChange={(e) => setAddOrigin(e.target.value)} placeholder="e.g. Factory A, Shanghai" />
                {walletAddress ? (
                  <ShimmerButton onClick={handleAddProduct} disabled={isAdding} shimmerColor="#7c6cf0" className="w-full">
                    {isAdding ? <><SpinnerIcon /> Registering...</> : <><PackageIcon /> Register Product</>}
                  </ShimmerButton>
                ) : (
                  <button
                    onClick={onConnect}
                    disabled={isConnecting}
                    className="w-full rounded-xl border border-dashed border-[#7c6cf0]/20 bg-[#7c6cf0]/[0.03] py-4 text-sm text-[#7c6cf0]/60 hover:border-[#7c6cf0]/30 hover:text-[#7c6cf0]/80 active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    Connect wallet to register products
                  </button>
                )}
              </div>
            )}

            {/* Update */}
            {activeTab === "update" && (
              <div className="space-y-5">
                <MethodSignature name="update_status" params="(product_id: String, new_status: String)" color="#fbbf24" />
                <Input label="Product ID" value={updateId} onChange={(e) => setUpdateId(e.target.value)} placeholder="e.g. PROD-001" />

                <div className="space-y-2">
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-white/30">New Status</label>
                  <div className="flex gap-2">
                    {(["Shipped", "Delivered"] as const).map((s) => {
                      const cfg = STATUS_CONFIG[s];
                      const active = updateStatusVal === s;
                      return (
                        <button
                          key={s}
                          onClick={() => setUpdateStatusVal(s)}
                          className={cn(
                            "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all active:scale-95",
                            active
                              ? `${cfg.border} ${cfg.bg} ${cfg.color}`
                              : "border-white/[0.06] bg-white/[0.02] text-white/35 hover:text-white/55 hover:border-white/[0.1]"
                          )}
                        >
                          <span className={cn("h-1.5 w-1.5 rounded-full transition-colors", active ? cfg.dot : "bg-white/20")} />
                          {s}
                        </button>
                      );
                    })}
                  </div>
                  <div className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-px transition-all focus-within:border-[#fbbf24]/30 focus-within:shadow-[0_0_20px_rgba(251,191,36,0.08)]">
                    <input
                      value={updateStatusVal}
                      onChange={(e) => setUpdateStatusVal(e.target.value)}
                      placeholder="Or type a custom status..."
                      className="w-full rounded-[11px] bg-transparent px-4 py-3 font-mono text-sm text-white/90 placeholder:text-white/15 outline-none"
                    />
                  </div>
                </div>

                {walletAddress ? (
                  <ShimmerButton onClick={handleUpdateStatus} disabled={isUpdating} shimmerColor="#fbbf24" className="w-full">
                    {isUpdating ? <><SpinnerIcon /> Updating...</> : <><RefreshIcon /> Update Status</>}
                  </ShimmerButton>
                ) : (
                  <button
                    onClick={onConnect}
                    disabled={isConnecting}
                    className="w-full rounded-xl border border-dashed border-[#fbbf24]/20 bg-[#fbbf24]/[0.03] py-4 text-sm text-[#fbbf24]/60 hover:border-[#fbbf24]/30 hover:text-[#fbbf24]/80 active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    Connect wallet to update status
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/[0.04] px-6 py-3 flex items-center justify-between">
            <p className="text-[10px] text-white/15">Supply Chain Tracker &middot; Soroban</p>
            <div className="flex items-center gap-2">
              {["Created", "Shipped", "Delivered"].map((s, i) => (
                <span key={s} className="flex items-center gap-1.5">
                  <span className={cn("h-1 w-1 rounded-full", STATUS_CONFIG[s]?.dot ?? "bg-white/20")} />
                  <span className="font-mono text-[9px] text-white/15">{s}</span>
                  {i < 2 && <span className="text-white/10 text-[8px]">&rarr;</span>}
                </span>
              ))}
            </div>
          </div>
        </AnimatedCard>
      </Spotlight>
    </div>
  );
}
