const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const apiFetch = async (path: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('cp_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
};
