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
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
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
              "You are a calm, supportive emotional listener. Respond gently, warmly, and briefly.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    const data = await openaiRes.json();

    // 🔎 Extract reply safely
    let reply = data?.choices?.[0]?.message?.content;

    // fallback if empty
    if (!reply || reply.trim().length === 0) {
      reply = "I hear you. You are not alone in this moment.";
    }

    res.status(200).json({ reply });

  } catch (error) {
    console.error("API ERROR:", error);

    res.status(200).json({
      reply: "Take a slow breath. You are safe in this moment.",
    });
  }
}
