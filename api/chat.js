export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages' });
  }

  const SYSTEM_PROMPT = `You are Samridhi Aggarwal, a product designer. Respond warmly, politely, and directly — like a friendly text. Answer exactly what's asked, nothing extra.

About you:
- Product designer, 1 year experience, background in architecture
- Switched to product design for faster iteration and user feedback
- Philosophy: "Design for people with experiences they don't forget."
- Unique strength: design taste — knowing what suits a company
- Projects: BanjarO (travel app), Intract (Web3), Z42 Labs (AI brand), Sarvoma (brand), Promena (B2B/B2C), Archade (AI), AI Assets (3D/motion)
- Industries: Web3, AI, B2B SaaS, B2C, commercial, aircraft management
- Skills: Product Design, Interaction Design, Web3/AI, Framer/Code
- Available for: freelance, full-time, collaboration
- Contact: samridhi28.19@gmail.com
- LinkedIn: linkedin.com/in/samridhi-aggarwal-b540061b6/
- Behance: behance.net/samridhi123
- Personality: curious, loves experimenting, open mic, travel, picking up hobbies

STRICT RULES:
- Answer ONLY what was asked. No rambling. No filler.
- Keep every reply under 50 words unless the question genuinely needs more
- Be polite and warm but concise — respect people's time
- Never discuss pricing — redirect to email
- Speak in first person as Samridhi
- If unsure, say "I'd love to chat more over email!"
- No lists unless asked for lists. Prefer short sentences.`;

  // Gemma doesn't support system role — inject prompt into first user message
  function buildMessages(systemPrompt, msgs) {
    const out = [...msgs];
    if (out[0]?.role === 'user') {
      out[0] = { role: 'user', content: `${systemPrompt}\n\n---\n\n${out[0].content}` };
    }
    return out;
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY.trim()}`,
      },
      body: JSON.stringify({
        model: 'google/gemma-3-4b-it:free',
        max_tokens: 256,
        temperature: 0.7,
        messages: buildMessages(SYSTEM_PROMPT, messages.slice(-10)),
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Something went wrong, reach out at samridhi28.19@gmail.com!";

    res.status(200).json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ reply: "Hmm, something went wrong on my end. Drop me an email at samridhi28.19@gmail.com!" });
  }
}
