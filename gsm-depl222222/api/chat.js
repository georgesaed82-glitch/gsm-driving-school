// /api/chat.js
// This runs on Vercel's server, not in the browser — so the API key here
// is never visible to anyone visiting the site. Set ANTHROPIC_API_KEY in
// your Vercel project's Environment Variables (Project Settings > Environment Variables).

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server is missing ANTHROPIC_API_KEY" });
  }

  const { system, messages } = req.body || {};
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: "messages must be an array" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: system || "",
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error || "Anthropic API error" });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Failed to reach Anthropic API" });
  }
}
