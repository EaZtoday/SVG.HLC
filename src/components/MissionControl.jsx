import React, { useState, useEffect } from 'react';

// ============================================
// ALL MEDICAL SPECIALTIES - Master List
// ============================================
const ALL_SPECIALTIES = [
    'Anesthesiology',
    'Burn Care',
    'Cardiac Surgery',
    'Colon and Rectal Surgery',
    'Critical Care/Intensive Care',
    'Emergency Medicine',
    'Gastroenterology',
    'General Surgery',
    'Gynecologic Oncology',
    'Gynecology',
    'Hematology',
    'Hospital Medicine',
    'Hospital Medicine - Nocturnist',
    'Internal Medicine',
    'Interventional Radiology',
    'Neonatology',
    'Nephrology',
    'Neurosurgery',
    'Obstetrics',
    'Obstetrics - Laborist',
    'Obstetrics - Perinatologist',
    'Oncology',
    'Oral and Maxillofacial Surgery',
    'Orthopedic Surgery',
    'Otolaryngology (Head & Neck)',
    'Pulmonology',
    'Thoracic Surgery',
    'Transplantation Surgery',
    'Trauma Surgery',
    'Urology',
    'Vascular Surgery',
];

// ============================================
// CONFIG
// ============================================
const GOALS_CONFIG = {
    year: 2026,
    scripture: '2 Kings 4:3',
    scriptureText: '"Do not limit yourself to a few."',
    mantra: 'Growth not left to chance | SMART goals ensure motion becomes forward progress',
};

// ============================================
// COLORS
// ============================================
const colors = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', fill: 'bg-blue-500', light: 'bg-blue-100' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', fill: 'bg-emerald-500', light: 'bg-emerald-100' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', fill: 'bg-purple-500', light: 'bg-purple-100' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', fill: 'bg-amber-500', light: 'bg-amber-100' },
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function MissionControl({ presentations = [], cooperativeDoctors = [], onBack }) {
    // State
    const [doctorTargets, setDoctorTargets] = useState([]);
    const [otherGoals, setOtherGoals] = useState([]);
    const [showAddSpecialty, setShowAddSpecialty] = useState(false);
    const [newSpecialty, setNewSpecialty] = useState('');
    const [newTarget, setNewTarget] = useState(2);
    const [customSpecialty, setCustomSpecialty] = useState('');
    const [showCelebration, setShowCelebration] = useState(false);
    const [celebrationText, setCelebrationText] = useState('Goal Reached!');
    const [expandedGoal, setExpandedGoal] = useState(null);

    // Load from localStorage
    useEffect(() => {
        const savedDoctors = localStorage.getItem('missionControl_doctors_v3');
        const savedGoals = localStorage.getItem('missionControl_goals_v3');

        if (savedDoctors) {
            setDoctorTargets(JSON.parse(savedDoctors));
        } else {
            // Default starting specialties
            setDoctorTargets([
                { id: 'hematology', specialty: 'Hematology', target: 2, current: 0, priority: true },
                { id: 'oncology', specialty: 'Oncology', target: 2, current: 0, priority: true },
            ]);
        }

        if (savedGoals) {
            setOtherGoals(JSON.parse(savedGoals));
        } else {
            setOtherGoals([
                { id: 'presentations', icon: '🎤', label: 'Presentations', subtitle: 'Total this year', current: 0, targetMin: 6, targetMax: 9, color: 'blue', autoTrack: true },
                { id: 'large-presentation', icon: '🏥', label: 'Large Presentation', subtitle: 'Nursing Staff & Georgetown Staff', current: 0, targetMin: 1, color: 'purple' },
                {
                    id: 'medical-schools', icon: '🎓', label: 'Medical Schools', subtitle: 'St. James, Trinity, ASU', current: 0, targetMin: 3, color: 'amber', type: 'checklist', checklist: [
                        { id: 'st-james', label: 'St. James', done: false, priority: true },
                        { id: 'trinity', label: 'Trinity', done: false },
                        { id: 'asu', label: 'ASU', done: false },
                        { id: 'nursing', label: 'Nursing Schools', done: false },
                    ]
                },
            ]);
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (doctorTargets.length > 0) {
            localStorage.setItem('missionControl_doctors_v3', JSON.stringify(doctorTargets));
        }
    }, [doctorTargets]);

    useEffect(() => {
        if (otherGoals.length > 0) {
            localStorage.setItem('missionControl_goals_v3', JSON.stringify(otherGoals));
        }
    }, [otherGoals]);

    // Auto-track presentations
    // Auto-track presentations & Medical School milestones
    useEffect(() => {
        if (otherGoals.length > 0) {
            let nextGoals = [...otherGoals];
            let changed = false;

            // 1. Total Presentations Count (Standard Tracking)
            const presGoal = nextGoals.find(g => g.id === 'presentations');
            const actualCount = presentations.length;

            if (presGoal?.autoTrack && presGoal.current !== actualCount) {
                nextGoals = nextGoals.map(g =>
                    g.id === 'presentations' ? { ...g, current: actualCount } : g
                );
                changed = true;
            }

            // 2. Medical Schools Checklist (Intelligent Sync)
            const medSchoolGoal = nextGoals.find(g => g.id === 'medical-schools');
            if (medSchoolGoal) {
                const updatedChecklist = medSchoolGoal.checklist.map(item => {
                    const hasPresentation = presentations.some(p =>
                        p.facility.toLowerCase().includes(item.label.toLowerCase())
                    );
                    if (item.done !== hasPresentation) {
                        if (!item.done && hasPresentation) {
                            setTimeout(() => triggerCelebration(`${item.label} Registered! ✨`), 200);
                        }
                        return { ...item, done: hasPresentation };
                    }
                    return item;
                });

                const newCurrent = updatedChecklist.filter(i => i.done).length;
                if (JSON.stringify(updatedChecklist) !== JSON.stringify(medSchoolGoal.checklist)) {
                    nextGoals = nextGoals.map(g =>
                        g.id === 'medical-schools' ? { ...g, checklist: updatedChecklist, current: newCurrent } : g
                    );
                    changed = true;
                }
            }

            if (changed) {
                setOtherGoals(nextGoals);
            }
        }
    }, [presentations, otherGoals.length]); // Track presentations and goal structure

    // Auto-track doctor specialties
    useEffect(() => {
        if (doctorTargets.length > 0 && cooperativeDoctors.length > 0) {
            let changed = false;
            const nextTargets = doctorTargets.map(target => {
                const count = cooperativeDoctors.filter(d =>
                    d.specialties.some(s => s.toLowerCase().includes(target.specialty.toLowerCase()))
                ).length;

                if (target.current !== count) {
                    changed = true;
                    // Trigger celebration if goal reached via auto-sync
                    if (target.current < target.target && count >= target.target) {
                        setTimeout(() => triggerCelebration(`${target.specialty} Goal Complete! 🎉`), 100);
                    }
                    return { ...target, current: count };
                }
                return target;
            });

            if (changed) {
                setDoctorTargets(nextTargets);
            }
        }
    }, [cooperativeDoctors]);

    // Celebration trigger
    const triggerCelebration = (text = 'Goal Reached!') => {
        setCelebrationText(text);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2500);
    };

    // Add new specialty target
    const addSpecialtyTarget = () => {
        const specialty = newSpecialty === 'custom' ? customSpecialty : newSpecialty;
        if (!specialty || doctorTargets.some(d => d.specialty === specialty)) return;

        const newDoc = {
            id: specialty.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            specialty,
            target: newTarget,
            current: 0,
            priority: false,
        };

        setDoctorTargets(prev => [...prev, newDoc]);
        setShowAddSpecialty(false);
        setNewSpecialty('');
        setNewTarget(2);
        setCustomSpecialty('');
        triggerCelebration('Specialty Added! 🎯');
    };

    // Remove specialty
    const removeSpecialty = (id) => {
        if (confirm('Remove this specialty target?')) {
            setDoctorTargets(prev => prev.filter(d => d.id !== id));
        }
    };

    // Update doctor count
    const updateDoctorCount = (id, delta) => {
        setDoctorTargets(prev => prev.map(d => {
            if (d.id === id) {
                const newCurrent = Math.max(0, d.current + delta);
                // Check if just reached goal
                if (d.current < d.target && newCurrent >= d.target) {
                    setTimeout(() => triggerCelebration(`${d.specialty} Goal Complete! 🎉`), 100);
                }
                return { ...d, current: newCurrent };
            }
            return d;
        }));
    };

    // Update target number
    const updateTargetNumber = (id, newTargetValue) => {
        setDoctorTargets(prev => prev.map(d => {
            if (d.id === id) {
                const finalTarget = Math.max(1, newTargetValue);
                // Celebrate if lowering target completes it
                if (d.current < d.target && d.current >= finalTarget) {
                    setTimeout(() => triggerCelebration(`${d.specialty} Goal Complete! 🎉`), 100);
                }
                return { ...d, target: finalTarget };
            }
            return d;
        }));
    };

    // Toggle priority
    const togglePriority = (id) => {
        setDoctorTargets(prev => prev.map(d =>
            d.id === id ? { ...d, priority: !d.priority } : d
        ));
    };

    // Update other goals
    const updateGoalCount = (id, delta) => {
        setOtherGoals(prev => prev.map(g => {
            if (g.id === id) {
                const newCurrent = Math.max(0, g.current + delta);
                if (g.current < g.targetMin && newCurrent >= g.targetMin) {
                    setTimeout(() => triggerCelebration(`${g.label} Goal Complete! 🎉`), 100);
                }
                return { ...g, current: newCurrent };
            }
            return g;
        }));
    };

    // Toggle checklist
    const toggleChecklist = (goalId, itemId) => {
        setOtherGoals(prev => prev.map(g => {
            if (g.id === goalId && g.checklist) {
                const newChecklist = g.checklist.map(item =>
                    item.id === itemId ? { ...item, done: !item.done } : item
                );
                const newCurrent = newChecklist.filter(i => i.done).length;
                // Check if just completed all
                if (g.current < g.targetMin && newCurrent >= g.targetMin) {
                    setTimeout(() => triggerCelebration(`${g.label} Complete! 🎉`), 100);
                }
                return { ...g, checklist: newChecklist, current: newCurrent };
            }
            return g;
        }));
    };

    // Calculate totals
    const totalDoctorsEnrolled = doctorTargets.reduce((sum, d) => sum + d.current, 0);
    const totalDoctorsTarget = doctorTargets.reduce((sum, d) => sum + d.target, 0);
    const presentationsCount = otherGoals.find(g => g.id === 'presentations')?.current || 0;

    // Available specialties (not already added)
    const availableSpecialties = ALL_SPECIALTIES.filter(
        s => !doctorTargets.some(d => d.specialty === s)
    );

    return (
        <div className="min-h-screen bg-[#F2F2F7]">
            {/* 🎉 Celebration Overlay */}
            {showCelebration && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md transition-all">
                    <div className="text-center animate-bounce">
                        <div className="text-9xl mb-6">🎉</div>
                        <div className="text-4xl font-black text-white drop-shadow-2xl tracking-tight">{celebrationText}</div>
                    </div>
                </div>
            )}

            <div className="max-w-3xl mx-auto px-6 py-12">
                {/* Navigation & Header */}
                <div className="flex items-center gap-6 mb-12 sticky top-0 bg-[#F2F2F7]/90 backdrop-blur-2xl py-6 z-20 -mx-6 px-6">
                    <button onClick={onBack} className="p-4 bg-white rounded-full shadow-lg hover:bg-slate-50 transition-all active:scale-90 border border-slate-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="flex-1 text-left">
                        <h1 className="text-5xl font-black text-slate-900 tracking-tightest leading-none">St. Vincent HLC</h1>
                    </div>
                </div>

                {/* Big Stats - High Fidelity */}
                <div className="grid grid-cols-2 gap-6 mb-10">
                    <div className="bg-white p-10 rounded-[3rem] shadow-ios border border-white flex flex-col items-center justify-center text-center">
                        <div className="text-7xl font-black text-primary-500 mb-2 tabular-nums tracking-tightest">{presentationsCount}</div>
                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Presentations</div>
                    </div>
                    <div className="bg-white p-10 rounded-[3rem] shadow-ios border border-white flex flex-col items-center justify-center text-center">
                        <div className="text-7xl font-black text-emerald-500 mb-2 tabular-nums tracking-tightest">{totalDoctorsEnrolled}</div>
                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">CDL Doctors</div>
                    </div>
                </div>

                {/* ==================== */}
                {/* DOCTOR TARGETS CARD */}
                {/* ==================== */}
                <div className="ios-card !p-8 !rounded-[3rem] mb-10 overflow-hidden relative group text-left">
                    <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-50 rounded-full opacity-30 blur-3xl group-hover:scale-125 transition-transform duration-[3s]"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-5 mb-10">
                            <div className="w-16 h-16 bg-emerald-600 text-white rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-3xl font-black text-slate-900 tracking-tight">Doctor Outreach 2026</h4>
                            </div>
                        </div>

                        {/* Overall Progress */}
                        <div className="space-y-8 mb-12">
                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <div className="text-lg font-black text-slate-700">Total Enrolled</div>
                                    <div className="text-xs text-slate-400 font-bold italic">Building our Cooperative Doctor List</div>
                                </div>
                                <div className="text-4xl font-black text-emerald-600 tabular-nums">{totalDoctorsEnrolled} <span className="text-xl text-slate-300">/ {totalDoctorsTarget}</span></div>
                            </div>

                            <div className="h-8 w-full bg-slate-100 rounded-3xl p-1.5 shadow-inner overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-2xl shadow-[0_0_20px_rgba(52,199,89,0.3)] transition-all duration-[1.5s] ease-out"
                                    style={{ width: `${totalDoctorsTarget > 0 ? (totalDoctorsEnrolled / totalDoctorsTarget) * 100 : 0}%` }}
                                />
                            </div>
                        </div>

                        {/* Specialty List */}
                        <div className="grid gap-6">
                            {doctorTargets.map(doc => {
                                const isComplete = doc.current >= doc.target;
                                const progress = (doc.current / doc.target) * 100;

                                return (
                                    <div
                                        key={doc.id}
                                        className={`p-8 rounded-[2.5rem] transition-all duration-300 border-2 ${isComplete
                                            ? 'bg-emerald-50/50 border-emerald-500/20 shadow-sm'
                                            : 'bg-white border-slate-50 shadow-md'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-8">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${isComplete ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-slate-100 text-slate-400'}`}>
                                                    {isComplete ? (
                                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : <span className="text-2xl">🩺</span>}
                                                </div>
                                                <div className="text-left">
                                                    <span className={`text-2xl font-black tracking-tight block ${isComplete ? 'text-emerald-900' : 'text-slate-800'}`}>
                                                        {doc.specialty}
                                                    </span>
                                                    {doc.priority && (
                                                        <div className="text-[12px] font-black text-red-500 uppercase tracking-widest mt-1 flex items-center gap-1">
                                                            ★ Priority
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => togglePriority(doc.id)}
                                                    className={`p-4 rounded-full transition-all btn-press border-2 ${doc.priority
                                                        ? 'bg-red-50 border-red-200 text-red-500 shadow-lg shadow-red-500/20'
                                                        : 'bg-white border-slate-100 text-slate-200 hover:text-slate-400'
                                                        }`}
                                                    title="Toggle Priority"
                                                >
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => removeSpecialty(doc.id)}
                                                    className="p-4 bg-white border-2 border-slate-50 text-slate-200 hover:text-red-400 rounded-full transition-colors btn-press shadow-sm"
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Progress Bar - Large & Clear */}
                                        <div className="space-y-3 mb-10">
                                            <div className="h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-[1s] ease-out ${isComplete ? 'bg-emerald-500 shadow-[0_0_15px_rgba(52,199,89,0.5)]' : 'bg-emerald-400'}`}
                                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Controls Grid */}
                                        <div className="grid grid-cols-2 gap-8">
                                            {/* Enrolled Column */}
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left block ml-1">Enrolled</label>
                                                <div className="flex items-center bg-slate-50 p-2 rounded-[2rem] border border-slate-100 shadow-inner">
                                                    <button
                                                        onClick={() => updateDoctorCount(doc.id, -1)}
                                                        className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center btn-press text-3xl font-black text-slate-400 hover:text-slate-600"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="flex-1 text-4xl font-black text-slate-900 tabular-nums text-center">{doc.current}</span>
                                                    <button
                                                        onClick={() => updateDoctorCount(doc.id, 1)}
                                                        className="w-14 h-14 rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-500/40 flex items-center justify-center btn-press text-3xl font-black"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Target Column */}
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left block ml-1">Goal</label>
                                                <div className="flex items-center bg-slate-50 p-2 rounded-[2rem] border border-slate-100 shadow-inner">
                                                    <button
                                                        onClick={() => updateTargetNumber(doc.id, doc.target - 1)}
                                                        className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center btn-press text-3xl font-black text-slate-400 hover:text-slate-600"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="flex-1 text-4xl font-black text-slate-400 tabular-nums text-center">{doc.target}</span>
                                                    <button
                                                        onClick={() => updateTargetNumber(doc.id, doc.target + 1)}
                                                        className="w-14 h-14 rounded-full bg-white border-2 border-emerald-100 shadow-sm flex items-center justify-center btn-press text-3xl font-black text-emerald-500"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {!showAddSpecialty ? (
                            <button
                                onClick={() => setShowAddSpecialty(true)}
                                className="w-full mt-8 p-6 rounded-[2rem] border-4 border-dashed border-slate-100 hover:border-emerald-500/50 hover:bg-emerald-50 transition-all flex items-center justify-center gap-3 text-slate-400 hover:text-emerald-700 btn-press group"
                            >
                                <div className="w-10 h-10 bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white rounded-xl flex items-center justify-center transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <span className="font-black uppercase tracking-widest text-sm">Add Specialty Target</span>
                            </button>
                        ) : (
                            <div className="mt-8 p-8 rounded-[2.5rem] bg-slate-50 border-2 border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500 text-left">
                                <h5 className="text-xl font-black text-slate-900 mb-6 tracking-tight">Add Specialty Goal</h5>

                                <div className="space-y-6">
                                    <div>
                                        <label className="granny-label !text-xs !mb-2">Specialty</label>
                                        <select
                                            value={newSpecialty}
                                            onChange={(e) => setNewSpecialty(e.target.value)}
                                            className="ios-input !text-lg !p-5"
                                        >
                                            <option value="">Choose Specialty...</option>
                                            {availableSpecialties.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                            <option value="custom">➕ Add your own...</option>
                                        </select>
                                    </div>

                                    {newSpecialty === 'custom' && (
                                        <div className="animate-in fade-in duration-300">
                                            <label className="granny-label !text-xs !mb-2">Specialty Name</label>
                                            <input
                                                type="text"
                                                value={customSpecialty}
                                                onChange={(e) => setCustomSpecialty(e.target.value)}
                                                placeholder="Enter name..."
                                                className="ios-input !text-lg !p-5"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="granny-label !text-xs !mb-2">Strategic Goal</label>
                                        <div className="flex items-center gap-5">
                                            <button
                                                onClick={() => setNewTarget(Math.max(1, newTarget - 1))}
                                                className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl font-black text-slate-400 btn-press"
                                            >
                                                −
                                            </button>
                                            <span className="text-4xl font-black text-emerald-600 w-16 text-center tabular-nums">{newTarget}</span>
                                            <button
                                                onClick={() => setNewTarget(newTarget + 1)}
                                                className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl font-black text-slate-400 btn-press"
                                            >
                                                +
                                            </button>
                                            <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Specialists</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            onClick={() => { setShowAddSpecialty(false); setNewSpecialty(''); setCustomSpecialty(''); }}
                                            className="flex-1 p-5 rounded-[1.5rem] bg-white border border-slate-200 text-slate-500 font-black uppercase tracking-widest text-xs btn-press"
                                        >
                                            Abort
                                        </button>
                                        <button
                                            onClick={addSpecialtyTarget}
                                            disabled={!newSpecialty || (newSpecialty === 'custom' && !customSpecialty)}
                                            className="flex-1 p-5 rounded-[1.5rem] bg-slate-900 text-white font-black uppercase tracking-widest text-xs btn-press disabled:opacity-30"
                                        >
                                            Add Goal
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ==================== */}
                {/* OTHER GOALS GRID */}
                {/* ==================== */}
                <div className="mb-12 text-left">
                    <h2 className="granny-label mb-6">2026 SMART Goals</h2>

                    <div className="grid grid-cols-2 gap-6 text-left">
                        {otherGoals.map(goal => {
                            const c = colors[goal.color];
                            const progress = (goal.current / (goal.targetMax || goal.targetMin)) * 100;
                            const isComplete = progress >= 100;
                            const isExpanded = expandedGoal === goal.id;

                            return (
                                <div key={goal.id} className="relative group/goal text-left">
                                    <div
                                        onClick={() => setExpandedGoal(isExpanded ? null : goal.id)}
                                        className={`w-full text-left bg-white rounded-[2.5rem] p-8 shadow-ios border-2 transition-all cursor-pointer ${isExpanded ? `${c.border} shadow-2xl scale-[1.02]` : 'border-white hover:border-slate-100'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="text-4xl filter drop-shadow-md group-hover/goal:scale-110 transition-transform">{goal.icon}</div>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-5xl font-black ${c.text} tabular-nums tracking-tightest`}>{goal.current}</span>
                                                {!goal.type && (
                                                    <div className="flex flex-col gap-2">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); updateGoalCount(goal.id, 1); }}
                                                            className="w-12 h-12 bg-slate-50 border border-slate-100 flex items-center justify-center rounded-xl text-slate-300 hover:text-slate-600 btn-press transition-colors shadow-sm"
                                                        >
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 15l7-7 7 7" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); updateGoalCount(goal.id, -1); }}
                                                            className="w-12 h-12 bg-slate-50 border border-slate-100 flex items-center justify-center rounded-xl text-slate-300 hover:text-slate-600 btn-press transition-colors shadow-sm"
                                                        >
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="font-black text-slate-900 text-lg mb-1 tracking-tight">{goal.label}</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">{goal.subtitle}</div>

                                        <div className="h-3 bg-slate-50 rounded-full overflow-hidden shadow-inner">
                                            <div className={`h-full ${c.fill} rounded-full transition-all duration-[1s] shadow-lg shadow-current/20`} style={{ width: `${Math.min(progress, 100)}%` }} />
                                        </div>

                                        {isComplete && (
                                            <div className="absolute -top-3 -right-3 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white animate-in zoom-in duration-500">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Expanded checklist */}
                                    {isExpanded && goal.type === 'checklist' && (
                                        <div className={`mt-4 bg-white rounded-[2rem] p-6 shadow-2xl border-2 ${c.border} animate-in fade-in slide-in-from-top-2 duration-300`}>
                                            <div className="space-y-3">
                                                {goal.checklist.map(item => (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => toggleChecklist(goal.id, item.id)}
                                                        className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all ${item.done ? c.light : 'bg-slate-50 hover:bg-slate-100'
                                                            }`}
                                                    >
                                                        <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all ${item.done ? `${c.fill} border-transparent scale-110` : 'border-slate-200 bg-white'
                                                            }`}>
                                                            {item.done && (
                                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <span className={`flex-1 text-left font-black tracking-tight ${item.done ? 'text-slate-300 line-through' : 'text-slate-800'}`}>
                                                            {item.label}
                                                        </span>
                                                        {item.priority && !item.done && (
                                                            <span className="px-3 py-1 bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-full">Priority</span>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Expanded target info */}
                                    {isExpanded && !goal.type && (
                                        <div className={`mt-4 bg-white rounded-[2rem] p-6 shadow-2xl border-2 ${c.border} animate-in fade-in slide-in-from-top-2 duration-300`}>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Goal Target:</span>
                                                <span className={`text-2xl font-black ${c.text} tabular-nums`}>
                                                    {goal.targetMax ? `${goal.targetMin}-${goal.targetMax}` : `${goal.targetMin}+`}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Motivational Banner - Premium */}
                <div className="bg-slate-900 rounded-[3rem] p-10 mb-12 shadow-2xl relative overflow-hidden group text-left">
                    <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:rotate-12 transition-transform duration-[4s]">
                        <svg className="w-64 h-64 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="text-primary-500 text-4xl">⭐</div>
                        <p className="text-3xl font-bold text-white tracking-tight italic leading-snug">
                            "{GOALS_CONFIG.mantra}"
                        </p>
                        <div className="pt-4 flex items-center gap-4">
                            <div className="h-0.5 w-12 bg-primary-500 rounded-full"></div>
                            <p className="text-primary-400 text-xs font-black uppercase tracking-widest italic font-mono">
                                {GOALS_CONFIG.scripture} — {GOALS_CONFIG.scriptureText}
                            </p>
                        </div>
                    </div>
                </div>

                {/* System Status - iOS Style */}
                <div className="bg-white/50 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white shadow-xl flex items-center gap-6 text-left">
                    <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500 relative">
                        <div className="absolute inset-0 bg-emerald-400 rounded-3xl animate-ping opacity-20"></div>
                        <svg className="w-8 h-8 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <div>
                        <div className="text-xl font-black text-slate-900 tracking-tight">✓ Saved locally</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
