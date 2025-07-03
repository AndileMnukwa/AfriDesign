import React from 'react';
import { Palette } from "lucide-react";
import { ImageCard } from './ImageCard';

interface UploadedImage {
  id: string;
  file: File;
  url: string;
  name: string;
  size: number;
}

interface ImageGridProps {
  images: UploadedImage[];
  maxImages: number;
  onRemoveImage: (id: string) => void;
}

export const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  maxImages,
  onRemoveImage
}) => {
  if (images.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Palette className="w-5 h-5 text-orange-600" />
          Your Images ({images.length}/{maxImages})
        </h4>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            onRemove={onRemoveImage}
          />
        ))}
      </div>
    </div>
  );
};