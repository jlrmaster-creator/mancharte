import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useArtistStore } from '../../store/artistStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

const schema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  phone: z.string().min(1, 'El teléfono es obligatorio'),
  email: z.string().email('Email inválido'),
});

type FormData = z.infer<typeof schema>;

export function ArtistForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const { addArtist, updateArtist } = useArtistStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', phone: '', email: '' },
  });

  useEffect(() => {
    if (isEdit && id) {
      useArtistStore.getState().fetchArtists().then(() => {
        const artist = useArtistStore.getState().artists.find((a) => a.id === Number(id));
        if (artist) {
          reset({ name: artist.name, phone: artist.phone, email: artist.email });
        }
      });
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (data: FormData) => {
    if (isEdit && id) {
      await updateArtist(Number(id), data);
    } else {
      await addArtist(data);
    }
    navigate('/artists');
  };

  return (
    <div>
      <button
        onClick={() => navigate('/artists')}
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
      >
        ← Volver
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? 'Editar Artista' : 'Nuevo Artista'}
      </h1>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nombre completo"
            placeholder="Ej: María García López"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Teléfono"
            type="tel"
            placeholder="Ej: +34 612 345 678"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="Ej: maria@ejemplo.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear Artista'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate('/artists')}>
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
