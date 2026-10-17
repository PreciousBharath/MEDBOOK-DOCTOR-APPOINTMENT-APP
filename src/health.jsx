import { createContext, useContext } from 'react'
import { useAuth } from './auth.jsx'
import { useUserState, uid } from './storage.js'
import { useToast } from './toast.jsx'
import { DOCTORS, dayKey } from './data.js'

const Ctx = createContext(null)
const daysFromNow = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return dayKey(d) }
const demoVitals = () => Array.from({ length: 14 }, (_, i) => ({
  id: uid(), date: daysFromNow(i - 13), sys: 118 + Math.round(Math.sin(i / 2) * 6 + Math.random() * 6), dia: 76 + Math.round(Math.random() * 6),
  sugar: 92 + Math.round(Math.random() * 22), weight: +(64.8 - i * 0.08 + Math.random() * 0.3).toFixed(1), hr: 68 + Math.round(Math.random() * 10),
}))

export function HealthProvider({ children }) {
  const { user } = useAuth()
  const notify = useToast()
  const demo = user?.id === 'demo'
  const [appts, setAppts] = useUserState(user, 'appointments', demo ? [
    { id: 'p1', doctorId: 'd2', date: daysFromNow(1), slot: '10:30', type: 'In-clinic', reason: 'Routine heart check-up', status: 'upcoming', createdAt: Date.now() },
    { id: 'p2', doctorId: 'd1', date: daysFromNow(4), slot: '17:00', type: 'Video', reason: 'Follow-up on seasonal fever', status: 'upcoming', createdAt: Date.now() },
    { id: 'p3', doctorId: 'd3', date: daysFromNow(-9), slot: '11:00', type: 'In-clinic', reason: 'Skin allergy', status: 'completed', createdAt: Date.now(), rating: 5 },
  ] : [])
  const [vitals, setVitals] = useUserState(user, 'vitals', demo ? demoVitals() : [])
  const [meds, setMeds] = useUserState(user, 'meds', demo ? [
    { id: 'm1', name: 'Vitamin D3', dose: '1 tablet', times: ['08:00'], color: '#f59e0b' },
    { id: 'm2', name: 'Omega-3', dose: '1 capsule', times: ['13:00'], color: '#06b6d4' },
    { id: 'm3', name: 'Iron supplement', dose: '1 tablet', times: ['08:00', '20:00'], color: '#ef4444' },
  ] : [])
  const [taken, setTaken] = useUserState(user, 'taken', {})
  const [favs, setFavs] = useUserState(user, 'favDoctors', demo ? ['d2'] : [])

  const book = (a) => {
    const appt = { id: uid(), status: 'upcoming', createdAt: Date.now(), ...a }
    setAppts([appt, ...appts])
    const d = DOCTORS.find((x) => x.id === a.doctorId)
    notify(`Appointment confirmed with ${d.name} ✅`, 'success')
    return appt
  }
  const today = dayKey(new Date())
  const value = {
    appts, vitals, meds, favs,
    book,
    cancel: (id) => { setAppts(appts.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))); notify('Appointment cancelled') },
    reschedule: (id, date, slot) => { setAppts(appts.map((a) => (a.id === id ? { ...a, date, slot } : a))); notify('Appointment rescheduled', 'success') },
    complete: (id) => setAppts(appts.map((a) => (a.id === id ? { ...a, status: 'completed' } : a))),
    rateVisit: (id, rating) => setAppts(appts.map((a) => (a.id === id ? { ...a, rating } : a))),
    addVital: (v) => { setVitals([...vitals, { id: uid(), ...v }].sort((a, b) => a.date.localeCompare(b.date))); notify('Vitals saved', 'success') },
    deleteVital: (id) => setVitals(vitals.filter((v) => v.id !== id)),
    addMed: (m) => { setMeds([...meds, { id: uid(), ...m }]); notify('Reminder added', 'success') },
    deleteMed: (id) => setMeds(meds.filter((m) => m.id !== id)),
    takenToday: taken[today] || {},
    toggleTaken: (key) => setTaken({ ...taken, [today]: { ...(taken[today] || {}), [key]: !(taken[today] || {})[key] } }),
    toggleFav: (id) => setFavs(favs.includes(id) ? favs.filter((x) => x !== id) : [...favs, id]),
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useHealth = () => useContext(Ctx)
