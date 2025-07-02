import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Image, Plus, Download } from "lucide-react";
import { Link } from "react-router-dom";

const QuickActionCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
      <Link to="/poster" className="group">
        <Card className="bg-card-poster hover-lift cursor-pointer shadow-african border-0 h-full">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 gradient-african rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-warm group-hover:scale-110 transition-transform">
              <Image className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl mb-2 text-heritage-gradient">Create New Poster</CardTitle>
            <CardDescription className="text-base">Generate AI-powered marketing posters with professional designs</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 pb-6">
            <div className="text-center">
              <Button className="btn-professional w-full py-3">
                <Plus className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>

      <Link to="/invoice" className="group">
        <Card className="bg-card-invoice hover-lift cursor-pointer shadow-heritage border-0 h-full">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 gradient-nature rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-heritage group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl mb-2 text-heritage-gradient">Create New Invoice</CardTitle>
            <CardDescription className="text-base">Generate professional invoices with automated calculations</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 pb-6">
            <div className="text-center">
              <Button className="btn-professional w-full py-3">
                <Plus className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>

      <div className="group">
        <Card className="bg-card-analytics hover-lift cursor-pointer shadow-premium border-0 h-full">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 gradient-premium rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-premium group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl mb-2 text-premium-gradient">Go Premium</CardTitle>
            <CardDescription className="text-base">Unlock unlimited creations and premium features</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 pb-6">
            <div className="text-center">
              <Button className="btn-premium w-full py-3">
                <Download className="w-4 h-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuickActionCards;