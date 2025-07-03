import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, X } from "lucide-react";

interface UploadedImage {
  id: string;
  file: File;
  url: string;
  name: string;
  size: number;
}

interface ImageCardProps {
  image: UploadedImage;
  onRemove: (id: string) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, onRemove }) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover-lift">
      <div className="relative">
        <img
          src={image.url}
          alt={image.name}
          className="w-full h-32 object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onRemove(image.id)}
              className="bg-red-500/90 hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      <CardContent className="p-3">
        <p className="text-sm font-medium text-gray-800 truncate">{image.name}</p>
        <p className="text-xs text-gray-500">{formatFileSize(image.size)}</p>
      </CardContent>
    </Card>
  );
};