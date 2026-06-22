export type ArtworkType =
  | 'pintura'
  | 'escultura'
  | 'fotografía'
  | 'grabado'
  | 'dibujo'
  | 'instalación'
  | 'arte digital'
  | 'otro';

export type ExhibitionType = 'museo' | 'feria' | 'exposición';

export interface Artist {
  id?: number;
  name: string;
  phone: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Artwork {
  id?: number;
  artistId: number;
  name: string;
  title: string;
  year: number;
  type: ArtworkType;
  dimensions: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Exhibition {
  id?: number;
  name: string;
  type: ExhibitionType;
  startDate: Date;
  endDate: Date;
  description?: string;
  createdAt: Date;
}

export interface ExhibitionArtwork {
  id?: number;
  exhibitionId: number;
  artworkId: number;
}
