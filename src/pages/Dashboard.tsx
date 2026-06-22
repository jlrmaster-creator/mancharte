import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../db';

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
    <div className="relative min-h-0">
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <circle cx="100" cy="80" r="120" fill="#4f46e5" />
        <circle cx="700" cy="150" r="180" fill="#4f46e5" />
        <rect x="50" y="400" width="200" height="200" rx="20" fill="#4f46e5" transform="rotate(15 150 500)" />
        <rect x="600" y="420" width="150" height="150" rx="30" fill="#4f46e5" transform="rotate(-20 675 495)" />
        <path d="M350 50 Q500 200 650 80" stroke="#4f46e5" strokeWidth="4" fill="none" />
        <path d="M150 250 Q300 400 500 250" stroke="#4f46e5" strokeWidth="3" fill="none" />
        <circle cx="400" cy="350" r="100" fill="none" stroke="#4f46e5" strokeWidth="2" />
        <circle cx="400" cy="350" r="60" fill="none" stroke="#4f46e5" strokeWidth="1" />
      </svg>

      <div className="relative">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Dashboard</h1>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
                <div className="animate-pulse h-12 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <Link to="/artists" className="block">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 hover:shadow-md transition-shadow">
                <p className="text-xs text-gray-500 mb-0.5">Artistas</p>
                <p className="text-2xl font-bold text-primary">{stats.artists}</p>
              </div>
            </Link>
            <Link to="/artworks" className="block">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 hover:shadow-md transition-shadow">
                <p className="text-xs text-gray-500 mb-0.5">Obras</p>
                <p className="text-2xl font-bold text-primary">{stats.artworks}</p>
              </div>
            </Link>
            <Link to="/exhibitions" className="block">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 hover:shadow-md transition-shadow">
                <p className="text-xs text-gray-500 mb-0.5">Exposiciones</p>
                <p className="text-2xl font-bold text-primary">{stats.exhibitions}</p>
              </div>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Acceso Rápido</h2>
            <div className="space-y-2">
              <Link
                to="/artists/new"
                className="block text-center py-1.5 px-3 bg-primary text-white rounded-md text-xs font-medium hover:bg-primary-dark transition-colors"
              >
                + Nuevo Artista
              </Link>
              <Link
                to="/artworks/new"
                className="block text-center py-1.5 px-3 bg-primary text-white rounded-md text-xs font-medium hover:bg-primary-dark transition-colors"
              >
                + Nueva Obra
              </Link>
              <Link
                to="/exhibitions/new"
                className="block text-center py-1.5 px-3 bg-primary text-white rounded-md text-xs font-medium hover:bg-primary-dark transition-colors"
              >
                + Nueva Exposición
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">Reportes</h2>
            <p className="text-xs text-gray-500 mb-3">
              Genera un PDF con el resumen completo de todos los activos registrados.
            </p>
            <Link
              to="/reports"
              className="inline-block py-1.5 px-3 bg-primary text-white rounded-md text-xs font-medium hover:bg-primary-dark transition-colors"
            >
              Ir a Reportes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
