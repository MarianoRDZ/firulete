export type PetSpecies = 'dog' | 'cat' | 'other';
export type PetSize = 'small' | 'medium' | 'large';
export type ReportType = 'lost' | 'found' | 'adoption';
export type ReportStatus = 'active' | 'resolved';
export type ContactRequestStatus = 'pending' | 'accepted' | 'rejected';
export type MessageType = 'text' | 'image';
export type BusinessType = 'vet' | 'petshop' | 'food' | 'grooming' | 'other';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

export interface PetReport {
  id: string;
  user_id: string;
  type: ReportType;
  species: PetSpecies;
  breed?: string;
  colors: string[];
  size?: PetSize;
  name?: string;
  description?: string;
  last_seen_at?: string;
  location: { lat: number; lng: number };
  is_anonymous: boolean;
  status: ReportStatus;
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  owner_id: string;
  type: BusinessType;
  name: string;
  description?: string;
  address: string;
  location: { lat: number; lng: number };
  phone?: string;
  whatsapp?: string;
  website?: string;
  is_24h: boolean;
  accepts_urgencies: boolean;
  subscription_status: string;
  created_at: string;
}
