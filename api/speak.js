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
Respond like a calm, emotionally intelligent human.

• Use short paragraphs
• Use spacing between ideas
• Use bullet points when helpful
• Keep sentences clear & simple
• Avoid markdown symbols
• Do not use stars or bold formatting
• Make responses easy to read on mobile
`
        },
        { role: "user", content: message }
      ],
      temperature: 0.7
    })
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || "I'm here with you.";

  res.status(200).json({ reply });
}
