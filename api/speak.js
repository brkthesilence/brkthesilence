export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(200).json({
      reply: "Your voice matters. Speak freely.",
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
      }),
    });

    const data = await response.json();

    console.log("OPENAI RESPONSE:", JSON.stringify(data));

    const reply =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "Thank you for sharing. Tell me more.";

    res.status(200).json({ reply });

  } catch (error) {
    console.error(error);

    res.status(200).json({
      reply: "I’m listening. Take your time.",
    });
  }
}
