
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sparkles, TrendingUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { EnhancedPosterForm } from "@/components/EnhancedPosterForm";
import { generateEnhancedPosterContent } from "@/services/enhancedContentGenerator";

interface EnhancedFormData {
  businessName: string;
  industry: string;
  services: string;
  targetAudience: string;
  brandPersonality: string;
  culturalContext: string;
  language: string;
}

const PosterGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async (formData: EnhancedFormData) => {
    console.log('Starting enhanced poster generation with:', formData);
    setIsLoading(true);
    
    try {
      // Generate enhanced AI content
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
      
      // Save poster to database with enhanced metadata
      console.log('Saving poster to database...');
      const { data: posterData, error: posterError } = await supabase
        .from('posters')
        .insert({
          user_id: user.id,
          title: enhancedContent.headline,
          slogan: enhancedContent.subheading,
          description: enhancedContent.description,
          business_name: formData.businessName,
          theme: formData.brandPersonality,
          language: formData.language,
          tone: formData.brandPersonality,
          content: enhancedContent as any, // Cast to any for JSON compatibility
          visual_settings: enhancedContent.visual_direction as any, // Cast to any for JSON compatibility
          performance_score: enhancedContent.performance_score
        })
        .select()
        .single();

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
            } as any // Cast to any for JSON compatibility
          });
        console.log('Analytics tracked successfully');
      } catch (analyticsError) {
        console.warn('Analytics tracking failed (non-critical):', analyticsError);
      }

      toast.success("🎉 Your AI-powered poster is ready!");
      
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
      
      // Show specific error message based on error type
      if (error instanceof Error) {
        if (error.message.includes('Authentication')) {
          toast.error("Please sign in to generate posters");
        } else if (error.message.includes('Edge function')) {
          toast.error("AI service temporarily unavailable. Please try again.");
        } else {
          toast.error(`Generation failed: ${error.message}`);
        }
      } else {
        toast.error("Failed to generate poster. Please try again.");
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
        <EnhancedPosterForm onGenerate={handleGenerate} isLoading={isLoading} />

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
