
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.content[0].text

    // Parse the JSON response from Claude
    let parsedContent
    try {
      // Extract JSON from the response (Claude sometimes adds explanatory text)
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0])
      } else {
        parsedContent = JSON.parse(content)
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', content)
      throw new Error('Invalid JSON response from AI')
    }

    // Add industry-specific enhancements
    if (businessProfile.industry) {
      parsedContent = await enhanceWithIndustryContext(parsedContent, businessProfile)
    }

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
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate enhanced content',
        fallback: getFallbackContent(req.body?.businessProfile)
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

function getFallbackContent(profile?: BusinessProfile) {
  return {
    headline: profile?.businessName || "Your Business",
    subheading: "Quality Service You Can Trust",
    description: "Experience the best service in your community. We're here to serve you with excellence and African hospitality.",
    call_to_action: "Contact Us Now",
    visual_direction: {
      primary_colors: ["#FF6B35", "#F29E4C", "#EFEA5A"],
      secondary_colors: ["#2C3E50", "#FFFFFF"],
      typography: "Bold headlines with readable body text",
      mood: "Professional yet approachable",
      cultural_elements: "Warm African-inspired patterns",
      layout_style: "Clean and community-focused"
    },
    marketing_psychology: "Builds trust through community values and quality promise",
    performance_score: 75
  }
}
