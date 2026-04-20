const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function predictRisk(formData) {
  const res = await fetch(`${BASE}/api/predict`, {
    method: 'POST',
    body: formData,   // multipart/form-data — do NOT set Content-Type header
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export async function fetchPatients(skip = 0, limit = 50) {
  const res = await fetch(`${BASE}/api/patients?skip=${skip}&limit=${limit}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function fetchPatient(patientId) {
  const res = await fetch(`${BASE}/api/patients/${patientId}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function healthCheck() {
  const res = await fetch(`${BASE}/api/health`)
  return res.json()
}
