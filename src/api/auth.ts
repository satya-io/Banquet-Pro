import { api, setAuthToken } from './client';

interface LoginResponse {
  token: string;
  tenantId: string;
  tenantName: string;
  role: 'admin' | 'sales_agent';
}

export async function loginApi(username: string, password: string, tenantId?: string): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', {
    username,
    password,
    tenantId,
  });

  // Store token on successful login
  setAuthToken(response.token);
  return response;
}

export async function logoutApi(): Promise<void> {
  try {
    await api.post('/auth/logout', {});
  } catch {
    // Logout is best-effort; always clear local state
  } finally {
    setAuthToken(null);
  }
}
