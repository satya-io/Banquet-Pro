import { api } from './client';
import { VenueSpace } from '../types';

export async function getVenueSpaces(): Promise<VenueSpace[]> {
  return api.get<VenueSpace[]>('/venues');
}

export async function createVenueSpace(space: VenueSpace): Promise<VenueSpace> {
  return api.post<VenueSpace>('/venues', space);
}

export async function deleteVenueSpace(id: string): Promise<void> {
  await api.delete(`/venues/${id}`);
}
