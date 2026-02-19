export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(200).json({
      reply: "I'm listening. Share whatever is on your mind.",
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `
You are a thoughtful and intelligent conversational assistant.

Respond naturally based on the user's message.

IMPORTANT:
• If user is happy → respond positively.
• If user asks questions → give helpful answers.
• If user shares problems → respond supportively.
• If user asks for advice → give structured guidance.
• Use headings and bullet points when useful.
• Keep responses clear and easy to read.
• Do NOT assume the user is sad.
• Do NOT repeat generic emotional lines.
`,
      }),
    });

    const data = await response.json();

    const reply =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "I’m here with you. Tell me more.";

    res.status(200).json({ reply });

  } catch (error) {
    res.status(200).json({
      reply: "Something went wrong. Please try again.",
    });
  }
}
