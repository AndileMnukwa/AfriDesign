
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Share2, Edit, Sparkles, Palette, Type, Image, Settings } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { exportPosterToPDF } from "@/utils/pdfExport";
import { getIndustryImages, getCulturalImage } from "@/services/imageService";
import ImageCustomizer from "@/components/ImageCustomizer";

const PosterPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, generatedContent } = location.state || {};

  if (!formData || !generatedContent) {
    navigate("/poster");
    return null;
  }

  // Initialize customizable state
  const initialImages = {
    hero: generatedContent.visual_direction?.hero_image || { url: '', alt: '' },
    supporting: generatedContent.visual_direction?.supporting_image || { url: '', alt: '' },
    cultural: generatedContent.visual_direction?.cultural_texture || { url: '', alt: '' }
  };

  const [selectedImages, setSelectedImages] = useState(initialImages);
  const [selectedLayout, setSelectedLayout] = useState('hero-top');
  const [showCustomizer, setShowCustomizer] = useState(false);

  const handleImageChange = (type: 'hero' | 'supporting' | 'cultural', image: { url: string; alt: string }) => {
    setSelectedImages(prev => ({
      ...prev,
      [type]: image
    }));
  };

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
  const secondaryColors = generatedContent.visual_direction?.secondary_colors || ['#f59e0b', '#ef4444'];
  
  const dynamicGradient = {
    background: `linear-gradient(135deg, ${primaryColors[0]} 0%, ${primaryColors[1]} 35%, ${primaryColors[2]} 70%, ${secondaryColors[0]} 100%)`
  };

  const renderPosterLayout = () => {
    const commonClasses = "transition-all duration-300";
    
    switch (selectedLayout) {
      case 'hero-left':
        return (
          <div className="flex min-h-[600px]">
            <div className="w-1/2 relative overflow-hidden">
              <img 
                src={selectedImages.hero.url} 
                alt={selectedImages.hero.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={dynamicGradient} className="opacity-80"></div>
            </div>
            <div className="w-1/2 p-8 flex flex-col justify-center" style={{ backgroundColor: primaryColors[0] }}>
              <div className="text-white space-y-4">
                <h1 className="text-4xl font-bold">{generatedContent.headline}</h1>
                <p className="text-xl opacity-90">{generatedContent.subheading}</p>
                <p className="text-lg opacity-80">{generatedContent.description}</p>
                <div className="pt-4">
                  <span className="bg-white text-gray-800 px-6 py-3 rounded-full font-semibold">
                    {generatedContent.call_to_action}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'split':
        return (
          <div className="min-h-[600px]" style={dynamicGradient}>
            <div className="grid md:grid-cols-2 gap-0 min-h-[600px]">
              <div className="p-8 flex flex-col justify-center text-white">
                <div className="space-y-6">
                  <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                    {formData.industry?.charAt(0).toUpperCase() + formData.industry?.slice(1)}
                  </Badge>
                  <h1 className="text-5xl font-bold leading-tight">{generatedContent.headline}</h1>
                  <p className="text-2xl font-light">{generatedContent.subheading}</p>
                  <p className="text-lg opacity-90">{generatedContent.description}</p>
                  <div className="pt-4">
                    <span className="bg-white text-gray-800 px-8 py-4 rounded-full font-bold text-lg">
                      {generatedContent.call_to_action}
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden">
                <img 
                  src={selectedImages.hero.url} 
                  alt={selectedImages.hero.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-white text-2xl font-bold">{formData.businessName}</h3>
                  <p className="text-white/90">{formData.services}</p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'overlay':
        return (
          <div className="relative min-h-[600px] overflow-hidden">
            <img 
              src={selectedImages.hero.url} 
              alt={selectedImages.hero.alt}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={dynamicGradient} className="opacity-85"></div>
            <div className="relative z-10 p-12 h-full flex flex-col justify-center items-center text-center text-white">
              <div className="max-w-4xl space-y-8">
                <Badge className="bg-white/20 text-white border-white/30 px-6 py-3 text-lg">
                  {formData.industry?.charAt(0).toUpperCase() + formData.industry?.slice(1)} • {formData.culturalContext?.charAt(0).toUpperCase() + formData.culturalContext?.slice(1)}
                </Badge>
                <h1 className="text-6xl font-bold leading-tight">{generatedContent.headline}</h1>
                <p className="text-3xl font-light">{generatedContent.subheading}</p>
                <p className="text-xl opacity-90 max-w-2xl mx-auto">{generatedContent.description}</p>
                <div className="pt-6">
                  <span className="bg-white text-gray-800 px-10 py-5 rounded-full font-bold text-xl">
                    {generatedContent.call_to_action}
                  </span>
                </div>
                <div className="pt-8 border-t border-white/30">
                  <h3 className="text-3xl font-bold">{formData.businessName}</h3>
                  <p className="text-xl opacity-90">{formData.services}</p>
                </div>
              </div>
            </div>
          </div>
        );
        
      default: // hero-top
        return (
          <div className="min-h-[600px]">
            <div className="relative overflow-hidden h-80">
              <img 
                src={selectedImages.hero.url} 
                alt={selectedImages.hero.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={dynamicGradient} className="opacity-80"></div>
              <div className="absolute inset-0 flex items-center justify-center text-center text-white p-8">
                <div className="space-y-6">
                  <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                    {formData.industry?.charAt(0).toUpperCase() + formData.industry?.slice(1)}
                  </Badge>
                  <h1 className="text-5xl font-bold">{generatedContent.headline}</h1>
                  <p className="text-2xl font-light">{generatedContent.subheading}</p>
                  <span className="inline-block bg-white text-gray-800 px-8 py-3 rounded-full font-bold">
                    {generatedContent.call_to_action}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-8" style={{ backgroundColor: secondaryColors[0] }}>
              <div className="grid md:grid-cols-2 gap-8 items-center text-white">
                <div className="space-y-4">
                  <p className="text-xl leading-relaxed">{generatedContent.description}</p>
                  <div className="pt-4">
                    <h3 className="text-2xl font-bold">{formData.businessName}</h3>
                    <p className="text-lg opacity-90">{formData.services}</p>
                  </div>
                </div>
                {selectedImages.supporting.url && (
                  <div className="relative">
                    <img 
                      src={selectedImages.supporting.url} 
                      alt={selectedImages.supporting.alt}
                      className="w-full h-64 object-cover rounded-xl shadow-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
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
          <Button
            onClick={() => setShowCustomizer(!showCustomizer)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Customize
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Professional Poster Preview */}
          <div className="lg:col-span-3 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Professional Poster</h2>
              <p className="text-gray-600">AI-crafted for maximum impact</p>
            </div>
            
            <Card className="shadow-2xl overflow-hidden rounded-2xl border-0" id="poster-content">
              {renderPosterLayout()}
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Image Customizer (Toggleable) */}
            {showCustomizer && (
              <ImageCustomizer
                industry={formData.industry || 'services'}
                culturalContext={formData.culturalContext || 'urban'}
                selectedImages={selectedImages}
                onImageChange={handleImageChange}
                onLayoutChange={setSelectedLayout}
                selectedLayout={selectedLayout}
              />
            )}

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

            {/* Color Palette */}
            {generatedContent.visual_direction?.primary_colors && (
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                    <Palette className="w-5 h-5" />
                    Active Colors
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600 mb-2 block">Primary Palette</span>
                      <div className="flex space-x-2">
                        {primaryColors.map((color, index) => (
                          <div
                            key={index}
                            className="w-10 h-10 rounded-lg border border-gray-200 shadow-sm"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600 mb-2 block">Accent Colors</span>
                      <div className="flex space-x-2">
                        {secondaryColors.map((color, index) => (
                          <div
                            key={index}
                            className="w-10 h-10 rounded-lg border border-gray-200 shadow-sm"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
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
