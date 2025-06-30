
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, Share2, Edit, Sparkles } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PosterPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, generatedContent } = location.state || {};

  if (!formData || !generatedContent) {
    navigate("/poster");
    return null;
  }

  const handleDownload = () => {
    toast.success("Poster downloaded successfully!");
    // In real app, this would generate and download the PDF
  };

  const handleShare = () => {
    const shareText = `Check out my business poster: ${generatedContent.title}`;
    if (navigator.share) {
      navigator.share({
        title: "My Business Poster",
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Poster details copied to clipboard!");
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
              <span className="text-xl font-bold text-gradient">Poster Preview</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Poster Preview */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Your AI-Generated Poster</h2>
            
            <Card className="shadow-2xl overflow-hidden">
              <div className="gradient-african p-8 text-white text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {generatedContent.title}
                </h1>
                <p className="text-xl md:text-2xl font-semibold mb-6 text-orange-100">
                  {generatedContent.slogan}
                </p>
              </div>
              
              <CardContent className="p-8 bg-white">
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  {generatedContent.description}
                </p>
                
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-xl font-bold text-center gradient-african bg-clip-text text-transparent">
                    {generatedContent.callToAction}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions & Details */}
          <div className="space-y-6">
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

            <div className="space-y-4">
              <Button 
                onClick={handleDownload}
                className="w-full gradient-african hover:opacity-90 text-white border-0 text-lg py-6"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Poster (PDF)
              </Button>

              <Button 
                onClick={handleShare}
                variant="outline"
                className="w-full text-lg py-6"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share via WhatsApp
              </Button>

              <Link to="/poster">
                <Button 
                  variant="ghost"
                  className="w-full text-lg py-6"
                >
                  <Edit className="w-5 h-5 mr-2" />
                  Make Changes
                </Button>
              </Link>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">🎉 Great Job!</h4>
              <p className="text-sm text-green-700">
                Your poster looks professional and engaging. This AI-generated content 
                is optimized to attract customers and drive sales for your business.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterPreview;
