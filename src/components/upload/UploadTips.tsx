import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Image } from "lucide-react";

export const UploadTips: React.FC = () => {
  return (
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
  );
};