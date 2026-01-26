import React from 'react';
import BigButton from './ui/BigButton';
import { Edit2, Trash2, ArrowLeft, Plus } from 'lucide-react';

export default function PresentationList({ presentations, onEdit, onDelete, onBack, onAdd }) {
    return (
        <div className="max-w-3xl mx-auto pb-20">
            <div className="sticky top-0 bg-slate-50 pt-4 pb-4 z-10 flex items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-3 bg-white rounded-full shadow hover:bg-slate-100">
                        <ArrowLeft size={28} className="text-slate-700" />
                    </button>
                    <h2 className="text-3xl font-bold text-slate-800">History</h2>
                </div>
                <button
                    onClick={onAdd}
                    className="bg-primary-600 text-white px-6 py-2 rounded-xl font-bold shadow-md flex items-center gap-2 hover:bg-primary-700 active:scale-95 transition-transform"
                >
                    <Plus size={24} /> New
                </button>
            </div>

            {presentations.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
                    <div className="text-6xl mb-6">📭</div>
                    <h3 className="text-2xl font-bold text-slate-700 mb-2">No presentations yet</h3>
                    <p className="text-slate-500 text-lg">Tap "New" to add one!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {presentations.map(p => (
                        <div key={p.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-primary-700 font-bold text-lg">
                                        {new Date(p.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <div className="text-2xl font-bold text-slate-800 leading-tight my-1">{p.facility}</div>
                                    <div className="text-lg text-slate-600">
                                        {Array.isArray(p.specialty) ? p.specialty.join(', ') : p.specialty}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 flex-wrap mt-1">
                                {p.inPerson && <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg text-sm font-bold">In-Person</span>}
                                {p.online && <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-bold">Online</span>}
                                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-sm font-bold">{p.attendeeCount || 0} Attendees</span>
                            </div>

                            <div className="flex gap-3 mt-2 pt-3 border-t border-slate-50">
                                <button
                                    onClick={() => onEdit(p)}
                                    className="flex-1 bg-indigo-50 text-indigo-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-100"
                                >
                                    <Edit2 size={20} /> Edit
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirm('Delete this presentation?')) onDelete(p.id);
                                    }}
                                    className="flex-1 bg-red-50 text-red-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100"
                                >
                                    <Trash2 size={20} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
