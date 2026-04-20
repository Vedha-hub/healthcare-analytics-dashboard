/**
 * Horizontal bar chart of top 10 feature importances from Random Forest.
 * Indices 0–63 = image PCA features, 64–75 = clinical features.
 */

const FEATURE_NAMES = [
  // Image features (PCA dims 0–63)
  ...Array.from({ length: 64 }, (_, i) => `X-ray PCA ${i + 1}`),
  // Clinical features (indices 64–75)
  'Age', 'Glucose', 'HbA1c', 'BP Systolic', 'BP Diastolic',
  'BMI', 'Creatinine', 'Diabetes', 'Hypertension', 'Surgery', 'ICU', 'Cluster',
]

export default function FeatureBar({ indices, importances }) {
  if (!indices || indices.length === 0) return null

  const maxImp = Math.max(...importances)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {indices.map((idx, i) => {
        const name   = FEATURE_NAMES[idx] || `Feature ${idx}`
        const imp    = importances[i]
        const barPct = ((imp / maxImp) * 100).toFixed(1)
        const isImg  = idx < 64

        return (
          <div key={idx}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
              <span style={{ color: '#374151', fontWeight: 500 }}>
                <span style={{
                  display: 'inline-block', width: 8, height: 8, borderRadius: 2,
                  background: isImg ? '#2563eb' : '#7c3aed', marginRight: 6,
                }} />
                {name}
              </span>
              <span style={{ color: '#9ca3af' }}>{(imp * 100).toFixed(2)}%</span>
            </div>
            <div style={{ background: '#f3f4f6', borderRadius: 4, height: 8, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 4,
                width: `${barPct}%`,
                background: isImg
                  ? 'linear-gradient(90deg, #2563eb, #60a5fa)'
                  : 'linear-gradient(90deg, #7c3aed, #a78bfa)',
                transition: 'width .4s ease',
              }} />
            </div>
          </div>
        )
      })}

      <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
        <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: '#2563eb', marginRight: 4 }} />
        Image feature &nbsp;
        <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: '#7c3aed', marginRight: 4 }} />
        Clinical feature
      </p>
    </div>
  )
}
