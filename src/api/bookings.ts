import { api } from './client';
import { Booking } from '../types';

export async function getBookings(): Promise<Booking[]> {
  return api.get<Booking[]>('/bookings');
}

export async function createBooking(booking: Booking): Promise<Booking> {
  return api.post<Booking>('/bookings', booking);
}

export async function updateBooking(booking: Booking): Promise<Booking> {
  return api.put<Booking>(`/bookings/${booking.id}`, booking);
}

export async function deleteBooking(id: string): Promise<void> {
  await api.delete(`/bookings/${id}`);
}
