
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, FileText, Image, Trash2, Eye, Copy, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AuthButton from '@/components/AuthButton';

interface Poster {
  id: string;
  title: string;
  slogan: string;
  business_name: string;
  created_at: string;
}

interface Invoice {
  id: string;
  business_info: any;
  client_info: any;
  total: number;
  invoice_number: string;
  created_at: string;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [posters, setPosters] = useState<Poster[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch posters
      const { data: postersData, error: postersError } = await supabase
        .from('posters')
        .select('*')
        .order('created_at', { ascending: false });

      if (postersError) throw postersError;
      setPosters(postersData || []);

      // Fetch invoices
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (invoicesError) throw invoicesError;
      setInvoices(invoicesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load your data');
    } finally {
      setLoadingData(false);
    }
  };

  const deletePoster = async (id: string) => {
    try {
      const { error } = await supabase.from('posters').delete().eq('id', id);
      if (error) throw error;
      
      setPosters(posters.filter(p => p.id !== id));
      toast.success('Poster deleted successfully');
    } catch (error) {
      console.error('Error deleting poster:', error);
      toast.error('Failed to delete poster');
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      const { error } = await supabase.from('invoices').delete().eq('id', id);
      if (error) throw error;
      
      setInvoices(invoices.filter(i => i.id !== id));
      toast.success('Invoice deleted successfully');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Failed to delete invoice');
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 gradient-african rounded-lg flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-african rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">AfriDesign</span>
          </Link>
          <AuthButton />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Dashboard</h1>
          <p className="text-gray-600">Manage your posters and invoices</p>
        </div>

        <div className="grid gap-8">
          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/poster">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-orange-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 gradient-african rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Image className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Create New Poster</h3>
                  <p className="text-gray-600 text-sm">Generate AI-powered marketing posters</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/invoice">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-orange-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 gradient-nature rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Create New Invoice</h3>
                  <p className="text-gray-600 text-sm">Generate professional invoices</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Posters Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Your Posters</h2>
              <span className="text-sm text-gray-500">{posters.length} total</span>
            </div>
            
            {posters.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No posters yet</h3>
                  <p className="text-gray-600 mb-4">Create your first AI-powered marketing poster</p>
                  <Link to="/poster">
                    <Button className="gradient-african hover:opacity-90 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Poster
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {posters.map((poster) => (
                  <Card key={poster.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{poster.title}</CardTitle>
                      <p className="text-sm text-gray-600">{poster.business_name}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 mb-4 line-clamp-2">{poster.slogan}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {new Date(poster.created_at).toLocaleDateString()}
                        </span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => deletePoster(poster.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Invoices Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Your Invoices</h2>
              <span className="text-sm text-gray-500">{invoices.length} total</span>
            </div>
            
            {invoices.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No invoices yet</h3>
                  <p className="text-gray-600 mb-4">Create your first professional invoice</p>
                  <Link to="/invoice">
                    <Button className="gradient-nature hover:opacity-90 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Invoice
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {invoices.map((invoice) => (
                  <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">#{invoice.invoice_number}</CardTitle>
                      <p className="text-sm text-gray-600">
                        {invoice.client_info?.name || 'Client'}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold text-green-600 mb-4">
                        R{invoice.total.toFixed(2)}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {new Date(invoice.created_at).toLocaleDateString()}
                        </span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => deleteInvoice(invoice.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
