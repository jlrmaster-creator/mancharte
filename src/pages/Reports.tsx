import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { generateReport } from '../lib/pdf';

export function Reports() {
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generateReport();
    } catch (err) {
      console.error('Error generando PDF:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reportes</h1>

      <Card className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Reporte General de Activos</h2>
        <p className="text-sm text-gray-500 mb-4">
          Genera un documento PDF con el resumen completo de la gestión de activos artísticos,
          incluyendo el número total de artistas, obras, obras expuestas por año y clasificación
          por tipo de evento.
        </p>
        <Button onClick={handleGenerate} disabled={generating}>
          {generating ? 'Generando...' : 'Descargar PDF'}
        </Button>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Artistas</h3>
          <p className="text-2xl font-bold text-primary">—</p>
          <p className="text-xs text-gray-400 mt-1">Se calculará al generar</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Obras</h3>
          <p className="text-2xl font-bold text-primary">—</p>
          <p className="text-xs text-gray-400 mt-1">Se calculará al generar</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Exposiciones</h3>
          <p className="text-2xl font-bold text-primary">—</p>
          <p className="text-xs text-gray-400 mt-1">Se calculará al generar</p>
        </Card>
      </div>
    </div>
  );
}
