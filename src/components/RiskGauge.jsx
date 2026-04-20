/**
 * Semicircular SVG gauge displaying risk score 0–1.
 */
export default function RiskGauge({ score, label }) {
  const pct   = Math.round(score * 100)
  const color = score >= 0.7 ? '#dc2626' : score >= 0.5 ? '#d97706' : '#16a34a'
  const bgCol = score >= 0.7 ? '#fef2f2' : score >= 0.5 ? '#fffbeb' : '#f0fdf4'

  // Arc math: semicircle from 180° to 0° (left to right)
  const R = 70
  const cx = 90, cy = 90
  const startAngle = Math.PI          // 180°
  const endAngle   = 0                // 0°
  const angle      = startAngle - score * Math.PI   // sweep from left

  const sx = cx + R * Math.cos(startAngle)
  const sy = cy + R * Math.sin(startAngle)
  const ex = cx + R * Math.cos(angle)
  const ey = cy + R * Math.sin(angle)
  const large = score > 0.5 ? 0 : 1   // large-arc-flag inverted for left-to-right

  return (
    <div style={{ textAlign: 'center' }}>
      <svg viewBox="0 0 180 100" width="100%" style={{ maxWidth: 240, display: 'block', margin: '0 auto' }}>
        {/* Track */}
        <path
          d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
          fill="none" stroke="#e5e7eb" strokeWidth="14" strokeLinecap="round"
        />
        {/* Fill */}
        {score > 0 && (
          <path
            d={`M ${sx} ${sy} A ${R} ${R} 0 ${large} 0 ${ex} ${ey}`}
            fill="none" stroke={color} strokeWidth="14" strokeLinecap="round"
          />
        )}
        {/* Score text */}
        <text x={cx} y={cy - 6} textAnchor="middle"
          style={{ fontSize: 26, fontWeight: 700, fill: color, fontFamily: 'system-ui' }}>
          {pct}%
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle"
          style={{ fontSize: 11, fill: '#6b7280', fontFamily: 'system-ui' }}>
          readmission risk
        </text>
      </svg>

      <div style={{
        display: 'inline-block', marginTop: 6, padding: '4px 16px',
        borderRadius: 99, background: bgCol, color,
        fontSize: 13, fontWeight: 700, letterSpacing: '.03em',
      }}>
        {label} Risk
      </div>
    </div>
  )
}
