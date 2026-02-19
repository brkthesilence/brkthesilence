export default async function handler(req, res) {

if (req.method !== "POST") {
  return res.status(405).json({ reply: "Method not allowed" });
}

try {

const { message } = req.body;

const response = await fetch("https://api.openai.com/v1/chat/completions", {
method: "POST",
headers: {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
},
body: JSON.stringify({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "system",
      content:
        "Respond like a calm, supportive human. Clear paragraphs. Bullet points when useful. No markdown symbols. No bold stars. Keep it natural and easy to read."
    },
    { role: "user", content: message }
  ],
  temperature: 0.7
})
});

const data = await response.json();

res.status(200).json({
  reply: data.choices[0].message.content
});

} catch (error) {
res.status(200).json({
  reply: "I’m here with you. Tell me more."
});
}
}
