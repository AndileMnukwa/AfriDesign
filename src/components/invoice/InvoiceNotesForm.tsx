import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface InvoiceNotesFormProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

const InvoiceNotesForm = ({ notes, onNotesChange }: InvoiceNotesFormProps) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-gradient">Additional Notes</CardTitle>
        <CardDescription>Payment terms, thank you message, etc.</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="e.g., Payment due within 7 days. Thank you for your business!"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="min-h-[100px]"
        />
      </CardContent>
    </Card>
  );
};

export default InvoiceNotesForm;