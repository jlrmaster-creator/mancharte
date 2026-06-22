import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useExhibitionStore } from '../../store/exhibitionStore';
import { Card } from '../../components/ui/Card';
import { Loading } from '../../components/ui/Loading';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export function ExhibitionList() {
  const navigate = useNavigate();
  const { exhibitions, loading, fetchExhibitions, deleteExhibition } = useExhibitionStore();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchExhibitions();
  }, [fetchExhibitions]);

  const handleDelete = async () => {
    if (deleteId !== null) {
      await deleteExhibition(deleteId);
      setDeleteId(null);
    }
  };

  const typeColors: Record<string, string> = {
    museo: 'bg-amber-100 text-amber-800',
    feria: 'bg-blue-100 text-blue-800',
    exposición: 'bg-green-100 text-green-800',
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Exposiciones</h1>
        <Link to="/exhibitions/new">
          <Button size="sm">+ Nueva</Button>
        </Link>
      </div>

      {exhibitions.length === 0 ? (
        <EmptyState
          icon="🏛️"
          title="No hay exposiciones"
          description="Registra la primera exposición para empezar"
          action={
            <Link to="/exhibitions/new">
              <Button size="sm">Crear Exposición</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-2">
          {exhibitions.map((exhibition) => (
            <Card
              key={exhibition.id}
              className="flex items-center justify-between"
            >
              <div
                className="flex-1 cursor-pointer"
                onClick={() => navigate(`/exhibitions/${exhibition.id}`)}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-medium text-gray-900">{exhibition.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${typeColors[exhibition.type] || 'bg-gray-100 text-gray-800'}`}>
                    {exhibition.type}
                  </span>
                  {exhibition.closed && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-50 text-red-600">
                      Cerrada
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(exhibition.startDate).toLocaleDateString('es-ES')} — {new Date(exhibition.endDate).toLocaleDateString('es-ES')}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteId(exhibition.id!);
                }}
              >
                🗑️
              </Button>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={deleteId !== null}
        title="Eliminar exposición"
        message="¿Estás seguro? Esta acción no se puede deshacer."
        variant="danger"
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
