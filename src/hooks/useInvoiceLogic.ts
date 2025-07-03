import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { InvoiceItem } from "@/components/invoice/InvoiceItemsForm";

interface BusinessInfo {
  name: string;
  contact: string;
  address: string;
}

interface ClientInfo {
  name: string;
  contact: string;
  address: string;
}

export const useInvoiceLogic = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentInvoiceId, setCurrentInvoiceId] = useState<string | null>(null);
  
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: "",
    contact: "",
    address: ""
  });
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
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

  return {
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
  };
};