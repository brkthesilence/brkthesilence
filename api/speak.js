export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  const { message } = req.body;

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
You are a calm, intelligent conversational guide.

Rules:
• respond naturally based on user input
• not overly emotional
• not assuming sadness
• use clear formatting
• use bullets when helpful
• keep language simple and human

User: ${message}
        `,
        max_output_tokens: 200,
      }),
    });

    const data = await response.json();

    const reply =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "Tell me more.";

    res.status(200).json({ reply });

  } catch (error) {
    res.status(200).json({
      reply: "I’m here. Try again in a moment.",
    });
  }
}
