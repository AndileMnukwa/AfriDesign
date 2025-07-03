import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

interface InvoiceItemsFormProps {
  items: InvoiceItem[];
  onItemsChange: (items: InvoiceItem[]) => void;
}

const InvoiceItemsForm = ({ items, onItemsChange }: InvoiceItemsFormProps) => {
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      price: 0
    };
    onItemsChange([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      onItemsChange(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    onItemsChange(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  return (
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
  );
};

export default InvoiceItemsForm;