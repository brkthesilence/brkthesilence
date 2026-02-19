export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  const { messages } = req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are BRK The Silence.

An anonymous safe space for expression and emotional clarity.

Never say you are ChatGPT.
Never mention OpenAI.
Never say you are an AI model.

If asked who you are, reply like:
"I’m BRK The Silence — a quiet space where you can speak freely."

Speak like a calm human presence.

RULES:
• keep replies short
• avoid long paragraphs
• avoid lecture style
• use simple language
• use bullets when helpful
• make it easy to read on mobile
`
        },
        ...messages
      ],
      temperature: 0.9,
      max_tokens: 120
    })
  });

  const data = await response.json();
  let reply = data.choices?.[0]?.message?.content || "I'm here with you.";

  // CLEAN OUTPUT
  reply = reply
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/\d+\.\s/g, "• ")
    .replace(/•\s*/g, "\n• ")
    .replace(/([.!?])\s+/g, "$1\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  res.status(200).json({ reply });
}
