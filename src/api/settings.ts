import { api } from './client';
import { VenueSettings, TeamMember } from '../types';

export async function getSettings(): Promise<VenueSettings | null> {
  return api.get<VenueSettings | null>('/settings');
}

export async function updateSettings(settings: VenueSettings): Promise<VenueSettings> {
  return api.put<VenueSettings>('/settings', settings);
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  return api.get<TeamMember[]>('/settings/team');
}
