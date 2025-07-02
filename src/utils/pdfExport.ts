
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportPosterToPDF = async (elementId: string, filename: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    const canvas = await html2canvas(element, {
      scale: 3, // Higher resolution for professional quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: null, // Preserve transparency
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight
    });

    const imgData = canvas.toDataURL('image/png', 1.0); // Highest quality
    
    // Calculate optimal PDF dimensions based on content
    const aspectRatio = canvas.width / canvas.height;
    const isLandscape = aspectRatio > 1;
    
    const pdf = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: false
    });

    const pageWidth = isLandscape ? 297 : 210;
    const pageHeight = isLandscape ? 210 : 297;
    
    // Calculate image dimensions to fit page while maintaining aspect ratio
    let imgWidth = pageWidth;
    let imgHeight = pageWidth / aspectRatio;
    
    if (imgHeight > pageHeight) {
      imgHeight = pageHeight;
      imgWidth = pageHeight * aspectRatio;
    }
    
    // Center the image on the page
    const xOffset = (pageWidth - imgWidth) / 2;
    const yOffset = (pageHeight - imgHeight) / 2;

    pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight, undefined, 'FAST');
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('PDF export error:', error);
    throw error;
  }
};

export const exportPosterToImage = async (elementId: string, filename: string, format: 'png' | 'jpg' = 'png') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    const canvas = await html2canvas(element, {
      scale: 4, // Very high resolution for print quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: format === 'jpg' ? '#ffffff' : null,
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight
    });

    // Create download link
    const link = document.createElement('a');
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    const quality = format === 'jpg' ? 0.95 : 1.0;
    
    link.download = filename.replace('.pdf', `.${format}`);
    link.href = canvas.toDataURL(mimeType, quality);
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Image export error:', error);
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
