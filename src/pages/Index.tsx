
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, FileText, Image, Sparkles, Users, Zap, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import AuthButton from "@/components/AuthButton";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-african rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">AfriDesign</span>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
            )}
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              AI-Powered Marketing for{" "}
              <span className="text-gradient">African Entrepreneurs</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Create professional marketing posters and smart invoices in seconds. 
              Built specifically for African small businesses and entrepreneurs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/poster">
                <Button size="lg" className="gradient-african hover:opacity-90 text-white border-0 w-full sm:w-auto">
                  <Image className="w-5 h-5 mr-2" />
                  Create Poster
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/invoice">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <FileText className="w-5 h-5 mr-2" />
                  Generate Invoice
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Grow Your Business
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Designed specifically for African entrepreneurs who want professional 
              marketing materials without the high costs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 gradient-african rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle>AI-Powered Content</CardTitle>
                <CardDescription>
                  Generate compelling marketing copy and professional content in seconds
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 gradient-nature rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Multiple Languages</CardTitle>
                <CardDescription>
                  Support for English, Swahili, Zulu, Xhosa, and other African languages
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Mobile-First Design</CardTitle>
                <CardDescription>
                  Optimized for mobile devices - create and share on the go
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Tools for Your Business
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link to="/poster" className="group">
              <Card className="hover:shadow-xl transition-all duration-300 border-2 border-transparent group-hover:border-orange-200">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 gradient-african rounded-lg flex items-center justify-center">
                      <Image className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Poster Generator</CardTitle>
                      <CardDescription>AI-powered marketing posters</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Create stunning marketing posters with AI-generated content. Perfect for 
                    social media, print, and WhatsApp marketing.
                  </p>
                  <div className="flex items-center text-orange-600 group-hover:text-orange-700">
                    <span className="font-medium">Try it now</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/invoice" className="group">
              <Card className="hover:shadow-xl transition-all duration-300 border-2 border-transparent group-hover:border-green-200">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 gradient-nature rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Invoice Generator</CardTitle>
                      <CardDescription>Professional smart invoices</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Generate professional invoices with automated calculations and 
                    AI-powered payment terms. Download as PDF instantly.
                  </p>
                  <div className="flex items-center text-green-600 group-hover:text-green-700">
                    <span className="font-medium">Create invoice</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-amber-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Grow Your Business?
          </h2>
          <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of African entrepreneurs who are already using AfriDesign 
            to create professional marketing materials.
          </p>
          {!user ? (
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-50">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-50">
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 gradient-african rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">AfriDesign</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 AfriDesign. Empowering African entrepreneurs with AI.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
