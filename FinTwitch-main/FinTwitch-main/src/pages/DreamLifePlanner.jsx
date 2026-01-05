import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../context/UserContext";
import { ToastContext } from "../context/ToastContext";

// ---------- Dream Life Planner (Premium Redesign) ----------
export default function DreamLifePlanner() {
    const { user, transact } = useContext(UserContext);
    const { push } = useContext(ToastContext);

    const [scene, setScene] = useState(() => {
        const saved = localStorage.getItem("dreamlife_progress");
        return saved ? JSON.parse(saved).scene : 1;
    });

    const [stats, setStats] = useState(() => {
        const saved = localStorage.getItem("dreamlife_progress");
        return saved
            ? JSON.parse(saved).stats
            : { happiness: 5, consistency: 5, wisdom: 5 };
    });

    const [log, setLog] = useState([]);

    // ... (Logic unchanged) ...
    const nextScene = (next = null) => setScene((s) => next || s + 1);

    useEffect(() => {
        localStorage.setItem("dreamlife_progress", JSON.stringify({ scene, stats, log }));
    }, [scene, stats, log]);

    const handleChoice = (choice) => {
        if (choice.cost && user.balance < choice.cost) {
            push("Insufficient funds!", { style: "danger" });
            return;
        }
        if (choice.cost) transact(-choice.cost, { label: choice.label });
        if (choice.income) transact(choice.income, { label: choice.label });

        setStats((prev) => ({
            happiness: Math.max(0, prev.happiness + (choice.happiness || 0)),
            consistency: Math.max(0, prev.consistency + (choice.consistency || 0)),
            wisdom: Math.max(0, prev.wisdom + (choice.wisdom || 0)),
        }));

        setLog((l) => [...l, choice.label]);
        push(choice.feedback || "Choice recorded.");
        setTimeout(() => nextScene(choice.next), 800);
    };

    const scenes = {
        1: {
            title: "Scene 1: The Morning Dilemma 🌅",
            story: "It’s 8 AM. Your stomach growls as you rush to your first class. You check your wallet—money is tight.",
            choices: [
                { label: "Buy a good breakfast (₹50)", cost: 50, happiness: +2, feedback: "Yum! Energized for the day." },
                { label: "Skip breakfast, save money", cost: 0, happiness: -2, feedback: "You saved cash but feel sluggish." },
                { label: "Grab tea with friends (₹20)", cost: 20, happiness: +1, consistency: +1, feedback: "Socializing boosts morale! ☕" },
            ],
        },
        2: {
            title: "Scene 2: The College Event 🎤",
            story: "There’s a big tech fest on campus. Everyone’s talking about it. You can buy tickets or volunteer.",
            choices: [
                { label: "Buy tickets (₹200)", cost: 200, happiness: +2, consistency: +1, feedback: "Great experience & fun!" },
                { label: "Volunteer for free", cost: 0, consistency: +2, wisdom: +1, feedback: "Hard work but valuable networking." },
                { label: "Skip the event", cost: 0, happiness: -1, feedback: "Saved money, but missed out." },
            ],
        },
        3: {
            title: "Scene 3: The Freelance Offer 💼",
            story: "A senior offers you a quick freelance project worth ₹500. It’ll take your whole evening, though.",
            choices: [
                { label: "Accept the project", income: 500, consistency: -1, wisdom: +2, feedback: "Earned ₹500! Hustle pays off.", next: 4 },
                { label: "Reject it and study", cost: 0, wisdom: +3, feedback: "Focused on academics. Good choice.", next: 4 },
                { label: "Ignore the message", cost: 0, feedback: "Procrastination isn't great...", next: 4 },
            ],
        },
        4: {
            title: "Scene 4: Checkpoint 🧾",
            story: "Your first week ends. Review your life stats.",
            summary: true,
        },
    };

    const sceneData = scenes[scene];
    if (!sceneData) return <div className="p-10 text-center">Loading Scenario...</div>;

    return (
        <div className="max-w-2xl mx-auto h-[calc(100vh-140px)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <Link to="/games" className="text-xs text-slate-500 hover:text-white uppercase tracking-wider block">← Back to Games</Link>
                <button onClick={() => { localStorage.removeItem("dreamlife_progress"); window.location.reload(); }} className="text-xs text-brand-danger hover:underline">
                    Restart Chapter
                </button>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={scene}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="flex-1 flex flex-col"
                >
                    <div className="card-glass p-8 flex-1 relative overflow-hidden">
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                        <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-2 py-1 rounded inline-block mb-4">ROLEPLAY</span>
                        <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                            {sceneData.title}
                        </h2>
                        <p className="text-lg text-slate-300 mb-8 leading-relaxed font-body border-l-2 border-brand-accent/50 pl-4">
                            {sceneData.story}
                        </p>

                        {sceneData.summary ? (
                            <div className="bg-brand-surface p-6 rounded-xl border border-white/5">
                                <h3 className="text-lg font-bold text-white mb-4">Chapter Summary</h3>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="p-3 bg-brand-dark rounded-lg">
                                        <div className="text-xs text-slate-500 uppercase">Happiness</div>
                                        <div className="text-xl font-bold text-brand-secondary">{stats.happiness}</div>
                                    </div>
                                    <div className="p-3 bg-brand-dark rounded-lg">
                                        <div className="text-xs text-slate-500 uppercase">Consistency</div>
                                        <div className="text-xl font-bold text-brand-accent">{stats.consistency}</div>
                                    </div>
                                    <div className="p-3 bg-brand-dark rounded-lg">
                                        <div className="text-xs text-slate-500 uppercase">Wisdom</div>
                                        <div className="text-xl font-bold text-brand-primary">{stats.wisdom}</div>
                                    </div>
                                    <div className="p-3 bg-brand-dark rounded-lg">
                                        <div className="text-xs text-slate-500 uppercase">Net Balance</div>
                                        <div className="text-xl font-bold text-brand-success">₹{user.balance}</div>
                                    </div>
                                </div>
                                <button onClick={() => push("More chapters coming soon!")} className="btn-primary w-full">
                                    Continue Journey
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {sceneData.choices.map((choice, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleChoice(choice)}
                                        className="w-full text-left p-4 rounded-xl border border-white/10 bg-brand-surface/50 hover:bg-brand-primary/10 hover:border-brand-primary/50 transition-all group"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-slate-200 group-hover:text-white transition-colors">{choice.label}</span>
                                            <span className="text-slate-500 text-sm group-hover:text-brand-primary opacity-0 group-hover:opacity-100 transition-all">Select →</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Stats Footer */}
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider">Happiness</div>
                    <div className="h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-brand-secondary transition-all" style={{ width: `${Math.min(100, stats.happiness * 10)}%` }}></div>
                    </div>
                </div>
                <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider">Consistency</div>
                    <div className="h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-brand-accent transition-all" style={{ width: `${Math.min(100, stats.consistency * 10)}%` }}></div>
                    </div>
                </div>
                <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider">Wisdom</div>
                    <div className="h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-brand-primary transition-all" style={{ width: `${Math.min(100, stats.wisdom * 10)}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
