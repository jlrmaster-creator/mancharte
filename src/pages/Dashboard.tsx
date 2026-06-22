import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../db';

export function Dashboard() {
  const [stats, setStats] = useState({ artists: 0, artworks: 0, exhibitions: 0 });
  const [closedCount, setClosedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [artists, artworks, exhibitions, closedExhibitions] = await Promise.all([
        db.artists.count(),
        db.artworks.count(),
        db.exhibitions.count(),
        db.exhibitions.where('closed').equals(1).count(),
      ]);
      setStats({ artists, artworks, exhibitions });
      setClosedCount(closedExhibitions);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="relative min-h-[calc(100dvh-6rem)] flex flex-col">
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <circle cx="100" cy="80" r="120" fill="#1e293b" />
        <circle cx="700" cy="150" r="180" fill="#1e293b" />
        <rect x="50" y="400" width="200" height="200" rx="20" fill="#1e293b" transform="rotate(15 150 500)" />
        <rect x="600" y="420" width="150" height="150" rx="30" fill="#1e293b" transform="rotate(-20 675 495)" />
        <path d="M350 50 Q500 200 650 80" stroke="#1e293b" strokeWidth="4" fill="none" />
        <path d="M150 250 Q300 400 500 250" stroke="#1e293b" strokeWidth="3" fill="none" />
        <circle cx="400" cy="350" r="100" fill="none" stroke="#1e293b" strokeWidth="2" />
        <circle cx="400" cy="350" r="60" fill="none" stroke="#1e293b" strokeWidth="1" />
      </svg>

      <div className="relative flex-1">
        <div className="mb-4">
          <h1 className="text-lg font-bold text-gray-900">Bienvenido a Mancharte App</h1>
          <p className="text-xs text-gray-500 mt-0.5">Gestión de Exposiciones y Activos Artísticos</p>
          <div className="mt-2 h-px bg-gradient-to-r from-primary/20 via-primary/40 to-transparent" />
        </div>

        {loading ? (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-2">
                <div className="animate-pulse h-8 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 mb-4">
            <Link to="/artists" className="block">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2 hover:shadow-md transition-shadow">
                <p className="text-[10px] text-gray-500 mb-0.5">Artistas</p>
                <p className="text-lg font-bold text-primary">{stats.artists}</p>
              </div>
            </Link>
            <Link to="/artworks" className="block">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2 hover:shadow-md transition-shadow">
                <p className="text-[10px] text-gray-500 mb-0.5">Obras</p>
                <p className="text-lg font-bold text-primary">{stats.artworks}</p>
              </div>
            </Link>
            <Link to="/exhibitions" className="block">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2 hover:shadow-md transition-shadow">
                <p className="text-[10px] text-gray-500 mb-0.5">Exposiciones</p>
                <p className="text-lg font-bold text-primary">{stats.exhibitions}</p>
                {closedCount > 0 && (
                  <p className="text-[10px] text-red-500">{closedCount} cerrada{closedCount > 1 ? 's' : ''}</p>
                )}
              </div>
            </Link>
          </div>
        )}

        <div className="flex gap-2 mb-4">
          <Link
            to="/artists/new"
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-primary text-white rounded-md text-[11px] font-medium hover:bg-primary-dark transition-colors"
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="10" y1="10" x2="14" y2="10" />
            </svg>
            Artista
          </Link>
          <Link
            to="/artworks/new"
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-primary text-white rounded-md text-[11px] font-medium hover:bg-primary-dark transition-colors"
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            Obra
          </Link>
          <Link
            to="/exhibitions/new"
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-primary text-white rounded-md text-[11px] font-medium hover:bg-primary-dark transition-colors"
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m16-11v11M8 14v3m4-3v3m4-3v3" />
            </svg>
            Exposición
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <svg className="w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <h2 className="text-xs font-semibold text-gray-900">Reportes</h2>
            </div>
            <p className="text-[11px] text-gray-500 mb-2">
              Genera PDFs con el resumen general o por exposición. Exporta y comparte tus informes.
            </p>
            <Link
              to="/reports"
              className="inline-flex items-center gap-1 py-1 px-2 bg-primary text-white rounded-md text-[11px] font-medium hover:bg-primary-dark transition-colors"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Ir a Reportes
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <svg className="w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <h2 className="text-xs font-semibold text-gray-900">Acerca de</h2>
            </div>
            <p className="text-[11px] text-gray-500 mb-1">
              Mancharte es una aplicación para gestionar artistas, obras y exposiciones de forma sencilla.
            </p>
            <p className="text-[11px] text-gray-400">
              <strong>Consejos:</strong> Usa "Cerrar exposición" para inmovilizar una exposición y generar su PDF final. Las obras se asignan al crear o editar una exposición.
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-6 pt-3 border-t border-gray-200">
        <p className="text-[10px] text-gray-400 text-center">
          Created by José López-Romero Moraleda · v{__APP_VERSION__}
        </p>
      </div>
    </div>
  );
}
