export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(200).json({
      reply: "What's on your mind?",
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
You are a real human-like chat companion.

Rules:
- Do NOT assume the user is sad.
- Respond naturally like a friend chatting.
- If user is happy → match their energy.
- If user is curious → be engaging.
- If user shares feelings → respond warmly.
- Keep replies short, human, and real.
- Avoid therapy-style responses.
- Avoid repeating phrases.

User message:
${message}
        `,
      }),
    });

    const data = await response.json();

    const reply =
      data.output?.[0]?.content?.[0]?.text ||
      data.output_text ||
      "Tell me more.";

    res.status(200).json({ reply });

  } catch (error) {
    res.status(200).json({
      reply: "Hmm… try saying that again 🙂",
    });
  }
}
