import React, { useState, useMemo } from 'react';
import { User, CheckCircle, AlertTriangle, Clock, XCircle, ChevronRight } from 'lucide-react';
import { COOPERATION_STATUSES } from '../constants';
import doctorHero from '../assets/images/doctor-hero.jpg';
import familyLogo from '../assets/images/family-logo.png';

export default function DoctorList({ doctors, onSelectDoctor }) {
    const [filter, setFilter] = useState('');

    const filteredDoctors = useMemo(() => {
        return doctors.filter(doc =>
            doc.name.toLowerCase().includes(filter.toLowerCase()) ||
            doc.latestFacility.toLowerCase().includes(filter.toLowerCase())
        );
    }, [doctors, filter]);

    const getStatusColor = (statusVal) => {
        const status = COOPERATION_STATUSES.find(s => s.value === statusVal);
        return status ? status.color : 'slate';
    };

    const StatusIcon = ({ status }) => {
        switch (status) {
            case 'cooperative': return <CheckCircle className="text-emerald-500" />;
            case 'followup': return <Clock className="text-amber-500" />;
            case 'not_favorable': return <XCircle className="text-red-500" />;
            default: return <AlertTriangle className="text-slate-400" />;
        }
    };

    return (
        <div className="max-w-3xl mx-auto pb-20 px-0 sm:px-4">
            {/* Hero Image */}
            <div className="w-full h-40 sm:h-52 relative mb-6 overflow-hidden sm:rounded-[2rem] shadow-ios-lg">
                <img
                    src={doctorHero}
                    alt="Doctor Database"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent flex items-end p-6">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                        Doctor Database
                    </h1>
                </div>
            </div>

            <div className="sticky top-0 bg-primary-50/95 backdrop-blur-xl pt-2 pb-4 z-10 space-y-4 px-4 sm:px-0">
                <input
                    type="text"
                    placeholder="Search doctors..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="ios-input shadow-sm"
                />
            </div>

            <div className="grid gap-4">
                {filteredDoctors.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-xl">
                        No doctors found. Add them in your presentations!
                    </div>
                ) : (
                    filteredDoctors.map(doc => (
                        <button
                            key={doc.name}
                            onClick={() => onSelectDoctor(doc)}
                            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 text-left hover:bg-slate-50 transition-colors group"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center p-3 flex-shrink-0 group-hover:bg-primary-100 transition-colors">
                                        <img src={familyLogo} alt="" className="w-full h-full object-contain opacity-70" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">{doc.name}</h3>
                                        <p className="text-primary-600 font-medium">{doc.latestFacility}</p>
                                        <p className="text-slate-500 text-sm mt-1">{doc.specialties.join(', ')}</p>
                                    </div>
                                </div>
                                <StatusIcon status={doc.status} />
                            </div>

                            <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
                                <div className="text-sm font-semibold text-slate-400">
                                    {doc.interactionCount} Interaction{doc.interactionCount !== 1 && 's'}
                                </div>
                                <div className="text-primary-400 group-hover:translate-x-1 transition-transform">
                                    <ChevronRight />
                                </div>
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}
