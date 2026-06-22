import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { db } from '../db';

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
  doc.save(`reporte-mancharte-${ts}.pdf`);
}
