import { api } from './client';

export async function getAdminTenantsApi(): Promise<any[]> {
  return api.get<any[]>('/tenants');
}

export async function activateTenantApi(tenantId: string): Promise<any> {
  return api.post<any>(`/tenants/${tenantId}/activate`, {});
}

export async function deactivateTenantApi(tenantId: string): Promise<any> {
  return api.post<any>(`/tenants/${tenantId}/deactivate`, {});
}

export async function updateTenantOwnerApi(tenantId: string, data: any): Promise<any> {
  return api.put<any>(`/tenants/${tenantId}/owner`, data);
}

