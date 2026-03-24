# URL Proxy — Vercel

A simple serverless proxy that fetches any URL server-side, bypassing browser CORS restrictions. Protected by a secret key.

---

## 🚀 Deploy to Vercel

### Option A — Vercel CLI (fastest)
```bash
npm i -g vercel
cd url-proxy
vercel
```

### Option B — GitHub + Vercel Dashboard
1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo
3. Click **Deploy**

---

## 🔑 Set your secret key

After deploying, go to your project in the Vercel dashboard:

**Settings → Environment Variables → Add**

| Name | Value |
|------|-------|
| `PROXY_SECRET` | `some-secret-string-you-choose` |

Then **redeploy** for the variable to take effect.

---

## 📡 How to use it

Make a GET request to your proxy with the target URL as a query parameter:

```
GET https://your-proxy.vercel.app/api/proxy?url=https://example.com
```

Always include your secret in the header:
```
x-proxy-secret: your-secret-here
```

### JavaScript example
```javascript
const response = await fetch(
  "https://your-proxy.vercel.app/api/proxy?url=" + encodeURIComponent("https://example.com"),
  {
    headers: {
      "x-proxy-secret": "your-secret-here"
    }
  }
);
const text = await response.text();
console.log(text);
```

---

## ⚠️ Notes
- The proxy forwards GET and POST requests
- Binary content (images, files) is supported
- Max execution time is 15 seconds (Vercel hobby plan limit)
