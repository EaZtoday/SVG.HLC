import React, { useState, useMemo } from 'react';
import BigButton from './ui/BigButton';
import BigInput from './ui/BigInput';
import ToggleCard from './ui/ToggleCard';
import SearchablePicker from './ui/SearchablePicker';
import { SPECIALTIES, DEFAULT_PRESENTERS, COOPERATION_STATUSES } from '../constants';
import { ArrowLeft, Save } from 'lucide-react';

export default function PresentationForm({ initialData, savedFacilities, savedPresenters, savedDoctors, onSubmit, onCancel }) {
    const [form, setForm] = useState(initialData);

    const handleChange = (name, value) => {
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.date || !form.facility || !form.specialty || form.specialty.length === 0) {
            alert("Please fill in Date, Facility, and at least one Specialty");
            return;
        }
        onSubmit(form);
    };

    return (
        <div className="max-w-3xl mx-auto pb-20">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={onCancel} className="p-3 bg-white rounded-full shadow hover:bg-slate-50">
                    <ArrowLeft size={32} className="text-slate-700" />
                </button>
                <h2 className="text-3xl font-bold text-slate-800">
                    {initialData.id ? 'Edit Presentation' : 'New Presentation'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
                <div className="ios-card space-y-10">
                    <h3 className="text-4xl font-black text-primary-600 border-b-8 border-primary-50 pb-6 mb-8 uppercase tracking-tighter">1. Hospital</h3>

                    <BigInput
                        label="Date"
                        id="date"
                        type="date"
                        value={form.date}
                        onChange={e => handleChange('date', e.target.value)}
                    />

                    <SearchablePicker
                        label="Facility"
                        placeholder="TAP TO SELECT HOSPITAL..."
                        options={savedFacilities}
                        value={form.facility}
                        onChange={val => handleChange('facility', val)}
                        allowCustom={true}
                    />

                    <SearchablePicker
                        label="Specialties"
                        placeholder="TAP TO SELECT SPECIALTIES..."
                        options={SPECIALTIES}
                        value={form.specialty}
                        onChange={val => handleChange('specialty', val)}
                        multiple={true}
                    />
                </div>

                <div className="ios-card space-y-10">
                    <h3 className="text-4xl font-black text-purple-600 border-b-8 border-purple-50 pb-6 mb-8 uppercase tracking-tighter">2. Doctor</h3>

                    <SearchablePicker
                        label="Doctor's Name"
                        placeholder="TAP TO SELECT DOCTOR..."
                        options={savedDoctors || []}
                        value={form.doctorName}
                        onChange={val => handleChange('doctorName', val)}
                        allowCustom={true}
                    />

                    <div>
                        <label className="granny-label">Cooperation Status</label>
                        <div className="grid grid-cols-1 gap-4">
                            {COOPERATION_STATUSES.map(status => (
                                <button
                                    key={status.value}
                                    type="button"
                                    onClick={() => handleChange('cooperationStatus', status.value)}
                                    className={`w-full p-8 rounded-[2rem] border-4 text-left text-2xl font-black transition-all active:scale-90 ${form.cooperationStatus === status.value
                                        ? 'bg-primary-600 border-primary-500 text-white shadow-2xl ring-8 ring-primary-100'
                                        : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
                                        }`}
                                >
                                    {status.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="ios-card space-y-10">
                    <h3 className="text-4xl font-black text-primary-600 border-b-8 border-primary-50 pb-6 mb-8 uppercase tracking-tighter">3. Format</h3>

                    <div className="grid grid-cols-1 gap-4">
                        <ToggleCard label="IN-PERSON" checked={form.inPerson} onChange={val => handleChange('inPerson', val)} />
                        <ToggleCard label="ONLINE / ZOOM" checked={form.online} onChange={val => handleChange('online', val)} />
                        <ToggleCard label="SISTERS PRESENT" checked={form.sisters} onChange={val => handleChange('sisters', val)} />
                        <ToggleCard label="POWERPOINT USED" checked={form.powerPoint} onChange={val => handleChange('powerPoint', val)} />
                    </div>

                    <BigInput
                        label="How many attendees?"
                        id="attendees"
                        type="number"
                        placeholder="TAP TO ENTER NUMBER..."
                        value={form.attendeeCount}
                        onChange={e => handleChange('attendeeCount', e.target.value)}
                    />
                </div>

                <div className="ios-card space-y-10">
                    <h3 className="text-4xl font-black text-primary-600 border-b-8 border-primary-50 pb-6 mb-8 uppercase tracking-tighter">4. Presenters</h3>
                    <div className="space-y-4">
                        <SearchablePicker
                            label="Presenter 1"
                            placeholder="TAP TO SELECT..."
                            options={[...new Set([...DEFAULT_PRESENTERS, ...savedPresenters])]}
                            value={form.presenter1}
                            onChange={val => handleChange('presenter1', val)}
                            allowCustom={true}
                        />
                        <SearchablePicker
                            label="Presenter 2"
                            placeholder="TAP TO SELECT..."
                            options={[...new Set([...DEFAULT_PRESENTERS, ...savedPresenters])]}
                            value={form.presenter2}
                            onChange={val => handleChange('presenter2', val)}
                            allowCustom={true}
                        />
                        <SearchablePicker
                            label="Presenter 3"
                            placeholder="TAP TO SELECT..."
                            options={[...new Set([...DEFAULT_PRESENTERS, ...savedPresenters])]}
                            value={form.presenter3}
                            onChange={val => handleChange('presenter3', val)}
                            allowCustom={true}
                        />
                    </div>
                </div>

                <div className="ios-card space-y-10">
                    <h3 className="text-4xl font-black text-primary-600 border-b-8 border-primary-50 pb-6 mb-8 uppercase tracking-tighter">5. Feedback</h3>

                    <div>
                        <label className="granny-label text-emerald-600">What went well?</label>
                        <textarea
                            className="ios-input min-h-[200px]"
                            placeholder="TAP TO TYPE POSITIVE NOTES..."
                            value={form.positiveExperience || ''}
                            onChange={e => handleChange('positiveExperience', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="granny-label text-danger">What could be improved?</label>
                        <textarea
                            className="ios-input min-h-[200px]"
                            placeholder="TAP TO TYPE NEGATIVE NOTES..."
                            value={form.negativeExperience || ''}
                            onChange={e => handleChange('negativeExperience', e.target.value)}
                        />
                    </div>
                </div>

                <div className="pt-8 space-y-8">
                    <BigButton type="submit" variant="primary" className="h-32 text-4xl bg-primary-600 border-primary-500 shadow-primary-500/50">
                        <Save size={48} strokeWidth={3} />
                        SAVE & FINISH
                    </BigButton>
                    <BigButton type="button" variant="secondary" onClick={onCancel} className="h-28 text-2xl border-transparent">
                        CANCEL
                    </BigButton>
                </div>
            </form>
        </div>
    );
}
