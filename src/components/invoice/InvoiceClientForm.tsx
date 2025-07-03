import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ClientInfo {
  name: string;
  contact: string;
  address: string;
}

interface InvoiceClientFormProps {
  clientInfo: ClientInfo;
  onClientInfoChange: (info: ClientInfo) => void;
}

const InvoiceClientForm = ({ clientInfo, onClientInfoChange }: InvoiceClientFormProps) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-gradient">Client Information</CardTitle>
        <CardDescription>Who are you invoicing?</CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="clientName">Client Name *</Label>
          <Input
            id="clientName"
            placeholder="Client/Customer Name"
            value={clientInfo.name}
            onChange={(e) => onClientInfoChange({...clientInfo, name: e.target.value})}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="clientContact">Contact</Label>
          <Input
            id="clientContact"
            placeholder="Phone/Email"
            value={clientInfo.contact}
            onChange={(e) => onClientInfoChange({...clientInfo, contact: e.target.value})}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="clientAddress">Address</Label>
          <Input
            id="clientAddress"
            placeholder="Client Address"
            value={clientInfo.address}
            onChange={(e) => onClientInfoChange({...clientInfo, address: e.target.value})}
            className="mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceClientForm;