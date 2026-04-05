import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

/**
 * Módulo Profesional de Exportación (Excel & PDF)
 */

export const downloadExcel = (data: Array<Record<string, any>>, filename: string) => {
  if (!data || data.length === 0) return;

  const validData = data.filter(row => row !== null && typeof row === 'object');
  if (validData.length === 0) return;

  // Convert dates and objects into primitive strings for Excel
  const cleanData = validData.map(row => {
    const newRow: Record<string, any> = {};
    for (const key of Object.keys(row)) {
      let value = row[key];
      if (value instanceof Date) {
        newRow[key] = value.toLocaleDateString('es-CR');
      } else if (typeof value === 'object' && value !== null) {
        newRow[key] = JSON.stringify(value);
      } else {
        newRow[key] = value;
      }
    }
    return newRow;
  });

  const worksheet = XLSX.utils.json_to_sheet(cleanData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");
  
  // Create XLSX file and trigger download
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const downloadContractPDF = (contractInfo: any, propertyInfo: any, title: string) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header
  doc.setFontSize(22);
  doc.setTextColor(9, 121, 176); // Brand primary color (#0979b0)
  doc.setFont('helvetica', 'bold');
  doc.text('Plataforma de Arrendamientos CR', pageWidth / 2, y, { align: 'center' });
  
  y += 10;
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text('CONTRATO OFICIAL DE ARRENDAMIENTO', pageWidth / 2, y, { align: 'center' });

  y += 15;
  doc.setLineWidth(0.5);
  doc.setDrawColor(200, 200, 200);
  doc.line(20, y, pageWidth - 20, y);

  // Body
  y += 15;
  doc.setFontSize(16);
  doc.setTextColor(0, 65, 115); // Brand Dark (#004173)
  doc.text('1. Datos de la Propiedad', 20, y);

  y += 8;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.text(`Título: ${propertyInfo.titulo}`, 20, y); y += 6;
  doc.text(`Ubicación: ${propertyInfo.distrito}, ${propertyInfo.canton}, ${propertyInfo.provincia}`, 20, y); y += 6;
  
  const splitDescription = doc.splitTextToSize(`Descripción: ${propertyInfo.descripcion}`, pageWidth - 40);
  doc.text(splitDescription, 20, y);
  y += (splitDescription.length * 6) + 4;

  doc.setFontSize(16);
  doc.setTextColor(0, 65, 115);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Detalles del Contrato', 20, y);

  y += 8;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.text(`ID del Contrato: ${contractInfo.id}`, 20, y); y += 6;
  doc.text(`Inquilino: ${contractInfo.inquilinoNombre}`, 20, y); y += 6;
  doc.text(`Monto Mensual: ${contractInfo.monto}`, 20, y); y += 6;
  doc.text(`Fecha de Inicio: ${contractInfo.fechaInicio}`, 20, y); y += 6;
  doc.text(`Estado Legal: ${contractInfo.estado.toUpperCase()}`, 20, y); y += 12;

  doc.setFontSize(16);
  doc.setTextColor(0, 65, 115);
  doc.setFont('helvetica', 'bold');
  doc.text('3. Términos y Condiciones Básicos', 20, y);

  y += 8;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  const terms = [
    "Obligaciones del inquilino:",
    "- Pagar el monto de alquiler mensual dentro de los primeros 5 días de cada mes.",
    "- Mantener la propiedad en buen estado.",
    "- Notificar cualquier daño o reparación necesaria estructural.",
    "",
    "Derechos del inquilino:",
    "- Uso exclusivo de la propiedad durante el periodo de alquiler.",
    "- Privacidad y notificación previa para visitas del dueño.",
    "- Mantenimiento básico por parte del propietario."
  ];

  terms.forEach(term => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    const splitTerm = doc.splitTextToSize(term, pageWidth - 40);
    if(term.includes("Obligaciones") || term.includes("Derechos")) {
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }
    doc.text(splitTerm, 20, y);
    y += (splitTerm.length * 6);
  });

  // Footer footer
  if (y > 250) {
    doc.addPage();
    y = 20;
  } else {
    y += 20;
  }

  doc.setLineWidth(0.5);
  doc.setDrawColor(200, 200, 200);
  doc.line(20, y, pageWidth - 20, y);
  y += 10;
  
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Documento certificado digitalmente generado el ${new Date().toLocaleDateString('es-CR')} a través de la Plataforma de Arrendamientos CR.`, pageWidth / 2, y, { align: 'center' });

  doc.save(`${title}.pdf`);
};
