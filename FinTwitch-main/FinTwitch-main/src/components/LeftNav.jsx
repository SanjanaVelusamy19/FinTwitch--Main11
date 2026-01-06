import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import {
    Home,
    Gamepad2,
    Calculator,
    BookOpen,
    Flame,
    CreditCard,
    TrendingUp,
    Sparkles,
    Rocket
} from "lucide-react";

// ---------- Left Nav (Neon Blue 3D) ----------
export default function LeftNav() {
    const location = useLocation();
    const { user } = useUser();
    const pathname = location.pathname;

    const allLinks = [
        { label: "Mission Control", to: "/", icon: Home, modes: ['career', 'financial_tools'] },
        { label: "Career Mode", to: "/games", icon: Gamepad2, modes: ['career'] },
        // [UPDATED] Removed 'career' from Stock Market modes
        { label: "Stock Market", to: "/games/stockmarket", icon: TrendingUp, modes: ['financial_tools'] },
        { label: "Dream Life", to: "/games/dreamlife", icon: Sparkles, modes: ['career', 'financial_tools'] },
        { label: "Tools Bay", to: "/tools", icon: Calculator, modes: ['career', 'financial_tools'] },
        { label: "Data Logs", to: "/articles", icon: BookOpen, modes: ['career', 'financial_tools'] },
        { label: "Habit Core", to: "/habit", icon: Flame, modes: ['career', 'financial_tools'] },
        { label: "Treasury", to: "/transactions", icon: CreditCard, modes: ['career', 'financial_tools'] },
    ];

    const links = allLinks.filter(link => !link.modes || link.modes.includes(user?.mode || 'career'));

    return (
        <nav className="h-full flex flex-col font-sans">
            {/* Scrollable Container Start */}
            <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar px-1">

                <div className="mb-6 px-4 pt-2 shrink-0">
                    <div className="flex items-center gap-2 mb-2">
                        <Rocket className="text-cyan-400 rotate-45" size={20} />
                        <p className="text-[10px] font-bold text-cyan-300 uppercase tracking-[0.2em] drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">Star Map</p>
                    </div>
                    <div className="h-0.5 bg-gradient-to-r from-cyan-500/50 to-transparent w-full rounded-full"></div>
                </div>

                <ul className="space-y-3 px-3">
                    {links.map((link) => {
                        // Strict Active Logic
                        let active = false;

                        if (link.to === "/") {
                            // Mission Control is active ONLY on exactly "/"
                            active = pathname === "/";
                        } else if (link.to === "/games") {
                            // Career Mode is active ONLY on exactly "/games" (not stockmarket/dreamlife)
                            active = pathname === "/games";
                        } else {
                            // Others match if they start with the path (e.g. /games/stockmarket)
                            active = pathname.startsWith(link.to);
                        }

                        const Icon = link.icon;

                        return (
                            <li key={link.to}>
                                <Link
                                    to={link.to}
                                    className={`group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 overflow-hidden ${active
                                        ? "text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] translate-x-2"
                                        : "text-slate-400 hover:text-cyan-100 hover:translate-x-1"
                                        }`}
                                >
                                    {/* Active Background Layer (Cyan Gradient) */}
                                    {active && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 opacity-90 border border-cyan-400/30"></div>
                                    )}

                                    {/* Hover Effect Layer */}
                                    {!active && (
                                        <div className="absolute inset-0 bg-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity border border-transparent group-hover:border-cyan-400/20 rounded-2xl"></div>
                                    )}

                                    <div className="relative z-10 flex items-center gap-4 w-full">
                                        <div className={`p-1.5 rounded-lg transition-all ${active ? "bg-white/20" : "bg-white/5 group-hover:bg-cyan-400/10"}`}>
                                            <Icon
                                                size={18}
                                                className={`transition-colors duration-300 ${active ? "text-white" : "text-slate-400 group-hover:text-cyan-300"}`}
                                            />
                                        </div>

                                        <span className="tracking-wide">
                                            {link.label}
                                        </span>

                                        {active && <Sparkles size={14} className="ml-auto text-yellow-300 animate-pulse" />}
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Daily Motivation - 3D Bubble (Cyan Theme) */}
                <div className="mt-8 px-4 pb-6 shrink-0">
                    <div className="p-1 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 transform hover:scale-[1.02] transition-transform duration-300 cursor-pointer group">
                        <div className="bg-[#020617] rounded-[22px] p-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-400/30 transition-all"></div>

                            <h4 className="relative text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-blue-200 mb-2 uppercase tracking-wider">
                                Neon Wisdom
                            </h4>
                            <p className="relative text-xs text-slate-300 font-medium leading-relaxed italic">
                                "The best investment you can make is in yourself."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Scrollable Container End */}
        </nav>
    );
}
