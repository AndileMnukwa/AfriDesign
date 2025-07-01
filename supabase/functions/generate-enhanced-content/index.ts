
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
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY not configured')
      throw new Error('AI service configuration error - missing API key')
    }

    console.log('Calling OpenAI API with business profile:', businessProfile?.businessName)
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: 2000,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`OpenAI API error: ${response.status} - ${errorText}`)
      
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
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      console.error('Invalid response from OpenAI:', data)
      throw new Error('AI service returned invalid response')
    }

    const content = data.choices[0].message.content

    // Parse the JSON response from OpenAI
    let parsedContent
    try {
      // Extract JSON from the response (GPT sometimes adds explanatory text)
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0])
      } else {
        parsedContent = JSON.parse(content)
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content)
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
