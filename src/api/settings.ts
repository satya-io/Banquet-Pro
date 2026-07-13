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

export async function addTeamMember(member: TeamMember): Promise<TeamMember> {
  return api.post<TeamMember>('/settings/team', member);
}

export async function updateTeamMember(id: string, member: Partial<TeamMember>): Promise<TeamMember> {
  return api.put<TeamMember>(`/settings/team/${id}`, member);
}

export async function deleteTeamMember(id: string): Promise<void> {
  return api.delete<void>(`/settings/team/${id}`);
}
