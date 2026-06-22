import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../../db';
import type { Artist, Artwork } from '../../types';
import { Card } from '../../components/ui/Card';
import { Loading } from '../../components/ui/Loading';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';

export function ArtistDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const a = await db.artists.get(Number(id));
      setArtist(a ?? null);
      if (a) {
        const works = await db.artworks.where('artistId').equals(a.id!).toArray();
        setArtworks(works);
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <Loading />;

  if (!artist) {
    return (
      <EmptyState
        icon="🔍"
        title="Artista no encontrado"
        action={<Button onClick={() => navigate('/artists')}>Volver</Button>}
      />
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate('/artists')}
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
      >
        ← Volver
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{artist.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{artist.email} · {artist.phone}</p>
        </div>
        <Link to={`/artists/${artist.id}/edit`}>
          <Button variant="ghost" size="sm">✏️ Editar</Button>
        </Link>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Obras ({artworks.length})</h2>
        <Link to={`/artworks/new?artistId=${artist.id}`}>
          <Button size="sm">+ Añadir Obra</Button>
        </Link>
      </div>

      {artworks.length === 0 ? (
        <EmptyState
          icon="🖼️"
          title="Sin obras"
          description="Este artista aún no tiene obras registradas"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {artworks.map((artwork) => (
            <Card key={artwork.id}>
              <p className="font-medium text-gray-900">{artwork.title}</p>
              <p className="text-sm text-gray-500">{artwork.name} · {artwork.year}</p>
              <p className="text-xs text-gray-400 capitalize">{artwork.type} · {artwork.dimensions}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
