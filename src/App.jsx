import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import PredictPage from './pages/PredictPage'
import PatientList from './pages/PatientList'

const NAV = [
  { id: 'predict', label: '🩻 Risk Prediction' },
  { id: 'patients', label: '👥 Patients' },
  { id: 'dashboard', label: '📊 Dashboard' },
]

export default function App() {
  const [page, setPage] = useState('predict')

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top nav */}
      <nav style={{
        background: '#fff',
        borderBottom: '1px solid var(--gray-200)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 32,
        height: 56,
        boxShadow: 'var(--shadow)',
      }}>
        <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--blue)', marginRight: 16 }}>
          HealthAnalytics
        </span>
        {NAV.map(n => (
          <button
            key={n.id}
            onClick={() => setPage(n.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 0',
              fontSize: 14,
              fontWeight: page === n.id ? 600 : 400,
              color: page === n.id ? 'var(--blue)' : 'var(--gray-600)',
              borderBottom: page === n.id ? '2px solid var(--blue)' : '2px solid transparent',
              transition: 'all .15s',
            }}
          >
            {n.label}
          </button>
        ))}
      </nav>

      {/* Page content */}
      <main style={{ flex: 1, padding: '32px 24px', maxWidth: 960, margin: '0 auto', width: '100%' }}>
        {page === 'predict'   && <PredictPage />}
        {page === 'patients'  && <PatientList />}
        {page === 'dashboard' && <Dashboard />}
      </main>
    </div>
  )
}
