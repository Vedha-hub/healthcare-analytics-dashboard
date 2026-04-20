import { useState, useRef } from 'react'
import { predictRisk } from '../services/api'
import RiskGauge from '../components/RiskGauge'
import FeatureBar from '../components/FeatureBar'

const FIELD_LABELS = {
  age: 'Age (years)',
  glucose_level: 'Glucose Level (mg/dL)',
  hba1c: 'HbA1c (%)',
  blood_pressure_sys: 'Systolic BP (mmHg)',
  blood_pressure_dia: 'Diastolic BP (mmHg)',
  bmi: 'BMI',
  creatinine: 'Creatinine (mg/dL)',
}

const DEFAULTS = {
  age: '', glucose_level: '', hba1c: '6.0',
  blood_pressure_sys: '120', blood_pressure_dia: '80',
  bmi: '25', creatinine: '1.0',
}

const FLAG_LABELS = {
  diabetes_flag: 'Diabetes',
  hypertension_flag: 'Hypertension',
  recent_surgery_flag: 'Recent Surgery (< 30 days)',
  icu_stay_flag: 'ICU Stay this admission',
}

export default function PredictPage() {
  const [fields, setFields]   = useState(DEFAULTS)
  const [flags, setFlags]     = useState({ diabetes_flag: false, hypertension_flag: false, recent_surgery_flag: false, icu_stay_flag: false })
  const [file, setFile]       = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const fileRef               = useRef()

  function handleFile(e) {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) { setError('Please upload an X-ray image.'); return }
    if (!fields.age || !fields.glucose_level) { setError('Age and Glucose Level are required.'); return }

    setLoading(true); setError(null); setResult(null)

    const fd = new FormData()
    fd.append('xray', file)
    Object.entries(fields).forEach(([k, v]) => fd.append(k, v))
    Object.entries(flags).forEach(([k, v]) => fd.append(k, v))

    try {
      const data = await predictRisk(fd)
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Readmission Risk Prediction</h1>
      <p style={{ color: 'var(--gray-600)', marginBottom: 28, fontSize: 14 }}>
        Upload a chest X-ray and enter clinical values to generate a 30-day readmission risk score.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: 24 }}>

        {/* ── Input form ── */}
        <form onSubmit={handleSubmit}>

          {/* X-ray upload */}
          <section style={card}>
            <h2 style={sectionHead}>1. Upload X-ray</h2>
            <div
              onClick={() => fileRef.current.click()}
              style={{
                border: `2px dashed ${file ? 'var(--blue)' : 'var(--gray-200)'}`,
                borderRadius: 'var(--radius)',
                padding: 24,
                textAlign: 'center',
                cursor: 'pointer',
                background: file ? 'var(--blue-lt)' : 'var(--gray-50)',
                transition: 'all .2s',
              }}
            >
              {preview ? (
                <img src={preview} alt="X-ray preview"
                  style={{ maxHeight: 180, borderRadius: 4, objectFit: 'contain' }} />
              ) : (
                <div style={{ color: 'var(--gray-400)', fontSize: 13 }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🫁</div>
                  Click to upload .jpg / .png / .dcm
                </div>
              )}
              <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.dcm"
                style={{ display: 'none' }} onChange={handleFile} />
            </div>
            {file && (
              <p style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 8 }}>
                {file.name} — {(file.size / 1024).toFixed(1)} KB
              </p>
            )}
          </section>

          {/* Clinical values */}
          <section style={{ ...card, marginTop: 16 }}>
            <h2 style={sectionHead}>2. Clinical Lab Values</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
              {Object.entries(FIELD_LABELS).map(([k, label]) => (
                <label key={k} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 12, color: 'var(--gray-600)', fontWeight: 500 }}>{label}</span>
                  <input
                    type="number" step="any"
                    value={fields[k]}
                    onChange={e => setFields(p => ({ ...p, [k]: e.target.value }))}
                    placeholder="—"
                    style={inputStyle}
                  />
                </label>
              ))}
            </div>
          </section>

          {/* Clinical flags */}
          <section style={{ ...card, marginTop: 16 }}>
            <h2 style={sectionHead}>3. Clinical Flags</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {Object.entries(FLAG_LABELS).map(([k, label]) => (
                <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                  <input type="checkbox" checked={flags[k]}
                    onChange={e => setFlags(p => ({ ...p, [k]: e.target.checked }))}
                    style={{ width: 15, height: 15, accentColor: 'var(--blue)' }} />
                  {label}
                </label>
              ))}
            </div>
          </section>

          {error && (
            <div style={{ marginTop: 14, padding: '10px 14px', background: 'var(--red-lt)',
              color: 'var(--red)', borderRadius: 'var(--radius)', fontSize: 13 }}>
              ⚠ {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            marginTop: 18, width: '100%', padding: '12px 0',
            background: loading ? 'var(--gray-400)' : 'var(--blue)',
            color: '#fff', border: 'none', borderRadius: 'var(--radius)',
            fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background .2s',
          }}>
            {loading ? 'Analysing…' : 'Predict Risk →'}
          </button>
        </form>

        {/* ── Results panel ── */}
        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <section style={card}>
              <h2 style={sectionHead}>Risk Score</h2>
              <RiskGauge score={result.risk_score} label={result.risk_label} />
              <p style={{
                marginTop: 14, padding: '10px 14px',
                background: result.risk_label === 'High' ? 'var(--red-lt)' : 'var(--green-lt)',
                color: result.risk_label === 'High' ? 'var(--red)' : 'var(--green)',
                borderRadius: 'var(--radius)', fontSize: 13, lineHeight: 1.5,
              }}>
                {result.message}
              </p>
            </section>

            <section style={card}>
              <h2 style={sectionHead}>Top Predictive Features</h2>
              <FeatureBar
                indices={result.top_feature_indices}
                importances={result.top_feature_importances}
              />
            </section>
          </div>
        )}
      </div>
    </div>
  )
}

const card = {
  background: '#fff',
  border: '1px solid var(--gray-200)',
  borderRadius: 'var(--radius)',
  padding: '18px 20px',
  boxShadow: 'var(--shadow)',
}

const sectionHead = {
  fontSize: 14, fontWeight: 600, marginBottom: 14,
  color: 'var(--gray-900)', letterSpacing: '.01em',
}

const inputStyle = {
  padding: '7px 10px',
  border: '1px solid var(--gray-200)',
  borderRadius: 6,
  outline: 'none',
  fontSize: 14,
  background: '#fff',
  transition: 'border .15s',
}