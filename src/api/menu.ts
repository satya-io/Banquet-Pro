import { api } from './client';
import { CateringItem } from '../types';

export async function getMenuItems(): Promise<CateringItem[]> {
  return api.get<CateringItem[]>('/menu');
}

export async function createMenuItem(item: CateringItem): Promise<CateringItem> {
  return api.post<CateringItem>('/menu', item);
}

export async function updateMenuItem(item: CateringItem): Promise<CateringItem> {
  return api.put<CateringItem>(`/menu/${item.id}`, item);
}

export async function deleteMenuItem(id: string): Promise<void> {
  await api.delete(`/menu/${id}`);
}
