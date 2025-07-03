
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2, FileText, Calculator, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

const InvoiceGenerator = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentInvoiceId, setCurrentInvoiceId] = useState<string | null>(null);
  
  const [businessInfo, setBusinessInfo] = useState({
    name: "",
    contact: "",
    address: ""
  });
  const [clientInfo, setClientInfo] = useState({
    name: "",
    contact: "",
    address: ""
  });
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", description: "", quantity: 1, price: 0 }
  ]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (id && user) {
      setEditMode(true);
      loadInvoice(id);
    }
  }, [id, user]);

  const loadInvoice = async (invoiceId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .eq('user_id', user?.id)
        .single();

      if (error) {
        toast.error('Failed to load invoice');
        navigate('/dashboard');
        return;
      }

      if (data) {
        setCurrentInvoiceId(data.id);
        setBusinessInfo(data.business_info as any);
        setClientInfo(data.client_info as any);
        setItems(data.items as any);
        setNotes(data.notes || "");
      }
    } catch (error) {
      console.error('Error loading invoice:', error);
      toast.error('Failed to load invoice');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      price: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const saveInvoice = async () => {
    if (!user) {
      toast.error("Please sign in to save invoices");
      navigate("/auth");
      return;
    }

    // Validation
    if (!businessInfo.name || !clientInfo.name || items.some(item => !item.description)) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const invoiceData = {
        user_id: user.id,
        invoice_number: editMode ? currentInvoiceId : `INV-${Date.now()}`,
        business_info: businessInfo as any,
        client_info: clientInfo as any,
        items: items as any,
        notes: notes,
        total: calculateTotal()
      };

      if (editMode && currentInvoiceId) {
        // Update existing invoice
        const { error } = await supabase
          .from('invoices')
          .update(invoiceData)
          .eq('id', currentInvoiceId)
          .eq('user_id', user.id);

        if (error) throw error;
        toast.success("Invoice updated successfully!");
      } else {
        // Create new invoice
        const { data, error } = await supabase
          .from('invoices')
          .insert(invoiceData)
          .select()
          .single();

        if (error) throw error;
        setCurrentInvoiceId(data.id);
        setEditMode(true);
        toast.success("Invoice saved successfully!");
      }
      
      // Navigate to preview with the saved data
      navigate("/invoice-preview", {
        state: {
          businessInfo,
          clientInfo,
          items,
          notes,
          total: calculateTotal(),
          invoiceNumber: invoiceData.invoice_number,
          date: new Date().toLocaleDateString(),
          invoiceId: currentInvoiceId
        }
      });
    } catch (error) {
      console.error('Error saving invoice:', error);
      toast.error("Failed to save invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    saveInvoice();
  };

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
          {/* Business Info */}
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
                  onChange={(e) => setBusinessInfo({...businessInfo, name: e.target.value})}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="businessContact">Phone/Email</Label>
                <Input
                  id="businessContact"
                  placeholder="+27 123 456 789"
                  value={businessInfo.contact}
                  onChange={(e) => setBusinessInfo({...businessInfo, contact: e.target.value})}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="businessAddress">Address</Label>
                <Input
                  id="businessAddress"
                  placeholder="Business Address"
                  value={businessInfo.address}
                  onChange={(e) => setBusinessInfo({...businessInfo, address: e.target.value})}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Client Info */}
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
                  onChange={(e) => setClientInfo({...clientInfo, name: e.target.value})}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="clientContact">Contact</Label>
                <Input
                  id="clientContact"
                  placeholder="Phone/Email"
                  value={clientInfo.contact}
                  onChange={(e) => setClientInfo({...clientInfo, contact: e.target.value})}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="clientAddress">Address</Label>
                <Input
                  id="clientAddress"
                  placeholder="Client Address"
                  value={clientInfo.address}
                  onChange={(e) => setClientInfo({...clientInfo, address: e.target.value})}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-gradient">Invoice Items</CardTitle>
                  <CardDescription>Add products or services to invoice</CardDescription>
                </div>
                <Button onClick={addItem} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-end p-4 border rounded-lg">
                  <div className="col-span-6">
                    <Label>Description *</Label>
                    <Input
                      placeholder="Product or service description"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                      className="mt-2"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Price (R)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)}
                      className="mt-2"
                    />
                  </div>
                  <div className="col-span-1">
                    <Label>Total</Label>
                    <div className="mt-2 p-2 bg-gray-50 rounded text-center font-medium">
                      R{(item.quantity * item.price).toFixed(2)}
                    </div>
                  </div>
                  <div className="col-span-1">
                    {items.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end">
                <div className="text-right space-y-2">
                  <div className="text-2xl font-bold text-gradient">
                    Total: R{calculateTotal().toFixed(2)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-gradient">Additional Notes</CardTitle>
              <CardDescription>Payment terms, thank you message, etc.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., Payment due within 7 days. Thank you for your business!"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            {editMode && (
              <Button 
                onClick={saveInvoice}
                disabled={loading}
                variant="outline"
                className="text-lg px-8 py-6"
              >
                <Save className="w-5 h-5 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            )}
            <Button 
              onClick={handleGenerate}
              disabled={loading}
              className="gradient-nature hover:opacity-90 text-white border-0 text-lg px-12 py-6"
            >
              <Calculator className="w-5 h-5 mr-2" />
              {loading ? "Saving..." : editMode ? "Update & Preview" : "Generate Professional Invoice"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
