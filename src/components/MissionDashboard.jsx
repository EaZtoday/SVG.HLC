import React from 'react';
import { ArrowLeft, Activity, Target, Shield, Award } from 'lucide-react';
import familyLogo from '../assets/images/family-logo.png';
import doctorHero from '../assets/images/doctor-hero.jpg';

export default function MissionDashboard({ presentations, cooperativeDoctors, hemoOncoCooperative, onBack }) {
    return (
        <div className="max-w-3xl mx-auto pb-20">
            {/* Command Header */}
            <div className="flex items-center gap-4 mb-8 sticky top-0 bg-[#F2F2F7]/95 backdrop-blur-2xl py-4 z-10 px-4">
                <button onClick={onBack} className="p-3 bg-white rounded-full shadow-lg hover:bg-slate-50 transition-all active:scale-90 border border-slate-100">
                    <ArrowLeft size={32} className="text-slate-900" strokeWidth={2.5} />
                </button>
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mission Control</h2>
                    <p className="text-[10px] text-primary-600 font-extrabold uppercase tracking-[0.2em]">St. Vincent HLC Strategic Oversight</p>
                </div>
            </div>

            <div className="space-y-8 px-4">
                {/* Global Metrics - Refined Apple Look */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white flex flex-col items-center justify-center text-center">
                        <div className="text-6xl font-black text-primary-600 mb-2 tabular-nums">{presentations.length}</div>
                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Presentations</div>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white flex flex-col items-center justify-center text-center">
                        <div className="text-6xl font-black text-emerald-600 mb-2 tabular-nums">{cooperativeDoctors.length}</div>
                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Cooperative Net</div>
                    </div>
                </div>

                {/* Primary Objective: Hemo-Oncology - High Fidelity */}
                <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-primary-50 relative overflow-hidden group">
                    <div className="absolute -right-12 -top-12 w-64 h-64 bg-primary-50 rounded-full opacity-30 blur-3xl group-hover:scale-125 transition-transform duration-[3s]"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-14 h-14 bg-primary-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                                <Target size={30} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-slate-900 tracking-tight">Hemo-Onco enlistment</h4>
                                <p className="text-xs font-bold text-primary-600 uppercase tracking-widest">2026 Primary Mission</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <div className="text-lg font-black text-slate-700">Enrolled Specialists</div>
                                    <div className="text-xs text-slate-400 font-bold italic">Tracking cooperative buy-in</div>
                                </div>
                                <div className="text-3xl font-black text-primary-600">{hemoOncoCooperative.length} <span className="text-lg text-slate-300">/ 10</span></div>
                            </div>

                            <div className="h-8 w-full bg-slate-100 rounded-3xl p-1.5 shadow-inner">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-primary-600 rounded-2xl shadow-[0_0_20px_rgba(0,122,255,0.4)] transition-all duration-[1.5s] ease-out"
                                    style={{ width: `${Math.min(100, (hemoOncoCooperative.length / 10) * 100)}%` }}
                                />
                            </div>

                            <div className="flex justify-between text-center text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">
                                <div className={hemoOncoCooperative.length >= 3 ? 'text-primary-600' : ''}>ESTABLISH (3)</div>
                                <div className={hemoOncoCooperative.length >= 6 ? 'text-primary-600' : ''}>SECURE (6)</div>
                                <div className="text-primary-600">ELITE NET (10)</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Status - Clean Apple Bar */}
                <div className="ios-card flex items-center gap-5 active:scale-[0.98] transition-all bg-white/50 backdrop-blur-sm border-white/80">
                    <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                        <Shield size={32} strokeWidth={2} />
                    </div>
                    <div>
                        <div className="text-xl font-bold text-slate-800 tracking-tight">System Guard Active</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">End-to-End Encryption Armed</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
