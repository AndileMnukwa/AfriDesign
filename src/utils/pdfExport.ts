
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportPosterToPDF = async (elementId: string, filename: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('PDF export error:', error);
    throw error;
  }
};

export const exportInvoiceToPDF = async (invoiceData: any) => {
  try {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(24);
    pdf.setTextColor(40, 40, 40);
    pdf.text('INVOICE', 20, 30);
    
    pdf.setFontSize(12);
    pdf.text(`#${invoiceData.invoiceNumber}`, 20, 40);
    pdf.text(`Date: ${invoiceData.date}`, 150, 40);
    
    // Business Info
    pdf.setFontSize(14);
    pdf.text('FROM:', 20, 60);
    pdf.setFontSize(12);
    pdf.text(invoiceData.businessInfo.name, 20, 70);
    if (invoiceData.businessInfo.contact) {
      pdf.text(invoiceData.businessInfo.contact, 20, 80);
    }
    if (invoiceData.businessInfo.address) {
      pdf.text(invoiceData.businessInfo.address, 20, 90);
    }
    
    // Client Info
    pdf.setFontSize(14);
    pdf.text('TO:', 120, 60);
    pdf.setFontSize(12);
    pdf.text(invoiceData.clientInfo.name, 120, 70);
    if (invoiceData.clientInfo.contact) {
      pdf.text(invoiceData.clientInfo.contact, 120, 80);
    }
    if (invoiceData.clientInfo.address) {
      pdf.text(invoiceData.clientInfo.address, 120, 90);
    }
    
    // Items table
    let yPosition = 110;
    pdf.setFontSize(12);
    pdf.text('Description', 20, yPosition);
    pdf.text('Qty', 120, yPosition);
    pdf.text('Price', 140, yPosition);
    pdf.text('Total', 170, yPosition);
    
    yPosition += 10;
    pdf.line(20, yPosition, 190, yPosition);
    
    invoiceData.items.forEach((item: any) => {
      yPosition += 10;
      pdf.text(item.description, 20, yPosition);
      pdf.text(item.quantity.toString(), 120, yPosition);
      pdf.text(`R${item.price.toFixed(2)}`, 140, yPosition);
      pdf.text(`R${(item.quantity * item.price).toFixed(2)}`, 170, yPosition);
    });
    
    // Total
    yPosition += 20;
    pdf.setFontSize(14);
    pdf.text(`TOTAL: R${invoiceData.total.toFixed(2)}`, 140, yPosition);
    
    // Notes
    if (invoiceData.notes) {
      yPosition += 20;
      pdf.setFontSize(12);
      pdf.text('Notes:', 20, yPosition);
      yPosition += 10;
      const splitNotes = pdf.splitTextToSize(invoiceData.notes, 170);
      pdf.text(splitNotes, 20, yPosition);
    }
    
    pdf.save(`invoice-${invoiceData.invoiceNumber}.pdf`);
    return true;
  } catch (error) {
    console.error('Invoice PDF export error:', error);
    throw error;
  }
};
