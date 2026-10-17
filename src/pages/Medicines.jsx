import { useState } from 'react'
import { Pill, Plus, Trash2, X } from 'lucide-react'
import { useHealth } from '../health.jsx'
import Empty from '../components/Empty.jsx'

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6', '#ec4899']

export default function Medicines() {
  const h = useHealth()
  const [f, setF] = useState({ name: '', dose: '1 tablet', times: ['08:00'], color: COLORS[0], notes: '' })
  const [t, setT] = useState('20:00')
  const doses = h.meds.flatMap((m) => m.times.map((x) => `${m.id}@${x}`))
  const pct = doses.length ? Math.round((doses.filter((k) => h.takenToday[k]).length / doses.length) * 100) : 0
  const C = 2 * Math.PI * 54

  return (
    <div className="grid grid-2">
      <div className="col" style={{ gap: 18 }}>
        <div className="card row fade-up" style={{ gap: 20 }}>
          <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}><circle cx="65" cy="65" r="54" stroke="var(--bg-2)" strokeWidth="12" fill="none" /><circle cx="65" cy="65" r="54" stroke="var(--accent)" strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} style={{ transition: 'stroke-dashoffset .8s' }} /></svg>
          <div><div style={{ fontSize: '2.2rem', fontWeight: 800 }} className="gradient-text">{pct}%</div><div className="muted">of today’s doses taken</div>{pct === 100 && <div className="badge green mt">🎉 All done for today!</div>}</div>
        </div>
        {!h.meds.length ? <Empty icon={Pill} title="No medicines" text="Add a reminder to start tracking." /> : (
          <div className="col stagger">{h.meds.map((m) => (
            <div key={m.id} className="card row" style={{ borderLeft: `5px solid ${m.color}` }}>
              <Pill color={m.color} /><div style={{ flex: 1 }}><b>{m.name}</b><div className="small muted">{m.dose}{m.notes && ` · ${m.notes}`}</div>
                <div className="row wrap" style={{ marginTop: 6 }}>{m.times.map((x) => { const k = `${m.id}@${x}`; return <button key={x} className={`chip ${h.takenToday[k] ? 'active' : ''}`} onClick={() => h.toggleTaken(k)}>{h.takenToday[k] ? '✓' : '○'} {x}</button> })}</div></div>
              <button className="btn ghost icon" onClick={() => h.deleteMed(m.id)}><Trash2 size={15} /></button>
            </div>))}</div>
        )}
      </div>
      <form className="card col fade-up" onSubmit={(e) => { e.preventDefault(); if (!f.name.trim()) return; h.addMed(f); setF({ ...f, name: '', notes: '' }) }} style={{ height: 'fit-content' }}>
        <div className="section-title"><Plus size={18} /> New reminder</div>
        <div className="field"><label>Medicine name</label><input className="input" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
        <div className="field"><label>Dose</label><input className="input" value={f.dose} onChange={(e) => setF({ ...f, dose: e.target.value })} /></div>
        <div className="field"><label>Times</label><div className="row"><input className="input" type="time" value={t} onChange={(e) => setT(e.target.value)} /><button type="button" className="btn icon" onClick={() => !f.times.includes(t) && setF({ ...f, times: [...f.times, t].sort() })}><Plus size={17} /></button></div>
          <div className="row wrap">{f.times.map((x) => <span key={x} className="badge">{x} <X size={12} style={{ cursor: 'pointer' }} onClick={() => setF({ ...f, times: f.times.filter((y) => y !== x) })} /></span>)}</div></div>
        <div className="field"><label>Colour tag</label><div className="row">{COLORS.map((c) => <button type="button" key={c} className={`swatch ${f.color === c ? 'active' : ''}`} style={{ background: c }} onClick={() => setF({ ...f, color: c })} />)}</div></div>
        <div className="field"><label>Notes</label><input className="input" placeholder="e.g. after food" value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></div>
        <button className="btn">Add reminder</button>
        <p className="xs muted">Reminders are for personal tracking only — always follow your doctor’s prescription.</p>
      </form>
    </div>
  )
}
