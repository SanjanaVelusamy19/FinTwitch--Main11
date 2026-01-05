import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Header from "./Header";
import LeftNav from "./LeftNav";
import StockTicker from "./StockTicker";
import SchemesPanel from "./SchemesPanel";
import { useUser } from "../context/UserContext";

// ---------- Shell (Polished Layout) ----------
export default function Shell() {
    return (
        <div className="relative min-h-screen">
            {/* Subtle Background Glows (Fixed) */}
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-brand-secondary/5 rounded-full blur-[120px] pointer-events-none translate-x-1/2 translate-y-1/2"></div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Header />
                <div className="pt-[80px]"> {/* Offset for fixed header */}
                    <StockTicker />
                </div>

                {/* Constrain max width for "uncluttered" feel */}
                <div className="pt-6 flex-1 flex w-full max-w-[1600px] mx-auto overflow-hidden px-4 md:px-6 gap-6">

                    {/* LEFT SIDEBAR - Hidden on mobile, sticky on desktop */}
                    <aside className="hidden lg:block w-[260px] shrink-0 sticky top-[100px] h-[calc(100vh-120px)]">
                        <div className="h-full">
                            <LeftNav />
                        </div>
                    </aside>

                    {/* MAIN CONTENT - Scrollable area */}
                    <main className="flex-1 w-full min-w-0 pb-10">
                        {/* Added fade-in animation keyframe in global css or here */}
                        <div className="animate-fadeIn">
                            <Outlet />
                        </div>
                    </main>

                    {/* RIGHT SIDEBAR - Schemes Panel (Full Height) */}
                    <aside className="hidden xl:block w-[300px] shrink-0 sticky top-[100px] h-[calc(100vh-120px)]">
                        <div className="h-full bg-[#08080A]/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
                            <SchemesPanel />
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
}
