import { Stethoscope, LayoutDashboard, Search, CalendarDays, HeartPulse, Pill, Activity, CalendarCheck, Video, ShieldCheck, Bot } from 'lucide-react'

export const APP = {
  key: 'medbook',
  name: 'MedBook',
  logo: Stethoscope,
  defaultTheme: 'light',
  defaultAccent: 3,
  demo: { name: 'Priya Raman', email: 'demo@medbook.app', password: 'Demo@1234' },
  hero: {
    title: 'Book trusted doctors in seconds. Track your health every day.',
    subtitle: 'Find specialists, pick a live time slot, consult in person or by video — and keep vitals, medicines and appointments in one calm, beautiful place.',
    features: [
      { icon: CalendarCheck, text: 'Real-time slot booking & rescheduling' },
      { icon: Video, text: 'In-clinic or video consultations' },
      { icon: HeartPulse, text: 'Vitals tracking with trend charts' },
      { icon: ShieldCheck, text: 'Private accounts with hashed passwords' },
    ],
  },
  nav: [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/doctors', label: 'Find Doctors', icon: Search },
    { to: '/appointments', label: 'Appointments', icon: CalendarDays },
    { to: '/vitals', label: 'Health Records', icon: Activity },
    { to: '/medicines', label: 'Medicines', icon: Pill },
    { to: '/symptoms', label: 'Symptom Guide', icon: Bot },
  ],
  notifications: ['Your next appointment reminder will appear on the dashboard', 'Log your vitals daily to see trends', 'Medicine reminders reset every day'],
}
