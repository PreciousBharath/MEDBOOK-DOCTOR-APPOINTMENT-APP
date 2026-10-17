import { useState } from 'react'
import { Star, MapPin, Video, Heart, Languages, BadgeCheck, CheckCircle2, Building2 } from 'lucide-react'
import Modal from './Modal.jsx'
import { useHealth } from '../health.jsx'
import { SLOTS, isTaken, nextDays, dayKey } from '../data.js'

export const DocAvatar = ({ d, size = 56 }) => (
  <div style={{ width: size, height: size, borderRadius: size / 3, flexShrink: 0, display: 'grid', placeItems: 'center', fontSize: size * 0.45,
    background: `linear-gradient(135deg, color-mix(in srgb, ${d.color} 35%, transparent), color-mix(in srgb, ${d.color} 10%, transparent))`, border: `2px solid color-mix(in srgb, ${d.color} 40%, transparent)` }}>{d.icon}</div>
)

export function DoctorCard({ d, onBook }) {
  const { favs, toggleFav } = useHealth()
  return (
    <div className="card hover col" style={{ gap: 12 }}>
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <DocAvatar d={d} />
        <div style={{ flex: 1 }}>
          <div className="row between"><b className="row" style={{ gap: 4 }}>{d.name} <BadgeCheck size={16} color="var(--accent)" /></b>
            <button className="btn ghost icon sm" onClick={() => toggleFav(d.id)}><Heart size={15} fill={favs.includes(d.id) ? 'var(--danger)' : 'none'} color={favs.includes(d.id) ? 'var(--danger)' : 'currentColor'} /></button></div>
          <div className="small" style={{ color: d.color, fontWeight: 700 }}>{d.specialty}</div>
          <div className="xs muted">{d.degrees} · {d.exp} yrs experience</div>
        </div>
      </div>
      <div className="row wrap small muted" style={{ gap: 12 }}>
        <span className="row" style={{ gap: 4 }}><Star size={14} fill="#fbbf24" color="#fbbf24" />{d.rating} ({d.reviews})</span>
        <span className="row" style={{ gap: 4 }}><MapPin size={14} />{d.city}</span>
        {d.video && <span className="row" style={{ gap: 4, color: 'var(--success)' }}><Video size={14} />Video</span>}
      </div>
      <div className="row between"><span><b style={{ fontSize: '1.15rem' }}>₹{d.fee}</b> <span className="xs muted">/ consult</span></span><button className="btn sm" onClick={() => onBook(d.id)}>Book now</button></div>
    </div>
  )
}

export function SlotPicker({ d, value, onChange, booked = [] }) {
  const days = nextDays(10)
  const now = new Date()
  return (
    <div className="col">
      <div className="h-strip">{days.map((day) => {
        const k = dayKey(day), works = d.workDays.includes(day.getDay())
        return (
          <button key={k} disabled={!works} className={`date-pill ${value.date === k ? 'active' : ''}`} onClick={() => onChange({ date: k, slot: null })}>
            <span className="xs">{day.toLocaleDateString(undefined, { weekday: 'short' })}</span><b style={{ fontSize: '1.2rem' }}>{day.getDate()}</b><span className="xs">{works ? day.toLocaleDateString(undefined, { month: 'short' }) : 'Off'}</span>
          </button>)
      })}</div>
      {value.date && (
        <div className="slot-grid fade-up">{SLOTS.map((sl) => {
          const past = value.date === dayKey(now) && sl <= `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
          const taken = isTaken(d.id, value.date, sl) || booked.some((b) => b.date === value.date && b.slot === sl) || past
          return <button key={sl} disabled={taken} className={`slot ${value.slot === sl ? 'active' : ''}`} onClick={() => onChange({ ...value, slot: sl })}>{sl}</button>
        })}</div>
      )}
    </div>
  )
}

export function BookingModal({ id, doctors, onClose }) {
  const { book, appts } = useHealth()
  const d = doctors.find((x) => x.id === id)
  const [pick, setPick] = useState({ date: null, slot: null })
  const [type, setType] = useState('In-clinic')
  const [reason, setReason] = useState('')
  const [done, setDone] = useState(null)
  const mine = appts.filter((a) => a.doctorId === id && a.status === 'upcoming')

  if (done) return (
    <Modal title="" onClose={onClose}>
      <div className="col" style={{ alignItems: 'center', textAlign: 'center', gap: 12, padding: '10px 0 20px' }}>
        <div className="success-check"><CheckCircle2 size={70} color="var(--success)" /></div>
        <h2 style={{ fontWeight: 800 }}>Appointment booked!</h2>
        <p className="muted">{d.name} · {new Date(done.date).toDateString()} at {done.slot} · {done.type}</p>
        <div className="badge green">Booking ID #{done.id.toUpperCase()}</div>
        <button className="btn" onClick={onClose}>Done</button>
      </div>
    </Modal>
  )

  return (
    <Modal title="" onClose={onClose} width={720}>
      <div className="row" style={{ marginTop: -36, alignItems: 'flex-start' }}>
        <DocAvatar d={d} size={76} />
        <div className="col" style={{ gap: 4 }}>
          <h2 style={{ fontWeight: 800 }}>{d.name}</h2>
          <div style={{ color: d.color, fontWeight: 700 }}>{d.specialty} · {d.degrees}</div>
          <div className="row wrap small muted" style={{ gap: 12 }}><span className="row" style={{ gap: 4 }}><Building2 size={14} />{d.hospital}, {d.city}</span><span className="row" style={{ gap: 4 }}><Languages size={14} />{d.langs.join(', ')}</span><span className="row" style={{ gap: 4 }}><Star size={14} fill="#fbbf24" color="#fbbf24" />{d.rating}</span></div>
        </div>
      </div>
      <p className="muted small mt">{d.about}</p>
      <div className="mt section-title">1 · Choose date & time</div>
      <SlotPicker d={d} value={pick} onChange={setPick} booked={mine} />
      <div className="mt section-title">2 · Consultation details</div>
      <div className="tabs mb">{['In-clinic', 'Video'].map((t) => <button key={t} disabled={t === 'Video' && !d.video} className={type === t ? 'active' : ''} onClick={() => setType(t)}>{t === 'Video' ? '📹 ' : '🏥 '}{t}</button>)}</div>
      <textarea className="input" rows="2" placeholder="Reason for visit (symptoms, follow-up…)" value={reason} onChange={(e) => setReason(e.target.value)} />
      <div className="card mt row between wrap" style={{ background: 'var(--bg-2)' }}>
        <div className="small">{pick.slot ? <>📅 <b>{new Date(pick.date).toDateString()}</b> at <b>{pick.slot}</b> · {type}</> : <span className="muted">Select a date and an available slot</span>}<div className="xs muted">Consultation fee ₹{d.fee} · pay at clinic</div></div>
        <button className="btn" disabled={!pick.slot || !reason.trim()} onClick={() => setDone(book({ doctorId: id, ...pick, type, reason }))}>Confirm booking</button>
      </div>
    </Modal>
  )
}
