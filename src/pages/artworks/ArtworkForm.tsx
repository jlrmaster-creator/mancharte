import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { db } from '../../db';
import type { Artist } from '../../types';
import { useArtworkStore } from '../../store/artworkStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import { Loading } from '../../components/ui/Loading';

const schema = z.object({
  artistId: z.string().min(1, 'Selecciona un artista'),
  name: z.string().min(1, 'El nombre es obligatorio'),
  title: z.string().min(1, 'El título es obligatorio'),
  year: z.string().min(1, 'El año es obligatorio').regex(/^\d{4}$/, 'Año inválido (4 dígitos)'),
  type: z.string().min(1, 'Selecciona un tipo'),
  dimensions: z.string().min(1, 'Las dimensiones son obligatorias'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const artworkTypeOptions = [
  { value: 'pintura', label: 'Pintura' },
  { value: 'escultura', label: 'Escultura' },
  { value: 'fotografía', label: 'Fotografía' },
  { value: 'grabado', label: 'Grabado' },
  { value: 'dibujo', label: 'Dibujo' },
  { value: 'instalación', label: 'Instalación' },
  { value: 'arte digital', label: 'Arte Digital' },
  { value: 'otro', label: 'Otro' },
];

export function ArtworkForm() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const { addArtwork, updateArtwork } = useArtworkStore();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loadingArtists, setLoadingArtists] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      artistId: searchParams.get('artistId') || '',
      name: '',
      title: '',
      year: '',
      type: '',
      dimensions: '',
      description: '',
    },
  });

  useEffect(() => {
    (async () => {
      const all = await db.artists.toArray();
      setArtists(all);
      setLoadingArtists(false);

      if (isEdit && id) {
        const artwork = await db.artworks.get(Number(id));
        if (artwork) {
          reset({
            artistId: String(artwork.artistId),
            name: artwork.name,
            title: artwork.title,
            year: String(artwork.year),
            type: artwork.type,
            dimensions: artwork.dimensions,
            description: artwork.description || '',
          });
        }
      }
    })();
  }, [id, isEdit, reset, searchParams]);

  const onSubmit = async (data: FormData) => {
    const payload = {
      artistId: Number(data.artistId),
      name: data.name,
      title: data.title,
      year: Number(data.year),
      type: data.type as any,
      dimensions: data.dimensions,
      description: data.description || undefined,
    };

    if (isEdit && id) {
      await updateArtwork(Number(id), payload);
    } else {
      await addArtwork(payload);
    }
    navigate('/artworks');
  };

  if (loadingArtists) return <Loading />;

  return (
    <div>
      <button
        onClick={() => navigate('/artworks')}
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
      >
        ← Volver
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? 'Editar Obra' : 'Nueva Obra'}
      </h1>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select
            label="Artista"
            options={artists.map((a) => ({ value: String(a.id), label: a.name }))}
            placeholder="Seleccionar artista"
            error={errors.artistId?.message}
            {...register('artistId')}
          />

          <Input label="Nombre de la obra" placeholder="Ej: Sin título II" error={errors.name?.message} {...register('name')} />
          <Input label="Título" placeholder="Ej: Composición en azul" error={errors.title?.message} {...register('title')} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Año" type="number" placeholder="Ej: 2024" error={errors.year?.message} {...register('year')} />
            <Select label="Tipo de obra" options={artworkTypeOptions} placeholder="Seleccionar tipo" error={errors.type?.message} {...register('type')} />
          </div>

          <Input label="Dimensiones" placeholder="Ej: 100 x 80 cm" error={errors.dimensions?.message} {...register('dimensions')} />

          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">Descripción (opcional)</label>
            <textarea
              id="description"
              rows={3}
              placeholder="Breve descripción de la obra..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              {...register('description')}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear Obra'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate('/artworks')}>
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
