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
    Sparkles
} from "lucide-react";

// ---------- Left Nav (Polished) ----------
export default function LeftNav() {
    const location = useLocation();

    const { user } = useUser();

    const allLinks = [
        { label: "Overview", to: "/", icon: Home, modes: ['career', 'financial_tools'] },
        { label: "Career Mode", to: "/games", icon: Gamepad2, modes: ['career'] }, // Only for Career Mode
        { label: "Stock Market", to: "/games/stockmarket", icon: TrendingUp, modes: ['career', 'financial_tools'] },
        { label: "Dream Life", to: "/games/dreamlife", icon: Sparkles, modes: ['career', 'financial_tools'] },
        { label: "Finance Tools", to: "/tools", icon: Calculator, modes: ['career', 'financial_tools'] },
        { label: "Knowledge Hub", to: "/articles", icon: BookOpen, modes: ['career', 'financial_tools'] },
        { label: "Habit Tracker", to: "/habit", icon: Flame, modes: ['career', 'financial_tools'] },
        { label: "Transactions", to: "/transactions", icon: CreditCard, modes: ['career', 'financial_tools'] },
    ];

    const links = allLinks.filter(link => !link.modes || link.modes.includes(user?.mode || 'career'));

    return (
        <nav className="font-body h-full flex flex-col">
            <div className="mb-6 px-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Navigation</p>
            </div>
            <ul className="space-y-2 flex-1">
                {links.map((link) => {
                    const active =
                        link.to === "/"
                            ? location.pathname === "/"
                            : location.pathname.startsWith(link.to);

                    const Icon = link.icon;

                    return (
                        <li key={link.to}>
                            <Link
                                to={link.to}
                                className={`group flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${active
                                    ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                                    : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                                    }`}
                            >
                                <Icon
                                    size={18}
                                    className={`transition-colors duration-300 ${active ? "text-brand-primary" : "text-slate-500 group-hover:text-slate-300"}`}
                                />

                                <span className="relative">
                                    {link.label}
                                    {active && <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-1 bg-brand-primary rounded-full"></span>}
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>

            {/* Daily Motivation */}
            <div className="mt-8 px-2 pb-2">
                <div className="p-5 rounded-2xl bg-gradient-to-b from-brand-surface to-brand-dark border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-primary/20 transition-all"></div>

                    <h4 className="relative text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <span className="text-yellow-400">⚡</span> Pro Tip
                    </h4>
                    <p className="relative text-xs text-slate-400 leading-relaxed">
                        "Compound interest is the eighth wonder of the world."
                    </p>
                </div>
            </div>
        </nav>
    );
}
