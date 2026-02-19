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
        input: `Reply in clean simple text.
Do not use stars, markdown, bold, symbols, or formatting.
Use short paragraphs or simple bullet points using hyphen (-).

User message: ${message}`
      }),
    });

    const data = await response.json();

    let reply =
      data.output?.[0]?.content?.[0]?.text ||
      "I'm here with you.";

    // ✅ remove markdown symbols just in case
    reply = reply
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/###/g, "")
      .replace(/__/g, "");

    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ reply: "Connection issue. Try again." });
  }
}
