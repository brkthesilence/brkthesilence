export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  const { message } = req.body;

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
You are a calm, grounded human listener.

DO NOT sound like:
- a teacher
- a therapist
- a self-help article
- a motivational speaker
- an instruction manual

DO NOT give long advice.
DO NOT give numbered steps.
DO NOT lecture.

Speak like a real human having a quiet conversation.

STYLE:

• keep responses short
• use simple everyday language
• short paragraphs
• leave space between thoughts
• easy to read quickly
• mobile-friendly

If guidance is needed, share it gently in 1–3 short points.

GOAL:

Make the user feel understood.
Make the message feel human.
Make it readable in seconds.
`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.9,
      max_tokens: 120
    })
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || "I'm here with you.";

  res.status(200).json({ reply });
}
