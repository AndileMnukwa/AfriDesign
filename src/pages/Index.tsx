
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Zap, FileText, Sparkles, Users, Globe, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-african rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">AfriDesign AI</span>
          </div>
          <Button variant="outline" size="sm">
            <Users className="w-4 h-4 mr-2" />
            Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Design Your Success with{" "}
              <span className="text-gradient">AI Power</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Create professional posters and invoices in seconds. Built for African hustlers, 
              small business owners, and entrepreneurs who demand excellence.
            </p>
          </div>

          {/* Main Action Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-orange-200">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 gradient-african rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Smart Posters</CardTitle>
                <CardDescription className="text-base">
                  AI-powered marketing materials that convert customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/poster">
                  <Button className="w-full gradient-african hover:opacity-90 text-white border-0 text-lg py-6">
                    Create Poster
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-green-200">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 gradient-nature rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Pro Invoices</CardTitle>
                <CardDescription className="text-base">
                  Professional billing that builds trust and gets you paid
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/invoice">
                  <Button className="w-full gradient-nature hover:opacity-90 text-white border-0 text-lg py-6">
                    Create Invoice
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to <span className="text-gradient">Scale Your Hustle</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From street vendors to digital entrepreneurs, our AI-powered tools help you look professional and get paid faster.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 gradient-african rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Content</h3>
              <p className="text-gray-600">Smart slogans, descriptions, and copy that converts customers into sales.</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 gradient-nature rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multilingual Support</h3>
              <p className="text-gray-600">Create content in English, Swahili, Zulu, Xhosa, and other African languages.</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Downloads</h3>
              <p className="text-gray-600">High-quality PDF exports ready for printing or sharing on WhatsApp.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 gradient-african">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of African entrepreneurs who are already using AI to grow their businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/poster">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Start Creating Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 gradient-african rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">AfriDesign AI</span>
          </div>
          <p className="text-gray-400 mb-4">
            Empowering African entrepreneurs with AI-powered design tools.
          </p>
          <p className="text-sm text-gray-500">
            © 2024 AfriDesign AI. Built with love for the hustle.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
