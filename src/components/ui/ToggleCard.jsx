import React from 'react';
import { Check, X } from 'lucide-react';

export default function ToggleCard({ label, checked, onChange }) {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`w-full p-6 rounded-3xl border-2 flex items-center justify-between transition-all duration-150 active:scale-95 group ${checked
                ? 'bg-success/5 border-success text-success-900 shadow-sm ring-1 ring-success/10'
                : 'bg-white border-slate-50 text-slate-500 hover:border-slate-100'
                }`}
        >
            <span className={`text-xl font-bold ${checked ? 'text-success-700' : 'text-slate-400'}`}>
                {label}
            </span>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${checked
                ? 'bg-success text-white shadow-lg scale-110'
                : 'bg-slate-100 text-slate-300'
                }`}>
                {checked ? <Check size={24} strokeWidth={3} /> : <X size={24} strokeWidth={2} />}
            </div>
        </button>
    );
}
