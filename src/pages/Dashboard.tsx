import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../db';
import { Card } from '../components/ui/Card';

export function Dashboard() {
  const [stats, setStats] = useState({ artists: 0, artworks: 0, exhibitions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [artists, artworks, exhibitions] = await Promise.all([
        db.artists.count(),
        db.artworks.count(),
        db.exhibitions.count(),
      ]);
      setStats({ artists, artworks, exhibitions });
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <div className="animate-pulse h-16 bg-gray-100 rounded" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link to="/artists">
            <Card className="hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-500 mb-1">Artistas</p>
              <p className="text-3xl font-bold text-primary">{stats.artists}</p>
            </Card>
          </Link>
          <Link to="/artworks">
            <Card className="hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-500 mb-1">Obras</p>
              <p className="text-3xl font-bold text-primary">{stats.artworks}</p>
            </Card>
          </Link>
          <Link to="/exhibitions">
            <Card className="hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-500 mb-1">Exposiciones</p>
              <p className="text-3xl font-bold text-primary">{stats.exhibitions}</p>
            </Card>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Acceso Rápido</h2>
          <div className="space-y-2">
            <Link to="/artists/new" className="block w-full text-center py-2 px-4 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
              + Nuevo Artista
            </Link>
            <Link to="/artworks/new" className="block w-full text-center py-2 px-4 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
              + Nueva Obra
            </Link>
            <Link to="/exhibitions/new" className="block w-full text-center py-2 px-4 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
              + Nueva Exposición
            </Link>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Reportes</h2>
          <p className="text-sm text-gray-500 mb-4">
            Genera un PDF con el resumen completo de todos los activos registrados.
          </p>
          <Link to="/reports" className="inline-block py-2 px-4 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
            Ir a Reportes
          </Link>
        </Card>
      </div>
    </div>
  );
}
