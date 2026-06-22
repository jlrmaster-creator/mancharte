import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useArtistStore } from '../../store/artistStore';
import { Card } from '../../components/ui/Card';
import { Loading } from '../../components/ui/Loading';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export function ArtistList() {
  const navigate = useNavigate();
  const { artists, loading, fetchArtists, deleteArtist } = useArtistStore();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  const filtered = artists.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (deleteId !== null) {
      await deleteArtist(deleteId);
      setDeleteId(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Artistas</h1>
        <Link to="/artists/new">
          <Button size="sm">+ Nuevo</Button>
        </Link>
      </div>

      <input
        type="text"
        placeholder="Buscar artista..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon="🎭"
          title={search ? 'Sin resultados' : 'No hay artistas'}
          description={search ? 'Prueba con otro término de búsqueda' : 'Crea tu primer artista para empezar'}
          action={
            !search ? (
              <Link to="/artists/new">
                <Button size="sm">Crear Artista</Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((artist) => (
            <Card key={artist.id} className="flex items-center justify-between">
              <div
                className="flex-1 cursor-pointer"
                onClick={() => navigate(`/artists/${artist.id}`)}
              >
                <p className="font-medium text-gray-900">{artist.name}</p>
                <p className="text-sm text-gray-500">{artist.email}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/artists/${artist.id}/edit`);
                  }}
                >
                  ✏️
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(artist.id!);
                  }}
                >
                  🗑️
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={deleteId !== null}
        title="Eliminar artista"
        message="¿Estás seguro? Esta acción eliminará también todas sus obras y no se puede deshacer."
        variant="danger"
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
