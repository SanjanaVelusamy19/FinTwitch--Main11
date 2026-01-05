import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

// ---------- Transactions (Premium Redesign) ----------
export default function TransactionsArea() {
    const { user } = useContext(UserContext);

    return (
        <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-4">
                Transaction History 💳
            </h3>

            {(!user.transactions || user.transactions.length === 0) && (
                <div className="text-center py-20 text-slate-500 bg-brand-surface/30 rounded-2xl border border-dashed border-slate-700">
                    No transactions yet. <br />Start playing games to build your history!
                </div>
            )}

            <div className="space-y-3">
                {user.transactions
                    ?.slice()
                    .reverse()
                    .map((tx) => (
                        <div
                            key={tx.id}
                            className="card-glass flex justify-between items-center p-4 rounded-xl hover:bg-white/5 transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${tx.amount >= 0 ? "bg-brand-success/10 text-brand-success" : "bg-brand-danger/10 text-brand-danger"
                                    }`}>
                                    {tx.amount >= 0 ? "↓" : "↑"}
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-200 group-hover:text-white transition-colors">
                                        {tx.label || tx.source}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        {new Date(tx.ts).toLocaleString()} • {tx.source || "System"}
                                    </div>
                                </div>
                            </div>

                            <div
                                className={`text-lg font-bold font-mono ${tx.amount >= 0
                                        ? "text-brand-success"
                                        : "text-slate-300"
                                    }`}
                            >
                                {tx.amount >= 0 ? "+" : ""}
                                ₹{Math.abs(tx.amount).toFixed(2)}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
