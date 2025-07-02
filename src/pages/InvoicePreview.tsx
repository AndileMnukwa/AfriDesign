
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, Share2, Edit, FileText } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { exportInvoiceToPDF } from "@/utils/pdfExport";

const InvoicePreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const invoiceData = location.state;

  if (!invoiceData) {
    navigate("/invoice");
    return null;
  }

  const { businessInfo, clientInfo, items, notes, total, invoiceNumber, date } = invoiceData;

  const handleDownload = async () => {
    try {
      await exportInvoiceToPDF(invoiceData);
      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Failed to download invoice. Please try again.");
    }
  };

  const handleShare = () => {
    const shareText = `Invoice ${invoiceNumber} from ${businessInfo.name} - Total: R${total.toFixed(2)}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    
    if (navigator.share) {
      navigator.share({
        title: "Invoice",
        text: shareText,
      });
    } else {
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/invoice">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Edit
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-nature rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">Invoice Preview</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Invoice Preview */}
          <div className="lg:col-span-2">
            <Card className="shadow-2xl overflow-hidden">
              {/* Professional Invoice Header */}
              <div className="gradient-heritage p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-4 -translate-x-4"></div>
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">INVOICE</h1>
                    <div className="bg-white/20 px-4 py-2 rounded-lg inline-block">
                      <p className="text-lg font-semibold">#{invoiceNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-white/20 px-4 py-3 rounded-lg">
                      <p className="text-sm opacity-90 mb-1">Issue Date</p>
                      <p className="font-bold text-lg">{date}</p>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-8 bg-white">
                {/* Professional Business & Client Info */}
                <div className="grid md:grid-cols-2 gap-8 mb-10">
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl border border-green-100">
                    <h3 className="font-bold text-green-800 mb-4 text-sm uppercase tracking-wide">Bill From</h3>
                    <div className="space-y-2">
                      <p className="font-bold text-xl text-gray-800">{businessInfo.name}</p>
                      {businessInfo.contact && <p className="text-gray-700 font-medium">{businessInfo.contact}</p>}
                      {businessInfo.address && <p className="text-gray-600">{businessInfo.address}</p>}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
                    <h3 className="font-bold text-blue-800 mb-4 text-sm uppercase tracking-wide">Bill To</h3>
                    <div className="space-y-2">
                      <p className="font-bold text-xl text-gray-800">{clientInfo.name}</p>
                      {clientInfo.contact && <p className="text-gray-700 font-medium">{clientInfo.contact}</p>}
                      {clientInfo.address && <p className="text-gray-600">{clientInfo.address}</p>}
                    </div>
                  </div>
                </div>

                {/* Professional Items Table */}
                <div className="mb-10">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-t-xl">
                    <h3 className="text-lg font-bold text-gray-800">Invoice Items</h3>
                  </div>
                  <div className="overflow-x-auto border border-gray-200 rounded-b-xl">
                    <table className="w-full border-collapse bg-white">
                      <thead>
                        <tr className="bg-gradient-to-r from-green-50 to-blue-50">
                          <th className="text-left py-4 px-6 font-bold text-gray-700 text-sm uppercase tracking-wide">Description</th>
                          <th className="text-center py-4 px-4 font-bold text-gray-700 text-sm uppercase tracking-wide">Qty</th>
                          <th className="text-right py-4 px-4 font-bold text-gray-700 text-sm uppercase tracking-wide">Unit Price</th>
                          <th className="text-right py-4 px-6 font-bold text-gray-700 text-sm uppercase tracking-wide">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item: any, index: number) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-6 font-medium text-gray-800">{item.description}</td>
                            <td className="py-4 px-4 text-center font-semibold text-gray-700">{item.quantity}</td>
                            <td className="py-4 px-4 text-right text-gray-700">R{item.price.toFixed(2)}</td>
                            <td className="py-4 px-6 text-right font-bold text-green-600">R{(item.quantity * item.price).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Professional Total Section */}
                <div className="flex justify-end mb-10">
                  <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 rounded-2xl shadow-professional min-w-[300px]">
                    <div className="text-center text-white">
                      <p className="text-sm font-medium opacity-90 mb-2">Invoice Total</p>
                      <div className="text-4xl font-bold mb-2">R{total.toFixed(2)}</div>
                      <p className="text-sm opacity-80">ZAR (South African Rand)</p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {notes && (
                  <div className="border-t pt-6">
                    <h4 className="font-semibold text-gray-600 mb-2">Notes:</h4>
                    <p className="text-gray-700">{notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Invoice Summary</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Invoice #:</span>
                    <span className="ml-2">{invoiceNumber}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Date:</span>
                    <span className="ml-2">{date}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Items:</span>
                    <span className="ml-2">{items.length}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <span className="font-bold text-lg text-green-600">Total: R{total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Button 
                onClick={handleDownload}
                className="btn-professional w-full text-lg py-6 shadow-professional"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Professional PDF
              </Button>

              <Button 
                onClick={handleShare}
                className="btn-premium w-full text-lg py-6"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share via WhatsApp
              </Button>

              <Link to="/invoice" className="block">
                <Button 
                  variant="ghost"
                  className="w-full text-lg py-6 hover:bg-gray-100"
                >
                  <Edit className="w-5 h-5 mr-2" />
                  Make Changes
                </Button>
              </Link>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">✅ Professional Invoice Ready!</h4>
              <p className="text-sm text-green-700">
                Your invoice looks professional and includes all necessary details. 
                Download and send to your clients for faster payment processing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
