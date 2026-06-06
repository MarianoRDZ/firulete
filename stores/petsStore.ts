import { create } from 'zustand';
import type { PetReport, PetSpecies, ReportType } from '@/types';

interface PetsFilters {
  type: ReportType | 'all';
  species: PetSpecies | 'all';
  radiusKm: number;
}

interface PetsState {
  reports: PetReport[];
  filters: PetsFilters;
  isLoading: boolean;
  setReports: (reports: PetReport[]) => void;
  setFilters: (filters: Partial<PetsFilters>) => void;
  setLoading: (loading: boolean) => void;
}

export const usePetsStore = create<PetsState>((set) => ({
  reports: [],
  filters: {
    type: 'all',
    species: 'all',
    radiusKm: 10,
  },
  isLoading: false,
  setReports: (reports) => set({ reports }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  setLoading: (isLoading) => set({ isLoading }),
}));
