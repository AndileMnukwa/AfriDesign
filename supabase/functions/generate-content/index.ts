
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

interface BusinessData {
  businessName: string;
  businessType?: string;
  services?: string;
  targetAudience?: string;
  phoneNumber?: string;
  language: string;
  tone: string;
}

interface EnhancedGeneratedContent {
  title: string;
  slogan: string;
  description: string;
  visual_style: string;
  image_keywords: string[];
  font_suggestions: string[];
  call_to_action?: string;
}

async function generateWithAnthropic(prompt: string): Promise<string> {
  const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
  
  if (!anthropicApiKey) {
    throw new Error('Anthropic API key not configured');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicApiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Anthropic API error:', response.status, errorText);
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

function createEnhancedPosterPrompt(businessData: BusinessData): string {
  const languageInstruction = businessData.language !== 'english' 
    ? `Please respond in ${businessData.language} language for all text content.` 
    : '';

  return `You are a senior African brand strategist and copywriter tasked with generating high-conversion, Canva-style poster content for an African business.

Business Overview:
- Name: ${businessData.businessName}
- Type: ${businessData.businessType || 'General Business'}
- Services: ${businessData.services || 'Various services'}
- Target Audience: ${businessData.targetAudience || 'Local community and professionals'}
- Brand Tone: ${businessData.tone}
${languageInstruction}

Creative Goals:
- The copy should immediately connect with working-class African families and professionals
- Emphasize trust, quality, and cultural pride
- Inspire action (ordering, calling, sharing) with clear emotional cues
- Bring cultural richness and pride subtly into the tone
- Design style should reflect aesthetically bold, mobile-first, Instagrammable posters

Generate content in this EXACT JSON format (no additional text before or after):
{
  "title": "Powerful short headline (3–5 words max that immediately grabs attention)",
  "slogan": "Memorable subheading that conveys warmth, trust, and cultural connection",
  "description": "1–2 sentence marketing copy (max 30 words), emotionally resonant and specific to the business value",
  "visual_style": "Detailed creative direction for Canva-style layout: specify colors (warm African palette like terracotta, ochre, gold, forest green), typography style (bold but warm), composition (curved elements, rounded buttons), and overall mood",
  "image_keywords": ["5-7 specific image search terms for African business context, food imagery, or cultural elements"],
  "font_suggestions": ["3-4 Google Fonts or Canva-style font pairings that work well for African brand aesthetics"]
}

Make the content culturally relevant for African markets, professional yet approachable, and ensure the visual style direction is detailed enough for implementation in a design tool. Focus on ${businessData.tone} tone while maintaining cultural authenticity.`;
}

function createInvoicePrompt(total: number, clientName: string, businessName: string): string {
  return `Create a professional payment note for a South African business invoice with these details:
Total Amount: R${total.toFixed(2)}
Client Name: ${clientName}
Business Name: ${businessName}

Generate a professional, friendly payment note that includes:
- Thank you message with African warmth
- Payment terms (30 days)
- Appreciation for business relationship
- Forward-looking statement about future collaboration

Keep it concise but warm, suitable for South African business context. Respond with just the note text, no JSON format needed.`;
}

function generateEnhancedPosterFallback(businessData: BusinessData): EnhancedGeneratedContent {
  const businessType = businessData.businessType?.toLowerCase() || '';
  const isFood = businessType.includes('food') || businessType.includes('restaurant') || businessType.includes('kitchen') || businessType.includes('catering');
  
  if (isFood) {
    return {
      title: `Taste of ${businessData.businessName}`,
      slogan: "Authentic flavors, made with love",
      description: `Experience traditional African cuisine crafted with care. Fresh ingredients, family recipes, unforgettable taste.`,
      visual_style: "Warm color palette with terracotta (#CC7A41), golden yellow (#F4A460), and forest green (#2D5939). Use curved design elements, rounded corners, and bold but welcoming typography. Include African patterns subtly in background. Mobile-first vertical layout with clear hierarchy.",
      image_keywords: ["african food", "traditional cooking", "family meal", "fresh ingredients", "cultural cuisine", "home cooking", "spices"],
      font_suggestions: ["Poppins + Merriweather", "Open Sans + Playfair Display", "Nunito + Lora", "Inter + Crimson Text"]
    };
  }
  
  return {
    title: `Welcome to ${businessData.businessName}`,
    slogan: "Quality service you can trust",
    description: `Experience excellent service that puts your needs first. Professional, reliable, and proudly African.`,
    visual_style: "Professional color scheme with deep blue (#1E3A8A), warm gold (#D97706), and earth brown (#A3692C). Clean, modern design with subtle African geometric patterns. Bold headers with softer body text. Mobile-optimized vertical composition.",
    image_keywords: ["professional service", "african business", "quality work", "trust", "community", "excellence", "local business"],
    font_suggestions: ["Roboto + Open Sans", "Lato + Source Sans Pro", "Montserrat + Nunito", "Inter + System UI"]
  };
}

function generateInvoiceNoteFallback(total: number, clientName: string, businessName: string): string {
  const notes = [
    `Thank you for choosing ${businessName}! Payment of R${total.toFixed(2)} is due within 30 days. We appreciate your business and look forward to serving you again.`,
    `We're grateful for your trust in ${businessName}. Please remit payment of R${total.toFixed(2)} within 30 days of this invoice date. Thank you for your continued partnership.`,
    `${clientName}, thank you for your business! The total amount of R${total.toFixed(2)} is payable within 30 days. We value our relationship and appreciate your prompt payment.`,
    `Payment terms: R${total.toFixed(2)} due within 30 days. Thank you for choosing ${businessName} - your satisfaction is our priority and we look forward to future collaboration.`
  ];
  
  return notes[Math.floor(Math.random() * notes.length)];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { type, data } = await req.json()
    console.log('Request received:', { type, data });

    let response;

    if (type === 'poster') {
      const businessData: BusinessData = {
        businessName: data.businessName,
        businessType: data.businessType,
        services: data.services,
        targetAudience: data.targetAudience,
        phoneNumber: data.phoneNumber,
        language: data.language || 'english',
        tone: data.tone || 'friendly'
      };

      try {
        const prompt = createEnhancedPosterPrompt(businessData);
        console.log('Generated enhanced prompt for poster:', prompt);
        
        const aiResponse = await generateWithAnthropic(prompt);
        console.log('Anthropic response:', aiResponse);
        
        // Parse the JSON response from Anthropic
        const parsedContent = JSON.parse(aiResponse);
        
        // Ensure all required fields are present
        response = {
          title: parsedContent.title || `Welcome to ${businessData.businessName}`,
          slogan: parsedContent.slogan || 'Quality service you can trust',
          description: parsedContent.description || `Experience excellent service at ${businessData.businessName}. We provide quality solutions tailored to your needs.`,
          visual_style: parsedContent.visual_style || 'Modern, clean design with warm colors and professional typography',
          image_keywords: Array.isArray(parsedContent.image_keywords) ? parsedContent.image_keywords : ['business', 'professional', 'quality'],
          font_suggestions: Array.isArray(parsedContent.font_suggestions) ? parsedContent.font_suggestions : ['Open Sans', 'Roboto'],
          call_to_action: `Call ${businessData.phoneNumber || "us"} today!`
        };
      } catch (error) {
        console.error('Error with Anthropic API for poster:', error);
        // Use enhanced fallback with design guidance
        const fallbackContent = generateEnhancedPosterFallback(businessData);
        response = {
          ...fallbackContent,
          call_to_action: `Call ${businessData.phoneNumber || "us"} today!`
        };
      }
    } else if (type === 'invoice') {
      try {
        const prompt = createInvoicePrompt(
          data.total,
          data.clientName || 'Valued Client',
          data.businessName || 'Business'
        );
        console.log('Generated prompt for invoice:', prompt);
        
        const aiResponse = await generateWithAnthropic(prompt);
        console.log('Anthropic response for invoice:', aiResponse);
        
        response = { paymentNote: aiResponse.trim() };
      } catch (error) {
        console.error('Error with Anthropic API for invoice:', error);
        // Fallback to pre-written note if API fails
        const paymentNote = generateInvoiceNoteFallback(
          data.total,
          data.clientName || 'Valued Client',
          data.businessName || 'Business'
        );
        response = { paymentNote };
      }
    } else {
      throw new Error('Invalid type specified');
    }

    console.log('Final response:', response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in generate-content function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
