import React from "react";
import { ArrowRight, ExternalLink, Briefcase } from "lucide-react";

// Updated data including Startup Schemes
const SCHEMES_DATA = [
    {
        id: 1,
        source: "Startup",
        title: "Startup India Seed Fund",
        description: "Financial assistance to startups for proof of concept, prototype development, and commercialization.",
        date: "19 Jan 2026",
        link: "#",
        tag: "Funding",
        action: "Apply Now"
    },
    {
        id: 2,
        source: "RBI",
        title: "Digital Rupee Pilot",
        description: "Expanded retail pilot for CBDC across 5 new cities.",
        date: "2 hrs ago",
        link: "#",
        tag: "News",
        action: "Read More"
    },
    {
        id: 3,
        source: "MUDRA",
        title: "PMMY Scheme Loan",
        description: "Loans up to ₹10 Lakhs for non-corporate, non-farm small/micro enterprises.",
        date: "Active",
        link: "#",
        tag: "Loan",
        action: "Apply Now"
    },
    {
        id: 4,
        source: "SEBI",
        title: "T+1 Settlement Cycle",
        description: "Full implementation for all equity listings starting next month.",
        date: "5 hrs ago",
        link: "#",
        tag: "News",
        action: ""
    },
    {
        id: 5,
        source: "Govt",
        title: "Atal Innovation Mission",
        description: "Grant-in-aid support to Atal Incubation Centres.",
        date: "Closing Soon",
        link: "#",
        tag: "Grant",
        action: "Apply Now"
    },
    {
        id: 6,
        source: "Tax",
        title: "Section 80IAC Exemption",
        description: "Tax holiday for 3 consecutive years for eligible startups.",
        date: "FY 2025-26",
        link: "#",
        tag: "Tax Benefit",
        action: "Check Eligibility"
    },
];

const SchemeCard = ({ item }) => (
    <div className="group relative p-4 mb-4 rounded-xl bg-white/5 border border-white/5 hover:border-brand-primary/30 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm cursor-pointer overflow-hidden">

        <div className="flex justify-between items-start mb-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${item.source === 'Startup' ? 'border-orange-500/30 text-orange-400 bg-orange-500/10' :
                    item.source === 'MUDRA' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                        'border-blue-500/30 text-blue-400 bg-blue-500/10'
                }`}>
                {item.source}
            </span>
            <span className="text-[10px] text-brand-muted font-medium">{item.date}</span>
        </div>

        <h3 className="text-sm font-bold text-gray-100 mb-1 leading-tight group-hover:text-brand-primary transition-colors">
            {item.title}
        </h3>

        {item.description && (
            <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
                {item.description}
            </p>
        )}

        {/* Action Area */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
            <span className="text-[10px] font-mono text-brand-muted uppercase">{item.tag}</span>

            {item.action ? (
                <button className={`text-[10px] font-bold px-3 py-1.5 rounded transition-all flex items-center gap-1 ${item.action === 'Apply Now' || item.action === 'Check Eligibility'
                        ? 'bg-brand-primary text-white hover:bg-brand-primary/80 shadow-lg shadow-brand-primary/20'
                        : 'text-brand-primary hover:text-white'
                    }`}>
                    {item.action}
                    {item.action === 'Apply Now' ? <Briefcase size={10} /> : <ArrowRight size={10} />}
                </button>
            ) : (
                <span className="text-[10px] text-brand-muted flex items-center gap-1 hover:text-white transition-colors">
                    Details <ArrowRight size={10} />
                </span>
            )}
        </div>
    </div>
);

export default function SchemesPanel() {
    return (
        <div className="h-full flex flex-col bg-[#08080A]/60 backdrop-blur-xl border-l border-white/5 w-full">
            {/* Header */}
            <div className="p-5 border-b border-white/5 sticky top-0 bg-[#08080A]/90 z-10 backdrop-blur-md">
                <div className="flex items-center justify-between mb-1">
                    <h2 className="text-base font-heading text-white">Schemes & Grants</h2>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-primary/10 border border-brand-primary/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                        <span className="text-[10px] font-bold text-brand-primary tracking-wider">OPEN</span>
                    </div>
                </div>
                <p className="text-[11px] text-brand-muted">Govt funding & startup policies.</p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1">
                {SCHEMES_DATA.map((item) => (
                    <SchemeCard key={item.id} item={item} />
                ))}

                <div className="pt-4 pb-8 text-center">
                    <button className="text-xs font-medium text-brand-muted hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto uppercase tracking-wide">
                        View All Programs <ExternalLink size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
}
