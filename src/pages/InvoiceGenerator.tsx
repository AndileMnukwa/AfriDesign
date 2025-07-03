
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useInvoiceLogic } from "@/hooks/useInvoiceLogic";
import InvoiceBusinessForm from "@/components/invoice/InvoiceBusinessForm";
import InvoiceClientForm from "@/components/invoice/InvoiceClientForm";
import InvoiceItemsForm from "@/components/invoice/InvoiceItemsForm";
import InvoiceNotesForm from "@/components/invoice/InvoiceNotesForm";
import InvoiceActionButtons from "@/components/invoice/InvoiceActionButtons";

const InvoiceGenerator = () => {
  const {
    loading,
    editMode,
    businessInfo,
    clientInfo,
    items,
    notes,
    setBusinessInfo,
    setClientInfo,
    setItems,
    setNotes,
    saveInvoice,
    handleGenerate
  } = useInvoiceLogic();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-nature rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">
                {editMode ? 'Edit Invoice' : 'Professional Invoice Generator'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <InvoiceBusinessForm 
            businessInfo={businessInfo}
            onBusinessInfoChange={setBusinessInfo}
          />

          <InvoiceClientForm 
            clientInfo={clientInfo}
            onClientInfoChange={setClientInfo}
          />

          <InvoiceItemsForm 
            items={items}
            onItemsChange={setItems}
          />

          <InvoiceNotesForm 
            notes={notes}
            onNotesChange={setNotes}
          />

          <InvoiceActionButtons 
            loading={loading}
            editMode={editMode}
            onSave={saveInvoice}
            onGenerate={handleGenerate}
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
