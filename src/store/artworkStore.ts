import { create } from 'zustand';
import { db } from '../db';
import type { Artwork } from '../types';

interface ArtworkStore {
  artworks: Artwork[];
  loading: boolean;
  error: string | null;
  fetchArtworks: () => Promise<void>;
  fetchArtworksByArtist: (artistId: number) => Promise<Artwork[]>;
  addArtwork: (data: Omit<Artwork, 'id' | 'createdAt' | 'updatedAt'>) => Promise<number>;
  updateArtwork: (id: number, data: Partial<Omit<Artwork, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteArtwork: (id: number) => Promise<void>;
}

export const useArtworkStore = create<ArtworkStore>((set, get) => ({
  artworks: [],
  loading: false,
  error: null,

  fetchArtworks: async () => {
    set({ loading: true, error: null });
    try {
      const artworks = await db.artworks.toArray();
      set({ artworks, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchArtworksByArtist: async (artistId) => {
    return await db.artworks.where('artistId').equals(artistId).toArray();
  },

  addArtwork: async (data) => {
    const now = new Date();
    const id = await db.artworks.add({ ...data, createdAt: now, updatedAt: now });
    await get().fetchArtworks();
    return id;
  },

  updateArtwork: async (id, data) => {
    await db.artworks.update(id, { ...data, updatedAt: new Date() });
    await get().fetchArtworks();
  },

  deleteArtwork: async (id) => {
    await db.exhibitionArtworks.where('artworkId').equals(id).delete();
    await db.artworks.delete(id);
    await get().fetchArtworks();
  },
}));
