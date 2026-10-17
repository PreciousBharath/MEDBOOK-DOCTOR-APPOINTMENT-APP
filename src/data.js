export const SPECIALTIES = [
  { id: 'General Physician', icon: '🩺', color: '#10b981' }, { id: 'Cardiologist', icon: '❤️', color: '#ef4444' },
  { id: 'Dermatologist', icon: '🧴', color: '#f59e0b' }, { id: 'Pediatrician', icon: '🧸', color: '#ec4899' },
  { id: 'Orthopedic', icon: '🦴', color: '#64748b' }, { id: 'Neurologist', icon: '🧠', color: '#8b5cf6' },
  { id: 'Dentist', icon: '🦷', color: '#06b6d4' }, { id: 'ENT Specialist', icon: '👂', color: '#f97316' },
  { id: 'Gynecologist', icon: '🌸', color: '#d946ef' }, { id: 'Ophthalmologist', icon: '👁️', color: '#3b82f6' },
  { id: 'Psychiatrist', icon: '🌿', color: '#14b8a6' }, { id: 'Dietitian', icon: '🥗', color: '#84cc16' },
]
const FN = ['Anitha', 'Rahul', 'Meera', 'Vikram', 'Sneha', 'Arjun', 'Kavya', 'Suresh', 'Divya', 'Karthik', 'Lakshmi', 'Nikhil', 'Pooja', 'Ramesh', 'Shalini', 'Varun', 'Deepa', 'Harish', 'Nisha', 'Ajay', 'Revathi', 'Sanjay', 'Fathima', 'Joseph']
const LN = ['Krishnan', 'Mehta', 'Iyer', 'Reddy', 'Nair', 'Gupta', 'Subramanian', 'Das', 'Pillai', 'Shetty', 'Rao', 'Menon']
const HOSP = ['Apollo Care Clinic', 'Sunrise Multispeciality', 'GreenLeaf Hospital', 'CityCare Medical Centre', 'Lotus Health Hub', 'Meenakshi Wellness']
const CITIES = ['Madurai', 'Chennai', 'Bengaluru', 'Coimbatore', 'Hyderabad']
const LANGS = ['English', 'Tamil', 'Hindi', 'Telugu', 'Malayalam', 'Kannada']

let s = 99
const r = () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }

export const DOCTORS = FN.map((fn, i) => {
  const sp = SPECIALTIES[i % SPECIALTIES.length]
  return {
    id: `d${i + 1}`, name: `Dr. ${fn} ${LN[Math.floor(r() * LN.length)]}`, specialty: sp.id, icon: sp.icon, color: sp.color,
    exp: 4 + Math.floor(r() * 22), fee: 300 + Math.floor(r() * 12) * 100, rating: +(3.9 + r() * 1.1).toFixed(1), reviews: 40 + Math.floor(r() * 900),
    hospital: HOSP[Math.floor(r() * HOSP.length)], city: CITIES[Math.floor(r() * CITIES.length)],
    langs: ['English', LANGS[1 + Math.floor(r() * 5)]], video: r() > 0.3, gender: i % 3 === 1 ? 'Male' : 'Female',
    degrees: ['MBBS', ['MD', 'MS', 'DNB', 'BDS', 'MCh'][Math.floor(r() * 5)]].join(', '),
    about: `Experienced ${sp.id.toLowerCase()} focused on evidence-based, patient-first care with a warm, unhurried consultation style.`,
    workDays: [1, 2, 3, 4, 5, 6].filter(() => r() > 0.2),
  }
})

export const SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '18:00', '18:30']

/** Deterministic “already booked by others” slots so availability feels real. */
export const isTaken = (docId, date, slot) => {
  const h = [...`${docId}${date}${slot}`].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)
  return h % 100 < 30
}

export const dayKey = (d) => d.toISOString().slice(0, 10)
export const nextDays = (n = 10) => Array.from({ length: n }, (_, i) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + i); return d })

export const SYMPTOMS = [
  { s: 'Fever', sp: ['General Physician', 'Pediatrician'] }, { s: 'Chest pain', sp: ['Cardiologist'], urgent: true },
  { s: 'Palpitations', sp: ['Cardiologist'] }, { s: 'Skin rash', sp: ['Dermatologist'] }, { s: 'Acne', sp: ['Dermatologist'] },
  { s: 'Joint pain', sp: ['Orthopedic'] }, { s: 'Back pain', sp: ['Orthopedic', 'General Physician'] },
  { s: 'Headache', sp: ['Neurologist', 'General Physician'] }, { s: 'Dizziness', sp: ['Neurologist', 'ENT Specialist'] },
  { s: 'Toothache', sp: ['Dentist'] }, { s: 'Ear pain', sp: ['ENT Specialist'] }, { s: 'Sore throat', sp: ['ENT Specialist', 'General Physician'] },
  { s: 'Blurred vision', sp: ['Ophthalmologist'] }, { s: 'Anxiety', sp: ['Psychiatrist'] }, { s: 'Poor sleep', sp: ['Psychiatrist', 'General Physician'] },
  { s: 'Weight management', sp: ['Dietitian'] }, { s: 'Cough', sp: ['General Physician'] }, { s: 'Shortness of breath', sp: ['General Physician', 'Cardiologist'], urgent: true },
  { s: 'Child vaccination', sp: ['Pediatrician'] }, { s: 'Irregular periods', sp: ['Gynecologist'] },
]
