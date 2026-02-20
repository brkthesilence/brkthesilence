export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ reply: "" });
  }

  try {
    const { messages } = req.body || {};
    const text = messages?.[0]?.content?.trim();

    // no input → no reply
    if (!text) {
      return res.status(200).json({ reply: "" });
    }

    const openai = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: text,
        max_output_tokens: 60
      })
    });

    const data = await openai.json();

    const reply =
      data?.output?.[0]?.content?.[0]?.text ||
      "I'm here with you.";

    res.status(200).json({ reply });

  } catch (err) {
    console.error(err);
    res.status(200).json({ reply: "I'm here with you." });
  }
}
