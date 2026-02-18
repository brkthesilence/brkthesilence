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
        input: `You are a calm and supportive emotional listener.
Respond warmly and briefly.

User: ${message}`,
      }),
    });

    const data = await response.json();

    // 🔍 DEBUG (remove later if you want)
    console.log("OPENAI RESPONSE:", JSON.stringify(data));

    const reply =
      data.output?.[0]?.content?.[0]?.text ||
      data.output_text ||
      "I hear you. You are not alone in this moment.";

    res.status(200).json({ reply });

  } catch (error) {
    console.error("API ERROR:", error);

    res.status(200).json({
      reply: "Take a slow breath. You are not alone.",
    });
  }
}
