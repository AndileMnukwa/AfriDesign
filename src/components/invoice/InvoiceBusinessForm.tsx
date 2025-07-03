import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BusinessInfo {
  name: string;
  contact: string;
  address: string;
}

interface InvoiceBusinessFormProps {
  businessInfo: BusinessInfo;
  onBusinessInfoChange: (info: BusinessInfo) => void;
}

const InvoiceBusinessForm = ({ businessInfo, onBusinessInfoChange }: InvoiceBusinessFormProps) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-gradient">Your Business Information</CardTitle>
        <CardDescription>This will appear as the sender on your invoice</CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="businessName">Business Name *</Label>
          <Input
            id="businessName"
            placeholder="Your Business Name"
            value={businessInfo.name}
            onChange={(e) => onBusinessInfoChange({...businessInfo, name: e.target.value})}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="businessContact">Phone/Email</Label>
          <Input
            id="businessContact"
            placeholder="+27 123 456 789"
            value={businessInfo.contact}
            onChange={(e) => onBusinessInfoChange({...businessInfo, contact: e.target.value})}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="businessAddress">Address</Label>
          <Input
            id="businessAddress"
            placeholder="Business Address"
            value={businessInfo.address}
            onChange={(e) => onBusinessInfoChange({...businessInfo, address: e.target.value})}
            className="mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceBusinessForm;