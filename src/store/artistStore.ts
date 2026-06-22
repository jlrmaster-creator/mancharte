import { create } from 'zustand';
import { db } from '../db';
import type { Artist } from '../types';

interface ArtistStore {
  artists: Artist[];
  loading: boolean;
  error: string | null;
  fetchArtists: () => Promise<void>;
  addArtist: (data: Omit<Artist, 'id' | 'createdAt' | 'updatedAt'>) => Promise<number>;
  updateArtist: (id: number, data: Partial<Omit<Artist, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteArtist: (id: number) => Promise<void>;
}

export const useArtistStore = create<ArtistStore>((set, get) => ({
  artists: [],
  loading: false,
  error: null,

  fetchArtists: async () => {
    set({ loading: true, error: null });
    try {
      const artists = await db.artists.toArray();
      set({ artists, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  addArtist: async (data) => {
    const now = new Date();
    const id = await db.artists.add({ ...data, createdAt: now, updatedAt: now });
    await get().fetchArtists();
    return id;
  },

  updateArtist: async (id, data) => {
    await db.artists.update(id, { ...data, updatedAt: new Date() });
    await get().fetchArtists();
  },

  deleteArtist: async (id) => {
    const artworks = await db.artworks.where('artistId').equals(id).toArray();
    await db.artworks.bulkDelete(artworks.map((a) => a.id!));
    const eaLinks = await db.exhibitionArtworks
      .where('artworkId')
      .anyOf(artworks.map((a) => a.id!))
      .toArray();
    await db.exhibitionArtworks.bulkDelete(eaLinks.map((e) => e.id!));
    await db.artists.delete(id);
    await get().fetchArtists();
  },
}));
