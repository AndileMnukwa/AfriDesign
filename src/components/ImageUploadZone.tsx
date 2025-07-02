import React, { useState, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Image, X, Edit, RotateCcw, Palette } from "lucide-react";
import { toast } from "sonner";

interface UploadedImage {
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <Card 
        className={`upload-zone border-2 border-dashed transition-all duration-300 ${
          isDragOver ? 'drag-over' : ''
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-16 h-16 gradient-african rounded-xl flex items-center justify-center mx-auto mb-6">
              <Upload className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Upload Your Custom Images
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Drag & drop images here, or click to select files. 
              Perfect for your business photos, products, or branding.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="gradient-african hover:opacity-90 text-white border-0"
                disabled={isProcessing || images.length >= maxImages}
              >
                <Image className="w-5 h-5 mr-2" />
                {isProcessing ? 'Processing...' : 'Select Images'}
              </Button>
              
              {images.length > 0 && (
                <Button
                  onClick={clearAllImages}
                  variant="outline"
                  className="hover:bg-red-50 hover:border-red-300"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={allowedTypes.join(',')}
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div className="mt-6 text-sm text-gray-500">
              <p>Supported formats: JPG, PNG, WebP</p>
              <p>Maximum size: {maxSizeInMB}MB per image</p>
              <p>Maximum images: {maxImages}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Images Grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Palette className="w-5 h-5 text-orange-600" />
              Your Images ({images.length}/{maxImages})
            </h4>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover-lift">
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
                        onClick={() => removeImage(image.id)}
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
            ))}
          </div>
        </div>
      )}

      {/* Upload Tips */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
        <CardContent className="p-6">
          <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <Image className="w-5 h-5" />
            Image Upload Tips
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <p className="font-medium mb-1">✨ Best Quality</p>
              <p>Use high-resolution images (1080p or higher) for best results</p>
            </div>
            <div>
              <p className="font-medium mb-1">🎯 Good Lighting</p>
              <p>Well-lit photos work best for AI enhancement</p>
            </div>
            <div>
              <p className="font-medium mb-1">🖼️ Clear Subjects</p>
              <p>Avoid blurry or heavily filtered images</p>
            </div>
            <div>
              <p className="font-medium mb-1">📱 Mobile Friendly</p>
              <p>Square or landscape orientation works best</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageUploadZone;