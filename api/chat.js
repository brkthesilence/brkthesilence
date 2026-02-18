export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(200).json({
      reply: "Your voice matters. I am listening.",
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
        input: message,
        max_output_tokens: 120
      }),
    });

    const data = await response.json();

    // return raw text directly
    const reply = data.output_text;

    res.status(200).json({
      reply: reply || "I hear you. You are not alone."
    });

  } catch (error) {
    console.error(error);

    res.status(200).json({
      reply: "Take a slow breath. You are not alone.",
    });
  }
}
