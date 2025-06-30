
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set')
    }

    const { type, data } = await req.json()

    let prompt = ''
    let systemMessage = ''

    if (type === 'poster') {
      systemMessage = `You are an expert marketing copywriter specializing in African small businesses. Your task is to create compelling, culturally relevant marketing content that resonates with African entrepreneurs and their communities.`
      
      prompt = `Create marketing content for a business with these details:
Business Name: ${data.businessName}
Industry/Type: ${data.businessType || 'General business'}
Services: ${data.services || 'Various services'}
Target Audience: ${data.targetAudience || 'Local community'}
Tone: ${data.tone || 'friendly'}
Language: ${data.language || 'english'}
Phone: ${data.phoneNumber || ''}

Generate:
1. A catchy, memorable business title/headline (max 8 words)
2. A compelling slogan that captures the business essence (max 12 words)
3. A brief, engaging description that highlights key benefits (2-3 sentences, max 100 words)

Make it culturally relevant, inspiring, and action-oriented. Use ${data.language} language if specified.

Return ONLY a JSON object with this exact structure:
{
  "title": "Your catchy title here",
  "slogan": "Your compelling slogan here", 
  "description": "Your engaging description here"
}`
    } else if (type === 'invoice') {
      systemMessage = `You are a professional business communication expert. Create polite, professional payment terms and notes for invoices.`
      
      prompt = `Create a professional payment note for an invoice with these details:
Total Amount: R${data.total}
Client: ${data.clientName || 'Valued Client'}
Business: ${data.businessName || 'Business'}

Generate a friendly but professional payment note (2-3 sentences) that:
- Thanks the client
- Mentions the amount due
- Includes payment terms (e.g., due within 30 days)
- Maintains a positive business relationship tone

Return ONLY a JSON object with this structure:
{
  "paymentNote": "Your professional payment note here"
}`
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        system: systemMessage,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Anthropic API error:', error)
      throw new Error(`Anthropic API error: ${response.status}`)
    }

    const result = await response.json()
    const content = result.content[0].text

    // Try to parse the JSON response
    let parsedContent
    try {
      parsedContent = JSON.parse(content)
    } catch (parseError) {
      console.error('Failed to parse Claude response as JSON:', content)
      // Fallback response
      if (type === 'poster') {
        parsedContent = {
          title: data.businessName || 'Your Business',
          slogan: 'Quality service you can trust',
          description: 'We provide excellent service to our valued customers. Contact us today to learn more about what we can do for you.'
        }
      } else {
        parsedContent = {
          paymentNote: `Thank you for your business! Payment of R${data.total} is due within 30 days. We appreciate your continued partnership.`
        }
      }
    }

    return new Response(JSON.stringify(parsedContent), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in generate-content function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
