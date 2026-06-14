import React, { useState, useEffect } from 'react';
import { X, Download, Send, Edit, Print, MessageCircle, Mail, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { InvoiceQuotation } from '../services/invoiceService';
import { getVendorBrandLogoFromStorage } from '../services/supabaseStorageService';

interface InvoiceQuotationPreviewProps {
  invoiceQuotation: InvoiceQuotation;
  vendor: any;
  onClose: () => void;
  onEdit: () => void;
  onDownload: () => void;
  onSend: () => void;
}

const InvoiceQuotationPreview: React.FC<InvoiceQuotationPreviewProps> = ({
  invoiceQuotation,
  vendor,
  onClose,
  onEdit,
  onDownload,
  onSend
}) => {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadLogo = async () => {
      if (vendor && vendor.vendor_id) {
        try {
          const logo = await getVendorBrandLogoFromStorage(vendor.vendor_id);
          setLogoUrl(logo);
        } catch (e) {
          console.error('Error loading logo in preview:', e);
        }
      }
    };
    loadLogo();
  }, [vendor]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showShareOptions) {
        const target = event.target as HTMLElement;
        if (!target.closest('.share-dropdown')) {
          setShowShareOptions(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareOptions]);
  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleWhatsAppShare = () => {
    const phoneNumber = invoiceQuotation.customer_mobile.replace(/[^0-9]/g, '');
    const documentType = invoiceQuotation.type === 'invoice' ? 'Invoice' : 'Quotation';
    const message = `Hi ${invoiceQuotation.customer_name}! 

Your ${documentType} ${invoiceQuotation.number} is ready.

📄 Document: ${documentType} ${invoiceQuotation.number}
💵 Total Amount: ${formatCurrency(invoiceQuotation.total_amount)}
📅 Date: ${formatDate(invoiceQuotation.date)}

Please review the attached document. For any queries, feel free to contact us.

Best regards,
${vendor.brand_name}`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setShowShareOptions(false);
  };

  const handleEmailShare = () => {
    const documentType = invoiceQuotation.type === 'invoice' ? 'Invoice' : 'Quotation';
    const subject = `${documentType} ${invoiceQuotation.number} - ${vendor.brand_name}`;
    const body = `Dear ${invoiceQuotation.customer_name},

Please find attached your ${documentType} ${invoiceQuotation.number}.

📄 Document: ${documentType} ${invoiceQuotation.number}
💵 Total Amount: ${formatCurrency(invoiceQuotation.total_amount)}
📅 Date: ${formatDate(invoiceQuotation.date)}

Please review the document and let us know if you have any questions.

Thank you for your business!

Best regards,
${vendor.brand_name}
${(vendor.phone_number || vendor.whatsapp_number) ? `Phone: ${vendor.phone_number || vendor.whatsapp_number}` : ''}
${vendor.email ? `Email: ${vendor.email}` : ''}`;

    const emailUrl = `mailto:${invoiceQuotation.customer_email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl, '_blank');
    setShowShareOptions(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 sm:p-4 flex-shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <h2 className="text-base sm:text-xl font-bold truncate">
                {invoiceQuotation.type === 'invoice' ? 'Invoice' : 'Quotation'} Preview
              </h2>
              <span className="text-xs sm:text-sm bg-white/20 px-2 py-0.5 rounded truncate">
                {invoiceQuotation.number}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <Button
                onClick={onEdit}
                size="sm"
                variant="outline"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 px-2.5 sm:px-3"
              >
                <Edit className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
              <Button
                onClick={onClose}
                size="sm"
                variant="outline"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Document Preview */}
        <div className="p-3 sm:p-6 md:p-8 overflow-y-auto bg-gray-50 flex-1">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="border-b-2 border-gray-200 pb-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2 break-words">
                    {vendor.brand_name || 'Your Business Name'}
                  </h1>
                  {vendor.category && <p className="text-gray-600 mb-1 text-sm sm:text-base">{vendor.category}</p>}
                  {vendor.address && <p className="text-gray-500 mb-1 text-xs sm:text-sm break-words">{vendor.address}</p>}
                  {(vendor.phone_number || vendor.whatsapp_number) && (
                    <p className="text-gray-500 mb-1 text-xs sm:text-sm">
                      Phone: {vendor.phone_number || vendor.whatsapp_number}
                    </p>
                  )}
                  {vendor.email && <p className="text-gray-500 text-xs sm:text-sm break-all">Email: {vendor.email}</p>}
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">
                    {invoiceQuotation.type === 'invoice' ? 'INVOICE' : 'QUOTATION'}
                  </h2>
                  <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                    <p><span className="font-medium">Number:</span> {invoiceQuotation.number}</p>
                    <p><span className="font-medium">Date:</span> {formatDate(invoiceQuotation.date)}</p>
                    {invoiceQuotation.type === 'invoice' && (
                      <p><span className="font-medium">Due Date:</span> {formatDate(invoiceQuotation.date)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="mb-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                {invoiceQuotation.type === 'invoice' ? 'Bill To:' : 'Quote To:'}
              </h3>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="font-medium text-gray-900 text-sm sm:text-base">{invoiceQuotation.customer_name}</p>
                <p className="text-gray-600 text-xs sm:text-sm">{invoiceQuotation.customer_mobile}</p>
                {invoiceQuotation.customer_email && (
                  <p className="text-gray-600 text-xs sm:text-sm break-all">{invoiceQuotation.customer_email}</p>
                )}
              </div>
            </div>

            {/* Services Table */}
            <div className="mb-8 overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full min-w-[500px] sm:min-w-0 border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border-b border-gray-200 px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-900 text-xs sm:text-sm">
                      Description
                    </th>
                    <th className="border-b border-gray-200 px-3 py-2 sm:px-4 sm:py-3 text-center font-semibold text-gray-900 text-xs sm:text-sm w-16">
                      Qty
                    </th>
                    <th className="border-b border-gray-200 px-3 py-2 sm:px-4 sm:py-3 text-right font-semibold text-gray-900 text-xs sm:text-sm w-28">
                      Rate (Rs.)
                    </th>
                    <th className="border-b border-gray-200 px-3 py-2 sm:px-4 sm:py-3 text-right font-semibold text-gray-900 text-xs sm:text-sm w-32">
                      Amount (Rs.)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceQuotation.services.map((service, index) => (
                    <tr key={service.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                      <td className="border-b border-gray-100 px-3 py-2 sm:px-4 sm:py-3 text-gray-900 text-xs sm:text-sm">
                        {service.description}
                      </td>
                      <td className="border-b border-gray-100 px-3 py-2 sm:px-4 sm:py-3 text-center text-gray-900 text-xs sm:text-sm">
                        {service.quantity}
                      </td>
                      <td className="border-b border-gray-100 px-3 py-2 sm:px-4 sm:py-3 text-right text-gray-900 text-xs sm:text-sm">
                        {service.rate.toFixed(2)}
                      </td>
                      <td className="border-b border-gray-100 px-3 py-2 sm:px-4 sm:py-3 text-right text-gray-900 text-xs sm:text-sm">
                        {service.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-full sm:w-80">
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between py-1 sm:py-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(invoiceQuotation.subtotal)}</span>
                  </div>
                  {invoiceQuotation.tax_rate && invoiceQuotation.tax_rate > 0 && (
                    <div className="flex justify-between py-1 sm:py-2">
                      <span className="text-gray-600">Tax ({invoiceQuotation.tax_rate}%):</span>
                      <span className="font-medium">{formatCurrency(invoiceQuotation.tax_amount || 0)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-sm sm:text-lg font-bold">
                      <span>Total:</span>
                      <span>{formatCurrency(invoiceQuotation.total_amount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            {invoiceQuotation.terms && (
              <div className="mb-8">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">Terms & Conditions:</h3>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <p className="text-gray-700 text-xs sm:text-sm whitespace-pre-line leading-relaxed">{invoiceQuotation.terms}</p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="border-t pt-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {logoUrl ? (
                  <>
                    <img 
                      src={logoUrl} 
                      alt="Brand Logo" 
                      className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-lg border border-gray-200 bg-white"
                    />
                    <p className="font-semibold text-gray-700 text-center flex-1 sm:pr-16 text-xs sm:text-sm">
                      Thank you for your business!
                    </p>
                  </>
                ) : (
                  <p className="font-semibold text-gray-700 text-center flex-1 text-xs sm:text-sm">
                    Thank you for your business!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t flex-shrink-0">
          <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Document Status: <span className="font-semibold capitalize text-blue-600">{invoiceQuotation.status || 'draft'}</span>
          </div>
          <div className="flex flex-row flex-wrap sm:flex-nowrap justify-center sm:justify-end gap-2 w-full sm:w-auto">
            <Button onClick={onClose} variant="outline" className="flex-1 sm:flex-none h-9 text-xs sm:text-sm">
              Close
            </Button>
            <Button onClick={onDownload} variant="outline" className="flex-1 sm:flex-none h-9 text-xs sm:text-sm border-blue-200 text-blue-700 hover:bg-blue-50">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            
            {/* Share Options Dropdown */}
            <div className="relative share-dropdown flex-1 sm:flex-none">
              <Button 
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="w-full bg-green-600 hover:bg-green-700 h-9 text-xs sm:text-sm"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Send to Customer
              </Button>
              
              {showShareOptions && (
                <div className="absolute bottom-full right-0 mb-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                  <div className="p-2">
                    <button
                      onClick={handleWhatsAppShare}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium text-xs text-gray-900">WhatsApp</div>
                        <div className="text-[10px] text-gray-600">Send via WhatsApp</div>
                      </div>
                    </button>
                    
                    <button
                      onClick={handleEmailShare}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-xs text-gray-900">Email</div>
                        <div className="text-[10px] text-gray-600">Send via Email</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceQuotationPreview;
