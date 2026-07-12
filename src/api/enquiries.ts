import { api } from './client';
import { Enquiry } from '../types';

export async function getEnquiries(): Promise<Enquiry[]> {
  return api.get<Enquiry[]>('/enquiries');
}

export async function createEnquiry(enquiry: Enquiry): Promise<Enquiry> {
  return api.post<Enquiry>('/enquiries', enquiry);
}

export async function updateEnquiry(enquiry: Enquiry): Promise<Enquiry> {
  return api.put<Enquiry>(`/enquiries/${enquiry.id}`, enquiry);
}

export async function deleteEnquiry(id: string): Promise<void> {
  await api.delete(`/enquiries/${id}`);
}
