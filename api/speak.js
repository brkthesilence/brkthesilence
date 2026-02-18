export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { message } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a calm, non-judgmental emotional listener. Respond gently and briefly.",
          },
          { role: "user", content: message },
        ],
        max_tokens: 150,
      }),
    });

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "I am here with you. You are not alone.";

    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({
      reply: "Take a slow breath. You are safe in this moment.",
    });
  }
}
