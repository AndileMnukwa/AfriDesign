import { Button } from "@/components/ui/button";
import { Calculator, Save } from "lucide-react";

interface InvoiceActionButtonsProps {
  loading: boolean;
  editMode: boolean;
  onSave: () => void;
  onGenerate: () => void;
}

const InvoiceActionButtons = ({ loading, editMode, onSave, onGenerate }: InvoiceActionButtonsProps) => {
  return (
    <div className="flex justify-center gap-4">
      {editMode && (
        <Button 
          onClick={onSave}
          disabled={loading}
          variant="outline"
          className="text-lg px-8 py-6"
        >
          <Save className="w-5 h-5 mr-2" />
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      )}
      <Button 
        onClick={onGenerate}
        disabled={loading}
        className="gradient-nature hover:opacity-90 text-white border-0 text-lg px-12 py-6"
      >
        <Calculator className="w-5 h-5 mr-2" />
        {loading ? "Saving..." : editMode ? "Update & Preview" : "Generate Professional Invoice"}
      </Button>
    </div>
  );
};

export default InvoiceActionButtons;