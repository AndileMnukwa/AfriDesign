
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Share2, Edit, Sparkles, Palette, Type, Image } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { exportPosterToPDF } from "@/utils/pdfExport";

const PosterPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, generatedContent } = location.state || {};

  if (!formData || !generatedContent) {
    navigate("/poster");
    return null;
  }

  const handleDownload = async () => {
    try {
      await exportPosterToPDF('poster-content', `${formData.businessName.replace(/\s+/g, '-')}-poster.pdf`);
      toast.success("Poster downloaded successfully!");
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Failed to download poster. Please try again.");
    }
  };

  const handleShare = () => {
    const shareText = `Check out my business poster: ${generatedContent.headline}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    
    if (navigator.share) {
      navigator.share({
        title: "My Business Poster",
        text: shareText,
      });
    } else {
      window.open(whatsappUrl, '_blank');
    }
  };

  const primaryColors = generatedContent.visual_direction?.primary_colors || ['#2563eb', '#7c3aed', '#059669'];
  const gradientStyle = {
    background: `linear-gradient(135deg, ${primaryColors[0]} 0%, ${primaryColors[1]} 50%, ${primaryColors[2]} 100%)`
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/poster">
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Edit
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-800">Professional Poster</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Professional Poster Preview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Professional Poster</h2>
              <p className="text-gray-600">AI-crafted for maximum impact</p>
            </div>
            
            <Card className="shadow-2xl overflow-hidden rounded-2xl border-0" id="poster-content">
              {/* Modern Header Section */}
              <div className="relative overflow-hidden" style={gradientStyle}>
                {/* Subtle geometric pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                  <svg width="100%" height="100%" viewBox="0 0 200 200" className="fill-current text-white">
                    <defs>
                      <pattern id="geometric-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.3"/>
                        <rect x="10" y="10" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#geometric-pattern)"/>
                  </svg>
                </div>
                
                <div className="relative z-10 p-12 text-center text-white">
                  <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                    {formData.industry?.charAt(0).toUpperCase() + formData.industry?.slice(1)} • {formData.culturalContext?.charAt(0).toUpperCase() + formData.culturalContext?.slice(1)}
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight tracking-tight">
                    {generatedContent.headline}
                  </h1>
                  
                  <p className="text-xl md:text-2xl font-light mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
                    {generatedContent.subheading}
                  </p>
                  
                  <div className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                    <span className="text-lg font-semibold">
                      {generatedContent.call_to_action}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Clean Content Section */}
              <CardContent className="p-12 bg-white">
                <div className="max-w-3xl mx-auto">
                  <div className="text-center mb-8">
                    <p className="text-xl text-gray-700 leading-relaxed font-light">
                      {generatedContent.description}
                    </p>
                  </div>
                  
                  {/* Business Name Section */}
                  <div className="border-t border-gray-100 pt-8">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {formData.businessName}
                      </h3>
                      <p className="text-gray-600 font-medium">
                        {formData.services}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Performance Score */}
            {generatedContent.performance_score && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Performance Score</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {generatedContent.performance_score}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${generatedContent.performance_score}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    AI-calculated conversion potential
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Business Profile */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-gray-800">Business Profile</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Industry</span>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                      {formData.industry?.charAt(0).toUpperCase() + formData.industry?.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Personality</span>
                    <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                      {formData.brandPersonality?.charAt(0).toUpperCase() + formData.brandPersonality?.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Context</span>
                    <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                      {formData.culturalContext?.charAt(0).toUpperCase() + formData.culturalContext?.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Language</span>
                    <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">
                      {formData.language?.charAt(0).toUpperCase() + formData.language?.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Color Palette */}
            {generatedContent.visual_direction?.primary_colors && (
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                    <Palette className="w-5 h-5" />
                    Color Palette
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600 mb-2 block">Primary Colors</span>
                      <div className="flex space-x-2">
                        {generatedContent.visual_direction.primary_colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 rounded-lg border border-gray-200 shadow-sm"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                    {generatedContent.visual_direction.secondary_colors && (
                      <div>
                        <span className="text-sm font-medium text-gray-600 mb-2 block">Secondary Colors</span>
                        <div className="flex space-x-2">
                          {generatedContent.visual_direction.secondary_colors.map((color, index) => (
                            <div
                              key={index}
                              className="w-8 h-8 rounded-lg border border-gray-200 shadow-sm"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Typography */}
            {generatedContent.visual_direction?.typography && (
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                    <Type className="w-5 h-5" />
                    Typography
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {generatedContent.visual_direction.typography}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleDownload}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 text-base py-6 rounded-xl font-medium shadow-lg"
              >
                <Download className="w-5 h-5 mr-2" />
                Download High-Quality PDF
              </Button>

              <Button 
                onClick={handleShare}
                variant="outline"
                className="w-full text-base py-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 font-medium"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share via WhatsApp
              </Button>

              <Link to="/poster">
                <Button 
                  variant="ghost"
                  className="w-full text-base py-6 rounded-xl hover:bg-gray-100 font-medium"
                >
                  <Edit className="w-5 h-5 mr-2" />
                  Make Changes
                </Button>
              </Link>
            </div>

            {/* AI Insight */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI Marketing Insight
              </h4>
              <p className="text-sm text-blue-700 leading-relaxed">
                {generatedContent.marketing_psychology || "This design leverages proven psychological principles to maximize engagement and conversion rates for your target audience."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterPreview;
