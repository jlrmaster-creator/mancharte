import { create } from 'zustand';
import { db } from '../db';
import type { Exhibition, ExhibitionArtwork } from '../types';

interface ExhibitionStore {
  exhibitions: Exhibition[];
  loading: boolean;
  error: string | null;
  fetchExhibitions: () => Promise<void>;
  addExhibition: (
    data: Omit<Exhibition, 'id' | 'createdAt'>,
    artworkIds: number[]
  ) => Promise<number>;
  deleteExhibition: (id: number) => Promise<void>;
  getExhibitionArtworks: (id: number) => Promise<number[]>;
}

export const useExhibitionStore = create<ExhibitionStore>((set, get) => ({
  exhibitions: [],
  loading: false,
  error: null,

  fetchExhibitions: async () => {
    set({ loading: true, error: null });
    try {
      const exhibitions = await db.exhibitions.toArray();
      set({ exhibitions, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  addExhibition: async (data, artworkIds) => {
    const id = await db.exhibitions.add({ ...data, createdAt: new Date() });
    const links: ExhibitionArtwork[] = artworkIds.map((artworkId) => ({
      exhibitionId: id,
      artworkId,
    }));
    await db.exhibitionArtworks.bulkAdd(links);
    await get().fetchExhibitions();
    return id;
  },

  deleteExhibition: async (id) => {
    await db.exhibitionArtworks.where('exhibitionId').equals(id).delete();
    await db.exhibitions.delete(id);
    await get().fetchExhibitions();
  },

  getExhibitionArtworks: async (id) => {
    const links = await db.exhibitionArtworks.where('exhibitionId').equals(id).toArray();
    return links.map((l) => l.artworkId);
  },
}));
