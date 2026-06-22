import { jsPDF } from 'jspdf';
import { applyPlugin } from 'jspdf-autotable';
import { db } from '../db';

applyPlugin(jsPDF);

async function downloadPDF(doc: jsPDF, filename: string) {
  if (typeof navigator.share === 'function') {
    try {
      const blob = doc.output('blob');
      const file = new File([blob], filename, { type: 'application/pdf' });
      await navigator.share({ files: [file], title: 'Mancharte' });
      return;
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
    }
  }

  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);

  try {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } catch {
    try {
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch {
      URL.revokeObjectURL(url);
      doc.save(filename);
    }
  }
}

export async function generateReport() {
  const artists = await db.artists.toArray();
  const artworks = await db.artworks.toArray();
  const exhibitions = await db.exhibitions.toArray();
  const links = await db.exhibitionArtworks.toArray();

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(22);
  doc.text('Mancharte', pageWidth / 2, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.text('Reporte de Gestión de Activos Artísticos', pageWidth / 2, 30, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`Generado el ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageWidth / 2, 38, { align: 'center' });

  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.5);
  doc.line(14, 42, pageWidth - 14, 42);

  let y = 52;

  doc.setFontSize(16);
  doc.text('Resumen General', 14, y);
  y += 10;

  doc.setFontSize(11);
  doc.text(`Total de artistas: ${artists.length}`, 20, y);
  y += 7;
  doc.text(`Total de obras: ${artworks.length}`, 20, y);
  y += 7;
  doc.text(`Total de exposiciones: ${exhibitions.length}`, 20, y);
  y += 14;

  doc.setFontSize(16);
  doc.text('Obras Expuestas por Año', 14, y);
  y += 10;

  const worksByYear: Record<number, number> = {};
  const exhibitedArtworkIds = new Set(links.map((l) => l.artworkId));
  artworks.forEach((a) => {
    if (exhibitedArtworkIds.has(a.id!)) {
      worksByYear[a.year] = (worksByYear[a.year] || 0) + 1;
    }
  });

  const yearRows = Object.entries(worksByYear)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, count]) => [year, String(count)]);

  if (yearRows.length > 0) {
    (doc as any).autoTable({
      startY: y,
      head: [['Año', 'Obras Expuestas']],
      body: yearRows,
      theme: 'striped',
      headStyles: { fillColor: [30, 41, 59] },
      styles: { fontSize: 10 },
      margin: { left: 14 },
    });
    y = (doc as any).lastAutoTable.finalY + 14;
  } else {
    doc.text('No hay obras registradas en exposiciones.', 20, y);
    y += 14;
  }

  doc.setFontSize(16);
  doc.text('Clasificación por Tipo de Evento', 14, y);
  y += 10;

  const byType: Record<string, number> = {};
  exhibitions.forEach((e) => {
    byType[e.type] = (byType[e.type] || 0) + 1;
  });

  const typeRows = Object.entries(byType).map(([type, count]) => [type, String(count)]);

  if (typeRows.length > 0) {
    (doc as any).autoTable({
      startY: y,
      head: [['Tipo de Evento', 'Cantidad']],
      body: typeRows,
      theme: 'striped',
      headStyles: { fillColor: [30, 41, 59] },
      styles: { fontSize: 10 },
      margin: { left: 14 },
    });
    y = (doc as any).lastAutoTable.finalY + 14;
  } else {
    doc.text('No hay exposiciones registradas.', 20, y);
    y += 14;
  }

  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text('Mancharte — Gestión de Activos Artísticos', pageWidth / 2, 290, { align: 'center' });

  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  await downloadPDF(doc, `reporte-mancharte-${ts}.pdf`);
}

export async function generateExhibitionReport(exhibitionId: number) {
  const exhibition = await db.exhibitions.get(exhibitionId);
  if (!exhibition) throw new Error('Exposición no encontrada');

  const links = await db.exhibitionArtworks.where('exhibitionId').equals(exhibitionId).toArray();
  const artworkIds = links.map((l) => l.artworkId);
  const artworks = artworkIds.length > 0
    ? await db.artworks.where('id').anyOf(artworkIds).toArray()
    : [];

  const allArtists = await db.artists.toArray();
  const artistMap: Record<number, string> = {};
  allArtists.forEach((a) => { if (a.id) artistMap[a.id] = a.name; });

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(22);
  doc.text('Mancharte', pageWidth / 2, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.text(exhibition.name, pageWidth / 2, 30, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`Generado el ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageWidth / 2, 38, { align: 'center' });

  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.5);
  doc.line(14, 42, pageWidth - 14, 42);

  let y = 52;

  doc.setFontSize(16);
  doc.text('Detalles de la Exposición', 14, y);
  y += 10;

  doc.setFontSize(11);
  doc.text(`Tipo: ${exhibition.type.charAt(0).toUpperCase() + exhibition.type.slice(1)}`, 20, y);
  y += 7;
  doc.text(`Fechas: ${new Date(exhibition.startDate).toLocaleDateString('es-ES')} — ${new Date(exhibition.endDate).toLocaleDateString('es-ES')}`, 20, y);
  y += 7;
  if (exhibition.description) {
    const lines = doc.splitTextToSize(exhibition.description, pageWidth - 40);
    doc.text(`Descripción: ${lines[0]}`, 20, y);
    y += 7;
    for (let i = 1; i < lines.length; i++) {
      doc.text(lines[i], 48, y);
      y += 7;
    }
  }
  doc.text(`Estado: ${exhibition.closed ? 'Cerrada' : 'Abierta'}`, 20, y);
  y += 14;

  doc.setFontSize(16);
  doc.text(`Obras Participantes (${artworks.length})`, 14, y);
  y += 10;

  if (artworks.length > 0) {
    const body = artworks.map((a) => [
      a.title,
      artistMap[a.artistId] || '—',
      String(a.year),
      a.type,
      a.dimensions,
    ]);

    (doc as any).autoTable({
      startY: y,
      head: [['Título', 'Artista', 'Año', 'Tipo', 'Dimensiones']],
      body,
      theme: 'striped',
      headStyles: { fillColor: [30, 41, 59] },
      styles: { fontSize: 9 },
      margin: { left: 14 },
    });
    y = (doc as any).lastAutoTable.finalY + 14;
  } else {
    doc.text('No hay obras asignadas a esta exposición.', 20, y);
    y += 14;
  }

  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text('Mancharte — Gestión de Activos Artísticos', pageWidth / 2, 290, { align: 'center' });

  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const safeName = exhibition.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  await downloadPDF(doc, `exposicion-${safeName}-${ts}.pdf`);
}
