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
Respond like a calm human friend.

STRICT RULES:
• Maximum 4–5 lines total
• Each line short and clear
• No long paragraphs
• No lecture style
• No numbered lists
• No markdown symbols

If giving tips, use 2–3 short bullet points.

Make it simple and easy to read.
`
        },
        { role: "user", content: message }
      ],
      temperature: 0.9,
      max_tokens: 60
    })
  });

  const data = await response.json();
  let reply = data.choices?.[0]?.message?.content || "I'm here with you.";

  // ✅ FORMAT & CLEAN OUTPUT
  reply = reply
    .replace(/\*\*/g, "")              // remove bold **
    .replace(/\*/g, "")                // remove *
    .replace(/\d+\.\s/g, "• ")         // convert numbers to bullets
    .replace(/•\s*/g, "\n• ")          // ensure bullet on new line
    .replace(/([.!?])\s+/g, "$1\n\n")  // add spacing after sentences
    .replace(/\n{3,}/g, "\n\n")        // remove extra spacing
    .trim();

  res.status(200).json({ reply });
}
