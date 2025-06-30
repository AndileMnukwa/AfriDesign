
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

interface GeneratedContent {
  title: string;
  slogan: string;
  description: string;
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
      max_tokens: 1000,
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

function createPosterPrompt(businessData: BusinessData): string {
  const languageInstruction = businessData.language !== 'english' 
    ? `Please respond in ${businessData.language} language.` 
    : '';

  return `Create marketing content for an African small business with these details:
Business Name: ${businessData.businessName}
Business Type: ${businessData.businessType || 'General Business'}
Services: ${businessData.services || 'Various services'}
Target Audience: ${businessData.targetAudience || 'Local community'}
Tone: ${businessData.tone}
${languageInstruction}

Generate content in this exact JSON format:
{
  "title": "A catchy title (max 50 characters)",
  "slogan": "A memorable slogan (max 60 characters)", 
  "description": "A compelling 2-3 sentence description that highlights the business value and appeals to the target audience"
}

Make the content culturally relevant for African markets, professional yet approachable, and include local context where appropriate. Ensure the tone matches the requested style: ${businessData.tone}.`;
}

function createInvoicePrompt(total: number, clientName: string, businessName: string): string {
  return `Create a professional payment note for a South African business invoice with these details:
Total Amount: R${total.toFixed(2)}
Client Name: ${clientName}
Business Name: ${businessName}

Generate a professional, friendly payment note that includes:
- Thank you message
- Payment terms (30 days)
- Appreciation for business relationship
- Forward-looking statement

Keep it concise but warm, suitable for South African business context. Respond with just the note text, no JSON format needed.`;
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
        const prompt = createPosterPrompt(businessData);
        console.log('Generated prompt for poster:', prompt);
        
        const aiResponse = await generateWithAnthropic(prompt);
        console.log('Anthropic response:', aiResponse);
        
        // Parse the JSON response from Anthropic
        const parsedContent = JSON.parse(aiResponse);
        response = {
          title: parsedContent.title || businessData.businessName,
          slogan: parsedContent.slogan || 'Quality service you can trust',
          description: parsedContent.description || `Experience excellent service at ${businessData.businessName}. We provide quality solutions tailored to your needs.`
        };
      } catch (error) {
        console.error('Error with Anthropic API for poster:', error);
        // Fallback to basic content if API fails
        response = {
          title: `Welcome to ${businessData.businessName}`,
          slogan: 'Quality service you can trust',
          description: `Experience excellent service at ${businessData.businessName}. We provide quality solutions tailored to your needs.`
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
