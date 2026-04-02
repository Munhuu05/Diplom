const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

function getUser() {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

function setAuth(data) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login.html';
}

function mustLogin() {
  if (!getToken()) {
    window.location.href = '/login.html';
  }
}

function statusClass(status = '') {
  if (['COMPLETED', 'DELIVERED', 'PAID'].includes(status)) return 'success';
  if (['NEW', 'CONFIRMED', 'IN_PRODUCTION', 'PARTIAL'].includes(status)) return 'info';
  if (['CANCELLED', 'PENDING'].includes(status)) return 'warn';
  return '';
}

async function apiFetch(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (res.status === 401) {
    logout();
    throw new Error('Session expired. Please login again.');
  }

  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}
