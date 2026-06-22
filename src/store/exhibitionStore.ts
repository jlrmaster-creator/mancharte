import { create } from 'zustand';
import { db } from '../db';
import type { Exhibition, ExhibitionArtwork } from '../types';

interface ExhibitionStore {
  exhibitions: Exhibition[];
  loading: boolean;
  error: string | null;
  fetchExhibitions: () => Promise<void>;
  addExhibition: (
    data: Omit<Exhibition, 'id' | 'createdAt' | 'updatedAt'>,
    artworkIds: number[]
  ) => Promise<number>;
  updateExhibition: (
    id: number,
    data: Partial<Omit<Exhibition, 'id' | 'createdAt' | 'updatedAt'>>,
    artworkIds?: number[]
  ) => Promise<void>;
  closeExhibition: (id: number) => Promise<void>;
  reopenExhibition: (id: number) => Promise<void>;
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
    const now = new Date();
    const id = await db.exhibitions.add({ ...data, createdAt: now, updatedAt: now });
    const links: ExhibitionArtwork[] = artworkIds.map((artworkId) => ({
      exhibitionId: id,
      artworkId,
    }));
    await db.exhibitionArtworks.bulkAdd(links);
    await get().fetchExhibitions();
    return id;
  },

  updateExhibition: async (id, data, artworkIds) => {
    await db.exhibitions.update(id, { ...data, updatedAt: new Date() });
    if (artworkIds !== undefined) {
      await db.exhibitionArtworks.where('exhibitionId').equals(id).delete();
      const links: ExhibitionArtwork[] = artworkIds.map((artworkId) => ({
        exhibitionId: id,
        artworkId,
      }));
      await db.exhibitionArtworks.bulkAdd(links);
    }
    await get().fetchExhibitions();
  },

  closeExhibition: async (id) => {
    await db.exhibitions.update(id, { closed: true, updatedAt: new Date() });
    await get().fetchExhibitions();
  },

  reopenExhibition: async (id) => {
    await db.exhibitions.update(id, { closed: false, updatedAt: new Date() });
    await get().fetchExhibitions();
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
