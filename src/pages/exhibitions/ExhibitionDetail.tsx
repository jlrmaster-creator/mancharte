import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../db';
import type { Exhibition, Artwork } from '../../types';
import { Card } from '../../components/ui/Card';
import { Loading } from '../../components/ui/Loading';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';

export function ExhibitionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [artworks, setArtworks] = useState<(Artwork & { artistName?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const ex = await db.exhibitions.get(Number(id));
      setExhibition(ex ?? null);

      if (ex) {
        const links = await db.exhibitionArtworks.where('exhibitionId').equals(ex.id!).toArray();
        if (links.length > 0) {
          const artworkIds = links.map((l) => l.artworkId);
          const works = await db.artworks.where('id').anyOf(artworkIds).toArray();
          const allArtists = await db.artists.toArray();
          const artistMap: Record<number, string> = {};
          allArtists.forEach((a) => { if (a.id) artistMap[a.id] = a.name; });
          setArtworks(works.map((w) => ({ ...w, artistName: artistMap[w.artistId] })));
        }
      }

      setLoading(false);
    })();
  }, [id]);

  if (loading) return <Loading />;

  if (!exhibition) {
    return (
      <EmptyState
        icon="🔍"
        title="Exposición no encontrada"
        action={<Button onClick={() => navigate('/exhibitions')}>Volver</Button>}
      />
    );
  }

  const typeColors: Record<string, string> = {
    museo: 'bg-amber-100 text-amber-800',
    feria: 'bg-blue-100 text-blue-800',
    exposición: 'bg-green-100 text-green-800',
  };

  return (
    <div>
      <button
        onClick={() => navigate('/exhibitions')}
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
      >
        ← Volver
      </button>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-gray-900">{exhibition.name}</h1>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${typeColors[exhibition.type] || 'bg-gray-100 text-gray-800'}`}>
            {exhibition.type}
          </span>
        </div>
        <p className="text-sm text-gray-500">
          {new Date(exhibition.startDate).toLocaleDateString('es-ES')} — {new Date(exhibition.endDate).toLocaleDateString('es-ES')}
        </p>
        {exhibition.description && (
          <p className="text-sm text-gray-600 mt-2">{exhibition.description}</p>
        )}
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Obras participantes ({artworks.length})
      </h2>

      {artworks.length === 0 ? (
        <EmptyState icon="🖼️" title="Sin obras asignadas" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {artworks.map((artwork) => (
            <Card key={artwork.id}>
              <p className="font-medium text-gray-900">{artwork.title}</p>
              <p className="text-sm text-gray-500">{artwork.artistName} · {artwork.year}</p>
              <p className="text-xs text-gray-400 capitalize">{artwork.type} · {artwork.dimensions}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
