
import { supabase } from "@/integrations/supabase/client";

interface BusinessProfile {
  businessName: string;
  industry: string;
  services: string;
  targetAudience: string;
  brandPersonality: string;
  culturalContext: string;
  language: string;
}

interface EnhancedPosterContent {
  headline: string;
  subheading: string;
  description: string;
  call_to_action: string;
  visual_direction: {
    primary_colors: string[];
    secondary_colors: string[];
    typography: string;
    mood: string;
    cultural_elements: string;
    layout_style: string;
  };
  marketing_psychology: string;
  performance_score: number;
  [key: string]: any; // Add index signature for JSON compatibility
}

export const generateEnhancedPosterContent = async (profile: BusinessProfile): Promise<EnhancedPosterContent> => {
  const sophisticatedPrompt = `You are Africa's #1 brand strategist and copywriter with 15+ years creating million-rand campaigns for MTN, Shoprite, and Pick n Pay. You understand the African market deeply - from Cape Town's entrepreneurial spirit to Lagos's hustle culture, from Nairobi's tech innovation to Johannesburg's business dynamism.

Generate irresistible marketing content for ${profile.businessName} serving ${profile.targetAudience}.

Context:
- Industry: ${profile.industry}
- Services: ${profile.services}
- Brand Personality: ${profile.brandPersonality}
- Cultural Context: ${profile.culturalContext}
- Language: ${profile.language}

You must understand:
- Ubuntu philosophy of community and interconnectedness
- African entrepreneurial spirit and resilience
- Local economic challenges and opportunities
- Cultural celebrations and traditions
- Mobile-first digital behavior
- Trust-building in African communities

Return this EXACT JSON structure:
{
  "headline": "Maximum 4 words that stops scrolling dead - culturally resonant",
  "subheading": "Compelling benefit-driven tagline under 8 words with local flavor", 
  "description": "2 sentences max, 25 words total, emotion + action + community benefit",
  "call_to_action": "Urgent action phrase under 4 words in local context",
  "visual_direction": {
    "primary_colors": ["#hex1", "#hex2", "#hex3"],
    "secondary_colors": ["#hex1", "#hex2"], 
    "typography": "Font pairing with hierarchy - culturally appropriate",
    "mood": "Visual atmosphere description with African inspiration",
    "cultural_elements": "Specific African design elements and patterns",
    "layout_style": "Composition approach that resonates with target audience"
  },
  "marketing_psychology": "Why this will convert customers in African context - trust, community, value"
}

Make it culturally authentic, conversion-optimized, memorable, and respectful of African values and aesthetics. Consider local purchasing power, payment methods, and community-driven decision making.`;

  try {
    console.log('Calling generate-enhanced-content edge function with profile:', profile);
    
    const { data, error } = await supabase.functions.invoke('generate-enhanced-content', {
      body: {
        prompt: sophisticatedPrompt,
        businessProfile: profile
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(`AI service error: ${error.message}`);
    }

    if (!data) {
      console.error('No data received from edge function');
      throw new Error('AI service returned no data');
    }

    if (data.error) {
      console.error('Edge function returned error:', data.error);
      throw new Error(data.error);
    }

    if (!data.content) {
      console.error('No content in response:', data);
      throw new Error('AI service returned invalid response format');
    }

    console.log('Enhanced content generated successfully:', data.content);
    
    const content = data.content;
    
    // Calculate performance score based on content quality metrics
    const performanceScore = calculatePerformanceScore(content, profile);
    
    return {
      ...content,
      performance_score: performanceScore
    };
  } catch (error) {
    console.error('Enhanced content generation failed:', error);
    
    // Re-throw the error without any fallback content
    // This ensures users see the real issue instead of generic content
    throw error;
  }
};

const calculatePerformanceScore = (content: any, profile: BusinessProfile): number => {
  let score = 0;
  
  // Headline effectiveness (25 points)
  if (content.headline && content.headline.length <= 20) score += 25;
  
  // Call to action strength (20 points)
  if (content.call_to_action && content.call_to_action.includes('now')) score += 20;
  
  // Cultural relevance (25 points)
  if (content.visual_direction?.cultural_elements) score += 25;
  
  // Target audience alignment (15 points)
  if (content.marketing_psychology && content.marketing_psychology.includes('community')) score += 15;
  
  // Visual appeal (15 points)
  if (content.visual_direction?.primary_colors?.length >= 3) score += 15;
  
  return Math.min(score, 100);
};

export const getIndustrySpecificPromptEnhancements = (industry: string): string => {
  const industryPrompts = {
    'food': 'Focus on taste, freshness, and family gathering. Use warm colors and appetite appeal.',
    'retail': 'Emphasize value, quality, and customer satisfaction. Highlight deals and community trust.',
    'services': 'Build credibility, showcase expertise, and demonstrate results. Focus on problem-solving.',
    'tech': 'Innovation, efficiency, and future-forward thinking. Balance modernity with accessibility.',
    'beauty': 'Confidence, self-expression, and cultural beauty standards. Celebrate diversity.',
    'education': 'Growth, opportunity, and community development. Inspire and motivate.',
    'healthcare': 'Trust, care, and wellness. Professional yet approachable tone.',
    'construction': 'Reliability, strength, and craftsmanship. Emphasize quality and durability.'
  };
  
  return industryPrompts[industry as keyof typeof industryPrompts] || 
         'Focus on quality, value, and community benefit. Build trust and showcase expertise.';
};

export const getCulturalContextPrompts = (context: string): string => {
  const contextPrompts = {
    'urban': 'Fast-paced, modern, tech-savvy audience. Emphasize convenience and efficiency.',
    'rural': 'Community-focused, traditional values, word-of-mouth important. Build personal connections.',
    'township': 'Entrepreneurial spirit, resilience, community support. Authentic and relatable tone.',
    'suburban': 'Family-oriented, quality-conscious, aspirational. Balance modern and traditional values.',
    'mixed': 'Diverse audience requiring inclusive messaging. Universal values with local flavor.'
  };
  
  return contextPrompts[context as keyof typeof contextPrompts] || 
         'Inclusive messaging that resonates across different community contexts.';
};
