import React, { useState } from 'react';
import usePresentations from './hooks/usePresentations';
import PresentationForm from './components/PresentationForm';
import PresentationList from './components/PresentationList';
import DoctorList from './components/DoctorList';
import DoctorDetail from './components/DoctorDetail';
import MissionDashboard from './components/MissionDashboard';
import BigButton from './components/ui/BigButton';
import { exportToCSV } from './utils/exportCSV';
import { aggregateDoctors } from './utils/aggregateDoctors';
import { PlusCircle, List, User, Download, Stethoscope, Activity, Target } from 'lucide-react';

import heroImage from './assets/images/medical-team.jpg';
import doctorImage from './assets/images/doctor-laptop.jpg';
import familyLogo from './assets/images/family-logo.png';


function App() {
  const {
    presentations,
    addPresentation,
    updatePresentation,
    deletePresentation,
    initialFormState,
    stats,
    savedFacilities,
    savedPresenters,
    savedDoctors
  } = usePresentations();

  const [view, setView] = useState('home'); // home, list, form, doctors, doctor-detail
  const [editingItem, setEditingItem] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const startAdd = () => {
    setEditingItem(null);
    setView('form');
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setView('form');
  };

  const handleSave = (formData) => {
    if (editingItem) {
      updatePresentation(editingItem.id, formData);
    } else {
      addPresentation(formData);
    }
    setView('list');
  };

  const currentDoctors = aggregateDoctors(presentations);

  // Strategic Metrics
  const cooperativeDoctors = currentDoctors.filter(d => d.status === 'cooperative');
  const targetSpecialties = ['Hematology', 'Oncology', 'Gynecologic Oncology', 'Radiation Oncology'];
  const hemoOncoDoctors = currentDoctors.filter(d =>
    d.specialties.some(s => targetSpecialties.includes(s))
  );
  const hemoOncoCooperative = hemoOncoDoctors.filter(d => d.status === 'cooperative');

  const handleSelectDoctor = (doc) => {
    setSelectedDoctor(doc);
    setView('doctor-detail');
  };

  if (view === 'form') {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <PresentationForm
          initialData={editingItem || initialFormState}
          savedFacilities={savedFacilities}
          savedPresenters={savedPresenters}
          savedDoctors={savedDoctors}
          onSubmit={handleSave}
          onCancel={() => setView(editingItem ? 'list' : 'home')}
        />
      </div>
    );
  }

  if (view === 'list') {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <PresentationList
          presentations={presentations}
          onEdit={startEdit}
          onDelete={deletePresentation}
          onBack={() => setView('home')}
          onAdd={startAdd}
        />
      </div>
    );
  }

  if (view === 'doctors') {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="max-w-3xl mx-auto mb-4">
          <button onClick={() => setView('home')} className="p-3 bg-white rounded-full shadow hover:bg-slate-50 mb-4 inline-block">
            <User size={28} className="text-slate-700" />
          </button>
        </div>
        <DoctorList
          doctors={currentDoctors}
          onSelectDoctor={handleSelectDoctor}
        />
      </div>
    );
  }

  if (view === 'doctor-detail' && selectedDoctor) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <DoctorDetail
          doctor={selectedDoctor}
          onBack={() => setView('doctors')}
        />
      </div>
    );
  }

  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-primary-50 p-4">
        <MissionDashboard
          presentations={presentations}
          cooperativeDoctors={cooperativeDoctors}
          hemoOncoCooperative={hemoOncoCooperative}
          onBack={() => setView('home')}
        />
      </div>
    );
  }

  // Home View
  return (
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col items-center p-0 pb-20">
      {/* Hero Section - Refined Apple Style */}
      <div className="w-full h-72 sm:h-96 relative mb-8 overflow-hidden rounded-b-[3rem] shadow-xl">
        <img
          src={heroImage}
          alt="Medical Team"
          className="w-full h-full object-cover brightness-90 animate-subtle-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end justify-center pb-10">
          <div className="text-center text-white px-6 flex flex-col items-center gap-4">
            <div className="bg-white/20 backdrop-blur-xl p-4 rounded-3xl border border-white/30 shadow-glass animate-in zoom-in-75 duration-700">
              <img src={familyLogo} alt="Logo" className="w-14 h-14 brightness-0 invert" />
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tightest drop-shadow-lg leading-tight">
                Presentation Tracker
              </h1>
              <p className="text-lg opacity-90 font-bold tracking-[0.2em] uppercase">St. Vincent HLC</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md px-6 space-y-6">
        <div className="space-y-4">
          <BigButton onClick={startAdd} className="bg-emerald-600 text-white h-24 text-2xl">
            <PlusCircle size={32} strokeWidth={2.5} />
            Add New Presentation
          </BigButton>

          <BigButton onClick={() => setView('dashboard')} className="bg-primary-600 text-white h-24 text-2xl">
            <Target size={32} strokeWidth={2.5} />
            Goal Tracker
          </BigButton>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <BigButton onClick={() => setView('list')} variant="secondary" className="h-28 text-lg gap-2">
            <List size={28} />
            View Activity
          </BigButton>
          <BigButton onClick={() => setView('doctors')} variant="secondary" className="h-28 text-lg gap-2">
            <Stethoscope size={28} />
            Conversations with Doctors
          </BigButton>
        </div>

        <BigButton
          onClick={() => exportToCSV(presentations)}
          variant="secondary"
          className="h-20 bg-amber-50/50 border-amber-100 text-amber-900 text-lg"
        >
          <Download size={24} />
          Download Spreadsheet
        </BigButton>

        <div className="p-12 text-center opacity-20 mt-4 flex flex-col items-center gap-4">
          <img src={familyLogo} className="w-20 h-20" alt="" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">St. Vincent HLC 2026</p>
        </div>
      </div>
    </div>
  );
}

export default App;
