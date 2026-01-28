import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';

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
    const [presentations, setPresentations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load presentations from Supabase on mount
    useEffect(() => {
        loadPresentations();
    }, []);

    const loadPresentations = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('presentations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Transform data to match your format
            const transformed = (data || []).map(p => ({
                ...p,
                specialty: Array.isArray(p.specialty) ? p.specialty : (p.specialty ? [p.specialty] : []),
                sisters: p.sisters || false,
                inPerson: p.inPerson || false,
                online: p.online || false,
                powerPoint: p.powerPoint || false,
                exhibitDisplay: p.exhibitDisplay || false,
                cme: p.cme || false
            }));

            setPresentations(transformed);
        } catch (error) {
            console.error('Error loading presentations:', error);
        } finally {
            setLoading(false);
        }
    };

    const addPresentation = async (formData) => {
        try {
            const { data, error } = await supabase
                .from('presentations')
                .insert([formData])
                .select()
                .single();

            if (error) throw error;

            const newPres = {
                ...data,
                specialty: Array.isArray(data.specialty) ? data.specialty : (data.specialty ? [data.specialty] : [])
            };
            
            setPresentations(prev => [newPres, ...prev]);
            return newPres;
        } catch (error) {
            console.error('Error adding presentation:', error);
            throw error;
        }
    };

    const updatePresentation = async (id, formData) => {
        try {
            const { error } = await supabase
                .from('presentations')
                .update(formData)
                .eq('id', id);

            if (error) throw error;

            setPresentations(prev => prev.map(p => p.id === id ? { ...formData, id } : p));
        } catch (error) {
            console.error('Error updating presentation:', error);
            throw error;
        }
    };

    const deletePresentation = async (id) => {
        try {
            const { error } = await supabase
                .from('presentations')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setPresentations(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error deleting presentation:', error);
            throw error;
        }
    };

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

    const savedPresenters = useMemo(() => {
        const presenters = new Set();
        presentations.forEach(p => {
            if (p.presenter1) presenters.add(p.presenter1);
            if (p.presenter2) presenters.add(p.presenter2);
            if (p.presenter3) presenters.add(p.presenter3);
        });
        return Array.from(presenters).sort();
    }, [presentations]);

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
        initialFormState,
        loading
    };
}