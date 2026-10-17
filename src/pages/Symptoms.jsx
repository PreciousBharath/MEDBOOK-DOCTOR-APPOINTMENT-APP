import { useState } from 'react'
import { Bot, AlertTriangle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SYMPTOMS, SPECIALTIES, DOCTORS } from '../data.js'

export default function Symptoms() {
  const [sel, setSel] = useState([])
  const score = {}
  sel.forEach((s) => SYMPTOMS.find((x) => x.s === s).sp.forEach((sp, i) => (score[sp] = (score[sp] || 0) + (i === 0 ? 2 : 1))))
  const ranked = Object.entries(score).sort((a, b) => b[1] - a[1])
  const urgent = sel.some((s) => SYMPTOMS.find((x) => x.s === s).urgent)
  const max = ranked[0]?.[1] || 1

  return (
    <div className="grid grid-2">
      <div className="card col fade-up">
        <div className="section-title"><Bot size={18} /> What are you experiencing?</div>
        <p className="small muted">Select one or more symptoms — we’ll suggest the right speciality to consult.</p>
        <div className="row wrap">{SYMPTOMS.map(({ s }) => <button key={s} className={`chip ${sel.includes(s) ? 'active' : ''}`} onClick={() => setSel(sel.includes(s) ? sel.filter((x) => x !== s) : [...sel, s])}>{s}</button>)}</div>
        {sel.length > 0 && <button className="btn ghost sm" style={{ width: 'fit-content' }} onClick={() => setSel([])}>Clear</button>}
      </div>
      <div className="card col fade-up">
        <div className="section-title">Suggested specialists</div>
        {urgent && <div className="card row" style={{ background: 'color-mix(in srgb, var(--danger) 12%, transparent)', borderColor: 'var(--danger)' }}><AlertTriangle color="var(--danger)" /><span className="small"><b>Some symptoms may need urgent care.</b> If severe or sudden, contact emergency services right away.</span></div>}
        {!ranked.length ? <p className="muted small">Pick symptoms to see suggestions.</p> : ranked.map(([sp, v]) => { const meta = SPECIALTIES.find((x) => x.id === sp); return (
          <div key={sp} className="col fade-up" style={{ gap: 6 }}>
            <div className="row between"><span className="row bold">{meta.icon} {sp}</span><Link to={`/doctors?sp=${encodeURIComponent(sp)}`} className="btn sm">{DOCTORS.filter((d) => d.specialty === sp).length} doctors <ArrowRight size={14} /></Link></div>
            <div className="progress"><div style={{ width: `${(v / max) * 100}%`, background: meta.color }} /></div>
          </div>) })}
        <p className="xs muted">This guide is informational and does not provide a diagnosis.</p>
      </div>
    </div>
  )
}
