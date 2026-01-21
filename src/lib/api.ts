const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

async function request(path: string, opts: RequestInit = {}) {
  const url = `${API_BASE}${path}`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { headers, ...opts });
  if (!res.ok) {
    const text = await res.text();
    let body = text;
    try { body = JSON.parse(text); } catch (e) {}
    const err: any = new Error('API error');
    err.status = res.status;
    err.body = body;
    throw err;
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}

export async function apiLogin(email: string, password: string) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export async function apiRegister(payload: { name: string; email: string; password: string; role?: string; phone?: string; promotion?: string }) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function getPromotions() {
  return request('/api/promotions');
}

export async function createPromotion(payload: { label: string; year: number }) {
  return request('/api/promotions', { method: 'POST', body: JSON.stringify(payload) });
}

export async function getStudentsByPromotion(promotionId: string) {
  return request(`/api/promotions/${promotionId}/students`);
}

export async function getUsers() {
  return request('/api/users');
}

export async function createUser(payload: { name: string; email: string; password: string; role?: string; phone?: string; promotion?: string }) {
  return request('/api/users', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateUserApi(id: string, payload: any) {
  return request(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export async function deleteUserApi(id: string) {
  return request(`/api/users/${id}`, { method: 'DELETE' });
}

export default { apiLogin, apiRegister, getPromotions, createPromotion, getStudentsByPromotion, getUsers };
