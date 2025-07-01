
interface ImageSuggestion {
  url: string;
  alt: string;
  type: 'hero' | 'supporting' | 'icon';
  industry: string;
}

// Industry-specific image suggestions with placeholder images
const INDUSTRY_IMAGES = {
  food: {
    hero: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop',
    supporting: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    alt: 'Delicious food and dining'
  },
  retail: {
    hero: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
    supporting: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop',
    alt: 'Retail shopping experience'
  },
  tech: {
    hero: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
    supporting: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    alt: 'Technology and innovation'
  },
  beauty: {
    hero: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop',
    supporting: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop',
    alt: 'Beauty and wellness'
  },
  healthcare: {
    hero: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
    supporting: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop',
    alt: 'Healthcare and medical services'
  },
  education: {
    hero: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop',
    supporting: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
    alt: 'Education and learning'
  },
  services: {
    hero: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop',
    supporting: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    alt: 'Professional services'
  },
  construction: {
    hero: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop',
    supporting: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
    alt: 'Construction and building'
  }
};

// African cultural context images
const CULTURAL_IMAGES = {
  urban: {
    texture: 'https://images.unsplash.com/photo-1573160813959-c9157a888bb4?w=800&h=600&fit=crop',
    alt: 'Urban African cityscape'
  },
  township: {
    texture: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    alt: 'Township community'
  },
  rural: {
    texture: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=600&fit=crop',
    alt: 'African rural landscape'
  }
};

export const getIndustryImages = (industry: string): ImageSuggestion[] => {
  const industryData = INDUSTRY_IMAGES[industry as keyof typeof INDUSTRY_IMAGES] || INDUSTRY_IMAGES.services;
  
  return [
    {
      url: industryData.hero,
      alt: industryData.alt,
      type: 'hero',
      industry
    },
    {
      url: industryData.supporting,
      alt: `${industryData.alt} - supporting image`,
      type: 'supporting',
      industry
    }
  ];
};

export const getCulturalImage = (context: string) => {
  const contextData = CULTURAL_IMAGES[context as keyof typeof CULTURAL_IMAGES] || CULTURAL_IMAGES.urban;
  return contextData;
};

export const generateImagePrompt = (businessName: string, industry: string, services: string): string => {
  return `Professional ${industry} business image for ${businessName}, ${services}, high quality, modern, African context`;
};
