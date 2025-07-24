import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Button } from '@windmill/react-ui';
import api from '../../servicio/axio';

const BotonReportePersonas = () => {
  const generarReportePersonas = async () => {
    try {
      const [personasResponse] = await Promise.all([
        api.get('/api/personas'),
      ]);

      const personas = personasResponse.data;

      if (personas.length === 0) {
        console.log('No hay personas para mostrar en el reporte');
        return;
      }

      const doc = new jsPDF('p', 'mm', 'letter');
      const marginLeft = 20;
      const marginRight = 20;
      const marginTop = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      doc.setFont('helvetica');
      doc.setFontSize(12);

      doc.addImage('/bandera.jpg', 'PNG', pageWidth - marginRight - 16, marginTop, 17, 17);

      const encabezado = [
        'REPÚBLICA BOLIVARIANA DE VENEZUELA',
        'COMPLEJO EDUCATIVO JOSÉ ANTONIO PERÉZ',
      ];

      encabezado.forEach((linea, i) => {
        doc.text(linea, pageWidth / 2, marginTop + 5 + i * 5, { align: 'center' });
      });

      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('PERSONAS', pageWidth / 2, marginTop + 50, { align: 'center' });
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');

      autoTable(doc, {
        startY: marginTop + 60,
        head: [['Cédula', 'Nombre', 'Apellido', 'Cargo']],
        body: personas.map(persona => [
          persona.cedula, persona.nombePersona, persona.apellido, persona.nomreCargo
        ]),
        theme: 'grid',
        headStyles: {
          fillColor: [208, 227, 250], 
          textColor: 0,
          lineColor: 0,
          lineWidth: 0.2
        },
        styles: {
          textColor: 0,
          lineColor: 0,
          lineWidth: 0.2,
          fontSize: 12
        },
        margin: { left: marginLeft, right: marginRight }
      });

      const fecha = new Date();
      const fechaActual = `${fecha.getDate().toString().padStart(2, '0')}/${
        (fecha.getMonth() + 1).toString().padStart(2, '0')
      }/${fecha.getFullYear()}`;

      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        // Fecha en la parte inferior izquierda
        doc.text(`${fechaActual}`, marginLeft, pageHeight - 10);
        // Número de página en la parte inferior derecha
        doc.text(`Página ${i}`, pageWidth - marginRight, pageHeight - 10, {
          align: 'right',
        });
      }

      doc.save('ReportePersonas.pdf');
    } catch (error) {
      console.error('Error al generar el reporte:', error);
    }
  };

  return (
    <Button onClick={generarReportePersonas} className="btn btn-primary">
      Reporte de Personas
    </Button>
  );
};

export default BotonReportePersonas;