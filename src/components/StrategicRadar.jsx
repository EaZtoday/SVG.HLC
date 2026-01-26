import React, { useMemo } from 'react';
import { Flame, Snowflake, UserPlus, Clock, ChevronRight } from 'lucide-react';

export default function StrategicRadar({ presentations = [], doctors = [], onQuickAction }) {
    const radarData = useMemo(() => {
        const now = new Date();
        const coldThreshold = 90; // days
        const fadingThreshold = 60; // days

        // 1. Calculate Cold Facilities
        const facilityLastVisits = {};
        presentations.forEach(p => {
            const date = new Date(p.date);
            if (!facilityLastVisits[p.facility] || date > facilityLastVisits[p.facility]) {
                facilityLastVisits[p.facility] = date;
            }
        });

        const coldFacilities = Object.entries(facilityLastVisits)
            .map(([name, lastDate]) => {
                const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
                return { name, diffDays, lastDate };
            })
            .filter(f => f.diffDays >= coldThreshold)
            .sort((a, b) => b.diffDays - a.diffDays);

        // 2. Calculate Fading Leads (Interested docs unseen for 60+ days)
        const fadingLeads = doctors
            .filter(doc => doc.status === 'interested')
            .map(doc => {
                const docPres = presentations.filter(p => p.doctorName === doc.name);
                const lastPres = docPres.length > 0
                    ? new Date(Math.max(...docPres.map(p => new Date(p.date))))
                    : new Date(0);
                const diffDays = Math.floor((now - lastPres) / (1000 * 60 * 60 * 24));
                return { ...doc, diffDays, lastSeen: lastPres };
            })
            .filter(doc => doc.diffDays >= fadingThreshold)
            .sort((a, b) => b.diffDays - a.diffDays);

        return { coldFacilities, fadingLeads };
    }, [presentations, doctors]);

    const { coldFacilities, fadingLeads } = radarData;
    const hasIssues = coldFacilities.length > 0 || fadingLeads.length > 0;

    if (!hasIssues) return null;

    if (presentations.length === 0) return null;

    return (
        <div className="space-y-6 mb-10 mx-6">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Follow-up Radar</h3>
                <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-red-400 animate-pulse"></div>
                    <div className="w-1 h-1 rounded-full bg-red-400 animate-pulse delay-75"></div>
                </div>
            </div>

            <div className="space-y-4">
                {/* Cold Facilities */}
                {coldFacilities.slice(0, 2).map(facility => (
                    <div
                        key={facility.name}
                        onClick={() => onQuickAction({ type: 'facility', name: facility.name })}
                        className="bg-white rounded-[2.5rem] p-6 shadow-ios border-2 border-white hover:border-blue-100 transition-all active:scale-95 group cursor-pointer"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-[1.5rem] flex items-center justify-center relative shadow-inner">
                                <Snowflake className="animate-spin-slow" size={28} />
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-4 border-white"></div>
                            </div>
                            <div className="flex-1 text-left">
                                <div className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">Proactive Follow-up Needed</div>
                                <div className="text-xl font-black text-slate-900 tracking-tight">{facility.name}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                    Last seen <span className="text-blue-500">{facility.diffDays} days ago</span>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                <ChevronRight size={24} strokeWidth={3} />
                            </div>
                        </div>
                    </div>
                ))}

                {/* Fading Leads */}
                {fadingLeads.slice(0, 1).map(doc => (
                    <div
                        key={doc.name}
                        onClick={() => onQuickAction({ type: 'doctor', name: doc.name, specialty: doc.specialties[0] })}
                        className="bg-white rounded-[2.5rem] p-6 shadow-ios border-2 border-white hover:border-amber-100 transition-all active:scale-95 group cursor-pointer"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-[1.5rem] flex items-center justify-center relative shadow-inner">
                                <Clock size={28} />
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full border-4 border-white animate-pulse"></div>
                            </div>
                            <div className="flex-1 text-left">
                                <div className="text-xs font-black text-amber-600 uppercase tracking-widest mb-1">Follow-up Required</div>
                                <div className="text-xl font-black text-slate-900 tracking-tight">Dr. {doc.name}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                    Interested • <span className="text-amber-500">Unseen for {doc.diffDays} days</span>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-amber-500 group-hover:text-white transition-all">
                                <ChevronRight size={24} strokeWidth={3} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
