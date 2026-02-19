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
Reply like a real human.

Never sound like an article or textbook.
Never give long paragraphs.
Never use numbering like 1. 2. 3.
Never use markdown symbols.

Keep responses short and easy to read.

If giving tips, keep them short and simple.
`
        },
        { role: "user", content: message }
      ],
      temperature: 0.9,
      max_tokens: 120
    })
  });

  const data = await response.json();
  let reply = data.choices?.[0]?.message?.content || "I'm here with you.";

  // ✅ CLEAN FORMAT (VERY IMPORTANT)

  reply = reply
    .replace(/\*\*/g, "")          // remove bold stars
    .replace(/\*/g, "")            // remove any star symbols
    .replace(/\d+\.\s/g, "• ")     // convert numbered lists to bullets
    .replace(/\n{3,}/g, "\n\n")    // remove extra spacing
    .trim();

  res.status(200).json({ reply });
}
