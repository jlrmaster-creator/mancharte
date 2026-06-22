import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { db } from '../db';
import { generateReport, generateExhibitionReport } from '../lib/pdf';
import type { Exhibition } from '../types';

export function Reports() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [selectedId, setSelectedId] = useState<number | ''>('');
  const [generating, setGenerating] = useState(false);
  const [generatingExhibition, setGeneratingExhibition] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    db.exhibitions.toArray().then(setExhibitions);
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setMessage(null);
    try {
      await generateReport();
      setMessage({ text: 'PDF generado correctamente', type: 'success' });
    } catch (err) {
      const text = err instanceof Error ? err.message : 'Error al generar el PDF';
      setMessage({ text, type: 'error' });
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateExhibition = async () => {
    if (!selectedId) return;
    setGeneratingExhibition(true);
    setMessage(null);
    try {
      await generateExhibitionReport(selectedId);
      setMessage({ text: 'PDF de exposición generado correctamente', type: 'success' });
    } catch (err) {
      const text = err instanceof Error ? err.message : 'Error al generar el PDF';
      setMessage({ text, type: 'error' });
    } finally {
      setGeneratingExhibition(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reportes</h1>

      {message && (
        <div
          className={`mb-4 px-4 py-2 rounded text-sm font-medium ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <Card className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Reporte General de Activos</h2>
        <p className="text-sm text-gray-500 mb-4">
          Genera un PDF con el resumen completo de todos los activos registrados: artistas, obras,
          obras expuestas por año y clasificación por tipo de evento.
        </p>
        <Button onClick={handleGenerate} disabled={generating}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {generating ? 'Generando...' : 'Descargar PDF General'}
        </Button>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Reporte por Exposición</h2>
        <p className="text-sm text-gray-500 mb-4">
          Selecciona una exposición para generar un PDF detallado con sus obras participantes,
          artista, año, tipo y dimensiones.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value ? Number(e.target.value) : '')}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          >
            <option value="">— Selecciona una exposición —</option>
            {exhibitions.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name} ({ex.closed ? 'Cerrada' : 'Abierta'})
              </option>
            ))}
          </select>
          <Button onClick={handleGenerateExhibition} disabled={!selectedId || generatingExhibition}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {generatingExhibition ? 'Generando...' : 'Generar PDF'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
