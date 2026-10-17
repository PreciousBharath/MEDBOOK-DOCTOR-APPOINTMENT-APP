import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ReferenceArea } from 'recharts'
import { Plus, Trash2, Calculator } from 'lucide-react'
import { useHealth } from '../health.jsx'
import { dayKey } from '../data.js'
import Empty from '../components/Empty.jsx'

const tip = { background: 'var(--card-solid)', border: '1px solid var(--border)', borderRadius: 12 }
const METRICS = { bp: { label: 'Blood pressure', lines: [['sys', '#ef4444', 'Systolic'], ['dia', '#f97316', 'Diastolic']], band: [60, 120] }, sugar: { label: 'Blood sugar', lines: [['sugar', '#f59e0b', 'mg/dL']], band: [70, 140] }, weight: { label: 'Weight', lines: [['weight', '#8b5cf6', 'kg']] }, hr: { label: 'Heart rate', lines: [['hr', '#06b6d4', 'bpm']], band: [60, 100] } }

export default function Vitals() {
  const h = useHealth()
  const [m, setM] = useState('bp')
  const [f, setF] = useState({ date: dayKey(new Date()), sys: 120, dia: 80, sugar: 100, weight: 65, hr: 72 })
  const [bmi, setBmi] = useState({ h: 165, w: 65 })
  const b = bmi.w / (bmi.h / 100) ** 2
  const cat = b < 18.5 ? ['Underweight', '#06b6d4'] : b < 25 ? ['Healthy', '#10b981'] : b < 30 ? ['Overweight', '#f59e0b'] : ['Obese', '#ef4444']
  const cfg = METRICS[m]

  return (
    <div className="col" style={{ gap: 18 }}>
      <div className="card fade-up">
        <div className="row between wrap mb"><div className="tabs">{Object.entries(METRICS).map(([k, v]) => <button key={k} className={m === k ? 'active' : ''} onClick={() => setM(k)}>{v.label}</button>)}</div><span className="xs muted">Shaded band = typical healthy range</span></div>
        {!h.vitals.length ? <Empty title="No readings yet" text="Add your first reading below." /> : (
          <div style={{ height: 300 }}><ResponsiveContainer><LineChart data={h.vitals}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            {cfg.band && <ReferenceArea y1={cfg.band[0]} y2={cfg.band[1]} fill="var(--success)" fillOpacity={0.08} />}
            <XAxis dataKey="date" stroke="var(--muted)" fontSize={11} tickFormatter={(d) => d.slice(5)} /><YAxis stroke="var(--muted)" domain={['auto', 'auto']} /><Tooltip contentStyle={tip} /><Legend />
            {cfg.lines.map(([k, c, n]) => <Line key={k} type="monotone" dataKey={k} name={n} stroke={c} strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />)}</LineChart></ResponsiveContainer></div>
        )}
      </div>
      <div className="grid grid-2">
        <form className="card col fade-up" onSubmit={(e) => { e.preventDefault(); h.addVital(f) }}>
          <div className="section-title"><Plus size={18} /> Add reading</div>
          <div className="grid grid-3">
            <div className="field"><label>Date</label><input className="input" type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></div>
            {[['sys', 'Systolic'], ['dia', 'Diastolic'], ['sugar', 'Sugar (mg/dL)'], ['weight', 'Weight (kg)'], ['hr', 'Heart rate']].map(([k, l]) => <div key={k} className="field"><label>{l}</label><input className="input" type="number" step="any" value={f[k]} onChange={(e) => setF({ ...f, [k]: +e.target.value })} /></div>)}
          </div>
          <button className="btn">Save reading</button>
        </form>
        <div className="card col fade-up">
          <div className="section-title"><Calculator size={18} /> BMI calculator</div>
          <div className="field"><label>Height: {bmi.h} cm</label><input type="range" min="120" max="210" value={bmi.h} onChange={(e) => setBmi({ ...bmi, h: +e.target.value })} style={{ accentColor: 'var(--accent)' }} /></div>
          <div className="field"><label>Weight: {bmi.w} kg</label><input type="range" min="30" max="150" value={bmi.w} onChange={(e) => setBmi({ ...bmi, w: +e.target.value })} style={{ accentColor: 'var(--accent)' }} /></div>
          <div className="row" style={{ gap: 16 }}><span style={{ fontSize: '2.4rem', fontWeight: 800, color: cat[1] }}>{b.toFixed(1)}</span><span className="badge" style={{ background: cat[1], color: '#fff' }}>{cat[0]}</span></div>
          <div style={{ position: 'relative', height: 10, borderRadius: 9, background: 'linear-gradient(90deg,#06b6d4 0 25%,#10b981 25% 55%,#f59e0b 55% 75%,#ef4444 75%)' }}><span style={{ position: 'absolute', top: -5, left: `${Math.min(98, Math.max(0, ((b - 12) / 28) * 100))}%`, width: 20, height: 20, borderRadius: 99, background: '#fff', border: `4px solid ${cat[1]}`, transition: 'left .4s' }} /></div>
        </div>
      </div>
      {h.vitals.length > 0 && (
        <div className="card table-wrap fade-up"><table className="table"><thead><tr><th>Date</th><th>BP</th><th>Sugar</th><th>Weight</th><th>HR</th><th></th></tr></thead>
          <tbody>{[...h.vitals].reverse().map((v) => <tr key={v.id}><td>{v.date}</td><td>{v.sys}/{v.dia}</td><td>{v.sugar}</td><td>{v.weight}</td><td>{v.hr}</td><td><button className="btn ghost icon sm" onClick={() => h.deleteVital(v.id)}><Trash2 size={14} /></button></td></tr>)}</tbody></table></div>
      )}
    </div>
  )
}
