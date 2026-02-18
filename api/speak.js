export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(200).json({
      reply: "What’s on your mind?",
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
You are a calm, real, human-like conversational partner.

RULES:
- Do NOT assume the user is sad.
- Respond based on the emotion in the message.
- If happy → respond positively.
- If confused → respond clearly.
- If emotional → respond gently.
- If random text → respond normally.
- Keep replies short and natural.
- Sound like a real person, not a therapist.

User message:
${message}
        `,
      }),
    });

    const data = await response.json();

    const reply =
      data.output?.[0]?.content?.[0]?.text ||
      data.output_text ||
      "I’m listening.";

    res.status(200).json({ reply });

  } catch (error) {
    res.status(200).json({
      reply: "Something went wrong. Try again.",
    });
  }
}
