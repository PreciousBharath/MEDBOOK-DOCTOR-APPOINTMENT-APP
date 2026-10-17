import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Stethoscope } from 'lucide-react'
import { DOCTORS, SPECIALTIES } from '../data.js'
import { DoctorCard, BookingModal } from '../components/Doctor.jsx'
import Empty from '../components/Empty.jsx'
import { useHealth } from '../health.jsx'

export default function Doctors() {
  const [params] = useSearchParams()
  const { favs } = useHealth()
  const [q, setQ] = useState('')
  const [sp, setSp] = useState(params.get('sp') || 'All')
  const [city, setCity] = useState('All')
  const [maxFee, setMaxFee] = useState(1500)
  const [video, setVideo] = useState(false)
  const [onlyFav, setOnlyFav] = useState(false)
  const [gender, setGender] = useState('Any')
  const [sort, setSort] = useState('rating')
  const [book, setBook] = useState(null)

  const list = useMemo(() => DOCTORS
    .filter((d) => `${d.name} ${d.specialty} ${d.hospital}`.toLowerCase().includes(q.toLowerCase()))
    .filter((d) => (sp === 'All' || d.specialty === sp) && (city === 'All' || d.city === city) && d.fee <= maxFee && (!video || d.video) && (!onlyFav || favs.includes(d.id)) && (gender === 'Any' || d.gender === gender))
    .sort((a, b) => ({ rating: b.rating - a.rating, fee: a.fee - b.fee, exp: b.exp - a.exp, reviews: b.reviews - a.reviews }[sort])), [q, sp, city, maxFee, video, onlyFav, gender, sort, favs])

  return (
    <div className="col" style={{ gap: 18 }}>
      <div className="row wrap">
        <div className="input-icon" style={{ flex: 1, minWidth: 240 }}><Search size={17} /><input className="input" placeholder="Search doctors, specialities, hospitals…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <select className="input" style={{ width: 160 }} value={city} onChange={(e) => setCity(e.target.value)}><option>All</option>{[...new Set(DOCTORS.map((d) => d.city))].map((c) => <option key={c}>{c}</option>)}</select>
        <select className="input" style={{ width: 170 }} value={sort} onChange={(e) => setSort(e.target.value)}><option value="rating">Top rated</option><option value="fee">Lowest fee</option><option value="exp">Most experienced</option><option value="reviews">Most reviewed</option></select>
      </div>
      <div className="row wrap"><button className={`chip ${sp === 'All' ? 'active' : ''}`} onClick={() => setSp('All')}>All</button>{SPECIALTIES.map((s) => <button key={s.id} className={`chip ${sp === s.id ? 'active' : ''}`} onClick={() => setSp(s.id)}>{s.icon} {s.id}</button>)}</div>
      <div className="card row wrap" style={{ gap: 22, padding: 14 }}>
        <div className="row small" style={{ minWidth: 240 }}><b>Max fee ₹{maxFee}</b><input type="range" min="300" max="1500" step="100" value={maxFee} onChange={(e) => setMaxFee(+e.target.value)} style={{ accentColor: 'var(--accent)', flex: 1 }} /></div>
        <label className="row small"><button className={`switch ${video ? 'on' : ''}`} onClick={() => setVideo(!video)} /> Video consult</label>
        <label className="row small"><button className={`switch ${onlyFav ? 'on' : ''}`} onClick={() => setOnlyFav(!onlyFav)} /> Favourites</label>
        <div className="tabs">{['Any', 'Female', 'Male'].map((g) => <button key={g} className={gender === g ? 'active' : ''} onClick={() => setGender(g)}>{g}</button>)}</div>
        <span className="small muted" style={{ marginLeft: 'auto' }}>{list.length} doctors</span>
      </div>
      {!list.length ? <Empty icon={Stethoscope} title="No doctors match" text="Try another speciality or widen the filters." /> : (
        <div className="grid grid-3 stagger">{list.map((d) => <DoctorCard key={d.id} d={d} onBook={setBook} />)}</div>
      )}
      {book && <BookingModal id={book} doctors={DOCTORS} onClose={() => setBook(null)} />}
    </div>
  )
}
