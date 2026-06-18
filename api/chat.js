// Vercel Serverless Function — /api/chat
// 屏蔽 API Key：前端只调用 /api/chat，真实 Key 存在 Vercel 环境变量里

export default async function handler(req, res) {
  // 只允许 POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_URL = process.env.API_URL || 'https://api.deepseek.com/chat/completions';
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    return res.status(500).json({
      error: '服务端未配置 API_KEY，请在 Vercel 项目的 Environment Variables 中添加 API_KEY。',
    });
  }

  try {
    const { system, user, model, temperature, max_tokens } = req.body || {};

    if (!user) {
      return res.status(400).json({ error: '缺少必要参数：user' });
    }

    const messages = [];
    if (system) messages.push({ role: 'system', content: system });
    messages.push({ role: 'user', content: user });

    const upstream = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: model || 'deepseek-chat',
        messages,
        temperature: temperature ?? 0.8,
        max_tokens: max_tokens ?? 2000,
      }),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: data?.error?.message || '上游 API 调用失败',
        detail: data,
      });
    }

    const content = data?.choices?.[0]?.message?.content || '';
    return res.status(200).json({ content, raw: data });
  } catch (err) {
    return res.status(500).json({ error: '服务端处理出错', detail: String(err) });
  }
}
