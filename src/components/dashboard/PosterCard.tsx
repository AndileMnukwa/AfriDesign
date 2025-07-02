import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Image, Edit } from "lucide-react";
import { Link } from "react-router-dom";

interface PosterCardProps {
  poster: {
    id: string;
    business_name: string;
    title: string;
    slogan: string;
    description: string;
    content: any;
    created_at: string;
    industry?: string;
    cultural_context?: string;
    target_audience?: string;
    brand_personality?: string;
    language?: string;
  };
  onDelete: (id: string) => void;
}

const PosterCard = ({ poster, onDelete }: PosterCardProps) => {
  return (
    <Card className="bg-card-poster hover-lift shadow-african border-0 group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 gradient-african rounded-xl flex items-center justify-center shadow-warm">
            <Image className="w-6 h-6 text-white" />
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-1">Created</div>
            <div className="text-xs font-medium">{new Date(poster.created_at).toLocaleDateString()}</div>
          </div>
        </div>
        <CardTitle className="text-lg text-heritage-gradient line-clamp-1">{poster.business_name}</CardTitle>
        <CardDescription className="text-base font-medium line-clamp-1">{poster.title}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 mb-6 line-clamp-2">{poster.slogan}</p>
        <div className="flex space-x-2">
          <Link 
            to="/poster-preview" 
            state={{ 
              formData: {
                businessName: poster.business_name,
                services: poster.description,
                industry: poster.industry || 'services',
                culturalContext: poster.cultural_context || 'modern',
                targetAudience: poster.target_audience || '',
                brandPersonality: poster.brand_personality || '',
                language: poster.language || 'english'
              },
              generatedContent: poster.content || {
                headline: poster.title,
                subheading: poster.slogan,
                description: poster.description
              }
            }}
            className="flex-1"
          >
            <Button size="sm" className="btn-professional w-full">
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
          </Link>
          <Link 
            to={`/poster/edit/${poster.id}`}
            className="flex-1"
          >
            <Button size="sm" variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </Link>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={(e) => {
              e.preventDefault();
              onDelete(poster.id);
            }}
            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PosterCard;