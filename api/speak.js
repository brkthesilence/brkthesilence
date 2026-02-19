export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: message
      })
    });

    const data = await response.json();

    const reply =
      data.output?.[0]?.content?.[0]?.text ||
      "I'm here with you. Tell me more.";

    res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    res.status(200).json({
      reply: "I’m here with you. Tell me what’s on your mind."
    });
  }
}
