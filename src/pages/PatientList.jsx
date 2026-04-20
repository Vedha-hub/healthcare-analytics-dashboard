import { useState, useEffect } from 'react'
import { fetchPatients, fetchPatient } from '../services/api'

export default function PatientList() {
  const [patients, setPatients]   = useState([])
  const [selected, setSelected]   = useState(null)
  const [detail, setDetail]       = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    fetchPatients()
      .then(setPatients)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  async function openPatient(id) {
    setSelected(id)
    setDetail(null)
    try {
      const data = await fetchPatient(id)
      setDetail(data)
    } catch (e) {
      setError(e.message)
    }
  }

  if (loading) return <p style={{ color: 'var(--gray-400)' }}>Loading patients…</p>
  if (error)   return <p style={{ color: 'var(--red)' }}>Error: {error}</p>

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Patient Records</h1>
      <div style={{ display: 'grid', gridTemplateColumns: detail ? '1fr 1fr' : '1fr', gap: 20 }}>

        {/* Table */}
        <div style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 8, overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
                {['MRN', 'Age', 'Gender', ''].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--gray-600)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 && (
                <tr><td colSpan={4} style={{ padding: 20, color: 'var(--gray-400)', textAlign: 'center' }}>No patients found. Run ETL and seed the database.</td></tr>
              )}
              {patients.map(p => (
                <tr key={p.patient_id}
                  onClick={() => openPatient(p.patient_id)}
                  style={{
                    borderBottom: '1px solid var(--gray-100)',
                    background: selected === p.patient_id ? 'var(--blue-lt)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'background .1s',
                  }}>
                  <td style={td}>{p.mrn}</td>
                  <td style={td}>{p.age}</td>
                  <td style={td}>{p.gender || '—'}</td>
                  <td style={td}><span style={{ color: 'var(--blue)', fontSize: 12 }}>View →</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        {detail && (
          <div style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 8, padding: 20, boxShadow: 'var(--shadow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700 }}>{detail.patient.mrn}</h2>
                <p style={{ color: 'var(--gray-600)', fontSize: 13 }}>{detail.patient.gender}, age {detail.patient.age} · {detail.patient.blood_type}</p>
              </div>
              <button onClick={() => { setSelected(null); setDetail(null) }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', fontSize: 18 }}>✕</button>
            </div>

            <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-600)', marginBottom: 10 }}>ADMISSIONS</h3>
            {detail.admissions.length === 0 && <p style={{ color: 'var(--gray-400)', fontSize: 13 }}>No admissions found.</p>}
            {detail.admissions.map(a => (
              <div key={a.admission_id} style={{
                padding: '10px 12px', border: '1px solid var(--gray-100)',
                borderRadius: 6, marginBottom: 8, fontSize: 13,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--gray-600)' }}>{a.admission_date}</span>
                  {a.readmission_risk_score != null && (
                    <span style={{
                      fontWeight: 600, fontSize: 12,
                      color: a.readmission_risk_score > 0.5 ? 'var(--red)' : 'var(--green)',
                      background: a.readmission_risk_score > 0.5 ? 'var(--red-lt)' : 'var(--green-lt)',
                      padding: '2px 8px', borderRadius: 99,
                    }}>
                      Risk: {(a.readmission_risk_score * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
                {a.glucose_level && (
                  <p style={{ color: 'var(--gray-600)', marginTop: 4 }}>Glucose: {a.glucose_level.toFixed(0)} mg/dL</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const td = { padding: '10px 14px', verticalAlign: 'middle' }
