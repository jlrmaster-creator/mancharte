import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { db } from '../../db';
import type { Artwork } from '../../types';
import { useExhibitionStore } from '../../store/exhibitionStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import { Loading } from '../../components/ui/Loading';

const schema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  type: z.string().min(1, 'Selecciona un tipo de evento'),
  startDate: z.string().min(1, 'La fecha de inicio es obligatoria'),
  endDate: z.string().min(1, 'La fecha de fin es obligatoria'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const exhibitionTypeOptions = [
  { value: 'museo', label: 'Museo' },
  { value: 'feria', label: 'Feria' },
  { value: 'exposición', label: 'Exposición' },
];

export function ExhibitionForm() {
  const navigate = useNavigate();
  const { addExhibition } = useExhibitionStore();
  const [artworks, setArtworks] = useState<(Artwork & { artistName?: string })[]>([]);
  const [selectedArtworkIds, setSelectedArtworkIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      type: '',
      startDate: '',
      endDate: '',
      description: '',
    },
  });

  useEffect(() => {
    (async () => {
      const all = await db.artworks.toArray();
      const allArtists = await db.artists.toArray();
      const artistMap: Record<number, string> = {};
      allArtists.forEach((a) => { if (a.id) artistMap[a.id] = a.name; });
      setArtworks(all.map((aw) => ({ ...aw, artistName: artistMap[aw.artistId] })));
      setLoading(false);
    })();
  }, []);

  const toggleArtwork = (id: number) => {
    setSelectedArtworkIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const onSubmit = async (data: FormData) => {
    await addExhibition(
      {
        name: data.name,
        type: data.type as any,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        description: data.description || undefined,
      },
      selectedArtworkIds
    );
    navigate('/exhibitions');
  };

  if (loading) return <Loading />;

  return (
    <div>
      <button
        onClick={() => navigate('/exhibitions')}
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
      >
        ← Volver
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nueva Exposición</h1>

      <div className="space-y-6">
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Nombre del evento" placeholder="Ej: Bienal de Venecia" error={errors.name?.message} {...register('name')} />
            <Select label="Tipo de evento" options={exhibitionTypeOptions} placeholder="Seleccionar tipo" error={errors.type?.message} {...register('type')} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Fecha de inicio" type="date" error={errors.startDate?.message} {...register('startDate')} />
              <Input label="Fecha de fin" type="date" error={errors.endDate?.message} {...register('endDate')} />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="description" className="text-sm font-medium text-gray-700">Descripción (opcional)</label>
              <textarea
                id="description"
                rows={3}
                placeholder="Breve descripción del evento..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                {...register('description')}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Crear Exposición'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => navigate('/exhibitions')}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Obras participantes</h2>
          {artworks.length === 0 ? (
            <p className="text-sm text-gray-500">No hay obras disponibles. Crea obras primero.</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {artworks.map((artwork) => (
                <label
                  key={artwork.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedArtworkIds.includes(artwork.id!)
                      ? 'border-primary bg-primary-light'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedArtworkIds.includes(artwork.id!)}
                    onChange={() => toggleArtwork(artwork.id!)}
                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{artwork.title}</p>
                    <p className="text-xs text-gray-500">{artwork.artistName} · {artwork.year}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
