
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BusinessProfile {
  businessName: string;
  industry: string;
  services: string;
  targetAudience: string;
  brandPersonality: string;
  culturalContext: string;
  language: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt, businessProfile } = await req.json()
    
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY not configured')
      throw new Error('AI service configuration error - missing API key')
    }

    console.log('Calling Google Gemini API with business profile:', businessProfile?.businessName)
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Gemini API error: ${response.status} - ${errorText}`)
      
      if (response.status === 401) {
        throw new Error('AI service authentication failed - please check API key configuration')
      } else if (response.status === 429) {
        throw new Error('AI service rate limit exceeded - please try again in a moment')
      } else if (response.status >= 500) {
        throw new Error('AI service temporarily unavailable - please try again')
      } else {
        throw new Error(`AI service error: ${response.status}`)
      }
    }

    const data = await response.json()
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0] || !data.candidates[0].content.parts[0].text) {
      console.error('Invalid response from Gemini:', data)
      throw new Error('AI service returned invalid response')
    }

    const content = data.candidates[0].content.parts[0].text

    // Parse the JSON response from Gemini
    let parsedContent
    try {
      // Extract JSON from the response (Gemini sometimes adds explanatory text)
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0])
      } else {
        parsedContent = JSON.parse(content)
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', content)
      throw new Error('AI service returned malformed content - please try again')
    }

    // Add industry-specific enhancements
    if (businessProfile?.industry) {
      parsedContent = await enhanceWithIndustryContext(parsedContent, businessProfile)
    }

    console.log('Successfully generated enhanced content for:', businessProfile?.businessName)

    return new Response(
      JSON.stringify({ content: parsedContent }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )

  } catch (error) {
    console.error('Enhanced content generation error:', error)
    
    // Return specific error without fallback content
    return new Response(
      JSON.stringify({ 
        error: error.message || 'AI content generation failed'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  }
})

async function enhanceWithIndustryContext(content: any, profile: BusinessProfile) {
  // Industry-specific color palettes
  const industryColors = {
    'food': ['#FF6B35', '#F29E4C', '#EFEA5A'],
    'retail': ['#16537e', '#f39c12', '#e74c3c'],
    'tech': ['#3498db', '#9b59b6', '#1abc9c'],
    'beauty': ['#e91e63', '#ff9800', '#673ab7'],
    'healthcare': ['#2196f3', '#4caf50', '#00bcd4'],
    'education': ['#ff5722', '#607d8b', '#795548']
  }

  if (industryColors[profile.industry as keyof typeof industryColors]) {
    content.visual_direction.primary_colors = industryColors[profile.industry as keyof typeof industryColors]
  }

  // Cultural context enhancements
  if (profile.culturalContext === 'township') {
    content.visual_direction.cultural_elements += ' Bold street art influences, vibrant community colors'
  } else if (profile.culturalContext === 'rural') {
    content.visual_direction.cultural_elements += ' Traditional patterns, earth tones, nature elements'
  }

  return content
}
