import React, { useState, useCallback } from 'react';
import { toast } from "sonner";
import { UploadZone } from './upload/UploadZone';
import { ImageGrid } from './upload/ImageGrid';
import { UploadTips } from './upload/UploadTips';

export interface UploadedImage {
  id: string;
  file: File;
  url: string;
  name: string;
  size: number;
}

interface ImageUploadZoneProps {
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  allowedTypes?: string[];
  maxSizeInMB?: number;
}

const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({
  onImagesChange,
  maxImages = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxSizeInMB = 10
}) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFiles = useCallback(async (files: FileList) => {
    setIsProcessing(true);
    const newImages: UploadedImage[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported image format`);
        continue;
      }
      
      // Validate file size
      if (file.size > maxSizeInMB * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is ${maxSizeInMB}MB`);
        continue;
      }
      
      // Check if we've reached the maximum
      if (images.length + newImages.length >= maxImages) {
        toast.error(`Maximum ${maxImages} images allowed`);
        break;
      }
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      const uploadedImage: UploadedImage = {
        id: Date.now().toString() + i,
        file,
        url,
        name: file.name,
        size: file.size
      };
      
      newImages.push(uploadedImage);
    }
    
    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onImagesChange(updatedImages);
    setIsProcessing(false);
    
    if (newImages.length > 0) {
      toast.success(`${newImages.length} image(s) uploaded successfully!`);
    }
  }, [images, allowedTypes, maxSizeInMB, maxImages, onImagesChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  const removeImage = useCallback((id: string) => {
    const imageToRemove = images.find(img => img.id === id);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.url);
    }
    
    const updatedImages = images.filter(img => img.id !== id);
    setImages(updatedImages);
    onImagesChange(updatedImages);
    toast.success('Image removed');
  }, [images, onImagesChange]);

  const clearAllImages = useCallback(() => {
    images.forEach(img => URL.revokeObjectURL(img.url));
    setImages([]);
    onImagesChange([]);
    toast.success('All images cleared');
  }, [images, onImagesChange]);

  return (
    <div className="space-y-6">
      <UploadZone
        isDragOver={isDragOver}
        isProcessing={isProcessing}
        imagesCount={images.length}
        maxImages={maxImages}
        allowedTypes={allowedTypes}
        maxSizeInMB={maxSizeInMB}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onFileSelect={handleFileSelect}
        onClearAll={clearAllImages}
      />
      
      <ImageGrid
        images={images}
        maxImages={maxImages}
        onRemoveImage={removeImage}
      />
      
      <UploadTips />
    </div>
  );
};

export default ImageUploadZone;