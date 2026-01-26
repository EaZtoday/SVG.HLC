/**
 * Export presentations to CSV format matching the original spreadsheet columns
 */
export function exportToCSV(presentations) {
    const headers = [
        'Date',
        'Facility',
        'Specialty',
        'Attendee Count',
        'Sisters',
        'In-Person',
        'Online',
        'PowerPoint',
        'Exhibit Display',
        'CME',
        'HLC',
        'Presenter 1',
        'Presenter 2',
        'Presenter 3',
        'Doctor Name',
        'Cooperation Status'
    ];

    const rows = presentations.map(p => [
        p.date || '',
        p.facility || '',
        Array.isArray(p.specialty) ? p.specialty.join('; ') : (p.specialty || ''),
        p.attendeeCount || '',
        p.sisters ? 'Yes' : 'No',
        p.inPerson ? 'Yes' : 'No',
        p.online ? 'Yes' : 'No',
        p.powerPoint ? 'Yes' : 'No',
        p.exhibitDisplay ? 'Yes' : 'No',
        p.cme ? 'Yes' : 'No',
        p.hlcName || 'St Vincent HLC',
        p.presenter1 || '',
        p.presenter2 || '',
        p.presenter3 || '',
        p.doctorName || '',
        p.cooperationStatus || ''
    ]);

    // Escape CSV values (handle commas, quotes, newlines)
    const escapeCSV = (val) => {
        const str = String(val);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    const csvContent = [
        headers.map(escapeCSV).join(','),
        ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\n');

    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const today = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `presentations_export_${today}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
