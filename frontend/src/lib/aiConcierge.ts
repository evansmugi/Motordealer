/**
 * KnK Automotive Enterprise — AI Sales Concierge Engine
 * Supports Google Gemini (3.6 / 2.5 / 2.0 Flash) API, OpenAI GPT-4o API, and Offline KnK Automotive RAG Knowledge Engine.
 */

export interface AIMessage {
  sender: 'client' | 'ai' | 'agent';
  text: string;
  timestamp: string;
}

export interface AIConciergeConfig {
  provider?: 'gemini' | 'openai' | 'hybrid' | 'offline';
  geminiKey?: string;
  openaiKey?: string;
  systemPrompt?: string;
}

const KNK_SYSTEM_PROMPT = `
You are the Executive Sales Concierge for KnK Automotive Enterprise, East Africa's premier luxury vehicle marketplace and bespoke importer.
You provide courteous, highly knowledgeable, executive-level assistance to VIP clients inquiring about luxury vehicles, financing, trade-ins, and imports.

KEY KNK AUTOMOTIVE FACTS:
- Vehicle Inventory: Mercedes-Benz (S 580 4MATIC - KES 24.5M, GLE 400d - KES 18.5M), Porsche (Cayenne Turbo E-Hybrid - KES 28.0M), Range Rover Autobiography LWB (KES 32.5M), BMW M8 Competition Gran Coupe (KES 26.0M), Toyota Land Cruiser 300 / Prado TX-L.
- Asset Financing: Up to 80% financing available via partner banks (NCBA, KCB, Stanbic, Absa) at ~13% p.a. interest rate for up to 60 months.
- Trade-In Valuation: Instant preliminary assessment. Final binding valuation issued within 2 hours by senior assessors.
- Bespoke Vehicle Importation: 30-day express door-to-door delivery from UK, Japan, Australia, and South Africa with NTSA TIMS registration & KRA clearance included.
- Showroom Location: KnK Automotive Executive Complex, Nairobi HQ. Showroom viewing & home delivery test drives available.

Always maintain a professional, luxury-focused tone. Offer concrete answers and invite the client to schedule a showroom viewing or trade-in evaluation when relevant.
`;

/**
 * Generate AI Concierge Response using Gemini, OpenAI, or Smart Knowledge RAG
 */
export async function generateAIConciergeReply(
  userText: string,
  chatHistory: { sender: string; text: string }[] = [],
  config: AIConciergeConfig = {}
): Promise<string> {
  const cleanInput = userText.trim();
  if (!cleanInput) return "How may I assist you with KnK Automotive's luxury inventory today?";

  const geminiApiKey = config.geminiKey || (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY : '');
  const openaiApiKey = config.openaiKey || (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY : '');

  // 1. Try Google Gemini API
  if (geminiApiKey) {
    try {
      const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
      const payload = {
        contents: [
          { role: 'user', parts: [{ text: `${KNK_SYSTEM_PROMPT}\n\nClient Question: ${cleanInput}` }] }
        ]
      };
      const res = await fetch(geminiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (replyText) return replyText.trim();
      }
    } catch (err) {
      console.warn('Gemini API attempt failed, trying fallback:', err);
    }
  }

  // 2. Try OpenAI API
  if (openaiApiKey) {
    try {
      const payload = {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: KNK_SYSTEM_PROMPT },
          ...chatHistory.slice(-4).map(m => ({
            role: m.sender.toLowerCase().includes('concierge') ? 'assistant' : 'user',
            content: m.text
          })),
          { role: 'user', content: cleanInput }
        ],
        temperature: 0.7
      };
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        const replyText = data.choices?.[0]?.message?.content;
        if (replyText) return replyText.trim();
      }
    } catch (err) {
      console.warn('OpenAI API attempt failed, using KnK Knowledge RAG:', err);
    }
  }

  // 3. KnK Automotive Intelligent RAG Knowledge Engine (Offline Fallback)
  return generateKnKKnowledgeReply(cleanInput);
}

/**
 * Intelligent KnK Automotive Knowledge Engine
 */
function generateKnKKnowledgeReply(input: string): string {
  const lower = input.toLowerCase();

  if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) {
    if (lower.includes('mercedes') || lower.includes('s580') || lower.includes('s 580')) {
      return "The 2024 Mercedes-Benz S 580 4MATIC Flagship is priced at KES 24,500,000. It features a 4.0L V8 Biturbo engine, rear-axle steering, and executive rear seating. Asset financing is available from KES 490,000/month.";
    }
    if (lower.includes('porsche') || lower.includes('cayenne')) {
      return "The 2024 Porsche Cayenne Turbo E-Hybrid is available for KES 28,000,000. It produces 729 HP with adaptive air suspension and sports chrono package.";
    }
    if (lower.includes('range rover') || lower.includes('autobiography')) {
      return "The 2023 Range Rover Autobiography LWB is listed at KES 32,500,000. Features executive class seating, SV bespoke leather, and 4.4L Twin-Turbo V8.";
    }
    return "Our luxury inventory ranges from KES 8.5 Million to KES 35 Million+. We feature Mercedes-Benz, Porsche, Range Rover, BMW M-Series, and Toyota Land Cruiser 300s. Would you like a detailed price sheet for a specific model?";
  }

  if (lower.includes('finance') || lower.includes('loan') || lower.includes('bank') || lower.includes('monthly') || lower.includes('deposit')) {
    return "We offer up to 80% Bank Asset Financing through NCBA, KCB, Stanbic, and Absa Bank. Key parameters:\n• Deposit: 10% – 50%\n• Interest Rate: ~13% p.a.\n• Repayment Tenure: Up to 60 Months\n\nWould you like me to calculate your estimated monthly installment for a specific vehicle?";
  }

  if (lower.includes('trade') || lower.includes('swap') || lower.includes('part exchange')) {
    return "We offer instant trade-in valuations for your current vehicle! You can trade towards any vehicle in our showroom. Please click the 'Trade-In Request' button or share your car's Make, Model, Year, and Mileage here to receive an instant estimate.";
  }

  if (lower.includes('import') || lower.includes('ship') || lower.includes('uk') || lower.includes('japan')) {
    return "KnK Automotive offers 30-day bespoke vehicle importation directly from the UK, Japan, Australia, and South Africa. We handle all KRA duty clearance, NTSA TIMS registration, pre-shipment inspection, and door-to-door delivery. What vehicle spec are you looking to import?";
  }

  if (lower.includes('location') || lower.includes('address') || lower.includes('where') || lower.includes('nairobi')) {
    return "Our executive showroom is located at the KnK Automotive Complex, Nairobi HQ. We are open Monday to Saturday, 8:00 AM – 6:30 PM. Showroom appointments and home test-drives can be booked directly through our concierge.";
  }

  if (lower.includes('test drive') || lower.includes('appointment') || lower.includes('book') || lower.includes('visit')) {
    return "We would be delighted to arrange a VIP test drive for you! We offer both Showroom Appointments at Nairobi HQ and Home/Office Delivery test drives. Please share your preferred date and time, or click 'Book Test Drive'.";
  }

  return "Thank you for reaching out to KnK Automotive Enterprise. 🚘\n\nAs your Executive Sales Concierge, I can assist you with:\n1. 🏎️ **Vehicle Inventory & Pricing** (Mercedes, Porsche, Range Rover, BMW, Land Cruiser)\n2. 🏦 **Bank Asset Financing** (NCBA, KCB, Stanbic - up to 80% financing)\n3. 🔄 **Instant Vehicle Trade-In Valuations**\n4. 🚢 **30-Day Bespoke Vehicle Importation**\n5. 📅 **VIP Test Drive & Showroom Appointment Booking**\n\nHow can I help customize your automotive experience today?";
}
