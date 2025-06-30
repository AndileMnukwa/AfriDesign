
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
    const shareText = `Check out my business poster: ${generatedContent.title}`;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/poster">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Edit
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-african rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">Enhanced Poster Preview</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Poster Preview */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-center">Your AI-Generated Poster</h2>
            
            <Card className="shadow-2xl overflow-hidden rounded-2xl" id="poster-content">
              <div className="gradient-african p-8 text-white text-center relative overflow-hidden">
                {/* Subtle African pattern background */}
                <div className="absolute inset-0 opacity-10">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" className="fill-current">
                    <pattern id="african-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="10" cy="10" r="2"/>
                      <path d="M5,5 L15,5 L10,15 Z"/>
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#african-pattern)"/>
                  </svg>
                </div>
                
                <div className="relative z-10">
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                    {generatedContent.title}
                  </h1>
                  <p className="text-xl md:text-2xl font-semibold mb-6 text-orange-100 leading-relaxed">
                    {generatedContent.slogan}
                  </p>
                </div>
              </div>
              
              <CardContent className="p-8 bg-white">
                <p className="text-lg text-gray-700 mb-6 leading-relaxed text-center">
                  {generatedContent.description}
                </p>
                
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-xl font-bold text-center gradient-african bg-clip-text text-transparent">
                    {generatedContent.call_to_action || generatedContent.callToAction}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Design Guidance & Actions */}
          <div className="space-y-6">
            {/* Business Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Business Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Business:</span>
                    <span className="ml-2">{formData.businessName}</span>
                  </div>
                  {formData.businessType && (
                    <div>
                      <span className="font-medium text-gray-600">Type:</span>
                      <span className="ml-2">{formData.businessType}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-600">Language:</span>
                    <span className="ml-2 capitalize">{formData.language}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Tone:</span>
                    <span className="ml-2 capitalize">{formData.tone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Visual Style Guide */}
            {generatedContent.visual_style && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Design Guide
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {generatedContent.visual_style}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Font Suggestions */}
            {generatedContent.font_suggestions && generatedContent.font_suggestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Type className="w-5 h-5" />
                    Font Pairings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="space-y-2">
                    {generatedContent.font_suggestions.map((font, index) => (
                      <Badge key={index} variant="secondary" className="mr-2 mb-2">
                        {font}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Image Keywords */}
            {generatedContent.image_keywords && generatedContent.image_keywords.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    Image Ideas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="space-y-2">
                    {generatedContent.image_keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-2">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Use these keywords to search for images on Unsplash or Canva
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button 
                onClick={handleDownload}
                className="w-full gradient-african hover:opacity-90 text-white border-0 text-lg py-6 rounded-xl"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Poster (PDF)
              </Button>

              <Button 
                onClick={handleShare}
                variant="outline"
                className="w-full text-lg py-6 rounded-xl border-2"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share via WhatsApp
              </Button>

              <Link to="/poster">
                <Button 
                  variant="ghost"
                  className="w-full text-lg py-6 rounded-xl"
                >
                  <Edit className="w-5 h-5 mr-2" />
                  Make Changes
                </Button>
              </Link>
            </div>

            {/* Success Message */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-100">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Professional Results!
              </h4>
              <p className="text-sm text-green-700 leading-relaxed">
                Your poster has been crafted by our AI brand strategist with African market expertise. 
                The content is optimized for cultural relevance and high conversion rates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterPreview;
