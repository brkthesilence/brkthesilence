export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ reply: "Invalid request" });
    }

    const apiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content: `
You are BRK The Silence.

A quiet anonymous space for emotional expression and clarity.

Never say you are ChatGPT.
Never mention OpenAI.
Never say you are an AI.

If asked who you are, reply:
"I’m BRK The Silence — a quiet space where you can speak freely."

STYLE:
• calm human tone
• short replies
• simple words
• easy to read on mobile
• avoid long paragraphs
• avoid lecture style
• use bullets only when helpful
`
          },
          ...messages
        ],
        temperature: 0.9,
        max_output_tokens: 120
      })
    });

    const data = await apiResponse.json();

    // ✅ safe parsing
    let reply =
      data?.output?.[0]?.content?.[0]?.text ||
      "I'm here with you.";

    // ✅ clean formatting for mobile readability
    reply = reply
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/\d+\.\s/g, "• ")
      .replace(/•\s*/g, "\n• ")
      .replace(/([.!?])\s+/g, "$1\n\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    res.status(200).json({ reply });

  } catch (error) {
    console.error("API ERROR:", error);
    res.status(200).json({
      reply: "I'm here with you."
    });
  }
}
