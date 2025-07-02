
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Image, Plus, Download, Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AuthButton from "@/components/AuthButton";

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
        .select('*')
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
          <AuthButton />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your AI-generated posters and invoices</p>
        </div>

        {/* Professional Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <Link to="/poster" className="group">
            <Card className="bg-card-poster hover-lift cursor-pointer shadow-african border-0 h-full">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 gradient-african rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-warm group-hover:scale-110 transition-transform">
                  <Image className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-2 text-heritage-gradient">Create New Poster</CardTitle>
                <CardDescription className="text-base">Generate AI-powered marketing posters with professional designs</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-6">
                <div className="text-center">
                  <Button className="btn-professional w-full py-3">
                    <Plus className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/invoice" className="group">
            <Card className="bg-card-invoice hover-lift cursor-pointer shadow-heritage border-0 h-full">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 gradient-nature rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-heritage group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-2 text-heritage-gradient">Create New Invoice</CardTitle>
                <CardDescription className="text-base">Generate professional invoices with automated calculations</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-6">
                <div className="text-center">
                  <Button className="btn-professional w-full py-3">
                    <Plus className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>

          <div className="group">
            <Card className="bg-card-analytics hover-lift cursor-pointer shadow-premium border-0 h-full">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 gradient-premium rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-premium group-hover:scale-110 transition-transform">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-2 text-premium-gradient">Go Premium</CardTitle>
                <CardDescription className="text-base">Unlock unlimited creations and premium features</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-6">
                <div className="text-center">
                  <Button className="btn-premium w-full py-3">
                    <Download className="w-4 h-4 mr-2" />
                    Upgrade Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Saved Posters */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Posters ({posters.length})</h2>
          {loadingData ? (
            <div className="text-center py-8">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600">Loading posters...</p>
            </div>
          ) : posters.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No posters created yet</p>
                <Link to="/poster" className="inline-block mt-4">
                  <Button>Create Your First Poster</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posters.map((poster) => (
                <Card key={poster.id} className="bg-card-poster hover-lift shadow-african border-0 group">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 gradient-african rounded-xl flex items-center justify-center shadow-warm">
                        <Image className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">Created</div>
                        <div className="text-xs font-medium">{new Date(poster.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <CardTitle className="text-lg text-heritage-gradient line-clamp-1">{poster.business_name}</CardTitle>
                    <CardDescription className="text-base font-medium line-clamp-1">{poster.title}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 mb-6 line-clamp-2">{poster.slogan}</p>
                    <div className="flex space-x-2">
                      <Link 
                        to="/poster-preview" 
                        state={{ 
                          formData: {
                            businessName: poster.business_name,
                            services: poster.description,
                            industry: 'services',
                            culturalContext: 'modern'
                          },
                          generatedContent: poster.content || {
                            headline: poster.title,
                            subheading: poster.slogan,
                            description: poster.description
                          }
                        }}
                        className="flex-1"
                      >
                        <Button size="sm" className="btn-professional w-full">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={(e) => {
                          e.preventDefault();
                          deletePoster(poster.id);
                        }}
                        className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Saved Invoices */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Invoices ({invoices.length})</h2>
          {loadingData ? (
            <div className="text-center py-8">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600">Loading invoices...</p>
            </div>
          ) : invoices.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No invoices created yet</p>
                <Link to="/invoice" className="inline-block mt-4">
                  <Button>Create Your First Invoice</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {invoices.map((invoice) => (
                <Card key={invoice.id} className="bg-card-invoice hover-lift shadow-heritage border-0 group">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 gradient-nature rounded-xl flex items-center justify-center shadow-heritage">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">Created</div>
                        <div className="text-xs font-medium">{new Date(invoice.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <CardTitle className="text-lg text-heritage-gradient">#{invoice.invoice_number}</CardTitle>
                    <CardDescription className="text-base font-medium line-clamp-1">
                      {invoice.business_info?.name} → {invoice.client_info?.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="mb-6">
                      <div className="text-2xl font-bold text-green-600 mb-2">R{Number(invoice.total).toFixed(2)}</div>
                      <div className="text-sm text-gray-600">
                        {invoice.items?.length || 0} items • {invoice.business_info?.name || 'Business'}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link 
                        to="/invoice-preview" 
                        state={{
                          businessInfo: invoice.business_info,
                          clientInfo: invoice.client_info,
                          items: invoice.items,
                          notes: invoice.notes,
                          total: Number(invoice.total),
                          invoiceNumber: invoice.invoice_number,
                          date: new Date(invoice.created_at).toLocaleDateString()
                        }}
                        className="flex-1"
                      >
                        <Button size="sm" className="btn-professional w-full">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={(e) => {
                          e.preventDefault();
                          deleteInvoice(invoice.id);
                        }}
                        className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
