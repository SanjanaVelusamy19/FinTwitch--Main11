import React, { useState } from 'react';
import { ChevronRight, CheckCircle, AlertTriangle, Play, Award } from 'lucide-react';
import ModuleActivity from './ModuleActivities';

// Simple Markdown Replacer if library not available (optimization)
const MD = ({ content }) => {
    // Very basic markdown parsing for headers and bold
    const lines = content.split('\n').map((line, i) => {
        if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold text-brand-primary mb-4">{line.replace('# ', '')}</h1>;
        if (line.startsWith('**') && line.endsWith('**')) {
            const text = line.replace(/\*\*/g, '');
            return <p key={i} className="mb-2 text-slate-300 leading-relaxed"><strong className="text-emerald-400">{text}</strong></p>;
        }
        // Handle bolding within a sentence (simple regex replacement replacement not React-safe without parsing, so we stick to simple)
        // For now, just return the line
        return <p key={i} className="mb-2 text-slate-300 leading-relaxed">{line}</p>;
    });
    return <div className="space-y-4">{lines}</div>;
};

export default function StoryModulePlayer({ module, onComplete }) {
    const [currentStageIndex, setCurrentStageIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    // Stage State
    const [feedback, setFeedback] = useState(null); // For quizzes/decisions
    const [selectedOption, setSelectedOption] = useState(null);
    const [activityCompleted, setActivityCompleted] = useState(false);

    // Safety check
    if (!module || !module.stages) return <div className="text-white">Loading Module...</div>;

    const currentStage = module.stages[currentStageIndex];
    const progress = ((currentStageIndex + 1) / module.stages.length) * 100;

    const handleNext = () => {
        setFeedback(null);
        setSelectedOption(null);
        setActivityCompleted(false);

        if (currentStageIndex + 1 < module.stages.length) {
            setCurrentStageIndex(currentStageIndex + 1);
        } else {
            setFinished(true);
        }
    };

    // --- SUB-VIEWS ---

    const StoryView = ({ data }) => (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-700/50 shadow-xl">
                <div className="prose prose-invert max-w-none">
                    <MD content={data.content} />
                </div>
                <button onClick={handleNext} className="mt-8 btn-primary flex items-center gap-2 px-8 py-3">
                    Continue <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );

    const QuizView = ({ data }) => {
        const handleAnswer = (idx) => {
            setSelectedOption(idx);
            const isCorrect = idx === data.answer;
            if (isCorrect) {
                setFeedback({ type: 'success', text: data.feedback });
                setScore(s => s + 10);
            } else {
                setFeedback({ type: 'error', text: data.feedback });
            }
        };

        return (
            <div className="max-w-xl mx-auto animate-in zoom-in-95 duration-300">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">🧠 Knowledge Check</h2>
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                    <p className="text-lg text-white mb-6 font-medium">{data.question}</p>

                    <div className="space-y-3">
                        {data.options.map((opt, idx) => (
                            <button
                                key={idx}
                                disabled={selectedOption !== null}
                                onClick={() => handleAnswer(idx)}
                                className={`w-full p-4 rounded-xl text-left border transition-all ${selectedOption === idx
                                    ? idx === data.answer ? "bg-emerald-500/20 border-emerald-500 text-emerald-100" : "bg-red-500/20 border-red-500 text-red-100"
                                    : "bg-slate-700/50 border-transparent hover:bg-slate-700 text-slate-200"
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    {opt}
                                    {selectedOption === idx && (
                                        idx === data.answer ? <CheckCircle size={18} /> : <AlertTriangle size={18} />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    {feedback && (
                        <div className="mt-6 animate-in fade-in slide-in-from-bottom-2">
                            <div className={`p-4 rounded-lg text-sm ${feedback.type === 'success' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'}`}>
                                {feedback.text}
                            </div>
                            <button onClick={handleNext} className="mt-4 w-full btn-primary py-3">Next Step</button>
                        </div>
                    )}
                </div>
            </div>
        )
    };

    const DecisionView = ({ data }) => {
        const handleDecision = (idx) => {
            setSelectedOption(idx);
            const choice = data.options[idx];
            setFeedback({ type: choice.consequence === 'good' ? 'success' : 'warning', text: choice.feedback });
            if (choice.consequence === 'good') setScore(s => s + 20); // Higher reward for decisions
        };

        return (
            <div className="max-w-xl mx-auto animate-in zoom-in-95 duration-300">
                <h2 className="text-2xl font-bold text-white mb-2 text-center">⚖️ Decision Time</h2>
                <p className="text-slate-400 text-center mb-6 text-sm">Choose wisely. Every choice has a consequence.</p>

                <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 shadow-2xl relative overflow-hidden">
                    {/* Scenario */}
                    <p className="text-xl text-white font-serif italic mb-8 relative z-10">"{data.scenario}"</p>

                    {!feedback ? (
                        <div className="grid gap-4 z-10 relative">
                            {data.options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleDecision(idx)}
                                    className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/20 hover:border-blue-400 transition-all text-blue-100 text-left"
                                >
                                    {opt.text}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 z-10 relative">
                            <div className={`p-6 rounded-xl border mb-6 ${feedback.type === 'success' ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-200' : 'bg-red-900/30 border-red-500/50 text-red-200'}`}>
                                <h4 className="font-bold mb-2 uppercase text-xs tracking-wider">{feedback.type === 'success' ? 'Good Outcome' : 'Consequence'}</h4>
                                <p className="text-lg leading-relaxed">{feedback.text}</p>
                            </div>
                            <button onClick={handleNext} className="w-full btn-primary py-3">Continue Journey</button>
                        </div>
                    )}
                </div>
            </div>
        )
    };

    const ActivityView = ({ data }) => (
        <div className="animate-in slide-in-from-right-8 duration-500">
            <div className="bg-slate-900 p-1 rounded-2xl border border-slate-800 shadow-2xl">
                <ModuleActivity
                    type={data.activityType}
                    onComplete={(success) => {
                        setActivityCompleted(true);
                        setScore(s => s + 15);
                    }}
                />
            </div>
            {activityCompleted && (
                <div className="text-center mt-6 animate-in hover-none">
                    <button onClick={handleNext} className="btn-primary px-12 py-3 shadow-glow">
                        Module Complete! Finish <ChevronRight />
                    </button>
                </div>
            )}
        </div>
    );

    // --- RENDER ---

    if (finished) {
        return (
            <div className="max-w-lg mx-auto text-center py-12 animate-in zoom-in-50 duration-500">
                <div className="w-24 h-24 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(234,179,8,0.4)]">
                    <Award size={48} className="text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">Module Complete!</h1>
                <p className="text-slate-400 mb-8">You have mastered <strong>{module.title}</strong></p>

                <div className="bg-slate-800 rounded-2xl p-6 mb-8 border border-white/10">
                    <div className="text-slate-500 text-sm uppercase tracking-widest mb-1">Total XP Earned</div>
                    <div className="text-5xl font-mono font-bold text-emerald-400">+{score}</div>
                </div>

                <div className="flex gap-4 justify-center">
                    <button onClick={() => onComplete(true, score)} className="btn-primary py-3 px-8 text-lg font-bold">
                        Return to Career Map
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header / Meta */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-slate-500 uppercase text-xs font-bold tracking-widest mb-1">Module {module.id}</h2>
                    <h1 className="text-2xl font-bold text-white">{module.title}</h1>
                </div>
                <div className="text-right">
                    <div className="text-emerald-400 font-mono font-bold text-xl">{score} XP</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 bg-slate-800 w-full rounded-full overflow-hidden mb-12">
                <div className="h-full bg-brand-primary transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
            </div>

            {/* Stage Container */}
            <div className="min-h-[400px]">
                {currentStage.type === 'story' && <StoryView data={currentStage} />}
                {currentStage.type === 'quiz' && <QuizView data={currentStage} />}
                {currentStage.type === 'decision' && <DecisionView data={currentStage} />}
                {currentStage.type === 'activity' && <ActivityView data={currentStage} />}
            </div>
        </div>
    );
}
