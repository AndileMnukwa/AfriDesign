import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, FileText } from "lucide-react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  type: 'posters' | 'invoices';
}

const EmptyState = ({ type }: EmptyStateProps) => {
  const config = {
    posters: {
      icon: Image,
      title: "No posters created yet",
      linkTo: "/poster",
      buttonText: "Create Your First Poster"
    },
    invoices: {
      icon: FileText,
      title: "No invoices created yet", 
      linkTo: "/invoice",
      buttonText: "Create Your First Invoice"
    }
  };

  const { icon: Icon, title, linkTo, buttonText } = config[type];

  return (
    <Card>
      <CardContent className="text-center py-8">
        <Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">{title}</p>
        <Link to={linkTo} className="inline-block mt-4">
          <Button>{buttonText}</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default EmptyState;