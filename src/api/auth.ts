import { api, setAuthToken } from './client';

interface LoginResponse {
  token: string;
  tenantId: string;
  tenantName: string;
  role: 'admin' | 'sales_agent';
}

export async function loginApi(phone: string, password: string): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', {
    phone,
    password,
  });

  // Store token on successful login
  setAuthToken(response.token);
  return response;
}

export async function loginAppAdminApi(username: string, password: string): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login/appadmin', {
    username,
    password,
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

export async function getTenantsApi(): Promise<any[]> {
  return api.get<any[]>('/auth/tenants');
}

export async function registerTenantApi(data: any): Promise<any> {
  return api.post<any>('/auth/register', data);
}
