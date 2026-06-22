import Dexie, { type Table } from 'dexie';
import type { Artist, Artwork, Exhibition, ExhibitionArtwork } from '../types';

class MancharteDB extends Dexie {
  artists!: Table<Artist, number>;
  artworks!: Table<Artwork, number>;
  exhibitions!: Table<Exhibition, number>;
  exhibitionArtworks!: Table<ExhibitionArtwork, number>;

  constructor() {
    super('MancharteDB');
    this.version(2).stores({
      artists: '++id, name, email',
      artworks: '++id, artistId, year, type',
      exhibitions: '++id, name, type, closed',
      exhibitionArtworks: '++id, exhibitionId, artworkId',
    });
  }
}

export const db = new MancharteDB();
