export default async function handler(req, res) {
  // CORS headers so browsers can call this proxy
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-proxy-secret");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Get target URL
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "Missing ?url= parameter" });
  }

  let targetUrl;
  try {
    targetUrl = decodeURIComponent(url);
    new URL(targetUrl); // validate it's a real URL
  } catch {
    return res.status(400).json({ error: "Invalid URL" });
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method === "POST" ? "POST" : "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; url-proxy/1.0)",
        ...(req.method === "POST" && { "Content-Type": req.headers["content-type"] || "application/json" }),
      },
      ...(req.method === "POST" && { body: JSON.stringify(req.body) }),
    });

    const contentType = response.headers.get("content-type") || "text/plain";
    res.setHeader("Content-Type", contentType);
    res.setHeader("X-Proxied-URL", targetUrl);
    res.status(response.status);

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch URL", details: err.message });
  }
}
