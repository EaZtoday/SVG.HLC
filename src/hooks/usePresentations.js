import { useState, useEffect, useMemo } from 'react';

const initialFormState = {
    date: '',
    facility: '',
    specialty: [],
    attendeeCount: '',
    sisters: false,
    inPerson: false,
    online: false,
    powerPoint: false,
    exhibitDisplay: false,
    cme: false,
    presenter1: '',
    presenter2: '',
    presenter3: '',
    positiveExperience: '',
    negativeExperience: '',
    lessonsLearned: '',
    doctorName: '',
    cooperationStatus: ''
};

export default function usePresentations() {
    const [presentations, setPresentations] = useState(() => {
        const saved = localStorage.getItem('presentations');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Migration: Ensure specialty is an array if it was a string
                return parsed.map(p => ({
                    ...p,
                    specialty: Array.isArray(p.specialty) ? p.specialty : (p.specialty ? [p.specialty] : [])
                }));
            } catch (e) {
                console.error("Failed to load presentations", e);
            }
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem('presentations', JSON.stringify(presentations));
    }, [presentations]);

    const addPresentation = (formData) => {
        const newPres = { ...formData, id: Date.now() };
        setPresentations(prev => [newPres, ...prev]);
        return newPres;
    };

    const updatePresentation = (id, formData) => {
        setPresentations(prev => prev.map(p => p.id === id ? { ...formData, id } : p));
    };

    const deletePresentation = (id) => {
        setPresentations(prev => prev.filter(p => p.id !== id));
    };

    // Derive unique saved facilities from history
    const savedFacilities = useMemo(() => {
        const facilities = new Set(presentations.map(p => p.facility).filter(Boolean));
        return Array.from(facilities).sort();
    }, [presentations]);

    const getStats = () => {
        return {
            total: presentations.length,
            totalAttendees: presentations.reduce((sum, p) => sum + (parseInt(p.attendeeCount) || 0), 0),
            inPerson: presentations.filter(p => p.inPerson).length,
            online: presentations.filter(p => p.online).length
        };
    };

    // Derive unique saved presenters from history
    const savedPresenters = useMemo(() => {
        const presenters = new Set();
        presentations.forEach(p => {
            if (p.presenter1) presenters.add(p.presenter1);
            if (p.presenter2) presenters.add(p.presenter2);
            if (p.presenter3) presenters.add(p.presenter3);
        });
        return Array.from(presenters).sort();
    }, [presentations]);

    // Derive unique saved doctor names from history
    const savedDoctors = useMemo(() => {
        const doctors = new Set(presentations.map(p => p.doctorName).filter(Boolean));
        return Array.from(doctors).sort();
    }, [presentations]);

    return {
        presentations,
        addPresentation,
        updatePresentation,
        deletePresentation,
        stats: getStats(),
        savedFacilities,
        savedPresenters,
        savedDoctors,
        initialFormState
    };
}
