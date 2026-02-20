export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ reply: "" });
  }

  try {
    const body = req.body || {};
    const messages = body.messages || [];

    const lastMessage =
      messages[messages.length - 1]?.content?.trim();

    // ❗ prevent reply if no text
    if (!lastMessage) {
      return res.status(200).json({ reply: "" });
    }

    // ❗ ignore tiny inputs
    if (lastMessage.length < 3) {
      return res.status(200).json({ reply: "I'm here." });
    }

    const apiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `Respond with a short, calm, supportive message:\n\n${lastMessage}`,
        max_output_tokens: 120,
        temperature: 0.6
      })
    });

    if (!apiResponse.ok) {
      console.error("OpenAI error:", await apiResponse.text());
      return res.status(200).json({ reply: "I'm here with you." });
    }

    const data = await apiResponse.json();

    const reply =
      data?.output?.[0]?.content?.[0]?.text ||
      "I'm here with you.";

    res.status(200).json({ reply: reply.trim() });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(200).json({ reply: "I'm here with you." });
  }
}
