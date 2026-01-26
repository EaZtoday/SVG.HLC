/**
 * Derives a list of unique doctor profiles from the presentation history.
 * Aggregates all interactions, finding the latest status and most used facility.
 */
export function aggregateDoctors(presentations) {
    const doctorsMap = new Map();

    // Sort presentations by date desc (newest first) to easily find "latest" info
    const sorted = [...presentations].sort((a, b) => new Date(b.date) - new Date(a.date));

    sorted.forEach(p => {
        if (!p.doctorName) return;

        if (!doctorsMap.has(p.doctorName)) {
            doctorsMap.set(p.doctorName, {
                name: p.doctorName,
                latestFacility: p.facility,
                specialties: new Set(),
                status: p.cooperationStatus || 'undetermined',
                lastInteractionDate: p.date,
                interactionCount: 0,
                interactions: []
            });
        }

        const doc = doctorsMap.get(p.doctorName);

        // Add interactions
        doc.interactions.push({
            id: p.id,
            date: p.date,
            facility: p.facility,
            status: p.cooperationStatus,
            notes: [p.positiveExperience, p.negativeExperience, p.lessonsLearned].filter(Boolean).join('\n')
        });

        // Aggregate stats
        doc.interactionCount++;
        if (Array.isArray(p.specialty)) {
            p.specialty.forEach(s => doc.specialties.add(s));
        } else if (p.specialty) {
            doc.specialties.add(p.specialty);
        }
    });

    return Array.from(doctorsMap.values()).map(doc => ({
        ...doc,
        specialties: Array.from(doc.specialties)
    }));
}
