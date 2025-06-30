
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

const businessTypeTemplates = {
  salon: {
    keywords: ['beauty', 'style', 'glamour', 'transformation', 'expert', 'professional'],
    services: ['haircuts', 'styling', 'coloring', 'treatments', 'makeovers']
  },
  restaurant: {
    keywords: ['delicious', 'authentic', 'fresh', 'tasty', 'quality', 'homemade'],
    services: ['dining', 'takeaway', 'catering', 'delivery', 'meals']
  },
  electronics: {
    keywords: ['quality', 'reliable', 'latest', 'affordable', 'trusted', 'warranty'],
    services: ['repair', 'sales', 'installation', 'support', 'maintenance']
  },
  clothing: {
    keywords: ['fashion', 'stylish', 'trendy', 'quality', 'affordable', 'latest'],
    services: ['clothing', 'accessories', 'fashion', 'apparel', 'wear']
  },
  services: {
    keywords: ['professional', 'reliable', 'expert', 'quality', 'trusted', 'experienced'],
    services: ['consultation', 'support', 'solutions', 'assistance', 'expertise']
  }
};

const toneTemplates = {
  friendly: {
    titleWords: ['Welcome to', 'Your', 'Come to', 'Visit', 'Experience'],
    sloganWords: ['where you matter', 'your satisfaction is our priority', 'serving you with a smile', 'making you happy'],
    descriptors: ['friendly', 'welcoming', 'caring', 'warm', 'personal']
  },
  professional: {
    titleWords: ['Excellence at', 'Professional', 'Expert', 'Premium', 'Quality'],
    sloganWords: ['excellence delivered', 'professional service guaranteed', 'quality you can trust', 'expert solutions'],
    descriptors: ['professional', 'expert', 'reliable', 'efficient', 'quality']
  },
  bold: {
    titleWords: ['The Best', 'Ultimate', 'Number One', 'Top Choice', 'Unbeatable'],
    sloganWords: ['unbeatable quality', 'the ultimate choice', 'excellence redefined', 'setting new standards'],
    descriptors: ['outstanding', 'exceptional', 'superior', 'unmatched', 'premium']
  },
  elegant: {
    titleWords: ['Elegant', 'Sophisticated', 'Premium', 'Exclusive', 'Refined'],
    sloganWords: ['elegance redefined', 'sophisticated solutions', 'where quality meets style', 'refined excellence'],
    descriptors: ['elegant', 'sophisticated', 'refined', 'premium', 'exclusive']
  },
  urgent: {
    titleWords: ['Act Now!', 'Limited Time', 'Hurry!', 'Dont Miss Out', 'Today Only'],
    sloganWords: ['limited time offer', 'act fast', 'dont wait', 'special deal today'],
    descriptors: ['urgent', 'limited', 'exclusive', 'special', 'immediate']
  }
};

const languageTranslations = {
  swahili: {
    'Welcome to': 'Karibu',
    'Your': 'Yako',
    'Professional': 'Kitaalamu',
    'Quality': 'Ubora',
    'Call': 'Piga simu',
    'today': 'leo'
  },
  zulu: {
    'Welcome to': 'Siyakwamukela ku',
    'Your': 'Yakho',
    'Professional': 'Ochwepheshe',
    'Quality': 'Ikhwalithi',
    'Call': 'Shayela ku',
    'today': 'namuhla'
  },
  xhosa: {
    'Welcome to': 'Wamkelekile ku',
    'Your': 'Yakho',
    'Professional': 'Ochwepheshe',
    'Quality': 'Umgangatho',
    'Call': 'Biza ku',
    'today': 'namhla'
  },
  afrikaans: {
    'Welcome to': 'Welkom by',
    'Your': 'Jou',
    'Professional': 'Professionele',
    'Quality': 'Kwaliteit',
    'Call': 'Skakel',
    'today': 'vandag'
  }
};

function detectBusinessType(businessType?: string, services?: string): string {
  const text = `${businessType || ''} ${services || ''}`.toLowerCase();
  
  if (text.includes('hair') || text.includes('salon') || text.includes('beauty')) return 'salon';
  if (text.includes('food') || text.includes('restaurant') || text.includes('cafe')) return 'restaurant';
  if (text.includes('electronic') || text.includes('phone') || text.includes('computer')) return 'electronics';
  if (text.includes('cloth') || text.includes('fashion') || text.includes('apparel')) return 'clothing';
  
  return 'services';
}

function translateText(text: string, language: string): string {
  if (language === 'english') return text;
  
  const translations = languageTranslations[language as keyof typeof languageTranslations];
  if (!translations) return text;
  
  let translatedText = text;
  Object.entries(translations).forEach(([english, translated]) => {
    translatedText = translatedText.replace(new RegExp(english, 'gi'), translated);
  });
  
  return translatedText;
}

function generateTitle(businessName: string, tone: string, language: string): string {
  const toneTemplate = toneTemplates[tone as keyof typeof toneTemplates] || toneTemplates.friendly;
  const titleWord = toneTemplate.titleWords[Math.floor(Math.random() * toneTemplate.titleWords.length)];
  
  let title = `${titleWord} ${businessName}`;
  if (title.length > 50) {
    title = businessName;
  }
  
  return translateText(title, language);
}

function generateSlogan(businessData: BusinessData): string {
  const detectedType = detectBusinessType(businessData.businessType, businessData.services);
  const toneTemplate = toneTemplates[businessData.tone as keyof typeof toneTemplates] || toneTemplates.friendly;
  const typeTemplate = businessTypeTemplates[detectedType as keyof typeof businessTypeTemplates];
  
  const sloganBase = toneTemplate.sloganWords[Math.floor(Math.random() * toneTemplate.sloganWords.length)];
  const keyword = typeTemplate.keywords[Math.floor(Math.random() * typeTemplate.keywords.length)];
  
  const slogans = [
    `${keyword} ${sloganBase}`,
    `Experience ${keyword} service`,
    `Your ${keyword} solution`,
    `${keyword} service you can trust`
  ];
  
  const selectedSlogan = slogans[Math.floor(Math.random() * slogans.length)];
  return translateText(selectedSlogan, businessData.language);
}

function generateDescription(businessData: BusinessData): string {
  const detectedType = detectBusinessType(businessData.businessType, businessData.services);
  const toneTemplate = toneTemplates[businessData.tone as keyof typeof toneTemplates] || toneTemplates.friendly;
  const typeTemplate = businessTypeTemplates[detectedType as keyof typeof businessTypeTemplates];
  
  const descriptor = toneTemplate.descriptors[Math.floor(Math.random() * toneTemplate.descriptors.length)];
  const keyword = typeTemplate.keywords[Math.floor(Math.random() * typeTemplate.keywords.length)];
  const service = typeTemplate.services[Math.floor(Math.random() * typeTemplate.services.length)];
  
  const descriptions = [
    `We provide ${descriptor} ${service} that exceed your expectations. Our team is dedicated to delivering ${keyword} results that make a difference in your life.`,
    `Experience the difference with our ${keyword} approach to ${service}. We combine expertise with ${descriptor} service to ensure your complete satisfaction.`,
    `At ${businessData.businessName}, we specialize in ${descriptor} ${service} tailored to your needs. Our commitment to ${keyword} excellence sets us apart.`,
    `Discover ${keyword} ${service} delivered with a ${descriptor} touch. We take pride in providing solutions that truly matter to our valued customers.`
  ];
  
  let description = descriptions[Math.floor(Math.random() * descriptions.length)];
  
  // Add target audience context if provided
  if (businessData.targetAudience) {
    description += ` Perfect for ${businessData.targetAudience.toLowerCase()}.`;
  }
  
  return translateText(description, businessData.language);
}

export function generateLocalContent(businessData: BusinessData): GeneratedContent {
  return {
    title: generateTitle(businessData.businessName, businessData.tone, businessData.language),
    slogan: generateSlogan(businessData),
    description: generateDescription(businessData)
  };
}

export function generateInvoiceNote(total: number, clientName: string, businessName: string): string {
  const notes = [
    `Thank you for choosing ${businessName}! Payment of R${total.toFixed(2)} is due within 30 days. We appreciate your business and look forward to serving you again.`,
    `We're grateful for your trust in ${businessName}. Please remit payment of R${total.toFixed(2)} within 30 days of this invoice date. Thank you for your continued partnership.`,
    `${clientName}, thank you for your business! The total amount of R${total.toFixed(2)} is payable within 30 days. We value our relationship and appreciate your prompt payment.`,
    `Payment terms: R${total.toFixed(2)} due within 30 days. Thank you for choosing ${businessName} - your satisfaction is our priority and we look forward to future collaboration.`
  ];
  
  return notes[Math.floor(Math.random() * notes.length)];
}
