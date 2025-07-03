import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Image, RotateCcw } from "lucide-react";

interface UploadZoneProps {
  isDragOver: boolean;
  isProcessing: boolean;
  imagesCount: number;
  maxImages: number;
  allowedTypes: string[];
  maxSizeInMB: number;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearAll: () => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  isDragOver,
  isProcessing,
  imagesCount,
  maxImages,
  allowedTypes,
  maxSizeInMB,
  onDrop,
  onDragOver,
  onDragLeave,
  onFileSelect,
  onClearAll
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card 
      className={`upload-zone border-2 border-dashed transition-all duration-300 ${
        isDragOver ? 'drag-over' : ''
      }`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
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
              disabled={isProcessing || imagesCount >= maxImages}
            >
              <Image className="w-5 h-5 mr-2" />
              {isProcessing ? 'Processing...' : 'Select Images'}
            </Button>
            
            {imagesCount > 0 && (
              <Button
                onClick={onClearAll}
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
            onChange={onFileSelect}
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
  );
};