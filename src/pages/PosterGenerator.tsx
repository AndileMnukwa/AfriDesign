
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sparkles, TrendingUp, Crown } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { EnhancedPosterForm } from "@/components/EnhancedPosterForm";
import { generateEnhancedPosterContent } from "@/services/enhancedContentGenerator";
import { useAuth } from "@/contexts/AuthContext";

interface EnhancedFormData {
  businessName: string;
  industry: string;
  services: string;
  targetAudience: string;
  brandPersonality: string;
  culturalContext: string;
  language: string;
  customImages: any[];
}

const PosterGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [editData, setEditData] = useState<EnhancedFormData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    if (id && user) {
      fetchPosterForEdit(id);
    }
  }, [id, user]);

  const fetchPosterForEdit = async (posterId: string) => {
    try {
      const { data, error } = await supabase
        .from('posters')
        .select('*')
        .eq('id', posterId)
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching poster:', error);
        toast.error('Failed to load poster for editing');
        navigate('/dashboard');
        return;
      }

      if (data) {
        const formData: EnhancedFormData = {
          businessName: data.business_name,
          industry: data.industry || 'services',
          services: data.description,
          targetAudience: data.target_audience || '',
          brandPersonality: data.brand_personality || 'professional',
          culturalContext: data.cultural_context || 'modern',
          language: data.language || 'english',
          customImages: Array.isArray(data.custom_images) ? data.custom_images : []
        };
        setEditData(formData);
        setIsEditMode(true);
      }
    } catch (error) {
      console.error('Error fetching poster for edit:', error);
      toast.error('Failed to load poster for editing');
      navigate('/dashboard');
    }
  };

  const checkUsageLimits = async () => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking usage limits:', error);
        return true; // Allow on error to avoid blocking users
      }

      if (!data || data.subscription_tier === 'free') {
        const monthlyPosters = data?.monthly_posters_used || 0;
        if (monthlyPosters >= 2) {
          toast.error('Free plan limit reached! Upgrade to Pro for unlimited posters.');
          navigate('/premium');
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error checking usage limits:', error);
      return true; // Allow on error
    }
  };

  const updateUsageCount = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscriber data:', error);
        return;
      }

      const currentUsage = data?.monthly_posters_used || 0;

      await supabase
        .from('subscribers')
        .upsert({
          user_id: user.id,
          email: user.email || '',
          monthly_posters_used: currentUsage + 1,
          subscription_tier: data?.subscription_tier || 'free'
        });
    } catch (error) {
      console.error('Error updating usage count:', error);
    }
  };

  const handleGenerate = async (formData: EnhancedFormData) => {
    console.log('Starting enhanced poster generation with:', formData);
    setIsLoading(true);
    
    try {
      // Check usage limits for free users (skip for edit mode)
      if (!isEditMode) {
        const canProceed = await checkUsageLimits();
        if (!canProceed) {
          setIsLoading(false);
          return;
        }
      }
      // Generate enhanced AI content - no fallbacks, pure AI
      console.log('Calling generateEnhancedPosterContent...');
      const enhancedContent = await generateEnhancedPosterContent(formData);
      console.log('Enhanced AI content generated successfully:', enhancedContent);
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('User authentication error:', userError);
        throw new Error('Authentication required to save poster');
      }
      
      if (!user) {
        console.error('No authenticated user found');
        throw new Error('Please sign in to save your poster');
      }

      console.log('Authenticated user found:', user.id);
      
      // Save or update poster to database with enhanced metadata
      console.log(isEditMode ? 'Updating poster in database...' : 'Saving poster to database...');
      
      const posterPayload = {
        user_id: user.id,
        title: enhancedContent.headline,
        slogan: enhancedContent.subheading,
        description: enhancedContent.description,
        business_name: formData.businessName,
        industry: formData.industry,
        target_audience: formData.targetAudience,
        brand_personality: formData.brandPersonality,
        cultural_context: formData.culturalContext,
        theme: formData.brandPersonality,
        language: formData.language,
        tone: formData.brandPersonality,
        content: enhancedContent as any,
        visual_settings: enhancedContent.visual_direction as any,
        performance_score: enhancedContent.performance_score,
        custom_images: formData.customImages as any
      };

      let posterData;
      let posterError;

      if (isEditMode && id) {
        // Update existing poster
        const { data, error } = await supabase
          .from('posters')
          .update(posterPayload)
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single();
        posterData = data;
        posterError = error;
      } else {
        // Create new poster
        const { data, error } = await supabase
          .from('posters')
          .insert(posterPayload)
          .select()
          .single();
        posterData = data;
        posterError = error;
      }

      if (posterError) {
        console.error('Database insert error:', posterError);
        throw new Error(`Failed to save poster: ${posterError.message}`);
      }

      console.log('Poster saved successfully:', posterData);

      // Update user profile with business intelligence
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          business_name: formData.businessName,
          industry: formData.industry,
          target_audience: formData.targetAudience,
          brand_personality: formData.brandPersonality,
          cultural_context: formData.culturalContext,
          preferred_language: formData.language
        });

      if (profileError) {
        console.warn('Profile update error (non-critical):', profileError);
      }

      // Track analytics event
      try {
        await supabase
          .from('poster_analytics')
          .insert({
            poster_id: posterData.id,
            user_id: user.id,
            event_type: 'generate',
            event_data: {
              industry: formData.industry,
              cultural_context: formData.culturalContext,
              performance_score: enhancedContent.performance_score
            } as any
          });
      console.log('Analytics tracked successfully');
      } catch (analyticsError) {
        console.warn('Analytics tracking failed (non-critical):', analyticsError);
      }

      // Update usage count for new posters only
      if (!isEditMode) {
        await updateUsageCount();
      }

      toast.success(isEditMode ? "🎉 Your poster has been updated!" : "🎉 Your AI-powered poster is ready!");
      
      // Navigate to enhanced preview
      navigate("/poster-preview", {
        state: {
          formData,
          generatedContent: enhancedContent,
          posterId: posterData.id
        }
      });
    } catch (error) {
      console.error('Enhanced poster generation error:', error);
      
      // Show specific error messages without any fallback content
      if (error instanceof Error) {
        if (error.message.includes('Authentication')) {
          toast.error("Please sign in to generate posters");
        } else if (error.message.includes('authentication failed')) {
          toast.error("AI service configuration error. Please contact support.");
        } else if (error.message.includes('rate limit')) {
          toast.error("AI service is busy. Please try again in a moment.");
        } else if (error.message.includes('temporarily unavailable')) {
          toast.error("AI service is temporarily unavailable. Please try again.");
        } else if (error.message.includes('malformed content')) {
          toast.error("AI service returned invalid content. Please try again.");
        } else {
          toast.error(`Generation failed: ${error.message}`);
        }
      } else {
        toast.error("Failed to generate poster. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Enhanced Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-african rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">AfriDesign AI Studio</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-blue-50 px-3 py-1 rounded-full">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">AI-Powered</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Create Stunning Posters with African AI Intelligence
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our AI understands African markets, Ubuntu philosophy, and cultural nuances to create 
            posters that authentically connect with your community and drive real business results.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-sm font-medium">15+ Years Market Expertise</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-sm">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="text-sm font-medium">Culturally Intelligent</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-sm">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span className="text-sm font-medium">Conversion Optimized</span>
            </div>
          </div>
        </div>

        {/* Enhanced Form */}
        <EnhancedPosterForm 
          onGenerate={handleGenerate} 
          isLoading={isLoading} 
          initialData={editData}
          isEditMode={isEditMode}
        />

        {/* Features Showcase */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <Card className="shadow-warm">
            <CardHeader className="text-center">
              <div className="w-12 h-12 gradient-sunset rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <CardTitle>AI Brand Strategist</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Our AI acts like a senior African brand strategist with 15+ years of experience 
                creating million-rand campaigns for major brands.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-heritage">
            <CardHeader className="text-center">
              <div className="w-12 h-12 gradient-heritage rounded-lg mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Performance Prediction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Each design gets an AI-calculated performance score based on conversion 
                psychology and African market insights.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-african">
            <CardHeader className="text-center">
              <div className="w-12 h-12 gradient-african rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Cultural Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Deep understanding of Ubuntu philosophy, local purchasing behavior, 
                and community-driven decision making.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PosterGenerator;
