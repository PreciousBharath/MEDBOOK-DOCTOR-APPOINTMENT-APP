import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import { Protected, GuestOnly } from './guard.jsx'
import { HealthProvider } from './health.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Doctors from './pages/Doctors.jsx'
import Appointments from './pages/Appointments.jsx'
import Vitals from './pages/Vitals.jsx'
import Medicines from './pages/Medicines.jsx'
import Symptoms from './pages/Symptoms.jsx'
import Profile from './pages/Profile.jsx'
import Settings from './pages/Settings.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
      <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
      <Route element={<Protected><HealthProvider><Layout /></HealthProvider></Protected>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/vitals" element={<Vitals />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/symptoms" element={<Symptoms />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
