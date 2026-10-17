import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts'
import { CalendarClock, HeartPulse, Droplet, Scale, Pill, Video, ArrowRight } from 'lucide-react'
import { useHealth } from '../health.jsx'
import { useAuth } from '../auth.jsx'
import { DOCTORS, SPECIALTIES } from '../data.js'
import { DocAvatar } from '../components/Doctor.jsx'

const tip = { background: 'var(--card-solid)', border: '1px solid var(--border)', borderRadius: 12 }

function Countdown({ to }) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t) }, [])
  const diff = Math.max(0, to - now)
  const parts = [[Math.floor(diff / 86400000), 'days'], [Math.floor(diff / 3600000) % 24, 'hrs'], [Math.floor(diff / 60000) % 60, 'min'], [Math.floor(diff / 1000) % 60, 'sec']]
  return <div className="row" style={{ gap: 8 }}>{parts.map(([v, l]) => <div key={l} style={{ background: 'rgba(255,255,255,.18)', borderRadius: 12, padding: '8px 12px', textAlign: 'center', minWidth: 58 }}><div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{String(v).padStart(2, '0')}</div><div className="xs">{l}</div></div>)}</div>
}

export default function Dashboard() {
  const h = useHealth()
  const { user } = useAuth()
  const upcoming = h.appts.filter((a) => a.status === 'upcoming').sort((a, b) => `${a.date}${a.slot}`.localeCompare(`${b.date}${b.slot}`))
  const next = upcoming[0]
  const nd = next && DOCTORS.find((d) => d.id === next.doctorId)
  const last = h.vitals[h.vitals.length - 1]
  const doses = h.meds.flatMap((m) => m.times.map((t) => `${m.id}@${t}`))
  const takenN = doses.filter((k) => h.takenToday[k]).length

  const Vital = ({ icon: Icon, label, value, unit, k, color }) => (
    <div className="card hover col" style={{ gap: 6 }}>
      <div className="row between"><span className="row small muted"><Icon size={16} color={color} />{label}</span></div>
      <div><span style={{ fontSize: '1.6rem', fontWeight: 800 }}>{value ?? '—'}</span> <span className="small muted">{unit}</span></div>
      <div style={{ height: 50 }}><ResponsiveContainer><LineChart data={h.vitals.slice(-10)}><YAxis hide domain={['dataMin - 3', 'dataMax + 3']} /><Tooltip contentStyle={tip} /><Line type="monotone" dataKey={k} stroke={color} strokeWidth={2.5} dot={false} /></LineChart></ResponsiveContainer></div>
    </div>
  )

  return (
    <div className="col" style={{ gap: 20 }}>
      <div className="card fade-up row wrap between" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: '#fff', gap: 20 }}>
        <div className="col" style={{ gap: 10 }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>Hello, {user.name.split(' ')[0]} 💚</div>
          {next ? (<>
            <div className="row"><DocAvatar d={nd} size={46} /><div><b>Next: {nd.name}</b><div className="small" style={{ opacity: 0.9 }}>{nd.specialty} · {new Date(next.date).toDateString()} at {next.slot} · {next.type}</div></div></div>
            <Countdown to={new Date(`${next.date}T${next.slot}:00`).getTime()} />
          </>) : <div style={{ opacity: 0.9 }}>No upcoming appointments. Book one in seconds.</div>}
        </div>
        <svg className="ecg" width="260" height="90" viewBox="0 0 260 90"><path d="M0 45 H70 L82 20 L96 75 L108 10 L120 60 L130 45 H260" fill="none" stroke="#fff" strokeWidth="3" strokeLinejoin="round" /></svg>
        <div className="row">{next?.type === 'Video' && <button className="btn" style={{ background: '#fff', color: '#111' }}><Video size={16} /> Join call</button>}<Link to="/doctors" className="btn" style={{ background: 'rgba(255,255,255,.2)' }}>Book appointment <ArrowRight size={16} /></Link></div>
      </div>
      <div className="grid grid-4 stagger">
        <Vital icon={HeartPulse} label="Blood pressure" value={last && `${last.sys}/${last.dia}`} unit="mmHg" k="sys" color="#ef4444" />
        <Vital icon={Droplet} label="Blood sugar" value={last?.sugar} unit="mg/dL" k="sugar" color="#f59e0b" />
        <Vital icon={Scale} label="Weight" value={last?.weight} unit="kg" k="weight" color="#8b5cf6" />
        <Vital icon={HeartPulse} label="Heart rate" value={last?.hr} unit="bpm" k="hr" color="#06b6d4" />
      </div>
      <div className="grid grid-2">
        <div className="card fade-up col">
          <div className="row between"><div className="section-title" style={{ margin: 0 }}><Pill size={18} /> Today’s medicines</div><span className="badge">{takenN}/{doses.length} taken</span></div>
          <div className="progress"><div style={{ width: `${doses.length ? (takenN / doses.length) * 100 : 0}%` }} /></div>
          {h.meds.flatMap((m) => m.times.map((t) => { const k = `${m.id}@${t}`; return (
            <label key={k} className="row between small" style={{ cursor: 'pointer', padding: '6px 4px', textDecoration: h.takenToday[k] ? 'line-through' : 'none', opacity: h.takenToday[k] ? 0.6 : 1 }}>
              <span className="row"><span style={{ width: 10, height: 10, borderRadius: 99, background: m.color }} /><b>{m.name}</b> · {m.dose}</span>
              <span className="row">{t}<input type="checkbox" checked={!!h.takenToday[k]} onChange={() => h.toggleTaken(k)} style={{ accentColor: 'var(--accent)', width: 18, height: 18 }} /></span>
            </label>) }))}
          {!h.meds.length && <p className="muted small">No reminders yet.</p>}
        </div>
        <div className="card fade-up col">
          <div className="section-title"><CalendarClock size={18} /> Browse by speciality</div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 10 }}>
            {SPECIALTIES.map((s) => <Link key={s.id} to={`/doctors?sp=${encodeURIComponent(s.id)}`} className="card hover col" style={{ padding: 12, alignItems: 'center', gap: 4, textAlign: 'center' }}><span style={{ fontSize: 26 }}>{s.icon}</span><span className="xs bold">{s.id}</span></Link>)}
          </div>
        </div>
      </div>
    </div>
  )
}
