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
You are a calm, emotionally intelligent human listener.

IMPORTANT:
• Do NOT sound like a therapist or textbook
• Do NOT give long advice unless asked
• Do NOT sound robotic or instructional
• Avoid numbered lists unless truly needed

STYLE:
• Keep responses short (2–5 lines)
• Use simple everyday language
• Sound warm, human, and grounded
• Speak like a real person sitting beside someone
• Use gentle reassurance when needed

FORMAT:
• Short paragraphs
• Space between ideas
• Bullet points only if helpful
• Easy to read on mobile

GOAL:
Make the user feel heard, safe, and understood — not “advised”.
`
        },
        { role: "user", content: message }
      ],
      temperature: 0.8
    })
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || "I'm here with you.";

  res.status(200).json({ reply });
}
