import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, Crown, Sparkles, Zap, Star, TrendingUp } from "lucide-react";

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string;
  monthly_posters_used: number;
  monthly_invoices_used: number;
}

const PremiumPage = () => {
  const { user, loading } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSubscriptionStatus();
    }
  }, [user]);

  const fetchSubscriptionStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        return;
      }

      setSubscription(data || {
        subscribed: false,
        subscription_tier: 'free',
        monthly_posters_used: 0,
        monthly_invoices_used: 0
      });
    } catch (error) {
      console.error('Error fetching subscription status:', error);
    }
  };

  const handleUpgrade = async (tier: string) => {
    if (!user) {
      toast.error('Please sign in to upgrade');
      return;
    }

    setIsLoading(true);
    try {
      // This would integrate with Stripe - placeholder for now
      toast.info(`Upgrading to ${tier} plan - Stripe integration coming soon!`);
      
      // For now, simulate upgrade
      setTimeout(() => {
        toast.success(`Successfully upgraded to ${tier} plan!`);
        fetchSubscriptionStatus();
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Upgrade error:', error);
      toast.error('Failed to upgrade. Please try again.');
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <header className="border-b bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-gradient">AfriDesign AI</Link>
            <Link to="/auth">
              <Button className="gradient-nature text-white">Sign In</Button>
            </Link>
          </div>
        </header>
        
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-8">Please sign in to view premium plans and upgrade your account.</p>
          <Link to="/auth">
            <Button className="gradient-nature text-white">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentTier = subscription?.subscription_tier || 'free';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link to="/" className="text-2xl font-bold text-gradient">AfriDesign AI</Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-premium-gradient mb-4">
            Unlock Premium African AI Power
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform your business with advanced AI features designed for African entrepreneurs. 
            Create unlimited professional content and unlock powerful analytics.
          </p>
        </div>

        {/* Current Usage */}
        {subscription && (
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Your Current Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Badge className={`mb-2 ${currentTier === 'free' ? 'bg-gray-100 text-gray-800' : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'}`}>
                    {currentTier.toUpperCase()} PLAN
                  </Badge>
                  <p className="text-sm text-gray-600">Current Plan</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {subscription.monthly_posters_used}/{currentTier === 'free' ? '2' : '∞'}
                  </div>
                  <p className="text-sm text-gray-600">Posters This Month</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {subscription.monthly_invoices_used}/{currentTier === 'free' ? '2' : '∞'}
                  </div>
                  <p className="text-sm text-gray-600">Invoices This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <Card className={`relative ${currentTier === 'free' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-gray-600" />
              </div>
              <CardTitle>Free</CardTitle>
              <div className="text-3xl font-bold">R0<span className="text-lg font-normal text-gray-500">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">2 Posters per month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">2 Invoices per month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Basic templates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Standard quality exports</span>
                </li>
              </ul>
              {currentTier === 'free' ? (
                <Badge className="w-full justify-center bg-blue-100 text-blue-800">Current Plan</Badge>
              ) : (
                <Button disabled className="w-full">Free Forever</Button>
              )}
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className={`relative ${currentTier === 'pro' ? 'ring-2 ring-purple-500 bg-purple-50' : ''}`}>
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">Most Popular</Badge>
            </div>
            <CardHeader className="text-center">
              <div className="w-12 h-12 gradient-premium rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Pro</CardTitle>
              <div className="text-3xl font-bold">R99<span className="text-lg font-normal text-gray-500">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">50 Posters per month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">50 Invoices per month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Premium templates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">HD exports (no watermark)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Custom branding</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Priority support</span>
                </li>
              </ul>
              {currentTier === 'pro' ? (
                <Badge className="w-full justify-center bg-purple-100 text-purple-800">Current Plan</Badge>
              ) : (
                <Button 
                  onClick={() => handleUpgrade('pro')} 
                  disabled={isLoading}
                  className="w-full btn-premium"
                >
                  {isLoading ? 'Processing...' : 'Upgrade to Pro'}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Business Plan */}
          <Card className={`relative ${currentTier === 'business' ? 'ring-2 ring-yellow-500 bg-yellow-50' : ''}`}>
            <CardHeader className="text-center">
              <div className="w-12 h-12 gradient-sunset rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Business</CardTitle>
              <div className="text-3xl font-bold">R199<span className="text-lg font-normal text-gray-500">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Unlimited everything</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Advanced AI features</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">4K exports</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Analytics dashboard</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">API access</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Dedicated support</span>
                </li>
              </ul>
              {currentTier === 'business' ? (
                <Badge className="w-full justify-center bg-yellow-100 text-yellow-800">Current Plan</Badge>
              ) : (
                <Button 
                  onClick={() => handleUpgrade('business')} 
                  disabled={isLoading}
                  className="w-full gradient-sunset hover:opacity-90 text-white"
                >
                  {isLoading ? 'Processing...' : 'Upgrade to Business'}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Comparison */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why Upgrade to Premium?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Remove Limits</h3>
                <p className="text-sm text-gray-600">Create unlimited posters and invoices for your growing business</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Crown className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Premium Quality</h3>
                <p className="text-sm text-gray-600">HD exports without watermarks and professional branding</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Business Analytics</h3>
                <p className="text-sm text-gray-600">Track performance and optimize your marketing strategy</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Zap className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Priority Support</h3>
                <p className="text-sm text-gray-600">Get help when you need it with dedicated support</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;