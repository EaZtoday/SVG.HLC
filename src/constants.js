export const SPECIALTIES = [
    "Administration - Ethics", "Administration - Other", "Administration - Risk Management",
    "Anesthesiology", "Burn Care", "Cardiac Surgery", "Colon and Rectal Surgery",
    "Critical Care/Intensive Care", "Emergency Medicine", "Emergency Medicine (Pre-Hospital EMS)",
    "Gastroenterology", "General Surgery", "Gynecologic Oncology", "Gynecology", "Hematology",
    "Hospital Medicine", "Internal Medicine", "Interventional Radiology", "Laborist",
    "Legal - CPS", "Legal - Judge", "Legal - Other", "Medical Examiner/Coroner",
    "Neonatology", "Nephrology", "Neurology", "Neurosurgery", "OB/GYN",
    "Oncology", "Ophthalmology", "Oral & Maxillofacial Surgery", "Orthopedic Surgery",
    "Otolaryngology (Head and Neck Surgery)", "Pain Management", "Palliative Care",
    "Pathology", "Pediatric Surgery", "Pediatrics", "Physical Medicine & Rehabilitation",
    "Plastic Surgery", "Podiatry", "Psychiatry", "Pulmonology", "Radiation Oncology",
    "Radiology", "Rheumatology", "Sports Medicine", "Thoracic Surgery", "Transplant Surgery",
    "Trauma Surgery", "Urgent Care", "Urology", "Vascular Surgery", "Wound Care"
];

export const DEFAULT_PRESENTERS = [
    "Arnold John",
    "Kyle Zarnoff",
    "David Jocelyn",
    "Paul Jocelyn"
];

export const COOPERATION_STATUSES = [
    { value: 'cooperative', label: '✅ Cooperative - Add to list', color: 'emerald' },
    { value: 'followup', label: '🔄 Follow-up Needed', color: 'amber' },
    { value: 'undetermined', label: '⏳ Undetermined', color: 'slate' },
    { value: 'not_favorable', label: '⚠️ Not Favorable - Steer clear', color: 'red' }
];

export const SMART_GOALS_2026 = [
    {
        id: 'presentations',
        title: 'Presentations',
        description: '6-9 total presentations (target last year or higher)',
        target: 8,
        unit: 'presentations',
        category: 'Outreach',
        priority: 'high',
        criteria: { type: 'total_presentations' }
    },
    {
        id: 'cdl-doctors',
        title: 'CDL Doctors',
        description: 'Add 3-4 doctors (Hemo/Onco focus)',
        target: 4,
        unit: 'doctors',
        category: 'Medical',
        priority: 'high',
        criteria: {
            type: 'doctor_specialty',
            specialties: ['Hematology', 'Oncology', 'Gynecologic Oncology', 'Radiation Oncology']
        }
    },
    {
        id: 'georgetown',
        title: 'Georgetown Staff',
        description: 'Large presentations to doctors & nursing staff',
        target: 2,
        unit: 'sessions',
        category: 'Outreach',
        priority: 'medium',
        criteria: { type: 'facility_match', name: 'Georgetown' }
    },
    {
        id: 'med-outreach',
        title: 'Medical Schools',
        description: 'St. James, Trinity, ASU, Nursing Schools',
        target: 4,
        unit: 'schools',
        category: 'Academic',
        priority: 'medium',
        criteria: {
            type: 'facility_match',
            names: ['St. James', 'Trinity', 'ASU', 'Nursing School']
        }
    },
    {
        id: 'peds-docs',
        title: 'Pediatric Doctors',
        description: 'Add 5+ pediatricians (Target 10 contacted)',
        target: 5,
        unit: 'doctors',
        category: 'Medical',
        priority: 'high',
        criteria: { type: 'doctor_specialty', specialties: ['Pediatrics', 'Pediatric Surgery'] }
    },
    {
        id: 'clinical-strategies',
        title: 'Clinical Strategies',
        description: 'Master 2 clinical strategies (2hrs/week)',
        target: 2,
        unit: 'strategies',
        category: 'Personal',
        priority: 'medium',
        criteria: { type: 'manual' }
    }
];
