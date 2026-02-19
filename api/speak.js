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
          content:
            "Reply in clean simple text. No stars, no markdown, no symbols. Use short paragraphs and bullet points when helpful."
        },
        { role: "user", content: message }
      ],
      temperature: 0.7
    })
  });

  const data = await response.json();
  res.status(200).json({ reply: data.choices[0].message.content });
}
