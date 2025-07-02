
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, FileText, Image, Sparkles, Users, Zap, Globe, Star, TrendingUp, Award, Play, Upload, Palette, Download, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import AuthButton from "@/components/AuthButton";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

const Index = () => {
  const { user } = useAuth();
  const [animationStep, setAnimationStep] = useState(0);
  const [statsCount, setStatsCount] = useState({ users: 0, posters: 0, businesses: 0 });

  // Animated counter effect
  useEffect(() => {
    const targets = { users: 2847, posters: 15623, businesses: 892 };
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setStatsCount({
        users: Math.floor(targets.users * progress),
        posters: Math.floor(targets.posters * progress),
        businesses: Math.floor(targets.businesses * progress)
      });
      
      if (currentStep >= steps) clearInterval(timer);
    }, stepDuration);

    // Animation sequence
    const animationTimer = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(animationTimer);
    };
  }, []);

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

      {/* Hero Section - Enhanced with Animations */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-20 left-10 w-64 h-64 gradient-african rounded-full opacity-10 transform transition-all duration-3000 ${animationStep % 2 === 0 ? 'translate-x-4 translate-y-2' : 'translate-x-0 translate-y-0'}`}></div>
          <div className={`absolute bottom-20 right-10 w-96 h-96 gradient-nature rounded-full opacity-10 transform transition-all duration-3000 ${animationStep % 2 === 1 ? 'translate-x-4 translate-y-2' : 'translate-x-0 translate-y-0'}`}></div>
          <div className={`absolute top-1/2 left-1/2 w-72 h-72 gradient-warm rounded-full opacity-5 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-4000 ${animationStep >= 2 ? 'scale-110' : 'scale-100'}`}></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200 rounded-full px-6 py-3 mb-8 animate-fade-in">
              <Star className="w-4 h-4 text-orange-600" />
              <span className="text-orange-800 font-medium">Trusted by {statsCount.businesses}+ African Businesses</span>
              <Star className="w-4 h-4 text-orange-600" />
            </div>

            {/* Main Headline with Typewriter Effect */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              <span className="block">AI-Powered Marketing for</span>
              <span className="text-gradient block animate-fade-in">African Entrepreneurs</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Create professional marketing posters and smart invoices in seconds. 
              Built specifically for African small businesses with cultural intelligence and local market expertise.
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col lg:flex-row gap-6 justify-center items-center mb-16">
              <Link to="/poster">
                <Button size="lg" className="gradient-african hover:opacity-90 text-white border-0 text-lg px-8 py-6 rounded-xl shadow-african hover-lift">
                  <Image className="w-6 h-6 mr-3" />
                  Create Stunning Poster
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
              </Link>
              
              <Link to="/invoice">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-xl border-2 hover:bg-gray-50 hover-lift">
                  <FileText className="w-6 h-6 mr-3" />
                  Generate Smart Invoice
                </Button>
              </Link>

              {/* Interactive Demo Button */}
              <Button variant="ghost" className="text-lg px-6 py-6 rounded-xl hover:bg-orange-50 hover-lift group">
                <Play className="w-6 h-6 mr-3 group-hover:text-orange-600" />
                Watch Demo
              </Button>
            </div>

            {/* Live Statistics with Animation */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center animate-fade-in">
                <div className="text-4xl font-bold text-gradient mb-2">{statsCount.users.toLocaleString()}+</div>
                <div className="text-gray-600 font-medium">Happy Entrepreneurs</div>
              </div>
              <div className="text-center animate-fade-in">
                <div className="text-4xl font-bold text-gradient mb-2">{statsCount.posters.toLocaleString()}+</div>
                <div className="text-gray-600 font-medium">Posters Created</div>
              </div>
              <div className="text-center animate-fade-in">
                <div className="text-4xl font-bold text-gradient mb-2">{statsCount.businesses.toLocaleString()}+</div>
                <div className="text-gray-600 font-medium">Growing Businesses</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <Link to="/poster">
            <Button className="gradient-african hover:opacity-90 text-white border-0 rounded-full p-4 shadow-premium hover-lift">
              <Sparkles className="w-6 h-6" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Interactive Features Showcase */}
      <section className="py-20 bg-gradient-to-b from-white/50 to-orange-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to <span className="text-gradient">Grow Your Business</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Designed specifically for African entrepreneurs who want professional 
              marketing materials without the high costs. Powered by AI that understands Ubuntu philosophy.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center hover:shadow-xl transition-all duration-500 border-0 shadow-warm hover-lift group">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 gradient-african rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-3">AI-Powered Content</CardTitle>
                <CardDescription className="text-base">
                  Generate compelling marketing copy and professional content in seconds with African market intelligence
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-500 border-0 shadow-warm hover-lift group">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 gradient-nature rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-3">Multiple Languages</CardTitle>
                <CardDescription className="text-base">
                  Support for English, Swahili, Zulu, Xhosa, and other African languages with cultural nuance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-500 border-0 shadow-warm hover-lift group">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 gradient-premium rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-3">Mobile-First Design</CardTitle>
                <CardDescription className="text-base">
                  Optimized for mobile devices - create and share on the go with touch-friendly interface
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Feature Highlights with Icons */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4 p-4 bg-white/80 rounded-xl border border-orange-100 hover:shadow-warm transition-all hover-lift">
              <div className="w-12 h-12 gradient-african rounded-lg flex items-center justify-center">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Custom Images</div>
                <div className="text-sm text-gray-600">Upload & edit your photos</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/80 rounded-xl border border-green-100 hover:shadow-warm transition-all hover-lift">
              <div className="w-12 h-12 gradient-nature rounded-lg flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Brand Colors</div>
                <div className="text-sm text-gray-600">Auto-extract color palettes</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/80 rounded-xl border border-blue-100 hover:shadow-warm transition-all hover-lift">
              <div className="w-12 h-12 gradient-premium rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">HD Export</div>
                <div className="text-sm text-gray-600">PDF, PNG, JPG formats</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/80 rounded-xl border border-purple-100 hover:shadow-warm transition-all hover-lift">
              <div className="w-12 h-12 gradient-warm rounded-lg flex items-center justify-center">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Easy Sharing</div>
                <div className="text-sm text-gray-600">WhatsApp, social media</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Tools Section with Live Previews */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Tools for <span className="text-gradient">Your Business</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional-grade tools designed for African entrepreneurs
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Link to="/poster" className="group">
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 shadow-african hover-lift">
                {/* Preview Image Placeholder */}
                <div className="h-64 bg-gradient-to-br from-orange-100 to-amber-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-amber-500/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 gradient-african rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Image className="w-12 h-12 text-white" />
                      </div>
                      <div className="text-orange-800 font-bold text-lg">Professional Posters</div>
                      <div className="text-orange-600">AI-Generated Content</div>
                    </div>
                  </div>
                  {/* Floating Elements */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-6 left-6 w-6 h-6 bg-white/20 rounded-full animate-pulse delay-1000"></div>
                </div>

                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2 group-hover:text-orange-600 transition-colors">Poster Generator</CardTitle>
                      <CardDescription className="text-lg">AI-powered marketing posters</CardDescription>
                    </div>
                    <ArrowRight className="w-6 h-6 text-orange-600 group-hover:translate-x-2 transition-transform" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                    Create stunning marketing posters with AI-generated content. Perfect for 
                    social media, print, and WhatsApp marketing with African cultural intelligence.
                  </p>
                  
                  {/* Feature Pills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">Custom Images</span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">Brand Colors</span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">Multiple Languages</span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">HD Export</span>
                  </div>

                  <div className="flex items-center text-orange-600 group-hover:text-orange-700 font-semibold">
                    <span className="text-lg">Start Creating Now</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/invoice" className="group">
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 shadow-heritage hover-lift">
                {/* Preview Image Placeholder */}
                <div className="h-64 bg-gradient-to-br from-green-100 to-blue-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 gradient-nature rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <FileText className="w-12 h-12 text-white" />
                      </div>
                      <div className="text-green-800 font-bold text-lg">Smart Invoices</div>
                      <div className="text-green-600">Automated Calculations</div>
                    </div>
                  </div>
                  {/* Floating Elements */}
                  <div className="absolute top-4 left-4 w-8 h-8 bg-white/20 rounded-full animate-pulse delay-500"></div>
                  <div className="absolute bottom-6 right-6 w-6 h-6 bg-white/20 rounded-full animate-pulse delay-1500"></div>
                </div>

                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2 group-hover:text-green-600 transition-colors">Invoice Generator</CardTitle>
                      <CardDescription className="text-lg">Professional smart invoices</CardDescription>
                    </div>
                    <ArrowRight className="w-6 h-6 text-green-600 group-hover:translate-x-2 transition-transform" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                    Generate professional invoices with automated calculations and 
                    AI-powered payment terms. Download as PDF instantly with South African compliance.
                  </p>
                  
                  {/* Feature Pills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Auto Calculate</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Tax Compliant</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">PDF Export</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Professional</span>
                  </div>

                  <div className="flex items-center text-green-600 group-hover:text-green-700 font-semibold">
                    <span className="text-lg">Create Invoice Now</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Loved by <span className="text-gradient">African Entrepreneurs</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how AfriDesign is transforming businesses across Africa
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-warm hover-lift hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "AfriDesign helped me create professional marketing materials for my salon. 
                  The AI understands our culture and creates content that resonates with my community in Soweto."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 gradient-african rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">N</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Nomsa Mthembu</div>
                    <div className="text-gray-600 text-sm">Hair & Beauty Salon, Johannesburg</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-warm hover-lift hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "Amazing tool! I've created over 50 professional invoices and posters. 
                  The quality is outstanding and it saves me hours of work every week."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 gradient-nature rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">K</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Kwame Asante</div>
                    <div className="text-gray-600 text-sm">Tech Consultant, Accra</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-warm hover-lift hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "The multi-language support is incredible. I can create materials in both English and Swahili 
                  for my restaurant, reaching more customers in my community."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 gradient-premium rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">A</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Amina Hassan</div>
                    <div className="text-gray-600 text-sm">Restaurant Owner, Nairobi</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to <span className="text-yellow-200">Transform</span> Your Business?
            </h2>
            <p className="text-orange-100 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">
              Join {statsCount.businesses}+ African entrepreneurs who are already using AfriDesign 
              to create professional marketing materials and grow their businesses.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {!user ? (
                <>
                  <Link to="/auth">
                    <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-50 text-xl px-10 py-6 rounded-xl shadow-premium hover-lift">
                      Get Started Free
                      <ArrowRight className="w-6 h-6 ml-3" />
                    </Button>
                  </Link>
                  <Link to="/poster">
                    <Button size="lg" variant="ghost" className="text-white border-2 border-white hover:bg-white/20 text-xl px-10 py-6 rounded-xl hover-lift">
                      Try Demo
                      <Play className="w-6 h-6 ml-3" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard">
                    <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-50 text-xl px-10 py-6 rounded-xl shadow-premium hover-lift">
                      Go to Dashboard
                      <ArrowRight className="w-6 h-6 ml-3" />
                    </Button>
                  </Link>
                  <Link to="/poster">
                    <Button size="lg" variant="ghost" className="text-white border-2 border-white hover:bg-white/20 text-xl px-10 py-6 rounded-xl hover-lift">
                      Create Poster
                      <Image className="w-6 h-6 ml-3" />
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-80">
              <div className="flex items-center gap-2 text-white">
                <Award className="w-5 h-5" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <TrendingUp className="w-5 h-5" />
                <span>Growing Fast</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Globe className="w-5 h-5" />
                <span>Africa-Focused</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Users className="w-5 h-5" />
                <span>Community Driven</span>
              </div>
            </div>
          </div>
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
