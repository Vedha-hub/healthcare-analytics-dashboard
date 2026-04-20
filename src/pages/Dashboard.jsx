import { useState, useEffect } from 'react'
import { fetchPatients, healthCheck } from '../services/api'

export default function Dashboard() {
  const [patients, setPatients] = useState([])
  const [apiStatus, setApiStatus] = useState(null)

  useEffect(() => {
    fetchPatients(0, 100).then(setPatients).catch(() => {})
    healthCheck().then(setApiStatus).catch(() => setApiStatus({ status: 'unreachable' }))
  }, [])

  const totalPatients = patients.length
  const avgAge = totalPatients
    ? (patients.reduce((s, p) => s + p.age, 0) / totalPatients).toFixed(1)
    : '—'

  const metrics = [
    { label: 'Total patients loaded', value: totalPatients },
    { label: 'Average age', value: avgAge },
    { label: 'API status', value: apiStatus?.status === 'ok' ? '✓ Online' : '✗ Offline' },
    { label: 'Model version', value: 'v1.0.0' },
  ]

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>System Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {metrics.map(m => (
          <div key={m.label} style={{
            background: '#fff', border: '1px solid var(--gray-200)',
            borderRadius: 8, padding: '16px 18px', boxShadow: 'var(--shadow)',
          }}>
            <p style={{ fontSize: 12, color: 'var(--gray-400)', fontWeight: 500, marginBottom: 6 }}>{m.label.toUpperCase()}</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--gray-900)' }}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Pipeline status */}
      <div style={{
        background: '#fff', border: '1px solid var(--gray-200)',
        borderRadius: 8, padding: '20px 24px', boxShadow: 'var(--shadow)',
      }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Pipeline Status</h2>
        {[
          { step: 'Phase 1 — ETL & DIP Preprocessing', desc: 'Run: python scripts/run_etl.py', done: true },
          { step: 'Phase 2A — CNN Feature Extraction (VGG16)', desc: 'Runs during training', done: true },
          { step: 'Phase 2B — Apriori + K-Means Mining', desc: 'Runs during training', done: true },
          { step: 'Phase 3 — Random Forest Training', desc: 'Run: python scripts/run_training.py', done: true },
          { step: 'API — FastAPI serving predictions', desc: 'Run: uvicorn backend.api.main:app --reload', done: apiStatus?.status === 'ok' },
          { step: 'Frontend — React doctor dashboard', desc: 'Run: npm run dev (in /frontend)', done: true },
        ].map(s => (
          <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--gray-100)' }}>
            <span style={{
              width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
              background: s.done ? 'var(--green-lt)' : 'var(--amber-lt)',
              color: s.done ? 'var(--green)' : 'var(--amber)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700,
            }}>{s.done ? '✓' : '!'}</span>
            <div>
              <p style={{ fontSize: 14, fontWeight: 500 }}>{s.step}</p>
              <p style={{ fontSize: 12, color: 'var(--gray-400)', fontFamily: 'monospace' }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
