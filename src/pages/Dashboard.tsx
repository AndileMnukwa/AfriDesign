
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AuthButton from "@/components/AuthButton";
import QuickActionCards from "@/components/dashboard/QuickActionCards";
import PosterCard from "@/components/dashboard/PosterCard";
import InvoiceCard from "@/components/dashboard/InvoiceCard";
import EmptyState from "@/components/dashboard/EmptyState";
import LoadingState from "@/components/dashboard/LoadingState";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [posters, setPosters] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserContent();
    }
  }, [user]);

  const fetchUserContent = async () => {
    try {
      // Fetch posters
      const { data: postersData, error: postersError } = await supabase
        .from('posters')
        .select('id, business_name, title, slogan, description, content, created_at, industry, cultural_context, target_audience, brand_personality, language')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (postersError) {
        console.error('Error fetching posters:', postersError);
      } else {
        setPosters(postersData || []);
      }

      // Fetch invoices
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (invoicesError) {
        console.error('Error fetching invoices:', invoicesError);
      } else {
        setInvoices(invoicesData || []);
      }
    } catch (error) {
      console.error('Error fetching user content:', error);
      toast.error('Failed to load your content');
    } finally {
      setLoadingData(false);
    }
  };

  const deletePoster = async (id: string) => {
    const { error } = await supabase
      .from('posters')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete poster');
    } else {
      toast.success('Poster deleted successfully');
      fetchUserContent();
    }
  };

  const deleteInvoice = async (id: string) => {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete invoice');
    } else {
      toast.success('Invoice deleted successfully');
      fetchUserContent();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <header className="border-b bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-gradient">
              SmartBiz AI
            </Link>
            <AuthButton />
          </div>
        </header>
        
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-8">Please sign in to access your dashboard and manage your content.</p>
          <Link to="/auth">
            <Button className="gradient-nature text-white">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-gradient">
            SmartBiz AI
          </Link>
            <div className="flex items-center gap-4">
              <Link to="/premium">
                <Button className="btn-premium">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade
                </Button>
              </Link>
              <AuthButton />
            </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your AI-generated posters and invoices</p>
        </div>

        <QuickActionCards />

        {/* Saved Posters */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Posters ({posters.length})</h2>
          {loadingData ? (
            <LoadingState message="Loading posters..." />
          ) : posters.length === 0 ? (
            <EmptyState type="posters" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posters.map((poster) => (
                <PosterCard
                  key={poster.id}
                  poster={poster}
                  onDelete={deletePoster}
                />
              ))}
            </div>
          )}
        </div>

        {/* Saved Invoices */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Invoices ({invoices.length})</h2>
          {loadingData ? (
            <LoadingState message="Loading invoices..." />
          ) : invoices.length === 0 ? (
            <EmptyState type="invoices" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {invoices.map((invoice) => (
                <InvoiceCard
                  key={invoice.id}
                  invoice={invoice}
                  onDelete={deleteInvoice}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
