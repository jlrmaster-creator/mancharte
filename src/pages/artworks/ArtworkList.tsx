import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../../db';
import type { Artwork } from '../../types';
import { Card } from '../../components/ui/Card';
import { Loading } from '../../components/ui/Loading';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useArtworkStore } from '../../store/artworkStore';

export function ArtworkList() {
  const navigate = useNavigate();
  const { loading, fetchArtworks, deleteArtwork } = useArtworkStore();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [artistsMap, setArtistsMap] = useState<Record<number, string>>({});
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      await fetchArtworks();
      const allArtworks = await db.artworks.toArray();
      const allArtists = await db.artists.toArray();
      const map: Record<number, string> = {};
      allArtists.forEach((a) => { if (a.id) map[a.id] = a.name; });
      setArtworks(allArtworks);
      setArtistsMap(map);
    })();
  }, [fetchArtworks]);

  const filtered = artworks.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = !filterType || a.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDelete = async () => {
    if (deleteId !== null) {
      await deleteArtwork(deleteId);
      setArtworks((prev) => prev.filter((a) => a.id !== deleteId));
      setDeleteId(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Obras</h1>
        <Link to="/artworks/new">
          <Button size="sm">+ Nueva</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar obra..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Todos los tipos</option>
          <option value="pintura">Pintura</option>
          <option value="escultura">Escultura</option>
          <option value="fotografía">Fotografía</option>
          <option value="grabado">Grabado</option>
          <option value="dibujo">Dibujo</option>
          <option value="instalación">Instalación</option>
          <option value="arte digital">Arte Digital</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="🖼️"
          title={search || filterType ? 'Sin resultados' : 'No hay obras'}
          action={
            !search && !filterType ? (
              <Link to="/artworks/new">
                <Button size="sm">Crear Obra</Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((artwork) => (
            <Card key={artwork.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{artwork.title}</p>
                  <p className="text-sm text-gray-500">
                    {artistsMap[artwork.artistId] ?? 'Artista desconocido'} · {artwork.year}
                  </p>
                  <p className="text-xs text-gray-400 capitalize mt-0.5">
                    {artwork.type} · {artwork.dimensions}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/artworks/${artwork.id}/edit`)}
                  >
                    ✏️
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(artwork.id!)}
                  >
                    🗑️
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={deleteId !== null}
        title="Eliminar obra"
        message="¿Estás seguro? Esta acción no se puede deshacer."
        variant="danger"
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
