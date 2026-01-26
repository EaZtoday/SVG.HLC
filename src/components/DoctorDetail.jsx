import { ArrowLeft, Calendar, MapPin, Activity } from 'lucide-react';
import { COOPERATION_STATUSES } from '../constants';
import familyLogo from '../assets/images/family-logo.png';

export default function DoctorDetail({ doctor, onBack }) {
    const getStatusLabel = (val) => {
        return COOPERATION_STATUSES.find(s => s.value === val)?.label || val;
    };

    return (
        <div className="max-w-3xl mx-auto pb-20">
            <div className="flex items-center gap-4 mb-6 sticky top-0 bg-primary-50/95 backdrop-blur-xl py-4 z-10">
                <button onClick={onBack} className="p-3 bg-white rounded-full shadow hover:bg-slate-50 transition-all active:scale-95">
                    <ArrowLeft size={32} className="text-slate-700" />
                </button>
                <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Profile</h2>
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-ios border border-white/60 mb-8 transform-gpu">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-5">
                        <div className="w-20 h-20 bg-primary-50 rounded-[1.5rem] flex items-center justify-center p-4 border border-primary-100 shadow-inner">
                            <img src={familyLogo} alt="" className="w-full h-full object-contain opacity-60" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">{doctor.name}</h1>
                            <p className="text-xl text-primary-600 font-medium">{doctor.latestFacility}</p>
                        </div>
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-sm font-bold bg-slate-100 text-slate-600`}>
                        {doctor.interactionCount} Encounters
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    {doctor.specialties.map(s => (
                        <span key={s} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold border border-blue-100">
                            {s}
                        </span>
                    ))}
                </div>

                <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/60 backdrop-blur-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1 tracking-wider">Current Status</p>
                    <p className="text-lg font-bold text-slate-800">{getStatusLabel(doctor.status)}</p>
                </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-800 mb-4 px-2">Interaction History</h3>
            <div className="space-y-4">
                {doctor.interactions.map(interaction => (
                    <div key={interaction.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100/50 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 text-primary-600 font-bold mb-2">
                            <Calendar size={18} />
                            {new Date(interaction.date).toLocaleDateString()}
                        </div>

                        <div className="flex items-center gap-2 text-slate-600 mb-3 font-medium">
                            <MapPin size={18} />
                            {interaction.facility}
                        </div>

                        {interaction.status && (
                            <div className="mb-4">
                                <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold bg-slate-50 text-slate-700 border border-slate-200/50`}>
                                    {getStatusLabel(interaction.status)}
                                </span>
                            </div>
                        )}

                        {interaction.notes && (
                            <div className="bg-amber-50/80 p-5 rounded-2xl text-amber-900 text-base border border-amber-100/60 leading-relaxed font-medium">
                                {interaction.notes}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
