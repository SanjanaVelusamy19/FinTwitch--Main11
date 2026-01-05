import React, { useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { ToastContext } from "../context/ToastContext";
import { CAREER_LEVELS } from "../data/careerLevels";

// ---------- Career Level Page (Premium Redesign) ----------
export default function CareerLevelPage() {
    const { levelId } = useParams();
    const num = Number(levelId) || 1;
    const { user, completeCareerLevel, transact } = useContext(UserContext);
    const { push } = useContext(ToastContext);
    const level = CAREER_LEVELS.find((l) => l.id === num);
    const locked = num > (user?.careerLevel || 1);

    // ... (Question Bank Unchanged) ...
    const questionBank = {
        1: [{ q: "Which is an example of a 'need'?", opts: ["Netflix", "Smartphone for classes", "New sneakers"], a: 1 }, { q: "If you earn ₹5,000 and spend ₹6,000, you are:", opts: ["Saving", "Breaking even", "Overspending"], a: 2 }],
        2: [{ q: "The 50‑30‑20 rule says 20% should go to:", opts: ["Shopping", "Savings/investments", "Rent only"], a: 1 }, { q: "Saving first and spending later is called:", opts: ["Pay yourself first", "Impulse buying", "Lifestyle creep"], a: 0 }],
        3: [{ q: "EMI mainly depends on loan amount, rate and:", opts: ["Your age", "Time period", "Phone model"], a: 1 }, { q: "Which loan is usually the costliest?", opts: ["Education loan", "Home loan", "Credit card debt"], a: 2 }],
        4: [{ q: "SIP is best described as:", opts: ["One‑time big investment", "Regular small investments", "A type of loan"], a: 1 }, { q: "Higher return potential usually means:", opts: ["Lower risk", "Same risk", "Higher risk"], a: 2 }],
        5: [{ q: "FIRE stands for:", opts: ["Financial Independence, Retire Early", "Fast Interest Rate Entry", "Fixed Income & Rental Earnings"], a: 0 }, { q: "A good long‑term plan usually includes:", opts: ["Only savings account", "Mix of assets", "Only crypto"], a: 1 }],
        6: [{ q: "Your 'human capital' mainly refers to:", opts: ["Your job title", "Your skills & earning potential", "Your bank balance"], a: 1 }, { q: "Best way to grow income over 10+ years:", opts: ["Random jobs", "Upskilling + compounding", "Only cutting expenses"], a: 1 }]
    };

    const qs = questionBank[num] || questionBank[1];
    const [index, setIndex] = useState(0);
    const [sel, setSel] = useState(null);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    if (!level) return <div>Invalid level</div>;
    if (locked) return <div className="p-10 text-center text-slate-400">Locked. Clear previous level first.</div>;

    const current = qs[index];
    const progress = ((index) / qs.length) * 100;

    const handleSubmit = () => {
        if (sel === null) { push("Choose an option!", { ttl: 1500 }); return; }
        const correct = sel === current.a;
        if (correct) {
            setScore((s) => s + 1);
            transact(30, { source: "career", label: `Level ${num} correct` });
        } else {
            transact(-10, { source: "career", label: `Level ${num} wrong` });
        }

        if (index + 1 < qs.length) {
            setSel(null);
            setIndex(index + 1);
        } else {
            const finalScore = score + (correct ? 1 : 0);
            setFinished(true);
            const passed = finalScore >= Math.ceil(qs.length * 0.7);
            if (passed) {
                completeCareerLevel(num, { score: finalScore, total: qs.length, passed: true, completedAt: new Date().toISOString() });
                push(`Level ${num} cleared! Score ${finalScore}/${qs.length}`, { style: "success" });
            } else {
                completeCareerLevel(num, { score: finalScore, total: qs.length, passed: false, completedAt: new Date().toISOString() });
                push(`Level ${num} failed. Score ${finalScore}/${qs.length}`, { style: "danger" });
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto text-slate-200">
            <Link to="/games" className="inline-block mb-6 text-sm text-slate-400 hover:text-brand-primary transition">
                ← Back to Career
            </Link>

            <div className="card-glass p-8 relative overflow-hidden">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-brand-dark">
                    <div className="h-full bg-brand-primary transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="mb-8">
                    <span className="text-xs font-bold text-brand-secondary bg-brand-secondary/10 px-2 py-1 rounded">LEVEL {num}</span>
                    <h2 className="text-3xl font-bold text-white mt-2 mb-1">{level.title}</h2>
                    <p className="text-slate-400 text-sm">{level.description}</p>
                </div>

                {!finished ? (
                    <div>
                        <div className="mb-6">
                            <span className="text-xs text-brand-muted uppercase tracking-wider mb-2 block">Question {index + 1} of {qs.length}</span>
                            <p className="text-xl font-semibold text-white leading-relaxed">{current.q}</p>
                        </div>

                        <div className="space-y-3">
                            {current.opts.map((o, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSel(idx)}
                                    className={`block w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 ${sel === idx
                                        ? "bg-brand-primary/20 border-brand-primary text-white shadow-glow"
                                        : "bg-brand-dark hover:bg-white/5 border-slate-700 text-slate-300"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${sel === idx ? "border-brand-primary bg-brand-primary" : "border-slate-500"}`}>
                                            {sel === idx && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                        </div>
                                        {o}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="mt-8 w-full btn-primary py-3 text-lg"
                        >
                            {index + 1 === qs.length ? "Finish Level" : "Next Question"}
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <div className="text-6xl mb-4">🏆</div>
                        <h3 className="text-2xl font-bold text-white mb-2">Level Complete!</h3>
                        <p className="text-slate-400 mb-6">You have finished this module. Check your results in the dashboard.</p>
                        <Link to="/games" className="btn-primary px-8 py-3 inline-block mr-4">
                            Continue Career
                        </Link>
                        <Link to="/tools" className="btn-secondary px-8 py-3 inline-block">
                            Try New Tool 🛠️
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
