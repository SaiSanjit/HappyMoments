import { jsPDF } from 'jspdf';
import { InvoiceQuotation } from './invoiceService';
import { getVendorBrandLogoFromStorage } from './supabaseStorageService';

export interface PDFOptions {
  format?: 'A4' | 'A3' | 'Letter';
  orientation?: 'portrait' | 'landscape';
  margin?: number;
  fontSize?: number;
  fontFamily?: string;
}

// Helper function to convert image URL to base64
const convertImageUrlToBase64 = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Crucial to prevent CORS issues
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        try {
          const dataURL = canvas.toDataURL('image/png');
          resolve(dataURL);
        } catch (e) {
          reject(e);
        }
      } else {
        reject(new Error('Failed to get 2D context'));
      }
    };
    img.onerror = (err) => {
      reject(err);
    };
    img.src = url;
  });
};

export const generateInvoiceQuotationPDF = async (
  invoiceQuotation: InvoiceQuotation,
  vendor: any,
  options: PDFOptions = {}
): Promise<Blob> => {
  const {
    format = 'A4',
    orientation = 'portrait',
    margin = 20,
    fontSize = 12,
    fontFamily = 'helvetica'
  } = options;

  // Create new PDF document
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - (margin * 2);

  let yPosition = margin;

  // Helper function to add text with word wrapping and proper alignment
  const addText = (text: any, x: number, y: number, options: any = {}) => {
    const { fontSize: textSize = fontSize, fontStyle = 'normal', color = '#000000', align = 'left' } = options;
    
    doc.setFontSize(textSize);
    doc.setFont(fontFamily, fontStyle);
    doc.setTextColor(color);
    
    const textStr = text !== undefined && text !== null ? String(text) : '';
    
    if (align === 'center') {
      doc.text(textStr, x, y, { align: 'center' });
    } else if (align === 'right') {
      doc.text(textStr, x, y, { align: 'right' });
    } else {
      doc.text(textStr, x, y);
    }
  };

  // Helper function to add line
  const addLine = (x1: number, y1: number, x2: number, y2: number, color = '#cbd5e0') => {
    doc.setDrawColor(color);
    doc.line(x1, y1, x2, y2);
  };

  // Helper function to add rectangle
  const addRect = (x: number, y: number, width: number, height: number, color = '#f9fafb') => {
    doc.setFillColor(color);
    doc.rect(x, y, width, height, 'F');
  };

  // Fetch brand logo URL from storage
  let logoUrl = vendor.brand_logo_url || null;
  if (!logoUrl && vendor.vendor_id) {
    try {
      logoUrl = await getVendorBrandLogoFromStorage(vendor.vendor_id);
    } catch (e) {
      console.error('Error fetching brand logo:', e);
    }
  }

  let logoBase64: string | null = null;
  if (logoUrl) {
    try {
      logoBase64 = await convertImageUrlToBase64(logoUrl);
    } catch (e) {
      console.error('Error converting logo to base64:', e);
    }
  }

  // Left side info (Business details)
  let leftY = margin;
  addText(vendor.brand_name || 'Your Business Name', margin, leftY, {
    fontSize: 20,
    fontStyle: 'bold',
    color: '#061D49'
  });
  leftY += 7.5;

  const vendorCategory = Array.isArray(vendor.categories || vendor.category) 
    ? (vendor.categories || vendor.category).join(' & ') 
    : (vendor.category || '');
  if (vendorCategory) {
    addText(vendorCategory, margin, leftY, { fontSize: 10, fontStyle: 'bold', color: '#4a5568' });
    leftY += 5;
  }

  const addressStr = vendor.address || '';
  const addressLines = doc.splitTextToSize(addressStr, 80);
  addressLines.slice(0, 3).forEach((line: string) => {
    addText(line, margin, leftY, { fontSize: 9, color: '#4a5568' });
    leftY += 4.2;
  });

  const vendorPhone = vendor.phone_number || vendor.whatsapp_number || '';
  if (vendorPhone) {
    addText(`Phone: ${vendorPhone}`, margin, leftY, { fontSize: 9, color: '#4a5568' });
    leftY += 4.2;
  }
  if (vendor.email) {
    addText(`Email: ${vendor.email}`, margin, leftY, { fontSize: 9, color: '#4a5568' });
    leftY += 4.2;
  }

  // Right side info (Document details)
  let rightY = margin + 2;
  addText(invoiceQuotation.type === 'invoice' ? 'INVOICE' : 'QUOTATION', pageWidth - margin, rightY, {
    fontSize: 22,
    fontStyle: 'bold',
    color: '#061D49',
    align: 'right'
  });
  rightY += 8.5;
  addText(`Number: ${invoiceQuotation.number}`, pageWidth - margin, rightY, {
    fontSize: 10,
    fontStyle: 'bold',
    color: '#4a5568',
    align: 'right'
  });
  rightY += 5.5;
  addText(`Date: ${formatDate(invoiceQuotation.date)}`, pageWidth - margin, rightY, {
    fontSize: 9.5,
    color: '#4a5568',
    align: 'right'
  });
  if (invoiceQuotation.type === 'invoice') {
    rightY += 5.5;
    addText(`Due Date: ${formatDate(invoiceQuotation.date)}`, pageWidth - margin, rightY, {
      fontSize: 9.5,
      color: '#4a5568',
      align: 'right'
    });
  }

  // Divider line under header
  yPosition = Math.max(leftY, rightY) + 6;
  addLine(margin, yPosition, pageWidth - margin, yPosition, '#cbd5e0');
  yPosition += 8;

  // Bill To Section
  addText(invoiceQuotation.type === 'invoice' ? 'Bill To:' : 'Quote To:', margin, yPosition, {
    fontSize: 12,
    fontStyle: 'bold',
    color: '#061D49'
  });
  yPosition += 5;

  const rectStartY = yPosition;
  const hasEmail = !!invoiceQuotation.customer_email;
  const rectHeight = hasEmail ? 24 : 18;
  addRect(margin, rectStartY, contentWidth, rectHeight, '#f9fafb');
  
  // Outer border for the Bill To card, to look premium
  doc.setDrawColor('#e2e8f0');
  doc.setLineWidth(0.3);
  doc.rect(margin, rectStartY, contentWidth, rectHeight);
  
  addText(invoiceQuotation.customer_name, margin + 5, rectStartY + 6, {
    fontSize: 10.5,
    fontStyle: 'bold',
    color: '#061D49'
  });
  
  addText(invoiceQuotation.customer_mobile, margin + 5, rectStartY + 11.5, {
    fontSize: 9.5,
    color: '#4a5568'
  });
  
  if (hasEmail) {
    addText(invoiceQuotation.customer_email!, margin + 5, rectStartY + 17, {
      fontSize: 9.5,
      color: '#4a5568'
    });
  }
  
  yPosition = rectStartY + rectHeight + 8;

  // Services Table Header
  const headerHeight = 10;
  const colWidths = [contentWidth * 0.48, contentWidth * 0.12, contentWidth * 0.18, contentWidth * 0.22];
  
  addRect(margin, yPosition, contentWidth, headerHeight, '#f3f4f6');
  
  // Table header grid lines
  doc.setDrawColor('#cbd5e0');
  doc.setLineWidth(0.3);
  doc.rect(margin, yPosition, contentWidth, headerHeight);
  
  addLine(margin + colWidths[0], yPosition, margin + colWidths[0], yPosition + headerHeight, '#cbd5e0');
  addLine(margin + colWidths[0] + colWidths[1], yPosition, margin + colWidths[0] + colWidths[1], yPosition + headerHeight, '#cbd5e0');
  addLine(margin + colWidths[0] + colWidths[1] + colWidths[2], yPosition, margin + colWidths[0] + colWidths[1] + colWidths[2], yPosition + headerHeight, '#cbd5e0');

  const descX = margin + 5;
  const qtyCenterX = margin + colWidths[0] + (colWidths[1] / 2);
  const rateX = margin + colWidths[0] + colWidths[1] + colWidths[2] - 5;
  const amountX = pageWidth - margin - 5;

  const headerTextY = yPosition + 6.5;
  addText('Description', descX, headerTextY, { fontSize: 9.5, fontStyle: 'bold', color: '#061D49' });
  addText('Qty', qtyCenterX, headerTextY, { fontSize: 9.5, fontStyle: 'bold', color: '#061D49', align: 'center' });
  addText('Rate (Rs.)', rateX, headerTextY, { fontSize: 9.5, fontStyle: 'bold', color: '#061D49', align: 'right' });
  addText('Amount (Rs.)', amountX, headerTextY, { fontSize: 9.5, fontStyle: 'bold', color: '#061D49', align: 'right' });

  yPosition += headerHeight;

  // Services Table Rows
  invoiceQuotation.services.forEach((service, index) => {
    const descWidth = colWidths[0] - 10; // 5mm padding on each side
    const descLines = doc.splitTextToSize(service.description, descWidth);
    const lineCount = descLines.length;
    const rowHeight = Math.max(10, 6 + (lineCount * 4.5)); // Calculate dynamic row height
    
    // Check if we need a new page for this row
    if (yPosition > pageHeight - 35 - rowHeight) {
      doc.addPage();
      yPosition = margin + 10;
      
      // Draw header on new page
      addRect(margin, yPosition, contentWidth, headerHeight, '#f3f4f6');
      doc.setDrawColor('#cbd5e0');
      doc.setLineWidth(0.3);
      doc.rect(margin, yPosition, contentWidth, headerHeight);
      
      addLine(margin + colWidths[0], yPosition, margin + colWidths[0], yPosition + headerHeight, '#cbd5e0');
      addLine(margin + colWidths[0] + colWidths[1], yPosition, margin + colWidths[0] + colWidths[1], yPosition + headerHeight, '#cbd5e0');
      addLine(margin + colWidths[0] + colWidths[1] + colWidths[2], yPosition, margin + colWidths[0] + colWidths[1] + colWidths[2], yPosition + headerHeight, '#cbd5e0');
      
      const pHeaderY = yPosition + 6.5;
      addText('Description', descX, pHeaderY, { fontSize: 9.5, fontStyle: 'bold', color: '#061D49' });
      addText('Qty', qtyCenterX, pHeaderY, { fontSize: 9.5, fontStyle: 'bold', color: '#061D49', align: 'center' });
      addText('Rate (Rs.)', rateX, pHeaderY, { fontSize: 9.5, fontStyle: 'bold', color: '#061D49', align: 'right' });
      addText('Amount (Rs.)', amountX, pHeaderY, { fontSize: 9.5, fontStyle: 'bold', color: '#061D49', align: 'right' });
      
      yPosition += headerHeight;
    }

    const bgColor = index % 2 === 0 ? '#ffffff' : '#f9fafb';
    addRect(margin, yPosition, contentWidth, rowHeight, bgColor);
    
    // Draw row borders
    doc.setDrawColor('#cbd5e0');
    doc.setLineWidth(0.2);
    doc.rect(margin, yPosition, contentWidth, rowHeight);
    
    addLine(margin + colWidths[0], yPosition, margin + colWidths[0], yPosition + rowHeight, '#cbd5e0');
    addLine(margin + colWidths[0] + colWidths[1], yPosition, margin + colWidths[0] + colWidths[1], yPosition + rowHeight, '#cbd5e0');
    addLine(margin + colWidths[0] + colWidths[1] + colWidths[2], yPosition, margin + colWidths[0] + colWidths[1] + colWidths[2], yPosition + rowHeight, '#cbd5e0');

    // Print description lines
    descLines.forEach((line: string, lineIndex: number) => {
      addText(line, descX, yPosition + 5.5 + (lineIndex * 4.5), { fontSize: 9, color: '#1a202c' });
    });
    
    // Vertically center other columns text in the row
    const middleY = yPosition + (rowHeight / 2) + 1.5;
    addText(service.quantity.toString(), qtyCenterX, middleY, { fontSize: 9, color: '#1a202c', align: 'center' });
    addText(service.rate.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), rateX, middleY, { fontSize: 9, color: '#1a202c', align: 'right' });
    addText(service.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), amountX, middleY, { fontSize: 9, fontStyle: 'bold', color: '#061D49', align: 'right' });
    
    yPosition += rowHeight;
  });

  yPosition += 6;

  // Totals Section
  const totalsWidth = 70;
  const totalsX = pageWidth - margin - totalsWidth;
  
  // Check if totals fit on page
  const hasDiscount = !!(invoiceQuotation.discount_rate && invoiceQuotation.discount_rate > 0);
  const hasTax = !!(invoiceQuotation.tax_rate && invoiceQuotation.tax_rate > 0);
  let totalsHeight = 16;
  if (hasDiscount) totalsHeight += 5.5;
  if (hasTax) totalsHeight += 5.5;

  if (yPosition + totalsHeight > pageHeight - 30) {
    doc.addPage();
    yPosition = margin + 10;
  }

  addText('Subtotal:', totalsX, yPosition + 3.5, { fontSize: 9.5, color: '#4a5568' });
  addText(`Rs. ${invoiceQuotation.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, pageWidth - margin - 5, yPosition + 3.5, { fontSize: 9.5, color: '#061D49', align: 'right' });
  yPosition += 5.5;

  if (hasDiscount) {
    const couponName = invoiceQuotation.coupon_name || 'VENDOR COUPON';
    addText(`${couponName} (${invoiceQuotation.discount_rate}%):`, totalsX, yPosition + 3.5, { fontSize: 9.5, color: '#10b981' });
    addText(`-Rs. ${(invoiceQuotation.discount_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, pageWidth - margin - 5, yPosition + 3.5, { fontSize: 9.5, color: '#10b981', align: 'right' });
    yPosition += 5.5;
  }

  if (hasTax) {
    addText(`Tax (${invoiceQuotation.tax_rate}%):`, totalsX, yPosition + 3.5, { fontSize: 9.5, color: '#4a5568' });
    addText(`Rs. ${(invoiceQuotation.tax_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, pageWidth - margin - 5, yPosition + 3.5, { fontSize: 9.5, color: '#061D49', align: 'right' });
    yPosition += 5.5;
  }

  // Orange dividing line above Total
  addLine(totalsX, yPosition + 1, pageWidth - margin, yPosition + 1, '#FFA326');
  doc.setLineWidth(0.4); // slightly thicker line for emphasis
  yPosition += 5.5;

  addText('Total:', totalsX, yPosition + 3.5, { fontSize: 11, fontStyle: 'bold', color: '#061D49' });
  addText(`Rs. ${invoiceQuotation.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, pageWidth - margin - 5, yPosition + 3.5, { fontSize: 11, fontStyle: 'bold', color: '#061D49', align: 'right' });

  yPosition += 15;

  // Terms & Conditions
  if (invoiceQuotation.terms) {
    // Check space for the title
    if (yPosition + 12 > pageHeight - 20) {
      doc.addPage();
      yPosition = margin + 10;
    }
    
    addText(invoiceQuotation.type === 'invoice' ? 'Terms & Conditions:' : 'Quotation Terms:', margin, yPosition, {
      fontSize: 11,
      fontStyle: 'bold',
      color: '#061D49'
    });
    yPosition += 5.5;

    const termsLines = doc.splitTextToSize(invoiceQuotation.terms, contentWidth - 10);
    const termsHeight = 6 + (termsLines.length * 4.5);
    
    // Check if the terms box fits on the page
    if (yPosition + termsHeight > pageHeight - 25) {
      doc.addPage();
      yPosition = margin + 10;
    }
    
    // Draw card box for Terms
    addRect(margin, yPosition, contentWidth, termsHeight, '#f9fafb');
    
    // Border for Terms box
    doc.setDrawColor('#e2e8f0');
    doc.setLineWidth(0.3);
    doc.rect(margin, yPosition, contentWidth, termsHeight);
    
    termsLines.forEach((line: string, index: number) => {
      addText(line, margin + 5, yPosition + 5 + (index * 4.5), {
        fontSize: 8.5,
        color: '#4a5568'
      });
    });
    
    yPosition += termsHeight + 12;
  }

  // Footer & Bottom Left Logo
  const footerLogoHeight = logoBase64 ? 18 : 0;
  const neededHeight = 10 + footerLogoHeight + 15; // 10mm margin + logo + thank you text
  
  if (yPosition + neededHeight > pageHeight - margin) {
    doc.addPage();
    yPosition = margin + 10;
  }
  
  if (logoBase64) {
    try {
      // Draw brand logo at bottom left (15mm x 15mm)
      doc.addImage(logoBase64, 'PNG', margin, yPosition, 15, 15);
      yPosition += 18;
    } catch (e) {
      console.error('Error drawing logo at bottom left:', e);
    }
  }
  
  addLine(margin, yPosition, pageWidth - margin, yPosition, '#cbd5e0');
  yPosition += 8;

  addText('Thank you for your business!', pageWidth / 2, yPosition, {
    fontSize: 10,
    fontStyle: 'bold',
    color: '#061D49',
    align: 'center'
  });

  // Generate and return PDF blob
  return doc.output('blob');
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Function to download PDF
export const downloadPDF = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Function to generate PDF and download
export const generateAndDownloadPDF = async (
  invoiceQuotation: InvoiceQuotation,
  vendor: any,
  options?: PDFOptions
) => {
  try {
    const blob = await generateInvoiceQuotationPDF(invoiceQuotation, vendor, options);
    const filename = `${invoiceQuotation.number}.pdf`;
    downloadPDF(blob, filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};
