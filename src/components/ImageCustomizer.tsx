
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Image, Upload, RotateCcw, Palette } from "lucide-react";
import { getIndustryImages, getCulturalImage, INDUSTRY_IMAGES, CULTURAL_IMAGES } from "@/services/imageService";

interface ImageCustomizerProps {
  industry: string;
  culturalContext: string;
  selectedImages: {
    hero: { url: string; alt: string };
    supporting: { url: string; alt: string };
    cultural: { url: string; alt: string };
  };
  onImageChange: (type: 'hero' | 'supporting' | 'cultural', image: { url: string; alt: string }) => void;
  onLayoutChange: (layout: string) => void;
  selectedLayout: string;
}

const ImageCustomizer = ({ 
  industry, 
  culturalContext, 
  selectedImages, 
  onImageChange, 
  onLayoutChange,
  selectedLayout 
}: ImageCustomizerProps) => {
  
  const industryImageOptions = getIndustryImages(industry);
  const culturalOptions = Object.entries(CULTURAL_IMAGES).map(([key, value]) => ({
    key,
    ...value
  }));
  
  const layoutOptions = [
    { id: 'hero-left', name: 'Hero Left', description: 'Large image on left side' },
    { id: 'hero-top', name: 'Hero Top', description: 'Full-width image header' },
    { id: 'split', name: 'Split Layout', description: 'Balanced image and text' },
    { id: 'overlay', name: 'Text Overlay', description: 'Text over background image' }
  ];

  return (
    <div className="space-y-6">
      {/* Layout Selection */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
            <Palette className="w-5 h-5" />
            Layout Style
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-3">
            {layoutOptions.map((layout) => (
              <Button
                key={layout.id}
                variant={selectedLayout === layout.id ? "default" : "outline"}
                className={`h-auto p-3 flex flex-col items-start text-left ${
                  selectedLayout === layout.id 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                    : "hover:bg-gray-50"
                }`}
                onClick={() => onLayoutChange(layout.id)}
              >
                <span className="font-medium text-sm">{layout.name}</span>
                <span className="text-xs opacity-80">{layout.description}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hero Image Selection */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
            <Image className="w-5 h-5" />
            Hero Image
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(INDUSTRY_IMAGES).map(([key, value]) => (
                <div
                  key={key}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImages.hero.url === value.hero ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => onImageChange('hero', { url: value.hero, alt: value.alt })}
                >
                  <img 
                    src={value.hero} 
                    alt={value.alt}
                    className="w-full h-16 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Badge variant="secondary" className="text-xs bg-white/90 text-gray-800">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supporting Image Selection */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
            <Image className="w-5 h-5" />
            Supporting Image
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(INDUSTRY_IMAGES).map(([key, value]) => (
              <div
                key={key}
                className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImages.supporting.url === value.supporting ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onImageChange('supporting', { url: value.supporting, alt: `${value.alt} - supporting image` })}
              >
                <img 
                  src={value.supporting} 
                  alt={value.alt}
                  className="w-full h-16 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Badge variant="secondary" className="text-xs bg-white/90 text-gray-800">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cultural Background */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
            <Image className="w-5 h-5" />
            Cultural Background
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {culturalOptions.map((option) => (
              <div
                key={option.key}
                className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImages.cultural.url === option.texture ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onImageChange('cultural', { url: option.texture, alt: option.alt })}
              >
                <img 
                  src={option.texture} 
                  alt={option.alt}
                  className="w-full h-12 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Badge variant="secondary" className="text-xs bg-white/90 text-gray-800">
                    {option.key.charAt(0).toUpperCase() + option.key.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reset Button */}
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => {
          const defaultImages = getIndustryImages(industry);
          const defaultCultural = getCulturalImage(culturalContext);
          onImageChange('hero', { url: defaultImages[0]?.url, alt: defaultImages[0]?.alt });
          onImageChange('supporting', { url: defaultImages[1]?.url, alt: defaultImages[1]?.alt });
          onImageChange('cultural', { url: defaultCultural.texture, alt: defaultCultural.alt });
          onLayoutChange('hero-top');
        }}
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset to Defaults
      </Button>
    </div>
  );
};

export default ImageCustomizer;
