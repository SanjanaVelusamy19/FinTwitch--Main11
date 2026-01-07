import React, { useState } from 'react';

// --- Level 1: Budget Balancer (Slider Interaction) ---
export const BudgetBalancer = ({ onComplete }) => {
    const [needs, setNeeds] = useState(40);
    const [wants, setWants] = useState(40);
    const [savings, setSavings] = useState(20);
    const [message, setMessage] = useState("");

    const checkBalance = () => {
        if (needs === 50 && wants === 30 && savings === 20) {
            setMessage("Perfect! You've mastered the 50/30/20 rule.");
            onComplete(true);
        } else {
            setMessage("Not quit the Golden Ratio. Aim for 50% Needs, 30% Wants, 20% Savings.");
        }
    };

    return (
        <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Adjust allocations to hit the Golden Ratio</h3>

            <div className="space-y-6 mb-6">
                <div>
                    <label className="flex justify-between text-slate-300 text-sm mb-2">
                        <span>Needs (Rent, Food)</span>
                        <span className="font-bold">{needs}%</span>
                    </label>
                    <input type="range" min="0" max="100" value={needs} onChange={(e) => setNeeds(Number(e.target.value))} className="w-full accent-blue-500" />
                </div>
                <div>
                    <label className="flex justify-between text-slate-300 text-sm mb-2">
                        <span>Wants (Fun, Travel)</span>
                        <span className="font-bold">{wants}%</span>
                    </label>
                    <input type="range" min="0" max="100" value={wants} onChange={(e) => setWants(Number(e.target.value))} className="w-full accent-purple-500" />
                </div>
                <div>
                    <label className="flex justify-between text-slate-300 text-sm mb-2">
                        <span>Savings (Future You)</span>
                        <span className="font-bold">{savings}%</span>
                    </label>
                    <input type="range" min="0" max="100" value={savings} onChange={(e) => setSavings(Number(e.target.value))} className="w-full accent-emerald-500" />
                </div>
            </div>

            <div className="text-center">
                <p className={`text-sm mb-4 ${message.includes("Perfect") ? "text-emerald-400" : "text-yellow-400"}`}>{message}</p>
                <button onClick={checkBalance} className="btn-primary py-2 px-6">Check Balance</button>
            </div>
        </div>
    );
};

// --- Level 2: Emergency Builder (Clicker Game) ---
export const EmergencyBuilder = ({ onComplete }) => {
    const [fund, setFund] = useState(0);
    const target = 10000;

    const addFunds = () => {
        const newFund = fund + 1000;
        setFund(newFund);
        if (newFund >= target) {
            onComplete(true);
        }
    };

    return (
        <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Build Your Safety Net</h3>
            <p className="text-slate-400 text-sm mb-6">Tap to save ₹1,000 before an emergency strikes!</p>

            <div className="w-32 h-40 border-4 border-slate-600 rounded-lg mx-auto relative overflow-hidden bg-slate-900 mb-6">
                {/* Liquidfill */}
                <div
                    className="bg-emerald-500 absolute bottom-0 left-0 w-full transition-all duration-300 flex items-center justify-center font-bold text-white"
                    style={{ height: `${(fund / target) * 100}%` }}
                >
                </div>
            </div>

            <p className="font-mono text-emerald-400 text-xl font-bold mb-4">₹{fund.toLocaleString()} / ₹{target.toLocaleString()}</p>

            {fund < target ? (
                <button onClick={addFunds} className="btn-secondary active:scale-95 transition-transform py-3 px-8 rounded-full shadow-lg shadow-emerald-500/20">
                    💰 Save Now!
                </button>
            ) : (
                <div className="text-emerald-400 font-bold animate-bounce">Safe & Secure!</div>
            )}
        </div>
    );
};

// --- Level 4: Inflation Visualizer (Interactive Graph/Slider) ---
export const InflationVisualizer = ({ onComplete }) => {
    const [year, setYear] = useState(0);
    const startPrice = 100;
    const inflationRate = 0.06;
    const currentPrice = (startPrice * Math.pow(1 + inflationRate, year)).toFixed(0);

    return (
        <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 text-center">
            <h3 className="text-xl font-bold text-white mb-2">The Burger Index</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">See how the price of a simple burger increases over 20 years with 6% inflation.</p>

            <div className="text-6xl mb-4">🍔</div>

            <div className="text-4xl font-bold text-red-400 mb-2">₹{currentPrice}</div>
            <p className="text-slate-500 text-sm mb-8">Cost in Year {2024 + year}</p>

            <input
                type="range"
                min="0"
                max="30"
                value={year}
                onChange={(e) => {
                    setYear(Number(e.target.value));
                    if (Number(e.target.value) > 25) onComplete(true);
                }}
                className="w-full max-w-md accent-red-500"
            />
            <div className="flex justify-between text-xs text-slate-500 max-w-md mx-auto mt-2">
                <span>Today</span>
                <span>+30 Years</span>
            </div>
        </div>
    );
};

// --- Simple Factory for Activities ---
export default function ModuleActivity({ type, onComplete }) {
    switch (type) {
        case 'budget_balancer':
            return <BudgetBalancer onComplete={onComplete} />;
        case 'emergency_builder':
            return <EmergencyBuilder onComplete={onComplete} />;
        case 'inflation_visualizer':
            return <InflationVisualizer onComplete={onComplete} />;
        case 'debt_destroyer': // Reusing simple completion for now
        case 'compounding_curve':
        case 'freedom_calculator':
            return (
                <div className="text-center p-8 bg-slate-800/50 rounded-xl border border-slate-700">
                    <h3 className="text-white text-lg font-bold mb-4">Activity: {type.replace('_', ' ').toUpperCase()}</h3>
                    <p className="text-slate-400 mb-6">Interaction coming soon. For now, acknowledge the concept.</p>
                    <button onClick={() => onComplete(true)} className="btn-primary py-2 px-6">
                        Complete Activity
                    </button>
                </div>
            )
        default:
            return <div>Unknown Activity</div>;
    }
}
