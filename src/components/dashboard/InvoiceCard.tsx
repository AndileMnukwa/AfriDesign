import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, FileText, Edit } from "lucide-react";
import { Link } from "react-router-dom";

interface InvoiceCardProps {
  invoice: {
    id: string;
    invoice_number: string;
    business_info: any;
    client_info: any;
    items: any[];
    notes: string;
    total: number;
    created_at: string;
  };
  onDelete: (id: string) => void;
}

const InvoiceCard = ({ invoice, onDelete }: InvoiceCardProps) => {
  return (
    <Card className="bg-card-invoice hover-lift shadow-heritage border-0 group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 gradient-nature rounded-xl flex items-center justify-center shadow-heritage">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-1">Created</div>
            <div className="text-xs font-medium">{new Date(invoice.created_at).toLocaleDateString()}</div>
          </div>
        </div>
        <CardTitle className="text-lg text-heritage-gradient">#{invoice.invoice_number}</CardTitle>
        <CardDescription className="text-base font-medium line-clamp-1">
          {invoice.business_info?.name} → {invoice.client_info?.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mb-6">
          <div className="text-2xl font-bold text-green-600 mb-2">R{Number(invoice.total).toFixed(2)}</div>
          <div className="text-sm text-gray-600">
            {invoice.items?.length || 0} items • {invoice.business_info?.name || 'Business'}
          </div>
        </div>
        <div className="flex space-x-2">
          <Link 
            to="/invoice-preview" 
            state={{
              businessInfo: invoice.business_info,
              clientInfo: invoice.client_info,
              items: invoice.items,
              notes: invoice.notes,
              total: Number(invoice.total),
              invoiceNumber: invoice.invoice_number,
              date: new Date(invoice.created_at).toLocaleDateString(),
              invoiceId: invoice.id
            }}
            className="flex-1"
          >
            <Button size="sm" className="btn-professional w-full">
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
          </Link>
          <Link to={`/invoice/edit/${invoice.id}`}>
            <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:text-blue-700 hover:border-blue-300">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={(e) => {
              e.preventDefault();
              onDelete(invoice.id);
            }}
            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceCard;