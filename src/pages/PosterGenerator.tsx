
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Sparkles, Wand2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const PosterGenerator = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    services: "",
    targetAudience: "",
    phoneNumber: "",
    language: "english",
    tone: "friendly"
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    // Validation
    if (!formData.businessName || !formData.services) {
      toast.error("Please fill in business name and services");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Call the AI generation edge function
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: 'poster',
          data: formData
        }
      });

      if (error) {
        console.error('AI generation error:', error);
        toast.error("Failed to generate poster content. Please try again.");
        return;
      }

      // Save to database if user is logged in
      if (user) {
        const { error: saveError } = await supabase
          .from('posters')
          .insert({
            user_id: user.id,
            business_name: formData.businessName,
            title: data.title,
            slogan: data.slogan,
            description: data.description,
            phone_number: formData.phoneNumber,
            language: formData.language,
            tone: formData.tone
          });

        if (saveError) {
          console.error('Save error:', saveError);
          toast.error("Content generated but failed to save");
        } else {
          toast.success("Poster generated and saved successfully!");
        }
      } else {
        toast.success("Poster content generated successfully!");
      }
      
      // Navigate to preview with form data and AI-generated content
      navigate("/poster-preview", { 
        state: { 
          formData,
          generatedContent: {
            title: data.title,
            slogan: data.slogan,
            description: data.description,
            callToAction: `Call ${formData.phoneNumber || "us"} today!`
          }
        }
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast.error("Failed to generate poster content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-african rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">Smart Poster Generator</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl text-gradient">Tell Us About Your Business</CardTitle>
            <CardDescription className="text-lg">
              Our AI will create compelling poster content that attracts customers and drives sales.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="businessName" className="text-sm font-medium">Business Name *</Label>
                <Input
                  id="businessName"
                  placeholder="e.g., Sarah's Salon, Joe's Electronics"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange("businessName", e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="businessType" className="text-sm font-medium">Type of Business</Label>
                <Input
                  id="businessType"
                  placeholder="e.g., Hair Salon, Electronics Shop, Food Delivery"
                  value={formData.businessType}
                  onChange={(e) => handleInputChange("businessType", e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="services" className="text-sm font-medium">Services or Products *</Label>
                <Textarea
                  id="services"
                  placeholder="Describe what you sell or offer. Be specific - this helps our AI create better content."
                  value={formData.services}
                  onChange={(e) => handleInputChange("services", e.target.value)}
                  className="mt-2 min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="targetAudience" className="text-sm font-medium">Target Customers</Label>
                <Input
                  id="targetAudience"
                  placeholder="e.g., Working professionals, Students, Families"
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange("targetAudience", e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="e.g., +27 123 456 789"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Language</Label>
                  <Select value={formData.language} onValueChange={(value) => handleInputChange("language", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="swahili">Swahili</SelectItem>
                      <SelectItem value="zulu">Zulu</SelectItem>
                      <SelectItem value="xhosa">Xhosa</SelectItem>
                      <SelectItem value="afrikaans">Afrikaans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Tone</Label>
                  <Select value={formData.tone} onValueChange={(value) => handleInputChange("tone", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="bold">Bold & Energetic</SelectItem>
                      <SelectItem value="elegant">Elegant</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full gradient-african hover:opacity-90 text-white border-0 text-lg py-6"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating Your Poster...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  Generate AI Poster Content
                </>
              )}
            </Button>

            <p className="text-sm text-gray-500 text-center">
              Our AI will analyze your business and create compelling poster content in seconds.
              {!user && (
                <span className="block mt-2 text-amber-600">
                  💡 Sign in to save your generated posters to your dashboard
                </span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PosterGenerator;
