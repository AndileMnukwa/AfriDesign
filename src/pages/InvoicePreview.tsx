
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
              {/* Invoice Header */}
              <div className="gradient-nature p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold">INVOICE</h1>
                    <p className="text-blue-100 mt-2">#{invoiceNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-100">Date</p>
                    <p className="font-semibold">{date}</p>
                  </div>
                </div>
              </div>

              <CardContent className="p-6 bg-white">
                {/* Business & Client Info */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="font-semibold text-gray-600 mb-3">FROM</h3>
                    <div className="space-y-1">
                      <p className="font-bold text-lg">{businessInfo.name}</p>
                      {businessInfo.contact && <p className="text-gray-600">{businessInfo.contact}</p>}
                      {businessInfo.address && <p className="text-gray-600">{businessInfo.address}</p>}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-600 mb-3">TO</h3>
                    <div className="space-y-1">
                      <p className="font-bold text-lg">{clientInfo.name}</p>
                      {clientInfo.contact && <p className="text-gray-600">{clientInfo.contact}</p>}
                      {clientInfo.address && <p className="text-gray-600">{clientInfo.address}</p>}
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-3 font-semibold text-gray-600">Description</th>
                          <th className="text-center py-3 font-semibold text-gray-600">Qty</th>
                          <th className="text-right py-3 font-semibold text-gray-600">Price</th>
                          <th className="text-right py-3 font-semibold text-gray-600">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item: any, index: number) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-3">{item.description}</td>
                            <td className="py-3 text-center">{item.quantity}</td>
                            <td className="py-3 text-right">R{item.price.toFixed(2)}</td>
                            <td className="py-3 text-right font-semibold">R{(item.quantity * item.price).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-end mb-8">
                  <div className="bg-gray-50 p-4 rounded-lg min-w-[200px]">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold">TOTAL:</span>
                      <span className="text-2xl font-bold text-green-600">R{total.toFixed(2)}</span>
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
                className="w-full gradient-nature hover:opacity-90 text-white border-0 text-lg py-6"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Invoice (PDF)
              </Button>

              <Button 
                onClick={handleShare}
                variant="outline"
                className="w-full text-lg py-6"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share via WhatsApp
              </Button>

              <Link to="/invoice">
                <Button 
                  variant="ghost"
                  className="w-full text-lg py-6"
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
