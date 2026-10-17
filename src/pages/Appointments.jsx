import { useState } from 'react'
import { CalendarDays, X, RefreshCw, Download, Video, Star, CheckCheck } from 'lucide-react'
import { useHealth } from '../health.jsx'
import { DOCTORS } from '../data.js'
import { DocAvatar, SlotPicker } from '../components/Doctor.jsx'
import Modal from '../components/Modal.jsx'
import Empty from '../components/Empty.jsx'

const ics = (a, d) => {
  const start = `${a.date.replace(/-/g, '')}T${a.slot.replace(':', '')}00`
  const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT', `DTSTART:${start}`, `SUMMARY:Appointment with ${d.name}`, `LOCATION:${a.type === 'Video' ? 'Video consultation' : `${d.hospital}, ${d.city}`}`, `DESCRIPTION:${a.reason}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n')
  const el = document.createElement('a'); el.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar' })); el.download = 'medbook-appointment.ics'; el.click()
}

export default function Appointments() {
  const h = useHealth()
  const [tab, setTab] = useState('upcoming')
  const [resched, setResched] = useState(null)
  const [pick, setPick] = useState({ date: null, slot: null })
  const list = h.appts.filter((a) => a.status === tab).sort((a, b) => (tab === 'upcoming' ? 1 : -1) * `${a.date}${a.slot}`.localeCompare(`${b.date}${b.slot}`))
  const counts = Object.fromEntries(['upcoming', 'completed', 'cancelled'].map((s) => [s, h.appts.filter((a) => a.status === s).length]))
  const ra = resched && h.appts.find((a) => a.id === resched)

  return (
    <div className="col" style={{ gap: 18 }}>
      <div className="tabs">{['upcoming', 'completed', 'cancelled'].map((t) => <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>{t} ({counts[t]})</button>)}</div>
      {!list.length ? <Empty icon={CalendarDays} title={`No ${tab} appointments`} text="Your bookings will show up here." /> : (
        <div className="col stagger">{list.map((a) => { const d = DOCTORS.find((x) => x.id === a.doctorId); const dt = new Date(`${a.date}T${a.slot}`); return (
          <div key={a.id} className="card row wrap" style={{ gap: 16 }}>
            <div className="col" style={{ alignItems: 'center', minWidth: 70, padding: 10, borderRadius: 14, background: 'var(--bg-2)' }}><span className="xs muted">{dt.toLocaleDateString(undefined, { month: 'short' })}</span><b style={{ fontSize: '1.6rem' }}>{dt.getDate()}</b><span className="xs bold">{a.slot}</span></div>
            <DocAvatar d={d} size={50} />
            <div style={{ flex: 1, minWidth: 200 }}><b>{d.name}</b><div className="small" style={{ color: d.color }}>{d.specialty}</div><div className="xs muted">{a.type === 'Video' ? '📹 Video consultation' : `🏥 ${d.hospital}, ${d.city}`} · “{a.reason}”</div></div>
            <div className="row wrap">
              {tab === 'upcoming' && (<>
                {a.type === 'Video' && <button className="btn sm"><Video size={14} /> Join</button>}
                <button className="btn ghost sm" onClick={() => ics(a, d)}><Download size={14} /> .ics</button>
                <button className="btn ghost sm" onClick={() => { setResched(a.id); setPick({ date: null, slot: null }) }}><RefreshCw size={14} /> Reschedule</button>
                <button className="btn ghost sm" onClick={() => h.complete(a.id)}><CheckCheck size={14} /> Done</button>
                <button className="btn danger sm" onClick={() => confirm('Cancel this appointment?') && h.cancel(a.id)}><X size={14} /></button>
              </>)}
              {tab === 'completed' && <div className="row" style={{ gap: 2 }}>{[1, 2, 3, 4, 5].map((i) => <Star key={i} size={18} style={{ cursor: 'pointer' }} fill={(a.rating || 0) >= i ? '#fbbf24' : 'none'} color="#fbbf24" onClick={() => h.rateVisit(a.id, i)} />)}</div>}
              {tab === 'cancelled' && <span className="badge red">Cancelled</span>}
            </div>
          </div>) })}</div>
      )}
      {ra && (
        <Modal title="Reschedule appointment" onClose={() => setResched(null)} width={680}>
          <SlotPicker d={DOCTORS.find((x) => x.id === ra.doctorId)} value={pick} onChange={setPick} />
          <button className="btn block mt" disabled={!pick.slot} onClick={() => { h.reschedule(ra.id, pick.date, pick.slot); setResched(null) }}>Confirm new time</button>
        </Modal>
      )}
    </div>
  )
}
