import React, { useState, useRef, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { ToastContext } from "../context/ToastContext";
import { fetchPolicyNews } from "../services/PolicyService";
import { Newspaper, Bell, ExternalLink, ScrollText } from "lucide-react";

// ---------- Articles (Premium Redesign) ----------
function ArticleQuiz({ quiz, onComplete }) {
    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState(null);
    const [finished, setFinished] = useState(false);

    const handleSubmit = () => {
        if (selected === null) return;
        if (selected === quiz[index].a) setScore((s) => s + 1);

        if (index + 1 < quiz.length) {
            setSelected(null);
            setIndex(index + 1);
        } else {
            const finalScore = score + (selected === quiz[index].a ? 1 : 0);
            setFinished(true);
            onComplete(finalScore);
        }
    };

    if (finished) return null;
    const q = quiz[index];

    return (
        <div className="mt-6 border-t border-white/5 pt-4">
            <div className="bg-[#0A0A0A] p-4 rounded-xl border border-blue-500/20">
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-2 block">Knowledge Check</span>
                <p className="font-semibold text-white mb-4 text-sm">{q.q}</p>
                <div className="space-y-2">
                    {q.opts.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => setSelected(i)}
                            className={`block w-full text-left px-4 py-2.5 rounded-lg border text-xs transition-all duration-200 ${selected === i
                                ? "bg-blue-500/20 border-blue-500 text-white"
                                : "bg-black/40 border-white/5 text-slate-400 hover:bg-white/5"
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
                <button onClick={handleSubmit} className="btn-primary mt-4 w-full py-2 text-xs">
                    Submit Answer
                </button>
            </div>
        </div>
    );
}

export default function ArticlesArea() {
    const articles = [
        {
            id: "a1",
            title: "The Power of Compounding 💫",
            excerpt: "Learn how small investments grow big over time.",
            content: `Compounding is like a growing snowball. When your returns start earning more returns, your money can grow much faster over long periods.\nStarting early and staying consistent give compounding maximum time to work for you.`,
            quiz: [{ q: "What does compounding mean?", opts: ["Interest on interest", "Spending money", "No growth"], a: 0 }, { q: "Which grows faster over long term?", opts: ["Simple interest", "Compound interest"], a: 1 }, { q: "Key to compounding?", opts: ["Patience", "Luck"], a: 0 }],
            reward: 50,
        },
        {
            id: "a2",
            title: "Smart Budgeting 💰",
            excerpt: "Control your expenses to control your life.",
            content: `Budgeting gives your money a clear plan. By tracking income and spending, you make conscious choices instead of guessing where money went.\nRules like 50-30-20 can help you balance needs, wants and savings.`,
            quiz: [{ q: "What is the 50-30-20 rule?", opts: ["Budgeting rule", "Tax rule"], a: 0 }, { q: "Budgeting is mainly about:", opts: ["Restriction", "Direction"], a: 1 }, { q: "How much goes to savings in 50-30-20?", opts: ["10%", "20%"], a: 1 }],
            reward: 40,
        },
        {
            id: "a3",
            title: "Emergency Fund Essentials 🚨",
            excerpt: "Prepare for the unexpected with a solid safety net.",
            content: `Emergencies like medical bills or job loss can arrive suddenly. An emergency fund protects you from financial shocks.\nKeeping 3–6 months of expenses in a liquid place is a strong safety net.`,
            quiz: [{ q: "Ideal emergency fund size?", opts: ["1–2 months", "3–6 months"], a: 1 }, { q: "Emergency fund should be:", opts: ["Locked away", "Easily accessible"], a: 1 }, { q: "Main purpose?", opts: ["Shopping", "Handling shocks"], a: 1 }],
            reward: 60,
        },
    ];

    const { markArticleRead } = useContext(UserContext);
    const { push } = useContext(ToastContext);

    const [policyNews, setPolicyNews] = useState([]);
    const [loadingNews, setLoadingNews] = useState(true);
    const [open, setOpen] = useState(null);
    const [showQuiz, setShowQuiz] = useState(false);

    const [readHistory, setReadHistory] = useState(() => {
        const saved = localStorage.getItem("fintwitch_read_history");
        return saved ? JSON.parse(saved) : [];
    });

    const contentRef = useRef(null);

    // Fetch Policy News
    useEffect(() => {
        async function loadNews() {
            setLoadingNews(true);
            const news = await fetchPolicyNews(10);
            setPolicyNews(news);
            setLoadingNews(false);
        }
        loadNews();
    }, []);

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollTop + clientHeight >= scrollHeight - 30) setShowQuiz(true);
    };

    const handleQuizComplete = (score, article) => {
        if (score >= 2) {
            markArticleRead(article.id, article.reward);
            const newRecord = { id: article.id, title: article.title, date: new Date().toLocaleString(), reward: article.reward };
            const updated = [...readHistory.filter(h => h.id !== article.id), newRecord];
            setReadHistory(updated);
            localStorage.setItem("fintwitch_read_history", JSON.stringify(updated));
            push(`🎉 You earned ₹${article.reward}! Score: ${score}/${article.quiz.length}`, { style: "success" });
        } else {
            push(`You scored ${score}/${article.quiz.length}. Try again next time!`, { style: "danger" });
        }
        setShowQuiz(false);
    };

    return (
        <div className="max-w-[1440px] mx-auto space-y-8 font-body">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-4">
                <div>
                    <h2 className="text-4xl font-black text-white font-heading tracking-tight">
                        Knowledge Hub
                    </h2>
                    <p className="text-slate-400 mt-1">Acquire financial wisdom and stay ahead of the curve.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left: Main Articles (8 Columns) */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <ScrollText size={20} className="text-blue-500" />
                        <h3 className="text-xl font-bold text-white uppercase tracking-wider text-sm">Deep Dive Articles</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {articles.map((a) => (
                            <div
                                key={a.id}
                                className={`card-glass p-6 flex flex-col justify-between group transition-all duration-300 ${open === a.id ? "ring-2 ring-blue-500/50 bg-blue-500/5" : ""}`}
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded uppercase tracking-widest">
                                            +₹{a.reward} Reward
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors">
                                        {a.title}
                                    </h3>
                                    <p className="text-xs text-slate-400 leading-relaxed mb-6">
                                        {a.excerpt}
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        setOpen(a.id === open ? null : a.id);
                                        setShowQuiz(false);
                                    }}
                                    className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${open === a.id
                                        ? "bg-black/40 text-slate-400 border border-white/10"
                                        : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20"
                                        }`}
                                >
                                    {open === a.id ? "Close" : "Read & Earn"}
                                </button>

                                {open === a.id && (
                                    <div className="mt-6 pt-6 border-t border-white/5 animate-fadeIn">
                                        <div
                                            ref={contentRef}
                                            onScroll={handleScroll}
                                            className="p-4 bg-black/40 rounded-xl border border-white/5 text-slate-300 h-64 overflow-y-auto text-xs leading-relaxed space-y-4 custom-scrollbar"
                                        >
                                            {a.content.split("\n").map((line, i) => <p key={i}>{line}</p>)}

                                            {!showQuiz && (
                                                <div className="text-center pt-8 text-[10px] text-blue-400 font-bold animate-pulse uppercase tracking-widest">
                                                    Scroll to bottom to start quiz ↓
                                                </div>
                                            )}

                                            {showQuiz && (
                                                <ArticleQuiz
                                                    quiz={a.quiz}
                                                    onComplete={(score) => handleQuizComplete(score, a)}
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* History */}
                    {readHistory.length > 0 && (
                        <div className="mt-12">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Reading History 🏅</h3>
                            <div className="bg-[#0A0A0A] rounded-2xl border border-white/5 overflow-hidden">
                                {readHistory.slice().reverse().map((h, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition">
                                        <div>
                                            <p className="font-bold text-slate-200 text-sm">{h.title}</p>
                                            <p className="text-[10px] text-slate-500">{h.date}</p>
                                        </div>
                                        <span className="text-emerald-400 font-mono font-bold text-sm">+₹{h.reward}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Schemes & Policies (4 Columns) */}
                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <Newspaper size={20} className="text-emerald-500" />
                            <h3 className="text-xl font-bold text-white uppercase tracking-wider text-sm">Schemes & Policies</h3>
                        </div>
                        <span className="animate-pulse flex items-center gap-1.5 text-[9px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20 uppercase tracking-tighter">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> LIVE
                        </span>
                    </div>

                    <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                        {loadingNews ? (
                            Array(5).fill(0).map((_, i) => (
                                <div key={i} className="card-glass p-4 animate-pulse">
                                    <div className="h-3 w-1/4 bg-white/10 rounded mb-3"></div>
                                    <div className="h-4 w-full bg-white/10 rounded mb-2"></div>
                                    <div className="h-3 w-2/3 bg-white/10 rounded"></div>
                                </div>
                            ))
                        ) : (
                            policyNews.map((news) => (
                                <div key={news.id} className="card-glass p-4 hover:border-emerald-500/30 transition-all group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{news.source}</span>
                                        <span className="text-[10px] text-slate-500">{news.timestamp.split(',')[0]}</span>
                                    </div>
                                    <h4 className="text-sm font-bold text-white mb-2 line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors">
                                        {news.title}
                                    </h4>
                                    <p className="text-[11px] text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                                        {news.summary}
                                    </p>
                                    <a
                                        href={news.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-[10px] font-bold text-slate-200 hover:text-emerald-400 transition-colors uppercase tracking-widest"
                                    >
                                        Read Full Report <ExternalLink size={12} />
                                    </a>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl">
                        <div className="flex items-center gap-2 mb-2 text-emerald-400">
                            <Bell size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Policy Alerts</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                            Government fiscal policies can impact your career trajectory and market returns. Stay informed to maximize your earnings.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
