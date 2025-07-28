
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Target, Palette, Globe, Image, Crown } from "lucide-react";
import { toast } from "sonner";
import ImageUploadZone from "@/components/ImageUploadZone";

interface UploadedImage {
  id: string;
  file: File;
  url: string;
  name: string;
  size: number;
}

interface EnhancedFormData {
  businessName: string;
  industry: string;
  services: string;
  targetAudience: string;
  brandPersonality: string;
  culturalContext: string;
  language: string;
  customImages: UploadedImage[];
}

interface EnhancedPosterFormProps {
  onGenerate: (formData: EnhancedFormData) => void;
  isLoading: boolean;
  initialData?: EnhancedFormData | null;
  isEditMode?: boolean;
}

const AFRICAN_INDUSTRIES = [
  { value: 'food', label: 'Food & Catering', icon: '🍽️' },
  { value: 'retail', label: 'Retail & Shopping', icon: '🛍️' },
  { value: 'services', label: 'Professional Services', icon: '⚖️' },
  { value: 'tech', label: 'Technology & Digital', icon: '💻' },
  { value: 'beauty', label: 'Beauty & Wellness', icon: '💄' },
  { value: 'education', label: 'Education & Training', icon: '📚' },
  { value: 'healthcare', label: 'Healthcare & Medical', icon: '🏥' },
  { value: 'construction', label: 'Construction & Trade', icon: '🔨' },
  { value: 'transport', label: 'Transport & Logistics', icon: '🚛' },
  { value: 'agriculture', label: 'Agriculture & Farming', icon: '🌾' },
];

const BRAND_PERSONALITIES = [
  { value: 'professional', label: 'Professional & Trustworthy', color: 'bg-blue-100 text-blue-800' },
  { value: 'friendly', label: 'Friendly & Approachable', color: 'bg-green-100 text-green-800' },
  { value: 'bold', label: 'Bold & Energetic', color: 'bg-orange-100 text-orange-800' },
  { value: 'elegant', label: 'Elegant & Sophisticated', color: 'bg-purple-100 text-purple-800' },
  { value: 'vibrant', label: 'Vibrant & Creative', color: 'bg-pink-100 text-pink-800' },
  { value: 'authentic', label: 'Authentic & Community-Focused', color: 'bg-yellow-100 text-yellow-800' },
];

const CULTURAL_CONTEXTS = [
  { value: 'urban', label: 'Urban Metro (Cape Town, Joburg, Lagos)', icon: '🏙️' },
  { value: 'township', label: 'Township Communities', icon: '🏘️' },
  { value: 'rural', label: 'Rural & Traditional', icon: '🌾' },
  { value: 'suburban', label: 'Suburban Middle-Class', icon: '🏡' },
  { value: 'mixed', label: 'Mixed Communities', icon: '🌍' },
];

const AFRICAN_LANGUAGES = [
  { value: 'english', label: 'English', flag: '🇿🇦' },
  { value: 'swahili', label: 'Swahili', flag: '🇰🇪' },
  { value: 'zulu', label: 'isiZulu', flag: '🇿🇦' },
  { value: 'xhosa', label: 'isiXhosa', flag: '🇿🇦' },
  { value: 'afrikaans', label: 'Afrikaans', flag: '🇿🇦' },
  { value: 'yoruba', label: 'Yoruba', flag: '🇳🇬' },
  { value: 'hausa', label: 'Hausa', flag: '🇳🇬' },
  { value: 'amharic', label: 'Amharic', flag: '🇪🇹' },
];

export const EnhancedPosterForm: React.FC<EnhancedPosterFormProps> = ({ 
  onGenerate, 
  isLoading, 
  initialData, 
  isEditMode = false 
}) => {
  const [formData, setFormData] = useState<EnhancedFormData>({
    businessName: '',
    industry: '',
    services: '',
    targetAudience: '',
    brandPersonality: '',
    culturalContext: '',
    language: 'english',
    customImages: []
  });

  const [formStep, setFormStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Update form data when initialData prop changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (field: keyof EnhancedFormData, value: string | UploadedImage[]) => {
    // Input sanitization for string fields
    let sanitizedValue = value;
    if (typeof value === 'string') {
      // Remove potential XSS characters and limit length
      sanitizedValue = value
        .replace(/[<>\"'&]/g, '') // Remove potential XSS chars
        .substring(0, field === 'services' ? 500 : 200); // Limit length based on field
    }
    
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleImagesChange = (images: UploadedImage[]) => {
    handleInputChange('customImages', images);
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    if (!formData.businessName.trim()) errors.push('Business name is required');
    if (!formData.industry) errors.push('Please select your industry');
    if (!formData.services.trim()) errors.push('Please describe your services');
    if (!formData.targetAudience.trim()) errors.push('Please describe your target audience');
    if (!formData.brandPersonality) errors.push('Please select your brand personality');
    if (!formData.culturalContext) errors.push('Please select your cultural context');
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    toast.success("Generating your AI-powered poster with African expertise!");
    onGenerate(formData);
  };

  const selectedIndustry = AFRICAN_INDUSTRIES.find(ind => ind.value === formData.industry);
  const selectedPersonality = BRAND_PERSONALITIES.find(p => p.value === formData.brandPersonality);
  const selectedContext = CULTURAL_CONTEXTS.find(c => c.value === formData.culturalContext);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
              formStep >= step ? 'gradient-african text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {step}
            </div>
            {step < 3 && <div className={`w-12 h-1 mx-2 ${formStep > step ? 'gradient-african' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <Card className="shadow-african">
        <CardHeader className="gradient-african text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Sparkles className="w-6 h-6" />
            AI-Powered African Business Intelligence
          </CardTitle>
          <p className="text-orange-100">
            Tell us about your business and we'll create culturally-intelligent marketing content
          </p>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Business Basics */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold">Business Information</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="businessName" className="text-sm font-medium">
                    Business Name *
                  </Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    placeholder="e.g., Mama's Kitchen, TechHub Solutions"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="industry" className="text-sm font-medium">
                    Industry *
                  </Label>
                  <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {AFRICAN_INDUSTRIES.map((industry) => (
                        <SelectItem key={industry.value} value={industry.value}>
                          <span className="flex items-center gap-2">
                            <span>{industry.icon}</span>
                            {industry.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="services" className="text-sm font-medium">
                  Products/Services *
                </Label>
                <Textarea
                  id="services"
                  value={formData.services}
                  onChange={(e) => handleInputChange('services', e.target.value)}
                  placeholder="Describe what you offer (e.g., Traditional African cuisine, mobile app development, hair braiding and styling)"
                  className="mt-2 min-h-[80px]"
                />
              </div>

              <div>
                <Label htmlFor="targetAudience" className="text-sm font-medium">
                  Target Audience *
                </Label>
                <Textarea
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  placeholder="Who are your ideal customers? (e.g., young professionals in Sandton, families in Soweto, small business owners)"
                  className="mt-2 min-h-[80px]"
                />
              </div>
            </div>

            {/* Step 2: Custom Images */}
            <div className="space-y-6 border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Image className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold">Custom Images & Branding</h3>
                <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium Feature
                </Badge>
              </div>

              {/* Image Upload Zone */}
              <ImageUploadZone 
                onImagesChange={handleImagesChange}
                maxImages={5}
              />
            </div>

            {/* Step 3: Brand & Culture */}
            <div className="space-y-6 border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold">Brand Personality & Culture</h3>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Brand Personality *
                </Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {BRAND_PERSONALITIES.map((personality) => (
                    <div
                      key={personality.value}
                      onClick={() => handleInputChange('brandPersonality', personality.value)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.brandPersonality === personality.value
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <Badge className={personality.color}>{personality.label}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Cultural Context *
                </Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {CULTURAL_CONTEXTS.map((context) => (
                    <div
                      key={context.value}
                      onClick={() => handleInputChange('culturalContext', context.value)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.culturalContext === context.value
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{context.icon}</span>
                        <span className="font-medium">{context.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="language" className="text-sm font-medium">
                  Primary Language
                </Label>
                <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AFRICAN_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          {lang.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="text-red-800 font-medium mb-2">Please fix the following:</h4>
                <ul className="text-red-700 text-sm space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Selected Options Summary */}
            {(selectedIndustry || selectedPersonality || selectedContext || formData.customImages.length > 0) && (
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-6">
                <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Your Business Profile
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedIndustry && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {selectedIndustry.icon} {selectedIndustry.label}
                    </Badge>
                  )}
                  {selectedPersonality && (
                    <Badge variant="secondary" className={selectedPersonality.color}>
                      {selectedPersonality.label}
                    </Badge>
                  )}
                  {selectedContext && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {selectedContext.icon} {selectedContext.label}
                    </Badge>
                  )}
                  {formData.customImages.length > 0 && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      <Image className="w-3 h-3 mr-1" />
                      {formData.customImages.length} Custom Image{formData.customImages.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full gradient-african hover:opacity-90 text-white text-lg py-6 rounded-xl shadow-african hover-lift"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  {isEditMode ? 'Updating Your Poster...' : 'Creating Your AI-Powered Poster...'}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5" />
                  {isEditMode ? 'Update Poster with AI' : 'Generate Professional Poster with AI'}
                  {formData.customImages.length > 0 && (
                    <Badge className="bg-white/20 text-white border-white/30 ml-2">
                      + Custom Images
                    </Badge>
                  )}
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* AI Intelligence Notice */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 gradient-heritage rounded-lg flex items-center justify-center flex-shrink-0">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-purple-800 mb-2">African Business Intelligence</h4>
            <p className="text-purple-700 text-sm leading-relaxed">
              Our AI combines 15+ years of African market expertise with cutting-edge technology. 
              We understand Ubuntu philosophy, local purchasing behavior, and cultural nuances to create 
              posters that truly resonate with your community and drive conversions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
